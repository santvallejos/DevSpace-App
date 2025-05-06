using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data.Models;

namespace api.Data.Repositories.Interfaces
{
    public interface IFolderCollection
    {
        Task<List<Folder>> GetFolders();
        Task<Folder> GetFolderById(string id);
        Task<List<Folder>> GetFoldersByParentFolderID(string parentFolderID);
        Task<List<Folder>> GetFoldersByName(string name);
        Task<List<string>> GetSubFolders(string id);
        Task AddFolder(Folder folder);
        Task UpdateFolder(Folder folder);
        Task DeleteFolder(string id);
    }
}
