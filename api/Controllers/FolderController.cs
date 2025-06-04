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
    public class FolderController : ControllerBase
    {
        private readonly IFolderCollection _folderCollection;
        private readonly FolderServices _folderServices;

        public FolderController(IFolderCollection folderCollection, FolderServices folderServices)
        {
            _folderCollection = folderCollection;
            _folderServices = folderServices;
        }

        /// <summary> Obtiene todas las carpetas disponibles. </summary>
        /// <remarks>
        /// Retorna una lista de carpetas almacenadas en la base de datos.
        /// ### Ejemplo de uso:
        ///     GET /api/Folders
        ///     
        /// #### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///    {
        ///         "id": "681d0aa3f03a81ee9f9e53b6",
        ///         "name": "carpeta 1",
        ///         "parentFolderID": null,
        ///         "subFolders": [
        ///             "681d0abbf03a81ee9f9e53b7"
        ///         ]
        ///    },
        ///    {
        ///         "id": "681d0abbf03a81ee9f9e53b7",
        ///         "name": "carpeta 1-1 ",
        ///         "parentFolderID": "681d0aa3f03a81ee9f9e53b6",
        ///         "subFolders": []
        ///    }
        /// ]
        /// ```
        /// </remarks>
        /// <returns>Una lista de carpetas</returns>
        /// <response code="200">Lista de carpetas obtenida correctamente</response>
        /// <response code="400">Ocurrió un error al obtener las carpetas</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFolders()
        {
            try
            {
                return Ok(await _folderCollection.GetFolders());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary> Obtiene una carpeta por su ID. </summary>
        /// <remarks> 
        /// Retorna una carpeta por su ID.
        /// ### Ejemplo de uso:
        ///     GET /api/Folders/681d0aa3f03a81ee9f9e53b6
        ///     
        /// #### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///    {
        ///         "id": "681d0aa3f03a81ee9f9e53b6",
        ///         "name": "carpeta 1",
        ///         "parentFolderID": null,
        ///         "subFolders": [
        ///             "681d0abbf03a81ee9f9e53b7"
        ///         ]
        ///    }
        /// ]
        /// ```
        /// </remarks>
        /// <param name="id"></param>
        /// <returns> Una carpeta especifia </returns>
        /// <response code="200">Carpeta obtenida correctamente</response>
        /// <response code="400">Ocurrió un error al obtener la carpeta</response>
        /// <response code="404">La carpeta no fue encontrada</response>
        [HttpGet("{id}")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFolderById(string id)
        {
            try
            {
                return Ok(await _folderCollection.GetFolderById(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary> Obtener carpetas por el ID padre. </summary>
        /// <remarks> 
        /// Retorna una lista de carpetas por el ID padre.
        /// ### Ejemplo de uso:
        ///     GET /api/Folders/parent/681d0aa3f03a81ee9f9e53b6
        ///     
        /// #### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///    {
        ///         "id": "681d0abbf03a81ee9f9e53b7",
        ///         "name": "carpeta 1-1 ",
        ///         "parentFolderID": "681d0aa3f03a81ee9f9e53b6",
        ///         "subFolders": []
        ///    }
        /// ]
        /// ```
        /// </remarks>
        /// <param name="parentFolderID"></param> // ID de la carpeta padre, puede ser nulo
        /// <returns> Una lista de carpetas especificas </returns>
        /// <response code="200">Carpetas obtenidas correctamente</response>
        /// <response code="400">Ocurrió un error al obtener las carpetas</response>
        /// <response code="404">La carpeta no fue encontrada</response>
        [HttpGet("parent/{parentFolderID?}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFoldersByParentFolderID(string? parentFolderID = null)
        {
            try
            {
                var folders = await _folderCollection.GetFoldersByParentFolderID(parentFolderID);
                return Ok(folders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary> Crea uan carpeta. </summary>
        /// <remarks> 
        /// Crea una carpeta en base al modelo dto de folder
        /// 
        /// ### Ejemplo de uso:
        ///     POST /api/Folders
        ///```json
        ///     {
        ///         "name": "carpeta 2",
        ///         "parentFolderID": null
        ///     }
        ///```
        ///
        /// #### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///    {
        ///         "id": "683f55580b7680d1cb0afc61",
        ///         "name": "carpeta 2",
        ///         "parentFolderID": null,
        ///         "subFolders": []
        ///    }
        /// ]
        /// </remarks>
        /// <param name="folderDto"></param>
        /// <returns> Una carpeta creada </returns>
        /// <response code="200">Carpeta creada correctamente</response>
        /// <response code="400">Ocurrió un error al crear la carpeta</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddFolder([FromBody] FolderDto folderDto)
        {
            try
            {
                Folder folder = await _folderServices.AddFolderAsync(folderDto);
                return Ok( folder );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary> Actualiza el nombre de una carpeta. </summary>
        /// <remarks> 
        /// Actualiza el nombre de una carpeta en base al modelo dto de folder.
        /// 
        /// ### Ejemplo de uso:
        ///     PUT /api/Folders/681d0aa3f03a81ee9f9e53b6
        ///```json
        ///     {
        ///         "name": "Renombar carpeta 1"
        ///     }
        ///```
        /// </remarks>
        /// <param name="id"></param>
        /// <param name="folderDto"></param>
        /// <returns> Una carpeta actualizada </returns>
        /// <response code="200">Carpeta actualizada correctamente</response>
        /// <response code="400">Ocurrió un error al actualizar la carpeta</response>
        /// <response code="404">La carpeta no fue encontrada para actualizar</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateFolder(string id, [FromBody] NameFolderDto folderDto)
        {
            // Validacion del id
            if (id == null)
            {
                return BadRequest();
            }

            try
            {
                await _folderServices.UpdateNameFolderAsync(id, folderDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary> Actualiza la referencia del ParentFolderId de una carpeta. </summary>
        /// <remarks> 
        /// Actualiza la referencia del ParentFolderId de una carpeta en base al modelo dto de folder.
        /// 
        /// ### Ejemplo de uso:
        ///     PUT /api/Folders/parent/681d0abbf03a81ee9f9e53b7
        ///```json
        ///     {
        ///         "parentFolderID": null
        ///     }
        ///```
        /// </remarks>
        /// <param name="id"></param>
        /// <param name="folderDto"></param>
        /// <returns> Una carpeta actualizada </returns>
        /// <response code="200">Carpeta actualizada correctamente</response>
        /// <response code="400">Ocurrió un error al actualizar la carpeta</response>
        /// <response code="404">La carpeta no fue encontrada para actualizar</response>
        [HttpPut("parent/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateReferenceFolder(string id, ParentFolderDto folderDto)
        {
            // Validacion del id
            if (id == null)
            {
                return BadRequest();
            }

            try
            {
                await _folderServices.UpdateParentFolderAsync(id, folderDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary> Elimina una carpeta. </summary>
        /// <remarks> 
        /// Elimina una carpeta en base al ID. 
        /// 
        /// ### Ejemplo de uso:
        ///     DELETE /api/Folders/681d0aa3f03a81ee9f9e53b6
        /// Nota:
        /// - Si la carpeta tiene subcarpetas, estas se eliminarán también.
        ///
        /// </remarks>
        /// <param name="id"></param>
        /// <returns> Carpeta eliminada </returns>
        /// <response code="200">Carpeta eliminada correctamente</response>
        /// <response code="400">Ocurrió un error al eliminar la carpeta</response>
        /// <response code="404">La carpeta no fue encontrada para eliminar</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteFolder(string id)
        {
            try
            {
                await _folderServices.DeleteFolderAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary> Obtiene el id de las subcarpetas de una carpeta especifica </summary>
        /// <remarks> 
        /// Retorna una lista de subcarpetas por el ID padre.
        /// 
        /// ### Ejemplo de uso:
        ///     GET /api/Folders/subfolders/681d0aa3f03a81ee9f9e53b6
        ///     
        /// #### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///    {
        ///         "id": "681d0abbf03a81ee9f9e53b7",
        ///         "name": "carpeta 1-1 ",
        ///         "parentFolderID": "681d0aa3f03a81ee9f9e53b6",
        ///         "subFolders": []
        ///    }
        /// ]
        /// ```
        /// </remarks>
        /// <param name="id"></param>
        /// <returns> Una lista de subcarpetas especificas </returns>
        /// <response code="200">Subcarpetas obtenidas correctamente</response>
        /// <response code="400">Ocurrió un error al obtener las subcarpetas</response>
        /// <response code="404">La carpeta no fue encontrada</response>
        [HttpGet("subfolders/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetSubFolders(string id)
        {
            try
            {
                return Ok(await _folderCollection.GetSubFolders(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary> Obtiene las carpetas por nombre. </summary>
        /// <remarks> 
        /// Retorna una lista de carpetas por nombre.
        /// 
        /// ### Ejemplo de uso:
        ///     GET /api/Folders/name/Renombr
        ///     
        /// #### Respuesta exitosa (200 OK):
        /// ```json
        /// [
        ///    {
        ///         "id": "681d0aa3f03a81ee9f9e53b6",
        ///         "name": "Renombar carpeta 1",
        ///         "parentFolderID": null,
        ///         "subFolders": [
        ///             "681d0abbf03a81ee9f9e53b7"
        ///         ]
        ///    }
        /// ]
        /// ```
        /// </remarks>
        /// <param name="name"></param>
        /// <returns> Una lista de carpetas especificas </returns>
        /// <response code="200">Carpetas obtenidas correctamente</response>
        /// <response code="400">Ocurrió un error al obtener las carpetas</response>
        /// <response code="404">La carpeta no fue encontrada</response>
        [HttpGet("name/{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetFoldersByName(string name)
        {
            try
            {
                return Ok(await _folderCollection.GetFoldersByName(name));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
