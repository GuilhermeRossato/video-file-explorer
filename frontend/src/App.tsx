import React from 'react';
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header handleMenuClose={() => {}} title="hello"></Header>
    </div>
  );
}

export default App;
