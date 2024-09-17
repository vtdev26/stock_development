/*
 ======================================= KHỞI TẠO DỮ LIỆU GLOBAL ===========================================================
*/

/* Dữ liệu khởi tạo */
let changePc = -11; // Tỷ lệ thay đổi phần trăm
let symbolMain = 'LAS'; // Mã cổ phiếu chính
let currentHomePage = 'stock-info-content';
//Phan bon: 0 - 10
//Ban le: 11 - 15
//BDS: 16 - 26
//CK: 27 - 40
//Dau khi: 41 - 48
//FPT: 49 - 53
//Bank: 54 - 68
//Thep: 69 - 71
//Vingroup: 72 - 74
//DCT: 75 - 80
let listSymbol = `LAS,DGC,DCM,BFC,DPM,DDV,CSV,GRV,DPR,PHR,TDP,
SAB,MSN,MWG,FRT,DGW,
NLG,NTL,PDR,VHM,DXG,CEO,KDH,DIG,NVL,KBC,TCH,
BVS,ORS,VDS,TVS,CTS,VCI,BSI,HCM,MBS,SHS,VIX,VND,FTS,SSI,
OIL,BSR,PVB,PLX,PSI,PVT,PVD,PVS,
FRT,FOX,FOC,FPT,FTS,
AGR,LPB,ACB,HDB,SSB,VCB,TCB,VPB,BID,MBB,VIB,SHB,STB,MSB,CTG,
HSG, HPG, NKG,
VIC,VHM,VRE,
POW,GAS,GEX,TV2,KSB,
VNM,VCB,ACB,BCM,BID,BVH,CTG,FPT,GAS,GVR,HDB,HPG,MBB,MSN,MWG,PLX,POW,SAB,SHB,SSB,SSI,STB,TCB,TPB,VHM,VIB,VIC,VJC,VPB,VRE`;


/*
 ======================================= xỬ LÝ HIỂN THỊ DỮ LIỆU LÊN APP (HTML - JS - CSS) ===========================================================
*/

// Hàm để hiển thị dữ liệu cổ phiếu
function displayStockData(data) {
    // Đảm bảo rằng phần tử HTML với id "stock-data" tồn tại
    const stockDataElement = document.getElementById('stock-data');

    // Lấy ra thông tin chi tiết từ dữ liệu
    const { sym, mc, c, f, r, lastPrice, lastVolume, lot, ot, changePc, avePrice, highPrice, lowPrice } = data;

    let status = '';
    let changeClass = 'yellow';

    // Xác định tình trạng thay đổi giá
    if (r < lastPrice) {
        status = '+';
        changeClass = 'green'; // Áp dụng lớp CSS cho giá trị dương
    }

    if (r > lastPrice) {
        status = '-';
        changeClass = 'red'; // Áp dụng lớp CSS cho giá trị âm
    }

    // Lấy thời gian hiện tại
    const updateTime = new Date().toLocaleTimeString();

    // Tạo nội dung HTML với bảng
    const htmlContent = `
        <h2>Thông tin: ${sym}</h2>
        <p>Thời gian cập nhật: ${updateTime}</p>
        <table class="stock-table">
            <tbody>
                <tr>
                    <td class="label">Giá tham chiếu</td><td class="value">${r}</td>
                </tr>
                <tr>
                    <td class="label">Giá cuối cùng</td><td class="value">${lastPrice}</td>
                </tr>
                <tr>
                    <td class="label">Khối lượng giao dịch</td><td class="value">${window.utils.numberWithCommas(lastVolume)}</td>
                </tr>
                <tr>
                    <td class="label">Tổng khối lượng</td><td class="value">${window.utils.numberWithCommas(lot * 10)}</td>
                </tr>
                <tr>
                    <td class="label">Thay đổi</td><td class="value">${ot}</td>
                </tr>
                <tr>
                    <td class="label">Thay đổi %</td><td class="value ${changeClass}">${status} ${changePc}</td>
                </tr>
                <tr>
                    <td class="label">Giá trung bình</td><td class="value">${avePrice}</td>
                </tr>
                <tr>
                    <td class="label">Giá cao nhất</td><td class="value">${highPrice}</td>
                </tr>
                <tr>
                    <td class="label">Giá thấp nhất</td><td class="value">${lowPrice}</td>
                </tr>
                <tr>
                    <td class="label">Giá trần</td><td class="value">${c}</td>
                </tr>
                <tr>
                    <td class="label">Giá sàn</td><td class="value">${f}</td>
                </tr>
            </tbody>
        </table>
    `;
    // Cập nhật nội dung của phần tử HTML
    stockDataElement.innerHTML = htmlContent;
}

