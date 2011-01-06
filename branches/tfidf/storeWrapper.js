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
		
		// Parameter keys
		this.keyLastProcessedHistoryEntry = "lastProcessedHistoryEntry";
		this.keyNrProcessed = "nrProcessed";
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
		var that = this;
		
		var sql = "SELECT * FROM " + this.paramTable;
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result) {
				for(var i=0; i<result.rows.length; i++) {
					var row = result.rows.item(i);
					switch(row.key) {
						case that.keyLastProcessedHistoryEntry:
							history.lastProcessedHistoryEntry = parseFloat(row.value);
							break;
						case that.keyNrProcessed:
							history.nrProcessed = parseInt(row.value);
							break;
						case that.keyDfs:
							history.dfs = parseIntArray(row.value);
					}
				}
				callback();	
			});
		});
	},
	
	storeParams: function(history, callback) {
		var sql = "REPLACE INTO " + this.paramTable + 
			" SELECT \"" + this.keyLastProcessedHistoryEntry + "\", \"" + history.lastProcessedHistoryEntry + "\" UNION " +
			" SELECT \"" + this.keyNrProcessed + "\", \"" + history.nrProcessed + "\" UNION " +
			" SELECT \"" + this.keyDfs + "\", \"" + serializeIntArray(history.dfs) + "\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result) {
				callback();
			});
		});
	},
	
	getTfidfPage: function(page, callback) {
		var that = this;
		
		var offset = that.perPage * page ;
		var sql = "SELECT * FROM " + that.tfidfTable + " ASC LIMIT ? OFFSET ?";
		this.db.transaction(function(t) {
		    t.executeSql(sql, [that.perPage, offset], function(tx, results) {
				var tfidfPage = new Array();
				for (var i = 0, l = results.rows.length; i < l; i++) {
					var row = results.rows.item(i);
					tfidfPage[row.url] = {vector:parseFloatArray(row.vector), length:row.length};
					tfidfPage.length++;
				}
				callback(tfidfPage);
			});
		});
	},
	
	storeTfidf: function(history, url, callback) {
		var that = this;
			
		// Add the tf-idf score.
		var sql = "REPLACE INTO " + this.tfidfTable + 
			" VALUES (\"" + url + "\", \"" + serializeFloatArray(history.tfidf[url].vector, 4) + "\", " +
				history.tfidf[url].length + ")";
				
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result) {
				// Also update the parameters.
				that.storeParams(history, function() {
					callback();
				});
			});
		});
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