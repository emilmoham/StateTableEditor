import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import '../node_modules/normalize.css'

class App extends Component {
  render() {
    return(
      <React.Fragment>
        <h1>Test</h1>
      </React.Fragment>
    );
  }
}

const container = document.getElementById('app');
const root = createRoot(container);

root.render(<App />);