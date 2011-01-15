// CONSTANTS
var wordlist = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "causes", "certain", "certainly", "changes", "clearly", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "dear", "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't", "done", "down", "downwards", "during", "each", "edu", "eg", "eight", "either", "else", "elsewhere", "enough", "entirely", "especially", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "far", "few", "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore", "get", "gets", "getting", "given", "gives", "goes", "going", "gone", "got", "gotten", "greetings", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "just", "keep", "keeps", "kept", "know", "known", "knows", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "mainly", "many", "may", "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself", "name", "namely", "near", "nearly", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "outside", "over", "overall", "own", "p", "particular", "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite", "qv", "rather", "rd", "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively", "right", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t's", "take", "taken", "tell", "tends", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "tis", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twas", "twice", "two", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon", "us", "used", "useful", "uses", "using", "usually", "uucp", "value", "various", "via", "viz", "vs", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"];
var stopwords = new Array();
for(var i=0; i<wordlist.length; i++) {
	stopwords[wordlist[i]] = 1;
}
var stopwebsites = [".google.", ".facebook.", ".youtube."];
var protocol = "http://";

var nodelist = ['DIV', 'TABLE', 'FORM', 'UL', 'OL', 'SPAN', 'NOSCRIPT'];
var structureNodes = new Array();
for(var i=0; i<nodelist.length; i++) {
	structureNodes[nodelist[i]] = 1;
}

domainReg = new RegExp(protocol+"[a-zA-Z0-9\x2E]*"+"/", "");



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
		this.batchSize = merge(1000, opts.batchSize);
		
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
			if (that.filterURL(url)) 
				return;
			
			that.lastProcessedHistoryEntry = (new Date).getTime();
			var page = document.createElement('body');
			page.innerHTML = request.body.replace(/<script(.|\s)*?\/script>|<style(.|\s)*?\/style>/g, '');
			
			that.computeTfsDfs(url, page);
			that.store.storeTfs(that, url, function(){
				that.computeTfidfScores(url, function(){
					delete that.tfs[url];
				});
			});
		});
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
			this.store.storeAllTfss(this, function() {
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
				that.store.storeAllTfss(function(){
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
		if (url.substr(0, protocol.length) != protocol) 
			return true;
		for (var i = 0; i < stopwebsites.length; i++) {
			if (url.match(stopwebsites[i])) 
				return true;
		}
		return false;
	},
	
	// Assumes this is a structure node (initially called on the document body)
	buildPageStructure: function(node, struct){
		var rest = "";
		for (var i = 0, l = node.childNodes.length; i < l; i++) {
			var child = node.childNodes[i];
			if (structureNodes[child.nodeName] == 1) 
				this.buildPageStructure(child, struct);
			else 
				if (child.innerText != null) 
					rest += child.innerText + " ";
		}
		if (rest != "") 
			struct.push(rest);
		return struct;
	},
	
	computeTfsDfs: function(url, page){
		var s = this.buildPageStructure(page, new Array());
		
		var tfs = {};
		tfs.all = new Array();
		tfs.parts = new Array();
		for (var i = 0; i < s.length; i++) {
			var words = s[i].toLowerCase().match(/[a-z]+/g);
			if ((words == null) || (words.length == 0)) 
				continue;
			
			var part = new Array();
			var hash = 0;
			for (var j = 0; j < words.length; j++) {
				var word = stemmer(words[j]);
				if (stopwords[word] != 1) {
					if (typeof(part[word]) != 'number') {
						part[word] = 1;
						part.length++;
					}
					else part[word]++;
					// TODO(!!): Do something much more sensible here.
					hash += hashString(word);
					
					if (typeof(tfs.all[word]) != 'number') {
						tfs.all[word] = 1;
						// Only add to dfs the first time a word is encoutered.
						if (typeof(this.dfs[word]) != 'number') 
							this.dfs[word] = 1;
						else 
							this.dfs[word]++;
					}
					else tfs.all[word]++;
				}
			}
			if(part.length > 0) tfs.parts.push({v:part, hash:hash});
		}
		
		if (tfs.parts.length > 0) {
			this.tfs[url] = tfs;
			this.tfs.length++;
			this.nrProcessed++;
		}
	},
		
	computeTfidfScores: function(url, callback){
		var that = this;
		
		// Compute log idfs for the current dfs.
		var logIdfs = new Array();
		for(word in this.dfs) 
			logIdfs[word] = Math.log(this.nrProcessed / this.dfs[word]) / Math.LN2;
		
		// Compute (all) tf-idf for the current url
		var all = this.tfs[url].all;
		var v = new Array();
		var l = 0;
		for (var word in all) {
			v[word] = all[word] * logIdfs[word];
			l += v[word] * v[word];
		}
		var tfidf = {v:v, l:Math.sqrt(l)};

		// Compute the actual scores, are return the sorted results.
		var score = new Array();
		this.computeTfidfScoresPaged(url, tfidf, logIdfs, score, 0, function(){
			that.scores[url] = score.sort(function(a, b){
				return b.score - a.score
			});
			callback();
		});
	},
	
	computeTfidfScoresPaged: function(url, tfidf, logIdfs, score, page, callback){
		var that = this;
		var domain = url.match(domainReg);
		
		// Compute tfidf scores for the current page
		this.store.getTfsPage(page, function(tfsPage){
			if (tfsPage.length == 0) {
				callback();
				return;
			}
			for (var pageUrl in tfsPage) {
				if (pageUrl != url) {
					var v = that.tfs[url].all;
					var pageV = tfsPage[pageUrl].all;
					
					// If from the same domain, substract common parts.
					var pageDomain = pageUrl.match(domainReg);
					var foundCommon = false;
					if (pageDomain.toString() == domain.toString()) {
						for (var i = 0; i < that.tfs[url].parts.length; i++) {
							// Find common parts.
							var hash = that.tfs[url].parts[i].hash;
							var j = 0;
							for (; j < tfsPage[pageUrl].parts.length; j++) {
								if (hash == tfsPage[pageUrl].parts[j].hash) 
									break;
							}
							
							if (j < tfsPage[pageUrl].parts.length) {
								// Double check that arrays are equal.
								if(!equalArrays(that.tfs[url].parts[i].v, tfsPage[pageUrl].parts[j].v)) continue;
								 
								// If first common part found, copy the vectors.
								if (!foundCommon) {
									v = copyArray(v);
									pageV = copyArray(pageV);
									foundCommon = true;
								}
					
								// If common part found, substract from vectors.
								var part = tfsPage[pageUrl].parts[j].v;
								for (word in part) {
									v[word] -= part[word];
									pageV[word] -= part[word];
								}
							}
						}
					}
					
					var t, l;
					if(foundCommon) {
						// Recompute tf-idf for url
						t = new Array();
						l = 0;
						for (var word in v) {
							t[word] = v[word] * logIdfs[word];
							l += t[word] * t[word];
						}
						l = Math.sqrt(l);
					} else {
						t = tfidf.v;
						l = tfidf.l;
					}

					// Compute actual scores
					var pageT, pageL = 0, s = 0;
					for(var word in pageV) {
						var pageT = pageV[word] * logIdfs[word];
						pageL += pageT * pageT;
						if (typeof(t[word]) == 'number') {
							s += t[word] * pageT;
						}
					}
					pageL = Math.sqrt(pageL);
					score.push({score: s/(l*pageL), url:pageUrl});
				}
			}
			
			delete tfsPage;
			// LOOP
			that.computeTfidfScoresPaged(url, tfidf, logIdfs, score, page + 1, callback);
		});
	},
};