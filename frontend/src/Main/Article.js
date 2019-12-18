import React, {useState} from 'react';
import Comment from './Comment';

import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

import './main.scss';

import {Formik} from 'formik';
import * as yup from 'yup';
import moment from 'moment';



function Article(props) {
	const [showResults, toggleResults] = useState(false);
	const [editBody, toggleEditBody] = useState(false);


	const schema = yup.object().shape({
		body: yup.string().required(),
	});

	const defaultValues = {
		body: props.post.body
	}

	const schemaComment = yup.object().shape({
		body: yup.string().required(),
	});

	const defaultValuesComment = {
		body: ""
	}



	const toggleComments = () => toggleResults(!showResults);

	const toggleEdit = () => toggleEditBody(!editBody);

	const handleSubmit = async (values, actions) => {
		props.editPost(values.body, props.post._id, false);
		toggleEdit();
	};

	const handleSubmitComment = async (values, actions) => {
		props.editPost(values.body, props.post._id, -1);
		actions.resetForm(defaultValues);
	};

	return (
		<div className="article">
		<Jumbotron>
			<h5>{props.post.author}</h5>
			<p className="text-muted">{moment(props.post.date).format('LLL')}</p>

			{!editBody && 
				<div> 
					<div className="">
						<p>{props.post.body}</p>
						{props.post.picture && <img src={props.post.picture} className="picture" alt="can't find"/>}
					</div>

					{props.post.author === props.username && <Button variant="outline-primary" onClick={toggleEdit}>Edit</Button>}
					<Button variant="outline-primary" onClick={toggleComments}>Comment</Button>
				</div>
			}

			{editBody && props.post.author === props.username && 
				<div>
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
						resetForm
					}) => (
						<Form onSubmit={handleSubmit}>

						<FormControl 
							as="textarea"
							name="body"
							onChange={handleChange}
							value={values.body}
							isInvalid={!!errors.body} 
						/>

						<Button variant="outline-primary" type="submit" disabled={isSubmitting}>Save</Button>
						<Button variant="outline-danger" type="reset" onClick={() => {
							handleReset();
							toggleEdit();
						}}>Cancel</Button>
						</Form>
					)}
					</Formik>
				</div>
			}

			{
				showResults &&
			<div id={"article" + props.post._id}>
			<Formik 
				validationSchema={schemaComment}
				onSubmit={handleSubmitComment}
				initialValues={defaultValuesComment}
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
				resetForm
			}) => (
				<Form onSubmit={handleSubmit}>

				<FormControl 
					className="rounded-edges"
					type="text"
					name="body"
					onChange={handleChange}
					value={values.body}
					isInvalid={!!errors.body} 
				/>
				</Form>
			)}
			</Formik>
				{props.post.comments !== undefined && props.post.comments.map((comment,index) => 
					<Comment key={"comment" + comment._id} comment={comment} username={props.username}
						post={props.post} editPost={props.editPost}/>
				)}
			</div>
			}
		</Jumbotron>
		</div>
	);
}


export default Article;