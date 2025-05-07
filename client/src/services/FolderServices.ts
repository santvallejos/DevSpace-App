import api from "./Api";
import { Folder } from "@/models/FolderModel";

/* Nesito llamar a las carpetas por su ParentFolderId que puede ser null */
export const GetFoldersByParentFolderId = async (parentFolderId: string | null): Promise<Folder[]> => {
    const response = await api.get(`Folder/parent/${parentFolderId}`);
    return response.data;
};

export const GetFolderById = async (id: string): Promise<Folder> => {
    const response = await api.get(`Folder/${id}`);
    return response.data;
}