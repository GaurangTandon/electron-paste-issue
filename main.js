// Modules to control application life and create native browser window
const {app, BrowserWindow, clipboard} = require('electron')
const path = require('path')
const { Key, keyboard } = require('@nut-tree/nut-js');
keyboard.config.autoDelayMs = 1;

async function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  await mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  console.log('Switch to Notepad in 5seconds to see demo');
  setTimeout(doClipboard, 5000);
}

const superKey = process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl;
const pasteShortcut = [superKey, Key.V];

async function doClipboard() {
  console.log('Starting clipboard demo');
  for (let i = 0; i < 1000; i++) {
    clipboard.write({ text: i + 'This should be pasted\n', html: i + '<b>bold stuff</b><br>' });
    await keyboard.pressKey(...pasteShortcut);
    await keyboard.releaseKey(...pasteShortcut);
    clipboard.write({ text: i + 'This should NOT be pasted\n', html: i + '<b>do not paste bold stuff</b><br>' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
