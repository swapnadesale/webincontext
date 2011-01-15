// CONSTANTS
// =========
var wordlist = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "causes", "certain", "certainly", "changes", "clearly", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "dear", "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't", "done", "down", "downwards", "during", "each", "edu", "eg", "eight", "either", "else", "elsewhere", "enough", "entirely", "especially", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "far", "few", "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore", "get", "gets", "getting", "given", "gives", "goes", "going", "gone", "got", "gotten", "greetings", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "just", "keep", "keeps", "kept", "know", "known", "knows", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "mainly", "many", "may", "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself", "name", "namely", "near", "nearly", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "outside", "over", "overall", "own", "p", "particular", "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite", "qv", "rather", "rd", "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively", "right", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t's", "take", "taken", "tell", "tends", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "tis", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twas", "twice", "two", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon", "us", "used", "useful", "uses", "using", "usually", "uucp", "value", "various", "via", "viz", "vs", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"];
var stopwords = new Array();
for(var i=0; i<wordlist.length; i++) stopwords[wordlist[i]] = 1;

var stopwebsites = [".google.", ".facebook.", ".youtube."];
var protocol = "http://";

var nodelist = ['DIV', 'TABLE', 'FORM', 'UL', 'OL', 'SPAN', 'NOSCRIPT'];
var structureNodes = new Array();
for(var i=0; i<nodelist.length; i++) structureNodes[nodelist[i]] = 1;

domainReg = new RegExp(protocol+"[a-zA-Z0-9\x2D\x2E\x5F]*"+"/", "");



var History = function(opts) {
	this.init(opts);
};

