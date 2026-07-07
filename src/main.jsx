import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// 在 React 渲染前先套用主題,避免畫面閃爍(預設暗色)
const savedTheme = localStorage.getItem('theme')
document.documentElement.classList.toggle('dark', savedTheme !== 'light')

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