function displayStockDataList(data) {
    const stockDataList = document.getElementById('stock-data-list');
    const stockHoaChat = document.getElementById('stock-list-hoa-chat');
    const stockBanLe = document.getElementById('stock-list-ban-le');
    const stockBds = document.getElementById('stock-list-bds');
    const stockCk = document.getElementById('stock-list-chung-khoan');
    const stockDauKhi = document.getElementById('stock-list-dau-khi');
    const stockFpt = document.getElementById('stock-list-fpt');
    const stockBank = document.getElementById('stock-list-bank');
    const stockThep = document.getElementById('stock-list-thep');
    const stockVingroup = document.getElementById('stock-list-vingroup');
    const stockDct = document.getElementById('stock-list-dtc');
    const stockVn30 = document.getElementById('stock-list-VN30');

    //Phan bon: 0 - 10
    //Ban le: 11 - 15
    //BDS: 16 - 26
    //CK: 27 - 40
    //Dau khi: 41 - 48
    //FPT: 49 - 53
    //Bank: 54 - 68
    //Thep: 69 - 71
    //Vingroup: 72 - 74
    //DCT: 75 - 80
    const hoaChat = data.slice(0, 10);
    const banLe = data.slice(10, 15);
    const bds = data.slice(15, 26);
    const ck = data.slice(26, 40);
    const dauKhi = data.slice(40, 48);
    const fpt = data.slice(48, 53);
    const bank = data.slice(53, 68);
    const thep = data.slice(68, 71);
    const vingroup = data.slice(71, 74);
    const dct = data.slice(74, 79);
    const vn30 = data.slice(79, data.length);

    let tableHoaChatGen = genrateTableStockList(hoaChat, 'Hoá Chất - Phân Bón');
    let tableBanLeGen = genrateTableStockList(banLe, 'Bán Lẻ');
    let tableBdsGen = genrateTableStockList(bds, 'Bất Động Sản');
    let tableCkGen = genrateTableStockList(ck, 'Chứng Khoán');
    let tableDauKhiGen = genrateTableStockList(dauKhi, 'Dầu Khí');
    let tableFptGen = genrateTableStockList(fpt, 'FPT');
    let tableBankGen = genrateTableStockList(bank, 'Ngân Hàng');
    let tableThepGen = genrateTableStockList(thep, 'Thép');
    let tableVingroupGen = genrateTableStockList(vingroup, 'VinGroup');
    let tableDctGen = genrateTableStockList(dct, 'Đầu Tư Công');
    let tableVn30 = genrateTableStockList(vn30, "VN30");
    stockDataList.innerHTML = tableHoaChatGen;
    stockHoaChat.innerHTML = tableHoaChatGen;
    stockBanLe.innerHTML = tableBanLeGen;
    stockBds.innerHTML = tableBdsGen;
    stockCk.innerHTML = tableCkGen;
    stockDauKhi.innerHTML = tableDauKhiGen;
    stockFpt.innerHTML = tableFptGen;
    stockBank.innerHTML = tableBankGen;
    stockThep.innerHTML = tableThepGen;
    stockVingroup.innerHTML = tableVingroupGen;
    stockDct.innerHTML = tableDctGen;
    stockVn30.innerHTML = tableVn30;
}

function genrateTableStockList(data, title) {
    // Tạo bảng HTML với phần đầu
    let tableHTML = `
        <button id="toggle-button-stock-list">
            ${title}<i class="fas fa-eye-slash"></i>
        </button>
       <table id="stock-data-list-table" style="display: table;" border="1" cellspacing="0" cellpadding="5">
           <thead>
           <tr>
               <th>Symbol</th>
               <th>Price</th>
               <th>Change</th>
               <th>Accumulated Volume</th>
           </tr>
           </thead>
           <tbody>`;

    data.forEach(item => {
        // Lấy ra thông tin chi tiết từ dữ liệu
        const { sym, mc, c, f, r, lastPrice, lastVolume, lot, ot, changePc, avePrice, highPrice, lowPrice } = item;

        let status = '';
        let changeClass = 'yellow';

        // Xác định tình trạng thay đổi giá
        if (r < lastPrice) {
            status = '+';
            changeClass = 'green'; // Áp dụng lớp CSS cho giá trị dương
        }

        if (r > lastPrice) {
            status = '-';
            changeClass = 'red'; // Áp dụng lớp CSS cho giá trị âm
        }
        tableHTML += `
               <tr>
               <td class="tooltip">${sym}
                 <span class="tooltiptext">${lowPrice} | ${avePrice} | ${highPrice}</span>
               </td>
               <td>${window.utils.numberWithCommas(lastPrice)}</td>
               <td class="${changeClass}">${status} ${changePc}</td>
               <td>${window.utils.numberWithCommas(lot * 10)}</td>
               </tr>`;
    });
    // Đóng bảng
    tableHTML += `
       </tbody>
   </table>`;

    return tableHTML;
}

function displayTopInfluence(data) {
    const dataElement = document.getElementById('top-influence-data');

    let tableHTML =
        `<table id="stock-data-list-table" style="display: table;" border="1" cellspacing="0" cellpadding="5">
    <thead>
    <tr>
        <th>Symbol</th>
        <th>Price</th>
        <th>Influence %</th>
        <th>Influence Index</th>
    </tr>
    </thead>
    <tbody>`;

    data.forEach(item => {
        tableHTML += `
        <tr>
        <td>${item.StockCode}</td>
        <td>${window.utils.numberWithCommas(item.ClosePrice)}</td>
        <td>${item.InfluencePercent}</td>
        <td>${item.InfluenceIndex}</td>
        </tr>`;
    });

    tableHTML += `
        </tbody>
    </table>`;

    dataElement.innerHTML = tableHTML;
}

