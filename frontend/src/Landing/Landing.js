import React from 'react';
import Register from './Register';
import './landing.scss';
import LogIn from './LogIn';
import Header from '../Shared/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function Landing() {
  return (
  	<div>

  		<Header component={<LogIn />}/>
    <div className="bg-landing">
    	<Register />
    </div>
    </div>
  );
}

export default Landing;
