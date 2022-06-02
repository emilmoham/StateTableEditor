import { createContext } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './Views/Start';
import './App.scss';
import AppTable from './Models/AppTable';

type FileContextType = AppTable | null;

const FileContext = createContext(null as FileContextType);

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
        <FileContext.Provider value={null}>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/MapView" element={<MapView />} />
            <Route path="/TableView" element={<TableView />} />
          </Routes>
        </FileContext.Provider>
      </Router>
    </div>
  );
}
