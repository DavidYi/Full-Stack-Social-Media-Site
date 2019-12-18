import React, {useState} from 'react';

import Alert from 'react-bootstrap/Alert';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Formik, useField, useFormikContext} from 'formik';
import * as yup from 'yup';
import './landing.scss';

const defaultValues = {
	email: "",
	name: "",
	zip: "",
	phone: "",
	password: "",
	passCmf: "",
	dob: "",
}

const schema = yup.object().shape({
	email: yup.string().email('Invalid email').required('Email is required'),
	name: yup.string().required('Display Name is required'),
	zip: yup.string().matches(/^[0-9]{5}(-[0-9]{4})?$/, "Invalid Zip Code").required('Zip Code is required'),
	//phone: yup.string().matches(/^(\+?1)?\(?[0-9]{3}\)?-?[0-9]{3}-?[0-9]{4}$/, 'Invalid phone nunber').required(),
	password: yup.string().required('Password is required'),
	passCmf: yup.string().test('passwords-match', "Passwords don't match!", function(value){
			return this.parent.password === value;
		}).required(''),
	dob: yup.string().required('Date of Birth is required.')
});

const DatePickerField = ({ ...props }) => {
	const { setFieldValue } = useFormikContext();
	const [field] = useField(props);

    return (
		<DatePicker
			{...field}
			{...props}
			dateFormat="MM/dd/yyyy"
			className="form-control"
			selected={(field.value && new Date(field.value)) || null}
			onChange={val => {
				setFieldValue(field.name, val);
			}}
		/>
  );
};

function Register() {
	const [isAuth, setAuth] = useState(false);

	const handleSubmit = async (values, actions) => {
		let formValues = await Object.assign({}, values);
		
		var newUser = {
			username: formValues.name,
			email: formValues.email,
			zipcode: formValues.zip,
			dob: formValues.dob.getTime(),
			password: formValues.password
		}

		await fetch("https://yo-backend-final.herokuapp.com/register", {
			method: 'POST',
			headers: {
				'Content-Type' : 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(newUser)
		}).then(res => res.json())
		.then(json => {
			if (json.result === "success"){
				actions.setSubmitting(false);
				setAuth(true);
			}
		});
		actions.setSubmitting(false);
	};


	return (
		<Jumbotron className="less">

		{isAuth &&
			<Alert variant="success" onClose={() => setAuth(false)} dismissible>
		        <p>
		          Registration Complete
		        </p>
	        </Alert>}
		<h1>Register</h1>
		<Formik 
			validationSchema={schema}
			onSubmit={handleSubmit}
			initialValues={defaultValues}
		>
		{({
			handleSubmit,
			handleChange,
			handleBlur,
			setFieldValue,
			values,
			touched,
			isSubmitting,
			isValid,
			errors,
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

	      		<Form.Group controlId="registerName">
		      		<Form.Label>Username</Form.Label>
		      		<Form.Control  
			      		type="text" 
						name="name"
						onChange={handleChange}
						isInvalid={!!errors.name}
						value={values.name}
			      		placeholder="Enter display Name" />
		      		<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
		      		<Form.Control.Feedback type="invalid">
					 	{errors.name}
					 </Form.Control.Feedback>
	      		</Form.Group>

	      		<Form.Group controlId="registerDob">
		      		<Form.Label>Date of Birth</Form.Label>
	      			<DatePickerField
                        name="dob"
                        value={values.dob}
						isInvalid={!!errors.dob}
                        onChange={setFieldValue}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
		      		<Form.Control.Feedback type="invalid">
					 	{errors.dob}
					 </Form.Control.Feedback>
	      		</Form.Group>

	      		{/*<Form.Group controlId="registerPhone">
		      		<Form.Label>Phone Number</Form.Label>
		      		<Form.Control 
		      		type="text"  
					name="phone"
					onChange={handleChange}
					isInvalid={!!errors.phone}
					value={values.phone}
		      		placeholder="111-111-1111" />
		      		<Form.Control.Feedback type="invalid">
		      			{errors.phone}
		      		</Form.Control.Feedback>
	      		</Form.Group>*/}

	      		<Form.Group controlId="registerZip">
		      		<Form.Label>Zip Code</Form.Label>
		      		<Form.Control
		      		type="text" 
		      		name="zip"
					onChange={handleChange}
					isInvalid={!!errors.zip}
					value={values.zip}
		      		placeholder="Zip" />
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

	      		<Form.Group controlId="registerPassCmf">
		      		<Form.Label>Confirm Password</Form.Label>
		      		<Form.Control
		      		type="password"
		      		name="passCmf"
					onChange={handleChange}
					isInvalid={!!errors.passCmf}
					value={values.passCmf}	
		      		placeholder="Confirm Password" />
		      		<Form.Control.Feedback type="invalid">
		      			{errors.passCmf}
		      		</Form.Control.Feedback>
	      		</Form.Group>

	      		<Button variant="primary" type="submit" disabled={isSubmitting}>
	      			Register
      			</Button>

	      	</Form>
	      	)}
		</Formik>
		</Jumbotron>
		);
}

export default Register;