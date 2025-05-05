import api from './api';
import { Resource } from '@/models/resourceModel';

export const GetFavoriteResources = async (): Promise<Resource[]> => {
    const response = await api.get('Resource/favorites');
    return response.data
};

export const DeleteResource = async (id: string): Promise<void> => {
    await api.delete(`Resource/${id}`);
};