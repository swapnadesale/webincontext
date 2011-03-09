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
		this.longPartSize = merge(50, opts.shortPartSize);
		this.paramClick = merge(0.85, opts.paramClick);
		
		if (opts.store == undefined || opts.store == null) this.store = new StoreWrapper({});
		else this.store = opts.store;
	},
	
	historyLoaded: function(){
		var that = this;
		this.updateTfidfs(function() {
			// Register for new page loaded events.
			// TODO: think about how to make this work even before we've started processing					
			that.registerForNewPageLoadedEvents();
			that.ready = true;
		});
	},

	registerForNewPageLoadedEvents: function(){
		var that = this;
		chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
			var url = request.url;
			if (that.filterURL(url)) return;
			detailsPage.document.write("Processing url: " + url + "<br><br>");
			
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
				that.computeTfidfScores(page, function(){
					that.detailScores(that.scores[url], page, startTime);
					that.clusterTopSuggestions(that.scores[url], page, function() {
						that.store.storePage(page, function(){
							that.store.storeParams(that, function(){
								if(that.nrProcessed - that.lastComputedTfidfs > that.batchSize)
									that.updateTfidfs(function(){});
							});
						});						
					});
				});
			}
		});
	},
	
	detailScores: function(scores, page, startTime){
		var duration = (new Date).getTime() - startTime;
		
		var s = "Suggestions for " + page.url + " computed in: " + duration + "ms. <br>";
		for (var i = 0; i < 20; i++) {
			s += "<a href=" + scores[i].url + " target=\"_blank\">" +
			scores[i].title + "</a>: " +
			scores[i].score.toPrecision(2) + "<br>";
		}
		s += "<br><br><br>"
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
		
		page.tfidf = v; 
		page.tfidfl = l;
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
		var score = new Array();
		detailsPage.document.write(serializeIntArray(page.tfs) + "<br>");
		detailsPage.document.write(serializeFloatArray(page.tfidf, 3) + "<br>");
		
        this.computeTfidfScoresBatched(page, score, 0, function(){
			that.scores[page.url] = score.sort(function(a, b){
            	return b.score - a.score
			});
            callback();
		});
	},
        
	computeTfidfScoresBatched: function(page, score, batch, callback){
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
					s /= (page.tfidfl*pageBatch[i].tfidfl);
					score.push({score: s, url:pageBatch[i].url, title:pageBatch[i].title});
				}
			}

        	delete pageBatch;
        	// LOOP
        	that.computeTfidfScoresBatched(page, score, batch + 1, callback);
		});
	},
	
	clusterTopSuggestions: function(scores, page, callback) {
		var that = this;
		
		var startTime = (new Date).getTime();
		
		var urls = new Array();
		// TODO: deal with <50 pages in history.
		for(var i=0; i<50; i++) urls.push(scores[i].url);
		this.store.getTfidfForURLs(urls, function(tfidfs) {
			// Normalize all vectors.
			// TODO: move this at top level!
			for(var i=0; i<tfidfs.length; i++) {
				var l = tfidfs[i].tfidfl;
				var v = tfidfs[i].tfidf;
				for(word in v) v[word] /= l;
			}
			// Tag elements with score.
			var s = new Array();
			for(var i=0; i<urls.length; i++) s[scores[i].url] = scores[i].score;
			for(var i=0; i<tfidfs.length; i++) tfidfs[i].score = s[tfidfs[i].url];
			delete s; 
			
			
			// Try clustering with between 2 and 6 classes
			var bestClustering = new Array();
			for(var nClasses = 2; nClasses <= 5; nClasses++) {
				detailsPage.document.write("Clustering with " + nClasses + " classes. <br>");

				// For each number of clusters, cluster repeatedly with new centroids, to find best clustering
				bestClustering[nClasses] = { rss:Number.MAX_VALUE };
				for(var t = 0; t < 10; t++) {
					var clustering = {classes:new Array(), rss:0};
					// 1. Choose initial seeds.
					// ============================
					for(var c = 0; c<nClasses; c++) {
						clustering.classes[c] = {
							centroid: copyArray(tfidfs[Math.floor(Math.random() * tfidfs.length)].tfidf),
							elements: new Array(),
							rss: 0,
						};
					}
					
					// 2. Iterate between reassignment - recomputation of centroids
					// ============================================================
					var i=0;
					while (true) {
						// 2.1 Reassignment
						// ================
						for (var j = 0; j < tfidfs.length; j++) { // For each vector
							v = tfidfs[j].tfidf;
							
							// Compute distance to each centroid.
							var rssMin = Number.MAX_VALUE;
							var cMin;
							for (var c = 0; c < nClasses; c++) {
								var vc = clustering.classes[c].centroid;
								var rss = 0;
								// Add all terms in v.
								for (var word in v) {
									if (typeof(v[word]) == 'number') 
										if (typeof(vc[word]) == 'number') rss += (v[word] - vc[word]) * (v[word] - vc[word]);
										else rss += v[word] * v[word];
								}
								// Also add all terms in vc not in v.
								for (var word in vc[word]) 
									if (typeof(vc[word]) == 'number') 
										if (typeof(v[word]) != 'number') 
											rss += vc[word] * vc[word];
								// Update rssMin
								if (rss < rssMin) {
									rssMin = rss;
									cMin = c;
								}
							}
							// Assign vector to closest class.
							clustering.classes[cMin].elements.push({element:j, rss:rssMin});
							clustering.classes[cMin].rss += rssMin;
						}
						
						// Test stopping condition.
						i++;
						if (i == 100) 
							break;
						
						// 2.2 Recomputing centroids.
						// ==========================
						for (var c = 0; c < nClasses; c++) { // For each class
							var centroid = new Array();
							for (var j = 0; j < clustering.classes[c].elements.length; j++) { // For each vector of the class
								var v = tfidfs[clustering.classes[c].elements[j].element].tfidf;
								for (var word in v) {
									if (typeof(centroid[word]) != 'number') centroid[word] = v[word];
									else centroid[word] += v[word];
								}
							}
							for (var word in centroid) 
								centroid[word] /= clustering.classes[c].elements.length;
							// Reset class elements.
							delete clustering.classes[c].elements;
							clustering.classes[c].elements = new Array();
							clustering.classes[c].rss = 0;
						}
					}
					
					// 3. Compute total RSS and store best clustering.
					for(var c=0; c < nClasses; c++) 
						clustering.rss += clustering.classes[c].rss;
					if(clustering.rss < bestClustering[nClasses].rss)
						bestClustering[nClasses] = clustering;
				}
				
				// Print best clustering.
				detailsPage.document.write("Best clustering: (RSS: " + bestClustering[nClasses].rss.toFixed(3) + "). <br>");
				for(var c=0; c<nClasses; c++) {
					detailsPage.document.write("Class: " + c + "<br>");
					// Order by score descendingly.
					var elements = bestClustering[nClasses].classes[c].elements.sort(function(a, b){
						var sa = 2*(1-tfidfs[a.element].score) + 0.75*a.rss;
						var sb = 2*(1-tfidfs[b.element].score) + 0.75*b.rss;
            			return sa - sb;
					});
					// Print
					for (var j = 0; j < elements.length; j++) {
						var page = tfidfs[elements[j].element];
						detailsPage.document.write("<a href=" + page.url + " target=\"_blank\">" +
							page.title + "</a>: " + page.score.toPrecision(2) + "<br>");
					}
					detailsPage.document.write("<br>");
				}
				detailsPage.document.write("<br><br>");
			}
			
			var duration = (new Date).getTime() - startTime;
			detailsPage.document.write("Time taken to compute clusterings: " + duration + "<br><br><br>");
			
			callback();
		});
	},
	
	
	
