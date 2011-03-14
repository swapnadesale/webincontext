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
		this.lastComputedTfidfs = 0;
		this.scores = new Array();
		
		// Default properties
		this.maxHistoryEntries = merge(100000, opts.maxHistoryEntries);
		this.timeout = merge(10000, opts.timeout);
		this.batchSize = merge(500, opts.batchSize);
		this.shortPartSize = merge(15, opts.shortPartSize);
		this.longPartSize = merge(50, opts.longPartSize);
		this.nTopResultsShown = merge(5, opts.nTopResultsShown);
		this.nMoreResultsShown = merge(50, opts.nMoreResultsShown);
		this.clickAlpha = merge(0.25, opts.clickAlpha);
		this.clickBetta = merge(1.0, opts.clickBetta);
		this.clickGamma = merge(-0.75, opts.clickGamma);
		
		if (opts.store == undefined || opts.store == null) this.store = new StoreWrapper({});
		else this.store = opts.store;
		
		Math.seedrandom('random');
	},
	
	registerForNewPageLoadedEvents: function(){
		var that = this;
		chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
			var url = request.url;
			if (that.filterURL(url)) return;
			
			var startTime = (new Date).getTime();
			that.lastProcessedHistoryEntry = startTime;
			var pageBody = document.createElement('body');
			pageBody.innerHTML = request.body.replace(/<script[^>]*?>[\s\S]*?<\/script>|<style[^>]*?>[\s\S]*?<\/style>|<noscript[^>]*?>[\s\S]*?<\/noscript>/ig, '');
			var page = that.computeTfsDfs(url, request.title, pageBody);
			if (page) {
				// TODO: Move this in a nicer place.
				// Compute log idfs for the current dfs.
        		var logIdfs = new Array();
        		for(word in that.dfs) 
        			logIdfs[word] = Math.log(that.nrProcessed / that.dfs[word]) / Math.LN2;
				delete that.logIdfs;
				that.logIdfs = logIdfs;
				
				page = that.computeShortTfidf(page);
				that.computeSuggestions(page, function(){
					that.store.storePage(page, function(){
						that.store.storeParams(that, function(){
							if(that.nrProcessed - that.lastComputedTfidfs > that.batchSize)
								that.updateTfidfs(function(){});
						});
					});
				});
			}
		});
	},
	
	computeSuggestions: function(page, callback) {
		var that = this;
		var s = {};
		s.page = page;
		that.computeTfidfScores(page, function(tfidfScores){
			s.tfidfScores = tfidfScores;
			that.computeMMRScores(tfidfScores, function(mmrScores) {
				s.mmrScores = mmrScores;
				that.scores[page.url] = s;	// TODO: maybe move all these in another place?
				
				that.printSuggestions(page);
				callback();
			});
		});
	},
	
	printSuggestions: function(page){
		var s = "Suggestions for " + page.url + ". <br>";
		var scores = this.scores[page.url].mmrScores; 
		for (var i = 0; i < 5; i++) 
			if(scores[i].score >= 0.1) {
        		s += "<a href=" + scores[i].url + " target=\"_blank\">" +
            		scores[i].title + "</a>: " + 
					scores[i].score.toPrecision(2) + 
					"  <button type=\"button\" onclick=\"bg.hist.moreButtonClicked('" + page.url + "', " + i + ");\" >+</button> <br>";
			}
		s += "<br>"
        detailsPage.document.write(s);
	},
	
	// Loads lastProcessedHistoryEntry, nrProcessed, dfs from disk.
	loadParametersFromDisk: function(callback){
		this.store.loadParams(this, function(){
			callback();
		});
	},
	
	// Loads, processes and saves yet unprocessed URLs from history
	loadUnprocessedHistoryEntries: function(callback){
		var that = this;
		chrome.history.search({
			text: "",
			startTime: this.lastProcessedHistoryEntry,
			maxResults: this.maxHistoryEntries
		}, function(unprocessed){
			that.unprocessed = unprocessed;
			var pages = new Array();
			var saveToStore = function(cbk){
				that.store.storeAllPages(pages, function(){
					that.store.storeParams(that, function(){
						delete pages;	// Free memory.
						pages = new Array();
						cbk();
					});
				});
			};
			
			// Processes one history entry, then loops.
			var loop = function(){
				if (unprocessed.length == 0) saveToStore(callback);
				else { // Process and loop.
					var entry = unprocessed.pop();
					that.processHistoryEntry(entry, pages, function() {
						if (pages.length == that.batchSize) saveToStore(loop); // Store current batch, if needed.
						else loop();
					});
				}
			};
			loop();	// Start the loop.
		});
	},

	processHistoryEntry: function(entry, pages, callback){
		var that = this;

		this.lastProcessedHistoryEntry = entry.lastVisitTime;		
		var url = entry.url;
		if (this.filterURL(url)) { callback(); return; } // If filtered, continue.

		// Try loading the page, through an async send request.
		try {
			var req = new XMLHttpRequest();
			req.open("GET", url, true);
			var reqTimeout = setTimeout(function(){ req.abort(); }, this.timeout);
			req.onreadystatechange = function(){
				if (req.readyState == 4) {
					clearTimeout(reqTimeout);
					if (req.status == 200) { // Successful.
						// Parse the html, eliminating <script> and <style> content.
						var pageDocument = document.createElement('html');
						pageDocument.innerHTML = req.responseText.replace(/<script[^>]*?>[\s\S]*?<\/script>|<style[^>]*?>[\s\S]*?<\/style>|<noscript[^>]*?>[\s\S]*?<\/noscript>/ig, '');
						var title = pageDocument.getElementsByTagName('title')[0];
						title = (title != null) ? title.innerText : url;
						var pageBody = pageDocument.getElementsByTagName('body')[0];
						if (pageBody != null) {
							var page = that.computeTfsDfs(url, title, pageBody);
							if (page != null) pages.push(page);
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
	
	historyLoaded: function(){
		var that = this;
		// this.updateTfidfs(function() {
			// Register for new page loaded events.
			// TODO: think about how to make this work even before we've started processing					
			that.registerForNewPageLoadedEvents();
			that.ready = true;
			detailsPage.document.write("Ready! <br><br>");
		// });
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
	
	computeTfsDfs: function(url, title, body){
		var s = this.buildPageStructure(body, new Array());
		
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

		this.nrProcessed++;
		var tfs = specific ? tfsSpecific : tfsGeneral;
		if (tfs.length > 0) return {url: url, title: title, tfs:tfs, tfidf:null, tfidfl: 0};
		else return null;
	},

	computeShortTfidf: function(page) {
		// Compute tf-idf
		var v = new Array();
		var avg = 0;
		for (var word in page.tfs) {
			v[word] = page.tfs[word] * this.logIdfs[word];
			avg += v[word];
		}
		avg /= page.tfs.length;
		
		// Apply feature seletion to obtain short tfidf 
		var l = 0;
		for (var word in v) {
			if(v[word] >= 1.5 * avg) l += v[word]*v[word];	// Only keep words with tfidf value larger than twice the average. 
			else delete v[word];
		}
		l = Math.sqrt(l);
		
		// Normalize
		for (var word in v) v[word] /= l;
		
		page.tfidf = v; 
		return page;		
	},

	updateTfidfs: function(callback) {
		var that = this;
		
		 // Compute log idfs for the current dfs.
        var logIdfs = new Array();
        for(word in this.dfs) 
        	logIdfs[word] = Math.log(this.nrProcessed / this.dfs[word]) / Math.LN2;
		delete this.logIdfs;
		this.logIdfs = logIdfs;

		// Start updating.
		this.updateTfidfsBatched(0, function() {
			that.lastComputedTfidfs = that.nrProcessed; 
			that.store.storeParams(that, function() {
				callback();
			});
		});
	},
	
	updateTfidfsBatched: function(batch, callback) {
		var that = this;
		this.store.getPagesBatch(batch, function(pageBatch) {
			if(pageBatch.length == 0) { callback(); return; }
			
			for(var i=0; i<pageBatch.length; i++) 
				pageBatch[i] = that.computeShortTfidf(pageBatch[i]);
			that.store.storeAllPages(pageBatch, function() {
				delete pageBatch;
				// LOOP
				that.updateTfidfsBatched(batch+1, callback);
			});
		});
	},

    computeTfidfScores: function(page, callback){
		var that = this;
		var tfidfScores = new Array();
        this.computeTfidfScoresBatched(page, tfidfScores, 0, function(){
			tfidfScores = tfidfScores.sort(function(a, b){
            	return b.score - a.score
			});
            callback(tfidfScores);
		});
	},
        
	computeTfidfScoresBatched: function(page, tfidfScores, batch, callback){
		var that = this;

        // Compute tfidf scores for the current page
        this.store.getTfidfBatch(batch, function(pageBatch){
        	if (pageBatch.length == 0) { callback(); return; }

			var v1 = page.tfidf;
            for (var i = 0; i < pageBatch.length; i++) {
            	if (pageBatch[i].url != page.url) {
                	var v2 = pageBatch[i].tfidf, s = 0;
                	for(var word in v1)
                    	if (typeof(v2[word]) == 'number') s += v1[word] * v2[word];
					tfidfScores.push({score: s, url:pageBatch[i].url, title:pageBatch[i].title});
				}
			}

        	delete pageBatch;
        	// LOOP
        	that.computeTfidfScoresBatched(page, tfidfScores, batch + 1, callback);
		});
	},
	
	/*
	 * Computes the Maximal Marginal Relevance ordering given by:
	 * MMR = max for Di in R\S of [l * Sim(Di,Q) - (1-l) * max for Dj in S of Sim(Di,Dj)];
	 * where R - retrieved, S - selected.
	 */
	computeMMRScores: function(scores, callback) {
		var that = this;
		
		var mmrScores = new Array();
		var lambda = 1 - 2/3 * scores[this.nTopResultsShown-1].score;

		var urls = new Array();
		for(var i=0; (i<this.nMoreResultsShown) && (i<scores.length); i++) 
			urls.push(scores[i].url);	
		this.store.getTfidfForURLs(urls, function(tfidfs) {
			// Tag tfidfs with score. 
			var s = new Array();
			for(var i=0; i<urls.length; i++) s[scores[i].url] = scores[i].score;
			for(var i=0; i<tfidfs.length; i++) tfidfs[i].score = s[tfidfs[i].url];
			delete s; 
			
			for(var i=0; i<tfidfs.length; i++) {
				var mmrMax = - Number.MAX_VALUE, mmr;
				var mmrMaxPage;
				for(var j=0; j<tfidfs.length; j++)	// For Dj in R\S
					if(!tfidfs[j].inS) {
						mmr = lambda * tfidfs[j].score;
						
						var simMax = 0;
						var v1 = tfidfs[j].tfidf;
						for(var k=0; k<i; k++) {	// For Dk in S
							var v2 = tfidfs[mmrScores[k].pageIdx].tfidf, s = 0;
                			for(var word in v1)
                    			if (typeof(v2[word]) == 'number') s += v1[word] * v2[word];
							if(s > simMax) simMax = s;
						}
						
						mmr -= (1 - lambda) * simMax;
						if(mmr > mmrMax) {
							mmrMax = mmr;
							mmrMaxPage = j;
						}
					}
				mmrScores.push({
					score: tfidfs[mmrMaxPage].score, 
					url:tfidfs[mmrMaxPage].url, 
					title:tfidfs[mmrMaxPage].title, 
					pageIdx:mmrMaxPage,
				});
				tfidfs[mmrMaxPage].inS = true;
			}
			
			callback(mmrScores);	
		});
	},
	
	computeWordsMMRScores: function(page, scores, callback) {
		var that = this;
		
		var lambda = 0.3;
		var urls = new Array();
		for(var i=0; (i<this.nMoreResultsShown) && (i<scores.length); i++) 
			urls.push(scores[i].url);	
		this.store.getTfidfForURLs(urls, function(tfidfs) {
			// Compute word representations.
			var words = new Array();
			for(var word in page.tfidf) {
				var v = new Array(tfidfs.length);
				var l = 0;
				for(var i=0; i<tfidfs.length; i++) {
					v[i] = (typeof(tfidfs[i].tfidf[word]) == 'number') ? tfidfs[i].tfidf[word] : 0;
					l += v[i] * v[i]; 
				}
				// Normalize.
				for(var i=0; i<v.length; i++) v /= l;			
				words[word] = {v:v, s:page.tfidf[word]}; 
			}
			
			var mmrScores = new Array();
			var inS = new Array();
			for(var i=0; i<tfidfs.length; i++) {
				var mmrMax = - Number.MAX_VALUE, mmr;
				var mmrMaxWord;
				for(var w1 in words)	// For Dj in R\S
					if(!inS[w1]) {
						mmr = lambda * tfidfs[i].s;
						
						var simMax = 0;
						var v1 = words[w1].v;
						for(var k=0; k<i; k++) {	// For Dk in S
							var v2 = words[mmrScores[k].word].v, s = 0;
                			for(var word in v1)
                    			if (typeof(v2[word]) == 'number') s += v1[word] * v2[word];
							if(s > simMax) simMax = s;
						}
						
						mmr -= (1 - lambda) * simMax;
						if(mmr > mmrMax) {
							mmrMax = mmr;
							mmrMaxWord = w1;
						}
					}
				mmrScores.push({score: mmrMax, word:mmrMaxWord});;
				inS[mmrMaxWord] = true;
			}
			
			callback(mmrScores);	
		});
	}, 
	
	moreButtonClicked: function(url, idx) {
		var that = this;
		
		detailsPage.document.write("Detected click! <br>");
		var pg = this.scores[url].page;
		var clickedURL = this.scores[url].mmrScores[idx].url;
		var otherSeenURLs	= new Array();		// TODO: This is UI dependent, maybe move somewhere else.
		for(var i=0; i<5; i++)
			if(i != idx) otherSeenURLs.push(this.scores[url].mmrScores[i].url);
		
		that.store.getTfidf(clickedURL, function(clickedTfidf) {
			that.store.getTfidfForURLs(otherSeenURLs, function(otherSeenTfidfs) {
				var v1 = pg.tfidf;
				var v2 = clickedTfidf.tfidf;
				// Compute the centroid of the other suggestions.
				var v3 = new Array();
				for (var i = 0; i < otherSeenTfidfs.length; i++) 
					v3 = addArrays(v3, otherSeenTfidfs[i].tfidf);
				v3 = scaleArray(v3, 1 / otherSeenTfidfs.length);
					
				// Compute a*v1 + b*v2 - c*v3.
				v1 = scaleArray(v1, that.clickAlpha);
				v2 = scaleArray(v2, that.clickBetta);
				v3 = scaleArray(v3, that.clickGamma);
				var v = addArrays(addArrays(v1, v2), v3);
					
				// Apply feature seletion to obtain short tfidf - we treat positive and negative values differently.
				var avgP = 0, avgM = 0, nP = 0, nM = 0;
				for (var word in v) 
					if (v[word] > 0) { avgP += v[word]; nP++; }
					else { avgM += v[word]; nM++; }
				avgP /= nP; avgM /= nM;
					
				var l = 0;
				for (var word in v) {
					if ((v[word] >= 1.5 * avgP) || (v[word] <= 1.5 * avgM)) 
						l += v[word] * v[word]; // Only keep words with significant tfidf value 
					else delete v[word];
				}
				l = Math.sqrt(l);
					
				// Normalize
				for (var word in v) v[word] /= l;
					
				var page = {
					url: pg.url + " -> " + clickedURL,
					title: pg.title + " -> " + clickedTfidf.title,
					tfidf: v
				};
				that.computeSuggestions(page, function(){ });
			});
		});
	},
};