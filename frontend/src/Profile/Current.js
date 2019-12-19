import React from 'react';
import {Redirect} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';


import {Formik} from 'formik';
import * as yup from 'yup';

import './profile.scss';

class Current extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			navigate: false,
			image_url: props.user.avatar,
		};

		this.defaultValue = {
			avatar: null
		};

		this.schema = yup.object().shape({
			avatar: yup.mixed().required(),
		});
	}

	async handleSubmit (values, actions) {
	    const fd = new FormData();

		fd.append('image', values.avatar);

		this.setState({loading: true});

		fetch("https://yo-backend-final.herokuapp.com/avatar", {
			method: 'PUT',
			credentials: 'include',
	    	body: fd
	    })
	    .then(res => res.json())
	    .then(json => {
	    	this.setState({image_url: json.avatar, loading: false});
			actions.setSubmitting(false);
	    });
	}

	render() {
		return (
			<div className="profile">

			<Jumbotron className="containers">
			{this.state.navigate && <Redirect to={{
				pathname: '/main'
			}}/>

			}
			<Button variant="outline-info" onClick={() => this.setState({navigate: true})}>Main Page</Button>
			<br/>
			{!this.state.loading && <img src={this.state.image_url} width="300px" height="390px" crop="fill" alt="loading" />}
			{this.state.loading && 'uploading...\n please wait a bit'}
			<Formik 
				validationSchema={this.schema}
				onSubmit={this.handleSubmit}
				initialValues={this.defaultValue}
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
				resetForm,
				setFieldValue
			}) => (
				<Form onSubmit={handleSubmit} noValidate>

					<div className="form-group">
						<input id="avatar" name="avatar" type="file" 
							onChange={(e) => {
								setFieldValue("avatar", e.currentTarget.files[0]);
							}} className="form-control" />
					</div>



		      		<Button variant="primary" type="submit" disabled={isSubmitting}>
		      			Upload Avatar
	      			</Button>

		      	</Form>
			)}
			</Formik>

			<h1>Current Info</h1>

			<p id="nameC">{this.props.user.username}</p>
			<p id="emailC">{this.props.user.email}</p>
			<p id="zipC">{this.props.user.zipcode}</p>
			<p id="headlineC">{new Date(parseInt(this.props.user.dob)).toString()}</p>
			
		</Jumbotron>
		</div>
		);
	}

}

export default Current;