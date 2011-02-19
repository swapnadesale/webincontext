var StoreWrapper = function(opts) {
        this.init(opts);
};

StoreWrapper.prototype = {
	init: function(opts){
		var that = this;
		
		// Default properties.
		this.name = merge('MyStore', opts.name);
		this.version = merge('1.0', opts.version);
		this.display = merge('Store', opts.display);
		this.max = merge(512 * 1024 * 1024, opts.max);
		
		this.paramTable = merge('paramTable', opts.paramTable);
		this.tfsTable = merge('tfsTable', opts.mainTable);
		this.sidePartsTable = merge('sidePartsTable', opts.sidePartsTable)
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
			"type CHAR(8), " + 
			"full CHAR(" + that.maxVectorLength + "), " +
			"filtered CHAR(" + that.maxVectorLength + "), " +
			"parts CHAR(" + that.maxVectorLength + "), PRIMARY KEY (url))");
		});
		this.db.transaction(function(t){
			t.executeSql("CREATE TABLE " + that.sidePartsTable + " (domain CHAR(4098), parts CHAR(" + that.maxVectorLength + "), PRIMARY KEY (domain))");
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
	
	storeTfs: function(url, tfs, callback){
		var that = this;
		var sql = "REPLACE INTO " + this.tfsTable + " VALUES (" + this.serializeTfs(url, tfs) + ")";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result){
				callback();
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	storeAllTfss: function(tfss, callback){
		var that = this;
		
		var sql = "REPLACE INTO " + this.tfsTable + " ";
		var empty = true;
		for (var url in tfss) {
			sql += "SELECT " + this.serializeTfs(url, tfss[url]) + " UNION ";
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
	
	getSidePartsForDomain: function(domain, callback){
		var that = this;
		var sql = "SELECT parts FROM " + this.sidePartsTable + " WHERE domain LIKE \"" + domain + "\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, results){
				var parts = new Array();
				if ((results != null) && (results.rows.length > 0)) {
					var ps = results.rows.item(0).parts;
					if (ps != "") {
						ps = ps.split(";");
						for (var i = 0; i < ps.length; i++) 
							parts.push(parseIntArray(ps[i]));
					}
				}
				callback(parts);
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
	},
	
	storeSidePartsForDomain: function(domain, parts, callback){
		var sql = "REPLACE INTO " + this.sidePartsTable + " VALUES (\"" + domain + "\", \"" + this.serializeParts(parts) + "\")";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result){
				callback();
			}, function(tx, error){
				log += error.message + "<br>";
			});
		});
		
	},
	
	serializeParts: function(parts){
		var s = "";
		for (var i = 0; i < parts.length; i++) s += serializeIntArray(parts[i]) + ";";
		if (s != "") s = s.substring(0, s.length - 1); // Take out the last ";".
		return s;
	},

	serializeTfs: function(url, tfs) {
		var full = serializeIntArray(tfs.full);
		var filtered = serializeIntArray(tfs.filtered);
		var parts = this.serializeParts(tfs.parts);
		return "\"" + url + "\", \"" + escape(tfs.title) + "\", \"" + tfs.type + "\", \"" 
			+ full + "\", \"" + filtered + "\", \"" + parts + "\"";
	},

	parseTfsResults: function(results){
		var tfsPage = new Array();
		for (var i = 0; i < results.rows.length; i++) {
			var row = results.rows.item(i);
			tfsPage[row.url] = {};
			tfsPage.length++;
			tfsPage[row.url].title = unescape(row.title);
			tfsPage[row.url].type = row.type;
			tfsPage[row.url].full = parseIntArray(row.full);
			tfsPage[row.url].filtered = parseIntArray(row.filtered);
			tfsPage[row.url].parts = new Array();
			var parts = row.parts.split(";");
			for (var j = 0; j < parts.length; j++) 
				tfsPage[row.url].parts.push(parseIntArray(parts[j]));
		}
		return tfsPage;
	},
};