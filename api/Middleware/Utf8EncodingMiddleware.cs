using System.Text;

namespace api.Middleware
{
    /// <summary>
    /// Middleware personalizado para asegurar el correcto manejo de caracteres especiales y encoding UTF-8.
    /// Este middleware intercepta las peticiones HTTP entrantes y garantiza que el contenido JSON
    /// se procese correctamente con codificación UTF-8, evitando problemas con caracteres especiales
    /// como paréntesis, comillas, backticks, asteriscos, etc.
    /// </summary>
    public class Utf8EncodingMiddleware
    {
        private readonly RequestDelegate _next; // El siguiente middleware en el pipeline

        private readonly ILogger<Utf8EncodingMiddleware> _logger; // Logger para registrar información de debugging

        // Constructor del middleware
        public Utf8EncodingMiddleware(RequestDelegate next, ILogger<Utf8EncodingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        // Método principal que procesa cada petición HTTP
        // <param name="context">Contexto HTTP de la petición actual</param>
        public async Task InvokeAsync(HttpContext context)
        {
            // Solo procesar peticiones con contenido JSON
            if (context.Request.ContentType?.Contains("application/json") == true)
            {
                // Habilitar buffering para poder leer el cuerpo múltiples veces
                context.Request.EnableBuffering();
                
                try
                {
                    // Leer el cuerpo de la petición con encoding UTF-8 explícito
                    using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
                    var body = await reader.ReadToEndAsync();
                    
                    // Log para debugging (útil para troubleshooting de caracteres especiales)
                    _logger.LogDebug("Procesando petición con cuerpo: {Body}", body);
                    
                    // Resetear la posición del stream para que el siguiente middleware pueda leerlo
                    context.Request.Body.Position = 0;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error al procesar el cuerpo de la petición con UTF-8");
                }
            }

            // Continuar con el siguiente middleware en el pipeline
            await _next(context);
        }
    }


    // Clase de extensión para facilitar el registro del middleware en Program.cs
    // Proporciona un método de extensión que simplifica la configuración
    public static class Utf8EncodingMiddlewareExtensions
    {

        // Registra el middleware Utf8EncodingMiddleware en el pipeline de ASP.NET Core
        // <param name="builder">El IApplicationBuilder para configurar el pipeline</param>
        // <returns>El mismo IApplicationBuilder para permitir method chaining</returns>
        public static IApplicationBuilder UseUtf8Encoding(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<Utf8EncodingMiddleware>();
        }
    }
}