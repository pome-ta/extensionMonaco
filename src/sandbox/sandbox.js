const sbTag = document.createElement('div');

console.log = function (log) {
  sbTag.innerHTML += log + '\n';
};

window.addEventListener('message', (e) => {
  sbTag.innerHTML = '';
  const date = new Date();
  const timeStr = date.toLocaleTimeString();
  const code = e.data;
  try {
    eval(code);
    e.source.postMessage(
      {
        result: { time: timeStr, success: true, code: sbTag.textContent },
        isSandbox: true,
      },
      e.origin
    );
  } catch (error) {
    e.source.postMessage(
      {
        result: { time: timeStr, success: false, code: error },
        isSandbox: true,
      },
      e.origin
    );
  }
});