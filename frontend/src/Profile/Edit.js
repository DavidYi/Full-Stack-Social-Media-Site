import React from 'react';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';

import {Formik} from 'formik';
import * as yup from 'yup';


const schema = yup.object().shape({
	email: yup.string().email('Invalid email'),
	zip: yup.string().matches(/^([0-9]{5}(-[0-9]{4})?)?$/, "Invalid Zip Code"),
	password: yup.string(),
});


const defaultValue = {
	email: "",
	zip: "",
	password: ""
};


function Edit(props) {

	const handleSubmit = async (values, actions) => {

		if (values.email)
			fetch("https://yo-backend-final.herokuapp.com/email", {
				method: 'PUT',
				headers: {
					'Content-Type' : 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({ email: values.email})
			})
			.then(res => res.json())
			.then(json => {
				props.getProfile();
			});

		if (values.zip)
			fetch("https://yo-backend-final.herokuapp.com/zipcode", {
				method: 'PUT',
				headers: {
					'Content-Type' : 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({ zipcode: values.zip})
			})
			.then(res => res.json())
			.then(json => {
				props.getProfile();
			});

		if (values.password)
			fetch("https://yo-backend-final.herokuapp.com/password", {
				method: 'PUT',
				headers: {
					'Content-Type' : 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({ password: values.password})
			});
		actions.setSubmitting(false);
		actions.resetForm(defaultValue);
	};

	return (
		<div className="profile">

		<Jumbotron className="containers">
		<h1>Update Info</h1>
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
			<Form noValidate onSubmit={handleSubmit}>

	      		<Form.Group controlId="registerEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="email" 
						name="email"
						onChange={handleChange}
						isInvalid={!!errors.email}
						value={values.email}
						placeholder="Enter email"
					 />
					 <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
					 <Form.Control.Feedback type="invalid">
					 	{errors.email}
					 </Form.Control.Feedback>
		      	</Form.Group>

	      		<Form.Group controlId="registerZip">
		      		<Form.Label>Zip Code</Form.Label>
		      		<Form.Control
		      		type="text" 
		      		name="zip"
					onChange={handleChange}
					isInvalid={!!errors.zip}
					value={values.zip}
		      		placeholder="Enter Zipcode" />
		      		<Form.Control.Feedback type="invalid">
		      			{errors.zip}
		      		</Form.Control.Feedback>
	      		</Form.Group>

	      		<Form.Group controlId="registerPass">
		      		<Form.Label>Password</Form.Label>
		      		<Form.Control
		      		type="password"
		      		name="password"
					onChange={handleChange}
					isInvalid={!!errors.password}
					value={values.password}
		      		placeholder="Password" />
		      		<Form.Control.Feedback type="invalid">
		      			{errors.password}
		      		</Form.Control.Feedback>
	      		</Form.Group>

	      		<Button variant="primary" type="submit" disabled={isSubmitting}>
	      			Update Info
      			</Button>

	      	</Form>
		)}
		</Formik>
		</Jumbotron>
		</div>
	);
}


export default Edit;