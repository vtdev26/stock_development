// Hàm để hiển thị dữ liệu cổ phiếu
function displayStockData(data) {
    // Đảm bảo rằng phần tử HTML với id "stock-data" tồn tại
    const updateTime = new Date().toLocaleTimeString();
    const stockDataElement = document.getElementById('stock-data');

    // Lấy ra thông tin chi tiết từ dữ liệu
    const { sym, mc, c, f, r, lastPrice, lastVolume, lot, ot, changePc, avePrice, highPrice, lowPrice } = data[0];

            // Tạo nội dung HTML với hàng dữ liệu
    const htmlContent = `
    <h2>Thông tin cổ phiếu: ${sym}</h2>
    <p>Thời gian cập nhật: ${updateTime}</p>
    <div class="data-row">
        <div class="data-item"><strong>Mã ngành:</strong> ${mc}</div>
        <div class="data-item"><strong>Giá trần:</strong> ${c}</div>
        <div class="data-item"><strong>Giá sàn:</strong> ${f}</div>
        <div class="data-item"><strong>Giá tham chiếu:</strong> ${r}</div>
        <div class="data-item"><strong>Giá cuối cùng:</strong> ${lastPrice}</div>
        <div class="data-item"><strong>Khối lượng giao dịch cuối cùng:</strong> ${lastVolume}</div>
        <div class="data-item"><strong>Tổng khối lượng:</strong> ${lot}</div>
        <div class="data-item"><strong>Thay đổi:</strong> ${ot}</div>
        <div class="data-item"><strong>Thay đổi %:</strong> ${changePc}</div>
        <div class="data-item"><strong>Giá trung bình:</strong> ${avePrice}</div>
        <div class="data-item"><strong>Giá cao nhất:</strong> ${highPrice}</div>
        <div class="data-item"><strong>Giá thấp nhất:</strong> ${lowPrice}</div>
    </div>
`;
    // Cập nhật nội dung của phần tử HTML
    stockDataElement.innerHTML = htmlContent;
}


// Hàm để lấy dữ liệu cổ phiếu từ main process và hiển thị
async function fetchAndDisplayStockData() {
    try {
        const data = await window.ipcRenderer.invoke('fetch-stock-data', 'LAS');
        if (data) {
            displayStockData(data);  // Hiển thị dữ liệu nếu có
        } else {
            console.error('Không có dữ liệu để hiển thị.');
            document.getElementById('stock-data').innerText = 'Không có dữ liệu để hiển thị.';
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
        document.getElementById('stock-data').innerText = 'Error fetching stock data.';
    }
}

// Gọi hàm để lấy dữ liệu lần đầu tiên khi trang được tải
fetchAndDisplayStockData();

// Tạo một interval để gọi hàm fetchAndDisplayStockData mỗi 2 giây
setInterval(fetchAndDisplayStockData, 2000); // 2000 milliseconds = 2 seconds
