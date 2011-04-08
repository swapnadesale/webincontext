var StoreWrapper = function(opts) {
        this.init(opts);
};

StoreWrapper.prototype = {
	init: function(opts){
		var that = this;
		
		// Default properties.
		this.name = merge('Store', opts.name);
		this.version = merge('1.0', opts.version);
		this.display = merge('Store', opts.display);
		this.max = merge(512 * 1024 * 1024, opts.max);

		this.paramTable = merge('paramTable', opts.paramTable);
		this.pagesTable = merge('pagesTable', opts.pagesTable);
		this.logTable = merge('logTable', opts.logTable);
		this.batchSize = merge(500, opts.batchSize);
		this.maxVectorLength = merge(2500000, opts.maxVectorLength);
		this.maxTextLength = merge(5000000, opts.maxVectorLength);
		
		// Parameter keys
		this.keyLastProcessedHistoryEntry = "lastProcessedHistoryEntry";
		this.keyNrProcessed = "nrProcessed";
		this.keyDfs = "dfs"
		this.keyLastComputedTfidfs = "lastComputedTfidfs";
		this.keySessionID = "sessionID";
		
		// instantiate the store
		this.db = openDatabase(this.name, this.version, this.display, this.max);
		
		// create the tables, if not already existing.
		this.db.transaction(function(t){
			t.executeSql("CREATE TABLE " + that.paramTable + " (key CHAR(20), value CHAR(" + that.maxVectorLength + "), PRIMARY KEY (key))");
		});
		this.db.transaction(function(t){
			t.executeSql("CREATE TABLE " + that.pagesTable + " (url CHAR(4098), title CHAR(4098), " + 
			"tfs CHAR(" + that.maxVectorLength + "), " +
			"tfidf CHAR(" + that.maxVectorLength + "), " + 
			"text CHAR(" + that.maxTextLength + "), PRIMARY KEY (url))");
		});
		this.db.transaction(function(t){
			t.executeSql("CREATE TABLE " + that.logTable + " (entry CHAR(400))");
		});
	},
	
	loadParams: function(history, callback){
		var that = this;
		
		this.db.transaction(function(t){
			t.executeSql("SELECT * FROM " + that.paramTable, [], function(tx, result){
				for (var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					switch (row.key) {
						case that.keyLastProcessedHistoryEntry:
							history.lastProcessedHistoryEntry = parseFloat(row.value);
							break;
						case that.keyNrProcessed:
							history.nrProcessed = parseInt(row.value);
							break;
						case that.keyDfs:
							history.dfs = parseIntArray(row.value);
							break;
						case that.keyLastComputedTfidfs:
							history.lastComputedTfidfs = parseFloat(row.value);
							break;
						case that.keySessionID:
							history.sessionID = parseInt(row.value);
							break;
					}
				}
				callback();
			}, function(tx, error){
				detailsPage.document.write('Error in loadParams: ' + error.message + "<br>");
			});
		});
	},
	
	storeParams: function(history, callback){
		var that = this;
		this.db.transaction(function(t){
			t.executeSql('REPLACE INTO ' + that.paramTable + ' VALUES( ? , ? )', [that.keyLastProcessedHistoryEntry, history.lastProcessedHistoryEntry], 
				function() {}, function() { detailsPage.document.write('Error in storeParams - lastProcessedHistoryEntry: ' + error.message + "<br>"); });
				
			t.executeSql('REPLACE INTO ' + that.paramTable + ' VALUES( ? , ? )', [that.keyNrProcessed, history.nrProcessed], 
				function() {}, function() { detailsPage.document.write('Error in storeParams - nrProcessed: ' + error.message + "<br>"); });
				
			t.executeSql('REPLACE INTO ' + that.paramTable + ' VALUES( ? , ? )', [that.keyDfs, serializeIntArray(history.dfs)], 
				function() {}, function() { detailsPage.document.write('Error in storeParams - dfs: ' + error.message + "<br>"); });
				
			t.executeSql('REPLACE INTO ' + that.paramTable + ' VALUES( ? , ? )', [that.keyLastComputedTfidfs, history.lastComputedTfidfs], 
				function() {}, function() { detailsPage.document.write('Error in storeParams - lastComputedTfidfs: ' + error.message + "<br>"); });
		}, function(error){ 
			detailsPage.document.write('Error in storeParams:' + error.message + "<br>"); 
		}, callback);
	},
	
	storeSessionID: function(sessionID) {
		var that = this;
		this.db.transaction(function(t){
			t.executeSql('REPLACE INTO ' + that.paramTable + ' VALUES( ? , ? )', [that.keySessionID, sessionID], function() {}, function() { 
				detailsPage.document.write('Error in storeSessionID: ' + error.message + "<br>"); 
			});
		});
	},
	
	/*
	 * @return	{url, tfs}
	 */
	getTfsBatch: function(batch, callback){
		var that = this;
		var offset = that.batchSize * batch;
		this.db.transaction(function(t){
			t.executeSql("SELECT url, tfs FROM " + that.pagesTable + " ASC LIMIT ? OFFSET ?", [that.batchSize, offset], function(tx, results){
				callback(that.parseTfsResults(results));
			}, function(tx, error){
				detailsPage.document.write('Error in getPagesBatch: ' + error.message + "<br>");
			});
		});
	},
	
	/*
	 * @return	{url, title, tfidf}
	 */
	getTfidf: function(url, callback) {
		var that = this;
		this.db.transaction(function(t){
			t.executeSql("SELECT url, title, tfidf FROM " + that.pagesTable + " WHERE url= ? ", [url], function(tx, results){
				callback(that.parseTfidfResults(results)[0]);
			}, function(tx, error){
				detailsPage.document.write('Error in getTfidf: ' + error.message + "<br>");
			});
		});

	},
	
	/*
	 * @return	{url, title, tfidf}
	 */
	getTfidfBatch: function(batch, callback){
		var that = this;
		var offset = that.batchSize * batch;
		this.db.transaction(function(t){
			t.executeSql("SELECT url, title, tfidf FROM " + that.pagesTable + " ASC LIMIT ? OFFSET ?", [that.batchSize, offset], function(tx, results){
				callback(that.parseTfidfResults(results));
			}, function(tx, error){
				detailsPage.document.write('Error in getTfidfBatch: ' + error.message + "<br>");
			});
		});
	}, 
	
	/*
	 * @return	{url, title, tfidf}
	 */
	getTfidfForURLs: function(urls, callback) {
		var that = this;
		var pages = new Array();
		this.db.transaction(function(t){
			for (var i = 0; i < urls.length; i++) {
				t.executeSql("SELECT url, title, tfidf FROM " + that.pagesTable + " WHERE url= ? ", [urls[i]], 
					function(tx, results){
						pages.push(that.parseTfidfResult(results.rows.item(0)));
					},
					function(tx, error) {
						detailsPage.document.write('Error in getTfidfForURLs - url: ' + urls[i] + " - " + error.message + "<br>");
					});
			}
		}, function(error){
			detailsPage.document.write('Error in getTfidfForURLs: ' + error.message + "<br>");
		}, function() { callback(pages); });
	},

	/*
	 * @return	{url, title, tfidf, text}
	 */
	getTfidfAndTextForURLs: function(urls, callback) {
		var that = this;
		var pages = new Array();
		this.db.transaction(function(t){
			for (var i = 0; i < urls.length; i++) {
				t.executeSql("SELECT url, title, tfidf, text FROM " + that.pagesTable + " WHERE url= ? ", [urls[i]], 
					function(tx, results){
						pages.push(that.parseTfidfAndTextResult(results.rows.item(0)));
					},
					function(tx, error) {
						detailsPage.document.write('Error in getTfidfAndTextForURLs - url: ' + urls[i] + " - " + error.message + "<br>");
					});
			}
		}, function(error){
			detailsPage.document.write('Error in getTfidfAndTextForURLs: ' + error.message + "<br>");
		}, function() { callback(pages); });
	},

	/*
	 * Replaces the entire page with the new value.
	 */
	storePage: function(page, history, callback){
		var that = this;
		this.db.transaction(function(t){
			t.executeSql("REPLACE INTO " + that.pagesTable + " VALUES (?, ?, ?, ?, ?)", 
				[page.url, escape(page.title), serializeIntArray(page.tfs), serializeFloatArray(page.tfidf, 3), that.serializePageText(page.text)], 
				function(tx, result){
					that.storeParams(history, callback);
				}, 
				function(tx, error) {
					detailsPage.document.write('Error in storePage: ' + error.message + "<br>");
				});
		});
	},

	/*
	 * Replaces the entire page with the new value.
	 */
	storeAllPages: function(pages, history, callback){
		var that = this;
		this.db.transaction(function(t){
			for (var i = 0; i < pages.length; i++) {
				var page = pages[i];
				t.executeSql("REPLACE INTO " + that.pagesTable + " VALUES (?, ?, ?, ?, ?)", 
					[page.url, escape(page.title), serializeIntArray(page.tfs), serializeFloatArray(page.tfidf, 3), that.serializePageText(page.text)], function() {}, 
					function(){
						detailsPage.document.write('Error in storeAllPages - url: ' + page.url + " - " + error.message + "<br>");	
					});
			}
		}, function() {
			detailsPage.document.write('Error in storeAllPages: ' + error.message + "<br>");
		}, function() {
			that.storeParams(history, callback);
		});
	},
	
	/*
	 * Updates the tfidfs in place.
	 */
	storeAllTfidfs: function(pages, history, callback) {
		var that = this;
		this.db.transaction(function(t){
			for (var i = 0; i < pages.length; i++) {
				var page = pages[i];
				t.executeSql("UPDATE " + that.pagesTable + " SET tfidf=? WHERE url=?", [serializeFloatArray(page.tfidf, 3), page.url], function() {}, 
					function(){
						detailsPage.document.write('Error in storeAllTfidfs - url: ' + page.url + " - " + error.message + "<br>");	
					});
			}
		}, function() {
			detailsPage.document.write('Error in storeAllTfidfs: ' + error.message + "<br>");
		}, function() {
			that.storeParams(history, callback);
		});
	},
	
	serializePageText: function(text) {
		var s = '';
		for(var i=0; i<text.length; i++) s += escape(text[i]) + ', ';
		s = s.substr(0, s.length - 2);
		return s;
	},
	
	parsePageText: function(s) {
		var text = s.split(', ');
		for(var i=0; i<text.length; i++) text[i] = unescape(text[i]);
		return text;
	},
	
	parseTfsResults: function(results){
		var pageBatch = new Array();
		for (var i = 0; i < results.rows.length; i++) {
			var row = results.rows.item(i);
			pageBatch.push({url:row.url, tfs:parseIntArray(row.tfs)});
		}
		return pageBatch;
	},
	
	parseTfidfResult: function(row) {
		var page = {
			url:row.url, 
			title:unescape(row.title), 
			tfidf:parseFloatArray(row.tfidf)
		};
		return page;
	},
	
	parseTfidfAndTextResult: function(row) {
		var page = {
			url:row.url, 
			title:unescape(row.title), 
			tfidf:parseFloatArray(row.tfidf),
			text:this.parsePageText(row.text),
		};
		return page;
	},
	
	parseTfidfResults: function(results){
		var pageBatch = new Array();
		for (var i = 0; i < results.rows.length; i++) {
			pageBatch.push(this.parseTfidfResult(results.rows.item(i)));
		}
		return pageBatch;
	},
	
	/*
	 * User study - Instrumentation methods
	 * ====================================
	 */
	storeEvent: function(event) {
		var that = this;
		
		var s = event.eventID + ', ' + event.date + ', ' + event.time + ', ' + event.type + ', ';
		if(event.relatedID != null) s += event.relatedID;	s += ', ';
		if(event.nrSuggestions != null) s += event.nrSuggestions;	s += ', ';
		if(event.suggestionIdx != null) s += event.suggestionIdx;	s += ', ';
		if(event.ratings != null) s += event.ratings;	
		
		this.db.transaction(function(t){
			t.executeSql("INSERT INTO " + that.logTable + " VALUES (?)", [s], function(){}, function(tx, error) {
					detailsPage.document.write('Error in storeEvent: ' + error.message + "<br>");
				});
		});
	},
	
	numberStoredPages: function(callback) {
		var that = this;
		this.db.transaction(function(t){
			t.executeSql("SELECT COUNT(*) FROM " + that.pagesTable, [], function(tx, results){
					var n = results.rows.item(0)['COUNT(*)'];
					callback(n); 
				}, function(tx, error) {
					detailsPage.document.write('Error in numberStoredPages: ' + error.message + "<br>");
				});
		});
	},
	
	/*
	 * @return	{url, title, tfidf, text}
	 */
	getTfidfAndTextForPageNumbers: function(pageNumbers, callback) {
		var that = this;
		var pages = new Array();
		this.db.transaction(function(t){
			for (var i = 0; i < pageNumbers.length; i++) {
				t.executeSql("SELECT url, title, tfidf, text FROM " + that.pagesTable + " ASC LIMIT ? OFFSET ?", [1, pageNumbers[i]], 
					function(tx, results){
						pages.push(that.parseTfidfAndTextResult(results.rows.item(0)));
					},
					function(tx, error) {
						detailsPage.document.write('Error in getTfidfAndTextForPageNumbers - pageNumber: ' + pageNumbers[i] + " - " + error.message + "<br>");
					});
			}
		}, function(error){
			detailsPage.document.write('Error in getTfidfAndTextForPageNumbers: ' + error.message + "<br>");
		}, function() { callback(pages); });
	},
};