function displayForeignTradeDaily(data) {
    const foreignTop = document.getElementById('foreign-top-data');
    const foreignDayWeekMonth = document.getElementById('foreign-day-week-month-data');
    const foreignTradingDaily = document.getElementById('foreign-trading-daily-data');

    let foreignTopHtml = `
        <button id="toggle-button-stock-list">
            Top Buy<i class="fas fa-eye-slash"></i>
        </button>
       <table style="display: table;" border="1" cellspacing="0" cellpadding="5">
           <thead>
           <tr>
               <th>Symbol</th>
               <th>Buy</th>
               <th>Sell</th>
               <th>Net</th>
           </tr>
           </thead>
           <tbody>`;
    data.foreignTop.topBuy.forEach(item => {
        foreignTopHtml += `
            <tr>
                <td>${item.symbol}</td>
               <td class="tooltip">${window.utils.formatPercent(item.buy_val, 100)}
                 <span class="tooltiptext">${window.utils.numberWithCommas(item.buy_qtty)}</span>
               </td>
               <td class="tooltip">${window.utils.formatPercent(item.sell_val, 100)}
                 <span class="tooltiptext">${window.utils.numberWithCommas(item.sell_qtty)}</span>
               </td>
               <td>${window.utils.formatPercent(item.net_val, 1000)}</td>
            </tr>`;
    });

    foreignTopHtml += `
            </tbody>
        </table>`;

    foreignTopHtml += `
        <button id="toggle-button-stock-list">
            Top Sell<i class="fas fa-eye-slash"></i>
        </button>
       <table style="display: table;" border="1" cellspacing="0" cellpadding="5">
           <thead>
           <tr>
               <th>Symbol</th>
               <th>Buy</th>
               <th>Sell</th>
               <th>Net</th>
           </tr>
           </thead>
           <tbody>
    `;

    data.foreignTop.topSell.forEach(item => {
        foreignTopHtml += `
            <tr>
                <td>${item.symbol}</td>
               <td class="tooltip">${window.utils.formatPercent(item.buy_val, 100)}
                 <span class="tooltiptext">${window.utils.numberWithCommas(item.buy_qtty)}</span>
               </td>
               <td class="tooltip">${window.utils.formatPercent(item.sell_val, 100)}
                 <span class="tooltiptext">${window.utils.numberWithCommas(item.sell_qtty)}</span>
               </td>
               <td>${window.utils.formatPercent(item.net_val, 1000)}</td>
            </tr>`;
    });

    foreignTopHtml += `
            </tbody>
        </table>`;

    foreignTop.innerHTML = foreignTopHtml;

    let foreignTradingDailyHtml = `
        <button id="toggle-button-stock-list">
            Thống kê theo ngày<i class="fas fa-eye-slash"></i>
        </button>
        <table style="display: table;" border="1" cellspacing="0" cellpadding="5">
           <thead>
           <tr>
               <th>Date</th>
               <th>Buy</th>
               <th>Sell</th>
               <th>Net</th>
           </tr>
           </thead>
           <tbody>
    `;

    data.foreignTradingDaily.forEach(item => {
        foreignTradingDailyHtml += `
        <tr>
            <td>${item.date}</td>
               <td class="tooltip">${window.utils.formatPercent(item.buy_val, 100)}
                    <span class="tooltiptext">${window.utils.numberWithCommas(item.buy_qtty)}</span>
               </td>
               <td class="tooltip">${window.utils.formatPercent(item.sell_val, 100)}
                    <span class="tooltiptext">${window.utils.numberWithCommas(item.sell_qtty)}</span>
               </td>
            <td>${window.utils.formatPercent((item.buy_val - item.sell_val), 1000)}</td>
        </tr>`;
    });

    foreignTradingDailyHtml += `
            </tbody>
        </table>`;

    foreignTradingDaily.innerHTML = foreignTradingDailyHtml;

    let foreignDayWeekMonthHtml = `
        <h3>Ngày - Tuần - Tháng</h3>
        <table style="display: table;" border="1" cellspacing="0" cellpadding="5">
        <tr>
            <th colspan="3">Day</th>
        </tr>
        <tr>
            <th style="color: green;">Buy</th>
            <th style="color: rgb(180, 45, 45);">Sell</th>
            <th>Total</th>
        </tr>
        <tr>
            <td>${window.utils.formatPercent(data.foreignDayWeekMonth.todayBuyValue, 100)}</td>
            <td>${window.utils.formatPercent(data.foreignDayWeekMonth.todaySellValue, 100)}</td>
            <td>${window.utils.formatPercent((data.foreignDayWeekMonth.todayBuyValue - data.foreignDayWeekMonth.todaySellValue), 100)}</td>
        </tr>
        <tr>
            <th colspan="3">Week</th>
        </tr>
        <tr>
            <th style="color: green;">Buy</th>
            <th style="color: rgb(180, 45, 45);">Sell</th>
            <th>Total</th>
        </tr>
        <tr>
            <td>${window.utils.formatPercent(data.foreignDayWeekMonth.weekBuyValue, 100)}</td>
            <td>${window.utils.formatPercent(data.foreignDayWeekMonth.weekSellValue, 100)}</td>
            <td>${window.utils.formatPercent((data.foreignDayWeekMonth.weekBuyValue - data.foreignDayWeekMonth.weekSellValue), 100)}</td>
        </tr>
        <tr>
            <th colspan="3">Month</th>
        </tr>
        <tr>
            <th style="color: green;">Buy</th>
            <th style="color: rgb(180, 45, 45);">Sell</th>
            <th>Total</th>
        </tr>
        <tr>
            <td>${window.utils.formatPercent(data.foreignDayWeekMonth.monthBuyValue, 100)}</td>
            <td>${window.utils.formatPercent(data.foreignDayWeekMonth.monthSellValue, 100)}</td>
            <td>${window.utils.formatPercent((data.foreignDayWeekMonth.monthBuyValue - data.foreignDayWeekMonth.monthSellValue), 100)}</td>
        </tr>
    </table>`;

    foreignDayWeekMonth.innerHTML = foreignDayWeekMonthHtml;
    console.log(data);

}

