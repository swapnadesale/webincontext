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
			t.executeSql("CREATE TABLE " + that.tfsTable + " (url CHAR(4098), vall CHAR(" + that.maxVectorLength + "), " + 
				"parts CHAR(" + that.maxVectorLength + "), PRIMARY KEY (url))");
		});
		this.db.transaction(function(t){
			t.executeSql("CREATE TABLE " + that.sidePartsTable + " (domain CHAR(4098), parts CHAR(" + that.maxVectorLength + "), PRIMARY KEY (domain))");
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
	
	getAllURLs: function(callback) {
		var sql = "SELECT url FROM " + this.tfsTable;
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, results) {
				var urls = new Array();
				for (var i = 0; i < results.rows.length; i++) urls.push(results.rows.item(i).url);
				callback(urls);
			});
		});
	},
	
	getTfsPage: function(page, callback) {
		var that = this;
		var offset = that.perPage * page ;
		var sql = "SELECT * FROM " + that.tfsTable + " ASC LIMIT ? OFFSET ?";
		this.db.transaction(function(t) {
		    t.executeSql(sql, [that.perPage, offset], function(tx, results) {
				callback(that.parseTfsResults(results));
			});
		});
	},
	
	getTfssForDomain: function(domain, callback) {
		var that = this;
		var sql = "SELECT * FROM " + this.tfsTable + " WHERE url LIKE \"" + domain + "%\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, results) {
				callback(that.parseTfsResults(results));
			});
		});
	},
	
	storeTfs: function(tfs, callback) {
		var that = this;
			
		// Add the tf-idf score.
		var all = this.serializeAll(tfs.all);
		var parts = this.serializeParts(tfs.parts);
		var sql = "REPLACE INTO " + this.tfsTable + " VALUES (\"" + url + "\", \"" + all + "\", \"" + parts + "\")";
		
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result) {
				// Also update the parameters.
				that.storeParams(history, function() {
					callback();
				});
			});
		});
	},
		
	storeAllTfss: function(tfss, callback) {
		var that = this;
		if(tfss.length == 0) { callback(); return; }
		
		// Add all the tf-idf scores.
		var sql = "REPLACE INTO " + this.tfsTable + " ";
		for(var url in tfss) {
			var tfs = tfss[url];
			var all = this.serializeAll(tfs.all);
			var parts = this.serializeParts(tfs.parts);
			sql += "SELECT \"" + url + "\", \"" + all + "\", \"" + parts + "\" UNION ";
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
	},

	getSidePartsForDomain: function(domain, callback) {
		var that = this;
		var sql = "SELECT parts FROM " + this.sidePartsTable + " WHERE domain LIKE \"" + domain + "\"";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, results) {
				var parts = new Array();
				if ((results != null) && (results.rows.length > 0)) {
					var ps = results.rows.item(0).parts.split(";");
					for (var i = 0; i < parts.length; i++) parts.push(parseIntArray(ps[i]));
				}
				callback(parts);
			});
		});
	},

	storeSidePartsForDomain: function(domain, parts, callback) {
		var sql = "REPLACE INTO " + this.sidePartsTable + " VALUES (\"" + url + "\", \"" + this.serializeParts(parts) + "\")";
		this.db.transaction(function(t){
			t.executeSql(sql, [], function(tx, result) { 
				callback(); 
			});
		});

	},

	parseTfsResults: function(results) {
		var tfsPage = new Array();
		for (var i = 0; i < results.rows.length; i++) {
			var row = results.rows.item(i);

			tfsPage[row.url] = {};
			tfsPage.length++;
			tfsPage[row.url].all = parseIntArray(row.vall);

			tfsPage[row.url].parts = new Array();
			var parts = row.parts.split(";");
			for(var j = 0; j < parts.length; j++) tfsPage[row.url].parts.push(parseIntArray(parts[j]));
		}
		return tfsPage;
	},
	
	serializeAll: function(all) {
		return serializeIntArray(all);
	},
	
	serializeParts: function(parts) {
		var s = "";
		for(var i = 0; i<parts.length; i++) s += serializeIntArray(parts[i]) + " ; ";	
		s = s.substring(0, s.length - 1 - 3);	// Take out the last " ; ".
		return s;
	},
};