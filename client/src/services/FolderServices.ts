import api from "../contexts/Api";
import { FolderModel, PostFolder, RenameFolder, MoveFolder } from "@/models/FolderModel";

// Obtener todas las carpetas
export const GetAllFolders = async (): Promise<FolderModel[]> => {
    const response = await api.get('Folder');
    return response.data;
}

// Obtener carpeta por su id
export const GetFolderById = async (id: string): Promise<FolderModel> => {
    const response = await api.get(`Folder/${id}`);
    return response.data;
}

// Nesito llamar a las carpetas por su ParentFolderId que puede ser null
export const GetFoldersByParentFolderId = async (parentFolderId: string | null): Promise<FolderModel[]> => {
    const response = await api.get(`Folder/parent/${parentFolderId}`);
    return response.data;
};

export const GetFoldersByName = async (name: string): Promise<FolderModel[]> => {
    const response = await api.get(`Folder/name/${name}`);
    return response.data;
}

// Crear una carpeta
export const CreateFolder = async (folder: PostFolder): Promise<FolderModel> => {
    const response = await api.post<FolderModel>('Folder', folder); // Esperamos que la API nos devuelva un FolderModel (que es el que acabamos de crear)
    return response.data;
}

// Actualizar una carpeta
export const UpdateFolder = async (id: string, name: RenameFolder): Promise<RenameFolder> => {
    const response = await api.put(`Folder/${id}`, name);
    return response.data;
}

// Mover una carpeta a otra
export const UpdateParentFolder = async (id: string, newParentId: MoveFolder): Promise<MoveFolder> => {
    const response = await api.put(`Folder/parent/${id}`, newParentId);
    return response.data;
}

// Eliminar una carpeta (Se aplica recursividad si es necesario)
export const DeleteFolder = async (id: string): Promise<void> => {
    const response = await api.delete(`Folder/${id}`);
    return response.data;
}