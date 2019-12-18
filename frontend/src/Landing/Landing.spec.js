import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';

import Landing from './Landing';
import App from '../App';
import LogIn from './LogIn';
import Register from './Register';

import {Redirect} from "react-router-dom";
import Alert from 'react-bootstrap/Alert';

describe('Landing', () => {
	const container = mount(<App />)
	test('snapshot renders', () => {
		const component = renderer.create(<Landing />);
	    let tree = component.toJSON();
	    expect(tree).toMatchSnapshot();
	});

	it('should have 2 email fields', () => {
    	expect(container.find('input[type="email"]').length).toEqual(2);
  	});

  	it('should have 3 password fields', () => {
    	expect(container.find('input[type="password"]').length).toEqual(3);
  	});

  	it('should have 2 forms', () => {
    	expect(container.find('form').length).toEqual(2);
  	});

});


describe('Register', () => {
	const container = mount(shallow(<Register />).get(0));

	it('renders the inner LogIn Component', () => {
		const wrapper = mount(<App />);
		expect(wrapper.find(Register).length).toEqual(1);
	});

	it('should have email field', () => {
    	expect(container.find('input[type="email"]').length).toEqual(1);
  	});

  	it('should have display name field', () => {
    	expect(container.find('input[name="name"]').length).toEqual(1);
  	});

  	it('should have zipcode field', () => {
    	expect(container.find('input[name="zip"]').length).toEqual(1);
  	});

  	it('should have phone field', () => {
    	expect(container.find('input[name="phone"]').length).toEqual(1);
  	});


  	it('should have 2 password fields (password and passcmf)', () => {
    	expect(container.find('input[type="password"]').length).toEqual(2);
    	expect(container.find('input[name="password"]').length).toEqual(1);
    	expect(container.find('input[name="passCmf"]').length).toEqual(1);
  	});

  	it('should have 1 submit button', () => {
    	expect(container.find('button').length).toEqual(1);
  	});



	it("renders alert that registration is successful when registration is all right otherwise nothing", () => {
		const wrapper  = mount(shallow(<LogIn />).get(0));

		const email = wrapper.find('input').at(0);
		const name = wrapper.find('input').at(1);
		const phone = wrapper.find('input').at(2);
		const zip = wrapper.find('input').at(3);
		const password = wrapper.find('input[name="password"]');
		const passCmf = wrapper.find('input[name="passCmf"]');
		const submit = wrapper.find('button');
		email.instance().value = 'davidcyyi@rice.edu';
		password.instance().value = '1';
		passCmf.value = '12';

		submit.simulate('click');

		setTimeout(() => {
		expect(wrapper.find(Alert).length).toEqual(0);}, 1000);


		name.instance().value = 'hey';
		phone.value = "222-111-1111";
		zip.value = "12345";

		setTimeout(() => {
		expect(wrapper.find(Alert).length).toEqual(0);}, 1000);

		passCmf.value = '1';


		setTimeout(() => {expect(wrapper.find(Redirect).length).toEqual(0);
		expect(wrapper.find(Alert).length).toEqual(1);}, 1000);



	});

	it("should alert if wrong credentials", () => {
		const wrapper  = mount(shallow(<LogIn />).get(0));

		const email = wrapper.find('input').at(0);
		const password = wrapper.find('input').at(1);
		const submit = wrapper.find('button');
		email.instance().value = 'Sincere@april.biz';
		password.instance().value = 'Kulas Light1';

		submit.simulate('click');


		setTimeout(() => {expect(wrapper.find(Alert)).toBeTruthy();
		expect(wrapper.find(Alert).length).toEqual(1);}, 1000);
	});

});

describe('LogIn', () => {
	const container = mount(<LogIn />);

	it('renders the inner LogIn Component', () => {
		const wrapper = mount(<App />);
		expect(wrapper.find(LogIn).length).toEqual(1);
	});

	it('should have email field', () => {
    	expect(container.find('input[type="email"]').length).toEqual(1);
  	});

  	it('should have password field', () => {
    	expect(container.find('input[type="password"]').length).toEqual(1);
  	});

  	it('should have 1 submit button', () => {
    	expect(container.find('button').length).toEqual(1);
  	});


  	it('should have be set to false', () => {
    	expect(container.state('isAuth')).toEqual(false);
    	expect(container.state('showAlert')).toEqual(false);
    	expect(container.state('userInfo')).toEqual({});
  	});


	it("renders Redirect when user autheticated", () => {
		const wrapper  = mount(<LogIn />);

		const email = wrapper.find('input').at(0);
		const password = wrapper.find('input').at(1);
		const submit = wrapper.find('button');
		email.instance().value = 'Sincere@april.biz';
		password.instance().value = 'Kulas Light';

		submit.simulate('click');


		setTimeout(() => {
			expect(wrapper.find(Redirect)).toBeTruthy();
			expect(wrapper.find(Redirect).length).toEqual(1);
			expect(wrapper.state.isAuth).toEqual(true);
		}, 1000);
	});

	it("should alert if wrong credentials", () => {
		const wrapper  = mount(<LogIn/>);

		const email = wrapper.find('input').at(0);
		const password = wrapper.find('input').at(1);
		const submit = wrapper.find('button');
		email.instance().value = 'Sincere@april.biz';
		password.instance().value = 'Kulas Light1';

		submit.simulate('click');

		expect(wrapper.state('isAuth')).toEqual(false);
		setTimeout(() => {
			expect(wrapper.find(Alert)).toBeTruthy();
			expect(wrapper.find(Alert).length).toEqual(1);
			expect(wrapper.state.showAlert).toEqual(true);
		}, 1000);
	});

});