function runClassifier(hist){
	hist.store.getAllSideParts(function(sideParts){
		// Compute words distribution in sideParts.
		
		var sidePartsWords = new Array();
		var totalSidePartsWords = 0;
		for (var domain in sideParts) {
			for (var i=0; i<sideParts[domain].length; i++) {
				var part = sideParts[domain][i];
				for(var word in part) {
					if(typeof(sidePartsWords[word]) != 'number') {
						sidePartsWords[word] = part[word];
						sidePartsWords.length ++;
					} else sidePartsWords[word] += part[word];
					totalSidePartsWords += part[word];
				}
			}
		}
		
		// Compute total distribution.
		hist.store.getAllTfss(function(tfs){
			var allWords = copyArray(sidePartsWords);
			var totalAllWords = totalSidePartsWords;
			
			for (var url in tfs) {
				for (var word in tfs[url].all) {
					if(typeof(allWords[word]) != 'number') {
						allWords[word] = tfs[url].all[word];
						allWords.length ++;
					} else allWords[word] += tfs[url].all[word];
					totalAllWords += tfs[url].all[word];						
				}
			}
			
			
		});
		
		
//		var sortedFreq = new Array();
//		var sortedTfidf = new Array();
//		var avgFreq = 0;
//		var avgTfidf = 0;
//		for(var word in words) {
//			var n = words[word];
//			var t = n * Math.log(hist.nrProcessed / hist.dfs[word]) / Math.LN2;
//			avgFreq += n;
//			avgTfidf += t;
//			sortedFreq.push({w: word, n: n});
//			sortedTfidf.push({w: word, n: t})
//		}
//		avgFreq /= words.length;
//		avgTfidf /= words.length;
//		
//		var sortByN = function(a, b){ return b.n - a.n };
//		sortedFreq = sortedFreq.sort(sortByN);
//		sortedTfidf = sortedTfidf.sort(sortByN);
//		
//		var s = "Average: " + avgFreq.toFixed(2) + "<br><br>";
//		for(var i=0; i<sortedFreq.length && sortedFreq[i].n > avgFreq * 2; i++) s+= sortedFreq[i].w + ":" + sortedFreq[i].n + ", ";
//		s+= "<br><br>";
//		detailsPage.document.write(s);
//		
//		var s = "Average: " + avgTfidf.toFixed(2) + "<br><br>";
//		for(var i=0; i<sortedTfidf.length && sortedTfidf[i].n > avgTfidf * 2; i++) s+= sortedTfidf[i].w + ":" + sortedTfidf[i].n.toFixed(2) + ", ";
//		s+= "<br><br>";
//		detailsPage.document.write(s);
	});
}
