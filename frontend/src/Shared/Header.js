import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import './shared.scss'

function Header(props) {
	return (
		<Navbar bg="dark" variant="dark">

	  	<Navbar.Brand>Yo</Navbar.Brand>
		<Navbar.Toggle />
		<Navbar.Collapse className="justify-content-end">
		{props.component}
		</Navbar.Collapse>
	</Navbar>
);
}


export default Header;
