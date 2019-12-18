import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';

import Profile from './Profile';
import ProfileWrapper from './ProfileWrapper';
import Current from './Current';
import Edit from './Edit';
import Article from '../Main/Article';

import App from '../App';

import {Redirect} from "react-router-dom";

import { shape } from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';


const routerEmpty = {
  history: new BrowserRouter().history,
  route: {
    location: {
    	state: {
    		form : {},
    		friends: []
    	},
    },
    match: {},
  },
};


const createContext = (router) => ({
  context: { router },
  childContextTypes: { router: shape({}) },
});

export function mountWrap(node, router=routerEmpty) {
  return mount(node, createContext(routerEmpty));
}

export function shallowWrap(node, router=routerEmpty) {
  return shallow(node, createContext(routerEmpty));
}

describe('Profile', () => {

	test('snapshot renders', () => {
		const component = shallowWrap(<ProfileWrapper />);
	    expect(component).toMatchSnapshot();
	});

});

async function getwrapper() {
	let form;
	let postsList = [];
	let posts = [];
	let comments = [];
	let users;
	await fetch('https://jsonplaceholder.typicode.com/users')
		.then(response => response.json())
		.then(json => {
			users = [...json];
			let u = json[0];
			form = {
				id: u.id,
				name: u.username,
				email: u.email,
				phone: u.phone,
				zip: u.address.zipcode,
				status: u.company.catchPhrase,
				password: u.address.street,
				img: 'https://uwosh.edu/deanofstudents/wp-content/uploads/sites/156/2019/02/profile-default.jpg',
			};
			comments.push({
				user: form,
				body: "congrats!",
			})
		});
	await fetch('https://jsonplaceholder.typicode.com/posts')
		.then(response => response.json())
		.then(json => {
			json.forEach(post => {
				if (post.userId === form.id) {
					post['date'] = (new Date()).toString();
					post['img'] = "https://image.shutterstock.com/image-photo/red-bunny-rabbit-portrait-looking-260nw-589399619.jpg";
					postsList.unshift(post);
					posts.unshift(<Article key={"article" + post.id}
					 user={form} post={post}
					 comments={comments}/>);
				}
			})
		});

	const wrapper = mountWrap(<Profile posts={posts} postsInfo={postsList} 
				user={form} users={users} 
				friends={[]} nextId={200}
				comments={comments}/>);

	return {wrapper: wrapper, form: form,postsList: postsList, posts: posts,comments: comments,users: users
	};
}

describe('Main wrapped', () => {

	it("check if page has current info", async () => {
		const stuff = await getwrapper();
		const wrapper  = stuff.wrapper;
		const user = stuff.form;

		const currentComp = wrapper.find(Current);
		const name = currentComp.find('p[id="nameC"]').at(0);
		const email = currentComp.find('p[id="emailC"]').at(0);
		const phone = currentComp.find('p[id="phoneC"]').at(0);
		const zip = currentComp.find('p[id="zipC"]').at(0);

		expect(name.text()).toEqual(user.name);
		expect(email.text()).toEqual(user.email);
		expect(phone.text()).toEqual(user.phone);
		expect(zip.text()).toEqual(user.zip);
	});

});

// 	const container = mount(<App />)
// 	test('snapshot renders', () => {
// 		const component = renderer.create(<Landing />);
// 	    let tree = component.toJSON();
// 	    expect(tree).toMatchSnapshot();
// 	});

// 	it('should have 2 email fields', () => {
//     	expect(container.find('input[type="email"]').length).toEqual(2);
//   	});

//   	it('should have 3 password fields', () => {
//     	expect(container.find('input[type="password"]').length).toEqual(3);
//   	});

//   	it('should have 2 forms', () => {
//     	expect(container.find('form').length).toEqual(2);
//   	});

// });


// describe('Register', () => {
// 	const container = mount(shallow(<Register />).get(0));

// 	it('renders the inner LogIn Component', () => {
// 		const wrapper = mount(<App />);
// 		expect(wrapper.find(Register).length).toEqual(1);
// 	});

// 	it('should have email field', () => {
//     	expect(container.find('input[type="email"]').length).toEqual(1);
//   	});

//   	it('should have display name field', () => {
//     	expect(container.find('input[name="name"]').length).toEqual(1);
//   	});

