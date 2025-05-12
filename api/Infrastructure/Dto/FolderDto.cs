using System.ComponentModel;

namespace api.Infrastructure.Dto
{
    public class FolderDto
    {
        public required string Name { get; set; }
        public string? ParentFolderID { get; set; }
    }
}
