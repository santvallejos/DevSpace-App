using System.ComponentModel.Design;
using System.Text;
using System.Text.Json;
using api.Data.Models;
using api.Data.Repositories.Collection;
using api.Data.Repositories.Interfaces;
using api.Data.Configuration;
using api.Services;
using api.Middleware;
using api.Infrastructure.Factories;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

// Configuración para manejo correcto de caracteres especiales y encoding UTF-8
builder.Services.AddControllers()
.AddJsonOptions(options =>
{
    // Configuración de JSON para preservar caracteres especiales
    // UnsafeRelaxedJsonEscaping permite que caracteres como (), "", ``, *, etc. se mantengan sin escapar
    options.JsonSerializerOptions.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.WriteIndented = true;
    // Asegurar que los strings se procesen correctamente
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.Never;
});

builder.Services.AddOpenApi();
builder.Services.AddCors(); // permitimos configurar CORS
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath); // Habilita la lectura de los comentarios XML
}); //Configuracion de Swagger

// Configure MongoDB Atlas with environment variables support
builder.Services.Configure<MongoDbSettings>(options =>
{
    // Priority: Environment variables > appsettings.json
    var connectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING") 
                            ?? builder.Configuration.GetSection("MongoDB:ConnectionString").Value;
    var databaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME") 
                        ?? builder.Configuration.GetSection("MongoDB:DatabaseName").Value 
                        ?? "Unity";

    // Solo configurar si hay una connection string válida
    if (!string.IsNullOrWhiteSpace(connectionString) && 
        !connectionString.Contains("<username>") && 
        !connectionString.Contains("<db_password>"))
    {
        options.ConnectionString = connectionString;
        options.DatabaseName = databaseName;
    }
    else
    {
        // Configuración por defecto para desarrollo local (opcional)
        options.ConnectionString = "mongodb://localhost:27017/";
        options.DatabaseName = databaseName;
    }
});

// Register MongoDB services - Configuración robusta para soportar solo conexiones dinámicas
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var settings = serviceProvider.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    var logger = serviceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Configurando cliente MongoDB por defecto con: {ConnectionString}", settings.ConnectionString);
        return new MongoClient(settings.ConnectionString);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "No se pudo crear el cliente MongoDB por defecto. La aplicación funcionará solo con conexiones dinámicas.");
        // Crear un cliente ficticio que no se usará realmente
        return new MongoClient("mongodb://localhost:27017/");
    }
});

builder.Services.AddSingleton<IMongoDatabase>(serviceProvider =>
{
    var logger = serviceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        var client = serviceProvider.GetRequiredService<IMongoClient>();
        var settings = serviceProvider.GetRequiredService<IOptions<MongoDbSettings>>().Value;
        logger.LogInformation("Configurando base de datos MongoDB por defecto: {DatabaseName}", settings.DatabaseName);
        return client.GetDatabase(settings.DatabaseName);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "No se pudo crear la base de datos MongoDB por defecto. Solo funcionarán conexiones dinámicas.");
        // Crear una instancia ficticia para satisfacer la DI
        var client = new MongoClient("mongodb://localhost:27017/");
        return client.GetDatabase("Unity");
    }
});

// Register MongoDB Factory for dynamic connections
builder.Services.AddSingleton<IMongoClientFactory, MongoClientFactory>();

// Add HttpContextAccessor for accessing HTTP context in repositories
builder.Services.AddHttpContextAccessor();

/* 
//Configuracion de MongoDB
builder.Services.AddSingleton<IMongoClient>(new MongoClient("mongodb://localhost:27017/DevSpace"));
builder.Services.AddSingleton<IMongoDatabase>(sp => sp.GetService<IMongoClient>()!.GetDatabase("Unity"));
*/

//Servicios
builder.Services.AddScoped<FolderServices>();
builder.Services.AddScoped<ResourceServices>();
// MongoDbInitializer deshabilitado para permitir funcionamiento solo con conexiones dinámicas
// builder.Services.AddHostedService<MongoDbInitializer>();

//Repositorios - Usar repositorios dinámicos que soportan múltiples conexiones
builder.Services.AddScoped<IFolderCollection, DynamicFolderCollection>();
builder.Services.AddScoped<IResourceCollection, DynamicResourceCollection>();

builder.Services.AddControllers();

var app = builder.Build();

// Habilitar CORS globalmente (permitir cualquier origen durante desarrollo)
app.UseCors(policy =>
    policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
);

// Usar middleware personalizado para manejo de UTF-8 y caracteres especiales
app.UseMiddleware<Utf8EncodingMiddleware>();

// Usar middleware para conexiones dinámicas de MongoDB
app.UseDynamicMongoDB();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