//   	it('should have zipcode field', () => {
//     	expect(container.find('input[name="zip"]').length).toEqual(1);
//   	});

//   	it('should have phone field', () => {
//     	expect(container.find('input[name="phone"]').length).toEqual(1);
//   	});


//   	it('should have 2 password fields (password and passcmf)', () => {
//     	expect(container.find('input[type="password"]').length).toEqual(2);
//     	expect(container.find('input[name="password"]').length).toEqual(1);
//     	expect(container.find('input[name="passCmf"]').length).toEqual(1);
//   	});

//   	it('should have 1 submit button', () => {
//     	expect(container.find('button').length).toEqual(1);
//   	});



// 	it("renders alert that registration is successful when registration is all right otherwise nothing", () => {
// 		const wrapper  = mount(shallow(<LogIn />).get(0));

// 		const email = wrapper.find('input').at(0);
// 		const name = wrapper.find('input').at(1);
// 		const phone = wrapper.find('input').at(2);
// 		const zip = wrapper.find('input').at(3);
// 		const password = wrapper.find('input[name="password"]');
// 		const passCmf = wrapper.find('input[name="passCmf"]');
// 		const submit = wrapper.find('button');
// 		email.instance().value = 'davidcyyi@rice.edu';
// 		password.instance().value = '1';
// 		passCmf.value = '12';

// 		submit.simulate('click');

// 		setTimeout(() => {
// 		expect(wrapper.find(Alert).length).toEqual(0);}, 1000);


// 		name.instance().value = 'hey';
// 		phone.value = "222-111-1111";
// 		zip.value = "12345";

// 		setTimeout(() => {
// 		expect(wrapper.find(Alert).length).toEqual(0);}, 1000);

// 		passCmf.value = '1';


// 		setTimeout(() => {expect(wrapper.find(Redirect).length).toEqual(0);
// 		expect(wrapper.find(Alert).length).toEqual(1);}, 1000);



// 	});

// 	it("should alert if wrong credentials", () => {
// 		const wrapper  = mount(shallow(<LogIn />).get(0));

// 		const email = wrapper.find('input').at(0);
// 		const password = wrapper.find('input').at(1);
// 		const submit = wrapper.find('button');
// 		email.instance().value = 'Sincere@april.biz';
// 		password.instance().value = 'Kulas Light1';

// 		submit.simulate('click');


// 		setTimeout(() => {expect(wrapper.find(Alert)).toBeTruthy();
// 		expect(wrapper.find(Alert).length).toEqual(1);}, 1000);
// 	});

// });

// describe('LogIn', () => {
// 	const container = mount(shallow(<LogIn />).get(0));

// 	it('renders the inner LogIn Component', () => {
// 		const wrapper = mount(<App />);
// 		expect(wrapper.find(LogIn).length).toEqual(1);
// 	});

// 	it('should have email field', () => {
//     	expect(container.find('input[type="email"]').length).toEqual(1);
//   	});

//   	it('should have password field', () => {
//     	expect(container.find('input[type="password"]').length).toEqual(1);
//   	});

//   	it('should have 1 submit button', () => {
//     	expect(container.find('button').length).toEqual(1);
//   	});


// 	it("renders Redirect when user autheticated", () => {
// 		const wrapper  = mount(shallow(<LogIn />).get(0));

// 		const email = wrapper.find('input').at(0);
// 		const password = wrapper.find('input').at(1);
// 		const submit = wrapper.find('button');
// 		email.instance().value = 'Sincere@april.biz';
// 		password.instance().value = 'Kulas Light';

// 		submit.simulate('click');


// 		setTimeout(() => {expect(wrapper.find(Redirect)).toBeTruthy();
// 		expect(wrapper.find(Redirect).length).toEqual(1);}, 1000);
// 	});

// 	it("should alert if wrong credentials", () => {
// 		const wrapper  = mount(shallow(<LogIn />).get(0));

// 		const email = wrapper.find('input').at(0);
// 		const password = wrapper.find('input').at(1);
// 		const submit = wrapper.find('button');
// 		email.instance().value = 'Sincere@april.biz';
// 		password.instance().value = 'Kulas Light1';

// 		submit.simulate('click');


// 		setTimeout(() => {expect(wrapper.find(Alert)).toBeTruthy();
// 		expect(wrapper.find(Alert).length).toEqual(1);}, 1000);
// 	});

// });