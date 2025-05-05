using System.ComponentModel;

namespace api.Infrastructure.Dto
{
    public class PostFolderDto
    {
        public string Name { get; set; }
        public string? ParentFolderID { get; set; }
    }

    public class PutFolderDto
    {
        public string Name { get; set; }
    }
}
