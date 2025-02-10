console.log("AutoChess content script loaded");

type ChessMove = {
  moveNumber: number;
  piece: string;
  move: string;
};

function extractChessMoves(): ChessMove[] {
  console.log("Extracting chess moves...");

  let container = document.getElementById("live-game-tab-scroll-container");
  if (!container) {
    console.warn("Container not found");
    return [];
  }

  let moveListComponent = container.querySelector("wc-simple-move-list");
  if (!moveListComponent) {
    console.warn("Move list component not found");
    return [];
  }

  let moveNodes: NodeListOf<Element> = moveListComponent.querySelectorAll(
    ".main-line-row .node"
  );

  let moveList: ChessMove[] = [];

  moveNodes.forEach((node: Element, index: number) => {
    let pieceIcon = node.querySelector(".icon-font-chess") as HTMLElement;
    let moveText = node.querySelector(
      "span.node-highlight-content"
    ) as HTMLElement;

    let piece: string = "Pawn"; // Default to pawn
    if (pieceIcon) {
      const pieceMap: Record<string, string> = {
        K: "King",
        Q: "Queen",
        R: "Rook",
        B: "Bishop",
        N: "Knight",
      };
      let pieceType = pieceIcon.getAttribute("data-figurine") ?? "";
      piece = pieceMap[pieceType] || "Pawn";
    }

    if (moveText) {
      let move = moveText.innerText.trim();
      moveList.push({
        moveNumber: Math.floor(index / 2) + 1,
        piece: piece,
        move: move,
      });
    }
  });

  return moveList;
}

// Function to send moves
function sendMovesToPopup() {
  const moves = extractChessMoves();
  try {
    chrome.runtime.sendMessage({ type: "UPDATE_MOVES", moves });
  } catch (error) {
    console.error("Failed to send message to popup:", error);
  }
}

// Watch for changes in the move list
const observer = new MutationObserver(() => {
  sendMovesToPopup();
});

// Wait for container to exist before observing
const waitForElement = setInterval(() => {
  const container = document.getElementById("live-game-tab-scroll-container");
  if (container) {
    clearInterval(waitForElement);
    console.log("Container found, observing for moves...");

    observer.observe(container, { childList: true, subtree: true });
    sendMovesToPopup(); // Send initial moves
  }
}, 1000);
