function merge(defaultOption, userOption) {
	return (userOption == undefined || userOption == null) ? defaultOption: userOption;
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
