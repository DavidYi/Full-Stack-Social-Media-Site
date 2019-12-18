import React from 'react';

import Header from '../Shared/Header';
import HeaderRight from '../Shared/HeaderRight';
import NewPost from './NewPost';
import Profile from './Profile';
import Article from './Article';
import Friends from './Friends';
import Search from './Search';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Cookies from 'universal-cookie';

import 'bootstrap/dist/css/bootstrap.min.css';
import './main.scss';

class Main extends React.Component {
	constructor(props) {
		super(props);

		this.addNewPost = this.addNewPost.bind(this);
		this.editPost = this.editPost.bind(this);
		this.filterPosts = this.filterPosts.bind(this);
		this.renderFriends = this.renderFriends.bind(this);
		this.addFriend = this.addFriend.bind(this);
		this.deleteFriend = this.deleteFriend.bind(this);
		this.renderPosts = this.renderPosts.bind(this);
		this.renderFriend = this.renderFriend.bind(this);
		this.renderPostInfo = this.renderPostInfo.bind(this);

		this.cookies = new Cookies();
		this.props = props;

		this.state = {
			posts: [],
			postsInfo: [...this.props.postsInfo],
			friendsInfo: this.props.friends,
			friends: [],
			ready: false,
			id: 0,
		};
	}
	addNewPost(fd, hasPic) {
		let postsCopy = [...this.state.posts];
		let postsInfoCopy = [...this.state.postsInfo];


		this.setState({loading: true});

		const modifier = hasPic ? "P" : "";

		let option;

		if (hasPic) {
			option = {
				method: 'POST',
				credentials: 'include',
				body: fd
			};
		} else {
			option = {
				method: 'POST',
				headers: {
					'Content-Type' : 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({ text: fd})
			};
		}

		fetch("https://yo-backend-final.herokuapp.com/article" + modifier, option).then(res => {
				if (!res.ok)
					throw new Error(res.error);
				return res.json();
		}).then(json => {
			postsInfoCopy.unshift(json.articles);
			postsCopy.unshift(<Article key={"article" + json.articles._id} 
				post={json.articles} editPost={this.editPost} username={this.props.username}/>);

			this.setState({postsInfo: postsInfoCopy, posts: postsCopy});
		});
	}


	editPost(text, id, commentId) {
		let postsCopy = [...this.state.posts];
		let postsInfoCopy = [...this.state.postsInfo];


		fetch("https://yo-backend-final.herokuapp.com/articles/" + id, {
			method: 'PUT',
			headers: {
				'Content-Type' : 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({text: text, commentId: commentId ? commentId : undefined})
		}).then(res => {
				if (!res.ok)
					throw new Error(res.error);
				return res.json();
		}).then(json => {
			const article = json.articles;

			postsInfoCopy = postsInfoCopy.map((post, index) => {
				if (post._id === article._id){
					postsCopy[index] = <Article key={"article" + article._id} 
						post={article} editPost={this.editPost} username={this.props.username} />;
					return article;
				}
				return post;
			});

			this.setState({postsInfo: postsInfoCopy, posts: postsCopy});
		});
	}


	renderPosts(postInfo) {
		let posts = [];
		postInfo.forEach( function(post) {
			posts.push(<Article key={"article" + post._id}
				post={post}
				editPost={this.editPost} 
				username={this.props.username}
				/>);
		}, this);
		this.setState({posts: posts});
	}

	renderPostInfo() {
		fetch("https://yo-backend-final.herokuapp.com/articles/", {
			method: 'GET',
			headers: {
				'Content-Type' : 'application/json'
			},
			credentials: 'include'
		}).then(res => {
			if (!res.ok)
				throw new Error(res.status);
			return res.json();
		}).then(json => {
			this.setState({postsInfo: json.articles});
			this.renderPosts(this.state.postsInfo);		
		}).catch(err => err);
	}

	renderFriend(user) {
		return (
			Object.assign({}, <Jumbotron key={"friend" + user._id}>
				<Button variant="danger" name="deleteFriend" onClick={() => {
					this.deleteFriend(user.username);
				}}>Delete Friend</Button>
				<img src={user.avatar} width="200px" height="260px" crop="fill" alt="not loading"/>
				<h5>{user.username}</h5>
				<p>{user.status}</p>
			</Jumbotron>)
		);

	}

	renderFriends() {
		this.setState({friends: []});
		this.state.friendsInfo.forEach( function(username, index) {
			fetch("https://yo-backend-final.herokuapp.com/profile/" + username, {
			method: 'GET',
			headers: {
				'Content-Type' : 'application/json'
			},
			credentials: 'include'
			}).then(res => res.json())
			.then(user => {
				let friendsCopy = [...this.state.friends];
				friendsCopy.push(this.renderFriend(user));
				this.setState({friends: friendsCopy});
			});
		}, this);
	}

	addFriend(username) {
		return fetch("https://yo-backend-final.herokuapp.com/following/" + username, {
			method: 'PUT',
			headers: {
				'Content-Type' : 'application/json'
			},
			credentials: 'include'
		}).then(res => {
				return res.json();
			}).then(json => {
				if (json.error){
					throw new Error(json.status);
				}
				this.setState({friendsInfo: json.following});
				this.renderFriends();
				this.renderPostInfo();
				return "success";
			}).catch(err => {
				console.log(err);
				return -1;
			});
	}

	async deleteFriend(username) {
		fetch("https://yo-backend-final.herokuapp.com/following/" + username, {
			method: 'DELETE',
			headers: {
				'Content-Type' : 'application/json'
			},
			credentials: 'include'
		}).then(res => {
				if (!res.ok)
					throw new Error(res.error);
				return res.json();
		}).then(json => {
			this.setState({friendsInfo: json.following})
			this.renderFriends();
			this.renderPostInfo();		
		});
	}

	filterPosts(search){
		let param = search.toLowerCase();
		let filteredPosts = [...this.state.postsInfo.filter(
			post => post.body.toLowerCase().includes(param) 
			|| post.author.toLowerCase().includes(param)
			)];
		this.renderPosts(filteredPosts);
	}

	componentDidMount(){
		this.renderFriends();
		this.renderPosts(this.props.postsInfo);
	}

	render() {
		return (
			<div className="main">
				<Header className="header" component={<HeaderRight username={this.props.username}/>}/>
				<Row className="containMain">
				<Col lg={3} md={5} className="leftSide">
					<Profile />
				</Col>
				<Col lg={4} md={8}>
					<Row>
						<NewPost username={this.props.username} addNewPost={this.addNewPost}/>
					</Row>

					<Row>
						<Search filterPosts={this.filterPosts}/>
					</Row>

					<Row>
						<div className="articlesContainer">
							{this.state.posts}
						</div>
					</Row>
				</Col>
				<Col lg={4}>
					<Friends friendsInfo={this.state.friendsInfo} friends={this.state.friends}
					 addFriend={this.addFriend} renderFriends={this.renderFriends}/>
				</Col>
				</Row>
			</div>
		);
	}
}

export default Main;
