using MongoDB.Driver;
using Microsoft.Extensions.Options;
using api.Data.Configuration;

namespace api.Data
{
    public class MongoDBRepository
    {
        public MongoClient client;
        public IMongoDatabase database;

        /* Mongo Atlas */
        public MongoDBRepository(IOptions<MongoDbSettings> mongoDbSettings)
        {
            var settings = mongoDbSettings.Value;
            client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase(settings.DatabaseName);
        }

        // Constructor para compatibilidad con código existente (será removido gradualmente)
        [Obsolete("Use constructor with IOptions<MongoDbSettings> instead")]
        /* MongoDB local */
        public MongoDBRepository()
        {
            client = new MongoClient("mongodb://localhost:27017/DevSpace");
            database = client.GetDatabase("Unity");
        }
    }
}
