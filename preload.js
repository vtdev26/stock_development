const { contextBridge, ipcRenderer } = require('electron');
const path = require("node:path");
const utils = require(path.join(__dirname, "./Util.js"));

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data)
});

// Expose các hàm cần thiết cho renderer
contextBridge.exposeInMainWorld('utils', utils);