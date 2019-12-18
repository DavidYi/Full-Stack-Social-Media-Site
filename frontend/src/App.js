import React from 'react';
import './App.scss';
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import Landing from './Landing/Landing';
import MainWrapper from './Main/MainWrapper';
import ProfileWrapper from './Profile/ProfileWrapper';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
  	<div>

	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={Landing}/>
			<Route path="/main" component={MainWrapper}/> 
			<Route path="/profile" component={ProfileWrapper}/> 
		</Switch>

	</BrowserRouter>
	</div>
  );
}

export default App;
