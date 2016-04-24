import React from "react";
//import API from "../API";
//import LinkStore from "../stores/LinkStore";
import Relay from "react-relay";
import {debounce} from "lodash"

import Link from "./Link";
import CreateLinkMutation from "../mutations/CreateLinkMutation";

/*
let _getAppState = () => {
	return { links: LinkStore.getAll() };
}
*/

class Main extends React.Component {
	constructor(props) {
		super(props);

		this.search = debounce(this.search, 300);
	}

	search = (e) => {
		let query = e.target.value;
		this.props.relay.setVariables({ query });
	}
	setLimit = (e) => {
		let newLimit = Number(e.target.value);
		this.props.relay.setVariables({limit: newLimit});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		//Mutate
		Relay.Store.update(
			new CreateLinkMutation({
				title: this.refs.newTitle.value,
				url: this.refs.newUrl.value,
				store: this.props.store
			})
		);	
		this.refs.newTitle.value = "";
		this.refs.newUrl.value = "";
	}

	render() {
		let content = this.props.store.linkConnection.edges
			.map(edge => {
				return <Link key={edge.node.id} link={edge.node} />
			});

		return (
			<div>
				<h3>Links</h3>
				<form onSubmit={this.handleSubmit}>
					<input type="text" placeholder="Title" ref="newTitle" />
					<input type="text" placeholder="Url" ref="newUrl" />
					<button type="submit">Add</button>
				</form>
				Showing: &nbsp;
				<input type="text" placeholder="Search" onChange={this.search} />
				<select onChange={this.setLimit} 
					defaultValue={this.props.relay.variables.limit}>
					<option value="100">100</option>
					<option value="200">200</option>
				</select>
				<ul>
					{content}
				</ul>
			</div>
		);
	}

	/*

	static propTypes = {
		limit: React.PropTypes.number
	}

	static defaultProps = {
		limit: 5
	}

	*/

	// state = _getAppState();

	/*
	constructor(props) {
		super(props);

		//this.state = _getAppState();
		this.onChange = this.onChange.bind(this);
	}
	*/

	/*
	componentDidMount() {
		API.fetchLinks();
		LinkStore.on("change", this.onChange);	
	}

	componentWillUnmount() {
		LinkStore.removeListener("change", this.onChange);
	}

	onChange = () => {
		console.log("4. In the view");

		this.setState(_getAppState());
		console.log(this.state.links);
	}

	*/
}

// Declare the data requirement for this component
Main = Relay.createContainer(Main, {
	initialVariables: {
		limit: 100,
		query: ''
	},
	fragments: {
		store: () => Relay.QL`
			fragment on Store {
				id,
				linkConnection(first: $limit, query: $query) {
					edges {
						node {
							id,
							${Link.getFragment('link')}
						}
					}
					
				}
			}
		`
	}
});

export default Main;

/*
Main.propTypes = {
	limit: React.PropTypes.number
}

Main.defaultProps = {
	limit: 4
}
*/