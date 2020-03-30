import creditCard from './credit-card';
import email from './email';
import match from './match';
import password from './password';
import phone from './phone';
import regex from './regex';
import required from './required';

function Validator(){
	this.validationMessages = [];
}

var validators = {
	creditCard,
	email,
	match,
	password,
	phone,
	regex,
	required
};

Object.keys(validators).forEach(key => {
	Validator.prototype[key] = function (message, values) {
		if (!validators[key].apply(this, Array.isArray(values) ? values : [values])) {
			this.validationMessages.push(message);
		}
	};
});
// for(var n in validators){
// 	Validator.prototype[n] = (function(key) {
// 		return function(message,values) {
// 			var args = Array.prototype.slice.call(arguments,1);
// 			if(validators[key].apply(this, args)) {
// 				this.validationMessages.push(message);
// 			}
// 		};
// 	})(n);
// }

Validator.prototype.messages = function(){
	return this.validationMessages;
};

Validator.prototype.reset = function(){
	this.validationMessages = [];
};

Validator.prototype.isValid = function(){
	return !this.validationMessages.length;
};

export default Validator;
