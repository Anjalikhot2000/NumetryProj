import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import './App.css';

const App = () => (
  <Router>
    <div className="app-container">
    <div className="left-panel">
      <h1>Always Experience the best!!!</h1>
    </div>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  </Router>
);

export default App;
