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
		this.unprocessed = new Array();
		this.dfs = new Array();
		this.scores = new Array();
		
		// Default properties
		this.maxHistoryEntries = merge(100000, opts.maxHistoryEntries);
		this.timeout = merge(10000, opts.timeout);
		this.batchSize = merge(100, opts.batchSize);
		this.shortPartSize = merge(15, opts.shortPartSize);
		this.longPartSize = merge(50, opts.shortPartSize);
//		this.paramClick = merge(0.1, opts.paramClick);
//		this.paramRemove = merge(-0.1, opts.paramRemove);
		
		if (opts.store == undefined || opts.store == null) this.store = new StoreWrapper({});
		else this.store = opts.store;
	},
	
	historyLoaded: function(){
		this.ready = true;
	},

	registerForNewPageLoadedEvents: function(){
		var that = this;
		if (this.ready == false) return;
		
		chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
			var url = request.url;
			if (that.filterURL(url)) return;
			
			detailsPage.document.write("Processing url: " + url + "<br><br>");
			var startTime = (new Date).getTime();
			var detailScores = function(scores, tfs) {
				var duration = (new Date).getTime() - startTime;
						
				var s = "Suggestions computed in: " + duration + "ms. <br>";
				for (var i = 0; i < 5; i++) {
					s += "<a href=" + scores[i].url + " target=\"_blank\">" +
					scores[i].title + "</a>: " + scores[i].score.toPrecision(2) + "<br>";
				}
				s += "<br><br><br>"

				s += "Tfs: <br>" + serializeFloatArray(tfs.tfs, 2) + "<br><br><br>";
				
				for (var i = 0; i < scores.length; i++) {
					s += "<a href=" + scores[i].url + " target=\"_blank\">" +
					scores[i].title + "</a>: " + scores[i].score.toPrecision(2) + "<br>";
				}
				s += "<br><br><br>"
					
				detailsPage.document.write(s);
			};
			
			that.store.getTfs(url, function(tfs) {
				if (tfs) {
					that.computeTfidfScores(tfs, function(){
						detailScores(that.scores[url], tfs);
					});
				}
				else {
					that.lastProcessedHistoryEntry = startTime;
					var page = document.createElement('body');
					page.innerHTML = request.body.replace(/<script[^>]*?>[\s\S]*?<\/script>|<style[^>]*?>[\s\S]*?<\/style>|<noscript[^>]*?>[\s\S]*?<\/noscript>/ig, '');
					
					var tfs = that.computeTfsDfs(url, request.title, page);
					if (!tfs) return;
					that.computeTfidfScores(tfs, function(){
						detailScores(that.scores[url], tfs);
						that.store.storeTfs(tfs, function(){
							that.store.storeParams(that, function(){});
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
		}, function(unprocessed){
			that.unprocessed = unprocessed;
			var tfss = new Array();
			var saveToStore = function(cbk){
				that.store.storeAllTfss(tfss, function(){
					that.store.storeParams(that, function(){
						delete tfss;	// Free memory.
						tfss = new Array();
						cbk();
					});
				});
			};
			
			// Processes one history entry, then loops.
			var loop = function(){
				if (unprocessed.length == 0) saveToStore(callback);
				else { // Process and loop.
					var entry = unprocessed.pop();
					if (tfss.length == that.batchSize) // First store current batch, if needed.
						saveToStore(function(){ that.processHistoryEntry(entry, tfss, loop); });
					else that.processHistoryEntry(entry, tfss, loop);
				}
			};
			loop();	// Start the loop.
		});
	},

	processHistoryEntry: function(entry, tfss, callback){
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
						if (page != null) {
							var tfs = that.computeTfsDfs(url, title, page);
							if (tfs != null) tfss.push(tfs);
						}
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
		var s = this.buildPageStructure(page, new Array());
		
		var tfsGeneral = new Array();
		var tfsSpecific = new Array();
		var specific = false;
		
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
					
					if (typeof(tfsGeneral[word]) != 'number') {
						tfsGeneral[word] = 1;
						tfsGeneral.length++;
						// Only add to dfs the first time a word is encoutered.
						if (typeof(this.dfs[word]) != 'number') this.dfs[word] = 1;
						else this.dfs[word]++;
					} else tfsGeneral[word] += 1;
				}
			}
			if (part.length > this.shortPartSize) {
				if (part.length >= this.longPartSize) specific = true;
				for (word in part) 
					if (typeof(tfsSpecific[word]) != 'number') {
						tfsSpecific[word] = part[word];
						tfsSpecific.length++;
					} else tfsSpecific[word] += part[word];
			}
			delete part;
		}

		if (tfsGeneral.length > 0) {
			this.nrProcessed++;
			var tfs = specific ? tfsSpecific : tfsGeneral;
			return {url: url, title: title, tfs:tfs};
		} else return null;
	},
	
    computeTfidfScores: function(tfs, callback){
		var that = this;
                
        // Compute log idfs for the current dfs.
        var logIdfs = new Array();
        for(word in this.dfs) 
        	logIdfs[word] = Math.log(this.nrProcessed / this.dfs[word]) / Math.LN2;
                
		// Compute tf-idf for the current url
		var tfidf;
		var v = new Array();
		var l = 0;
		for (var word in tfs.tfs) {
			v[word] = tfs.tfs[word] * logIdfs[word];
			l += v[word] * v[word];
		}
		if(l == 0) { callback(); return; }
        else tfidf = {url:tfs.url, v:v, l:Math.sqrt(l)};
		 
		// Compute the actual scores, are return the sorted results.
        var score = new Array();
        this.computeTfidfScoresPaged(tfidf, logIdfs, score, 0, function(){
			delete that.scores[tfs.url];
        	that.scores[tfs.url] = score.sort(function(a, b){
            	return b.score - a.score
			});
            callback();
		});
	},
        
	computeTfidfScoresPaged: function(tfidf, logIdfs, score, page, callback){
		var that = this;

        // Compute tfidf scores for the current page
        this.store.getTfsPage(page, function(tfsPage){
        	if (tfsPage.length == 0) { callback(); return; }

            for (var i = 0; i < tfsPage.length; i++) {
            	if (tfsPage[i].url != tfidf.url) {
					var tfs2 = tfsPage[i].tfs;
                	var l2 = 0, s = 0;
                	for(var word in tfs2) {
                		var t2 = tfs2[word] * logIdfs[word];
                    	l2 += t2 * t2;
                    	if (typeof(tfidf.v[word]) == 'number') {
                    		s += tfidf.v[word] * t2;
                    	}
                	}
                	if(l2 == 0) continue;
                    
					s /= (tfidf.l*Math.sqrt(l2));
					score.push({score: s, url:tfsPage[i].url, title:tfsPage[i].title /*, intersect:intersectArrays(tfs1, tfs2) */});
				}
			}

        	delete tfsPage;
        	// LOOP
        	that.computeTfidfScoresPaged(tfidf, logIdfs, score, page + 1, callback);
		});
	},
/*
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
*/
};