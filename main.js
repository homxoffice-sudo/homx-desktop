const { app, BrowserWindow, Menu, shell, nativeImage } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

const APP_URL = "https://homx.ai";
const MIN_WIDTH = 1024;
const MIN_HEIGHT = 700;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    title: "Homx",
    icon: path.join(__dirname, "assets", "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
    backgroundColor: "#ffffff",
    show: false,
  });

  mainWindow.loadURL(APP_URL);

  // Show after paint to avoid white flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Open external links in the default browser, not inside the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(APP_URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(APP_URL) && !url.startsWith("about:")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

function buildMenu() {
  const template = [
    {
      label: "Homx",
      submenu: [
        { label: "אודות Homx", click: () => shell.openExternal(`${APP_URL}/features`) },
        { type: "separator" },
        { label: "בדוק עדכונים", click: () => autoUpdater.checkForUpdatesAndNotify() },
        { type: "separator" },
        { role: "quit", label: "סגור" },
      ],
    },
    {
      label: "עריכה",
      submenu: [
        { role: "undo", label: "בטל" },
        { role: "redo", label: "חזור" },
        { type: "separator" },
        { role: "cut", label: "גזור" },
        { role: "copy", label: "העתק" },
        { role: "paste", label: "הדבק" },
        { role: "selectAll", label: "בחר הכל" },
      ],
    },
    {
      label: "תצוגה",
      submenu: [
        { role: "reload", label: "רענן" },
        { role: "forceReload", label: "רענן בכוח" },
        { type: "separator" },
        { role: "resetZoom", label: "גודל רגיל" },
        { role: "zoomIn", label: "הגדל" },
        { role: "zoomOut", label: "הקטן" },
        { type: "separator" },
        { role: "togglefullscreen", label: "מסך מלא" },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});
