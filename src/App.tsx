import { useEffect, useState } from "react";
import "./App.css";

type ChessMove = {
  moveNumber: number;
  piece: string;
  move: string;
};

function App() {
  const [moves, setMoves] = useState<ChessMove[]>([]);

  useEffect(() => {
    // Request latest moves when popup opens
    chrome.runtime.sendMessage({ type: "GET_LATEST_MOVES" }, (response) => {
      if (response && response.moves) {
        console.log("Fetched latest moves:", response.moves);
        setMoves(response.moves);
      }
    });

    const messageListener = (message: any) => {
      if (message.type === "FORWARDED_MOVES") {
        console.log("Received moves in popup:", message.moves);
        setMoves(message.moves);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-center mt-4">AutoChess</h1>
      <table className="min-w-full border-collapse border border-gray-200 mt-4 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
              Move Number
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
              Piece
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
              Move
            </th>
          </tr>
        </thead>
        <tbody>
          {moves.reverse().map((move, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {move.moveNumber}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {move.piece}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {move.move}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
