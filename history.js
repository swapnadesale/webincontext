// CONSTANTS
// =========
var wordlist = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "causes", "certain", "certainly", "changes", "clearly", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "dear", "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't", "done", "down", "downwards", "during", "each", "edu", "eg", "eight", "either", "else", "elsewhere", "enough", "entirely", "especially", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "far", "few", "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore", "get", "gets", "getting", "given", "gives", "goes", "going", "gone", "got", "gotten", "greetings", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "just", "keep", "keeps", "kept", "know", "known", "knows", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "mainly", "many", "may", "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself", "name", "namely", "near", "nearly", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "outside", "over", "overall", "own", "p", "particular", "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite", "qv", "rather", "rd", "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively", "right", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t's", "take", "taken", "tell", "tends", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "tis", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twas", "twice", "two", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon", "us", "used", "useful", "uses", "using", "usually", "uucp", "value", "various", "via", "viz", "vs", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"];
var stopwords = new Array();
for(var i=0; i<wordlist.length; i++) stopwords[wordlist[i]] = 1;

var stopwebsites = ["google", "facebook", "youtube", "yahoo", "okcupid"];
var protocol = "http://";

var nodelist = ['DIV', 'SPAN', 'NOSCRIPT', 'CENTER', 'LAYER', 'LABEL', 'UL', 'OL', 'LI', 'DL', 'DD', 'DT', 'TABLE', 'TBODY', 'TH', 'TD', 'TR', 'FORM', 'SELECT', 'OPTION', 'OPTGROUP'];
var structureNodes = new Array();
for(var i=0; i<nodelist.length; i++) structureNodes[nodelist[i]] = 1;

