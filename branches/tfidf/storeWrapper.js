var StoreWrapper = function(opts) {
	this.init(opts);
};

StoreWrapper.prototype = {
	init: function(opts){
		var that = this;
		
		// Default properties.
		this.name = merge('MyStore', opts.name);
		this.version = merge('2.0', opts.version);
		this.display = merge('Store', opts.display);
		this.max = merge(65536, opts.max);
		
		this.paramTable = merge('paramTable', opts.paramTable);
		this.tfidfTable = merge('tfidfTable', opts.mainTable);
		this.perPage = merge(10, opts.perPage);
		this.maxVectorLength = merge(2500000, opts.maxVectorLength);
		
		// Default sqlite callbacks.
		this.onError = function(){};
		this.onData = function(){};
		
		// Parameter keys
		this.keyLastProcessedHistoryEntry = "lastProcessedHistoryEntry";
		this.keyNrEntries = "nrEntries";
		this.keyDfs = "dfs"

		// instantiate the store
		this.db = openDatabase(this.name, this.version, this.display, this.max);
		
		// create the tables, if not already existing.
		this.db.transaction(function(t){
			t.executeSql("CREATE TABLE " + that.paramTable + " (key CHAR(20), value CHAR(" + that.maxVectorLength + "), PRIMARY KEY (key))");
		});
		this.db.transaction(function(t){
			t.executeSql("CREATE TABLE " + that.tfidfTable + " (url CHAR(4098), vector CHAR(" + that.maxVectorLength + "), length FLOAT, PRIMARY KEY (url))");
		});
	},
	
	loadParams: function(history, callback) {
		// TODO
		callback();
	},
	
	storeParams: function(history, callback) {
		var sql = "REPLACE INTO " + this.paramTable + 
			" SELECT \"" + this.keyLastProcessedHistoryEntry + "\", \"" + history.lastProcessedHistoryEntry + "\" UNION " +
			" SELECT \"" + this.keyNrEntries + "\", \"" + history.nrEntries + "\" UNION " +
			" SELECT \"" + this.dfs + "\", \"" + serializeIntArray(history.dfs) + "\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function() {
				callback();
			});
		});
	},
	
	loadTfidfPage: function(history, page, callback) {
		
	},
	
	storeTfidf: function(history, url, callback) {
		
	},
	
	storeAllTfidfs: function(history, callback) {
		var that = this;
		
		// Add all the tf-idf scores.
		var sql = "REPLACE INTO " + this.tfidfTable + " ";
		for(var url in history.tfidf) {
			sql += "SELECT \"" + url + "\", \"" + serializeFloatArray(history.tfidf[url].vector, 4) + "\", " +
				history.tfidf[url].length + " UNION ";
		}
		sql = sql.substring(0, sql.length - 1 - 6);	// Take out the last UNION.
		
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result) {
					// Also update the parameters.
					that.storeParams(history, function() {
						callback();
					});
				});
		});
	}
};