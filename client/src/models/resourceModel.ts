export interface Resource {
    id: string;
    folderId: string;
    folderName: string;
    name: string;
    description: string;
    type: number;
    url: string;
    code: string;
    text: string;
    favorite: boolean;
    createdOn: Date;
}

/* ejemplo de modelo de la base de datos
[
  {
    "id": "67f5952c794c2e42a9fed6df",
    "folderId": null,
    "folderName": "",
    "name": "Prueba type de recursos",
    "description": "string",
    "type": 0,
    "url": "https://www.youtube.com",
    "code": null,
    "text": null,
    "favorite": false,
    "createdOn": "2025-04-08T21:29:16.015Z"
  }
]
*/