import { create } from "zustand";
import { FolderModel } from "@/models/FolderModel";
import {
    GetFolderById,
    GetFoldersByParentFolderId
} from "../services/FolderServices";

interface FolderStore {
    // Estados
    folderCache: Record<string, FolderModel>;   // Almacenar las carpetas en cache (solo las que se han cargado)
    currentFolders: FolderModel[];              // Almacenar las carpetas actuales (las que se muestran)
    currentFolder: FolderModel | null;          // Almacenar la carpeta actual (si estamos dentro de una)
    breadCrumbPath: FolderModel[];              // Almacenar ruta de navegacion (para el breadcrumb)
    isLoading: boolean;                    // Controlar la carga
    error: string | null;                  // Controlar errores

    // Cargar carpetas
    fetchFolder: (id: string) => Promise<FolderModel | null>;                                // Cargar una carpeta especifica por su Id
    fetchSubFolders: (parentFolder: FolderModel) => Promise<FolderModel[]>;                      // Cargar las subcarpetas de una carpeta especifica
    fetchRootSubFolders: () => Promise<FolderModel[]>;                                      // Cargar las carpetas del nivel raiz
    buildBreadCrumbPath: (currentFolderId: string | null) => Promise<FolderModel[]>;        // Construccion del path de navegacion

    // Actualizar estados
    setCurrentFolder: (folder: FolderModel | null) => void;
    setCurrentFolders: (folder: FolderModel[]) => void;
    setBreadCrumbPath: (folder: FolderModel[]) => void;
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
    fetchSubFolders: async (parentFolder: FolderModel) => {
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
            const validSubFolders = subFolders.filter((folder): folder is FolderModel => folder !== null);
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
    fetchRootSubFolders: async () => {
        try{
            set({ isLoading: true});

            const allFolders = await GetFoldersByParentFolderId("");

            const fetchRootSubFolders = allFolders.filter(folder =>
                folder.parentFolderID === null ||
                folder.parentFolderID === "" ||
                folder.parentFolderID === undefined
            );

            const newCache = {...get().folderCache};
            fetchRootSubFolders.forEach(folder => {
                newCache[folder.id] = folder;
            });
            set({
                folderCache: newCache,
                currentFolders: fetchRootSubFolders
            });
            return fetchRootSubFolders;
        }catch(error){
            console.error("Error fetching root subfolders:", error);
            set({ error: "Error fetching root subfolders" });
            return [];
        }finally{
            set({ isLoading: false });
        }
    },
    buildBreadCrumbPath: async (currentFolderId: string | null) => {
        if (!currentFolderId) {
            set({ breadCrumbPath: [] });
            return []; // Si no hay Id devolvemos un array vacío
        }

        const path: FolderModel[] =[];
        let currentId: string | null = currentFolderId;

        // Construir el path recursivamente desde la carpeta actual hasta las raiz
        while (currentId !== null) {
            // Intentar obtener la carpeta del cache primero
            const cachedFolder: FolderModel | undefined = get().folderCache[currentId];
            let folder: FolderModel | null = cachedFolder || null;

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

    setCurrentFolder: (folder: FolderModel | null) => set({ currentFolder: folder }),
    setCurrentFolders: (folder: FolderModel[]) => set({ currentFolders: folder }),
    setBreadCrumbPath: (folder: FolderModel[]) => set({ breadCrumbPath: folder}),
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