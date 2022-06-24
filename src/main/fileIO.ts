import { dialog, ipcMain } from 'electron';
import { readFile } from 'fs';

async function loadFile(event: Electron.IpcMainEvent) {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'BubbleLink Application Table', extensions: ['app'] }],
  });

  readFile(filePaths[0], 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return false;
    }

    event.reply('file-io', ['load', filePaths[0], data]);
    return true;
  });
}

ipcMain.on('file-io', async (event, args) => {
  switch (args[0]) {
    case 'load':
      await loadFile(event);
      break;
    default:
      console.log(`Operation ${args[0]} not supported`);
  }
});
