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
            try
            {
                _logger.LogInformation("Intentando inicializar base de datos por defecto...");
                
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
                    await _database.CreateCollectionAsync("Folders", cancellationToken: cancellationToken);
                    _logger.LogInformation("Colección 'Folders' creada.");
                }
                if (!collections.Contains("Resources"))
                {
                    await _database.CreateCollectionAsync("Resources", cancellationToken: cancellationToken);
                    _logger.LogInformation("Colección 'Resources' creada.");
                }
                
                _logger.LogInformation("Base de datos por defecto inicializada correctamente.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "No se pudo inicializar la base de datos por defecto. Esto es normal si no hay configuración por defecto válida. Los usuarios podrán usar sus propias bases de datos.");
                // No propagamos la excepción para que la aplicación pueda iniciar
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
