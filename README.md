# electron-quick-start

**Clone and run for a quick way to see Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/latest/tutorial/quick-start) within the Electron documentation.

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.
- `preload.js` - A content script that runs before the renderer process loads.

You can learn more about each of these components in depth within the [Tutorial](https://electronjs.org/docs/latest/tutorial/tutorial-prerequisites).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start
# Go into the repository
cd electron-quick-start
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [Electron Fiddle](https://electronjs.org/fiddle) - Electron Fiddle, an app to test small Electron experiments

## License

[CC0 1.0 (Public Domain)](LICENSE.md)



# Lệhh build app Electron
# npm install electron-builder --save-dev

Các thay đổi đã thực hiện:
Thêm mục build: Mục này chứa các cài đặt cần thiết cho việc đóng gói ứng dụng.

appId: ID duy nhất của ứng dụng.
productName: Tên ứng dụng hiển thị cho người dùng.
directories.buildResources: Thư mục chứa các tài nguyên bổ sung, như tệp biểu tượng.
win: Các cài đặt dành riêng cho Windows, bao gồm:
target: Mục tiêu build là nsis để tạo trình cài đặt Windows.
icon: Đường dẫn tới biểu tượng .ico cho ứng dụng.
nsis: Cấu hình chi tiết cho trình cài đặt NSIS, bao gồm:
oneClick: Thiết lập chế độ cài đặt với nhiều bước.
perMachine: Cài đặt cho tất cả người dùng (yêu cầu quyền quản trị).
allowElevation: Yêu cầu quyền quản trị khi cài đặt.
createDesktopShortcut và createStartMenuShortcut: Tạo shortcut trên desktop và menu Start.
Thêm script build: Được thêm vào phần scripts để chạy electron-builder dễ dàng qua lệnh npm run build.