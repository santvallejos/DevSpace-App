import api from '../contexts/Api';
import { Resource, CreateResourceModel, UpdateResourceModel, MoveResourceModel} from '../models/resourceModel';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Obtener recurso por id
export const GetResourceById = async (id: string): Promise<Resource> => {
    const response = await api.get(`Resource/${id}`);
    return response.data;
};

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
    const url = "https://api.github.com/repos/santvallejos/Base-de-datos-JSONs/contents/DevSpace/RecommendedResources.json?ref=main";

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3.raw"
        }
    });

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
export const UpdateResource = async (id: string, resource: UpdateResourceModel): Promise<Resource> => {
    const response = await api.put(`Resource/${id}`, resource);
    return response.data;
};

// Mover un recurso a una carpeta
export const UpdateResourceFolder = async (id: string, folderId: MoveResourceModel): Promise<Resource> => {
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