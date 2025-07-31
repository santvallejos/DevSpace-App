using System.Runtime.CompilerServices;
using api.Data.Models;
using api.Data.Repositories.Interfaces;
using api.Infrastructure.Dto;
using api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResourceController : ControllerBase
    {
        private readonly IResourceCollection _resourceCollection;
        private readonly ResourceServices _resourceServices;

        public ResourceController(IResourceCollection resourceCollection, ResourceServices resourceServices)
        {
            _resourceCollection = resourceCollection;
            _resourceServices = resourceServices;
        }

        /// <summary>Obtener todos los recursos disponibles.</summary>
        /// <remarks>
        /// Retornar una lista de recursos almacenadas en la base de datos.
        /// 
        /// ### Ejemplo de uso:
        ///     GET /api/resource
        ///
        /// ### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///     {
        ///         "id": "68249ee31a7e2be077274172",
        ///         "folderId": "681d0aa3f03a81ee9f9e53b6",
        ///         "name": "Recurso 1",
        ///         "description": "Recurso 1",
        ///         "type": 0,
        ///         "url": "https://excalidraw.com/",
        ///         "code": "",
        ///         "text": "",
        ///         "favorite": true,
        ///         "createdOn": "2025-05-14T13:47:15.483Z"
        ///     }
        /// ]
        /// ```
        /// </remarks>
        /// <returns>Una lista de recursos</returns>
        /// <response code="200">Lista de recursos obtenida correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetResources()
        {
            try
            {
                return Ok(await _resourceCollection.GetResources());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Obtener un recursos especifico por su id</summary>
        /// <remarks>
        /// Retornar un recurso especifico por su id.
        ///
        /// ### Ejemplo de uso:
        ///     GET /api/resource/68249ee31a7e2be077274172
        ///
        /// ### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///     {
        ///         "id": "68249ee31a7e2be077274172",
        ///         "folderId": "681d0aa3f03a81ee9f9e53b6",
        ///         "name": "Recurso 1",
        ///         "description": "Recurso 1",
        ///         "type": 0,
        ///         "url": "https://excalidraw.com/",
        ///         "code": "",
        ///         "text": "",
        ///         "favorite": true,
        ///         "createdOn": "2025-05-14T13:47:15.483Z"
        ///     }
        /// ]
        /// ```
        /// </remarks>
        /// <param name="id"></param>
        /// <returns>Un recurso especifico</returns>
        /// <response code="200">Recurso obtenido correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        /// <response code="404">Recurso no encontrado</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetResourceById(string id)
        {
            try
            {
                return Ok(await _resourceCollection.GetResourceById(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Crear un recurso</summary>
        /// <remarks>
        /// Crear un recurso.
        ///
        /// ### Ejemplo de uso:
        ///     POST /api/resource
        ///```json
        ///{
        ///     "FolderId": null,
        ///     "Name": "Recurso 2",
        ///     "Description": "Recurso 2",
        ///     "Url": "https://google.com",
        ///     "Code": "",
        ///     "Text": ""
        /// }
        ///```
        ///
        /// ### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///     {
        ///         "id": "68405309d7b1ae7fee012d92",
        ///         "folderId": null,
        ///         "name": "Recurso 2",
        ///         "description": "Recurso 2",
        ///         "type": 0,
        ///         "Url": "https://google.com",
        ///         "code": "",
        ///         "text": "",
        ///         "favorite": false,
        ///         "createdOn": "2025-05-14T13:47:15.483Z"
        ///     }
        /// ]
        /// ```
        /// </remarks>
        /// <param name="resourceDto"></param>
        /// <returns>Un recursos creado</returns>
        /// <response code="200">Recurso creado correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddResource([FromBody] PostResourceDto resourceDto)
        {
            try
            {
                Resource resource = await _resourceServices.AddResourceAsync(resourceDto);
                return Ok( resource );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Actualizar un recurso</summary>
        /// <remarks>
        /// Actualizar un recurso.
        ///
        /// ### Ejemplo de uso:
        ///     PUT /api/resource/68249ee31a7e2be077274172
        ///```json
        ///{
        ///     "FolderId": null,
        ///     "Name": "Recurso 1",
        ///     "Description": "---",
        ///     "url": "https://excalidraw.com/",
        ///     "code": "",
        ///     "text": "",
        ///}
        ///```
        ///</remarks>
        /// <param name="id"></param>
        /// <param name="resourceDto"></param>
        /// <returns>Actualizar un recurso</returns>
        /// <response code="200">Recurso actualizado correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        /// <response code="404">Recurso no encontrado</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateResource(string id, [FromBody] PutResourceDto resourceDto)
        {
            try
            {
                await _resourceServices.UpdateResourceAsync(id, resourceDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Actualizar el folderId de un recurso</summary>
        /// <remarks>
        /// Actualizar el folderId de un recurso.
        ///
        /// ### Ejemplo de uso:
        ///     PUT /api/resource/folderid/68249ee31a7e2be077274172
        ///```json
        ///{
        ///     "FolderId": "681d0aa3f03a81ee9f9e53b6"
        ///}
        ///```
        ///</remarks>
        /// <param name="id"></param>
        /// <param name="resourceDto"></param>
        /// <returns>Actualizar el folderId de un recurso</returns>
        /// <response code="200">Recurso actualizado correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        /// <response code="404">Recurso no encontrado</response>
        [HttpPut("folderid/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateResourceFolderId(string id, [FromBody] FolderIDResourceDto resourceDto)
        {
            try
            {
                await _resourceServices.UpdateResourceFolderIdAsync(id, resourceDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Eliminar un recurso</summary>
        /// <remarks>
        /// Eliminar un recurso.
        ///
        /// ### Ejemplo de uso:
        ///     DELETE /api/resource/68249ee31a7e2be077274172
        ///     
        /// </remarks>
        /// <param name="id"></param>
        /// <returns>Recurso eliminado</returns>
        /// <response code="200">Recurso eliminado correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        /// <response code="404">Recurso no encontrado</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteResource(string id)
        {
            try
            {
                await _resourceCollection.DeleteResource(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Obtener recursos por sus nombres</summary>
        /// <remarks>
        /// Obtener recursos por sus nombres.
        ///
        /// ### Ejemplo de uso:
        ///     GET /api/resource/name/Recurso
        ///
        /// ### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///     {
        ///         "id": "68249ee31a7e2be077274172",
        ///         "folderId": "681d0aa3f03a81ee9f9e53b6",
        ///         "name": "Recurso 1",
        ///         "description": "Recurso 1",
        ///         "type": 0,
        ///         "url": "https://excalidraw.com/",
        ///         "code": "",
        ///         "text": "",
        ///         "favorite": true,
        ///         "createdOn": "2025-05-14T13:47:15.483Z"
        ///     }
        /// ]
        /// ```
        /// </remarks>
        /// <param name="name"></param>
        /// <returns>Una lista de recursos</returns>
        /// <response code="200">Lista de recursos obtenida correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        [HttpGet("name/{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetResourcesByName(string name)
        {
            try
            {
                return Ok(await _resourceCollection.GetResourcesByName(name));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Obtener recursos favoritos</summary>
        /// <remarks>
        /// Obtener recursos favoritos.
        /// 
        /// ### Ejemplo de uso:
        ///     GET /api/resource/favorites
        ///
        /// ### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///     {
        ///         "id": "68249ee31a7e2be077274172",
        ///         "folderId": "681d0aa3f03a81ee9f9e53b6",
        ///         "name": "Recurso 1",
        ///         "description": "Recurso 1",
        ///         "type": 0,
        ///         "url": "https://excalidraw.com/",
        ///         "code": "",
        ///         "text": "",
        ///         "favorite": true,
        ///         "createdOn": "2025-05-14T13:47:15.483Z"
        ///     }
        /// ]
        /// ```
        /// </remarks>
        /// <returns>Una lista de recursos favoritos</returns>
        /// <response code="200">Lista de recursos favoritos obtenida correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        [HttpGet("favorites")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetResourcesFavorites()
        {
            try
            {
                return Ok(await _resourceCollection.GetResourcesFavorites());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Actualizar el favorite de un recurso</summary>
        /// <remarks>
        /// Actualizar el favorite de un recurso.
        ///
        /// ### Ejemplo de uso:
        ///     PUT /api/resource/favorite/68249ee31a7e2be077274172
        ///
        /// </remarks>
        /// <param name="id"></param>
        /// <returns>Recurso actualizado</returns>
        /// <response code="200">Recurso actualizado correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        /// <response code="404">Recurso no encontrado</response>
        [HttpPut("favorite/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateResourceFavorite(string id)
        {
            try
            {
                await _resourceServices.UpdateResourceFavoriteAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Obtener recursos por su folderId</summary>
        /// <remarks>
        /// Obtener recursos por su folderId.
        ///
        /// ### Ejemplo de uso:
        ///     GET /api/resource/folder/681d0aa3f03a81ee9f9e53b6
        ///
        /// ### Respuesta exitosa (200 OK):
        ///```json
        /// [
        ///     {
        ///         "id": "68249ee31a7e2be077274172",
        ///         "folderId": "681d0aa3f03a81ee9f9e53b6",
        ///         "name": "Recurso 1",
        ///         "description": "Recurso 1",
        ///         "type": 0,
        ///         "url": "https://excalidraw.com/",
        ///         "code": "",
        ///         "text": "",
        ///         "favorite": true,
        ///         "createdOn": "2025-05-14T13:47:15.483Z"
        ///     }
        /// ]
        /// ```
        /// </remarks>
        /// <param name="folderId"></param>
        /// <returns>Una lista de recursos</returns>
        /// <response code="200">Lista de recursos obtenida correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        /// <response code="404">Id no encontrada</response>
        [HttpGet("folder/{folderId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetResourcesByFolderId(string folderId)
        {
            try
            {
                return Ok(await _resourceCollection.GetResourcesByFolderId(folderId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Obtener recursos raices</summary>
        /// <remarks>
        /// Obtener recursos raices.
        ///
        /// ### Ejemplo de uso:
        ///     GET /api/resource/root
        ///
        /// ### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///     {
        ///         "id": "68249ee31a7e2be077274172",
        ///         "folderId": null,
        ///         "name": "Recurso 1",
        ///         "description": "Recurso 1",
        ///         "type": 0,
        ///         "url": "https://excalidraw.com/",
        ///         "code": "",
        ///         "text": "",
        ///         "favorite": true,
        ///         "createdOn": "2025-05-14T13:47:15.483Z"
        ///     }
        /// ]
        /// ```
        /// </remarks>
        /// <returns>Una lista de recursos</returns>
        /// <response code="200">Lista de recursos obtenida correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        [HttpGet("root")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetRootResources()
        {
            try
            {
                // Buscar recursos donde FolderId sea null
                return Ok(await _resourceCollection.GetRootResources());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Obtener recursos recientes</summary>
        /// <remarks>
        /// Obtener recursos recientes.
        ///
        /// ### Ejemplo de uso:
        ///     GET /api/resource/recents
        ///
        /// ### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///     {
        ///         "id": "68249ee31a7e2be077274172",
        ///         "folderId": null,
        ///         "name": "Recurso 1",
        ///         "description": "Recurso 1",
        ///         "type": 0,
        ///         "url": "https://excalidraw.com/",
        ///         "code": "",
        ///         "text": "",
        ///         "favorite": true,
        ///         "createdOn": "2025-05-14T13:47:15.483Z"
        ///     }
        /// ]
        /// ```
        /// </remarks>
        /// <returns>Una lista de recursos</returns>
        /// <response code="200">Lista de recursos obtenida correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        [HttpGet("recents")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetResourcesRecents()
        {
            try
            {
                return Ok(await _resourceServices.GetResourcesRecentsAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Eliminar todos los recursos de un folder</summary>
        /// <remarks>
        /// Eliminar todos los recursos de un folder.
        ///
        /// ### Ejemplo de uso:
        ///     DELETE /api/resource/folder/681d0aa3f03a81ee9f9e53b6
        ///
        /// </remarks>
        /// <param name="folderId"></param>
        /// <returns>Recurso eliminado</returns>
        /// <response code="200">Recurso eliminado correctamente</response>
        /// <response code="400">Error en la solicitud</response>
        /// <response code="404">Id no encontrado</response>
        [HttpDelete("folder/{folderId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteResourcesByFolderId(string folderId)
        {
            try
            {
                await _resourceCollection.DeleteResourcesByFolderId(folderId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