History.prototype = {
	// Initializes all history fields.
	init: function(opts){
		this.ready = false;
		this.lastProcessedHistoryEntry = 0;
		this.nrProcessed = 0;
		this.dfs = new Array();
		this.tfs = new Array();
		this.scores = new Array();
		this.unprocessed = null;
		
		// Default properties
		this.maxHistoryEntries = merge(50, opts.maxHistoryEntries);
		this.timeout = merge(20000, opts.timeout);
		this.batchSize = merge(100, opts.batchSize);
		
		if (opts.store == undefined || opts.store == null) this.store = new StoreWrapper({});
		else this.store = opts.store;
	},
	
	historyLoaded: function(){
		this.ready = true;
	},

	registerForNewPageLoadedEvents: function(){
		var that = this;
//		if (this.ready == false) 
//			return;
//		
//		chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
//			var url = request.url;
//			if (that.filterURL(url)) 
//				return;
//			
//			that.lastProcessedHistoryEntry = (new Date).getTime();
//			var page = document.createElement('body');
//			page.innerHTML = request.body.replace(/<script(.|\s)*?\/script>|<style(.|\s)*?\/style>/g, '');
//			
//			that.computeTfsDfs(url, page);
//			that.store.storeTfs(that, url, function(){
//				that.computeTfidfScores(url, function(){
//					delete that.tfs[url];
//				});
//			});
//		});
	},
	
	// Loads lastProcessedHistoryEntry, nrProcessed, dfs from dis.
	loadParametersFromDisk: function(callback){
		this.store.loadParams(this, function(){
			callback();
		});
	},
	
	// Loads, processes and saves yet unprocessed URLs from history
	loadUnprocessedURLs: function(callback){
		var that = this;
		chrome.history.search({
			text: "",
			startTime: this.lastProcessedHistoryEntry,
			maxResults: this.maxHistoryEntries
		}, function(results){
			that.unprocessed = results;
			that.processHistoryEntry(callback);
		});
	},
	
	processHistoryEntry: function(callback){
		var that = this;
		if (this.unprocessed.length == 0) {
			// Done loading all history entries.
			this.store.storeAllTfss(this.tfs, function() {
				delete that.tfs;
				that.tfs = new Array();
				callback();
			});
			return;
		}
		
		var entry = this.unprocessed.pop();
		this.lastProcessedHistoryEntry = entry.lastVisitTime;
		var url = entry.url;
		if (this.filterURL(url)) { this.processHistoryEntry(callback); return; }
		
		// Preparing the save&loop function for the async request send.
		var saveAndLoop = function(){
			// Store the tfss to disk in batches, discard them from memory, then loop.
			if (that.tfs.length == that.batchSize) {
				that.store.storeAllTfss(that.tfs, function(){
					delete that.tfs;
					that.tfs = new Array();
					that.processHistoryEntry(callback); 
				});
			} else that.processHistoryEntry(callback);
		};
		
		// Try loading the page, through an async send request.
		try {
			var req = new XMLHttpRequest();
			req.open("GET", url, true);
			var reqTimeout = setTimeout(function(){ saveAndLoop(); }, this.timeout);
			req.onreadystatechange = function(){
				if (req.readyState == 4) {
					if (req.status == 200) { // Successful.
						// Parse the html, eliminating <script> and <style> content.
						var page = document.createElement('html');
						page.innerHTML = req.responseText.replace(/<script(.|\s)*?\/script>|<style(.|\s)*?\/style>/g, '');
						page = page.getElementsByTagName('body')[0];
						if (page != null) that.computeTfsDfs(url, page);
					}
					clearTimeout(reqTimeout);
					saveAndLoop();
				}
			}
			req.send();
		} 
		catch (err) {
			saveAndLoop();
		}
	},
	
	filterURL: function(url){
		if (url.substr(0, protocol.length) != protocol) return true;
		for (var i = 0; i < stopwebsites.length; i++)
			if (url.match(stopwebsites[i])) return true;
		return false;
	},
	
	// Assumes this is a structure node (initially called on the document body)
	buildPageStructure: function(node, struct){
		var rest = "";
		for (var i = 0, l = node.childNodes.length; i < l; i++) {
			var child = node.childNodes[i];
			if (structureNodes[child.nodeName] == 1) this.buildPageStructure(child, struct);
			else if (child.innerText != null) rest += child.innerText + " ";
		}
		if (rest != "") struct.push(rest);
		return struct;
	},
	
	computeTfsDfs: function(url, page){
		var s = this.buildPageStructure(page, new Array());
		
		var tfs = {};
		tfs.all = new Array();
		tfs.parts = new Array();
		for (var i = 0; i < s.length; i++) {
			var words = s[i].toLowerCase().match(/[a-z]+/g);
			if ((words == null) || (words.length == 0)) continue;
			
			var part = new Array();
			for (var j = 0; j < words.length; j++) {
				var word = stemmer(words[j]);
				if (stopwords[word] != 1) {
					if (typeof(part[word]) != 'number') {
						part[word] = 1;
						part.length++;
					} else part[word]++;
					
					if (typeof(tfs.all[word]) != 'number') {
						tfs.all[word] = 1;
						// Only add to dfs the first time a word is encoutered.
						if (typeof(this.dfs[word]) != 'number') this.dfs[word] = 1;
						else this.dfs[word]++;
					} else tfs.all[word]++;
				}
			}
			if(part.length > 0) tfs.parts.push(part);
		}
		
		if (tfs.parts.length > 0) {
			this.tfs[url] = tfs;
			this.tfs.length++;
			this.nrProcessed++;
		}
	},
	
	extractAllSideParts: function(callback) {
		var that = this;
		this.store.getAllURLs(function(urls){
			
			// Extracts common side parts for one URL, and loops.
			var extractSideParts = function(callback){
				if (urls.length == 0) callback();
				else {
					var domain = urls.pop().match(domainReg);
					var sideParts = new Array();
					this.store.getTfssForDomain(domain, function(tfss){
						// Process the tfss.
						for(url1 in tfss) {
							// Remove existing sideParts from url1
							this.removeExistingSideParts(tfss[url1].parts, sideParts);
							// Intersect url1 and url2.
							for(url2 in tfss) {
								if(url2.toString() == url1.toString()) break;
								else this.intersectParts(tfss[url1].parts, tfss[url2].parts, sideParts);
							}
						}
						// Save sideParts on disk.
						
						// LOOP.
						extractSideParts(callback);
					});
				}
			};

			// Start the loop.
			extractSideParts(callback);		
		});
	},
	
	removeExistingSideParts: function(parts, sideParts){
		for (var i = 0; i < sideParts.length; i++) {
			for (var j = 0; j < parts.length; j++) {
				if (equalArrays(sideParts[i], parts[j])) {
					// Eliminate the common part, and stick the last one of the array in its place.
					parts[j] = parts[parts.length - 1];
					delete parts[parts.length - 1];
					break;
				}
			}
		}
	},
	
	intersectParts: function(parts1, parts2, sideParts){
		for (var i = 0; i < parts1.length; i++) {
			for (var j = 0; j < parts2.length; j++) {
				if (equalArrays(parts1[i], parts2[j])) {
					// Copy the common part in sideParts
					sideParts.push(parts1[i]);
					// Eliminate the common part from parts1
					parts1[i] = parts1[parts1.length - 1];
					delete parts1[parts1.length - 1];
					// Eliminate the common part from parts2
					parts2[j] = parts2[parts2.length - 1];
					delete parts2[parts2.length - 1];
					// Decrease i to ensure we still treat the newly put in place part.
					i--;
					// Return from the inner loop.
					break;
				}
			}
		}
	}
	
//	computeTfidfScores: function(url, callback){
//		var that = this;
//		
//		// Compute log idfs for the current dfs.
//		var logIdfs = new Array();
//		for(word in this.dfs) 
//			logIdfs[word] = Math.log(this.nrProcessed / this.dfs[word]) / Math.LN2;
//		
//		// Compute (all) tf-idf for the current url
//		var all = this.tfs[url].all;
//		var v = new Array();
//		var l = 0;
//		for (var word in all) {
//			v[word] = all[word] * logIdfs[word];
//			l += v[word] * v[word];
//		}
//		var tfidf = {v:v, l:Math.sqrt(l)};
//
//		// Compute the actual scores, are return the sorted results.
//		var score = new Array();
//		this.computeTfidfScoresPaged(url, tfidf, logIdfs, score, 0, function(){
//			that.scores[url] = score.sort(function(a, b){
//				return b.score - a.score
//			});
//			callback();
//		});
//	},
//	
//	computeTfidfScoresPaged: function(url, tfidf, logIdfs, score, page, callback){
//		var that = this;
//		var domain = url.match(domainReg);
//		
//		// Compute tfidf scores for the current page
//		this.store.getTfsPage(page, function(tfsPage){
//			if (tfsPage.length == 0) {
//				callback();
//				return;
//			}
//			
//			var parts = that.tfs[url].parts;
//			for (var pageUrl in tfsPage) {
//				if (pageUrl != url) {
//					var v = that.tfs[url].all;
//					var pageV = tfsPage[pageUrl].all;
//					var pageParts = tfsPage[pageUrl].parts;
//					
//					// If from the same domain, substract common parts.
//					var pageDomain = pageUrl.match(domainReg);
//					if(pageDomain == null) alert(pageUrl);
//					var foundCommon = false;
//					if (pageDomain.toString() == domain.toString()) {
//						// detailsPage.document.write("Intersecting with page " + pageUrl + "<br>");
//						for (var i = 0; i < pageParts.length; i++) {
//							// Find common parts.
//							var hash = pageParts[i].hash;
//							var j = 0;
//							for (; j < parts.length; j++) {
//								if (hash == parts[j].hash) 
//									break;
//							}
//							
//							if (j < parts.length) {
//								// Double check that arrays are equal.
//								if (!equalArrays(pageParts[i].v, parts[j].v)) {
//									// detailsPage.document.write("Different part: " + serializeIntArray(pageParts[i].v) + "<br>");
//									continue;
//								}
//								 
//								// If first common part found, copy the vectors.
//								if (!foundCommon) {
//									v = copyArray(v);
//									pageV = copyArray(pageV);
//									foundCommon = true;
//								}
//					
//								// If common part found, substract from vectors.
//								var part = pageParts[i].v;
//								for (word in part) {
//									v[word] -= part[word];
//									pageV[word] -= part[word];
//								}
//							} else {
//								// detailsPage.document.write("Different part: " + serializeIntArray(pageParts[i].v) + "<br>");
//							}
//						}
//					}
//					
//					var t, l;
//					if(foundCommon) {
//						// Recompute tf-idf for url
//						t = new Array();
//						l = 0;
//						for (var word in v) {
//							t[word] = v[word] * logIdfs[word];
//							l += t[word] * t[word];
//						}
//						l = Math.sqrt(l);
//					} else {
//						t = tfidf.v;
//						l = tfidf.l;
//					}
//
//					// Compute actual scores
//					var pageT, pageL = 0, s = 0;
//					for(var word in pageV) {
//						var pageT = pageV[word] * logIdfs[word];
//						pageL += pageT * pageT;
//						if (typeof(t[word]) == 'number') {
//							s += t[word] * pageT;
//						}
//					}
//					pageL = Math.sqrt(pageL);
//					score.push({score: s/(l*pageL), url:pageUrl});
//					
//					// DEBUG 
//					detailsPage.document.write("Score for url: " + pageUrl + " - " + score[score.length - 1].score + "<br><br>");
//					detailsPage.document.write("Common words: <br>");
//					for(word in v) {
//						if(typeof(pageV[word]) == 'number') {
//							var s = v[word] * pageV[word] * logIdfs[word] * logIdfs[word] / (l * pageL);
//							detailsPage.document.write(word + ": " + v[word] + ", " + pageV[word] + ", " + s.toFixed(3) + ";   ");
//						}
//					}
//					detailsPage.document.write("<br><br>");
//				}
//			}
//			
//			delete tfsPage;
//			// LOOP
//			that.computeTfidfScoresPaged(url, tfidf, logIdfs, score, page + 1, callback);
//		});
//	},
};