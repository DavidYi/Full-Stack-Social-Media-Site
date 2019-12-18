import React, {useState} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import {Redirect} from "react-router-dom";
import './shared.scss'

function HeaderRight(prop) {
	const [navigate, setNavigate] = useState(false);

	const logout = () => {
		fetch("https://yo-backend-final.herokuapp.com/logout", {
				headers: {
					'Content-Type' : 'application/json'
				},
				method: 'PUT',
				credentials: 'include',
			}).then(res => setNavigate(true));
	}

	return (
		<div>
		{navigate &&
			<Redirect to={{
		              pathname: "/"
		            }}/>
		}
		<Navbar.Text>
			Signed in as: {prop.username}
		</Navbar.Text>
		<div className="padding">
		<Navbar.Text>
			<Button variant="danger" onClick={() => logout()}>Log out</Button>
		</Navbar.Text>
		</div>
		</div>
	);

}


export default HeaderRight;