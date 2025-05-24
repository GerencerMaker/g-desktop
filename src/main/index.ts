import { app, shell, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { getPrinters } from './printers' // Importa a função para obter impressoras
import menuTemplate from './config/menu.template'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

function createTray(): void {
  // Create tray icon
  const icon = nativeImage.createFromPath(join(__dirname, '../../resources/icon.png'))
  tray = new Tray(icon.resize({ width: 16, height: 16 }))
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Mostrar Aplicativo', 
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    { type: 'separator' },
    { 
      label: 'Sair', 
      click: () => {
        app.quit()
      }
    }
  ])
  
  tray.setToolTip('Gerencer Desktop')
  tray.setContextMenu(contextMenu)
  
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    autoHideMenuBar: true, // Keep this as true if you want to initially hide it
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

  // Handle window close event
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
      return false
    }
    return true
  })

  // Do NOT set the menu here initially.
  // mainWindow.setMenu(menuTemplate);

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

function resizeToMainWindow(): void {
  if (mainWindow) {
    mainWindow.setSize(900, 670, true)
    mainWindow.setResizable(true)
    mainWindow.setMaximizable(true) // Permite maximização após login
    mainWindow.setFullScreenable(true) // Permite tela cheia após login
    mainWindow.center()
    console.log(menuTemplate)
    const menu = Menu.buildFromTemplate(menuTemplate);
    mainWindow.setMenu(menu);
    mainWindow.setAutoHideMenuBar(false); // Show the menu bar
  }
}

function resizeToLoginWindow(): void {
  if (mainWindow) {
    mainWindow.setSize(400, 600, true)
    mainWindow.setResizable(false)
    mainWindow.setMaximizable(false)
    mainWindow.setFullScreenable(false)
    mainWindow.center()
    mainWindow.setMenu(null); // Remove the menu for the login screen
    mainWindow.setAutoHideMenuBar(true); // Hide the menu bar
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

  ipcMain.handle('resize-window', () => {
    console.log('Resizing to main window');
    resizeToMainWindow()
  })

  // Handler para voltar ao modo de login
  ipcMain.handle('resize-to-login', () => {
    resizeToLoginWindow()
  })

  createWindow()
  createTray()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    isQuitting = true
    app.quit()
  }
})

// Add before-quit handler
app.on('before-quit', () => {
  isQuitting = true
})