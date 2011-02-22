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
		this.tfsTable = merge('tfsTable', opts.mainTable);
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
			t.executeSql("CREATE TABLE " + that.tfsTable + " (url CHAR(4098), title CHAR(4098), " + 
			"tfs CHAR(" + that.maxVectorLength + "), PRIMARY KEY (url))");
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
			" SELECT \"" + this.keyDfs + "\", \"" + serializeIntArray(history.dfs) + "\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result){
				callback();
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	getAllURLs: function(callback){
		var sql = "SELECT url FROM " + this.tfsTable;
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
	
	getTfs: function(url, callback) {
		var that = this;
		var sql = "SELECT * FROM " + that.tfsTable + " WHERE url=\"" + url + "\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, results){
				callback(that.parseTfsResults(results)[0]);
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});

	},
	
	getTfsPage: function(page, callback){
		var that = this;
		var offset = that.perPage * page;
		var sql = "SELECT * FROM " + that.tfsTable + " ASC LIMIT ? OFFSET ?";
		this.db.transaction(function(t){
			t.executeSql(sql, [that.perPage, offset], function(tx, results){
				callback(that.parseTfsResults(results));
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	getTfssForDomain: function(domain, callback){
		var that = this;
		var sql = "SELECT * FROM " + this.tfsTable + " WHERE url LIKE \"" + domain + "%\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, results){
				callback(that.parseTfsResults(results));
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	storeTfs: function(tfs, callback){
		var sql = "REPLACE INTO " + this.tfsTable + " VALUES (" + this.serializeTfs(tfs) + ")";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result){
				callback();
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	storeAllTfss: function(tfss, callback){
		var sql = "REPLACE INTO " + this.tfsTable + " ";
		var empty = true;
		for (var i=0; i<tfss.length; i++) {
			sql += "SELECT " + this.serializeTfs(tfss[i]) + " UNION ";
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
	
	serializeTfs: function(tfs) {
		return "\"" + tfs.url + "\", \"" + escape(tfs.title) + "\", \"" + 
			serializeFloatArray(tfs.tfs, 2) + "\"";
	},

	parseTfsResults: function(results){
		var tfsPage = new Array();
		for (var i = 0; i < results.rows.length; i++) {
			var row = results.rows.item(i);
			tfsPage.push({url:row.url, title:unescape(row.title), tfs:parseFloatArray(row.tfs)});
		}
		return tfsPage;
	},
};