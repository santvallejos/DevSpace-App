import { create } from "zustand";
import { Resource, CreateResourceModel, UpdateResourceModel, MoveResourceModel } from "@/models/ResourceModel";
import {
    GetResourceById,
    GetRecentsResources,
    GetFavoriteResources,
    GetRecommendedResources,
    GetResourceByFolderId,
    CreateResource,
    UpdateResource,
    UpdateResourceFavorite,
    UpdateResourceFolder,
    DeleteResource
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
    addResource: (resource: CreateResourceModel) => void;                        // Crear un nuevo recurso
    updateResource: (id: string, resource: UpdateResourceModel) => void;         // Actualizar un recurso
    updateResourceFavorite: (id: string) => void;                                // Actualizar el estado de favorito de un recurso
    moveResource: (id: string, folderId: MoveResourceModel ) => void;            // Mover un recurso a otra carpeta
    deleteResource: (id: string) => void;                                        // Eliminar un recurso
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
    updateResource: async (id: string, resourceUpdate: UpdateResourceModel) => {
        try {
            // Actualizar el recurso
            await UpdateResource(id, resourceUpdate);

            // Obtener el recurso 
            const resource = await GetResourceById(id);
            if (!resource) {
                throw new Error('Recurso no encontrado');
            }

            // Evaluar si el recurso se esta mostrando actualmente
            const currentFolder = useFolderStore.getState().currentFolder;
            const isInCurrentFolder = currentFolder && currentFolder.id === resource.folderId;
            const isInRootView = currentFolder === null;
            const isRootResource = !resource.folderId || resource.folderId === '';

            // Si el recurso se esta mostrando actualmente, actualizar la vista
            if ((isRootResource && isInRootView) || isInCurrentFolder) {
                const currentResources = [...useResourceStore.getState().currentResourceFolder];
                const index = currentResources.findIndex(r => r.id === id);
                if(index!== -1){
                    currentResources[index] = {...currentResources[index], ...resourceUpdate};
                    useResourceStore.getState().setCurrentResourceFolder(currentResources);
                }
            }
        } catch (error) {
            console.error(error);
            set({ error: 'Error al actualizar el recurso' });
        }
    },
    updateResourceFavorite: async (id: string) => {
        try{
            // Solo actualziar el estado de favorito
            await UpdateResourceFavorite(id);
        } catch (error) {
            console.error(error);
            set({ error: 'Error al actualizar el recurso' });
        }
    },
    moveResource: async (id: string, resourceFolderId: MoveResourceModel) => {
        try{
            await UpdateResourceFolder(id, resourceFolderId);

            // Obtener la carpeta actual del FolderStore
            const currentFolder = useFolderStore.getState().currentFolder;

            // Verificamos si el recurso se movió a otra carpeta que no es la que se está mostrando
            // O si estamos en la raíz (currentFolder es null) y el recurso se movió a una carpeta (resourceFolderId.folderId no es null)
            const isMovingFromCurrentFolder = 
                (currentFolder && currentFolder.id !== resourceFolderId.folderId) || 
                (currentFolder === null && resourceFolderId.folderId !== null);

            // Si se movió a otra carpeta que no es la que se está mostrando, actualizamos la vista eliminando el recurso
            if (isMovingFromCurrentFolder) {
                const currentResources = [...useResourceStore.getState().currentResourceFolder];
                const index = currentResources.findIndex(r => r.id === id);
                if(index!== -1){
                    currentResources.splice(index, 1);
                    useResourceStore.getState().setCurrentResourceFolder(currentResources);
                }
            }
        } catch (error) {
            console.error(error);
            set({ error: 'Error al mover el recurso' });
        }
    },
    deleteResource: async (id: string) => {
        try{
            // Obtener el recurso antes de eliminarlo
            const resource = await GetResourceById(id);
            if (!resource) {
                throw new Error('Recurso no encontrado');
            }
            
            // Eliminar el recurso
            await DeleteResource(id);

            // Evaluar si el recurso se esta mostrando actualmente
            const currentFolder = useFolderStore.getState().currentFolder;
            const isInCurrentFolder = currentFolder && currentFolder.id === resource.folderId;
            const isInRootView = currentFolder === null;
            const isRootResource = !resource.folderId || resource.folderId === '';

            // Si el recurso se esta mostrando actualmente, actualizar la vista
            if ((isRootResource && isInRootView) || isInCurrentFolder) {
                const currentResources = [...useResourceStore.getState().currentResourceFolder];
                const index = currentResources.findIndex(r => r.id === id);
                if(index !== -1){
                    currentResources.splice(index, 1);
                    useResourceStore.getState().setCurrentResourceFolder(currentResources);
                }
            }
        } catch (error) {
            console.error(error);
            set({ error: 'Error al eliminar el recurso' });
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