const _ = require("lodash");

// Hàm formatData chuyển đổi định dạng dữ liệu JSON
function formatData(data) {
  // Ánh xạ các cột từ tiếng Anh sang tiếng Việt
  const columnMap = {
    sym: "Mã CP",
    c: "Giá Trần",
    f: "Giá Sàn",
    r: "Giá tham chiếu",
    lot: "Tổng Khối Lượng",
    highPrice: "Giá cao",
    lowPrice: "Giá thấp",
    avePrice: "Giá TB",
    lastPrice: "Giá khớp lệnh",
    lastVolume: "KL Khớp lệnh",
    ot: "+/- (Khớp lệnh)",
    changePc: "% (Khớp lệnh)",
    fBVol: "ĐTNN Mua",
    fSVolume: "ĐTNN Bán",
    fRoom: "ĐTNN Room",
  };

  // Chuyển đổi các cột trong dữ liệu
  const formattedData = data.map((item) => {
    let newItem = {};
    // Đổi tên cột theo ánh xạ
    for (let key in item) {
      if (columnMap[key]) {
        newItem[columnMap[key]] = item[key];
      }
    }

    // Xử lý các cột g1 đến g7
    for (let i = 1; i <= 7; i++) {
      const gKey = `g${i}`;
      if (item[gKey]) { // Sử dụng item thay vì newItem để truy cập g1 đến g7
        const [price, volume] = item[gKey].split("|");
        if (price && volume) {
          if (i <= 3) {
            newItem[`Giá mua ${4 - i}`] = parseFloat(price) || "";
            newItem[`KL mua ${4 - i}`] = parseInt(volume) || ""; // Đảm bảo chuyển thành số
          } else {
            newItem[`Giá bán ${i - 3}`] = parseFloat(price) || "";
            newItem[`KL bán ${i - 3}`] = parseInt(volume) || ""; // Đảm bảo chuyển thành số
          }
        }
      } else {
        // Nếu không có dữ liệu cho g1 đến g7, hãy đặt các giá trị tương ứng là rỗng
        if (i <= 3) {
          newItem[`Giá mua ${4 - i}`] = "";
          newItem[`KL mua ${4 - i}`] = "";
        } else {
          newItem[`Giá bán ${i - 3}`] = "";
          newItem[`KL bán ${i - 3}`] = "";
        }
      }
    }

    // Xóa các cột không cần thiết
    delete item["g1"];
    delete item["g2"];
    delete item["g3"];
    delete item["g4"];
    delete item["g5"];
    delete item["g6"];
    delete item["g7"];
    delete item["id"];
    delete item["mc"];

    return newItem;
  });

  // Sắp xếp lại các cột theo thứ tự yêu cầu
  const orderedColumns = [
    "Mã CP",
    "Giá tham chiếu",
    "Giá Trần",
    "Giá Sàn",
    "Giá mua 3",
    "KL mua 3",
    "Giá mua 2",
    "KL mua 2",
    "Giá mua 1",
    "KL mua 1",
    "Giá khớp lệnh",
    "KL Khớp lệnh",
    "+/- (Khớp lệnh)",
    "% (Khớp lệnh)",
    "Giá bán 1",
    "KL bán 1",
    "Giá bán 2",
    "KL bán 2",
    "Giá bán 3",
    "KL bán 3",
    "Tổng Khối Lượng",
    "ĐTNN Mua",
    "ĐTNN Bán",
    "ĐTNN Room",
  ];

  // Sắp xếp các cột theo thứ tự
  const finalData = formattedData.map((item) => _.pick(item, orderedColumns));

  // Chuyển đổi giá thành số và nhân với 1000
  finalData.forEach((item) => {
    orderedColumns.forEach((col) => {
      if (col.includes("Giá") && item[col] !== "") { // Kiểm tra item[col] không phải rỗng
        item[col] = parseFloat(item[col]) * 1000;
      }
      if (col.includes("Tổng Khối") && item[col] !== "") {
        item[col] = item[col] * 10;
      }
    });
  });

  return finalData;
}

function currentDate() {
  const date = new Date();

  // Chuyển đổi thời gian UTC sang múi giờ +7
  date.setHours(date.getUTCHours() + 7);

  // Lấy giờ, phút và giây theo múi giờ +7
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Định dạng kết quả với hai chữ số
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return formattedTime; // Kết quả: "10:04:28"
}

function isWithinHOSETradingHours() {
  const now = new Date(); // Lấy thời gian hiện tại theo giờ UTC
  const timezoneOffset = 7 * 60; // Múi giờ +7, chuyển đổi sang phút

  // Chuyển đổi thời gian hiện tại sang múi giờ +7
  const localTime = new Date(now.getTime() + timezoneOffset * 60 * 1000);

  const currentDay = localTime.getUTCDay(); // Lấy ngày hiện tại (0 là Chủ Nhật, 1 là Thứ Hai, ...) theo UTC

  // Kiểm tra nếu hôm nay là thứ Bảy (6) hoặc Chủ Nhật (0), thì không trong giờ giao dịch
  if (currentDay === 0 || currentDay === 6) {
    return false;
  }

  const currentTime = localTime.getUTCHours() * 60 + localTime.getUTCMinutes(); // Chuyển đổi thời gian hiện tại sang phút trong ngày theo UTC

  // Thời gian bắt đầu và kết thúc phiên sáng và phiên chiều theo phút
  const morningStart = 9 * 60; // 09:00 sáng
  const morningEnd = 11 * 60 + 30; // 11:30 sáng
  const afternoonStart = 13 * 60; // 13:00 chiều
  const afternoonEnd = 14 * 60 + 45; // 14:45 chiều

  // Kiểm tra nếu thời gian hiện tại nằm trong khoảng thời gian của phiên sáng hoặc phiên chiều
  if ((currentTime >= morningStart && currentTime <= morningEnd) ||
    (currentTime >= afternoonStart && currentTime <= afternoonEnd)) {
    return true;
  }

  return false; // Nếu không nằm trong khoảng thời gian giao dịch
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
  formatData,
  currentDate,
  isWithinHOSETradingHours,
  numberWithCommas
};
