/**
 * Initialize
 */
let editor = null; // Monaco Editor インスタンス
let sandbox = null; // sandbox で使うiframe 要素

let editorWrap = null; // monaco 本体を反映するdiv をラップしているdiv
let monacoEditor = null; // monaco が反映されるdiv
let controller = null; // 実行ボタン関係をラップしているdiv
let boxConsole = null; // 実行結果table をラップしているdiv

let runCode = null; // 実行button タグ
let clearConsole = null; // 実行結果を削除するbutton タグ
// let clearCode = null; // monaco 内のコードを全消しするbutton タグ

/**
 * Monaco 読み込み and 初期化
 */
// const codeStr = ``;

require.config({
  paths: { vs: 'js/package/dev/vs' },
  'vs/nls': {
    availableLanguages: {
      '*': 'ja',
    },
  },
});

require(['./vs/editor/editor.main'], async () => {
  monacoEditor = monacoEditor
    ? monacoEditor
    : document.querySelector('#monacoEditor');
  editor = monaco.editor.create(monacoEditor, {
    // value: codeStr,
    fontSize: 14,
    language: 'javascript',
    scrollBeyondLastLine: false,
    automaticLayout: false,
    theme: 'vs-dark',
    minimap: {
      enabled: false,
    },
    renderWhitespace: 'all',
    wordWrap: true,
    wrappingIndent: 'same',
    detectIndentation: false,
    tabSize: 2,
  });
});

// [javascript - Monaco editor dynamically resizable - Stack Overflow](https://stackoverflow.com/questions/47017753/monaco-editor-dynamically-resizable#:~:text=was%20to%20set-,automaticLayout%3A%20false,-so%20that%20I)
window.addEventListener('resize', () => {
  editor.layout({ width: 0, height: 0 });
  window.requestAnimationFrame(() => {
    const rect = editorWrap.getBoundingClientRect();
    editor.layout({ width: rect.width, height: rect.height });
  });
});

/**
 * boxConsole（実行結果table）
 */
const tbl = document.createElement('table');
const tblBody = document.createElement('tbody');

const setupTable = () => {
  tbl.appendChild(tblBody);
  boxConsole.appendChild(tbl);
};

const addTableRow = (time_success_code) => {
  let issuccess = false;
  const row = document.createElement('tr');

  for (const [key, value] of Object.entries(time_success_code)) {
    const cell = document.createElement('td');
    const cellText = document.createElement('code');
    cellText.innerText = value;

    if (key === 'success') {
      issuccess = value;
      cellText.innerText = issuccess ? '🟢' : '❌';
    }
    cell.appendChild(cellText);
    row.appendChild(cell);
  }
  issuccess ? row.classList.add('success') : row.classList.add('noSuccess');
  tblBody.prepend(row);
};

const removeTableRow = () => {
  while (tblBody.firstChild) {
    tblBody.removeChild(tblBody.firstChild);
  }
};

/**
 * sandbox へ投げるメッセージ
 */
const postMessage = () => {
  const src = editor.getValue();
  sandbox.contentWindow.postMessage(src, '*');
};

document.body.addEventListener(
  'keydown',
  (event) => {
    if (event.key === 'Enter' && event.altKey) {
      postMessage();
    }
  },
  false
);

window.addEventListener('message', (e) => {
  if (e.data.isSandbox) {
    addTableRow(e.data.result);
  }
});

/**
 * 起動時処理
 */
document.addEventListener('DOMContentLoaded', (e) => {
  sandbox = document.querySelector('#sandbox');
  editorWrap = document.querySelector('#editorWrap');
  monacoEditor = document.querySelector('#monacoEditor');
  controller = document.querySelector('#controller');
  boxConsole = document.querySelector('#boxConsole');
  setupTable();

  runCode = document.querySelector('#runCode');
  clearConsole = document.querySelector('#clearConsole');
  // clearCode = document.querySelector('#clearCode');

  runCode.addEventListener('click', (e) => postMessage());
  clearConsole.addEventListener('click', (e) => removeTableRow());
});
