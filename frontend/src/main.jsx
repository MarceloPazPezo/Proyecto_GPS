import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import Join from './pages/Join';
import Salas from "./pages/Salas"
import { io } from 'socket.io-client';
import Quiz from './pages/Quiz';
import Host from './pages/Host';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';

export const socket = io("/");

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path:"/room",
        element:<Salas/>
      },
      {
        path:"/host",
        element:<Host/>
      }
    ]
  },
  {
    path: '/auth',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path:"/join",
    element:<Join/>
  },
  {
    path:'/quiz',
    element:<Quiz/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)