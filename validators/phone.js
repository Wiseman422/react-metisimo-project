var regex = /^\d{3}.*?\d{3}.*?\d{4}$/;

export default function(value){
	return regex.test(value);
}