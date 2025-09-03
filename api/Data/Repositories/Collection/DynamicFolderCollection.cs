using api.Data.Models;
using api.Data.Repositories.Interfaces;
using MongoDB.Driver;
using MongoDB.Bson;

namespace api.Data.Repositories.Collection
{
    /// <summary>
    /// Repositorio dinámico para Folders que soporta múltiples conexiones MongoDB
    /// </summary>
    public class DynamicFolderCollection : IFolderCollection
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMongoDatabase _defaultDatabase;
        private readonly ILogger<DynamicFolderCollection> _logger;

        public DynamicFolderCollection(
            IMongoDatabase defaultDatabase, 
            IHttpContextAccessor httpContextAccessor,
            ILogger<DynamicFolderCollection> logger)
        {
            _defaultDatabase = defaultDatabase;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene la instancia de la colección de Folders basada en el contexto actual
        /// </summary>
        private IMongoCollection<Folder> GetCollection()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            
            // Verificar si hay una conexión dinámica en el contexto
            if (httpContext?.Items.ContainsKey("MongoDatabase") == true && 
                httpContext.Items.ContainsKey("IsDynamicConnection") == true &&
                httpContext.Items["IsDynamicConnection"] is bool isDynamic && isDynamic &&
                httpContext.Items["MongoDatabase"] is IMongoDatabase dynamicDatabase)
            {
                _logger.LogDebug("Using dynamic MongoDB connection for Folders collection");
                return dynamicDatabase.GetCollection<Folder>("Folders");
            }

            // Usar conexión por defecto
            _logger.LogDebug("Using default MongoDB connection for Folders collection");
            return _defaultDatabase.GetCollection<Folder>("Folders");
        }

        //[Get]  
        public async Task<List<Folder>> GetFolders()
        {
            var collection = GetCollection();
            return await collection.FindAsync(new BsonDocument()).Result.ToListAsync();
        }

        //[Get]  
        public async Task<Folder> GetFolderById(string id)
        {
            var collection = GetCollection();
            var filter = Builders<Folder>.Filter.Eq("_id", new ObjectId(id));
            return await collection.FindAsync(filter).Result.FirstOrDefaultAsync();
        }

        //[Get]
        public async Task<List<Folder>> GetFoldersByParentFolderID(string ParentFolderID)
        {
            var collection = GetCollection();
            var filter = Builders<Folder>.Filter.Eq("ParentFolderID", ParentFolderID);
            return await collection.FindAsync(filter).Result.ToListAsync();
        }

        //[Get]  
        public async Task<List<Folder>> GetFoldersByName(string name)
        {
            var collection = GetCollection();
            var filter = Builders<Folder>.Filter.Regex(s => s.Name, new BsonRegularExpression(name, "i"));
            return await collection.FindAsync(filter).Result.ToListAsync();
        }

        //[Get]  
        public async Task<List<string>> GetSubFolders(string id)
        {
            var collection = GetCollection();
            var filter = Builders<Folder>.Filter.Eq("_id", new ObjectId(id));
            return (await collection.FindAsync(filter).Result.FirstOrDefaultAsync()).SubFolders;
        }

        //[Post]  
        public async Task AddFolder(Folder folder)
        {
            var collection = GetCollection();
            await collection.InsertOneAsync(folder);
        }

        //[Put]  
        public async Task UpdateFolder(Folder folder)
        {
            var collection = GetCollection();
            var filter = Builders<Folder>.Filter.Eq(s => s.Id, folder.Id);
            await collection.ReplaceOneAsync(filter, folder);
        }

        //[Delete]  
        public async Task DeleteFolder(string id)
        {
            var collection = GetCollection();
            var filter = Builders<Folder>.Filter.Eq("_id", new ObjectId(id));
            await collection.DeleteOneAsync(filter);
        }
    }
}
