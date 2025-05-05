using System.ComponentModel.Design;
using api.Data.Models;
using api.Data.Repositories.Collection;
using api.Data.Repositories.Interfaces;
using api.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(); // permitimos configurar CORS
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Services
builder.Services.AddScoped<FolderServices>();
builder.Services.AddScoped<ResourceServices>();
builder.Services.AddHostedService<MongoDbInitializer>();

//Configuracion de MongoDB
builder.Services.AddSingleton<IMongoClient>(new MongoClient("mongodb://localhost:27017/DevSpace"));
builder.Services.AddSingleton<IMongoDatabase>(sp => sp.GetService<IMongoClient>()!.GetDatabase("Unity"));

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
