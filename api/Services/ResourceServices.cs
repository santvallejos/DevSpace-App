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
    public class ResourceServices
    {
        private readonly IResourceCollection _resourceCollection;
        private readonly IFolderCollection _folderCollection;

        public ResourceServices(IResourceCollection resourceCollection, IFolderCollection folderCollection)
        {
            _resourceCollection = resourceCollection;
            _folderCollection = folderCollection;
        }

        public async Task AddResourceAsync(PostResourceDto resourceDto)
        {
            Resource @resource = new Resource()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                FolderId = resourceDto.FolderId,
                FolderName = "",
                Name = resourceDto.Name,
                Description = resourceDto.Description,
                Type = resourceDto.Type,
                Url = resourceDto.Url,
                Code = resourceDto.Code,
                Text = resourceDto.Text,
                Favorite = false,
                CreatedOn = DateTime.UtcNow
            };

            //Si el archivo no esta en la raiz de la carpeta
            if (@resource.FolderId != null)
            {
                //Obtenemos la carpete
                var folder = await _folderCollection.GetFolderById(@resource.FolderId);
                //Si la carpeta existe
                if (folder != null)
                {
                    //Obtenemos el nombre de la carpeta
                    @resource.FolderName = folder.Name;
                }
                else
                {
                    throw new Exception("No existe una carpeta con ese Id");
                }
            }

            //Agrego el recurso
            await _resourceCollection.AddResource(@resource);
        }

        public async Task UpdateResourceFavoriteAsync(string Id)
        {
            //Obtenemos el recuro
            var resource = await _resourceCollection.GetResourceById(Id);
            if (resource != null)
            {
                //Actualizo el Favorite
                resource.Favorite = !resource.Favorite;
                //Actualizo la carpeta
                await _resourceCollection.UpdateResource(resource);
            }
            else
            {
                throw new Exception("No se encontro el recurso");
            }
        }
    }
}
