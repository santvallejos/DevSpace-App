const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
    // Iniciar el backend .NET como proceso hijo
    const apiProject = path.join(__dirname, '../api/api.csproj');
    const api = spawn('dotnet', ['run', '--project', apiProject], { cwd: path.dirname(apiProject) });
    api.stdout.on('data', data => console.log(`[API] ${data}`));
    api.stderr.on('data', data => console.error(`[API Error] ${data}`));

    // Crear la ventana del frontend
    const win = new BrowserWindow({
        width: 800, height: 600,
        webPreferences: {
            nodeIntegration: false,  // renderer sin Node.js directo (opcional preload)
            contextIsolation: true
        }
    });

    // Cargar la UI de React (modo desarrollo o producción)
    if (process.env.NODE_ENV === 'development') {
        // Desarrollo: recarga en caliente desde Vite
        win.loadURL('http://localhost:5173');
    } else {
        // Producción: archivos estáticos compilados
        win.loadFile(path.join(__dirname, '../client/dist/index.html'));
    }
}

app.whenReady().then(createWindow);