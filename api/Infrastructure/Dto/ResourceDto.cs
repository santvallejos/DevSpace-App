using System.ComponentModel;
using api.Data.Models;

namespace api.Infrastructure.Dto
{
    public class PostResourceDto
    {
        public string? FolderId { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public ResourceType Type { get; set; }
        public string? Url { get; set; }
        public string? Code { get; set; }
        public string? Text { get; set; }
    }
}
