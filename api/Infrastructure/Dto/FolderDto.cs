using System.ComponentModel;

namespace api.Infrastructure.Dto
{
    public class FolderDto
    {
        public required string Name { get; set; }
        public string? ParentFolderID { get; set; }
    }

    public class NameFolderDto
    {
        public required string Name { get; set; }
    }

    public class ParentFolderDto
    {
        public string? ParentFolderID { get; set; }
    }
}
