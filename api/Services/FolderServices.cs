using System;
using System.Linq;
using System.Collections.Generic;
using api.Data.Models;
using api.Data.Repositories.Collection;
using api.Data.Repositories.Interfaces;
using api.Infrastructure.Dto;
using MongoDB.Bson;

namespace api.Services
{
    public class FolderServices
    {
        private readonly IFolderCollection _folderCollection;
        private readonly IResourceCollection _resourceCollection;

        public FolderServices(IFolderCollection folderCollection, IResourceCollection resourceCollection)
        {
            _folderCollection = folderCollection;
            _resourceCollection = resourceCollection;
        }

        public async Task AddFolderAsync(FolderDto folderDto)
        {
            Folder @folder = new Folder
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Name = folderDto.Name,
                ParentFolderID = folderDto.ParentFolderID,
                SubFolders = new List<string>()
            };

            //Si el padre no es nulo, agregamos la referencia al padre
            if (@folder.ParentFolderID != null)
            {
                await UpdateReferenceFolder(@folder.Id, @folder.ParentFolderID);
                await _folderCollection.AddFolder(@folder);
            }
            else
            {
                // El padre es nulo, la carpeta esta en la raiz de la unidad
                await _folderCollection.AddFolder(@folder);
            }
        }

        public async Task UpdateFolderAsync(string Id, FolderDto folderDto)
        {
            var folder = await _folderCollection.GetFolderById(Id); //Obtenemos la carpeta
            if (folder != null)
            {
                folder.Name = folderDto.Name;                       //Actualizo el nombre
                // Evaluamos el valor del padre id
                if (folderDto.ParentFolderID != folder.ParentFolderID)
                {
                    var oldParentFolder = await _folderCollection.GetFolderById(folder.ParentFolderID);
                    if (oldParentFolder != null)
                    {
                        // Removemos la referencia del padre antiguo sabiendo que existe
                        await DeleteReferenceFolder(folder.Id, oldParentFolder.Id);
                        // Agregamos la referencia al padre nuevo
                        await UpdateReferenceFolder(folder.Id, folderDto.ParentFolderID);
                        folder.ParentFolderID = folderDto.ParentFolderID;
                    }
                }
                await _folderCollection.UpdateFolder(folder);       //Guardado de la actualizacion
            }
            else
            {
                throw new Exception("La carpeta no existe");
            }
        }

        public async Task DeleteFolderAsync(string folderId)
        {
            var folder = await _folderCollection.GetFolderById(folderId); //Obtengo la carpeta
            if (folder != null)
            {
                var longSubFolders = folder.SubFolders.Count; //Obtengo la cantidad de carpetas hijas
                //Recorrido de profundidad recursivo
                if (longSubFolders > 0)
                {
                    foreach (var subFolderId in folder.SubFolders)
                    {
                        await _resourceCollection.DeleteResourcesByFolderId(subFolderId);
                        await DeleteFolderAsync(subFolderId);
                    }
                }
                // Eliminar la carpeta actual
                await _resourceCollection.DeleteResourcesByFolderId(folderId);
                // Si tiene carpeta padre, eliminamos la referencia en el padre
                if (folder.ParentFolderID != null)
                {
                    await DeleteReferenceFolder(folderId, folder.ParentFolderID);
                }
                await _folderCollection.DeleteFolder(folderId);
            }
            else
            {
                throw new Exception("La carpeta no existe");
            }
        }

        // Actualizacion de referencias a para subFolders
        public async Task UpdateReferenceFolder(string folderId, string ParentFolderID)
        {
            var ParentFolder = await _folderCollection.GetFolderById(ParentFolderID);

            if(ParentFolder != null)
            {
                ParentFolder.SubFolders.Add(folderId);
                await _folderCollection.UpdateFolder(ParentFolder);
            }
            else
            {
                throw new Exception("El padre no existe");
            }
        }

        // Eliminacion de referencias para subFolders
        public async Task DeleteReferenceFolder(string folderId, string ParentFolderID)
        {
            var ParentFolder = await _folderCollection.GetFolderById(ParentFolderID);

            if(ParentFolder != null )
            {
                ParentFolder.SubFolders.Remove(folderId);
                await _folderCollection.UpdateFolder(ParentFolder);
            }
            else
            {
                throw new Exception("El padre no existe");
            }
        }
    }
}
