// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const axios = require("axios");
const cors = require("cors");
const notifier = require("node-notifier");
const {
  formatData,
  currentDate,
  isWithinHOSETradingHours,
  numberWithCommas,
} = require("./Util.js");
const { format } = require("date-fns");

//Local variable initialize
let isTest = true;
let changePc = -11;
const stockSymbols = "LAS"; // Thay thế bằng danh sách mã chứng khoán thực tế
const stockChangePcHistory = [];

function createWindow() {
  // Create the browser window.
  // const mainWindow = new BrowserWindow({
  //   width: 320,
  //   height: 615,
  //   webPreferences: {
  //     preload: path.join(__dirname, './preload.js'),
  //     contextIsolation: true, // Cách ly ngữ cảnh
  //     nodeIntegration: true, // Kích hoạt Node.js trong renderer process
  //     enableRemoteModule: false,
  //     nodeIntegration: false, // Vô hiệu hóa tích hợp Node.js
  //   }
  // })

  const mainWindow = new BrowserWindow({
    width: 470,
    height: 900,
    alwaysOnTop: false, // Đặt cửa sổ luôn ở trên cùng
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      contextIsolation: true, // Cách ly ngữ cảnh
      nodeIntegration: true, // Kích hoạt Node.js trong renderer process
      enableRemoteModule: false,
      nodeIntegration: false, // Vô hiệu hóa tích hợp Node.js
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("./public/index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  ipcMainRegister();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function ipcMainRegister() {
  // Đăng ký một handler cho 'fetch-stock-data' IPC call
  // Đăng ký handler IPC
  ipcMain.handle("fetch-stock-data", async (event, symbol) => {
    try {
      const responseData = startFetchingStockPrices(symbol);
      return responseData;
    } catch (error) {
      console.error("Error fetching stock data from stock company:", error);
      throw error;
    }
  });

  ipcMain.handle("fetch-intraday", async (event, symbol) => {
    try {
      const responseData = await getStockIntraday(symbol);
      return responseData;
    } catch (error) {
      console.error("Error fetching Intraday:", error);
      throw error;
    }
  });

  ipcMain.handle("fetch-price-stock-history", async (event, symbol) => {
    try {
      const responseData = await getPriceHistory(symbol);
      return responseData;
    } catch (error) {
      console.error("Error fetching Intraday:", error);
      throw error;
    }
  });

  ipcMain.handle("fetch-vnindex-infor", async () => {
    try {
      const responseData = await getVnIndexInfor();
      return responseData;
    } catch (error) {
      console.error("Error fetching Intraday:", error);
      throw error;
    }
  });
}

// Hàm để gửi thông báo
function sendNotification(data) {
  notifier.notify({
    title: "Stock Notification",
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

// Hàm để lấy dữ liệu khối lượng khớp lệnh
async function getStockIntraday(symbol) {
  try {
    // Gọi API của Vietcap
    if (isWithinHOSETradingHours() || isTest) {
      const response = await axios.post(
        "https://mt.vietcap.com.vn/api/market-watch/LEData/getAll",
        {
          symbol: symbol || "VCB", // Giá trị mặc định là 'VCB' nếu không có
          limit: 100, // Giá trị mặc định là 100 nếu không có
          truncTime: null, // Giá trị mặc định là null nếu không có
        }
      );
      // Trả về dữ liệu từ API của Vietcap cho client
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

// Hàm để lấy dữ liệu lịch sử giá
async function getPriceHistory(symbol) {
  try {
    const response = await axios.get(
      `https://s.cafef.vn/Ajax/PageNew/DataHistory/PriceHistory.ashx?Symbol=${symbol}&StartDate=&EndDate=&PageIndex=1&PageSize=40`,
      {
        headers: {
          accept: "*/*", // Đảm bảo nhận mọi loại nội dung
          Referer: "https://s.cafef.vn/lich-su-giao-dich-las-1.chn", // Một số server yêu cầu referer để kiểm tra nguồn yêu cầu
        },
      }
    );
    return response.data.Data;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

// Hàm để lấy dữ liệu VNINDEX
async function getVnIndexInfor() {
  try {
    const response = await axios.get(
      "https://api.simplize.vn/api/historical/quote/VNINDEX?type=index",
      {
        headers: {
          accept: "*/*", // Đảm bảo nhận mọi loại nội dung
          Referer: "https://simplize.vn/", // Một số server yêu cầu referer để kiểm tra nguồn yêu cầu
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

async function startFetchingStockPrices(symbol) {
  try {
    if (isWithinHOSETradingHours() || isTest) {
      const data = await getStockPriceList(symbol);
      if (data && data.length > 0) {
        let status = "";
        if (data[0].r < data[0].lastPrice) {
          status = "+";
        }
        if (data[0].r > data[0].lastPrice) {
          status = "-";
        }
        if (changePc !== data[0].changePc) {
          stockChangePcHistory.push(data);
          changePc = data[0].changePc;
          sendNotification({
            lastPrice: data[0].lastPrice,
            changePc: data[0].changePc,
            ot: data[0].ot,
            lot: numberWithCommas(data[0].lot * 10),
            status: status,
          });
        }
      }
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}
