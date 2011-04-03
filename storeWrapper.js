var StoreWrapper = function(opts) {
        this.init(opts);
};

StoreWrapper.prototype = {
	init: function(opts){
		var that = this;
		
		// Default properties.
		this.name = merge('MyStore3', opts.name);
		this.version = merge('1.0', opts.version);
		this.display = merge('Store', opts.display);
		this.max = merge(512 * 1024 * 1024, opts.max);

		this.paramTable = merge('paramTable', opts.paramTable);
		this.pagesTable = merge('pagesTable', opts.pagesTable);
		this.batchSize = merge(500, opts.batchSize);
		this.maxVectorLength = merge(2500000, opts.maxVectorLength);
		
		// Parameter keys
		this.keyLastProcessedHistoryEntry = "lastProcessedHistoryEntry";
		this.keyNrProcessed = "nrProcessed";
		this.keyDfs = "dfs"
		this.keyLastComputedTfidfs = "lastComputedTfidfs";
		
		// instantiate the store
		this.db = openDatabase(this.name, this.version, this.display, this.max);
		
		// create the tables, if not already existing.
		this.db.transaction(function(t){
			t.executeSql("CREATE TABLE " + that.paramTable + " (key CHAR(20), value CHAR(" + that.maxVectorLength + "), PRIMARY KEY (key))");
		});
		this.db.transaction(function(t){
			t.executeSql("CREATE TABLE " + that.pagesTable + " (url CHAR(4098), title CHAR(4098), " + 
			"tfs CHAR(" + that.maxVectorLength + "), " +
			"tfidf CHAR(" + that.maxVectorLength + "), PRIMARY KEY (url))");
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
						case that.keyLastComputedTfidfs:
							history.lastComputedTfidfs = parseFloat(row.value);
					}
				}
				callback();
			}, function(tx, error){
				alert(error.message);
			});
		});
	},
	
	storeParams: function(history, callback){
		var that = this;
		this.db.transaction(function(t){
			t.executeSql('REPLACE INTO ' + that.paramTable + ' VALUES( ? , ? )', [that.keyLastProcessedHistoryEntry, history.lastProcessedHistoryEntry]);
			t.executeSql('REPLACE INTO ' + that.paramTable + ' VALUES( ? , ? )', [that.keyNrProcessed, history.nrProcessed]);
			t.executeSql('REPLACE INTO ' + that.paramTable + ' VALUES( ? , ? )', [that.keyDfs, serializeIntArray(history.dfs)]);
			t.executeSql('REPLACE INTO ' + that.paramTable + ' VALUES( ? , ? )', [that.keyLastComputedTfidfs, history.lastComputedTfidfs]);
		}, function(){ }, callback);
	},
	
	getAllURLs: function(callback){
		var that = this;
		this.db.transaction(function(t){
			t.executeSql("SELECT url FROM " + that.pagesTable, [], function(tx, results){
				var urls = new Array();
				for (var i = 0; i < results.rows.length; i++) 
					urls.push(results.rows.item(i).url);
				callback(urls);
			}, function(tx, error){
				alert(error.message);
			});
		});
	},
	
	getPage: function(url, callback) {
		var that = this;
		this.db.transaction(function(t){
			t.executeSql("SELECT * FROM " + that.pagesTable + " WHERE url= ? ", [url], function(tx, results){
				callback(that.parsePageResults(results)[0]);
			}, function(tx, error){
				alert(error.message);
			});
		});

	},
	
	getTfidf: function(url, callback) {
		var that = this;
		this.db.transaction(function(t){
			t.executeSql("SELECT url, title, tfidf FROM " + that.pagesTable + " WHERE url= ? ", [url], function(tx, results){
				callback(that.parseTfidfResults(results)[0]);
			}, function(tx, error){
				alert(error.message);
			});
		});

	},
	
	getPagesBatch: function(batch, callback){
		var that = this;
		var offset = that.batchSize * batch;
		this.db.transaction(function(t){
			t.executeSql("SELECT * FROM " + that.pagesTable + " ASC LIMIT ? OFFSET ?", [that.batchSize, offset], function(tx, results){
				callback(that.parsePageResults(results));
			}, function(tx, error){
				alert(error.message);
			});
		});
	},
	
	getTfidfBatch: function(batch, callback){
		var that = this;
		var offset = that.batchSize * batch;
		this.db.transaction(function(t){
			t.executeSql("SELECT url, title, tfidf FROM " + that.pagesTable + " ASC LIMIT ? OFFSET ?", [that.batchSize, offset], function(tx, results){
				callback(that.parseTfidfResults(results));
			}, function(tx, error){
				alert(error.message);
			});
		});
	}, 
	
	getTfidfForURLs: function(urls, callback) {
		var that = this;
		var pages = new Array();
		this.db.transaction(function(t){
			for (var i = 0; i < urls.length; i++) {
				t.executeSql("SELECT url, title, tfidf FROM " + that.pagesTable + " WHERE url= ? ", [urls[i]], function(tx, results){
					pages.push(that.parseTfidfResult(results.rows.item(0)));
				});
			}
		}, function(){}, function() { callback(pages); });
	},

	storePage: function(page, history, callback){
		var that = this;
		this.db.transaction(function(t){
			t.executeSql("REPLACE INTO " + that.pagesTable + " VALUES (?, ?, ?, ?)", 
				[page.url, escape(page.title), serializeIntArray(page.tfs), serializeFloatArray(page.tfidf, 3)], function(tx, result){
				that.storeParams(history, callback);
			});
		});
	},
	
	storeAllPages: function(pages, history, callback){
		var that = this;
		this.db.transaction(function(t){
			for (var i = 0; i < pages.length; i++) {
				var page = pages[i];
				t.executeSql("REPLACE INTO " + that.pagesTable + " VALUES (?, ?, ?, ?)", [page.url, escape(page.title), serializeIntArray(page.tfs), serializeFloatArray(page.tfidf, 3)]);
			}
		}, function() {}, function() {
			that.storeParams(history, callback);
		});
	},
	
	storeAllTfidfs: function(pages, history, callback) {
		var that = this;
		this.db.transaction(function(t){
			for (var i = 0; i < pages.length; i++) {
				var page = pages[i];
				t.executeSql("UPDATE " + that.pagesTable + " SET tfidf=? WHERE url=?", [serializeFloatArray(page.tfidf, 3), page.url]);
			}
		}, function() {}, function() {
			that.storeParams(history, callback);
		});
	},
	
	parsePageResults: function(results){
		var pageBatch = new Array();
		for (var i = 0; i < results.rows.length; i++) {
			var row = results.rows.item(i);
			pageBatch.push({url:row.url, title:unescape(row.title), tfs:parseIntArray(row.tfs), 
				tfidf:parseFloatArray(row.tfidf)});
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
	
	parseTfidfResults: function(results){
		var pageBatch = new Array();
		for (var i = 0; i < results.rows.length; i++) {
			pageBatch.push(this.parseTfidfResult(results.rows.item(i)));
		}
		return pageBatch;
	},
};