## 👨‍🚀 Devspace 🚀

<!-- Nesito agregar una imagen -->
<img src="/client/public/Devspace - banner.png" alt="Devspace"/>
Centralize and manage your resources in a customizable way.

## ¿What is Devspace?

Devspace is an application designed to help you organize and access all your resources efficiently. Its main objective is to allow users to customize a resource storage unit, optimizing search times.

## Technology
- .Net 
- React
- MongoDB
- Electron
- Shadcn UI y Magic UI

<hr />

## Installation & Requirements

### Prerequisites
- [.NET 9](https://dotnet.microsoft.com/en-us/download/dotnet/9.0) installed
- A valid MongoDB Atlas connection URL

### Installation Steps
1. Clone or download the repository:
   ```sh
   git clone https://github.com/santvallejos/DevSpace-App.git
   ```
2. Open the project in your IDE
3. (Optional) Install dependencies in the root folder:
   ```sh
   npm install
   ```
4. Go to the client directory and install dependencies:
   ```sh
   cd client
   npm install
   ```
5. Go back to the root and enter the API directory:
   ```sh
   cd ../
   cd api
   ```
6. Create the files `appsettings.json` and `appsettings.Development.json` inside the `api` folder.
appsettings.json
```json
{
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
        }
    },
    "AllowedHosts": "*",
    "MongoDB": {
        "ConnectionString": "mongodb+srv://<username>:<db_password>@devspace.yu6f9pg.mongodb.net/?retryWrites=true&w=majority&appName=Devspace",
        "DatabaseName": "Unity"
    },
    "ConnectionStrings": {
        "DefaultConnection": "mongodb://localhost:27017/DevSpace",
        "Database": "Unity"
    }
}
```
appsettings.Development.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
    "MongoDB": {
        "ConnectionString": "mongodb+srv://<username>:<db_password>@devspace.yu6f9pg.mongodb.net/?retryWrites=true&w=majority&appName=Devspace",
        "DatabaseName": "Unity"
    } 
}
```

7. Add your MongoDB Atlas connection URL in both files.
8. Restore .NET dependencies:
   ```sh
   dotnet restore
   ```
9.  Run the API:
   ```sh
   dotnet run
   ```


## Architecture
The architecture of this project is a monorepo with a separation by functionality in the project which is divided by:

    Devspace/
        ├── API
        ├── Client
        └── Electron

* API: Backend con .Net y MongoDB como base de datos.
* Client: Frontend del proyecto con React que ocupa las librerías Shadcn y 
* Magic UI con Tailwind 4.
* Electron: Empaquetación de la app que contendrá y ejecutará tanto el backend como el frontend.

## API
The structure of the Devspace backend is developed with .Net and follows a layered architecture. This allows the API to clearly divide tasks and responsibilities, thus generating scalability and maintainability. Below is a graph of the main components:

    API/
    ├── Controllers/
    ├── Data/
    │       ├── Models/
    │       └── Repositories/
    ├── Infrastructure/Dto/
    ├── Services/
    ├── Properties/
    ├── Program.cs
    └── appsettings.json

## Client
The application's frontend is client-side with a modular architecture using React, Typescript, and Vite, and styles are implemented with Tailwind 4.

    client/
    ├── public/                
    ├── dist/                  
    ├── src/                  
    │   ├── components/        
    │   ├── contexts/          
    │   ├── hooks/             
    │   ├── layouts/           
    │   ├── lib/               
    │   ├── models/            
    │   ├── pages/             
    │   ├── services/          
    │   ├── stores/            
    │   ├── App.tsx            
    │   ├── main.tsx           
    │   └── layout.tsx         
    ├── .env                   
    ├── vite.config.ts        
    └── tsconfig*.json

## Electron
This folder contains the main.js file, which encapsulates the entire application so that both the API and the client can function correctly as a desktop application. It also contains the package.json file, which contains the main Electron configuration.

<hr/>

## Proper use
Main development and explanation for the correct use of the application, main flows and examples of endpoints, methods and responses.

## Dashboard
When you launch the app, the main page displayed is the dashboard, which is divided into three sections: Recent, Favorites, and Recommended.
<br/>
Recent:<br/>
Recent resources are added as the user stores resources on their drive. Currently, a request is made to the `/Resource/recents` API, so the response is the 6 most recently added resources. Allowed actions:
- Dialog for more information about the resource
- Checkbox for favorites
- Dialog for moving resources with the unit tree
- Alert dialog for editing
- Alert dialog for deleting

Favorites:<br/>
In this section, you can add resources by assigning them as favorites using the checkbox. Unlike the Recent checkbox, this one has no limits and allows you to remove resources not only by deleting them from the database, but also by unmarking them as favorites. Allowed actions:
<br/>
- Dialog for more information about the resource
- Checkbox for favorites
- Dialog for moving resources with the unit tree
- Alert dialog for editing
- Alert dialog for deleting


Recommended:<br/>
Finally, the dashboard contains a section where the application queries certain remote resources that may be of interest to the user, such as libraries, job postings, blogs of interest, technology news, etc. Allowed actions:
<br/>
- Dialog for more information about the resource

## Unit
The unit is the main function of Devspace, it allows you to navigate in the storage unit of our resources, dividing between folders, it has a lazy loading navigation system that is applied to the flat tree, there are two sections that allow you to identify which are the folders and which are the resources that the folder we are currently viewing contains.
<br/>
Breadcrumb:<br/>
The Breadcrumb is a Shandcn component that helps visualize the path or navigation we are taking within the unit. Some changes were made to the application so that it updates as the user navigates. It also includes the ability to select one of its folders to navigate to it.
<br/>
Search System <br/>
The search engine modifies the currently displayed folders and preview resources to allow searching by name entered in the search input. This will be done for the entire unit, and the view of the current folder will not be updated or modified until the search is confirmed.
<br/>
Drop-down button to add an item <br/>
To add an item to the unit, you can access it from the bottom right corner. Clicking on it will display a menu where you can select the item you want to add.
<br/>
- To add a folder, you just need to enter its name and select its location.
- To add a resource (currently we can only add links), you need to enter its name, optionally a description, the address of your link, and select its location.

Folders <br/>
Previewing a folder allows you to identify the names of the subfolders you're currently in. It then has a button that displays the actions you can perform on them, which are:
<br/>
- Rename
- Move to a folder or root of the drive
- Delete

Resources<br/>
The resource preview is very similar to what we see in the dashboard, but here you can find all the resources contained in the current folder.
