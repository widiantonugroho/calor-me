function init() {
  // Add event handlers to the buttons.
  //
  // Although it is possible to attach the event handlers in the HTML using
  // attributes such as "onclick" this makes the HTML harder to read.
  //
  // Instead we are using an approach called "unobtrusive javascript" to add the
  // event handlers later.
  document.getElementById("addFood").addEventListener("click",
    function(e) {
      launchDialogById('add-food');
      e.preventDefault();
    }, false);
  document.getElementById("addActivity").addEventListener("click",
    function(e) {
      launchDialogById('add-activity');
      e.preventDefault();
    }, false);

  // Set up handler for the "Cancel" button on the little forms that pop up
  //
  // This is complicated because we are doing it in a generic fashion where we
  // first search for the buttons and then try to determine the "dialog" they
  // belong too.
  //
  // First, search for the buttons using the Selectors API
  var cancelButtons =
    document.querySelectorAll("section[aria-role=dialog] button.cancel");
  for (var i = 0; i < cancelButtons.length; i++) {
    cancelButtons[i].addEventListener("click",
      function(e) {
        // We have the button, now we search upwards to find the first <section>
        // element with the attribute aria-role="dialog"
        var dialog = e.target;
        while(dialog &&
              (dialog.tagName !== "SECTION" ||
               dialog.getAttribute("aria-role").toLowerCase() !== "dialog")) {
          dialog = dialog.parentNode;
        }
        // If we found the dialog, hide it
        if (dialog) {
          hideDialog(dialog);
          e.preventDefault();
        }
      }, false);
  }
}
window.addEventListener("DOMContentLoaded", init, false);

function launchDialogById(id) {
  var dialog = document.getElementById(id);
  console.assert(dialog, "Dialog not found");
  resetDialog(dialog);
  showDialog(dialog);
}

function showDialog(dialog) {
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

function resetDialog(dialog) {
  // XXX
}
