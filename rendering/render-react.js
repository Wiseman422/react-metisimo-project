import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { html as beautifyHTML } from 'js-beautify';
import path from 'path';
import _ from 'lodash';
import config from '../config';
import fs from 'fs';
import mustache from 'mustache';
import renderCore from './render-core';

function getComponent(viewsDir,componentOrPath){
	if(_.isString(componentOrPath)){
		var result =  require(path.join(viewsDir,componentOrPath));
		return result.default ? result.default : result;
	} else if (_.isObject(componentOrPath)) {
		return componentOrPath;
	} else {
		return null;
	}
}

var EmptyLayout = React.createClass({render() {
	return React.createElement("div",null,this.props.children);
}});

export default function(request,response,result){
	var viewsDir = path.join(__dirname, '../views');
	var view = getComponent(viewsDir,result.view);
	var model = result.props || result.model || {};

	// Always include authenticatedUserObj, if available
	if (request.authenticatedUserObj) {
		model = Object.assign({}, model, { authenticatedUserObj: _.pick(request.authenticatedUserObj, ['email', 'firstname', 'lastname'])});
	}

	var element = React.createElement(view,model);
	var reactContent = ReactDOMServer.renderToStaticMarkup(element);
	var entryPoint = renderCore.viewName(result.view);
	return renderCore.parse(entryPoint, reactContent, model);
}