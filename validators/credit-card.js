
let defaultFormat = /(\d{1,4})/g;

let cards = [
	{
		type: 'Mastercard',
		pattern: /^5[1-5]/,
		format: defaultFormat,
		lenght: [16],
		cvcLength: [3],
		luhn: true
	},
	{
		type: 'Visa',
		pattern: /^4/,
		format: defaultFormat,
		lenght: [13],
		cvcLength: [3],
		luhn: true
	},
	{
		type: 'American Express',
		pattern: /^3[47]/,
		format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
		lenght: [15],
		cvcLength: [3, 4],
		luhn: true
	},
	{
		type: 'Discover',
		pattern: /^60/,
		format: defaultFormat,
		lenght: [16],
		cvcLength: [3],
		luhn: true
	},
	{
		type: 'Diners Club',
		pattern: /^5018/,
		format: defaultFormat,
		length: [14],
		cvcLength: [3],
		luhn: true
	}
	/*{
		type: 'Maestro',
		pattern: /^5018/,
		format: defaultFormat,
		lenght: [12],
		cvcLength: [3],
		luhn: true
	},
	{
		type: 'JCB',
		pattern: /^35/,
		format: defaultFormat,
		lenght: [16],
		cvcLength: [3],
		luhn: false
	},
	{
		type: 'Union Pay',
		pattern: /^62/,
		format: defaultFormat,
		lenght: [16],
		cvcLength: [3],
		luhn: false
	},*/
];

var luhnChk = (function (arr) {
	return function (ccNum) {
		var
			len = ccNum.length,
			bit = 1,
			sum = 0,
			val;

		while (len) {
			val = parseInt(ccNum.charAt(--len), 10);
			sum += (bit ^= 1) ? arr[val] : val;
		}

		return sum && sum % 10 === 0;
	};
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));

function cardFromNumber(num) {
	num = (num + '').replace(/\D/g, '');
	for (var i = 0; i < cards.length; i++) {
		var n = cards[i];
		if(n.pattern.test(num))
			return n;
	}
}

function getCardType(num){
	var card = cardFromNumber(num);
	if(card) {
		return card.type;
	}
}

function isValid(num) {
	var ccString = num.toString();
	var card = cardFromNumber(ccString);
	if(card && card.pattern.test(ccString) && card.luhn) {
		return luhnChk(ccString);
	} else {
		return false;
	}
}

export { isValid, getCardType };