import React from 'react';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

import {Formik} from 'formik';
import * as yup from 'yup';

import './main.scss';

class Friends extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.findFriend = this.findFriend.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			showError: false,
			errormsg: '',
		}
		this.defaultValues = {
			user: ''
		};
		this.schema = yup.object().shape({
			user: yup.string().required(),
		});
	}

	findFriend(name) {
		if (this.props.addFriend(name) === -1) {
			this.setState({showError: true, errormsg: 'No user with that name.'});
		}
	}

	async handleSubmit(values, actions){
		if (this.state.showError){
			this.setState({showError: false});
		}

		this.findFriend(values.user);

		actions.resetForm(this.defaultValues);
		actions.setSubmitting(false);
	}

	render() {
		return (
			<div className="friends">
				<Jumbotron className="containers">

				{this.props.friends}
				<Formik 
					validationSchema={this.schema}
					onSubmit={this.handleSubmit}
					initialValues={this.defaultValues}
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
								name="user"
								onChange={handleChange}
								isInvalid={!!errors.user}
								value={values.user}
								placeholder="Display Name"
							/>
						<Button variant="outline-primary" id="addFriendButton" type="submit" disabled={isSubmitting}>Add Friend</Button>
					</Form>
				)}
				</Formik>
				{this.state.showError && 
					<Alert variant="danger" onClose={() => this.setState({showError: false})} dismissible>
				        <p>
				          {this.state.errormsg}
				        </p>
			        </Alert>
				}
				</Jumbotron>
			</div>
		);
	}
}



export default Friends;