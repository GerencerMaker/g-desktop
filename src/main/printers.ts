import { BrowserWindow } from 'electron'
import { ThermalPrinter, types } from 'node-thermal-printer'

export async function getPrinters() {
  const window = BrowserWindow.getAllWindows()[0]
  if (window) {
    const printers = await window.webContents.getPrintersAsync()
    return printers
  }
  return [];
}


export async function print(content: any) {
  try {
    console.log('nome', content.printer.name);
    const thermalPrinter = new ThermalPrinter({
      type: types.EPSON, // ou STAR, dependendo da impressora
      interface: `printer:${content.printer.name}`,
      options: { timeout: 5000 },
      removeSpecialCharacters: false,
    });

    let isConnected = await thermalPrinter.isPrinterConnected();
    if (!isConnected) throw new Error('Não conectado');

    thermalPrinter.clear();    
    thermalPrinter.println(content.content);
    thermalPrinter.cut();
    await thermalPrinter.execute();

    console.log('Impressão concluída com sucesso!');
  } catch (err) {
    console.error('Erro ao imprimir:', err);
  }
}
