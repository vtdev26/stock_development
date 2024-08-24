const _ = require("lodash");

  //# rename column names in the df: sym to Mã CP, c to Giá Trần, f to Giá Sàn, r to Giá tham chiếu, lot to Tổng Khối Lượng, highPrice to Giá cao, lowPrice to Giá thấp, avePrice to Giá TB, lastPrice to Giá khớp lệnh, lastVolume to KL Khớp lệnh, ot to +/- (Khớp lệnh), changePc to % (Khớp lệnh), fBVol to ĐTNN Mua, fSVolume to ĐTNN Bán
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
        if (newItem[gKey]) {
          const [price, volume] = newItem[gKey].split("|");
          if (price && volume) {
            if (i <= 3) {
              newItem[`Giá mua ${4 - i}`] = parseFloat(price) || "";
              newItem[`KL mua ${4 - i}`] = volume || "";
            } else {
              newItem[`Giá bán ${i - 3}`] = parseFloat(price) || "";
              newItem[`KL bán ${i - 3}`] = volume || "";
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
      //# rearrange columns name by this order: Mã CP, Giá tham chiếu, Giá Trần, Giá Sàn, Giá mua 3, KL mua 3, Giá mua 2, KL mua 2, Giá mua 1, KL mua 1, Giá khớp lệnh, KL Khớp lệnh, +/- (Khớp lệnh), % (Khớp lệnh), Giá bán 1, KL bán 1, Giá bán 2, KL bán 2, Giá bán 3, KL bán 3, Tổng Khối Lượng, ĐTNN Mua, ĐTNN Bán
      // Xóa các cột không cần thiết
      delete newItem["g1"];
      delete newItem["g2"];
      delete newItem["g3"];
      delete newItem["g4"];
      delete newItem["g5"];
      delete newItem["g6"];
      delete newItem["g7"];
      delete newItem["id"];
      delete newItem["mc"];

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
        if (col.includes("Giá")) {
          item[col] = parseFloat(item[col]) * 1000;
        }
      });
    });

    return finalData;
  }

  module.exports = { formatData }