function displayStockIntraday(data) {

    // Khởi tạo biến lưu trữ tổng
    let totalB = 0, totalS = 0, totalUndefine = 0;

    const stockDataElement = document.getElementById('stock-intraday-data');

    // Lấy thời gian hiện tại
    const updateTime = new Date().toLocaleTimeString();

    const table = document.getElementById('stock-data-table');
    let style = 'table';
    if (table) {
        style = table.style.display;
    }
    // Xóa nội dung hiện tại của phần tử container
    stockDataElement.innerHTML = '';

    // Tạo nút Reload
    const reloadButton = document.getElementById('reload-button');
    reloadButton.innerHTML = `<i class="fas fa-sync-alt"></i> ${updateTime}`; // Thêm biểu tượng vào nút

    // Tạo bảng HTML với phần đầu
    let tableHTML = `
        <table id="stock-data-table" style="display: ${style};" border="1" cellspacing="0" cellpadding="5">
            <thead>
            <tr>
                <th>Match Volume</th>
                <th>Match Price</th>
                <th>Match Type</th>
                <th>Accumulated Volume</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>`;

    // Duyệt qua từng phần tử trong dữ liệu để tạo hàng bảng
    let count = 0;
    data.forEach(item => {
        const matchVolNumber = Number(item.matchVol); // Ép kiểu về số
        let matchTypeClass;
        if (item.matchType === 's') {
            totalS += matchVolNumber;
            matchTypeClass = 'red'; // Lớp CSS cho màu đỏ
        } else if (item.matchType === 'b') {
            totalB += matchVolNumber;
            matchTypeClass = 'green'; // Lớp CSS cho màu xanh
        } else {
            totalUndefine += matchVolNumber;
            matchTypeClass = 'yellow'; // Lớp CSS mặc định nếu không có điều kiện
        }
        if (count <= 70) {
            tableHTML += `
            <tr>
            <td>${window.utils.numberWithCommas(item.matchVol)}</td>
            <td>${window.utils.numberWithCommas(item.matchPrice)}</td>
            <td class="${matchTypeClass}">${item.matchType}</td>
            <td>${window.utils.numberWithCommas(item.accumulatedVolume)}</td>
            <td>${new Date(item.createdAt).toLocaleTimeString()}</td>
            </tr>`;
        }
        count++;
    });

    // Đóng bảng
    tableHTML += `
                </tbody>
            </table>`;
    // Tính tổng chung
    const totalAll = totalB + totalS + totalUndefine;

    // Tính phần trăm cho từng loại
    const percentB = (totalB / totalAll) * 100;
    const percentS = (totalS / totalAll) * 100;
    const percentUndefine = (totalUndefine / totalAll) * 100;
    // Cập nhật nội dung của phần tử "stock-intraday" với bảng HTML đã tạo
    const totalBuyElement = document.getElementById('total-buy');
    const totalSellElement = document.getElementById('total-sell');
    if (percentB >= 60) {
        totalBuyElement.classList = 'green';
        totalSellElement.classList = '';
    } else if (percentS >= 60) {
        totalSellElement.classList = 'red';
        totalBuyElement.classList = '';
    } else {
        totalBuyElement.classList = 'yellow';
        totalSellElement.classList = 'yellow';
    }
    totalBuyElement.innerHTML = `TB: ${window.utils.numberWithCommas(totalB)} (${percentB.toFixed(2)}%)`;
    totalSellElement.innerHTML = `TS: ${window.utils.numberWithCommas(totalS)} (${percentS.toFixed(2)}%)`;
    stockDataElement.innerHTML += tableHTML;
}

// Hàm để hiển thị dữ liệu cổ phiếu dưới dạng biểu đồ
function displayPriceChart() {
    const priceChartCtx = document.getElementById('priceChart').getContext('2d');

    const priceChart = new Chart(priceChartCtx, {
        type: 'line', // Loại biểu đồ
        data: {
            labels: [], // Cập nhật nhãn (thời gian)
            datasets: [{
                label: 'Giá cuối cùng', // Tiêu đề của dataset
                data: [], // Dữ liệu biểu đồ
                borderColor: 'rgba(54, 162, 235, 1)', // Màu đường viền
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Màu nền
                fill: false, // Không tô màu nền
            }]
        },
        options: {
            scales: {
                x: { display: true, title: { display: true, text: 'Thời gian' } }, // Tùy chọn cho trục X
                y: { display: true, title: { display: true, text: 'Giá (VND)' } } // Tùy chọn cho trục Y
            }
        }
    });
    return priceChart;
}

