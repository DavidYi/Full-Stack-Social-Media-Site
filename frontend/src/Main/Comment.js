import React, {useState} from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import moment from 'moment';
import EditIcon from '@material-ui/icons/Edit';

import {Formik} from 'formik';
import * as yup from 'yup';


import './main.scss';


function Comment(props) {
	const [editBody, toggleEditBody] = useState(false);


	const schema = yup.object().shape({
		body: yup.string().required(),
	});

	const defaultValues = {
		body: props.comment.body
	}

	const toggleEdit = () => toggleEditBody(!editBody);

	const handleSubmit = async (values, actions) => {
		props.editPost(values.body, props.post._id, props.comment._id);
		toggleEdit();
	};

	return (
		<div className="comment">
		<div className="sameLine">
			<p className="floatLeft">
			<Badge pill variant="secondary" className="name-badge">
				{props.comment.author}
			</Badge>
			{!editBody && props.comment.body}
			</p>

			{editBody && props.comment.author === props.username && 
				<div className="sameLine floatRight">
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
							type="text"
							name="body"
							onChange={handleChange}
							value={values.body}
							isInvalid={!!errors.body} 
						/>

						<Button variant="outline-primary" type="submit" disabled={isSubmitting}>Edit</Button>
						<Button variant="outline-danger" type="reset" onClick={() => {
							handleReset();
							toggleEdit();
						}}>Cancel</Button>
						</Form>
					)}
					</Formik>
				</div>
			}

			{!editBody && props.comment.author === props.username && 
				<Button className="floatRight btn-sm" variant="outline-dark" onClick={toggleEdit}>
					<EditIcon fontSize="small"/>
				</Button>
				// <Dropdown className="floatRight">
				// 	<Dropdown.Toggle className="btn-sm" variant="outline-dark" id="dropdown-basic">
				// 		<MenuOutlinedIcon fontSize="small"/>
				// 	</Dropdown.Toggle>

				// 	<Dropdown.Menu>
				// 	<Dropdown.Item as="button" onClick={()=> console.log("hello")}>Delete</Dropdown.Item>
				// 	<Dropdown.Item as="button">Edit</Dropdown.Item>
				// 	</Dropdown.Menu>
		  
				// </Dropdown>
			}

		</div>

		<p className="text-muted mute-date">{moment(props.comment.date).format('LLL')}</p>
		</div>
	);
}


export default Comment;