import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './Views/Start';
import TableView from './Views/TableView';
import './App.scss';
import AppTableContext from './AppFileContext';

function MapView() {
  return <h2>MapView</h2>;
}

export default function App() {
  return (
    <div>
      <Router>
        <AppTableContext.Provider value={[]}>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/MapView" element={<MapView />} />
            <Route path="/TableView" element={<TableView />} />
          </Routes>
        </AppTableContext.Provider>
      </Router>
    </div>
  );
}
