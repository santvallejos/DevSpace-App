using MongoDB.Driver;

namespace api.Infrastructure.Factories
{
    /// <summary>
    /// Factory interface para crear instancias de MongoDB dinámicamente basadas en connection strings
    /// </summary>
    public interface IMongoClientFactory
    {
        /// <summary>
        /// Obtiene una instancia de base de datos MongoDB basada en la connection string y nombre de base de datos
        /// </summary>
        /// <param name="connectionString">Connection string de MongoDB</param>
        /// <param name="databaseName">Nombre de la base de datos</param>
        /// <returns>Instancia de IMongoDatabase</returns>
        IMongoDatabase GetDatabase(string connectionString, string databaseName);
        
        /// <summary>
        /// Valida si una connection string es válida
        /// </summary>
        /// <param name="connectionString">Connection string a validar</param>
        /// <returns>True si es válida, false en caso contrario</returns>
        bool ValidateConnectionString(string connectionString);
    }
}
