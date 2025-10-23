import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Home } from './components/home'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <Home /> 
  </StrictMode>,
)
