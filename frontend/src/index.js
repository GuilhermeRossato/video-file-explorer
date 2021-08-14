import FileExplorer from "./FileExplorer.js";

window.addEventListener("DOMContentLoaded", function() {
  const domContainer = document.querySelector('div');
  ReactDOM.render(<FileExplorer />, domContainer);
});

