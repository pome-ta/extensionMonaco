let mainWindow;

chrome.action.onClicked.addListener(async () => {
  mainWindow = await chrome.windows.create({
    url: './src/index.html',
    type: 'popup',
    width: 640,
    height: 600,
  });
});
