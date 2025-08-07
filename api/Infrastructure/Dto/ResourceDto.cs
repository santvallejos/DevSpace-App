using System.ComponentModel;

using api.Data.Models;
using api.Infrastructure.Validation;

namespace api.Infrastructure.Dto
{
    public class PostResourceDto
    {
        public string? FolderId { get; set; }

        public required string Name { get; set; }
        public string? Description { get; set; }

        public ResourceType Type { get; set; }

        [AllowSpecialCharacters]
        public string? Value { get; set; }
    }

    public class PutResourceDto
    {
        public required string Name { get; set; }

        public string? Description { get; set; }

        [AllowSpecialCharacters]
        public string? Value { get; set; }
    }

    public class FolderIDResourceDto
    {
        public string? FolderId { get; set; }
    }
}
