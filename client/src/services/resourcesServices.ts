import api from './api';
import { Resource } from '@/models/resourceModel';

// Obtener todos los recursos
export const GetFavoriteResources = async (): Promise<Resource[]> => {
    const response = await api.get('Resource/favorites');
    return response.data
};

// Obtener los recursos recientes
export const GetRecentsResources = async (): Promise<Resource[]> => {
    const response = await api.get('Resource/recents');
    return response.data
};

// Obtener los recursos recomendados
export const GetRecommendedResources = async (): Promise<Resource[]> => {
    // Al solicitar a un json que esta en github, se debe usar fetch para obtener los datos
    const response = await fetch("https://santvallejos.github.io/DevSpace-Resources-Recommended/prueba.json");

    if (!response.ok) {
        throw new Error("Error al obtener los recursos recomendados");
    }

    const data: Resource[] = await response.json();
    return data;
};

// Eliminar un recurso
export const DeleteResource = async (id: string): Promise<void> => {
    await api.delete(`Resource/${id}`);
};