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

function match(wikiParks, localImages){
	var obj = {};
	for(let park of wikiParks){
		for(let image of Object.keys(localImages)){
			let name = image.substring(0, image.indexOf("."));
			if(park.name.toLowerCase().indexOf(name.toLowerCase()) != -1){
				obj[park.name] = localImages[image];
				break;
			}
		}
	}
	return obj;
}

function importAll(r){
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

function npEliminate(str){
	return str.substr(0, str.indexOf(" National Park"));
}

var utils = {
	setCookie,
	getCookie,
	importAll,
	match,
	npEliminate
};

module.exports = utils;