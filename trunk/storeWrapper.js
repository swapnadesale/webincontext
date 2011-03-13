var StoreWrapper = function(opts) {
        this.init(opts);
};

StoreWrapper.prototype = {
	init: function(opts){
		var that = this;
		
		// Default properties.
		this.name = merge('MyStore2', opts.name);
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
		
		var sql = "SELECT * FROM " + this.paramTable;
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result){
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
				log += error.message + "<br>";
			});
		});
	},
	
	storeParams: function(history, callback){
		var sql = "REPLACE INTO " + this.paramTable + 
			" SELECT \"" + this.keyLastProcessedHistoryEntry + "\", \"" + history.lastProcessedHistoryEntry + "\" UNION " +
			" SELECT \"" + this.keyNrProcessed + "\", \"" + history.nrProcessed + "\" UNION " +
			" SELECT \"" + this.keyDfs + "\", \"" + serializeIntArray(history.dfs) + "\" UNION " + 
			" SELECT \"" + this.keyLastComputedTfidfs + "\", \"" + history.lastComputedTfidfs + "\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result){
				callback();
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	getAllURLs: function(callback){
		var sql = "SELECT url FROM " + this.pagesTable;
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, results){
				var urls = new Array();
				for (var i = 0; i < results.rows.length; i++) 
					urls.push(results.rows.item(i).url);
				callback(urls);
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	getPage: function(url, callback) {
		var that = this;
		var sql = "SELECT * FROM " + that.pagesTable + " WHERE url=\"" + url + "\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, results){
				callback(that.parsePageResults(results)[0]);
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});

	},
	
	getTfidf: function(url, callback) {
		var that = this;
		var sql = "SELECT url, title, tfidf FROM " + that.pagesTable + " WHERE url=\"" + url + "\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, results){
				callback(that.parseTfidfResults(results)[0]);
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});

	},
	
	getPagesBatch: function(batch, callback){
		var that = this;
		var offset = that.batchSize * batch;
		var sql = "SELECT * FROM " + that.pagesTable + " ASC LIMIT ? OFFSET ?";
		this.db.transaction(function(t){
			t.executeSql(sql, [that.batchSize, offset], function(tx, results){
				callback(that.parsePageResults(results));
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	getTfidfBatch: function(batch, callback){
		var that = this;
		var offset = that.batchSize * batch;
		var sql = "SELECT url, title, tfidf FROM " + that.pagesTable + " ASC LIMIT ? OFFSET ?";
		this.db.transaction(function(t){
			t.executeSql(sql, [that.batchSize, offset], function(tx, results){
				callback(that.parseTfidfResults(results));
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	}, 
	
	getTfidfForURLs: function(urls, callback) {
		var that = this;
		var sql = "";
		for(var i=0; i<urls.length; i++)
			sql += "SELECT url, title, tfidf FROM " + that.pagesTable + 
				" WHERE url=\"" + urls[i] + "\" UNION ";
		sql = sql.substring(0, sql.length - 6); // Take out the last UNION.
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, results){
				callback(that.parseTfidfResults(results));
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},

	storePage: function(page, callback){
		var sql = "REPLACE INTO " + this.pagesTable + " VALUES (" + this.serializePage(page) + ")";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result){
				callback();
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	storeAllPages: function(pages, callback){
		var sql = "REPLACE INTO " + this.pagesTable + " ";
		var empty = true;
		for (var i=0; i<pages.length; i++) {
			sql += "SELECT " + this.serializePage(pages[i]) + " UNION ";
			empty = false;
		}
		if (empty) { callback(); return; }
		sql = sql.substring(0, sql.length - 6); // Take out the last UNION.
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result){
				callback();
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	serializePage: function(page) {
		return "\"" + page.url + "\", \"" + escape(page.title) + "\", \"" + 
			serializeIntArray(page.tfs) + "\", \"" + 
			serializeFloatArray(page.tfidf, 3) + "\"";
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
	
	parseTfidfResults: function(results){
		var pageBatch = new Array();
		for (var i = 0; i < results.rows.length; i++) {
			var row = results.rows.item(i);
			pageBatch.push({url:row.url, title:unescape(row.title), 
				tfidf:parseFloatArray(row.tfidf)});
		}
		return pageBatch;
	},

};