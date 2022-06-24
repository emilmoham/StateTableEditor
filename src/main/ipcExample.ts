import { dialog, ipcMain } from 'electron';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  // eslint-disable-next-line no-console
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});
