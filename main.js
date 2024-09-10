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
  getTodayFormat
} = require("./Util.js");
const { format } = require("date-fns");


//Local variable initialize
let isTest = true;
let changePc = -11;
const stockSymbols = "LAS"; // Thay thế bằng danh sách mã chứng khoán thực tế
const stockChangePcHistory = [];

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 470,
    height: 900,
    alwaysOnTop: true, // Đặt cửa sổ luôn ở trên cùng
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      contextIsolation: true, // Cách ly ngữ cảnh
      enableRemoteModule: false,
      nodeIntegration: true, // Vô hiệu hóa tích hợp Node.js
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
      const responsePriceHistory = await getPriceHistory(symbol);
      const tradingHistorySummary = await getTradingHistorySummary(symbol);
      return {
        priceHistory: responsePriceHistory.Data,
        tradingHistorySummary: tradingHistorySummary.data
      };
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

  ipcMain.handle("fetch-foreign-trade", async () => {
    try {
      const responseData = await getForeignTrade();
      return responseData;
    } catch (error) {
      console.error("Error fetching Intraday:", error);
      throw error;
    }
  });

  ipcMain.handle("fetch-top-influence", async () => {
    try {
      const responseData = await topStockInfluence();
      console.log(responseData);

      return responseData;
    } catch (error) {
      console.error("Error fetching top influence:", error);
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
          limit: null, // Giá trị mặc định là 100 nếu không có
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
    response.data.data.netChange = Math.round(response.data.data.netChange * 100) / 100;
    response.data.data.pctChange = Math.round(response.data.data.pctChange * 1000) / 1000;
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

// Hàm để lấy dữ liệu giao dịch NDT nước ngoài
async function getForeignTrade() {
  try {
    const response = await axios.get(
      `https://s.cafef.vn/Ajax/PageNew/DataGDNN/GDNuocNgoai.ashx?TradeCenter=HOSE&Date=${getTodayFormat(new Date(), 'mm/dd/yyyy')}`,
      {
        headers: {
          "accept": "*/*",
          "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
          "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "cookie": "favorite_stocks_state=1; dtdz=3601d8c2-1cd7-4efa-94e0-8f8eb91431bd; __uidac=4b7f5e9623f0450a05645d6eaefac777; ASP.NET_SessionId=eiwhomxap5dmfvxhwa1wdlzg; _ga_860L8F5EZP=GS1.1.1725438828.68.0.1725438828.0.0.0; _gid=GA1.2.2141336437.1725438829; _ga=GA1.1.332666209.1683603573; _uidcms=1725438845073471547; _ga_XLBBV02H03=GS1.1.1725438825.24.1.1725439019.0.0.0; _ga_D40MBMET7Z=GS1.1.1725438825.27.1.1725439019.0.0.0",
          "Referer": "https://s.cafef.vn/tracuulichsu2/3/hose/04/09/2024.chn",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

// Hàm để lấy lịch sử biến động giao dịch (ngày, tuần, tháng, 3 tháng, 6 tháng)
async function getTradingHistorySummary(symbol) {
  try {
    const response = await axios.get(
      `https://api-finance-t19.24hmoney.vn/v1/ios/stock/trading-history-summary?symbol=${symbol}`,
      {
        headers: {
          "accept": "*/*",
          "Referer": "https://24hmoney.vn/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

async function topStockInfluence() {
  const today = getTodayFormat(new Date(), 'dd/mm/yyyy');
  let data = 'page=1&pageSize=10&catID=1&date=' + today + '&__RequestVerificationToken=ZDw3gy9pFcmaJ50_0_Vlkj0e-ktIguWPBq0ieNv-0ezVZGZd2uroKe7to1FjlmLy0reDEHaZuVrjKs9f773gQ3bkxD25oLQ7QNW_wLkZqUE1';

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://finance.vietstock.vn/data/TopStockInfluence',
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': 'language=vi-VN; Theme=Light; AnonymousNotification=; ASP.NET_SessionId=04tn5swpairqdv5arpsslp0r; __RequestVerificationToken=yf3DJTLnm8TNmBh7cISeJKnkc9UOTSxC--Qqu3C7OaBRYnegE2okNeCRvWUNsCfomTtzdFhjZWj7IQOGz36TYx6F2ib4OseoaHhcaxwj0hU1; _gid=GA1.2.263682259.1725849099; _ga=GA1.1.414344609.1686731431; _ga_EXMM0DKVEX=GS1.1.1725853012.37.1.1725853012.60.0.0',
      'Origin': 'https://finance.vietstock.vn',
      'Referer': 'https://finance.vietstock.vn/ket-qua-giao-dich?tab=cp-anh-huong',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    },
    data: data
  };
  try {
    const response = await axios.request(config);
    return response.data; // Trả về dữ liệu nếu cần sử dụng trong phần khác
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Hoặc xử lý lỗi theo cách khác
  }
}

async function KLGDBienDongCP() {
  const today = getTodayFormat(new Date(), 'dd/mm/yyyy');
  let data = 'page=1&pageSize=10&catID=1&date=' + today + '&__RequestVerificationToken=ZDw3gy9pFcmaJ50_0_Vlkj0e-ktIguWPBq0ieNv-0ezVZGZd2uroKe7to1FjlmLy0reDEHaZuVrjKs9f773gQ3bkxD25oLQ7QNW_wLkZqUE1';

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://finance.vietstock.vn/data/KQGDBienDongCP',
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': 'language=vi-VN; Theme=Light; AnonymousNotification=; ASP.NET_SessionId=04tn5swpairqdv5arpsslp0r; __RequestVerificationToken=yf3DJTLnm8TNmBh7cISeJKnkc9UOTSxC--Qqu3C7OaBRYnegE2okNeCRvWUNsCfomTtzdFhjZWj7IQOGz36TYx6F2ib4OseoaHhcaxwj0hU1; _gid=GA1.2.263682259.1725849099; _gat_UA-1460625-2=1; _ga=GA1.1.414344609.1686731431; _ga_EXMM0DKVEX=GS1.1.1725853012.37.1.1725853370.48.0.0',
      'Origin': 'https://finance.vietstock.vn',
      'Referer': 'https://finance.vietstock.vn/ket-qua-giao-dich?tab=bien-dong-cp',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    return response.data; // Trả về dữ liệu nếu cần sử dụng trong phần khác
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Hoặc xử lý lỗi theo cách khác
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