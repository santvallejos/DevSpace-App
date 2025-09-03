using api.Infrastructure.Factories;
using MongoDB.Driver;

namespace api.Middleware
{
    /// <summary>
    /// Middleware para manejo dinámico de conexiones MongoDB basado en headers HTTP
    /// Intercepta los headers X-MongoDB-Connection y X-MongoDB-Database para configurar la conexión dinámicamente
    /// </summary>
    public class DynamicMongoDbMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<DynamicMongoDbMiddleware> _logger;
        private readonly string _defaultDatabaseName;

        // Headers esperados
        public const string CONNECTION_STRING_HEADER = "X-MongoDB-Connection";
        public const string DATABASE_NAME_HEADER = "X-MongoDB-Database";

        public DynamicMongoDbMiddleware(RequestDelegate next, ILogger<DynamicMongoDbMiddleware> logger, IConfiguration configuration)
        {
            _next = next;
            _logger = logger;
            _defaultDatabaseName = configuration["MongoDB:DatabaseName"] ?? "Unity";
        }

        public async Task InvokeAsync(HttpContext context, IMongoClientFactory mongoClientFactory)
        {
            try
            {
                // Verificar si el request contiene headers de MongoDB
                if (context.Request.Headers.ContainsKey(CONNECTION_STRING_HEADER))
                {
                    var connectionString = context.Request.Headers[CONNECTION_STRING_HEADER].FirstOrDefault();
                    var databaseName = context.Request.Headers[DATABASE_NAME_HEADER].FirstOrDefault() ?? _defaultDatabaseName;

                    if (string.IsNullOrWhiteSpace(connectionString))
                    {
                        _logger.LogWarning("Empty connection string provided in header");
                        context.Response.StatusCode = 400;
                        await context.Response.WriteAsync("Connection string cannot be empty");
                        return;
                    }

                    // Validar la connection string
                    if (!mongoClientFactory.ValidateConnectionString(connectionString))
                    {
                        _logger.LogWarning("Invalid connection string provided");
                        context.Response.StatusCode = 400;
                        await context.Response.WriteAsync("Invalid MongoDB connection string");
                        return;
                    }

                    // Crear la instancia de base de datos y almacenarla en el contexto HTTP
                    try
                    {
                        var database = mongoClientFactory.GetDatabase(connectionString, databaseName);
                        
                        // Almacenar la instancia en el contexto para que los servicios puedan acceder a ella
                        context.Items["MongoDatabase"] = database;
                        context.Items["IsDynamicConnection"] = true;
                        context.Items["DatabaseName"] = databaseName;

                        _logger.LogInformation("Dynamic MongoDB connection established for database: {DatabaseName}", databaseName);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to establish MongoDB connection");
                        context.Response.StatusCode = 500;
                        await context.Response.WriteAsync("Failed to establish database connection");
                        return;
                    }
                }
                else
                {
                    // No hay headers dinámicos, usar conexión por defecto
                    context.Items["IsDynamicConnection"] = false;
                    _logger.LogDebug("Using default MongoDB connection");
                }

                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DynamicMongoDbMiddleware");
                context.Response.StatusCode = 500;
                await context.Response.WriteAsync("Internal server error");
            }
        }
    }

    /// <summary>
    /// Extension method para registrar el middleware fácilmente
    /// </summary>
    public static class DynamicMongoDbMiddlewareExtensions
    {
        public static IApplicationBuilder UseDynamicMongoDB(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<DynamicMongoDbMiddleware>();
        }
    }
}
