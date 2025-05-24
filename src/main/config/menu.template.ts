// config/menu.template.ts
import { MenuItemConstructorOptions } from 'electron';

const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      { label: 'New' },
      { type: 'separator' },
      { label: 'Exit', role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', role: 'undo' },
      { label: 'Redo', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', role: 'cut' },
      { label: 'Copy', role: 'copy' },
      { label: 'Paste', role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { label: 'Reload', role: 'reload' },
      { label: 'Toggle Developer Tools', role: 'toggleDevTools' }
    ]
  }
];

export default menuTemplate;