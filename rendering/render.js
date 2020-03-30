var React = require("react");
var ReactDOM = require("react-dom");
var global = global || window;
function render(component, model, elementId){
	if (component.default) {
		component = component.default;
	}
	ReactDOM.render(React.createElement(component, model || global.model || {}),document.getElementById(elementId || 'react-content'));
}
module.exports = render;
