const express = require("express");
const axios = require("axios");
const _ = require("lodash");
const { formatData } = require("./Util.js");

const app = express();
const PORT = 3000;

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

// API endpoint để lấy dữ liệu cổ phiếu
app.get("/api/stock/list/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  const stockData = await getStockPriceList(symbol);

  if (stockData) {
    // Xử lý hậu kỳ dữ liệu nếu cần
    console.log(stockData);
    const processedData = formatData(stockData);
    res.json(processedData);
  } else {
    res.status(500).send("Error fetching stock data");
  }
});

// Hàm để xử lý hậu kỳ dữ liệu
function processStockData(data) {
  // Thực hiện các xử lý hậu kỳ ở đây, ví dụ:
  // - Lọc dữ liệu
  // - Tính toán các chỉ số
  // - Chuyển đổi định dạng dữ liệu
  // Chuyển đổi dữ liệu
  Util.formatData(data);
  return data; // Trả về dữ liệu đã xử lý
}

// Lắng nghe trên cổng đã chỉ định
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Hàm để tự động gọi getStockPriceList với khoảng thời gian 5 giây
function startFetchingStockPrices(symbol) {
  setInterval(async () => {
    const data = await getStockPriceList(symbol);
    if (data) {
      console.log(`Fetched data for ${symbol}:`, formatData(data));
    }
  }, 1000); // 5000 milliseconds = 5 seconds
}

// Bắt đầu gọi hàm với danh sách mã chứng khoán
const stockSymbols = "LAS"; // Thay thế bằng danh sách mã chứng khoán thực tế
startFetchingStockPrices(stockSymbols);
