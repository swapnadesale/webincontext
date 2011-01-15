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
	
	getTfsPage: function(page, callback) {
		var that = this;
		
		var offset = that.perPage * page ;
		var sql = "SELECT * FROM " + that.tfsTable + " ASC LIMIT ? OFFSET ?";
		this.db.transaction(function(t) {
		    t.executeSql(sql, [that.perPage, offset], function(tx, results) {
				var tfsPage = new Array();
				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);
					
					tfsPage[row.url] = {};
					tfsPage.length++;

					// Get the all vector
					tfsPage[row.url].all = parseIntArray(row.vall);

					// Get the parts
					// Format: "v = ...; hash = ... | v = ...; hash = ... etc"
					tfsPage[row.url].parts = new Array();
					var parts = row.parts.split("|");
					for(var j = 0; j < parts.length; j++) {
						var elem = parts[j].split(";");
						var v = parseIntArray(elem[0].split("=")[1]);
						var hash = parseInt(elem[1].split("=")[1]);
						tfsPage[row.url].parts[j] = {v:v, hash:hash};
					}
				}
				callback(tfsPage);
			});
		});
	},
	
	storeTfs: function(history, url, callback) {
		var that = this;
			
		// Add the tf-idf score.
		var tfs = history.tfs[url];
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
		
	storeAllTfss: function(history, callback) {
		var that = this;
		if(history.tfs.length == 0) { callback(); return; }
		
		// Add all the tf-idf scores.
		var sql = "REPLACE INTO " + this.tfsTable + " ";
		for(var url in history.tfs) {
			var tfs = history.tfs[url];
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
				}, function(tx, error) {
					// detailsPage.document.write("<br>Store error: " + error.message + "<br>");
				});
		});
	},
	
	serializeAll: function(all) {
		return serializeIntArray(all);
	},
	
	serializeParts: function(parts) {
		// Format: "v = ...; hash = ... | v = ...; hash = ... etc"
		var s = "";
		for(var i = 0; i<parts.length; i++)
			s += "v = " + serializeIntArray(parts[i].v) + "; hash = " + parts[i].hash+ " | ";	
		s = s.substring(0, s.length - 1 - 3);	// Take out the last " | ".
		return s;
	},
};