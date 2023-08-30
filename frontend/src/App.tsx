import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import './config';
import { GamePage, HomePage } from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/game',
    element: <GamePage />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