/*
	suggestionClicked: function(url, idx, callback) {
		var that = this;
		
		detailsPage.document.write("Detected click! <br><br>");
		var startTime = (new Date).getTime();
		var url2 = this.scores[url][idx].url;
		var sc = this.scores[url][idx].score;
		this.store.getTfs(url, function(tfs) {
			that.store.getTfs(url2, function(tfs2) {
				// The angle between the vectors is acos(s)
				var teta = Math.acos(sc);
				
				// Adjusting the angle between the vectors to be paramClick * teta. (each of the vectors by half of it).
				// The new vector A' will be in the direction of P = (1-x)A + xB, where x is derived
				// from geometry, using the sine rule, as: 
				// x = sin[1/2*(1-paramClick)*teta] / sin[(pi+paramClick*teta)/2];
				// Similarly for B'.
				var x = Math.sin(1/2*(1-that.paramClick)*teta) / Math.sin((Math.PI+that.paramClick*teta)/2);
				
				// Compute tfidfs
				var tfidf = that.computeTfIdf(tfs);
				var tfidf2 = that.computeTfIdf(tfs2);
				
				// Compute A' as va = A + x(B-A) = (1-x)A + xB normalized, where A and B have been first normalized too.
				// Similarly for B'.
				var va = new Array(), vb = new Array(), l = 0;
				for(word in tfidf.v) {	// Add all elements in A.
					var ta = (1-x)*tfidf.v[word]/tfidf.l;
					var tb = x*tfidf.v[word]/tfidf.l; 
					if (typeof(tfidf2.v[word]) == 'number') {
						ta += x*tfidf2.v[word]/tfidf2.l;
						tb += (1-x)*tfidf2.v[word]/tfidf2.l;
					}
					va[word] = ta;
					vb[word] = tb;
					l += ta*ta;
				}
				for (word in tfidf2.v) { // Add elements in B not in A.
					if (typeof(tfidf.v[word]) != 'number') {
						var ta = x*tfidf2.v[word]/tfidf2.l;
						var tb = (1-x)*tfidf2.v[word]/tfidf2.l;
						va[word] = ta;
						vb[word] = tb;
						l += ta*ta;
					}
				}
				l = Math.sqrt(l);
	
				// Normalize, scale A' like A and B' like B, and switch back to tfs space.				
				for (word in va) 
					if (typeof(va[word]) == 'number') va[word] = va[word] * (tfidf.l / l) / that.logIdfs[word];
				for (word in vb) 
					if (typeof(vb[word]) == 'number') vb[word] = vb[word] * (tfidf2.l / l) / that.logIdfs[word];

		
				// <debug>
				var diff = new Array();
				for(word in va) {
					if(typeof(va[word]) == 'number') 
						if(typeof(tfs.tfs[word]) == 'number') diff[word] = va[word] - tfs.tfs[word];
						else diff[word] = va[word];
				}
				var sdiff = new Array();
				for(word in diff) {
					if(typeof(diff[word]) == 'number') sdiff.push({word:word, value:diff[word]});
				}
				sdiff = sdiff.sort(function(a, b){
            		return b.value - a.value
				});
				var s = "";
				for(var i=0; i<sdiff.length; i++) s+= sdiff[i].word + ":" + sdiff[i].value + ", ";
				detailsPage.document.write("Sorted diff : <br>");
				detailsPage.document.write(s+ "<br><br>");
				// </debug>
				 
				// Save the new vectors.
				tfs.tfs = va;
				tfs2.tfs = vb;
				that.store.storeTfs(tfs, function(){
					that.store.storeTfs(tfs2, function() {
						// Recompute suggestions
						that.computeTfidfScores(tfs, function(){
							that.detailScores(that.scores[url], tfs, startTime);
						});
					});
				});
			});
		});
	},
*/
/*
	suggestionDismissed: function(url, idx) {
		detailsPage.document.write("Suggestion " + idx + " dismissed for URL: " + url);
	}
*/
};