const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.argv.includes('--dev');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true
        },
    });

    if (isDev) {
        // Modo desarrollo - cargar desde servidor Vite
        console.log('Ejecutando en modo desarrollo, cargando desde http://localhost:5173');
        win.loadURL('http://localhost:5173');
    } else {
        // Modo producción - cargar desde archivos compilados
        const indexPath = path.join(__dirname, '../client/dist/index.html');
        
        // Verificar si el archivo existe
        if (fs.existsSync(indexPath)) {
            console.log(`Cargando archivo: ${indexPath}`);
            win.loadFile(indexPath);
        } else {
            console.error(`Error: El archivo ${indexPath} no existe`);
            // Mostrar un mensaje de error en la ventana
            win.loadURL(`data:text/html,<html><body><h1>Error</h1><p>No se pudo cargar la aplicación. El archivo ${indexPath} no existe.</p><p>Asegúrate de ejecutar 'npm run build' en la carpeta client primero.</p></body></html>`);
        }
    }
    
    // Abrir DevTools para depuración
    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Manejar cierre de la aplicación
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});