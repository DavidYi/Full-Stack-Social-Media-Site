import React from 'react';
import Main from './Main';

import {withRouter, Redirect} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export class MainWrapper extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			notAuth: false,
			postsInfo: [],
			ready: false,
			username: "",
			friends: [],
			readyII: false,
			comments: [],//TODO: hardcoded
		}
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
				this.setState({notAuth: true});
				return;
			}
		})

		if (this.state.notAuth) return;

		let postsList = [];
		fetch("https://yo-backend-final.herokuapp.com/articles/", {
			method: 'GET',
			headers: {
				'Content-Type' : 'application/json'
			},
			credentials: 'include'
			})
			.then(response => {
				if (!response.ok)
					throw new Error(response.error);
				return response.json();})
			.then(json => {
				json.articles.forEach((post) => {
					postsList.push(post);
				});
				this.setState({postsInfo: postsList, ready: true});
			})
			.catch(err => {
				console.log(err);
			});

			fetch("https://yo-backend-final.herokuapp.com/following",{
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
				this.setState({username: json.username, friends: json.following, readyII: true})})
			.catch(error => console.log(error));
	}

	render() {
		return (
			<div>
				{this.state.notAuth && <Redirect to={{
				              pathname: "/",
				            }}/>}
				{ this.state.ready && this.state.readyII &&
					<Main username={this.state.username} 
					postsInfo={this.state.postsInfo} friends={this.state.friends}/>
				}
			</div>

		);

	}
}

export default withRouter(MainWrapper);
