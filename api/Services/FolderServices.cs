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

        public async Task AddFolderAsync(PostFolderDto folderDto)
        {
            Folder @folder = new Folder
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Name = folderDto.Name,
                ParentFolderID = folderDto.ParentFolderID,
                SubFolders = new List<string>()
            };

            //Obtenemos el id del padre
            var parentFolderID = @folder.ParentFolderID;
            //Si el padre no es nulo, agregamos la referencia al padre
            if (parentFolderID != null)
            {
                //Obtenemos el padre
                var parentFolder = await _folderCollection.GetFolderById(parentFolderID);
                if (parentFolder != null)
                {
                    //Agregamos la carpeta indepedientemente
                    await _folderCollection.AddFolder(@folder);
                    //Agreamos la referencia del Id de la carpeta hija al padre
                    parentFolder.SubFolders.Add(@folder.Id);
                    await _folderCollection.UpdateFolder(parentFolder);
                }
                else
                {
                    throw new Exception("El padre no existe");
                }
            }
            else
            {
                await _folderCollection.AddFolder(@folder);
            }
        }

        public async Task UpdateFolderAsync(string Id, PutFolderDto folderDto)
        {
            //Obtenemos la carpeta
            var folder = await _folderCollection.GetFolderById(Id);
            if (folder != null)
            {
                //Actualizo el nombre
                folder.Name = folderDto.Name;
                //Actualizo la carpeta
                await _folderCollection.UpdateFolder(folder);
            }
            else
            {
                throw new Exception("La carpeta no existe");
            }
        }

        //Posibles mejoras
        public async Task DeleteFolderAsync(string folderId)
        {
            //Obtengo la carpeta
            var folder = await _folderCollection.GetFolderById(folderId);
            if (folder != null)
            {
                //Obtengo la cantidad de carpetas hijas
                var longSubFolders = folder.SubFolders.Count;
                //Recorrido de profundidad iterativo
                if (longSubFolders > 0)
                {
                    foreach (var subFolderId in folder.SubFolders)
                    {
                        await _resourceCollection.DeleteResourcesByFolderId(subFolderId);
                        await DeleteFolderAsync(subFolderId);
                    }
                }
                await _resourceCollection.DeleteResourcesByFolderId(folderId);
                await _folderCollection.DeleteFolder(folderId);
            }
            else
            {
                throw new Exception("La carpeta no existe");
            }
        }
    }
}
