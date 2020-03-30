import fs from 'fs';
import { html as beautifyHTML } from 'js-beautify';
import mustache from 'mustache';

var viewNameRegex = /(([-_a-z0-9]+)(\\|\/))?([-_a-z0-9]+)\.(jsx|js|html)$/i;

var baseTemplatePath = __dirname + '/template.html';
var baseTemplate = fs.readFileSync(baseTemplatePath,"utf-8");

fs.watchFile(baseTemplatePath,function(curr, prev) {
	baseTemplate = fs.readFileSync(baseTemplatePath,"utf-8");
});

export default {
	parse(entryPoint, content,  model) {
		var markup = mustache.render(baseTemplate,{
			content,
			entryPoint,
			model : JSON.stringify(model)
		});
		return beautifyHTML(markup);
	},
	template(){
		return baseTemplate;
	},
	viewName(name){
		var matches = viewNameRegex.exec(name.toLowerCase());
		return matches[matches[4] == "index" ? 2 : 4];
	}
};
