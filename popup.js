// Function to save the toggle state to Chrome storage
function saveToggleState(state) {
  chrome.storage.local.set({ colorBg: state }, function () {
    console.log("Toggle state saved:", state);
  });
}

// Function to load the toggle state from Chrome storage
function loadToggleState(callback) {
  chrome.storage.local.get(["colorBg"], function (result) {
    const toggleState = result.colorBg;
    callback(toggleState);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleElement = document.getElementById("color-bg-toggle");

  // Load initial toggle state from storage
  loadToggleState(function (toggleState) {
    toggleElement.checked = toggleState || false;
    console.log(toggleState);
  });

  // Add event listener to toggle switch
  toggleElement.addEventListener("change", function () {
    const newState = toggleElement.checked;
    saveToggleState(newState);
    console.log("changed");
  });
});
