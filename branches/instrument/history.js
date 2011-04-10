// CONSTANTS
// =========
var wordlist = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "causes", "certain", "certainly", "changes", "clearly", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "dear", "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't", "done", "down", "downwards", "during", "each", "edu", "eg", "eight", "either", "else", "elsewhere", "enough", "entirely", "especially", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "far", "few", "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore", "get", "gets", "getting", "given", "gives", "goes", "going", "gone", "got", "gotten", "greetings", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "just", "keep", "keeps", "kept", "know", "known", "knows", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "mainly", "many", "may", "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself", "name", "namely", "near", "nearly", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "outside", "over", "overall", "own", "p", "particular", "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite", "qv", "rather", "rd", "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively", "right", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t's", "take", "taken", "tell", "tends", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "tis", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twas", "twice", "two", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon", "us", "used", "useful", "uses", "using", "usually", "uucp", "value", "various", "via", "viz", "vs", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"];
var stopwords = new Array();
for(var i=0; i<wordlist.length; i++) stopwords[wordlist[i]] = 1;

var nodelist = ['DIV', 'SPAN', 'NOSCRIPT', 'CENTER', 'LAYER', 'LABEL', 'UL', 'OL', 'LI', 'DL', 'DD', 'DT', 'TABLE', 'TBODY', 'TH', 'TD', 'TR', 'FORM', 'SELECT', 'OPTION', 'OPTGROUP'];
var structureNodes = new Array();
for(var i=0; i<nodelist.length; i++) structureNodes[nodelist[i]] = 1;


var History = function(opts) {
	this.init(opts);
};

