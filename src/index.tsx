import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './store';
import './index.css';
import MyLApp from './MyLApp';

ReactDOM.render(
	<Provider store={ store } >
		<MyLApp />
	</Provider>

    ,
  document.getElementById('root')
);