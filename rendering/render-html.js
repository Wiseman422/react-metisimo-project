import React from 'react';
import { parse, viewName } from './render-core.js';
import fs from 'fs';
import path from 'path';
import mustache from 'mustache';
import layout from '../views/layout/static.jsx';
import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';

export default function(request,response,result){
	var model = result.props || result.model;
	var contentPath = path.join(__dirname, '../views/', result.view);
	var content = mustache.render(fs.readFileSync(contentPath,"utf-8"), model);
	var entryPoint = viewName(result.view);
	var reactProps = _.merge({ __content : content },model);
	var element = React.createElement(layout,reactProps);
	var reactResult = ReactDOMServer.renderToStaticMarkup(element);
	return parse(entryPoint,reactResult);
}