import { create } from "zustand";
import { Resource } from "@/models/ResourceModel";
import {
    GetRecentsResources,
    GetFavoriteResources,
    GetRecommendedResources
} from "@/services/ResourceServices";

interface ResourceState {
    // Estados
    recentsResources: Resource[];
    favoritesResources: Resource[];
    recommendedResources: Resource[];
    isLoading: boolean;
    error: string | null;

    fetchRecentResources: () => Promise<Resource[]>;
    fetchFavoriteResources: () => Promise<Resource[]>;
    fetchRecommendedResources: () => Promise<Resource[]>;

    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

    //utilidades
    clearError: () => void;
    resetState: () => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
    // Estados iniciales
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
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | null) => set({ error }),
    
    // Utilidades
    clearError: () => set({ error: null }),
    resetState: () => set({ 
        recentsResources: [],
        favoritesResources: [],
        recommendedResources: [],
        isLoading: false,
        error: null
    })
}));