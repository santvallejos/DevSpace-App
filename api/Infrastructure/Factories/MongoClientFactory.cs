using System.Collections.Concurrent;
using MongoDB.Driver;

namespace api.Infrastructure.Factories
{
    /// <summary>
    /// Factory para crear y administrar instancias de MongoDB dinámicamente
    /// Mantiene un cache de clientes para eficiencia y reutilización
    /// </summary>
    public class MongoClientFactory : IMongoClientFactory
    {
        private readonly ConcurrentDictionary<string, IMongoClient> _clients = new();
        private readonly ILogger<MongoClientFactory> _logger;

        public MongoClientFactory(ILogger<MongoClientFactory> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Obtiene una instancia de base de datos MongoDB basada en la connection string y nombre de base de datos
        /// Utiliza cache para reutilizar clientes existentes
        /// </summary>
        /// <param name="connectionString">Connection string de MongoDB</param>
        /// <param name="databaseName">Nombre de la base de datos</param>
        /// <returns>Instancia de IMongoDatabase</returns>
        public IMongoDatabase GetDatabase(string connectionString, string databaseName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(connectionString))
                    throw new ArgumentException("Connection string cannot be null or empty", nameof(connectionString));

                if (string.IsNullOrWhiteSpace(databaseName))
                    throw new ArgumentException("Database name cannot be null or empty", nameof(databaseName));

                // Obtener o crear cliente usando cache
                var client = _clients.GetOrAdd(connectionString, conn =>
                {
                    _logger.LogInformation("Creating new MongoDB client for connection string hash: {Hash}", 
                        conn.GetHashCode());
                    return new MongoClient(conn);
                });

                return client.GetDatabase(databaseName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating MongoDB database instance");
                throw;
            }
        }

        /// <summary>
        /// Valida si una connection string es válida
        /// </summary>
        /// <param name="connectionString">Connection string a validar</param>
        /// <returns>True si es válida, false en caso contrario</returns>
        public bool ValidateConnectionString(string connectionString)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(connectionString))
                    return false;

                // Intentar crear un MongoUrl para validar el formato
                var mongoUrl = MongoUrl.Create(connectionString);
                return mongoUrl != null;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Invalid connection string provided");
                return false;
            }
        }

        /// <summary>
        /// Limpia el cache de clientes (útil para testing o cuando se necesite liberar recursos)
        /// </summary>
        public void ClearCache()
        {
            _logger.LogInformation("Clearing MongoDB client cache");
            _clients.Clear();
        }

        /// <summary>
        /// Obtiene el número de clientes en cache
        /// </summary>
        public int GetCachedClientsCount()
        {
            return _clients.Count;
        }
    }
}
