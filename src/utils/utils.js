const SERVER_ERR_MSG = "Oops, it seems that we have some troubles for our server";
    
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
		let flag = false;
		for(let image of Object.keys(localImages)){
			let name = image.substring(0, image.indexOf("."));
			if(park.name.toLowerCase().indexOf(name.toLowerCase()) != -1){
				obj[park.name] = localImages[image];
				flag = true;
				delete localImages[image];
				break;
			}
		}
		if(!flag){
			console.log(park.name);
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
	if(str.indexOf("National Park of") == 0)
		return str.substr(str.indexOf("of") + 3);
	return str;
}

function dayTransform(obj){
	const mapping = {
		"monday": 0,
		"tuesday": 1,
		"wednesday": 2,
		"thursday": 3,
		"friday": 4,
		"saturday": 5,
		"sunday": 6
	};

	let res = new Array(7);
	for(let key of Object.keys(obj)){
		key = key.toLowerCase();

		res[mapping[key]] = {
			day: key,
			hour: obj[key]
		}
	}
	return res;
}

function judgeValidDate(date){
	return Date.parse(date) - Date.now() > 0 ;
}

function parseLatLon(str){
	let res = {lat:'', lon:''};
	res.lat = str.substring(str.indexOf("lat:") + 4, str.indexOf(","));
	res.lon = str.substring(str.indexOf("long:") + 5);
	return res;
}

var utils = {
	setCookie,
	getCookie,
	importAll,
	match,
	npEliminate,
	dayTransform,
	judgeValidDate,
	parseLatLon,
	SERVER_ERR_MSG
};

module.exports = utils;