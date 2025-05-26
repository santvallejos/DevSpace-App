import api from '../contexts/Api';
import { Resource, CreateResourceModel } from '../models/ResourceModel';

// Obtener recurso por carpeta
export const GetResourceByFolderId = async (folderId: string | null): Promise<Resource[]> => {
    // Si folderId es null, usar un endpoint especial para recursos en la raíz
    if (folderId === null) {
        const response = await api.get('Resource/root');
        return response.data;
    }
    
    const response = await api.get(`Resource/folder/${folderId}`);
    return response.data;
};

// Obtener los recursos recientes
export const GetRecentsResources = async (): Promise<Resource[]> => {
    const response = await api.get('Resource/recents');
    return response.data
};

// Obtener los recursos favoritos
export const GetFavoriteResources = async (): Promise<Resource[]> => {
    const response = await api.get('Resource/favorites');
    return response.data;
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

// Obtener un recurso por su nombre
export const GetResourceByName = async (name: string): Promise<Resource> => {
    const response = await api.get(`Resource/name/${name}`);
    return response.data;
}

// Crear un recurso
export const CreateResource = async (resource: CreateResourceModel): Promise<Resource> => {
    const response = await api.post<Resource>('Resource', resource);
    return response.data;
};

// Actualizar un recurso
export const UpdateResource = async (resource: Resource): Promise<Resource> => {
    const response = await api.put(`Resource/${resource.id}`, resource);
    return response.data;
};

// Mover un recurso a una carpeta
export const UpdateResourceFolder = async (id: string, folderId: string | null): Promise<Resource> => {
    const response = await api.put(`Resource/folderid/${id}`, folderId);
    return response.data;
};

// Actualizar estdado a favorito o no favorito
export const UpdateResourceFavorite = async (id: string): Promise<Resource> => {
    const response = await api.put(`Resource/favorite/${id}`);
    return response.data;
};

// Eliminar un recurso
export const DeleteResource = async (id: string): Promise<void> => {
    await api.delete(`Resource/${id}`);
};