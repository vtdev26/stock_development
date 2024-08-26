// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path')
const axios = require("axios");
const cors = require('cors');
const notifier = require('node-notifier');
const {
  formatData,
  currentDate,
  isWithinHOSETradingHours,
  numberWithCommas
} = require("./Util.js");

//Local variable initialize
let isTest = true;
let changePc = -11;
const stockSymbols = "LAS"; // Thay thế bằng danh sách mã chứng khoán thực tế

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./public/index.html')

  // Open the DevTools.
  // Bắt đầu gọi hàm với danh sách mã chứng khoán
  // startFetchingStockPrices(stockSymbols);
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  // Đăng ký một handler cho 'fetch-stock-data' IPC call
  // Đăng ký handler IPC
  ipcMain.handle('fetch-stock-data', async (event, symbol) => {

    try {
      const url = `https://bgapidatafeed.vps.com.vn/getliststockdata/${symbol}`;
      const response = await axios.get(url);
      console.log('Fetched URL:', url);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data from stock company:', error);
      throw error;
    }
  });

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

// Hàm để gửi thông báo
function sendNotification(data) {
  notifier.notify({
    title: 'Thông báo cổ phiếu',
    message: `LastPrice: ${data.lastPrice} - ChangePc: ${data.status} ${data.changePc} (${data.status} ${data.ot}) - Volume: ${data.lot}`,
    sound: true, // Phát âm thanh khi có thông báo (có thể bỏ qua nếu không cần)
    wait: true, // Chờ người dùng tương tác với thông báo (true hoặc false)
  });
}

// Hàm để lấy giá cổ phiếu từ API của VNDirect
async function getStockPriceList(symbol) {
  // This function returns the trading price board of a target stocks list.
  // Args:
  // stock_list (:obj:`str`, required): STRING list of symbols separated by "," without any space. Ex: "TCB,SSI,BID"

  const url = `https://bgapidatafeed.vps.com.vn/getliststockdata/${symbol}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

function startFetchingStockPrices(symbol) {
  try {
    setInterval(async () => {
      if (isWithinHOSETradingHours() || isTest) {
        const data = await getStockPriceList(symbol);
        if (data) {
          console.log("Ping.... ", currentDate());
          let status = '';
          if (data[0].r < data[0].lastPrice) {
            status = '+';
          }
          if (data[0].r > data[0].lastPrice) {
            status = '-';
          }
          if (changePc !== data[0].changePc) {
            changePc = data[0].changePc;
            sendNotification({
              lastPrice: data[0].lastPrice,
              changePc: data[0].changePc,
              ot: data[0].ot,
              lot: numberWithCommas(data[0].lot * 10),
              status: status
            });
            // console.log(data);

            // console.log(`Fetched data for ${symbol}:`, formatData(data));
          }
        }
      }
    }, 2000); // 5000 milliseconds = 5 seconds
  } catch (error) {
    log(error);
  }
}
