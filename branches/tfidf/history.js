// Word and website stoplists
var wordlist = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "causes", "certain", "certainly", "changes", "clearly", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "dear", "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't", "done", "down", "downwards", "during", "each", "edu", "eg", "eight", "either", "else", "elsewhere", "enough", "entirely", "especially", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "far", "few", "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore", "get", "gets", "getting", "given", "gives", "goes", "going", "gone", "got", "gotten", "greetings", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "just", "keep", "keeps", "kept", "know", "known", "knows", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "mainly", "many", "may", "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself", "name", "namely", "near", "nearly", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "outside", "over", "overall", "own", "p", "particular", "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite", "qv", "rather", "rd", "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively", "right", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t's", "take", "taken", "tell", "tends", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "tis", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twas", "twice", "two", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon", "us", "used", "useful", "uses", "using", "usually", "uucp", "value", "various", "via", "viz", "vs", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"];
var stopwords = new Array();
for(var i=0; i<wordlist.length; i++) {
	stopwords[wordlist[i]] = 1;
}
var stopwebsites = [".google.", ".facebook.", ".youtube."];
var protocol = "http://";


var History = function(opts) {
	this.init(opts);
};

History.prototype = {
	// Initializes all history fields.
	init: function(opts) {
		this.ready = false;
		this.lastProcessedHistoryEntry = 0;
		this.nrProcessed = 0;
		this.dfs = new Array();
		this.tfs = new Array();
		this.tfidf = new Array();
		this.scores = new Array();
		this.unprocessed = null;

		// Default properties
		this.maxHistoryEntries = merge(100000, opts.maxHistoryEntries);
		this.timeout = merge(20000, opts.timeout);
		this.batchSize = merge(100, opts.batchSize);

		if(opts.store == undefined || opts.store == null) {
			this.store = new StoreWrapper({});
		} else this.store = opts.store;
	},

	historyLoaded: function() {
		this.ready = true;
	},

	registerForNewPageLoadedEvents: function(){
		var that = this;
		if(this.ready == false) return; 

		chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
			var url = request.url;
			that.lastProcessedHistoryEntry = (new Date).getTime();
			if (url.substr(0, protocol.length) != protocol) return;
			for (var i = 0; i < stopwebsites.length; i++) {
				if (url.match(stopwebsites[i])) return;
			}

			that.computeTfsDfs(url, request.text);
			that.computeTfidf(url);
			that.store.storeTfidf(that, url, function() {
				that.computeTfidfScores(url, function() {
					delete that.tfidf[url];
				});				
			});
		});
	},

	// Loads lastProcessedHistoryEntry, nrProcessed, dfs from dis.
	loadParametersFromDisk: function(callback) {
		this.store.loadParams(this, function() {
			callback();
		});		
	},

	// Loads, processes and saves yet unprocessed URLs from history
	loadUnprocessedURLs: function(callback) {
		var that = this;

		this.div = document.createElement('div'); // Used to parse the retrieved HTML for each page. 
		chrome.history.search({
			text: "",
			startTime: this.lastProcessedHistoryEntry,
			maxResults: this.maxHistoryEntries
		}, function(results){
			that.unprocessed = results;
			that.processHistoryEntry(callback);
		});
	},

	processHistoryEntry: function(callback) {
		var that = this;
		if(this.unprocessed.length == 0) {
			// Done loading all history entries.
			this.computeAndStoreTfidfs(callback);
			return;
		}

		// Filter out undesired URLs.
		var entry = this.unprocessed.pop();
		this.lastProcessedHistoryEntry = entry.lastVisitTime;
		var url = entry.url;
		// detailsPage.document.write((new Date()).toGMTString() + ": " + url + "<br>");
		if(url.substr(0, protocol.length) != protocol) { this.processHistoryEntry(callback); return; }
		for(var i = 0; i<stopwebsites.length; i++) {
			if (url.match(stopwebsites[i])) { 
				this.processHistoryEntry(callback); 
				return; 
			}
		}

		// Preparing the save&loop function for the async request send.
		var saveAndLoop = function() {
			// Compute tf-idfs and save them to disk in batches, then loop.
			if (that.tfs.length == that.batchSize) {
				that.computeAndStoreTfidfs(function(){ that.processHistoryEntry(callback); });
			} else that.processHistoryEntry(callback);
		};

		// Try loading the page, through an async send request.
		try {
			var req = new XMLHttpRequest();
			req.open("GET", url, true);
			var reqTimeout = setTimeout(function() { saveAndLoop(); }, this.timeout);
			req.onreadystatechange = function() {
  				if (req.readyState == 4) {
					if(req.status == 200) {		// Successful.
						// Parse the html, eliminating <script> and <style> content.
						that.div.innerHTML = req.responseText.replace(/<script(.|\s)*?\/script>|<style(.|\s)*?\/style>/g, '');
						// Compute TFs and DFs.
						that.computeTfsDfs(url, that.div.innerText);
					}
					clearTimeout(reqTimeout);
    				saveAndLoop();
    			}
  			}
			req.send();
		} catch (err) { saveAndLoop(); }
	},

	computeTfsDfs: function(url, s) {
		var words = s.toLowerCase().match(/[a-zA-Z]+/g);
		if (words == null) return;

		this.tfs[url] = new Array();
		this.tfs.length++;
		this.nrProcessed++;
		for (var i = 0; i < words.length; i++) {
			var word = stemmer(words[i]);
			if (stopwords[word] != 1) {
				if (typeof(this.tfs[url][word]) != 'number') {
					this.tfs[url][word] = 1;
					if (typeof(this.dfs[word]) != 'number') this.dfs[word] = 1;
					else this.dfs[word]++;
				}
				else this.tfs[url][word]++;
			}
		}
	},

	computeAndStoreTfidfs: function(callback) {
		var that = this;
		if (this.tfs.length == 0) { callback(); return;}
		
		for(var url in this.tfs) this.computeTfidf(url);
		this.store.storeAllTfidfs(this, function(){
			// Memory management.
			delete that.tfidf;
			that.tfidf = new Array();
				
			callback();
		});
	},

	computeTfidf: function(url) {
		var v = new Array();
		var l = 0;
		for (var word in this.tfs[url]) {
			v[word] = this.tfs[url][word] * Math.log(this.nrProcessed / this.dfs[word]) / Math.LN2;
			l += v[word] * v[word];
		}
		l = Math.sqrt(l);

		this.tfidf[url] = {vector:v, length:l};
		delete this.tfs[url];
		this.tfs.length--;
	},

	computeTfidfScores: function(url, callback) {
		var that = this;
		var score = new Array();
		this.computeTfidfScoresPaged(url, score, 0, function() {
			that.scores[url] = score.sort(function(a,b) {return b.score - a.score});
			callback();
		});
	},

	computeTfidfScoresPaged: function(url, score, page, callback){
		var that = this;
		var v = this.tfidf[url].vector;
		
		// Compute tfidf scores for the current page
		this.store.getTfidfPage(page, function(tfidfPage){
			if (tfidfPage.length == 0) { callback(); return; }
			
			for (var pageUrl in tfidfPage) {
				if (pageUrl != url) {
					var s = 0;
					var pageV = tfidfPage[pageUrl].vector;
					for (var word in v) 
						if (typeof(pageV[word]) == 'number') s += v[word] * pageV[word];

					score.push({score: s / (that.tfidf[url].length * tfidfPage[pageUrl].length), url:pageUrl});
				}
			}
			delete tfidfPage;
			
			// LOOP
			that.computeTfidfScoresPaged(url, score, page + 1, callback);
		});
	}
};