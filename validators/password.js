var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&\-])[A-Za-z\d$@$!%*?&\-]{8,}/i;

export default function(value){
	return regex.test(value);
}
