// Minimal preload — contextIsolation is on, no Node APIs exposed to renderer
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("homxDesktop", {
  version: process.env.npm_package_version ?? "1.0.0",
  platform: process.platform,
});
