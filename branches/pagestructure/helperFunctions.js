function merge(defaultOption, userOption) {
	return (userOption == undefined || userOption == null) ? defaultOption: userOption;
}

function parseIntArray(arrayString){
	var a = new Array();
	entries = arrayString.match(/[a-z]+:[0-9]+/g);
	if (entries == null) 
		return a;
	for (var i = 0; i < entries.length; i++) {
		entry = entries[i];
		a[entry.match(/[a-z]+/g)] = parseInt(entry.match(/[0-9]+/g));
	}
	return a;
}

function serializeIntArray(a){
	var s = "";
	for (entry in a) {
		s += entry + ":" + a[entry] + ", ";
	}
	return s;
}

function parseFloatArray(arrayString){
	var a = new Array();
	entries = arrayString.match(/[a-z]+:[0-9]+.[0-9]+/g);
	if (entries == null) 
		return a;
	for (var i = 0; i < entries.length; i++) {
		entry = entries[i];
		a[entry.match(/[a-z]+/g)] = parseFloat(entry.match(/[0-9]+.[0-9]+/g));
	}
	return a;
}
		
function serializeFloatArray(a, dec){
	var s = "";
	for (entry in a) {
		s += entry + ":" + a[entry].toFixed(dec) + ", ";
	}
	return s;
}
