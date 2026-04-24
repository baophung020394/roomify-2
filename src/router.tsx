import { createBrowserRouter } from 'react-router'
import App from './App'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import VisualizerId from './pages/VisualizerId';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'visualizer/:id', element: <VisualizerId /> },
    ],
  },
])
