using api.Data.Models;
using api.Data.Repositories.Interfaces;
using MongoDB.Driver;
using MongoDB.Bson;

namespace api.Data.Repositories.Collection
{
    /// <summary>
    /// Repositorio dinámico para Resources que soporta múltiples conexiones MongoDB
    /// </summary>
    public class DynamicResourceCollection : IResourceCollection
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMongoDatabase _defaultDatabase;
        private readonly ILogger<DynamicResourceCollection> _logger;

        public DynamicResourceCollection(
            IMongoDatabase defaultDatabase, 
            IHttpContextAccessor httpContextAccessor,
            ILogger<DynamicResourceCollection> logger)
        {
            _defaultDatabase = defaultDatabase;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene la instancia de la colección de Resources basada en el contexto actual
        /// </summary>
        private IMongoCollection<Resource> GetCollection()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            
            // Verificar si hay una conexión dinámica en el contexto
            if (httpContext?.Items.ContainsKey("MongoDatabase") == true && 
                httpContext.Items.ContainsKey("IsDynamicConnection") == true &&
                httpContext.Items["IsDynamicConnection"] is bool isDynamic && isDynamic &&
                httpContext.Items["MongoDatabase"] is IMongoDatabase dynamicDatabase)
            {
                _logger.LogDebug("Using dynamic MongoDB connection for Resources collection");
                return dynamicDatabase.GetCollection<Resource>("Resources");
            }

            // Usar conexión por defecto
            _logger.LogDebug("Using default MongoDB connection for Resources collection");
            return _defaultDatabase.GetCollection<Resource>("Resources");
        }

        //[Get]
        public async Task<List<Resource>> GetResources()
        {
            var collection = GetCollection();
            return await collection.FindAsync(new BsonDocument()).Result.ToListAsync();
        }

        //[Get]
        public async Task<List<Resource>> GetRootResources()
        {
            var collection = GetCollection();
            var filter = Builders<Resource>.Filter.Eq(s => s.FolderId, null);
            return await collection.FindAsync(filter).Result.ToListAsync();
        }

        //[Get]
        public async Task<Resource> GetResourceById(string id)
        {
            var collection = GetCollection();
            var filter = Builders<Resource>.Filter.Eq("_id", new ObjectId(id));
            return await collection.FindAsync(filter).Result.FirstOrDefaultAsync();
        }

        //[Get]
        public async Task<List<Resource>> GetResourcesByName(string name)
        {
            var collection = GetCollection();
            var filter = Builders<Resource>.Filter.Regex(s => s.Name, new BsonRegularExpression(name, "i"));
            return await collection.FindAsync(filter).Result.ToListAsync();
        }

        //[Get]
        public async Task<List<Resource>> GetResourcesByFolderId(string folderId)
        {
            var collection = GetCollection();
            var filter = Builders<Resource>.Filter.Eq(s => s.FolderId, folderId);
            return await collection.FindAsync(filter).Result.ToListAsync();
        }

        //[Get]
        public async Task<List<Resource>> GetResourcesFavorites()
        {
            var collection = GetCollection();
            var filter = Builders<Resource>.Filter.Eq(s => s.Favorite, true);
            return await collection.FindAsync(filter).Result.ToListAsync();
        }

        //[Post]
        public async Task AddResource(Resource resource)
        {
            var collection = GetCollection();
            await collection.InsertOneAsync(resource);
        }

        //[Put]
        public async Task UpdateResource(Resource resource)
        {
            var collection = GetCollection();
            var filter = Builders<Resource>.Filter.Eq(s => s.Id, resource.Id);
            await collection.ReplaceOneAsync(filter, resource);
        }

        //[Delete]
        public async Task DeleteResource(string id)
        {
            var collection = GetCollection();
            var filter = Builders<Resource>.Filter.Eq(s => s.Id, id);
            await collection.DeleteOneAsync(filter);
        }

        public async Task DeleteResourcesByFolderId(string folderId)
        {
            var collection = GetCollection();
            var filter = Builders<Resource>.Filter.Eq(s => s.FolderId, folderId);
            await collection.DeleteManyAsync(filter);
        }
    }
}
