import api from "../contexts/Api";
import { Folder } from "@/models/FolderModel";

// Obtener carpeta por su id
export const GetFolderById = async (id: string): Promise<Folder> => {
    const response = await api.get(`Folder/${id}`);
    return response.data;
}

// Nesito llamar a las carpetas por su ParentFolderId que puede ser null
export const GetFoldersByParentFolderId = async (parentFolderId: string | null): Promise<Folder[]> => {
    const response = await api.get(`Folder/parent/${parentFolderId}`);
    return response.data;
};

export const GetFoldersByName = async (name: string): Promise<Folder[]> => {
    const response = await api.get(`Folder/name/${name}`);
    return response.data;
}

// Crear una carpeta
export const CreateFolder = async (folder: Folder): Promise<Folder> => {
    const response = await api.post('Folder', folder);
    return response.data;
}

// Actualizar una carpeta
export const UpdateFolder = async (folder: Folder): Promise<Folder> => {
    const response = await api.put(`Folder/${folder.id}`, folder);
    return response.data;
}

// Mover una carpeta a otra
export const UpdateParentFolder = async (id: string, parentFolderId:string | null): Promise<Folder> => {
    const response = await api.put(`Folder/parent/${id}`, {parentFolderId});
    return response.data;
}

// Eliminar una carpeta (Se aplica recursividad si es necesario)
export const DeleteFolder = async (id: string): Promise<void> => {
    const response = await api.delete(`Folder/${id}`);
    return response.data;
}