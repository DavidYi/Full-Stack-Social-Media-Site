import React from 'react';
import {Redirect} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';

import {Formik} from 'formik';
import * as yup from 'yup';

import './main.scss';

const schema = yup.object().shape({
	status: yup.string().required(),
});

const defaultValue = {
	status: '',
};

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			profilePressed: false,
			status: "",
			name: "",
			avatar: "",
			logOut: false,
			error: false
		};

		this.logout = this.logout.bind(this);

	}

	componentDidMount() {
		fetch("https://yo-backend-final.herokuapp.com/headline", {
				method: 'GET',
				headers: {
					'Content-Type' : 'application/json'
				},
				credentials: 'include'
			}).then(res => {
				if (!res.ok)
					throw new Error(res.error);
				return res.json();
			})
			.catch(err => this.setState({error: err}))
			.then(json => {
				this.setState({name: json.username, status: json.status})
			});

		fetch("https://yo-backend-final.herokuapp.com/avatar", {
				method: 'GET',
				headers: {
					'Content-Type' : 'application/json'
				},
				credentials: 'include'
			}).then(res => {
				if (!res.ok)
					throw new Error(res.error);
				return res.json();
			})
			.catch(err => this.setState({error: err}))
			.then(json => {
				this.setState({avatar: json.avatar})});
	}

	logout() {
		fetch("https://yo-backend-final.herokuapp.com/logout", {
				headers: {
					'Content-Type' : 'application/json'
				},
				method: 'PUT',
				credentials: 'include',
			}).then(res => this.setState({logOut: true}));
	}

	render() {
		const handleSubmit = async (values, actions) => {
			fetch("https://yo-backend-final.herokuapp.com/headline", {
				method: 'PUT',
				headers: {
					'Content-Type' : 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({ headline: values.status})
			})
			.then(res => res.json())
			.then(json => this.setState({status: json.status}));
			actions.setSubmitting(false);
			actions.resetForm();
		};

		if (this.state.error) return(<h1>{this.state.error.error}</h1>);
		return (
		<div className="profile">

		<Jumbotron className="containers">
		<Button variant="outline-danger" onClick={()=> this.logout()}>Log Out</Button>
		<Button variant="outline-info" onClick={()=>this.setState({profilePressed: true})}>Profile</Button>

		<img src={this.state.avatar} width="200px" height="260px" crop="fill" alt="loading" />
		<h1>{this.state.name}</h1>
		<p>{this.state.status}</p>
		<Formik 
			validationSchema={schema}
			onSubmit={handleSubmit}
			initialValues={defaultValue}
		>
		{({
			handleSubmit,
			handleChange,
			handleBlur,
			values,
			touched,
			isValid,
			isSubmitting,
			errors,
			resetForm
		}) => (
			<Form onSubmit={handleSubmit}>
				<FormControl 
						type="text"
						name="status"
						value={values.status}
						onChange={handleChange}
						isInvalid={!!errors.status} 
					/>
				<Button variant="outline-primary" type="submit" disabled={isSubmitting}>Update</Button>
			</Form>
		)}
		</Formik>
		</Jumbotron>
			{this.state.logOut && 
				<div>
				<Redirect to={{
		              pathname: "/"
		            }}/>
	            </div>
			}
			{this.state.profilePressed && 
				<div>
				<Redirect to={{
		              pathname: "/profile",
		              state: {
		              }
		            }}/>
	            </div>
			}
		</div>
		);
	}
}

export default Profile;