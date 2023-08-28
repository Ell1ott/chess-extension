// Function to save the toggle state to Chrome storage
function saveState(name, state) {
  chrome.storage.local.set({ [name]: state }, function () {
    console.log("Toggle state saved:", state);
  });
}

// Function to load the toggle state from Chrome storage
function loadToggleState(callback) {
  chrome.storage.local.get(["colorBg", "eloColorChange"], function (result) {
    callback(result);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleElement = document.getElementById("color-bg-toggle");
  const numberElement = document.getElementById("elo-color-range");

  // Load initial toggle state from storage
  loadToggleState(function (result) {
    console.log(result);
    toggleElement.checked = result.colorBg || false;
    numberElement.value = result.eloColorChange || 40;
    // console.log(toggleState);
  });

  // Add event listener to toggle switch
  toggleElement.addEventListener("change", function () {
    const newState = toggleElement.checked;
    saveState("colorBG", newState);
    console.log("changed");
  });
  numberElement.addEventListener("change", function () {
    const newState = numberElement.value;
    saveState("eloColorChange", newState);
    console.log("changed");
  });
});
