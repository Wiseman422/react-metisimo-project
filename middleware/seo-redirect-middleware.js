/*import { Redirect } from 'met-data';
import _ from 'lodash';

export default function(request,response,next){
	var url = request.url.toLowerCase();
	var redirectsData = Redirect.findOne(url).then(function(r){
		if (r) {
			response.redirect(r.code, r.redirect);
		} else {
			next();
		}
	});
}*/