// Hàm để hiển thị biểu đồ khối lượng
function displayVolumeChart() {
    const volumeChartCtx = document.getElementById('volumeChart').getContext('2d');
    const volumeChart = new Chart(volumeChartCtx, {
        type: 'bar', // Loại biểu đồ
        data: {
            labels: [], // Danh sách nhãn (thời gian)
            datasets: [{
                label: 'Khối lượng giao dịch cuối cùng', // Tiêu đề của dataset
                data: [],
                backgroundColor: 'rgba(255, 159, 64, 0.2)', // Màu nền
                borderColor: 'rgba(255, 159, 64, 1)', // Màu đường viền
                borderWidth: 1 // Độ dày đường viền
            }]
        },
        options: {
            scales: {
                x: { display: true, title: { display: true, text: 'Thời gian' } }, // Tùy chọn cho trục X
                y: { display: true, title: { display: true, text: 'Khối lượng' } } // Tùy chọn cho trục Y
            }
        }
    });

    return volumeChart;
}

// Hàm để hiển thị biểu đồ thay đổi
function displayChangeChart() {
    const changeChartCtx = document.getElementById('changeChart').getContext('2d');
    const changeChart = new Chart(changeChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Thay đổi', 'Thay đổi %'],
            datasets: [{
                data: [],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)']
            }]
        },
        options: {
            responsive: true, // Biểu đồ đáp ứng với kích thước của màn hình
            plugins: {
                legend: {
                    position: 'top' // Vị trí của chú giải
                }
            }
        }
    });

    return changeChart;
}

// Hàm để hiển thị biểu đồ giá trung bình, cao nhất, thấp nhất
function displayAvgHighLowChart() {
    const avgHighLowChartCtx = document.getElementById('avgHighLowChart').getContext('2d');
    const avgHighLowChart = new Chart(avgHighLowChartCtx, {
        type: 'bar',
        data: {
            labels: ['Giá trung bình', 'Giá cao nhất', 'Giá thấp nhất'], // Danh sách nhãn
            datasets: [{
                label: 'Giá (VND)', // Tiêu đề của dataset
                data: [], // Dữ liệu biểu đồ
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)', // Màu nền cho giá trung bình
                    'rgba(54, 162, 235, 0.2)', // Màu nền cho giá cao nhất
                    'rgba(255, 99, 132, 0.2)' // Màu nền cho giá thấp nhất
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)', // Màu đường viền cho giá trung bình
                    'rgba(54, 162, 235, 1)', // Màu đường viền cho giá cao nhất
                    'rgba(255, 99, 132, 1)' // Màu đường viền cho giá thấp nhất
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { display: true, title: { display: true, text: 'Loại giá' } },
                y: { display: true, title: { display: true, text: 'Giá (VND)' } }
            }
        }
    });
    return avgHighLowChart;
}

// Hàm để cập nhật biểu đồ với dữ liệu mới
function updateCharts(data) {
    const currentTime = new Date().toLocaleTimeString();
    const stockDataElement = document.getElementById('stock-data');

    const priceChart = displayPriceChart();
    const volumeChart = displayVolumeChart();
    const changeChart = displayChangeChart();
    const avgHighLowChart = displayAvgHighLowChart();

    // Cập nhật biểu đồ giá
    priceChart.data.labels.push(currentTime);
    priceChart.data.datasets[0].data.push(data.lastPrice);
    if (priceChart.data.labels.length > 20) {
        priceChart.data.labels.shift(); // Xóa nhãn cũ
        priceChart.data.datasets[0].data.shift(); // Xóa dữ liệu cũ
    }
    priceChart.update();

    // Cập nhật biểu đồ khối lượng
    volumeChart.data.labels.push(currentTime);
    volumeChart.data.datasets[0].data.push(data.lastVolume);
    if (volumeChart.data.labels.length > 20) {
        volumeChart.data.labels.shift();
        volumeChart.data.datasets[0].data.shift();
    }
    volumeChart.update();

    // Cập nhật biểu đồ thay đổi
    changeChart.data.datasets[0].data = [data.ot, data.changePc];
    changeChart.update();

    // Cập nhật biểu đồ giá trung bình, cao nhất, thấp nhất
    avgHighLowChart.data.datasets[0].data = [data.avePrice, data.highPrice, data.lowPrice];
    avgHighLowChart.update();
}

