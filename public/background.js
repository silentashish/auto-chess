let extensionWindowId = null;

// When the extension icon is clicked, open or focus the window
chrome.action.onClicked.addListener(() => {
  if (extensionWindowId) {
    chrome.windows.update(extensionWindowId, { focused: true });
  } else {
    chrome.windows.create(
      {
        url: "index.html",
        type: "popup",
        width: 400,
        height: 600
      },
      (window) => {
        extensionWindowId = window.id;
      }
    );
  }
});

// Remove window ID when it's closed
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === extensionWindowId) {
    extensionWindowId = null;
  }
});

// Handle messages from content script
let latestMoves = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_MOVES") {
    console.log("Received moves in background:", message.moves);
    latestMoves = message.moves;

    // Forward moves to the extension window
    chrome.runtime.sendMessage({ type: "FORWARDED_MOVES", moves: latestMoves });
  } else if (message.type === "GET_LATEST_MOVES") {
    sendResponse({ moves: latestMoves });
  }
});
