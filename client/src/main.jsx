import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import WatchlistProvider from './context/WatchlistContext.jsx'
import { router } from './Routes/Routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <WatchlistProvider>
          <RouterProvider router={router}></RouterProvider>
        </WatchlistProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
