using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data.Models;
using api.Data.Repositories.Interfaces;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Data.Repositories.Collection
{
    public class ResourceCollection : IResourceCollection
    {
        private readonly IMongoCollection<Resource> Collection;

        public ResourceCollection(IMongoDatabase database)
        {
            Collection = database.GetCollection<Resource>("Resources");
        }

        //[Get]
        public async Task<List<Resource>> GetResources()
        {
            return await Collection.FindAsync(new BsonDocument()).Result.ToListAsync();
        }

        //[Get]
        public async Task<List<Resource>> GetRootResources()
        {
            var filter = Builders<Resource>.Filter.Eq(s => s.FolderId, null);
            return await Collection.FindAsync(filter).Result.ToListAsync();
        }

        //[Get]
        public async Task<Resource> GetResourceById(string id)
        {
            var filter = Builders<Resource>.Filter.Eq("_id", new ObjectId(id));
            return await Collection.FindAsync(filter).Result.FirstOrDefaultAsync();
        }

        //[Get]
        public async Task<List<Resource>> GetResourcesByName(string name)
        {
            var filter = Builders<Resource>.Filter.Regex(s => s.Name, new BsonRegularExpression(name, "i"));
            return await Collection.FindAsync(filter).Result.ToListAsync();
        }

        //[Get]
        public async Task<List<Resource>> GetResourcesByFolderId(string folderId)
        {
            var filter = Builders<Resource>.Filter.Eq(s => s.FolderId, folderId);
            return await Collection.FindAsync(filter).Result.ToListAsync();
        }

        //[Get]
        public async Task<List<Resource>> GetResourcesFavorites()
        {
            var filter = Builders<Resource>.Filter.Eq(s => s.Favorite, true);
            return await Collection.FindAsync(filter).Result.ToListAsync();
        }

        //[Post]
        public async Task AddResource(Resource resource)
        {
            await Collection.InsertOneAsync(resource);
        }

        //[Put]
        public async Task UpdateResource(Resource resource)
        {
            var filter = Builders<Resource>.Filter.Eq(s => s.Id, resource.Id);
            await Collection.ReplaceOneAsync(filter, resource);
        }

        //[Delete]
        public async Task DeleteResource(string id)
        {
            var filter = Builders<Resource>.Filter.Eq(s => s.Id, id);
            await Collection.DeleteOneAsync(filter);
        }

        public async Task DeleteResourcesByFolderId(string folderId)
        {
            var filter = Builders<Resource>.Filter.Eq(s => s.FolderId, folderId);
            await Collection.DeleteManyAsync(filter);
        }
    }
}
