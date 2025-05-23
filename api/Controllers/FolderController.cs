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

        [HttpGet] // Traer todas las carpetas
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

        [HttpGet("{id}")] // Traer una carpeta por id
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

        [HttpGet("parent/{parentFolderID?}")] // Traer todas las carpetas por id de la carpeta padre
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

        [HttpPost] // Crear una carpeta
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

        [HttpPut("{id}")] // Actualizar una carpeta
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

        [HttpPut("parent/{id}")] // Actualizar la referencia de una carpeta
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

        [HttpDelete("{id}")] // Eliminar una carpeta (si tiene hijos, se eliminan)
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

        [HttpGet("subfolders/{id}")] // Traer las subcarpetas de una carpeta padre
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

        [HttpGet("name/{name}")] // Traer carpetas por nombre
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
