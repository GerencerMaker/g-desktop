import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { getPrinters } from './printers' // Importa a função para obter impressoras

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    transparent: false,
    resizable: false,
    maximizable: false, // Impede maximização
    fullscreenable: false, // Impede tela cheia
    ...(process.platform === 'linux' ? {} : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Remove o menu completamente
  mainWindow.setMenu(null)

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Função para redimensionar a janela após o login
function resizeToMainWindow(): void {
  if (mainWindow) {
    mainWindow.setSize(900, 670, true)
    mainWindow.setResizable(true)
    mainWindow.setMaximizable(true) // Permite maximização após login
    mainWindow.setFullScreenable(true) // Permite tela cheia após login
    mainWindow.center()
  }
}

// Função para voltar ao modo de login
function resizeToLoginWindow(): void {
  if (mainWindow) {
    mainWindow.setSize(400, 600, true)
    mainWindow.setResizable(false)
    mainWindow.setMaximizable(false)
    mainWindow.setFullScreenable(false)
    mainWindow.center()
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('list-printers', async () => {
    return await getPrinters()
  })

  // Handler para redimensionar a janela após login
  ipcMain.handle('resize-window', () => {
    resizeToMainWindow()
  })

  // Handler para voltar ao modo de login
  ipcMain.handle('resize-to-login', () => {
    resizeToLoginWindow()
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
