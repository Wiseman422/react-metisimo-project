/* global Image */
export default function () {
	var images = new Array();
	for (var i = 0; i < arguments.length; i++) {
		images[i] = new Image();
		images[i].src = arguments[i];
	}
}