// Hàm để cập nhật dữ liệu lịch sử cổ phiếu
function displayPriceStockHistory(data) {
    // Đảm bảo rằng phần tử HTML với id "stock-history-data'" tồn tại
    const stockDataElement = document.getElementById('stock-history-data');

    if (!data) {
        return;
    }
    const dataStockHistory = data.priceHistory;
    const tradingHistorySummary = data.tradingHistorySummary;

    // Lấy thời gian hiện tại
    // const updateTime = new Date().toLocaleTimeString();    

    // Tạo bảng HTML với phần đầu
    let tableHTML = `
        <h2> Dữ liệu thay đổi giá theo ngày </h2>
        <table id="stock-history-table" border="1" cellspacing="0" cellpadding="5">
            <thead>
            <tr>
                <th>Thời gian</th>
                <th>Giá DC</th>
                <th>Thay đổi giá</th>
                <th>ATO</th>
                <th>Giá cao</th>
                <th>Giá thấp</th>
            </tr>
            </thead>
            <tbody>`;

    // Duyệt qua từng phần tử trong dữ liệu để tạo hàng bảng
    dataStockHistory.forEach(item => {
        let matchTypeClass;
        if (item.ThayDoi.includes('-')) {
            matchTypeClass = 'red'; // Lớp CSS cho màu đỏ
        } else {
            matchTypeClass = 'green';
        }
        tableHTML += `
                <tr>
                <td>${item.Ngay}</td>
                <td>${item.GiaDieuChinh}</td>
                <td class="${matchTypeClass}">${item.ThayDoi}</td>
                <td>${item.GiaMoCua}</td>
                <td>${item.GiaCaoNhat}</td>
                <td>${item.GiaThapNhat}</td>
                </tr>`;
    });

    // Đóng bảng
    tableHTML += `
                </tbody>
            </table>`;
    tableHTML += `
    <h2> Lịch sử thay đổi </h2>
    <table class="trading-history-summary-table">
            <tbody>
                <tr>
                    <td class="label">Ngày</td>
                    <td class="${tradingHistorySummary.change_day > 0 ? 'green' : tradingHistorySummary.change_day < 0 ? 'red' : 'yellow'}">
                    ${tradingHistorySummary.change_day}%</td>
                </tr>
                <tr>
                    <td class="label">Tuần</td>
                    <td class="${tradingHistorySummary.change_week > 0 ? 'green' : tradingHistorySummary.change_week < 0 ? 'red' : 'yellow'}">
                    ${tradingHistorySummary.change_week}%</td>
                </tr>
                <tr>
                    <td class="label">Tháng</td>
                    <td class="${tradingHistorySummary.change_month > 0 ? 'green' : tradingHistorySummary.change_month < 0 ? 'red' : 'yellow'}">
                    ${tradingHistorySummary.change_month}%</td>
                </tr>
                <tr>
                    <td class="label">3 Tháng</td>
                    <td class="${tradingHistorySummary.change_3_month > 0 ? 'green' : tradingHistorySummary.change_3_month < 0 ? 'red' : 'yellow'}">
                    ${tradingHistorySummary.change_3_month}%</td>
                </tr>
                <tr>
                    <td class="label">6 Tháng</td>
                    <td class="${tradingHistorySummary.change_6_month > 0 ? 'green' : tradingHistorySummary.change_6_month < 0 ? 'red' : 'yellow'}">
                    ${tradingHistorySummary.change_6_month}%</td>
                </tr>
            </tbody>
        </table>`;
    // Cập nhật nội dung của phần tử "stock-intraday" với bảng HTML đã tạo
    stockDataElement.innerHTML += tableHTML;
}

function displayVnindexData(data) {
    // Đảm bảo rằng phần tử HTML với id "stock-data" tồn tại
    const stockDataElement = document.getElementById('vnindex-data');
    const stockIndexDataHome = document.getElementById('index-data-home');

    // Lấy thời gian hiện tại
    const updateTime = new Date().toLocaleTimeString();

    if (!data) {
        return;
    }
    let matchTypeClass = '';
    if (data.netChange < 0) {
        matchTypeClass = 'red'; // Lớp CSS cho màu đỏ
    } else if (data.netChange > 0) {
        matchTypeClass = 'green'; // Lớp CSS cho màu xanh
    } else {
        matchTypeClass = 'yellow'; // Lớp CSS mặc định nếu không có điều kiện
    }

    const htmlIndexDataHome = `
        <p>VNINDEX: ${data.priceClose} </p>
        <p class="${matchTypeClass}">${data.netChange} (${data.pctChange}%)</p>
    `;

    // Tạo nội dung HTML với bảng
    const htmlContent = `
        <h2>Thông tin: ${data.ticker} </h2>
        <p>Thời gian cập nhật: ${updateTime}</p>
        <table class="vnindex-table">
            <tbody>
                <tr>
                    <td class="label">Giá tham chiếu</td><td class="yellow">${data.priceReference}</td>
                </tr>
                <tr>
                    <td class="label">Thay đổi</td><td class="${matchTypeClass}">${data.netChange}</td>
                </tr>
                <tr>
                    <td class="label">Thay đổi (%)</td><td class="${matchTypeClass}">${data.pctChange}%</td>
                </tr>                
                <tr>
                    <td class="label">VNI</td><td class="${matchTypeClass}">${data.priceClose}</td>
                </tr>
                <tr>
                    <td class="label">Giá thấp nhất</td><td class="value">${data.priceHigh}</td>
                </tr>
                <tr>
                    <td class="label">Giá cao nhất</td><td class="value">${data.priceLow}</td>
                </tr>
                <tr>
                    <td class="label">Khối lượng khớp lệnh</td><td class="value">${window.utils.numberWithCommas(data.totalVolume)}</td>
                </tr>
                
                <tr>
                    <td class="label">Giá trị khớp lệnh</td><td class="value">${window.utils.formatValuePriceIndex(data.totalValue)}</td>
                </tr>
                <tr>
                    <td class="label">Số lượng mã tăng</td><td class="value">${data.advances}</td>
                </tr>
                <tr>
                    <td class="label">Số lượng mã tham chiếu</td><td class="value">${data.unChange}</td>
                </tr>
                <tr>
                    <td class="label">Giá lượng mã giảm</td><td class="value">${data.declines}</td>
                </tr>
            </tbody>
        </table>
    `;
    // Cập nhật nội dung của phần tử HTML
    stockIndexDataHome.innerHTML = htmlIndexDataHome;
    stockDataElement.innerHTML = htmlContent;
}

