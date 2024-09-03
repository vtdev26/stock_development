/*
 ======================================= KHỞI TẠO DỮ LIỆU GLOBAL ===========================================================
*/

/* Dữ liệu khởi tạo */
let changePc = -11; // Tỷ lệ thay đổi phần trăm
let symbolMain = 'LAS'; // Mã cổ phiếu chính

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
    let changeClass = 'neutral';

    // Xác định tình trạng thay đổi giá
    if (r < lastPrice) {
        status = '+';
        changeClass = 'positive'; // Áp dụng lớp CSS cho giá trị dương
    }

    if (r > lastPrice) {
        status = '-';
        changeClass = 'negative'; // Áp dụng lớp CSS cho giá trị âm
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
                    <td class="label">Khối lượng giao dịch</td><td class="value">${lastVolume}</td>
                </tr>
                <tr>
                    <td class="label">Tổng khối lượng</td><td class="value">${lot * 10}</td>
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

function displayStockIntraday(data) {
    const stockDataElement = document.getElementById('stock-intraday');

    // Lấy thời gian hiện tại
    const updateTime = new Date().toLocaleTimeString();

    // Xóa nội dung hiện tại của phần tử container
    stockDataElement.innerHTML = '';

    // Tạo phần tử bao bọc các nút
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container'); // Thêm lớp CSS cho phần tử bao bọc

    // Tạo nút Reload
    const reloadButton = document.createElement('button');
    reloadButton.innerHTML = `<i class="fas fa-sync-alt"></i> ${updateTime}`; // Thêm biểu tượng vào nút
    reloadButton.id = 'reload-button';
    // Thêm sự kiện click cho nút reload
    reloadButton.addEventListener('click', () => {
        fetchIntradayData();
    });

    const toggleButton = document.createElement("button");
    toggleButton.id = "toggle-button";
    toggleButton.innerHTML = '<i class="fas fa-eye"></i>'; // Thêm biểu tượng mắt cho nút ẩn/hiện

    // Thêm sự kiện click cho nút ẩn/hiện
    // toggleButton.onclick = function () {
    //     const table = document.getElementById('stock-data-table');
    //     if (table.style.display === "none" || table.style.display === "") {
    //         table.style.display = "table"; // Hiển thị bảng
    //         toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>'; // Đổi biểu tượng thành mắt đóng
    //     } else {
    //         table.style.display = "none"; // Ẩn bảng
    //         toggleButton.innerHTML = '<i class="fas fa-eye"></i>'; // Đổi biểu tượng thành mắt mở
    //     }
    // };


    // Thêm nút Reload và Toggle vào container
    buttonContainer.appendChild(reloadButton);
    buttonContainer.appendChild(toggleButton);

    // Thêm phần tử bao bọc vào container chính
    stockDataElement.appendChild(buttonContainer);

    // Tạo bảng HTML với phần đầu
    let tableHTML = `
        <table id="stock-data-table" border="1" cellspacing="0" cellpadding="5">
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
    data.forEach(item => {
        let matchTypeClass;
        if (item.matchType === 's') {
            matchTypeClass = 'red'; // Lớp CSS cho màu đỏ
        } else if (item.matchType === 'b') {
            matchTypeClass = 'green'; // Lớp CSS cho màu xanh
        } else {
            matchTypeClass = 'yellow'; // Lớp CSS mặc định nếu không có điều kiện
        }
        tableHTML += `
                <tr>
                <td>${item.matchVol}</td>
                <td>${item.matchPrice}</td>
                <td class="${matchTypeClass}">${item.matchType}</td>
                <td>${item.accumulatedVolume}</td>
                <td>${new Date(item.createdAt).toLocaleTimeString()}</td>
                </tr>`;
    });

    // Đóng bảng
    tableHTML += `
                </tbody>
            </table>`;
    // Cập nhật nội dung của phần tử "stock-intraday" với bảng HTML đã tạo
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

    const dataStockHistory = data.Data;

    // Lấy thời gian hiện tại
    // const updateTime = new Date().toLocaleTimeString();    

    // Tạo bảng HTML với phần đầu
    let tableHTML = `
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
    // Cập nhật nội dung của phần tử "stock-intraday" với bảng HTML đã tạo
    stockDataElement.innerHTML += tableHTML;
}

function displayVnindexData(data) {
    // Đảm bảo rằng phần tử HTML với id "stock-data" tồn tại
    const stockDataElement = document.getElementById('vnindex-data');
    console.log(stockDataElement);
    

    // Lấy thời gian hiện tại
    const updateTime = new Date().toLocaleTimeString();

    if (!data) {
        return;
    }

    // Tạo nội dung HTML với bảng
    const htmlContent = `
        <h2>Thông tin: ${data.ticker} </h2>
        <p>Thời gian cập nhật: ${updateTime}</p>
        <table class="vnindex-table">
            <tbody>
                <tr>
                    <td class="label">Giá tham chiếu</td><td class="value">${data.priceReference}</td>
                </tr>
                <tr>
                    <td class="label">Giá mở cửa</td><td class="value">${data.priceOpen}</td>
                </tr>
                <tr>
                    <td class="label">Giá thấp nhất</td><td class="value">${data.priceHigh}</td>
                </tr>
                <tr>
                    <td class="label">Giá cao nhất</td><td class="value">${data.priceLow}</td>
                </tr>
                <tr>
                    <td class="label">Khối lượng khớp lệnh</td><td class="value">${data.totalVolume}</td>
                </tr>
                <tr>
                    <td class="label">Giá trị khớp lệnh</td><td class="value">${data.totalValue}</td>
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
    stockDataElement.innerHTML = htmlContent;
}

/*
======================================= XỬ LÝ SỰ KIỆN TRÊN ỨNG DỤNG ===========================================================
*/

// Hàm để lấy dữ liệu cổ phiếu từ symbol text box và gán lại giá trị symbol
document.getElementById('fetchStock').addEventListener('click', () => {
    const symbol = document.getElementById('stockSymbol').value;
    if (symbol) {
        symbolMain = symbol;
    } else {
        alert('Vui lòng nhập mã cổ phiếu.');
    }
});

document.getElementById('toggleDarkMode').addEventListener('click', () => {
    // Lưu trạng thái dark mode vào localStorage    
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode);
});

document.addEventListener('DOMContentLoaded', () => {
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
        const data = await window.ipcRenderer.invoke('fetch-stock-data', symbolMain);
        if (data && data.length > 0) {
            displayStockData(data[0]);
            // updateCharts(data[0]); // Giả sử `data` là một mảng và sử dụng phần tử đầu tiên
        }
    } catch (error) {
        // alert('Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại sau.'); // Thông báo khi có lỗi
        console.log(error);
    }
}

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

/*
 ======================================= NƠI GỌI HÀM KHỞI TẠO DỮ LIỆU KHI CHẠY ỨNG DỤNG ===========================================================
*/

// Gọi hàm để lấy dữ liệu lần đầu tiên khi trang được tải
fetchAndDisplayStockData();
fetchIntradayData();
updateDarkMode();
fetchPriceStockHistory();
fetchVnIndexInfor();

// Tạo một interval để gọi hàm fetchAndDisplayStockData mỗi 2 giây
setInterval(fetchAndDisplayStockData, 10000); // 2000 milliseconds = 2 seconds
setInterval(fetchIntradayData, 10000);