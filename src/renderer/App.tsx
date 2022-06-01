import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';
import Nav from './Components/NavigationBar';

function Home() {
  function onNew() {
    console.log('TODO: New');
  }

  function onLoad() {
    console.log('TODO: Load');
  }

  return (
    <div>
      <div className="MainMenu">
        <div className="StarterOptions">
          <button type="button" onClick={() => onNew()}>
            New
          </button>
          <button type="button" onClick={() => onLoad()}>
            Load
          </button>
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
}

function TableView() {
  return <h2>TableView</h2>;
}

function MapView() {
  return <h2>MapView</h2>;
}

export default function App() {
  return (
    <div>
      <Router>
        <Nav name="Get Started" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MapView" element={<MapView />} />
          <Route path="/TableView" element={<TableView />} />
        </Routes>
      </Router>
    </div>
  );
}
