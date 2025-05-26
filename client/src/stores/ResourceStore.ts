import { create } from "zustand";
import { Resource, CreateResourceModel } from "@/models/ResourceModel";
import {
    GetRecentsResources,
    GetFavoriteResources,
    GetRecommendedResources,
    GetResourceByFolderId,
    CreateResource,
} from "@/services/ResourceServices";
import { useFolderStore } from "./FolderStore";

interface ResourceState {
    // Cargar la unidad
    currentResourceFolder: Resource[];

    // Dashboard
    recentsResources: Resource[];
    favoritesResources: Resource[];
    recommendedResources: Resource[];

    // Indicaciones de estados
    isLoading: boolean;
    error: string | null;

    // Cargar recursos
    fetchRecentResources: () => Promise<Resource[]>;
    fetchFavoriteResources: () => Promise<Resource[]>;
    fetchRecommendedResources: () => Promise<Resource[]>;
    fetchResourcesRoot: () => Promise<Resource[]>;                               // Cargar los recursos del nivel raiz
    fetchResources: (folderId: string | null) => Promise<Resource[]>;            // Cargar los recursos de una carpeta especifica

    // Crud de recursos
    addResource: (resource: CreateResourceModel) => void;
    // Actualizar estados
    setCurrentResourceFolder: (folder: Resource[]) => void;

    // Utilidades
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

    //utilidades
    clearError: () => void;
    resetState: () => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
    // Estados iniciales
    currentResourceFolder: [],
    recentsResources: [],
    favoritesResources: [],
    recommendedResources: [],
    isLoading: false,
    error: null,

    // Implementacion de acciones para cargar recursos
    fetchRecentResources: async () => {
        try{
            set({ isLoading: true, error: null});
            const resources = await GetRecentsResources();
            set({ recentsResources: resources });
            return resources;
        } catch (error) {
            set({ error: 'Error al cargar los recursos recientes', isLoading: false });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    fetchFavoriteResources: async () =>{
        try{
            set({ isLoading: true, error: null});
            const resources = await GetFavoriteResources();
            set({ favoritesResources: resources });
            return resources;
        } catch (error) {
            set({ error: 'Error al cargar los recursos favoritos', isLoading: false });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    fetchRecommendedResources: async () => {
        try{
            set({ isLoading: true, error: null});
            const resources = await GetRecommendedResources();
            set({ recommendedResources: resources });
            return resources;
        } catch (error) {
            set({ error: 'Error al cargar los recursos recomendados', isLoading: false });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    fetchResourcesRoot: async () => {
        try{
            set({ isLoading: true })
            const resources = await GetResourceByFolderId(null);
            set({ currentResourceFolder: resources});
            return resources;
        } catch (error) {
            console.error(error);
            set({ error: 'Error al cargar los recursos de la raiz', isLoading: false });
            return [];
        } finally {
            set({ isLoading: false });
        }
    },
    fetchResources: async (folderId: string | null) => {
        try{
            set({ isLoading: true })
            const resources = await GetResourceByFolderId(folderId);
            set({ currentResourceFolder: resources });
            return resources;
        } catch (error) {
            console.error(error);
            set({ error: 'Error al cargar los recursos de la raiz', isLoading: false });
            return [];
        } finally {
            set({ isLoading: false });
        }
    },
    addResource: async (resource: CreateResourceModel) => {
        try{
            const newResource = await CreateResource(resource);
            if(newResource){
                // Obtener la carpeta actual del FolderStore
                const currentFolder = useFolderStore.getState().currentFolder;
                
                // Verificar si estamos en la raíz (currentFolder es null) y el recurso se añadió a la raíz
                const isRootResource = !newResource.folderId || newResource.folderId === '';
                const isInRootView = currentFolder === null;
                
                // Verificar si estamos en una carpeta y el recurso se añadió a esa carpeta
                const isInCurrentFolder = currentFolder && newResource.folderId === currentFolder.id;
                
                // Solo actualizar la vista si el recurso se añadió a la carpeta que se está visualizando
                if ((isRootResource && isInRootView) || isInCurrentFolder) {
                    const currentResources = [...useResourceStore.getState().currentResourceFolder];
                    currentResources.push(newResource);
                    useResourceStore.getState().setCurrentResourceFolder(currentResources);
                }
            }
            return newResource;
        } catch (error) {
            console.error(error);
            set({ error: 'Error al crear el recurso' });
            return null;
        }
    },

    setCurrentResourceFolder: (folder: Resource[]) => set({ currentResourceFolder: folder }),

    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | null) => set({ error }),
    
    // Utilidades
    clearError: () => set({ error: null }),
    resetState: () => set({
        currentResourceFolder: [],
        recentsResources: [],
        favoritesResources: [],
        recommendedResources: [],
        isLoading: false,
        error: null
    })
}));