function displayForeignTrade(data) {
    // Đảm bảo rằng phần tử HTML với id "stock-data" tồn tại
    const stockDataElement = document.getElementById('foreign-data');
    // Lấy thời gian hiện tại
    const updateTime = new Date().toLocaleTimeString();

    if (!data) {
        return;
    }

    const dataForeignTrade = data.ListDataNN.slice(0, 29);

    // Tạo nội dung HTML với bảng
    let htmlContent = `
    <table id="foreign-table">
            <tbody>
              <tr>
                <td style="color: #ffffff; font-weight: 150">VNINDEX</td>
                <td>KLGD (Cổ phiếu)</td>
                <td>GTGD (VNĐ)</td>
              </tr>
              <tr>
                <td style="color: green;">Tổng mua</td>
                <td>${window.utils.numberWithCommas(data.BuyVolume)} (${window.utils.formatPercent(data.BuyVolumePercent, 1000)}%)</td>
                <td>${window.utils.numberWithCommas(data.BuyValue)} (${window.utils.formatPercent(data.BuyValuePercent, 1000)}%)</td>
              </tr>
              <tr>
                <td style="color: rgb(180, 45, 45);">Tổng bán</td>
                <td>${window.utils.numberWithCommas(data.SellVolume)} (${window.utils.formatPercent(data.SellVolumePercent, 1000)}%)</td>
                <td>${window.utils.numberWithCommas(data.SellValue)} (${window.utils.formatPercent(data.SellValuePercent, 1000)}%)</td>
              </tr>
              <tr>
                <td>Chênh lệch</td>
                <td>${window.utils.numberWithCommas(data.DiffVolume)}</td>
                <td>${window.utils.numberWithCommas(data.DiffValue)}</td>
              </tr>
            </tbody>
          </table>
          <h3> Thông tin cổ phiếu </h3>
          <table id="foreign-stock-table" border="1" cellspacing="0" cellpadding="5">
            <thead>
            <tr>
                <th>Mã</th>
                <th>KL Mua</th>
                <th>GT Mua</th>
                <th>KL Bán</th>
                <th>GT Bán</th>
            </tr>
            </thead>
            <tbody>
    `;

    // Duyệt qua từng phần tử trong dữ liệu để tạo hàng bảng
    dataForeignTrade.forEach(item => {
        htmlContent += `
                    <tr>
                    <td>${window.utils.numberWithCommas(item.Symbol)}</td>
                    <td>${window.utils.numberWithCommas(item.BuyVolume)}</td>
                    <td>${window.utils.numberWithCommas(item.BuyValue)}</td>
                    <td>${window.utils.numberWithCommas(item.SellVolume)}</td>
                    <td>${window.utils.numberWithCommas(item.SellValue)}</td>
                    </tr>`;
    });

    // Đóng bảng
    htmlContent += `
                </tbody>
            </table>`;

    stockDataElement.innerHTML = htmlContent;
}

/*
======================================= XỬ LÝ SỰ KIỆN TRÊN ỨNG DỤNG ===========================================================
*/

// Hàm để lấy dữ liệu cổ phiếu từ symbol text box và gán lại giá trị symbol
document.getElementById('fetchStock').addEventListener('click', () => {
    const elementListSymbol = document.getElementById('stockSymbol').value;
    if (elementListSymbol) {
        symbolMain = elementListSymbol;
    } else {
        alert('Vui lòng nhập mã cổ phiếu.');
    }
});

document.getElementById('toggleDarkMode').addEventListener('click', () => {
    // Lưu trạng thái dark mode vào localStorage    
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode);
});

document.getElementById('reload-button').addEventListener('click', () => {
    fetchIntradayData();
});

document.getElementById('toggle-button').addEventListener('click', () => {
    const table = document.getElementById('stock-data-table');
    const toggleButton = document.getElementById('toggle-button')
    if (table.style.display === "none" || table.style.display === "") {
        table.style.display = "table"; // Hiển thị bảng
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>'; // Đổi biểu tượng thành mắt đóng
    } else {
        table.style.display = "none"; // Ẩn bảng
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>'; // Đổi biểu tượng thành mắt mở
    }
});

