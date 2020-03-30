export default function (addressObj) {
	var result = [];
	addressObj = addressObj || {};
	result.push(addressObj.address);
	result.push(addressObj.address2);
	result.push(addressObj.address ? "," : null);
	result.push(addressObj.city);
	result.push(addressObj.city ? "," : null);
	result.push(addressObj.state);
	result.push(addressObj.country);
	return result.filter((item) => item).join(' ').replace(/\s*,/,', ').replace(/\s+/g,' ').trim();
}