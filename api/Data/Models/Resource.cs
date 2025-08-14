using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Data.Models
{
    //Tipos de recursos que se pueden guardar en la base de datos
    public enum ResourceType
    {
        Url,
        Code,
        Text
    }

    public enum CodeType
    {
        // Necesito que puedas poner algunos de los lenjuages mas populares para realizar pruebas ademas de html y css
        Html,
        Css,
        Javascript,
        Typescript,
        React,
        Vue,
        Angular,
        Svelte,
        PHP,
        Python,
        Java,
        CSharp,
        Ruby,
        Go,
        Rust,
        Sql,
        Markdown,
        Json
    }

    public class Resource
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public required string Id { get; set; }
        public string? FolderId { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public ResourceType Type { get; set; }
        public CodeType? CodeType { get; set; }
        public string? Value { get; set; }
        public bool Favorite { get; set; } = false;
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)] // Asegura que se almacene en UTC
        public DateTime CreatedOn { get; set; }
    }
}