document.getElementById("toggle-button-stock-list").addEventListener("click", () => {
    const table = document.getElementById("stock-data-list-table"); // Chọn bảng

    // Thay đổi biểu tượng và chữ trên nút
    const toggleButton = document.getElementById('toggle-button-stock-list')
    if (table.style.display === "none" || table.style.display === "") {
        table.style.display = "table"; // Hiển thị bảng
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>'; // Đổi biểu tượng thành mắt đóng
    } else {
        table.style.display = "none"; // Ẩn bảng
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>'; // Đổi biểu tượng thành mắt mở
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contentSections = document.querySelectorAll('.content-section');

    // Xử lý sự kiện nhấn nút icon để hiển thị/ẩn menu
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });


    // Xử lý sự kiện nhấn liên kết trong menu
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Ẩn tất cả các phần nội dung
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // Hiển thị phần nội dung tương ứng
            const targetId = `${link.id}-content`;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Ẩn menu sau khi chọn mục
            navMenu.classList.remove('active');
        });
    });

    // Hiển thị phần nội dung mặc định (Home)
    document.getElementById('stock-info-content').classList.add('active');
});

// Lấy trạng thái dark mode từ localStorage
const isDarkMode = localStorage.getItem('dark-mode') === 'true';
// Hàm để cập nhật giao diện dựa trên trạng thái dark mode
function updateDarkMode(isDarkMode) {
    document.body.classList.toggle('dark-mode', isDarkMode);
}

/*
 ======================================= KHAI BÁO IPC RENDERER GỌI ĐẾN MAIN LẤY DỮ LIỆU ===========================================================
*/

// Hàm để lấy dữ liệu cổ phiếu từ main process và hiển thị
async function fetchAndDisplayStockData() {
    try {
        const data = await window.ipcRenderer.invoke('fetch-stock-data', listSymbol);
        if (data && data.length > 0) {
            displayStockData(data[0]);
            displayStockDataList(data);
            // updateCharts(data[0]); // Giả sử `data` là một mảng và sử dụng phần tử đầu tiên
        }
    } catch (error) {
        // alert('Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại sau.'); // Thông báo khi có lỗi
        console.log(error);
    }
}
const count = 0;

// Hàm để lấy dữ liệu khớp lệnh của cổ phiếu
async function fetchIntradayData() {
    try {
        const data = await window.ipcRenderer.invoke('fetch-intraday', symbolMain);
        if (data) {
            displayStockIntraday(data);
        }
    } catch (error) {
        // alert('Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại sau.'); // Thông báo khi có lỗi
        console.log(error);
    }
}

// Hàm lấy dữ liệu lịch sử của cổ phiếu
async function fetchPriceStockHistory() {
    try {
        const data = await window.ipcRenderer.invoke('fetch-price-stock-history', symbolMain);
        if (data) {
            displayPriceStockHistory(data);
        }
    } catch (error) {
        // alert('Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại sau.'); // Thông báo khi có lỗi
        console.log(error);
    }
}

// Hàm lấy dữ liệu lịch VNINDEX
async function fetchVnIndexInfor() {
    try {
        const data = await window.ipcRenderer.invoke('fetch-vnindex-infor');
        if (data) {
            displayVnindexData(data.data);
        }
    } catch (error) {
        // alert('Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại sau.'); // Thông báo khi có lỗi
        console.log(error);
    }
}

// Hàm lấy dữ liệu giao dịch NDT nước ngoài
async function fetchForeignTrade() {
    try {
        const data = await window.ipcRenderer.invoke('fetch-foreign-trade');
        if (data) {
            displayForeignTrade(data.Data);
        }
    } catch (error) {
        // alert('Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại sau.'); // Thông báo khi có lỗi
        console.log(error);
    }
}

//Hàm lấy dữ liệu top cổ phiếu ảnh hưởng tới VNINDEX
async function fetchTopInfluence() {
    try {
        const data = await window.ipcRenderer.invoke('fetch-top-influence');
        if (data) {
            displayTopInfluence(data);
        }
    } catch (error) {
        // alert('Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại sau.'); // Thông báo khi có lỗi
        console.log(error);
    }
}

//Hàm lấy dữ liệu thống kê giao dịch nước ngoài
async function fetchForeignTradeDaily() {
    try {
        const data = await window.ipcRenderer.invoke('fetch-top-foreign-trade-daily');
        if (data) {
            displayForeignTradeDaily(data);
        }
    } catch (error) {
        // alert('Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại sau.'); // Thông báo khi có lỗi
        console.log(error);
    }
}

/*
 ======================================= NƠI GỌI HÀM KHỞI TẠO DỮ LIỆU KHI CHẠY ỨNG DỤNG ===========================================================
*/

// Gọi hàm để lấy dữ liệu lần đầu tiên khi trang được tải
fetchAndDisplayStockData();
fetchIntradayData();
updateDarkMode();
fetchPriceStockHistory();
fetchVnIndexInfor();
fetchForeignTrade();
fetchTopInfluence();
fetchForeignTradeDaily();

// Tạo một interval để gọi hàm fetchAndDisplayStockData mỗi 2 giây
setInterval(fetchAndDisplayStockData, 2000); // 2000 milliseconds = 2 seconds
setInterval(fetchIntradayData, 10000);
setInterval(fetchVnIndexInfor, 5000);
setInterval(() => { fetchForeignTrade, fetchTopInfluence, fetchForeignTradeDaily }, 150000);