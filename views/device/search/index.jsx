//css ./index.less
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../../layout/index.jsx';
import axios from 'axios';
import _ from 'lodash';
import preload from '../../../helpers/preload';

var storageKey = 'device-search-results';

var Pager = React.createClass({
	first(){ 
		this.props.first();
	},
	next(){ 
		this.props.next();
	},
	prev(){ 
		this.props.prev();
	},
	last(){ 
		this.props.last();
	},
	changePageCount(){ 
		this.props.changePageCount(this.refs.select.value);
	},
	render(){
		var currentPage = Math.ceil(this.props.skip/this.props.take);
		var totalPages = Math.ceil(this.props.count/this.props.take);
		var totalRecords = this.props.count;
		var pageCounts = [10,25,50,100];
		
		return <div className="search-pager">
			<div className="prev-pages">
				<button className="first" onClick={this.first} title="first">FIRST</button>
				<button className="prev" onClick={this.prev} title="prev">PREV</button>
			</div>
			<div className="paper-size">
				<label>Page Size </label>
				<select onChange={this.changePageCount} ref="select" value={this.props.take}>
					{_.map(pageCounts,(item,index) => <option value={item} key={index}>{item}</option> )}
				</select>
			</div>
			<div className="current-page">{`Page ${currentPage} of ${totalPages} `}</div>
			<div className="total-records">
				{`${totalRecords} Total Records`}
			</div>
			<div className="next-pages">
				<button className="next" onClick={this.next} title="next">NEXT</button>
				<button className="last" onClick={this.last} title="last">LAST</button>
			</div>
		</div>;
	}
});

export default React.createClass({
	getInitialState(){
		return this.getCleanState();
	},
	getCleanState() {
		return {
			search : null,
			data : [],
			dirty : false,
			skip : 0,
			take : 25,
			count :0
		};
	},
	componentDidMount(){
		preload('/images/loading.svg');
		var search = /search=(.*)&?/.exec(window.location.href);
		var existingState = JSON.parse(global.localStorage.getItem(storageKey));
		if(search){
			this.refs.search.value = search[1];
			this.search(true);
		} else if (existingState) {
			this.setState(existingState);
		}
	},
	search(noSearch){
		var self = this;
		var searchValue = this.refs.search.value;
		var searchOverlay = ReactDOM.findDOMNode(this.refs.searchOverlay);
		
		if(searchValue || noSearch) {
			searchOverlay.style.display = 'flex';
			axios
				.get(`/device/search/json?search=${encodeURI(searchValue)}&skip=${this.state.skip}&take=${this.state.take}`)
				.then(function(response){
					self.setState({
						search : searchValue,
						dirty : true,
						data : response.data.data,
						count : response.data.count
					},() => { searchOverlay.style.display = 'none'; });
					
					global.localStorage.setItem(storageKey, JSON.stringify(self.state));
					
				}).catch(() => { searchOverlay.style.display = 'none'; });
		} else {
			self.setState(self.getCleanState());
		}
	},
	skipTake(skip, take){
		this.setState({
			skip : Math.max(skip,0),
			take : take || this.state.take
		},function(){
			this.search();
		});
	},
	first(){ 
		this.skipTake(0);
	},
	next(){ 		
		this.skipTake(this.state.skip + this.state.take);
	},
	prev(){ 
		this.skipTake(this.state.skip - this.state.take);
	},
	last(){ },
	changePageCount(take){ 
		this.skipTake(0, take);
	},
	render(){
		// this is a comment I will remove when I'm done
	
		var search = _.debounce(this.search,500);
		
		var tableContent;
		if(this.state.data.length) { 
			tableContent = _.map(this.state.data,function(item,index){
				return <tr key={index}>
					<td><a href={`/device/${item.id}`} >{item.product_name}</a></td>
					<td>{item.company_name}</td>
					<td>{item.version}</td>
					<td>{item.disease_category}</td>
					<td>{item.otc ? 'OTC' : item.prescription ? 'Prescription' : '-'}</td>
					<td>{item.price}</td>
					<td>{item.product_score}</td>
				</tr>;
			});
		} else {
			tableContent = <tr>
				<td colSpan="100" className="no-records">
					{this.state.dirty ? 'No records' : 'Type in the search bar above to start searching.'}
				</td>
			</tr>;
		}
		
		var pagingProps = _.merge({},
			_.pick(this.state,"take","skip","count"),
			_.pick(this,"first","last","next","prev","changePageCount"));
			
		return <Layout {...this.props}>
			<div id="devices">
				<div className="header">
					<h2>Discover Medical Devices</h2>
				</div>
				<div className="search">
					<div className="container">
						<input type="text" className="search-bar" ref="search" placeholder="Search by keyword, company name, or device name" onChange={search} value={this.state.search}/>
					</div>
				</div>
				<div className="search-results">
					<div className="container">
						<Pager {...pagingProps}/>
						<div className="search-results-container">
							<table>
								<thead>
									<tr>
										<th>Device Name</th>
										<th>Company Name</th>
										<th>Version</th>
										<th>Disease Category</th>
										<th>Availability</th>
										<th>Price</th>
										<th>Device Score</th>
									</tr>
								</thead>
								<tbody>
									{tableContent}
								</tbody>
							</table>
							<div className="search-overlay" ref="searchOverlay">
								<img src="/images/loading.svg"/>
							</div>
						</div>
						<Pager {...pagingProps}/>
					</div>
				</div>
			</div>
		</Layout>;
	}
});