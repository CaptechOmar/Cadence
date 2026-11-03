const { app, BrowserWindow, Menu, session, globalShortcut } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('enable-features', 'GamepadButtonAxisEvents');

function create() {
  // The music server lives on another address, so allow its answers to reach the page.
  session.defaultSession.webRequest.onHeadersReceived((d, cb) => {
    const h = Object.assign({}, d.responseHeaders);
    for (const k of Object.keys(h)) if (/^access-control-/i.test(k)) delete h[k];
    h['Access-Control-Allow-Origin'] = ['*'];
    h['Access-Control-Allow-Headers'] = ['*'];
    h['Access-Control-Allow-Methods'] = ['GET, HEAD, OPTIONS'];
    cb({ responseHeaders: h });
  });
  const win = new BrowserWindow({
    width: 1280, height: 720, fullscreen: true, minWidth: 640, minHeight: 400, backgroundColor: '#111111', title: 'Couchtunes',
    autoHideMenuBar: true, icon: path.join(__dirname, 'icon.png'),
    webPreferences: { backgroundThrottling: false, spellcheck: false }
  });
  Menu.setApplicationMenu(null);
  // ?tv turns on the 10-foot layout, focus navigation and game controller support
  win.loadFile(path.join(__dirname, 'app', 'index.html'), { query: { tv: '1' } });
  win.webContents.on('before-input-event', (e, i) => {
    if (i.type === 'keyDown' && i.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