History.prototype = {
	// Initializes all history fields.
	init: function(opts){
		this.sessionID = 0;
		this.pageID = 0;
		
		this.lastProcessedHistoryEntry = 0;
		this.nrProcessed = 0;
		this.unprocessed = null;
		this.nrToProcess = 0;
		this.dfs = new Array();
		this.logIdfs = new Array();
		this.lastComputedTfidfs = 0;

		this.recentPages = new Array();	
		this.openTabs = new Array();	/* NOTE: Does not contain selectedTabs. */
		this.openTabs.nextToProcess = 0; 	
		this.selectedTabs = new Array();
		this.selectedTabs.nextToProcess = 0;

		// Default properties
		this.maxHistoryEntries = merge(20000, opts.maxHistoryEntries);
		this.nrLoadThreads = merge(5, opts.nrLoadThreads);
		this.timeout = merge(10000, opts.timeout);
		
		this.batchSize = merge(500, opts.batchSize);
		this.shortPartSize = merge(15, opts.shortPartSize);
		this.longPartSize = merge(50, opts.longPartSize);
		
		this.nTopResultsShown = merge(5, opts.nTopResultsShown);
		this.nMoreResultsShown = merge(50, opts.nMoreResultsShown);
		this.treshholdResultsShown = merge(0.075, opts.treshholdResultsShown);
		this.nTopWordsShown = merge(5, opts.nTopWordsShown);
		this.nMoreWordsShown = merge(20, opts.nMoreWordsShown);
		
		this.feedbackParamsSimilarSuggestions = merge([0.25, 1.0, -0.75], opts.feedbackParamsSimilarSuggestions);
		this.feedbackParamsSearchBoxQuery = merge([0.5, 1.0, 0.0], opts.feedbackParamsSearchBoxQuery);

		
		if (opts.store == undefined || opts.store == null) this.store = new StoreWrapper({batchSize:this.batchSize});
		else this.store = opts.store;


		var that = this;		
		this.extensionNotReadyListener = function(msg, sender, sendResponse) {
			if (msg.action == 'stateRequested') {
				var percentLoaded = (that.unprocessed == null) ? 0: 100 * (1 - that.unprocessed.length / that.nrToProcess);
				sendResponse({
					historyLoaded: false,
					percentLoaded: percentLoaded
				});
			}
		}
		chrome.extension.onRequest.addListener(this.extensionNotReadyListener);

		
		// User study 
		this.percentUserFeedback = merge(0.01, opts.percentUserFeedback);
		this.percentRandomSuggestionsNoFeedback = merge(0.01, opts.percentRandomSuggestionsNoFeedback);
		this.percentRandomSuggestionsFeedback = merge(0.01, opts.percentRandomSuggestionsFeedback);
	},
	
	loadHistory: function(callback){
		var that = this;
		this.store.loadParams(this, function(){
			// Generate a new sessionID, for instrumentation purposes.
			that.sessionID++;
			that.store.storeSessionID(that.sessionID);
			
			detailsPage = chrome.extension.getViews()[1];
			
			chrome.history.search({
				text: "",
				startTime: that.lastProcessedHistoryEntry,
				maxResults: that.maxHistoryEntries
			}, function(unprocessed){
				that.unprocessed = unprocessed;
				that.nrToProcess = unprocessed.length;
				
				var pages = new Array();
				var saveToStore = function(cbk){
					that.store.storeAllPages(pages, that, function(){
						delete pages;	// Free memory.
						pages = new Array();
						cbk();
					});
				};
				
				// Processes one history entry, then loops.
				var threadsFinished = 0;
				var loop = function(){
					if (unprocessed.length == 0) saveToStore(function() {
						threadsFinished++;
						if(threadsFinished == that.nrLoadThreads)
							that.historyLoaded(callback);
					});
					else { // Process and loop.
						var entry = unprocessed.pop();
						that.processHistoryEntry(entry, function(page) {
							if(page != null) pages.push(page);
							if (pages.length == that.batchSize) saveToStore(loop); // Store current batch, if needed.
							else loop();
						});
					}
				};

				for(var i=0; i<that.nrLoadThreads; i++)		// Start nrLoadThreads threads;
					loop();
			});
			
		});
	},

	/*
	 * @return	Page containing url, title, tfs and tfidf=[] if successful,
	 * 			null if unsuccessful (request failed, or document empty).
	 */
	processHistoryEntry: function(entry, callback){
		var that = this;

		this.lastProcessedHistoryEntry = entry.lastVisitTime;		
		var url = entry.url;
		if (filterURL(url)) { callback(null); return; } // If filtered, continue.

		// Try loading the page, through an async send request.
		try {
			var req = new XMLHttpRequest();
			req.open("GET", url, true);
			var reqTimeout = setTimeout(function(){ 
				req.abort(); 
			}, this.timeout);
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
							var page = {
								url:url, 
								title:title, 
							}
							var blockedURLs = new Array();
							blockedURLs[url] = true;
							page.blockedURLs = blockedURLs;
							
							that.computeTfsDfs(page, pageBody);
							callback(page);
						} else callback(null);
					} else callback(null);
				}
			}
			req.send();
		} 
		catch (err) { 
			clearTimeout(reqTimeout);
			log += err.message + "<br>";
			callback(null); 
		}
	},
	
	historyLoaded: function(callback){
		var that = this;
		this.updateLogIdfs();
		var firstBatch = Math.floor(this.lastComputedTfidfs/this.batchSize);
		this.updateTfidfs(firstBatch, function() {
			chrome.extension.onRequest.removeListener(that.extensionNotReadyListener);
			that.registerForEvents();
			callback();
		});
	},
	
	registerForEvents: function(){
		var that = this;
		
		// 1. Pick up existing windows and tabs.
		// =====================================
		chrome.windows.getAll({populate:true}, function(windows){
			for(var i=0; i<windows.length; i++) {
				var w = windows[i];
				for(var j=0; j<w.tabs.length; j++) {
					var t = w.tabs[j];
					var tEntry = {
						tId: t.id,
						wId: t.windowId,
						requests: [],
					};
					if (t.selected) that.selectedTabs.push(tEntry);
					else that.openTabs.push(tEntry);
				}
			}

			// Helper functions.
			var findTabInArray = function(a, key, value) {
				for (var i = 0; i < a.length; i++) 
					if (a[i][key] == value) {
						a[i].idx = i;	// Note: the idx property cannot be guaranteed to be present/correct at any other time besides immediatelly after a find call.
						return a[i];
					}
				return null;
			}
			var extractTabFromArray = function(a, key, value) {
				var t;
				for (var i = 0; i < a.length; i++) 
					if (a[i][key] == value) {
						t = a[i];
						a.splice(i, 1);
						if(a.nextToProcess >= a.length) a.nextToProcess=0;	// Reset nextToProcess if needed.
						return t;
					}
				return null;
			}
			var findTab = function(key, value){
				var t = findTabInArray(that.selectedTabs, key, value);
				if (t == null) {
					t = findTabInArray(that.openTabs, key, value);
					t.selected = false;		// Note: the select property cannot be guaranteed to be present/correct at any other time besides immediatelly after a find call.
				} else t.selected = true;
				return t;
				
			}
			var extractTab = function(key, value) {
				var t = extractTabFromArray(that.selectedTabs, key, value);
				if(t == null) t = extractTabFromArray(that.openTabs, key, value);
				return t;
			}
			var addRequest = function(pg, tId) {
				if (that.recentPages[pg.url] == null) {
					pg.tfidfScores = new Array();
					pg.nextBatch = 0;
					that.recentPages[pg.url] = pg;
				}
				var t = findTab('tId', tId);
				t.requests.push(pg.url);
				if(t.selected) that.selectedTabs.nextToProcess = t.idx;
				
				detailsPage.document.write('Request added for URL: ' + pg.url + '.<br>');
			}
			var removeRequest = function(pg, tId) {
				var t = findTab('tId', tId);
				var i;
				for(i = t.requests.length-1; i>=0; i--) {
					if(t.requests[i] == pg.url) {
						t.requests.splice(i, 1);
						break;
					}
				}
				if(i == t.requests.length)	// If removing top of stack request.
					if(t.selected) that.selectedTabs.nextToProcess = (t.idx + 1) % that.selectedTabs.length;
					else that.openTabs.nextToProcess = (t.idx + 1) % that.openTabs.length;
			}
			// 2. Set up listeners for window and tab events: resets requests when new page is loaded, or tab is closed.
			// =========================================================================================================
			chrome.tabs.onCreated.addListener(function(t) {
				that.openTabs.push({
					tId: t.id,
					wId: t.windowId,
					requests: [],
				});
			});
			chrome.tabs.onRemoved.addListener(function(tId) {
				extractTab('tId', tId);
			});
			chrome.tabs.onSelectionChanged.addListener(function(tId, selectInfo) {
				var tOld = extractTabFromArray(that.selectedTabs, 'wId', selectInfo.windowId);
				if(tOld != null) that.openTabs.push(tOld);
				var t = extractTab('tId', tId);
				that.selectedTabs.push(t);
				that.selectedTabs.nextToProcess = that.selectedTabs.length - 1;
			});
			chrome.tabs.onUpdated.addListener(function(tId, changeInfo){
				if (changeInfo.status == 'loading') {
					that.lastProcessedHistoryEntry = (new Date).getTime();
					var t = findTab('tId', tId) 
					t.requests = [];
				}
			});

			// 3. Set up listeners for messages from inContext windows: prepares and adds incoming requests from the inContext window.
			// =======================================================================================================================
			chrome.extension.onRequest.addListener(function(msg, sender, sendResponse){
				var startTime = (new Date()).getTime();
				var pg;
				switch (msg.action) {
					case 'stateRequested':
						that.pageID++;
						var id = that.sessionID + '-' + that.pageID;
						
						/*
						* Add user study behavior.
						*/
						var userFeedback = (Math.random() < that.percentUserFeedback);
						
						sendResponse({
							historyLoaded:true, 
							id:id, 
							userFeedback:userFeedback
						});
						break;
						
					case 'pageLoaded':
						if (that.recentPages[msg.url] != null)	// TODO: clean this up a bit.
							addRequest({url:msg.url}, sender.tab.id);
						else {
							var pg = {
								url: msg.url,
								title: msg.title,
							};
							var blockedURLs = new Array();
							blockedURLs[msg.url] = true;
							pg.blockedURLs = blockedURLs;
							pg.startTime = startTime; 
							
							var pageBody = document.createElement('body');
							pageBody.innerHTML = msg.body.replace(/<script[^>]*?>[\s\S]*?<\/script>|<style[^>]*?>[\s\S]*?<\/style>|<noscript[^>]*?>[\s\S]*?<\/noscript>/ig, '');
							that.computeTfsDfs(pg, pageBody)
							that.updateLogIdfs();
							that.computeShortTfidf(pg);
							that.store.storePage(pg, that, function(){
								if (that.nrProcessed % that.batchSize == 0) // TODO: Use another divisor here?
									that.updateTfidfs(0, function(){
								});
							});
							
							/*
							 * Add user study behavior.
							 */
							pg.randomSuggestions = msg.userFeedback ? (Math.random() < that.percentRandomSuggestionsFeedback) :
								(Math.random() < that.percentRandomSuggestionsNoFeedback);
							pg.state = pg.randomSuggestions ? 'computingRandomSuggestions' : 'computingTfidfScores';
							detailsPage.document.write(pg.randomSuggestions + " - " + pg.url + "<br>");

							addRequest(pg, sender.tab.id);
						}
						break;
						
					case 'moreLikeThisRequested':
						var resultURL = msg.sourceURL + ' -> ' + msg.suggestionURL; 
						if(that.recentPages[resultURL] != null) 
							addRequest({url:resultURL}, sender.tab.id);
						else 
							that.computeMoreLikeThisPage(msg.sourceURL, msg.suggestionURL, function(pg){
								pg.startTime = startTime;
								
								/*
							 	* Add user study behavior.
							 	*/
								pg.randomSuggestions = msg.userFeedback? (Math.random() < that.percentRandomSuggestionsFeedback) : false; 
								pg.state = pg.randomSuggestions ? 'computingRandomSuggestions' : 'computingTfidfScores';
								detailsPage.document.write(pg.randomSuggestions + " - " + pg.url + "<br>");
								
								addRequest(pg, sender.tab.id);							
							});
						break;
						
					case 'searchRequested':
						var resultURL = msg.url + ' -> ' + msg.query;
						if (that.recentPages[resultURL] != null) 
							addRequest({url:resultURL}, sender.tab.id);
						else {
							pg = that.computeSearchQueryPage(msg.url, msg.query);
							pg.startTime = startTime;
							
							/*
							* Add user study behavior.
							*/
							pg.randomSuggestions = false;
							pg.state = 'computingTfidfScores';
							
							addRequest(pg, sender.tab.id);
						}
						break;
					
					case 'logRequested':
						that.store.storeEvent(msg.event);
						break;
				}
			});
			
			// 4. Start the request serving loop.
			// ================================
			var loop = function() {
				var url = null, tId;
				// 4.1. Find the URL of the next request to service.
				// =================================================
				if(that.selectedTabs.length > 0) {	// Prioritize selected tabs.
					for (var i = 0; i < that.selectedTabs.length; i++) { // Try out all selected tabs for a request to service. 
						var t = that.selectedTabs[that.selectedTabs.nextToProcess];
						if (t.requests.length > 0) {
							url = t.requests[t.requests.length - 1]; // Found one!
							tId = t.tId; 
							break;
						}
						else that.selectedTabs.nextToProcess = (that.selectedTabs.nextToProcess + 1) % that.selectedTabs.length; // Look further.
					}
				} 
				if(url == null) {	// If still no request found, try other open pages. 
					for (var i = 0; i < that.openTabs.length; i++) { // Try out all open tabs for a request to service. 
						var t = that.openTabs[that.openTabs.nextToProcess];
						if (t.requests.length > 0) {
							url = t.requests[t.requests.length - 1]; // Found one! 
							tId = t.tId;
							break;
						}
						else that.openTabs.nextToProcess = (that.openTabs.nextToProcess + 1) % that.openTabs.length; // Look further.
					}
				}
				
				if(url == null) {	// If STILL no request found.
					// TODO: turn this into pre-computing
					setTimeout(function(){loop();}, 100);	// Wait a bit and try again
					return;
				}
//				detailsPage.document.write('Servicing: ' + url + '. <br>');
				
				// 4.2. Service the request.
				// =========================
				var pg = that.recentPages[url];
				var sendResults = function(pg, tId) {
					chrome.tabs.sendRequest(tId, {
						type:'result', 
						url:pg.url, 
						scores:pg.mmrScores,
						randomSuggestions:pg.randomSuggestions,
					});
				}
				switch(pg.state){
					case 'computingTfidfScores':
       					that.computeTfidfScoresBatched(pg, function(done){
							if (done) {
								pg.tfidfScores = pg.tfidfScores.sort(function(a, b){
									return b.score - a.score
								});
								pg.tfidfScores.splice(that.nMoreResultsShown, pg.tfidfScores.length - that.nMoreResultsShown); // Only keep top results.
								pg.state = 'computingMmrScores';
							} else pg.nextBatch++;
							loop();
						});
						break;
						
					case 'computingMmrScores':
						that.computeMMRScores(pg, function(){
							pg.duration = ((new Date()).getTime() - pg.startTime) / 1000;
							detailsPage.document.write(pg.duration.toFixed(3) + ': ' + pg.url + "<br>");

							pg.state = 'ready';
							sendResults(pg, tId);
							removeRequest(pg, tId);
							loop();
						});
						break;
						
					case 'ready':
						sendResults(pg, tId);
						removeRequest(pg, tId);
						loop();
						break;
						
					case 'computingRandomSuggestions':
						that.computeRandomSuggestions(pg, function(){
							pg.state = 'ready';
							sendResults(pg, tId);
							removeRequest(pg, tId);
							loop();
						});
						break;
				}
			};
			loop(); 	// Actually start the loop.
		});
	},
	
	extractPageParts: function(node, pageParts){
		var rest = "";
		for (var i = 0, l = node.childNodes.length; i < l; i++) {
			var child = node.childNodes[i];
			if (structureNodes[child.nodeName] == 1) this.extractPageParts(child, pageParts);
			else
				if (child.nodeName == "#text") rest += child.nodeValue + " ";
				else if (child.innerText != null) rest += child.innerText + " ";
		}
		if (rest != "") pageParts.push(rest);
		return pageParts;
	},
	
	/*
	 * 	Adds tfs, tfidf=[] to the page in place.
	 */
	computeTfsDfs: function(page, body){
		var textGeneral = this.extractPageParts(body, new Array());
		var textSpecific = new Array();
		var tfsGeneral = new Array();
		var tfsSpecific = new Array();
		var specific = false;
		
		// Compute the parts.
		for (var i = 0; i < textGeneral.length; i++) {
			var words = textGeneral[i].toLowerCase().match(/[a-z]+/g);
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
				textSpecific.push(textGeneral[i]);
			}
			delete part;
		}

		this.nrProcessed++;
		
		var tfs, text;
		if (specific) { tfs = tfsSpecific; text = textSpecific; } 
		else { tfs = tfsGeneral; text = textGeneral; }
		page.tfs = tfs;
		page.tfidf = new Array();
		page.text = text;
	},

	updateLogIdfs: function() {
        for(var word in this.dfs) 
        	this.logIdfs[word] = Math.log(this.nrProcessed / this.dfs[word]) / Math.LN2;
	},

	updateTfidfs: function(firstBatch, callback) {
        this.updateTfidfsBatched(firstBatch, callback);
	},
        
	updateTfidfsBatched: function(batch, callback) {
    	var that = this;
        this.store.getTfsBatch(batch, function(pageBatch) {
        	if(pageBatch.length == 0) { callback(); return; }
                        
			var startI = Math.max(0, that.lastComputedTfidfs - batch * that.batchSize);
			var updatedPageBatch = new Array();
            for (var i = startI; i < pageBatch.length; i++) {
				that.computeShortTfidf(pageBatch[i]);
				updatedPageBatch.push(pageBatch[i]);
			}
			that.lastComputedTfidfs = batch * that.batchSize + pageBatch.length;
            that.store.storeAllTfidfs(updatedPageBatch, that, function() {
				delete pageBatch;
				delete updatedPageBatch;
                // LOOP
                that.updateTfidfsBatched(batch+1, callback);
			});
		});
	},

	/*
	 * Updates the page in place with tfidf.
	 */
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
			if(v[word] >= 1.5 * avg) l += v[word]*v[word];
			else delete v[word];
		}
		l = Math.sqrt(l);
		
		// Normalize
		for (var word in v) v[word] /= l;
		
		page.tfidf = v; 
	},

	/*
	 * @return 	true if done with all batches, false otherwise.
	 * 			Updates the page in place with tfidfScores for the current batch. 
	 */
	computeTfidfScoresBatched: function(page, callback){
		var that = this;

        // Compute tfidf scores for the current page
        this.store.getTfidfBatch(page.nextBatch, function(pageBatch){
        	if (pageBatch.length == 0) { callback(true); return; }

			var v1 = page.tfidf;
            for (var i = 0; i < pageBatch.length; i++) {
            	if (!page.blockedURLs[pageBatch[i].url]) {
                	var v2 = pageBatch[i].tfidf, s = 0;
                	for(var word in v1)
                    	if (typeof(v2[word]) == 'number') s += v1[word] * v2[word];
					if (s > that.treshholdResultsShown)	// Only keep results with high enough score.
						page.tfidfScores.push({score: s, url:pageBatch[i].url, title:pageBatch[i].title});
				}
			}

        	delete pageBatch;
			callback(false);	// Returns whether or not we are done.
		});
	},
	
	/*
	 * Computes the Maximal Marginal Relevance ordering given by:
	 * MMR = max for Di in R\S of [l * Sim(Di,Q) - (1-l) * max for Dj in S of Sim(Di,Dj)];
	 * where R - retrieved, S - selected.
	 * 
	 * 	Updates the page in place with mmrScores. 	
	 */
	computeMMRScores: function(page, callback) {
		var that = this;
		
		page.mmrScores = new Array();
		if(page.tfidfScores.length == 0) { callback(); return; }

		var lambda = 1 - 2/3 * page.tfidfScores[Math.min(page.tfidfScores.length, this.nTopResultsShown)-1].score;
		var urls = new Array();
		for(var i=0; i<page.tfidfScores.length; i++) urls.push(page.tfidfScores[i].url);	
		this.store.getTfidfAndTextForURLs(urls, function(tfidfs) {
			// Tag tfidfs with score. 
			var s = new Array();
			for(var i=0; i<urls.length; i++) s[page.tfidfScores[i].url] = page.tfidfScores[i].score;
			for(var i=0; i<tfidfs.length; i++) tfidfs[i].score = s[tfidfs[i].url];
			delete s; 
			
			// Compute MMR ordering.
			for(var i=0; i<tfidfs.length; i++) {
				var mmrMax = - Number.MAX_VALUE, mmr;
				var mmrMaxPage;
				for(var j=0; j<tfidfs.length; j++)	// For Dj in R\S
					if(!tfidfs[j].inS) {
						mmr = lambda * tfidfs[j].score;
						
						var simMax = 0;
						var v1 = tfidfs[j].tfidf;
						for(var k=0; k<i; k++) {	// For Dk in S
							var v2 = tfidfs[page.mmrScores[k].pageIdx].tfidf, s = 0;
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
				
				
				var suggestionPage = tfidfs[mmrMaxPage];
				var suggestion = {
					score: suggestionPage.score, 
					url:suggestionPage.url, 
					title:suggestionPage.title,
					summary:that.computeSummaryText(page, suggestionPage),
					pageIdx:mmrMaxPage,
				};
				page.mmrScores.push(suggestion);
				suggestionPage.inS = true;
			}
			
			callback();	
		});
	},
	
	computeTfidfFromString: function(s, normalize) {
		var tfidf = new Array();
		var words = s.toLowerCase().match(/[a-z]+/g);
		if ((words == null) || (words.length == 0)) return tfidf;

		// Compute tfs
		var tfs = new Array();		
		for (var j = 0; j < words.length; j++) {
			var word = stemmer(words[j]);
			if (stopwords[word] != 1) 
				if (typeof(tfs[word]) != 'number') tfs[word] = 1;
				else tfs[word]++;
		}

		// Compute tf-idf
		var l = 0;
		for (var word in tfs) {
			tfidf[word] = tfs[word] * Math.log(this.nrProcessed / (this.dfs[word] + 1)) / Math.LN2;
			l += tfidf[word] * tfidf[word];
		}
		l = Math.sqrt(l);
		
		// Normalize
		if ((normalize) && (l != 0)) for (var word in tfidf) tfidf[word] /= l;
		
		return tfidf;
	},
	
	computeSummaryText: function(page, suggestion) {
		var sentenceScoresQ  = new Array(), sentenceScoresD = new Array(), 
			sentenceScoresC = new Array();
		for(var i=0; i<suggestion.text.length; i++) {
			var t = suggestion.text[i];
			var sentences = t.split(/[\056;!?]/);
			for(var j=0; j<sentences.length; j++) {
				var sentence = sentences[j].slice(0, 135);
				var v = this.computeTfidfFromString(sentence, false);
				// Similarity to query.
				var v2 = page.tfidf;
				var sQ = 0;
				for (var word in v) 
					if (typeof(v2[word]) == 'number') 
						sQ += v[word] * v2[word];
				// Similarity to document.
				var v2 = suggestion.tfidf;
				var sD = 0;
				for (var word in v) 
					if (typeof(v2[word]) == 'number') 
						sD += v[word] * v2[word];
				// Combined Similarity
				sentenceScoresC.push({
					sentence: sentence,
					score: 0.7 * sQ + 0.3 * sD,
				});
			}
		}
		sentenceScoresC.sort(function(a, b){ return b.score - a.score });

//		detailsPage.document.write('<br>Summaries: <br>');
//		for(var i=0; (i<2) && (i<sentenceScoresC.length); i++)
//			detailsPage.document.write(sentenceScoresC[i].score.toFixed(3) + ': ' + sentenceScoresC[i].sentence + '<br>');
//		detailsPage.document.write("<br><br>");

		return sentenceScoresC[0].sentence;
	},
	
	adjustQuery: function(query, positive, negative, feedbackParams){
		var v1 = query;
		var v2 = positive;
		// Compute the centroid of the negative feedback vectors.
		var v3 = new Array();
		if (negative.length != 0) {
			for (var i = 0; i < negative.length; i++) 
				v3 = addArrays(v3, negative[i]);
			v3 = scaleArray(v3, 1 / negative.length);
		}
		
		// Compute a*v1 + b*v2 + c*v3, where c is usually negative.
		v1 = scaleArray(v1, feedbackParams[0]);
		v2 = scaleArray(v2, feedbackParams[1]);
		v3 = scaleArray(v3, feedbackParams[2]);
		var v = addArrays(addArrays(v1, v2), v3);
		
		// Apply feature seletion to obtain short vector - we treat positive and negative values differently.
		var avgP = 0, avgM = 0, nP = 0, nM = 0;
		for (var word in v) 
			if (v[word] > 0) { avgP += v[word]; nP++; }
			else { avgM += v[word]; nM++; }
		avgP /= nP; avgM /= nM;
		
		var l = 0;
		for (var word in v) {
			if ((v[word] >= avgP) || (v[word] <= avgM)) l += v[word] * v[word];  
			else delete v[word];
		}
		l = Math.sqrt(l);
		
		// Normalize
		for (var word in v) v[word] /= l;
		
		return v;
	},

	/*
	 * @return	The new page, containing url, title, tfidf.
	 */
	computeMoreLikeThisPage: function(url, clickedURL, callback) {
		var that = this;
		var pg = this.recentPages[url];
		var otherSeenURLs = new Array();		// TODO: This is UI dependent, move to inContextWindow!
		var i=0, found = false;
		while (((i<pg.mmrScores.length) && (i < that.nTopResultsShown)) || (!found)) {
			if (pg.mmrScores[i].url == clickedURL) found = true; 
			else otherSeenURLs.push(pg.mmrScores[i].url);
			i++;
		}
		
		that.store.getTfidf(clickedURL, function(clickedTfidf) {
			that.store.getTfidfForURLs(otherSeenURLs, function(otherSeenTfidfs) {
				var query = pg.tfidf;
				var positive = clickedTfidf.tfidf;
				var negative = new Array();
				for (var i = 0; i < otherSeenTfidfs.length; i++) 
					negative.push(otherSeenTfidfs[i].tfidf);
				var v = that.adjustQuery(query, positive, negative, that.feedbackParamsSimilarSuggestions);
				
				var page = {
					url: pg.url + " -> " + clickedURL,
					title: pg.title + " -> " + clickedTfidf.title,
					tfidf: v,
				};
				var blockedURLs = new Array();
				var urlParts = page.url.split(' -> ');
				for(var i=0; i<urlParts.length; i++)							
					if(urlParts[i].substr(0, protocol.length) == protocol)		// Block URLs:
						blockedURLs[urlParts[i]] = true;						// * on the path.
				for(var i=0; i<otherSeenURLs.length; i++)						// * seen one step before.
					blockedURLs[otherSeenURLs[i]] = true;						  
				page.blockedURLs = blockedURLs;
							
				callback(page);
			});
		});
	},
	
	/*
	 * @return	The new page, containing url, title, tfidf.
	 */
	computeSearchQueryPage: function(url, q) {
		var that = this;
		var pg = this.recentPages[url];
				
		var query = pg.tfidf;
		var positive = this.computeTfidfFromString(q, true);
		var negative = new Array();
		var v = this.adjustQuery(query, positive, negative, this.feedbackParamsSearchBoxQuery);
		
		var page = {
			url: pg.url + " -> " + q,
			title: pg.title + " -> " + q,
			tfidf: v
		};
		var blockedURLs = new Array();
		var urlParts = page.url.split(' -> ');
		for(var i=0; i<urlParts.length; i++)
			if(urlParts[i].substr(0, protocol.length) == protocol)
				blockedURLs[urlParts[i]] = true;
		page.blockedURLs = blockedURLs;

		return page;
	},

	computeRandomSuggestions: function(page, callback) {
		var that = this;
		
		this.store.numberStoredPages(function(numberStoredPages){
			var randomPageNumbers = new Array();
			for(var i=0; i<20;) {
				var r = Math.floor(Math.random()*numberStoredPages);
				if(!randomPageNumbers[r]) {	// If not already chosen.
					randomPageNumbers[r] = true;
					i++;
				}
			}
			var pageNumbers = new Array();
			for(var r in randomPageNumbers) pageNumbers.push(r);
			
			that.store.getTfidfAndTextForPageNumbers(pageNumbers, function(randomPages) {
				page.mmrScores = new Array();
				for (var i = 0; i < randomPages.length; i++) {
					var randomPage = randomPages[i];
					var suggestion = {
						url: randomPage.url,
						title: randomPage.title,
						summary: that.computeSummaryText(page, randomPage),
					};
					page.mmrScores.push(suggestion);
				}
				
				// Wait for 10s before returning suggestions, to seem realistic.
				setTimeout(callback, 100);		// TODO: Change to 10000
			});
		});
	},
};