domainReg = new RegExp(protocol+"[a-zA-Z0-9\x2D\x2E\x3A\x5F]*"+"/", "");



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
		this.maxHistoryEntries = merge(25000, opts.maxHistoryEntries);
		this.timeout = merge(10000, opts.timeout);
		this.batchSize = merge(100, opts.batchSize);
		this.shortPartSize = merge(15, opts.shortPartSize);
		this.longPartSize = merge(50, opts.shortPartSize);
		this.paramClick = merge(0.1, opts.paramClick);
		this.paramRemove = merge(-0.1, opts.paramRemove);
		
		if (opts.store == undefined || opts.store == null) this.store = new StoreWrapper({});
		else this.store = opts.store;
	},
	
	historyLoaded: function(){
		this.ready = true;
	},
	
	registerForNewPageLoadedEvents: function(){
		var that = this;
		if (this.ready == false) 
			return;
		
		chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
			var url = request.url;
			detailsPage.document.write("Processing url: " + url + "<br><br>");
			if (that.filterURL(url)) return;
			
			var startTime = (new Date).getTime();
			var computeScoreAndDetailResults = function() {
				that.computeTfidfScores(url, function(){
					// <debug>
					var scores = that.scores[url];
					var duration = (new Date).getTime() - startTime;
						
					var s = "Suggestions computed in: " + duration + "ms. <br>";
					for (var i = 0; i < 5; i++) {
						s += "<a href=" + scores[i].url + " target=\"_blank\">" +
						scores[i].title + "</a>: " + scores[i].score.toPrecision(2) + "<br>";
					}
					s += "<br><br><br>"
						
					s += "Full: <br>";
					s += serializeIntArray(that.tfs[url].full) + "<br><br>";
					s += "Filtered: <br>";
					s += serializeIntArray(that.tfs[url].filtered) + "<br><br>";
					
					s += "Page parts: <br>";
					for (var i = 0; i < that.tfs[url].parts.length; i++) {
						s += serializeIntArray(that.tfs[url].parts[i]) + "<br>";
					}
					s += "<br><br><br>"
							
					s += "Detailed suggestions: ";
					for (var i = 0; i < 5; i++) {
						s += "<a href=" + scores[i].url + " target=\"_blank\">" +
						scores[i].title + "</a>: " + scores[i].score.toPrecision(2) + "<br>";
						s += serializeIntArray(scores[i].intersect) + "<br><br>";
					}
					s += "<br><br><br>"
					
					detailsPage.document.write(s);
					// </debug>
				});
			};
			
			that.store.getTfs(url, function(tfs) {
				if (tfs) {
					that.tfs[url] = tfs;
					computeScoreAndDetailResults();
				} else {
					that.lastProcessedHistoryEntry = startTime;
					var page = document.createElement('body');
					page.innerHTML = request.body.replace(/<script(.|\s)*?\/script>|<style(.|\s)*?\/style>|<noscript(.|\s)*?\/noscript>/g, '');
					that.computeTfsDfs(url, request.title, page);
					that.extractSidePartsForURL(url, function(){
						that.store.storeParams(that, function(){
							computeScoreAndDetailResults();
						});
					});
				}
			});
		})
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
			
			var saveToStore = function(cbk){
				that.store.storeAllTfss(that.tfs, function(){
					that.store.storeParams(that, function(){
						that.tfs = new Array();
						cbk();
					});
				});
			};
			
			// Processes one history entry, then loops.
			var loop = function(){
				if (that.unprocessed.length == 0) 
					saveToStore(callback);
				else { // Process and loop.
					var entry = that.unprocessed.pop();
					if (that.tfs.length == that.batchSize) // First store current batch, if needed.
						saveToStore(function(){ that.processHistoryEntry(entry, loop); });
					else that.processHistoryEntry(entry, loop);
				}
			};
			// Start the loop.
			loop();
		});
	},
	
	processHistoryEntry: function(entry, callback){
		var that = this;
		
		this.lastProcessedHistoryEntry = entry.lastVisitTime;
		var url = entry.url;
		if (this.filterURL(url)) { callback(); return; } // If filtered, continue.
		
		// Try loading the page, through an async send request.
		try {
			var req = new XMLHttpRequest();
			req.open("GET", url, true);
			var reqTimeout = setTimeout(function(){
				req.abort();
				log += "Timeouted:" + url + " <br>";
				callback();
			}, this.timeout); // If time-outed, continue.
			req.onreadystatechange = function(){
				if (req.readyState == 4) {
					clearTimeout(reqTimeout);
					if (req.status == 200) { // Successful.
						// Parse the html, eliminating <script> and <style> content.
						var page = document.createElement('html');
						page.innerHTML = req.responseText.replace(/<script[^>]*?>[\s\S]*?<\/script>|<style[^>]*?>[\s\S]*?<\/style>|<noscript[^>]*?>[\s\S]*?<\/noscript>/ig, '');
						var title = page.getElementsByTagName('title')[0];
						title = (title != null) ? title.innerText : url;
						page = page.getElementsByTagName('body')[0];
						if (page != null) that.computeTfsDfs(url, title, page);
					}
					callback();
				}
			}
			detailsPage.document.write(that.nrProcessed + ": " + url + "<br>");
			req.send();
		} 
		catch (err) { 
			clearTimeout(reqTimeout);
			log += err.message + "<br>";
			callback(); 
		}
	},
	
	filterURL: function(url){
		if (url.substr(0, protocol.length) != protocol) return true;
		var domain = url.match(domainReg)[0];
		for (var i = 0; i < stopwebsites.length; i++) 
			if (domain.match(stopwebsites[i])) return true;
		return false;
	},
	
	// Assumes this is a structure node (initially called on the document body)
	buildPageStructure: function(node, struct){
		var rest = "";
		for (var i = 0, l = node.childNodes.length; i < l; i++) {
			var child = node.childNodes[i];
			if (structureNodes[child.nodeName] == 1) this.buildPageStructure(child, struct);
			else
				if (child.nodeName == "#text") rest += child.nodeValue + " ";
				else if (child.innerText != null) rest += child.innerText + " ";
		}
		if (rest != "") struct.push(rest);
		return struct;
	},
	
	computeTfsDfs: function(url, title, page){
//		if(url.toString() == "http://www.expedia.co.uk/pub/agent.dll?qscr=itcf&ckos=EX018D3E367FJGDC$11$D8$D7$B2$10$D8$D7$B21000$1A0001$FFJGDC$11$D8$D7$B2$10$D8$D7$B21000$D6$FAh13!70JGDC$11$D8$D7$B2$10$D8$D7$B22!7070001!70!4$FF00001000$1A000M$30!H0&ctxt=EX0172073EBDJGDC$11$D8$D7$B2$10$D8$D7$B210001000$1A!A0$1A0001000$1A000!4$FF!C0&itid=24836822&dism=0&ckos=EX018D3E367FJGDC$11$D8$D7$B2$10$D8$D7$B21000$1A0001$FFJGDC$11$D8$D7$B2$10$D8$D7$B21000$D6$FAh13!70JGDC$11$D8$D7$B2$10$D8$D7$B22!7070001!70!4$FF00001000$1A000M$30!H0&ctxt=EX0172073EBDJGDC$11$D8$D7$B2$10$D8$D7$B210001000$1A!A0$1A0001000$1A000!4$FF!C0&tpos=&rfrr=-54355&feml=1&dlye=0&cerp=adona.iosif@gmail.com&smst=1&zz=1295966020162&&chms=13329&zz=1298134774228") {
//			alert("computing tfsdfs");			
//		}
		var s = this.buildPageStructure(page, new Array());
		
		var wholeGeneral = new Array();
		var wholeSpecific = new Array();
		var partsGeneral = new Array();
		var partsSpecific = new Array();
		var nrLongParts = 0;
		
		// Compute the parts.
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
					
					if (typeof(wholeGeneral[word]) != 'number') {
						wholeGeneral[word] = 1;
						wholeGeneral.length++;
						// Only add to dfs the first time a word is encoutered.
						if (typeof(this.dfs[word]) != 'number') this.dfs[word] = 1;
						else this.dfs[word]++;
					} else wholeGeneral[word] += 1;
				}
			}
			partsGeneral.push(part);
			
			if (part.length > this.shortPartSize) {
				partsSpecific.push(part);
				if (part.length >= this.longPartSize) nrLongParts++;
				
				for (word in part) 
					if (typeof(wholeSpecific[word]) != 'number') {
						wholeSpecific[word] = part[word];
						wholeSpecific.length++;
					} else wholeSpecific[word] += part[word];
			}
		}

		this.nrProcessed++;		
		if (wholeGeneral.length > 0) {
			var type, full, filtered, parts;
			if(nrLongParts > 0) { 
				type = "specific"; 
				full = new Array(); 
				filtered = wholeSpecific; 
				parts = partsSpecific; 
			} 
			else { 
				type = "general"; 
				full = wholeGeneral; 
				filtered = wholeGeneral;
				parts = partsGeneral; 
			}

			this.tfs[url] = {url: url, title: title, type: type, full: full, filtered: filtered, parts: parts};
			this.tfs.length++;
			return true;
		} else 
			return false;
	},
	
	extractAllSideParts: function(callback){
		var that = this;
		this.store.getAllURLs(function(urls){
			var processedDomains = new Array();
			
			// Extracts common side parts for one domain, and then loops.
			var loop = function(){
				if (urls.length == 0) callback();
				else {
					var domain = urls.pop().match(domainReg)[0];
					// Check if domain already processed.
					if (processedDomains[domain] == 1) { loop(); return; }
					else processedDomains[domain] = 1;
					// Process and loop.
					that.extractSidePartsForDomain(domain, loop);
				}
			};
			// Start the loop.
			loop();
		});
	},
	
	extractSidePartsForDomain: function(domain, callback){
		var that = this;
		that.store.getTfssForDomain(domain, function(tfss){
			that.store.getSidePartsForDomain(domain, function(sideParts){
				var changedTfss = new Array();
				var changed = false;
				
				// Process the tfss.
				for (url1 in tfss) {
					// Remove existing sideParts from url1
					if (that.removeExistingSideParts(tfss[url1], sideParts)) {
						changedTfss[url1] = tfss[url1];
						changed = true;
					}
					// Intersect url1 and url2, save their common parts in sideParts, and remove them their original pages.
					for (url2 in tfss) {
						if (url2.toString() == url1.toString()) 
							break;
						else {
							// if(url1.toString() == "http://www.guardian.co.uk/data/global-development-data/search?facet_organization=uk-department-for-international-development-dfid") {
								if (that.intersectParts(tfss[url1], tfss[url2], sideParts)) {
									changedTfss[url1] = tfss[url1];
									changedTfss[url2] = tfss[url2];
									changed = true;
								}
							// }
						}
					}
				}
				
				if (!changed) { callback(); return; }
				// Update sideParts on disk.
				that.store.storeSidePartsForDomain(domain, sideParts, function(){
					// Updated the changed urls to disk
					that.store.storeAllTfss(changedTfss, function(){
						callback();
					});
				});
			});
		});
	},
	
	extractSidePartsForURL: function(url, callback){
		var that = this;

		var domain = url.match(domainReg)[0];
		var tfs = this.tfs[url];
		that.store.getTfssForDomain(domain, function(tfss){
			that.store.getSidePartsForDomain(domain, function(sideParts){
				var changedTfss = new Array();
				changedTfss[url] = tfs; // Preparing it to be saved on disk.
				// Remove existing sideParts
				that.removeExistingSideParts(tfs, sideParts);
				
				// Intersect with all other urls, save their common parts in sideParts, and remove them their original pages.
				for (url1 in tfss) 
					if (url.toString() != url1.toString()) {
						if (that.intersectParts(tfs, tfss[url1], sideParts)) 
							changedTfss[url1] = tfss[url1];
					}
				
				// Update sideParts on disk.
				that.store.storeSidePartsForDomain(domain, sideParts, function(){
					// Updated the changed urls to disk
					that.store.storeAllTfss(changedTfss, function(){
						callback();
					});
				});
			});
		});
	},
	
	removeExistingSideParts: function(tfs, sideParts){
		var changed = false;
		var parts = tfs.parts;
		for (var i = 0; i < parts.length; i++) {
			for (var j = 0; j < sideParts.length; j++) {
				if (equalArrays(parts[i], sideParts[j])) {
					// detailsPage.document.write(serializeIntArray(parts[i]) + "<br>");
					
					// Substract the common part from filtered.
					for (var word in parts[i]) {
						tfs.filtered[word] -= parts[i][word];
						if (tfs.filtered[word] == 0) {
							delete tfs.filtered[word];
							tfs.filtered.length--;
						}
					}

					// Eliminate the common part, and stick the last one of the array in its place.
					parts[i] = parts[parts.length - 1];
					delete parts[parts.length - 1];
					parts.length--;

					// Decrease i to ensure we still treat the newly put in place part, and return from the inner loop.
					i--;
					changed = true;
					break;
				}
			}
		}
		
		return changed;
	},
	
	intersectParts: function(tfs1, tfs2, sideParts){
		var changed = false;
		var parts1 = tfs1.parts;
		var parts2 = tfs2.parts;
		for (var i = 0; i < parts1.length; i++) {
			for (var j = 0; j < parts2.length; j++) {
				if (equalArrays(parts1[i], parts2[j])) {
					// detailsPage.document.write("Eliminating: " + serializeIntArray(parts1[i]) + "<br>");
					// Copy the common part in sideParts
					sideParts.push(parts1[i]);
					
					// Eliminate the common part from parts1, parts2.
					for (var word in parts1[i]) {
						tfs1.filtered[word] -= parts1[i][word];
						if (tfs1.filtered[word] == 0) {
							delete tfs1.filtered[word];
							tfs1.filtered.length--;
						}
						
						tfs2.filtered[word] -= parts1[i][word];
						if (tfs2.filtered[word] == 0) {
							delete tfs2.filtered[word];
							tfs2.filtered.length--;
						}
					}

					parts1[i] = parts1[parts1.length - 1];
					delete parts1[parts1.length - 1];
					parts1.length--;

					parts2[j] = parts2[parts2.length - 1];
					delete parts2[parts2.length - 1];
					parts2.length--;

					// Decrease i to ensure we still treat the newly put in place part, and return from the inner loop.
					i--;
					changed = true;
					break;
				}
			}
		}
		
		return changed;
	},

    computeTfidfScores: function(url, callback){
		var that = this;
                
        // Compute log idfs for the current dfs.
        var logIdfs = new Array();
        for(word in this.dfs) 
        	logIdfs[word] = Math.log(this.nrProcessed / this.dfs[word]) / Math.LN2;
                

		// Compute tf-idf(s) for the current url
		var tfidfFull, tfidfFiltered;
		
		var full = this.tfs[url].full;
		var v = new Array();
		var l = 0;
		for (var word in full) {
			v[word] = full[word] * logIdfs[word];
			l += v[word] * v[word];
		}
		if((this.tfs[url].type == "general") && (l == 0)) { callback(); return; }
        else tfidfFull = {v:v, l:Math.sqrt(l)};
		 
        var filtered = this.tfs[url].filtered;
		v = new Array();
        l = 0;
        for (var word in filtered) {
        	v[word] = filtered[word] * logIdfs[word];
           	l += v[word] * v[word];
		}
		if((this.tfs[url].type == "specific") && (l == 0)) { callback(); return; }
        else tfidfFiltered = {v:v, l:Math.sqrt(l)};

		// Compute the actual scores, are return the sorted results.
		delete that.scores[url];
        var score = new Array();
        this.computeTfidfScoresPaged(url, tfidfFull, tfidfFiltered, logIdfs, score, 0, function(){
        	that.scores[url] = score.sort(function(a, b){
            	return b.score - a.score
			});
            callback();
		});
	},
        
	computeTfidfScoresPaged: function(url, tfidfFull, tfidfFiltered, logIdfs, score, page, callback){
		var that = this;

        // Compute tfidf scores for the current page
        this.store.getTfsPage(page, function(tfsPage){
        	if (tfsPage.length == 0) { callback(); return; }

			var domain = url.match(domainReg)[0];                        
            for (var pageUrl in tfsPage) {
            	if (pageUrl != url) {
					var tfidf1, tfs2;
					var pageDomain = pageUrl.match(domainReg)[0];
					if(domain.toString() == pageDomain.toString()) {
						tfidf1 = tfidfFiltered;
						tfs2 = tfsPage[pageUrl].filtered;
					} else {
						tfidf1 = (that.tfs[url].type == "general") ? tfidfFull : tfidfFiltered;
						tfs2 = (tfsPage[pageUrl].type == "general") ? tfsPage[pageUrl].full : tfsPage[pageUrl].filtered;
					}
					if(tfidf1.l == 0) continue;

                	var l2 = 0, s = 0;
                	for(var word in tfs2) {
                		var t2 = tfs2[word] * logIdfs[word];
                    	l2 += t2 * t2;
                    	if (typeof(tfidf1.v[word]) == 'number') {
                    		s += tfidf1.v[word] * t2;
                    	}
                	}
                	l2 = Math.sqrt(l2);
                	if(l2 == 0) continue;
                                        
//              	score.push({score: s/(tfidf1.l*l2), url:pageUrl, title:tfsPage[pageUrl].title});
					// <debug>
					var tfs1;
					if(domain.toString() == pageDomain.toString()) tfs1 = that.tfs[url].filtered;
					else tfs1 = (that.tfs[url].type == "general") ? that.tfs[url].full : that.tfs[url].filtered;
					score.push({score: s/(tfidf1.l*l2), url:pageUrl, title:tfsPage[pageUrl].title, intersect:intersectArrays(tfs1, tfs2)});
					// </debug>
				}
			}

        	delete tfsPage;
        	// LOOP
        	that.computeTfidfScoresPaged(url, tfidfFull, tfidfFiltered, logIdfs, score, page + 1, callback);
		});
	},
	
	suggestionClicked: function(url, idx) {
		var that = this;
		// TODO: store click data.
		
		// Update tfs vectors.
		var tfs1 = this.tfs[url];
		var url2 = this.scores[url][idx].url;
		this.store.getTfs(url2, function(tfs2) {
			// Choose correct vectors to use - same which were used for computing scores.
			if(url.match(domainReg)[0].toString() == url2.match(domainReg)[0].toString()) {
				v1 = tfs1.filtered;
				v2 = tfs2.filtered;
			} else {
				v1 = (tfs1.type == "general") ? tfs1.full : tfs1.filtered;
				v2 = (tfs2.type == "general") ? tfs2.full : tfs2.filtered;
			}
			
			// Update tfs1
			if (tfs1.type == "general") addScaledArray(tfs1.full, v2, that.paramClick);
			addScaledArray(tfs1.filtered, v2, that.paramClick);
			detailsPage.document.write("Tfs1 filtered: " + serializeFloatArray(tfs1.filtered, 2) + "<br>");
			// Update tfs2
			if (tfs2.type == "general") addScaledArray(tfs2.full, v1, that.paramClick);
			addScaledArray(tfs2.filtered, v1, that.paramClick);
			detailsPage.document.write("Tfs2 filtered: " + serializeFloatArray(tfs2.filtered, 2) + "<br>");
			
			that.store.storeTfs(url, tfs1, function() {
				that.store.storeTfs(url2, tfs2, function() {
					that.computeTfidfScores(url, function() {
						detailsPage.document.write("Scores updated. <br>");
					}); 
				});
			});			

		});
		
	},
	
	suggestionDismissed: function(url, idx) {
		detailsPage.document.write("Suggestion " + idx + " dismissed for URL: " + url);
	}
};