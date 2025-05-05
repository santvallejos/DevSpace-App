using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace api.Services
{
    public class MongoDbInitializer : IHostedService
    {
        private readonly IMongoClient _client;
        private readonly IMongoDatabase _database;
        private readonly ILogger<MongoDbInitializer> _logger;
        private const string DbName = "Unity";

        public MongoDbInitializer(IMongoClient client, IMongoDatabase database, ILogger<MongoDbInitializer> logger)
        {
            _client = client;
            _database = database;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            // Listar bases de datos
            var dbNames = await _client.ListDatabaseNamesAsync(cancellationToken: cancellationToken).Result.ToListAsync(cancellationToken);
            
            if (!dbNames.Contains(DbName))
                _logger.LogWarning("Base de datos '{db}' no encontrada. Se crearán las colecciones necesarias.", DbName);

            // Listar colecciones actuales
            var collections = await _database.ListCollectionNamesAsync(cancellationToken: cancellationToken)
                                             .Result
                                             .ToListAsync(cancellationToken);

            // Crear si faltan
            if (!collections.Contains("Folders"))
            {
                await _database.CreateCollectionAsync("Folders", cancellationToken: cancellationToken);  // :contentReference[oaicite:4]{index=4}
                _logger.LogInformation("Colección 'Folders' creada.");
            }
            if (!collections.Contains("Resources"))
            {
                await _database.CreateCollectionAsync("Resources", cancellationToken: cancellationToken); // :contentReference[oaicite:5]{index=5}
                _logger.LogInformation("Colección 'Resources' creada.");
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
