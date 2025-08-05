import { BrowserWindow } from 'electron'

export async function getPrinters() {
  const window = BrowserWindow.getAllWindows()[0]
  if (window) {
    const printers = await window.webContents.getPrintersAsync()
    return printers
  }
  return [];
}
