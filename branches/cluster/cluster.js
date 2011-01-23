var Cluster = function(opts) {
	this.init(opts);
};

Cluster.prototype = {
	// Initializes all history fields.
	init: function(opts){
		this.hist = opts.hist;
		Math.seedrandom('random');
	},
	
	clusterKMeans: function(k, nIter){
		var that = this;
		this.hist.store.getAllURLs(function(urls){
			// 1. Choose k random seeds.
			// =========================			
			var centroidURLs = new Array();
			for (var i = 0; i < k; i++) 
				centroidURLs[i] = urls[Math.floor(Math.random() * urls.length)];
			
			that.hist.store.getTfssForURLs(centroidURLs, function(tfss){	// Retrieve the seeds.
				var centroids = new Array();

				// Compute log idfs for the current dfs.
        		var logIdfs = new Array();
        		for(word in that.hist.dfs) 
        			logIdfs[word] = Math.log(that.hist.nrProcessed / that.hist.dfs[word]) / Math.LN2;

				// For each seed retrieved, compute tfidf, normalize, and add to centroids.
				detailsPage.document.write("Seed centroids: <br>");
				for (var url in tfss) {
					var v = that.hist.computeTfidfAndNormalize(tfss[url], logIdfs);
					centroids.push(v);
					detailsPage.document.write(url + "<br>" + serializeFloatArray(v, 8) + "<br><br>");
				}
				detailsPage.document.write("<br><br><br>");
				
				// 2. Iterate the reassignment - recomputation of centroids steps.
				// ===============================================================
				var reassignVectors = function(cbk) {
					// Initialize new classes.
					var classes = new Array();
					for (var i = 0; i < k; i++) 
						classes[i] = {
							sum: new Array(),
							urls: new Array()
						};
					reassignVectorsPaged(0, classes, function(){
						cbk(classes);	// Return the computed classes.
					});
				};
				
				var reassignVectorsPaged = function(page, classes, cbk) {
					// detailsPage.document.write("Reassigning page: " + page + "<br>");
					that.hist.store.getTfsPage(page, function(tfsPage){
        				if (tfsPage.length == 0) { cbk(); return; }
						
						for(var url in tfsPage) {
							var vPage = that.hist.computeTfidfAndNormalize(tfsPage[url], logIdfs);
							if(vPage == null) continue;
							
							// Compute distance to each centroid.
							var rssMin = Number.MAX_VALUE;
							var c;
							for(var i=0; i<k; i++) {	
								var v = centroids[i];
								var rss = 0;
								
								// Add all terms in v.
								for(word in v) {
									if(typeof(v[word]) == 'number')
										if(typeof(vPage[word]) == 'number') 
											rss += (v[word] - vPage[word]) * (v[word] - vPage[word]);
										else rss += v[word] * v[word];
								}
								// Also add all terms in vPage not in v.
								for(word in vPage[word])
									if(typeof(vPage[word]) == 'number')
										if(typeof(v[word]) != 'number')
											rss += vPage[word]*vPage[word];
								
								// Update rssMin
								if (rss < rssMin) {
									rssMin = rss;
									c = i;
								}
							}
							
							// Assign vector to the closest class.
							for(var word in vPage) {
								if(typeof(vPage[word]) == 'number')
									if(typeof(classes[c].sum[word]) != 'number') 
										classes[c].sum[word] = vPage[word];
									else  classes[c].sum[word] += vPage[word];
							}
							classes[c].urls.push({
								url: url,
								rss: rssMin
							});
						}
						
						// Loop.
						reassignVectorsPaged(page+1, classes, cbk);
					});
				};


				var loop = function(i, n, cbk){
					detailsPage.document.write("Pass: " + i + "<br>");
					reassignVectors(function(classes){
						for(var c=0; c<k; c++) {	// For each class
							// detailsPage.document.write("Recomputing centroid: " + c + "<br>");
							// Recompute centroids
							var l=0;
							for(var word in classes[c].sum) 
								if(typeof(classes[c].sum[word]) == 'number')
									l+= classes[c].sum[word]*classes[c].sum[word];
							l = Math.sqrt(l);
								
							var v = new Array();
							for(var word in classes[c].sum) 
								if(typeof(classes[c].sum[word]) == 'number')
									v[word] = classes[c].sum[word] / l;
							centroids[c] = v;
						}
							
						// detailsPage.document.write("Centroids recomputed. <br><br><br>");						
						// Loop.
						if(i<n) loop(i+1, n, cbk);
						else cbk(classes);
					});
				};
				// Start the loop.
				loop(0, nIter, function(classes) {
					for(var c=0; c<k; c++) {
						detailsPage.document.write("Class: " + c + "<br>");
						classes[c].urls.sort(function(a, b){ return b.rss - a.rss });
						for(var i=0; i<classes[c].urls.length; i++) {
							detailsPage.document.write(classes[c].urls[i].url + "<br>");
						}
						detailsPage.document.write("<br><br><br>");
					}
				});
			});
		});
	},
}

