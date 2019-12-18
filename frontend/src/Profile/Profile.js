import React from 'react';
import Header from '../Shared/Header';
import HeaderRight from '../Shared/HeaderRight';
import Current from './Current';
import Edit from './Edit';

import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

import 'bootstrap/dist/css/bootstrap.min.css';

function Profile(props) {
	return (
		<div>
			<Header component={<HeaderRight user={props.user}/>}/>
			<Container>
			<Row>
			<Col lg>
				<Current user={props.user} friends={props.friends} posts={props.posts}/>
			</Col>
			<Col lg>
				<Edit user={props.user} getProfile={props.getProfile}/>
			</Col>
			</Row>
			</Container>
		</div>
	);
}

export default Profile;
