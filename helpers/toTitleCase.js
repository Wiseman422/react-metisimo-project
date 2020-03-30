export default function toTitleCase(str, keepCase = false) {
	return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() +  txt.substr(1).toLowerCase());
}