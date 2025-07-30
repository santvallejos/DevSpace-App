using System.ComponentModel.Design;
using api.Data.Models;
using api.Data.Repositories.Collection;
using api.Data.Repositories.Interfaces;
using api.Data.Configuration;
using api.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
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

    options.ConnectionString = connectionString ?? throw new InvalidOperationException(
        "MongoDB connection string not found. Set MONGODB_CONNECTION_STRING environment variable or configure MongoDB:ConnectionString in appsettings.json");
    options.DatabaseName = databaseName;
});

// Register MongoDB services
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var settings = serviceProvider.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

builder.Services.AddSingleton<IMongoDatabase>(serviceProvider =>
{
    var client = serviceProvider.GetRequiredService<IMongoClient>();
    var settings = serviceProvider.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    return client.GetDatabase(settings.DatabaseName);
});

/* 
//Configuracion de MongoDB
builder.Services.AddSingleton<IMongoClient>(new MongoClient("mongodb://localhost:27017/DevSpace"));
builder.Services.AddSingleton<IMongoDatabase>(sp => sp.GetService<IMongoClient>()!.GetDatabase("Unity"));
*/

// Services
builder.Services.AddScoped<FolderServices>();
builder.Services.AddScoped<ResourceServices>();
builder.Services.AddHostedService<MongoDbInitializer>();

//Repositorios
builder.Services.AddScoped<IFolderCollection, FolderCollection>();
builder.Services.AddScoped<IResourceCollection, ResourceCollection>();

builder.Services.AddControllers();

var app = builder.Build();

// Habilitar CORS globalmente (permitir cualquier origen durante desarrollo)
app.UseCors(policy =>
    policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
);


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
