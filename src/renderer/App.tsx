import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './Start';
import './App.scss';

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
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/MapView" element={<MapView />} />
          <Route path="/TableView" element={<TableView />} />
        </Routes>
      </Router>
    </div>
  );
}
