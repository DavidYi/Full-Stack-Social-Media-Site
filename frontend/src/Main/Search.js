import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import {Formik} from 'formik';
import * as yup from 'yup';

import './main.scss';


class Search extends React.Component {
	constructor(props){
		super(props);
		this.props = props;
		this.defaultValues = {
			search: "",
		}
		this.schema = yup.object().shape({
			search: yup.string(),
		});
	}

	render() {
		const handleSubmit = async (values, actions) => {
			this.props.filterPosts(values.search);
		};

		return (
			<div className="search">
			<Formik
				validationSchema={this.schema}
				onSubmit={handleSubmit}
				initialValues={this.defaultValues}
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
					<InputGroup>
						<FormControl
							type="text"
							name="search"
							value={values.search}
							onChange={handleChange}
							placeholder="Search Here"
						/>
						<Button type="submit" id="searchSubmit" variant="outline-primary">Search</Button>
					</InputGroup>
				</Form>
			)}
			</Formik>
			</div>
		);
	}
}

export default Search;