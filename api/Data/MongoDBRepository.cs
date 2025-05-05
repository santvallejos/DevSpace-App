using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Data
{
    public class MongoDBRepository
    {
        public MongoClient client;
        public IMongoDatabase database;

        public MongoDBRepository()
        {
            client = new MongoClient("mongodb://localhost:27017/DevSpace");
            database = client.GetDatabase("Unity");
        }
    }
}
