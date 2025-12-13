import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/tailwind.css'
import App from './App';

//Render the app
const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}


