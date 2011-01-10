var StoreWrapper = function(opts) {
	this.init(opts);
};

StoreWrapper.prototype = {
	init: function(opts){
		var that = this;
		
		// Default properties.
		this.name = merge('MyStoreParts', opts.name);
		this.version = merge('2.0', opts.version);
		this.display = merge('Store', opts.display);
		this.max = merge(512*1024*1024, opts.max);
		
		this.paramTable = merge('paramTable', opts.paramTable);
		this.tfidfTable = merge('tfidfTable', opts.mainTable);
		this.perPage = merge(500, opts.perPage);
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
			t.executeSql("CREATE TABLE " + that.tfidfTable + " (url CHAR(4098), vectors CHAR(" + that.maxVectorLength + "), PRIMARY KEY (url))");
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
					
					tfidfPage[row.url] = new Array();
					tfidfPage.length++;

					// Format: "v = ...; l = ... | v = ...; l = ... etc"
					var parts = row.vectors.split("|");
					for(var j = 0; j < parts.length; j++) {
						var elem = parts[j].split(";");
						var v = parseFloatVector(elem[0].split("=")[1]);
						var l = parseFloatVector(elem[1].split("=")[1]);
						tfidfPage[row.url][j] = {vector:v, length:l};
					}
				}
				callback(tfidfPage);
			});
		});
	},
	
	storeTfidf: function(history, url, callback) {
		var that = this;
			
		// Add the tf-idf score.
		// Format: "v = ...; l = ... | v = ...; l = ... etc"
		var vectors = "";
		for(var i = 0; i<history.tfidf[url].length; i++) {
			vectors += "v = " + serializeFloatArray(history.tfidf[url][i].vector, 4) + "; " +
			"l = " + history.tfidf[url][i].length + " | ";	
		}
		vectors = vectors.substring(0, vectors.length - 1 - 3);	// Take out the last " | ".
		var sql = "REPLACE INTO " + this.tfidfTable + " VALUES (\"" + url + "\", \"" + vectors + ")";
		
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
		// Format: "v = ...; l = ... | v = ...; l = ... etc"
		var sql = "REPLACE INTO " + this.tfidfTable + " ";
		for(var url in history.tfidf) {
			var vectors = "";
			for(var i = 0; i<history.tfidf[url].length; i++) {
				vectors += "v = " + serializeFloatArray(history.tfidf[url][i].vector, 4) + "; " +
					"l = " + history.tfidf[url][i].length + " | ";	
			}
			vectors = vectors.substring(0, vectors.length - 1 - 3);	// Take out the last " | ".
			sql += "SELECT \"" + url + "\", \"" + vectors + "\" UNION ";
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