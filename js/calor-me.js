function init() {
  document.getElementById("addFuel").addEventListener("click",
    function(e) {
      showDialog(document.getElementById("add-food"));
      e.preventDefault();
    }, false);
  var cancelButtons = document.querySelectorAll("button.cancel");
  // TODO: Up to here
}
window.addEventListener("DOMContentLoaded", init, false);

function showDialog(dialog, action) {
  showOrHideDialog(dialog, "show");
}

function hideDialog(dialog) {
  showOrHideDialog(dialog, "hide");
}

function showOrHideDialog(dialog, action) {
  var overlay = document.querySelector(".overlay-container");
  overlay.style.display = action == "show" ? "block" : "none";
  dialog.setAttribute("aria-hidden", action == "show" ? "false" : "true");
}
