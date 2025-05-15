import { create } from "zustand";
import { Folder } from "@/models/FolderModel";
import {
    GetFolderById,
    GetFoldersByParentFolderId
} from "../services/FolderServices";

interface FolderStore {
    // Estados
    folderCache: Record<string, Folder>;
    currentFolders: Folder[];
    currentFolder: Folder | null;
    breadCrumbPath: Folder[];
    isLoading: boolean;
    error: string | null;

    // Cargar carpetas
    fetchFolder: (id: string) => Promise<Folder | null>;
    fetchRootFolder: () => Promise<Folder[]>;
    fetchSubFolders: (parentFolder: Folder) => Promise<Folder[]>;
    buildBreadCrumbPath: (currentFolderId: string | null) => Promise<Folder[]>;

    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

    // Utilidades
    clearError: () => void;
    resetState: () => void;
}

export const useFolderStore = create<FolderStore>((set, get) => ({
    folderCache: {},
    currentFolders: [],
    currentFolder: null,
    breadCrumbPath: [],
    isLoading: false,
    error: null,

    fetchFolder: async (id: string) => {
        if (get().folderCache[id]) return get().folderCache[id]; // If folder is in cache, return it
        try{
            set({ isLoading: true });
            const folder = await GetFolderById(id);
            if (folder) {
                // Actualizamos el cache
                set({ folderCache: { ...get().folderCache, [folder.id]: folder}});
                return folder;
            }
            return null;
        }catch(error){
            console.error("Error fetching folder:", error);
            set({ error: "Error fetching folder" });
            return null;
        }finally{
            set({ isLoading: false });
        }
    },
    fetchRootFolder: async () => {
        try{
            set({ isLoading: true });

            const allFolder = await GetFoldersByParentFolderId(""); // Pasamos un string vacío ya que null no funciona

            const folderRoot = allFolder.filter(folder =>
                folder.parentFolderID === null || 
                folder.parentFolderID === "" || 
                folder.parentFolderID === undefined
            );
            // Actualizar la cache con las carpetas raiz
            const newCache = {...get().folderCache};
            folderRoot.forEach(folder => {
                newCache[folder.id] = folder;
            });
            set({ 
                folderCache: newCache,
                currentFolders: folderRoot // Actualizar currentFolders con las carpetas raíz
            });
            return folderRoot;
        }catch(error){
            console.error("Error fetching root folder:", error);
            set({ error: "Error fetching root folder" });
            return [];
        }finally{
            set({ isLoading: false });
        }
    },
    fetchSubFolders: async (parentFolder: Folder) => {
        try{
            set({ isLoading: true });
            
            if (!parentFolder.subFolders || parentFolder.subFolders.length === 0) {
                set({ currentFolders: [] });
                return [];
            }

            // Cargar cada subcarpeta
            const subFolderPromises = parentFolder.subFolders.map(id => get().fetchFolder(id));
            const subFolders = await Promise.all(subFolderPromises);
            
            // Filtrar carpetas nulas y actualizar el estado currentFolders
            const validSubFolders = subFolders.filter((folder): folder is Folder => folder !== null);
            set({ currentFolders: validSubFolders });
            
            return validSubFolders;
        } catch (error) {
            console.error("Error fetching subfolders:", error);
            set({ error: "Error fetching subfolders" });
            return [];
        } finally {
            set({ isLoading: false });
        }
    },
    buildBreadCrumbPath: async (currentFolderId: string | null) => {
        if (!currentFolderId) {
            set({ breadCrumbPath: [] });
            return []; // Si no hay Id devolvemos un array vacío
        }

        const path: Folder[] =[];
        let currentId: string | null = currentFolderId;

        // Construir el path recursivamente desde la carpeta actual hasta las raiz
        while (currentId !== null) {
            // Intentar obtener la carpeta del cache primero
            const cachedFolder: Folder | undefined = get().folderCache[currentId];
            let folder: Folder | null = cachedFolder || null;

            // Si no esta en cache, cargamos la carpeta
            if (!folder) {
                folder = await get().fetchFolder(currentId);
                if (!folder) break; // Si no se encuentra la carpeta, salimos del bucle
            }

            path.unshift(folder); // Agregar la carpeta al inicio del path
            currentId = folder.parentFolderID; // Actualizar el Id actual para la siguiente iteración
        }

        // Actualizar el estado breadCrumbPath con el path construido
        set({ breadCrumbPath: path });
        
        return path; // Devolver el path completo
    },

    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | null) => set({ error }),

    // Utilidades
    clearError: () => set({ error: null }),
    resetState: () => set({
        folderCache: {},
        currentFolders: [],
        currentFolder: null,
        breadCrumbPath: [],
        isLoading: false,
        error: null
    }),
}));