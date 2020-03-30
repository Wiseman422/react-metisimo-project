import _ from 'lodash';
import { Blog } from 'met-data';

export default [
	{
		routes: ['GET /blog'],
		callback : function(request, response, next) {
			return Blog
				.find({}, (cursor) => cursor.sort([['postedDate', -1]]))
				.then(function(blogposts) {
					return {
						view: 'blog/list/index.jsx',
						props: {list: blogposts}
					};
				});
		}
	},
	{
		routes: ['GET /blog/author/:author'],
		callback: function(request, response, next) {
			var author = request.params.author;
			return Blog
				.query((coll) => coll.find({author_search: author}).toArray())
				.then(function (blogposts) {
					if (! blogposts) {
						next();
						return;
					}
					return {
						view: 'blog/list/index.jsx',
						props: {list: blogposts}
					};
				});
		}
	},
	{
		routes: ['GET /blog/:id'],
		callback: function(request, response, next) {
			var id = request.params.id;
			return Blog
				.query((coll) => coll.find({ _id: id }).limit(1).next())
				.then(function (props) {
					if (! props) {
						next();
						return;
					}
					return {
						view: 'blog/entry/index.jsx',
						props: {
							title: props.title,
							image: props.image,
							article: props.article, 
							author: props.author,
							author_search: props.author_search,
							postedDate: props.postedDate
						}
					};
				});
		}
	}
];