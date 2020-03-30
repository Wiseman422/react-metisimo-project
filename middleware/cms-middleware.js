/*
import { Page } from 'met-data';
import _ from 'lodash';
import React from 'react';
import renderReact from '../rendering/render-react';
import logger from 'better-console';

var cmsBody = React.createClass({
	render() {
		return <div className={'cms-body container ' + this.props.className} dangerouslySetInnerHTML={{__html : this.props.body}}/>;
	}
});

export default function(request,response,next){
	if(/\.\w*$/.test(request.url)){
		// omit any url with a file extension
		next();
		return;
	} else {
		logger.warn('CMS API HIT ON REQUEST' + request.url);
		var cmsId = _.trim(request.url,'/').toLowerCase();

		Page.findOne(cmsId).then(function(result){
			if(result) {
				var html = renderReact(request,response,{
					view : cmsBody,
					props : {
						body : result.html,
						className : cmsId
					}
				});
				response.send(html);
			} else {
				logger.warn('CMS page ' + request.url + ' not found');
				next();
			}
		})
		.catch(next);  // still don't care about errors.

	}
}
*/