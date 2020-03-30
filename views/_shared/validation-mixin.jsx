import ReactDOM from 'react-dom';
import _ from 'lodash';
import Bluebird from 'bluebird';
import emailValidator from '../../validators/email';
import { isValid as creditIsValid } from '../../validators/credit-card';

var numberRegex = /^-?\d+(\.\d+)?$/;
var phoneRegex = /^\d{3}.?\d{3}.?\d{4}$/;

function wrapResult(message, defaultMessage ,callback) {
	return function(){
		if(callback.apply(null, _.toArray(arguments))) {
			return { isValid : true };
		} else {
			return {isValid : false, message : message || defaultMessage };
		}
	};
}

function numberComparitor(message, defaultMessage, callback){
	return wrapResult(message. defaultMessage, (value) => {
		var innerValue = value;
		if(_.isString(value) && numberRegex.test(innerValue)){
			innerValue = parseFloat(innerValue);
		}
		if(_.isNaN(innerValue)) {
			return false;
		}
		return callback.apply(null, _.toArray(arguments));
	});
}

var defaultRules = {
	required (message) {
		return wrapResult(message, 'This field is required.' ,(value) => !!value);
	},
	email (message) {
		return wrapResult(message, 'This field must be an email address.',emailValidator);
	},
	password (message) {

	},
	number (message,min,max) {
		return wrapResult(message, 'This field must be an email address.',(value) => {
			if(_.isString(value)){
				return numberRegex.test(value);
			} else {
				return _.isNumber(value);
			}
		});
	},
	tel (message) {
		return wrapResult(message, 'This field must be an email address.',(value) => phoneRegex.test(value));
	},
	pattern (message, pattern){
		return wrapResult(message, 'This field is does not match the pattern.' ,(value) => new RegExp(pattern).test(value));
	},
	url (message) {
		throw "not implemented";
	},
	date (message, format) {
		throw "not implemented";
	},
	neq (message,compareTo) {
		return wrapResult(message, 'This field is must not be equal to ' + compareTo ,(value) => value !== compareTo);
	},
	eq (message,compareTo) {
		return wrapResult(message, 'This field is must be equal to ' + compareTo ,(value) => value === compareTo);
	},
	creditCard (message) {
		return wrapResult(message, 'This field is must be a valid credit card.' , creditIsValid);
	},
	gt (message,compareTo){
		return numberComparitor(message, 'This field is must be equal to ' + compareTo ,(value) => value > compareTo);
	},
	lt (message,compareTo) {
		return numberComparitor(message, 'This field is must be equal to ' + compareTo ,(value) => value < compareTo);
	},
	gte (message, compareTo) {
		return numberComparitor(message, 'This field is must be equal to ' + compareTo ,(value) => value >= compareTo);
	},
	lte (message, compareTo) {
		return numberComparitor(message, 'This field is must be equal to ' + compareTo ,(value) => value <= compareTo);
	},
	checked (message) {
		return wrapResult(message, 'This field must be checked.', (value,component,node) => !!node.checked);
	}
};

var createValidations = _.memoize(function (component,validations){
	return _.map(validations, function(vItem, vKey){
		var node = ReactDOM.findDOMNode(component.refs[vKey]);

		// run the attribute validations first
		var attrRules = [];

		// run the user-set rules second
		var userRules = _.map(vItem,function(rItem){
			if(_.isString(rItem)) {
				return defaultRules[rItem]();
			} else if (_.isFunction(rItem)) {
				return rItem;
			} else if (_.isObject(rItem)){
				return _.partial(function(message,callback,value){
					var result = callback(value);
					if(result){
						return { isValid : true };
					} else {
						return { isValid : false, message : message };
					}
				},rItem.message,rItem.callback);
			}
		});

		var rules = _.flatten([attrRules,userRules]);

		return _.bindAll({
			key : vKey,
			node : node,
			rules : rules,
			value : function(){
				var value = _.get(component.refs, vKey + '.value');
				if(_.isFunction(value)) {
					return value();
				} else {
					return value;
				}
			},
			validate : function(){
				var vResults = _.map(this.rules, (rule) => {
					var result = rule(this.value(), component, this.node);

					if(_.isBoolean(result)){
						result = { isValid : result };
					}

					result.key = this.key;
					result.value = this.value();

					if(_.isFunction(this.node.getAttribute)){
						var dataMessage = this.node.getAttribute("data-message");
						result.message = dataMessage || result.message;
					}

					return result;
				});

				// should only ever return one validation message per key
				return _.find(vResults, { isValid : false }) || _.first(vResults);
			}
		});
	});
});

var ValidationMixin = {
	validate (key) {
		var component = this;
		var validations = createValidations(this,this.validations);

		if(key) {
			validations = _.filter(validations,{ key });
		}

		validations = _.map(validations,(item) => item.validate());
		validations = _.flattenDeep(validations);

		return Bluebird.resolve(validations).then(function(vResults){
			component.setState({ validations });
			return {
				validations,
				isValid : _.every(validations, { isValid : true }),
				values :  _(validations).map((item) => [item.key, item.value]).fromPairs().value(),
				messages : _.map(validations,'message')
			};
		});
	},

	// returns true or false
	isValid (key) {
		return this.validate(key).then(function(results){
			return results.isValid;
		});
	},

	// get the current messages
	messages (key) {
		return this.validate(key).then(function(results){
			return results.messages;
		});
	},

	// get the current messages
	values (key) {
		return this.validate(key).then(function(results){
			return results.values;
		});
	},

	validationClassName (key){
		var validations = _.get(this.state,'validations',[]);
		var result = _.find(validations, { key });
		if(result && !result.isValid) {
			return 'validation-invalid';
		} else {
			return '';
		}
	},

	rules : defaultRules
};

export { ValidationMixin as ValidationMixin, defaultRules as rules };
export default ValidationMixin;