import './App.css';
import Signup from './components/Signup'; // This should match the file name casing exactly.





function App() {
  return (
    <div className="App">
      <header className="App-header">
       HousePlacer
      </header>
      <p>Welcome to HousePlacer: the centralized application for all CWRU housing needs! For first time users, please create an account. 
        For those returning users, feel free to navigate to the relevant sign in portal. </p>
      <Signup></Signup>
    </div>
  );
}

export default App;
