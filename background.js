chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "log") {
    console.log("hhhfehfefhefh");
  }
});
