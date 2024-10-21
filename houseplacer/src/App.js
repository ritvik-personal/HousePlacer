import './App.css';
import Signup from './components/Signup'; // This should match the file name casing exactly.





function App() {
  return (
    <div className="App">
      <header className="App-header">
       HousePlacer
       <p>Welcome to the CWRU centralized application for all housing needs! For first time users, please create an account. 
        For those returning users, feel free to navigate to the relevant sign in portal. </p>
      </header>
      <Signup></Signup>
    </div>
  );
}

export default App;
