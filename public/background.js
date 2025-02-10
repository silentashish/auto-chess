let extensionWindowId = null;

chrome.action.onClicked.addListener(() => {
  if (extensionWindowId) {
    // Check if the window is still open before focusing
    chrome.windows.get(extensionWindowId, (win) => {
      if (chrome.runtime.lastError || !win) {
        console.log("Extension window closed, creating a new one...");
        openExtensionWindow();
      } else {
        console.log("Focusing existing extension window...");
        chrome.windows.update(extensionWindowId, { focused: true });
      }
    });
  } else {
    openExtensionWindow();
  }
});

function openExtensionWindow() {
  chrome.windows.create(
    {
      url: "index.html",
      type: "popup",
      width: 450,
      height: 650
    },
    (window) => {
      extensionWindowId = window.id;
      console.log("Extension window opened with ID:", extensionWindowId);
    }
  );
}

// Remove stored window ID when it's closed
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === extensionWindowId) {
    console.log("Extension window closed, resetting ID...");
    extensionWindowId = null;
  }
});

// Handle messages from content script
let latestMoves = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_MOVES") {
    console.log("Received moves in background:", message.moves);
    latestMoves = message.moves;
    chrome.runtime.sendMessage({ type: "FORWARDED_MOVES", moves: latestMoves });
  } else if (message.type === "GET_LATEST_MOVES") {
    sendResponse({ moves: latestMoves });
  }
});
