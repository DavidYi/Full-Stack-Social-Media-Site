import React from 'react';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import {Formik} from 'formik';
import * as yup from 'yup';

import './main.scss';

const schema = yup.object().shape({
	picture: yup.mixed(),
	body: yup.string().required(),
});

const defaultValues = {
	picture: "",
	body: ""
}


function NewPost(props) {
	
	const handleSubmit = async (values, actions) => {
		if (values.picture !== "") {
			const fd = new FormData();
			fd.append('image', values.picture);
			fd.append('text', values.body);

			props.addNewPost(fd, true);
		} else props.addNewPost(values.body, false);
		actions.setSubmitting(false);
		actions.resetForm(defaultValues);
	};

	return (
		<div className="newPost">
		<Jumbotron>
		<Formik 
			validationSchema={schema}
			onSubmit={handleSubmit}
			initialValues={defaultValues}
		>
		{({
			handleSubmit,
			handleChange,
			handleBlur,
			handleReset,
			values,
			touched,
			isValid,
			isSubmitting,
			errors,
			setFieldValue,
			resetForm
		}) => (
			<Form onSubmit={handleSubmit}>
				<Form.Group as={Row} controlId="body">
					<FormControl 
						as="textarea"
						name="body"
						onChange={handleChange}
						value={values.body}
						isInvalid={!!errors.body} 
					/>
				</Form.Group>
				<Form.Group as={Row} controlId="picture">
					<InputGroup className="picture">
						<FormControl
							type="file"
							name="picture"
							value={values.image}
							onChange={(e) => {
								setFieldValue("picture", e.currentTarget.files[0]);
							}}
						/>
					</InputGroup>
				</Form.Group>
				<Button variant="outline-danger" type="reset" onClick={handleReset} >Cancel</Button>
				<Button variant="outline-primary" type="submit" disabled={isSubmitting}>Post</Button>
			</Form>
		)}
		</Formik>
		</Jumbotron>
		</div>
	);
}


export default NewPost;