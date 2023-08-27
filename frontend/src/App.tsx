import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { GamePage, HomePage } from "./pages";

// import { io } from "socket.io-client";

// const socket = io("http://localhost:3001/");

// socket.on("connect", () => {
//   console.log(`socket.connected: ${socket.connected}`); // true
// });

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/game",
    element: <GamePage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
