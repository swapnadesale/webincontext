function merge(defaultOption, userOption) {
	return (userOption == undefined || userOption == null) ? defaultOption: userOption;
}


var stopwebsites = ["google", "youtube", "facebook", "twitter", "yahoo", "okcupid"];
var protocol = "http://";
var domainReg = new RegExp(protocol+"[a-zA-Z0-9\x2D\x2E\x3A\x5F]*"+"/", "");

function filterURL(url){
	if (url.substr(0, protocol.length) != protocol) return true;
	var domain = url.match(domainReg)[0];
	for (var i = 0; i < stopwebsites.length; i++) 
		if (domain.match(stopwebsites[i])) return true;
	return false;
}

// Functions for handling associative arrays.
// ==========================================
// General properties:
// 	* return output (and usually expect input) arrays with defined lengths.
// 	* if the output array is empty, they return a (new Array()) rather than a null pointer.

function copyArray(a) {
	var b = new Array();
	for (var key in a) { b[key] = a[key]; b.length++; }
	return b;
}

function equalArrays(a, b) {
	if(a.length != b.length) return false;
	for(var key in a) if(a[key] != b[key]) return false;
	return true;
}

function intersectArrays(a, b) {
	var c = new Array();
	for(var key in a)
		if(b[key] != null) c[key] = "(" + a[key] +"," + b[key] + ")";
	return c;
}

function addArrays(a, b) {
	var s = new Array();
	for(var word in a) {
		if(typeof(b[word]) == 'number') s[word] = a[word] + b[word];
		else s[word] = a[word]; 
		s.length++;
	}
	for(var word in b)
		if(typeof(a[word]) != 'number') {
			s[word] = b[word];
			s.length++;
		}
	return s;
}

function scaleArray(a,x) {
	if(x == 0) return new Array();
	
	var b = new Array();
	for(var word in a) b[word] = x*a[word];
	length.b = length.a;
	return b;
}

function parseIntArray(s){
	var a = new Array();
	if(s == "") return a;
	var entries = s.split(",");
	for (var i = 0; i < entries.length; i++) {
		var parts = entries[i].split(":");
		a[parts[0]] = parseInt(parts[1]);
		a.length++;
	}
	return a;
}

function serializeIntArray(a){
	var s = "";
	for (entry in a) s += entry + ":" + a[entry] + ",";
	if (s != "") s = s.substring(0, s.length - 1); // Take out the last ",".
	return s;
}

function parseFloatArray(s){
	var a = new Array();
	if(s == "") return a;
	var entries = s.split(",");
	for (var i = 0; i < entries.length; i++) {
		var parts = entries[i].split(":");
		a[parts[0]] = parseFloat(parts[1]);
		a.length++;
	}
	return a;
}
		
function serializeFloatArray(a, dec){
	var s = "";
	for (entry in a) s += entry + ":" + a[entry].toFixed(dec) + ",";
	if (s != "") s = s.substring(0, s.length - 1); // Take out the last ",".
	return s;
}
