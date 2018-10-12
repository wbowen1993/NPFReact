function setCookie(key, obj) {
	if(!key){
		console.err("Key is missing");
	}
	try{
		localStorage.setItem(key, JSON.stringify(obj));
	} catch(err){
		console.err(err);
	}
}

function getCookie(key) {
	if(!key) return null;

	try{
		const obj = localStorage.getItem(key);
		if(obj) return JSON.parse(obj);
		return null;
	}
	catch(err){
		return null;
	}
	
}

var utils = {
	setCookie,
	getCookie
};

module.exports = utils;