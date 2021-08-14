import FileExplorer from "./FileExplorer.js";

window.addEventListener("DOMContentLoaded", function () {
  var domContainer = document.querySelector('div');
  ReactDOM.render(React.createElement(FileExplorer, null), domContainer);
});