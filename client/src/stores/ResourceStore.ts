import { create } from "zustand";
import { Resource } from "@/models/ResourceModel";
import {
    GetRecentsResources,
    GetFavoriteResources,
    GetRecommendedResources,
    GetResourceByFolderId
} from "@/services/ResourceServices";

interface ResourceState {
    // Estados
    currentResourceFolder: Resource[];
    recentsResources: Resource[];
    favoritesResources: Resource[];
    recommendedResources: Resource[];
    isLoading: boolean;
    error: string | null;

    // Cargar recursos
    fetchRecentResources: () => Promise<Resource[]>;
    fetchFavoriteResources: () => Promise<Resource[]>;
    fetchRecommendedResources: () => Promise<Resource[]>;
    fetchResourcesRoot: () => Promise<Resource[]>;                               // Cargar los recursos del nivel raiz
    fetchResources: (folderId: string | null) => Promise<Resource[]>;            // Cargar los recursos de una carpeta especifica

    setCurrentResourceFolder: (folder: Resource[]) => void;

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
            const resources = await GetResourceByFolderId("");
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