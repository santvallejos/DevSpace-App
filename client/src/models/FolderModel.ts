/* 
    Ejemplo del modelo de la base de datos
    [
    {
        "id": "681a7dfa4f31ef7c8a707cca",
        "name": "primera carpeta",
        "parentFolderID": null,
        "subFolders": []
    }
    ]
*/

export interface FolderModel {
    id: string;
    name: string;
    parentFolderID: string | null;
    subFolders: string[];
}

export interface FolderSelected{
    name: string;
    id: string;
}

export interface PostFolder{
    name: string;
    parentFolderID: string | null;
}