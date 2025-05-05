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

        [HttpGet]
        public async Task<IActionResult> GetFolders()
        {
            try
            {
                //Obtenemos todas las carpetas
                return Ok(await _folderCollection.GetFolders());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFolderById(string id)
        {
            try
            {
                //Obtenemos la carpeta por id
                return Ok(await _folderCollection.GetFolderById(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddFolder([FromBody] PostFolderDto folderDto)
        {
            try
            {
                //Agregamos la carpeta indepedientemente y si tiene padre, agregamos la referencia al padre s
                await _folderServices.AddFolderAsync(folderDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateFolder(string id, [FromBody] PutFolderDto folderDto)
        {
            //validamos que el id no sea nulo
            if (id == null)
            {
                return BadRequest();
            }

            try
            {
                //Actualizamos el name de la carpeta
                await _folderServices.UpdateFolderAsync(id, folderDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFolder(string id)
        {
            try
            {
                //Eliminamos la carpeta y si tiene subcarpetas las elimina tambien
                await _folderServices.DeleteFolderAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("subfolders/{id}")]
        public async Task<IActionResult> GetSubFolders(string id)
        {
            try
            {
                //Obtenemos las subcarpetas de la carpeta padre
                return Ok(await _folderCollection.GetSubFolders(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("folders/{name}")]
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
