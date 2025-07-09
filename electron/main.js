const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, '../www/index.html'));
  // win.loadFile(path.join(__dirname, 'dist/ReMeDi-POC/index.html'));

   // Register back navigation shortcut
  win.webContents.on('did-finish-load', () => {
    globalShortcut.register('Alt+Left', () => {
      if (win.webContents.canGoBack()) {
        win.webContents.goBack();
      }
    });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll(); // Important to clean up
});