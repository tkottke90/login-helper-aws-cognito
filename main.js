const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const electron = require('electron');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

const package = require('./package.json');
const aws = require('./services/aws-login');

const configLocation = path.resolve(__dirname, 'app-data', 'app.json');
let config;
// Setup //

async function setup() {
  await findOrCreateDir(path.resolve(__dirname, 'app-data'));

  const appFile = await findOrCreateFile(configLocation, JSON.stringify({ lastPool: '' }, null, 2));

  config = JSON.parse(appFile);
}


// Main //
async function main() {
  await setup();

  function createWindow() {
    let window = new electron.BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true
      }
    });

    window.loadFile(path.resolve(__dirname, 'public', 'index.html'));
    window.webContents.openDevTools();

    electron.ipcMain.on('load config', (event, arg) => {
      event.reply('load config', config);
    });;

    electron.ipcMain.on('login', async (event, arg) => {

      try {
        const result = await aws(arg.pool, arg.username, arg.password);

        config.lastPool = arg.pool;
        await writeFile(configLocation, JSON.stringify(config, null, 2), 'utf8');

        event.reply('login result', result);
      } catch (err) {
        event.reply('login error', { err });
      }
    });
  }

  electron.app.whenReady().then(createWindow);
}

main();

// Util //

async function findOrCreateFile(filePath, defaultValue = '') {
  const fileExists = await exists(filePath);

  if (!fileExists) {
    await writeFile(filePath, defaultValue, 'utf8');
  }

  return await readFile(filePath, 'utf8');
}

async function findOrCreateDir(filePath) {
  const dirExists = await exists(filePath);

  if (!dirExists) {
    await mkdir(filePath);
  }
}