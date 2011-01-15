function merge(defaultOption, userOption) {
	return (userOption == undefined || userOption == null) ? defaultOption: userOption;
}

var letterValues = {a:0, b:1, c:2, d:3, e:4, f:5, g:6, h:7, i:8, j:9, k:10, l:11, m:12, n:13, o:14, p:15, q:16, r:17, s:18, t:19, u:20, v:21, w:22, x:23, y:24, z:25};
function hashString(s) {
	var letters = s.split("");
	var h = 0;
	for(var i=0; i<letters.length; i++) {
		h ^= letterValues[letters[i]];
	}
	return h;
}

function copyArray(a) {
	var b = new Array();
	for(key in a) b[key] = a[key];
	return b;
}

function equalArrays(a, b) {
	for(var w in a) if(a[w] != b[w]) return false;
	for(var w in b) if(a[w] != b[w]) return false;
	return true;
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
