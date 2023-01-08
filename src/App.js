import logo from './logo.svg';
import './App.css';
import React from 'react';
import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers';
import NoodleBowlComponent from './components/NoodleBowlComponent';
import NoodleApp from './components/NoodleApp';

function App() {



  return (
    <div className="App">
        <NoodleApp />
    </div>
  );
}

export default App; 


