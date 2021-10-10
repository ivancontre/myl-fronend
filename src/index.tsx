import React from 'react';
import ReactDOM from 'react-dom';
import { SocketProvider } from './context/SocketContext';
import './index.css';
import Match from './pages/Match';

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <Match />
    </SocketProvider> 
    
  </React.StrictMode>,
  document.getElementById('root')
);