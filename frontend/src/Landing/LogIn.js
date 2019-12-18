import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';

import {Formik} from 'formik';
import * as yup from 'yup';

import Cookies from 'universal-cookie';

import {Redirect} from "react-router-dom";


class LogIn extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			isAuth: false,
			showAlert: false,
			username: "",
		}
		this.cookies = new Cookies();
		this.schema = yup.object().shape({
			username: yup.string().required(),
			password: yup.string().required(),
		});
		this.defaultValues  = {
			username: "",
			password: "",
		};


	}

	componentDidMount() {
		//if already logged in, check and then redirect
		if (!this.state.isAuth){
			fetch("https://yo-backend-final.herokuapp.com/login", {
				headers: {
					Accept: 'application/json',
					'Content-Type' : 'application/json'
				},
				body: JSON.stringify({isLoggedIn: true}),
				credentials: 'include',
				method: 'POST'
			}).then( response => response.json())
			.then(json => {
				if (json.redirect){
					this.setState({isAuth: true, username: json.username});
					return;
				}
			})
		}
	}

	render() {
		const handleSubmit = async (values, actions) => {

			const credentials = {
				username: values.username,
				password: values.password
			}
			
			await fetch("https://yo-backend-final.herokuapp.com/login", {
				headers: {
					Accept: 'application/json',
					'Content-Type' : 'application/json'
				},
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify(credentials)
			}).then( response => response.json())
			.then(json => {
				if (json.result === "success")
					this.setState({isAuth: true, username: json.username})
				else
					this.setState({showAlert: true});
			})
			.catch((err) => {
				this.setState({showAlert: true});
			});
		};

		return (
				<div>
				{this.state.showAlert && 
					<Alert variant="danger" onClose={() => this.setState({showAlert: false})} dismissible>
				        <p>
				          Wrong Credentials
				        </p>
			        </Alert>
				}

				<Formik 
					validationSchema={this.schema}
					onSubmit={handleSubmit}
					initialValues={this.defaultValues}
				>
				{({
					handleSubmit,
					handleChange,
					values,
					isSubmitting,
					errors,
				}) => (
					<Form onSubmit={handleSubmit}>
						<Form.Row>
							<Form.Group as={Col} controlId="logUsername">
								<Form.Control 
								type="username" 
								name="username"
								onChange={handleChange}
								isInvalid={!!errors.username}
								value={values.username}
								placeholder="Enter username" />
							</Form.Group>
							<Form.Group as={Col} controlId="logPass">
								<Form.Control 
								type="password"	
					      		name="password"
								onChange={handleChange}
								isInvalid={!!errors.password} 
								value={values.password}
								placeholder="Password" />
							</Form.Group>
							<Form.Group as={Col} controlId="logIn">
								<Button variant="primary" type="submit" disabled={isSubmitting}>
				      			Log In
			      				</Button>
							</Form.Group>
						</Form.Row>
					</Form>
				)}
				</Formik>
					{this.state.isAuth && 
						<div>
							<Redirect to={{
				              pathname: "/main",
				              state: {
				              	loggedIn: this.state.username,
				              }
				            }}/>
			            </div>
		    		}
				</div>
			);
	}
}

export default LogIn;