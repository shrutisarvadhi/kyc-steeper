import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter';
import { FormStateProvider } from './Contexts/FormStateContext.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </StrictMode>,
)
