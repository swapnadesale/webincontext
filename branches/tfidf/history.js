// Word and website stoplists
var wordlist = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "causes", "certain", "certainly", "changes", "clearly", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "dear", "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't", "done", "down", "downwards", "during", "each", "edu", "eg", "eight", "either", "else", "elsewhere", "enough", "entirely", "especially", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "far", "few", "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore", "get", "gets", "getting", "given", "gives", "goes", "going", "gone", "got", "gotten", "greetings", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "just", "keep", "keeps", "kept", "know", "known", "knows", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "mainly", "many", "may", "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself", "name", "namely", "near", "nearly", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "outside", "over", "overall", "own", "p", "particular", "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite", "qv", "rather", "rd", "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively", "right", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t's", "take", "taken", "tell", "tends", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "tis", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twas", "twice", "two", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon", "us", "used", "useful", "uses", "using", "usually", "uucp", "value", "various", "via", "viz", "vs", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"];
var stopwords = new Array();
for(var i=0; i<wordlist.length; i++) {
	stopwords[wordlist[i]] = 1;
}
var stopwebsites = [".google.", ".facebook.", ".youtube."];

var History = function(opts) {
	this.init(opts);
};

History.prototype = {
	// Initializes all fields, and (if existent) loads parameters from disk.
	init: function(opts) {
		this.ready = false;
		this.lastProcessedHistoryEntry = 0;
		this.nrEntries = 0;
		this.dfs = new Array();
		this.tfs = new Array();
		this.tfidf = new Array();
		
		this.unprocessed = null;
		this.timer = null;
		
		// Default properties
		this.maxHistoryEntries = merge(100, opts.maxHistoryEntries);
		this.delay = merge(50, opts.delay);
		this.batchSize = merge(10, opts.batchSize);
		
		if(opts.store == undefined || opts.store == null) {
			this.store = new StoreWrapper({});
		} else this.store = opts.store;
	},
	
	loadParametersFromDisk: function(callback) {
		this.store.loadParams(this, function() {
			callback();
		});		
	},
	
	loadUnprocessedURLs: function(varName) {
		var that = this;
		
		this.div = document.createElement('div'); // Used to parse the retrieved HTML for each page. 
		chrome.history.search({
			text: "",
			startTime: this.lastProcessedHistoryEntry,
			maxResults: this.maxHistoryEntries
		}, function(results){
			that.unprocessed = results;
			// TODO: Do something less hacky than this!!
			that.timer = setInterval(varName+".processHistoryEntry(\""+varName+"\");", that.delay);
		});
	},
	
	processHistoryEntry: function(varName) {
		var that = this;
		
		clearInterval(this.timer);
		if(this.unprocessed.length == 0) {
			this.computeAndStoreTfidfs(function() {
				that.historyLoaded();					
			});
			return;
		}

		var entry = this.unprocessed.pop();
		this.lastProcessedHistoryEntry = entry.lastVisitTime;
		var url = entry.url;
		for(var i = 0; i<stopwebsites.length; i++) {
			if (url.match(stopwebsites[i])) {
				this.timer = setInterval(varName+".processHistoryEntry(\""+varName+"\");", this.delay)
				return;
			}
		}

		try {
			var req = new XMLHttpRequest();
			req.open("GET", url, false);
			req.send();
			// Parse the html, eliminating <script> and <style> content.
			this.div.innerHTML = req.responseText.replace(/<script(.|\s)*?\/script>|<style(.|\s)*?\/style>/g, '');
			// Compute TFs and DFs.
			this.computeTfsDfs(url, this.div.innerText);
		} catch (err) {
			alert(err);
		}
			
		// Compute tf-idfs and save them to disk in batches, then LOOP.
		if (this.tfs.length == this.batchSize) {
			this.computeAndStoreTfidfs(function(){
				that.timer = setInterval(varName+".processHistoryEntry(\""+varName+"\");", that.delay);
			});
		}
		else this.timer = setInterval(varName+".processHistoryEntry(\""+varName+"\");", that.delay);
	},
	
	computeTfsDfs: function(url, s) {
		var words = s.toLowerCase().match(/[a-zA-Z]+/g);
		if (words == null) return;

		this.tfs[url] = new Array();
		this.tfs.length++;
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
			v[word] = this.tfs[url][word] * Math.log((this.nrEntries + this.batchSize) / this.dfs[word]) / Math.LN2;
			l += v[word] * v[word];
		}
		this.tfidf[url] = {vector:v, length:l};
		delete this.tfs[url];
		this.tfs.length--;
	},

	historyLoaded: function() {
		this.history.ready = true;
	}
};