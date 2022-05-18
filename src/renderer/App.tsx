import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';

const MainMenu = () => {
  return (
    <div>
      <div className="MainMenu">
        <div className="StarterOptions">
          <a href="/TableView">
            <button type="button">New</button>
          </a>
          <button type="button">Load</button>
        </div>
        <div>
          <h3 className="StarterInstructions">
            Click one of the buttons above to create a new app table or edit an
            existing one
          </h3>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
      </Routes>
    </Router>
  );
}
