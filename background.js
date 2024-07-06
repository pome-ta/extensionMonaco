chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: './src/index.html',
    type: 'popup',
    width: 640,
    height: 480,
  });
});