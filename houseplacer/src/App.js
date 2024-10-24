import './App.css';
import Signup from './components/signup'; 
import StudentPortal from './components/studentportal'; 
import ManagerPortal from './components/managerportal'; 
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';



const Welcome = () =>{
  const location = useLocation();

  if(location.pathname !== "/"){
    return null;
  }
  return (

    <p>Welcome to HousePlacer: the centralized application for all CWRU housing needs! For first time users, please create an account. 
      For those returning users, feel free to navigate to the relevant sign in portal. </p>
  );
};

function App() {

  return (
    <Router>
    <div className="App">
      <header className="App-header">
       HousePlacer
      </header>
      <Welcome/>
      <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/studentportal" element={<StudentPortal />} />
          <Route path="/managerportal" element={<ManagerPortal />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
