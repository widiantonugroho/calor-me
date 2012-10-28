/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

function init() {
  // Add event handlers to the buttons.
  //
  // Although it is possible to attach the event handlers in the HTML using
  // attributes such as "onclick" this makes the HTML harder to read.
  //
  // Instead we are using an approach called "unobtrusive javascript" to add the
  // event handlers later.
  initTabs();
  initSummary();
  initLog();
  initSettings();
}
window.addEventListener("load", init, false);

function initTabs() {
  // Tab navigation
  var tablinks = document.querySelectorAll("menu[aria-role=tablist] a");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].addEventListener("click",
      function(e) {
        var match = /#[^#]+$/.exec(e.target.href);
        if (match) {
          var selectedId = match[0].substr(1);
          var tabs = document.querySelectorAll("section[aria-role=tab]");
          for (var j = 0; j < tabs.length; j++) {
            var tab = tabs[j];
            tab.setAttribute("aria-selected",
                             tab.id === selectedId ? "true" : "false");
          }
          e.preventDefault();
          // Play tab switch sound if available
          var sfx = document.getElementById('tabSwitchSound');
          if (sfx)
            sfx.play();
        }
      },
      false
    );
  }
}

/* --------------------------------------
 *
 * SUMMARY
 *
 * --------------------------------------*/

function initSummary() {
  document.getElementById("showFoodForm").addEventListener("click",
    function(e) {
      launchDialogById('add-food');
      e.preventDefault();
    }, false);
  document.getElementById("showActivityForm").addEventListener("click",
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

  // Handle submitting the different forms
  document.querySelector('#add-food form').addEventListener("submit",
      function(e) {
        addFood();
        e.preventDefault();
      }, false
    );
  document.querySelector('#add-activity form').addEventListener("submit",
      function(e) {
        addActivity();
        e.preventDefault();
      }, false
    );
}

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
  var forms = dialog.getElementsByTagName("form");
  for (var i = 0; i < forms.length; i++ ) {
    forms[i].reset();
  }
}

function addFood() {
  // TODO
  hideDialog(document.getElementById('add-food'));
  document.getElementById('riseSound').play();
}

function addActivity() {
  // TODO
  hideDialog(document.getElementById('add-activity'));
  document.getElementById('fallSound').play();
}

/* --------------------------------------
 *
 * LOG
 *
 * --------------------------------------*/

function initLog() {
  // Register one event listener on the log container and use it to detect
  // clicks on the summary elements (which are dynamically added).
  // This works so long as we turn off pointer-events on all child content
  // which is certainly not very presentational.
  document.getElementById("log").addEventListener("click",
      function (evt) {
        if (evt.target.tagName === "DETAILS") {
          var details = evt.target;
          if (details.hasAttribute("open")) {
            details.removeAttribute("open");
          } else {
            details.setAttribute("open", "open");
          }
        }
      }, false
    );
}

/* --------------------------------------
 *
 * SETTINGS
 *
 * --------------------------------------*/

function initSettings() {
  // Listen to changes to gender
  var genderRadios =
    document.querySelectorAll("input[type=radio][name=gender]");
  for (var i = 0; i < genderRadios.length; i++) {
    var radio = genderRadios[i];
    radio.addEventListener("change", onChangeGender, false);
  }

  // TODO Need to store the gender, set the radio buttons and update the
  // diagram accordingly
}

function onChangeGender(evt) {
  var figure = document.getElementById("figure");
  figure.contentDocument.setGender(evt.target.value);
}
