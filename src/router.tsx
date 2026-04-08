import { createBrowserRouter } from 'react-router'
import App from './App'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
])
