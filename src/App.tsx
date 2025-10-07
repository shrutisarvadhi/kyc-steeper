import './App.css';
import Account from './Components/Account';
import MyHeader from './Components/MyHeader';
import Navbar from './Components/Navbar';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <Account />
      <MyHeader />
      <Navbar />
      <div className="p-6 bg-white min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default App;