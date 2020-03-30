export default function(target,min,max){
	if(target < min){
		return min;
	} else if(target > max) { 
		return max;
	} else {
		return target;
	}
}