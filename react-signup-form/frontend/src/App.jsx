import SignupForm from './components/SignupForm';
import './App.css';

const App = () => (
  <div className="app-container">
    <div className="left-panel">
      <h1>Sign Up for the Best Experience</h1>
    </div>
    <div className="right-panel">
      <SignupForm />
    </div>
  </div>
);

export default App;