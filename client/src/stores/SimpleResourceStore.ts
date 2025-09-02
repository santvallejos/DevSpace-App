// Store simple para hacer pruebas de eliminación
import { create } from "zustand";
import { Resource } from "@/models/resourceModel";
import { DeleteResource } from "@/services/ResourceServices";

interface SimpleResourceState {
    resources: Resource[];
    setResources: (resources: Resource[]) => void;
    deleteResourceSimple: (id: string) => Promise<void>;
}

export const useSimpleResourceStore = create<SimpleResourceState>((set, get) => ({
    resources: [],
    
    setResources: (resources: Resource[]) => set({ resources }),
    
    deleteResourceSimple: async (id: string) => {
        console.log('🏪 SIMPLE STORE: Eliminando recurso:', id);
        
        try {
            // Eliminar del servidor primero
            await DeleteResource(id);
            console.log('🏪 SIMPLE STORE: Eliminación en servidor exitosa');
            
            // Luego actualizar estado local
            const currentResources = get().resources;
            const newResources = currentResources.filter(r => r.id !== id);
            
            console.log('🏪 SIMPLE STORE: Actualizando estado local');
            set({ resources: newResources });
            
        } catch (error) {
            console.error('🏪 SIMPLE STORE: Error:', error);
        }
    }
}));
