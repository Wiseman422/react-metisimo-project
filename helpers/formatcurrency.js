import _ from 'lodash';

export default function (amount, currencySymbol = '$', decPlaces = 2, thouSeparator = ',', decSeparator = '.') {
	if (_.isNaN(amount)) {
		amount = "NA";
	}

	if(amount === 0) {
		return "Free";
	}

	var n = amount,
		sign = n < 0 ? "-" : "",
		i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;


	decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
	return sign + currencySymbol + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
}