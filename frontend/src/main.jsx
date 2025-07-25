import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import QuizCrear from '@pages/QuizCrear';
import Join from './pages/Join';
import Salas from "./pages/Salas"
import { io } from 'socket.io-client';
import Quiz from './pages/Quiz';
import Host from './pages/Host';
import ProtectedRoute from '@components/ProtectedRoute';
import PizarraIdeas from './pages/pizarraIdeas';
import HostIdeas from './pages/hostIdeas';
import QuizActualizar from './pages/QuizActualizar';
import '@styles/styles.css';
import WaitingRoom from './pages/WaitingRoom';
import Biblioteca from './pages/Biblioteca.jsx';
import StickyHost from './pages/stickyNotesHost.jsx';
import StickyNotesGuest from './pages/StickyNotesGuest.jsx';
import ScoreBoard from './pages/ScoreBoard.jsx';
import Carreras from './pages/Carreras.jsx';
import MisCarreras from './pages/MisCarreras.jsx';
import MisUsuarios from './pages/MisUsuarios.jsx';
export const socket = io("/", { reconnection: true });

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
        path: "/room",
        element: <Salas />
      },
      {
        path: "/host/:id",
        element: <Host />
      },
      {
        path: "/hostIdeas",
        element: <HostIdeas />
      },
      {
        path: "/createQuiz",
        element: <QuizCrear />
      },
      {
        path: '/updateQuiz/:id',
        element: <QuizActualizar />
      },
      {
        path: '/biblioteca',
        element: <Biblioteca />
      },
      {
        path: '/scoreBoard',
        element: <ScoreBoard />
      },
      {
        path: '/carreras',
        element: <Carreras />
      },
      {
        path: '/miscarreras',
        element: <ProtectedRoute allowedRoles={['encargado_carrera']}>
          <MisCarreras />
        </ProtectedRoute>
      },
      {
        path: '/misusuarios',
        element: <ProtectedRoute allowedRoles={['encargado_carrera']}>
          <MisUsuarios />
        </ProtectedRoute>
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
    path: "/join",
    element: <Join />
  },
  {
    path: '/quiz',
    element: <Quiz />
  },
  {
    path: '/espera',
    element: <WaitingRoom />
  },
  {
    path: "/ideas",
    element: <PizarraIdeas />
  },
  {
    path: "/notas",
    element: <StickyNotesGuest />
  },
  {
    path: '/stickyHost/:idMural',
    element: <StickyHost />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)