import './App.css'
import Account from './Components/Account'
import MyHeader from './Components/MyHeader'
import Navbar from './Components/Navbar'
import { Outlet } from 'react-router-dom'
import { PartyCodeProvider } from './Contexts/PartyCodeContext'
import { FormStateProvider } from './Contexts/FormStateContext'

function App() {
  return (
    <FormStateProvider>
      <PartyCodeProvider>
        <Account />
        <MyHeader />
        <Navbar />
        <div className="p-6 bg-white min-h-screen">
          <Outlet />
        </div>
      </PartyCodeProvider>
    </FormStateProvider>
  );
}

export default App
