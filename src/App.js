import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Portal from './pages/Portal';

function App() {
  return (
    <div className="App">
      <ReactNotifications />
      <Router>
        <Routes>
        <Route
          path="/"
          element={<Login/>}/>
        <Route
          path="/portal"
          element={<Portal/>}/>
        </Routes>
      </Router>

    </div>
  );
}

export default App;
