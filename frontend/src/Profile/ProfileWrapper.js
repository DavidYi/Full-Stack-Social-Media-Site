import React from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import Profile from './Profile';

import 'bootstrap/dist/css/bootstrap.min.css';

class ProfileWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.location = this.props.location;
		this.state = {
			redirectBack: false,
			user: {},
			ready: false
		}

		this.getProfile = this.getProfile.bind(this);
	}

	getProfile() {
		fetch("https://yo-backend-final.herokuapp.com/profile",{
			method: 'GET',
			headers: {
				'Content-Type' : 'application/json'
			},
			credentials: 'include'})
			.then(res => {
				if (!res.ok){
					throw new Error(res.error);
				}
				return res.json();
			})
			.then(json => {
				this.setState({user: json, ready: true})})
			.catch(error => console.log(error));	
	}

	componentDidMount(){
		fetch("https://yo-backend-final.herokuapp.com/login", {
			headers: {
				Accept: 'application/json',
				'Content-Type' : 'application/json'
			},
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify({isLoggedIn: true})
		}).then( response => response.json())
		.then(json => {
			if (!json.redirect){
				this.setState({redirectBack: true});
				return;
			}
		})

		if (this.state.redirectBack) return;

		this.getProfile();
	}

	render() {
		if (this.state.redirectBack) {
			return (<Redirect to={{
			              pathname: "/",
			            }}/>);
		}
		return (
			<div>
				{this.state.ready &&
					<Profile user={this.state.user} getProfile={this.getProfile}/>
				}
			</div>
		);
	}
}

export default withRouter(ProfileWrapper);
