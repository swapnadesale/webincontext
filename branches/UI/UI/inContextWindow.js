if (document.body != null) {
	var title = (document.title != null) ? document.title : document.URL;
	
	var trace = new Array();
	trace.push({ url: document.URL, title:title, type:'initial' });
	var primaryWindow, secondaryWindow;
	var primaryWindowVisible = true, secondaryWindowVisible = false;
	
	
	/*
	 * Send the body of the page to the extension to compute suggestions.
	 * ==================================================================
	 */
	chrome.extension.sendRequest({
		action: 'pageLoaded',
		url: document.URL,
		title: title,
		body: document.body.innerHTML
	});


	/*
	 * Create the inContext Windows
	 * ==============================
	 */
	$('body').append('<div id="primaryWindow"></div>');
	primaryWindow = $('primaryWindow');
	$('#primaryWindow').append('<div id="pw_titleBar" onclick = "">inContext</div>');
	$('#primaryWindow').append('<div id="pw_mainArea"></div>');
	$('#primaryWindow').append(
		'<div id="pw_searchBar">' +
			'<form>' +
				'<input type="text" id="searchBox" value="Search.. " ' +
				'onfocus = \'document.getElementById("searchBox").setAttribute("value", "");\'' +
				'onblur = \'document.getElementById("searchBox").setAttribute("value", "Search..");\' />' +
			'</form>' +
		'</div>');
	
	$('body').append('<div id="secondaryWindow"></div>');
	secondaryWindow = $('#secondaryWindow');
	$('#secondaryWindow').append('<div id="sw_detailedPage"></div>');
	$('#secondaryWindow').append('<div id="sw_similarPages"></div>');
	$('#secondaryWindow').remove();		// Hide for now.
	

	/*
	 * Listen to search events.
	 * =======================
	 */
	
	$('#pw_searchBar input').live('keydown', function(event){
    	if(event.keyCode == 13) {
			event.preventDefault();

			var query = event.target.value;
			for(var i=trace.length-1; i>0; i--) trace.pop();	// Only keep the original suggestions.
			trace.push({
				url:trace[0].url + " -> " + query,
				title:trace[0].title + " -> " + query, 
				type:'search'
			});
			
			// First update the UI			
			if(secondaryWindowVisible) {
				$('#secondaryWindow').remove();
				secondaryWindowVisible = false;
			}
			createSearchPage(trace[1]);			

			// Then send the request for data.
			chrome.extension.sendRequest({
				action: 'searchRequested',
				url: trace[0].url,
				query: query,
			});
    	}
  	});

	/*
	 * Listen to MoreLikeThis events.
	 * ============================= 
	 */
	$('.suggestionMore').live('click', function(event) {
		// Determine what suggestion was clicked
		var id = event.target.id;
		var w = id.slice(0,2);
		var sourceIsTop = ((w == 'sw') || (!secondaryWindowVisible)); 
		var source =  sourceIsTop ? trace[trace.length-1] : trace[trace.length-2];
		var idx = parseInt(id.slice(7));
		var suggestion = source.scores[idx];
		
		if(!sourceIsTop) trace.pop();
		trace.push({
			url:source.url + " -> " + suggestion.url,
			title:source.title + " -> " + suggestion.title, 
			type:'more'
		});
		
		// First update the UI
		if (w == 'pw') {
			if (!secondaryWindowVisible) {
				$('body').append(secondaryWindow);
				secondaryWindowVisible = true;
			}
		}
		else createMorePagesLikePage(source);
		createDetailedPage(suggestion);
		
		// Then send the request for data.
		chrome.extension.sendRequest({
			action: 'moreLikeThisRequested',
			sourceURL: source.url,
			suggestionURL: suggestion.url,
		});
	});

	/*
	 * Listen to goBack events.
	 * ========================
	 */
	$('.ht_goBack').live('click', function(event) {
		if(secondaryWindowVisible) {
			$('#secondaryWindow').remove();
			secondaryWindowVisible = false;
			trace.pop();
		}
		trace.pop();
		
		var source = trace[trace.length-1];
		switch(source.type) {
			case 'initial': 
				createInitialPage(source);
				break;
			case 'search':
				createSearchPage(source);
				addSuggestions(source, 4, 'pw');
				$('#pw_mainArea').append('<p class = "helperText ht_evenMore"> Even more.. </p>');
				break;
			case 'more':
				createMorePagesLikePage(source);	
				break;
		}
	});

	$('.ht_evenMore').live('click', function(event) {
	});


	/*
	 * Listen for suggestions computed events from the background page.
	 * ================================================================
	 */
	chrome.extension.onRequest.addListener(function(msg) {
		if(msg.url == trace[trace.length-1].url) {	// If I obtained the last thing I requested.
			trace[trace.length-1].scores = msg.scores;
			
			var type = trace[trace.length-1].type;
			switch(type) {
				case 'initial':
					createInitialPage(msg);
					break;
				case 'search':
					addSuggestions(msg, 4, 'pw');
					$('#pw_mainArea').append('<p class = "helperText ht_evenMore"> Even more.. </p>');
					break;
				case 'more':
					addSuggestions(msg, 4, 'sw');
					$('#sw_similarPages').append('<p class = "helperText ht_evenMore"> Even more.. </p>');
					break;
 			};
		}
	});
}


function createInitialPage(source) {
	$('#pw_mainArea').empty();
	$('#pw_mainArea').append('<p class = "helperText ht_initial"> Similar pages: </p>');
	addSuggestions(source, 5, 'pw');
	$('#pw_mainArea').append('<p class = "helperText ht_evenMore"> Even more.. </p>');
}

function createMorePagesLikePage(source) {
	var titleSequence = source.title.split(" -> ");
	var sourceTitle = titleSequence[titleSequence.length - 1];
	
	$('#pw_mainArea').empty();
	$('#pw_mainArea').append(
		'<div class="ht_morePagesLikeDiv">' +
			'<div class="helperText ht_morePagesLikeHelperText">' +
				'More pages like:' + 
			'</div>' +
			'<div class="helperText ht_morePagesLikeTitle">' +
				sourceTitle +
			'</div><br>' +
			'<div class="helperText ht_goBack">' +
				'<-- Go back' +
			'</div>' +
		'</div>'
	);
	addSuggestions(source, 4, 'pw');
	$('#pw_mainArea').append('<p class = "helperText ht_evenMore"> Even more.. </p>');
}

function createSearchPage(source) {
	var titleSequence = source.title.split(" -> ");
	var query = titleSequence[titleSequence.length - 1];
	
	$('#pw_mainArea').empty();
	$('#pw_mainArea').append(
		'<div class="ht_morePagesLikeDiv">' +
			'<div class="helperText ht_morePagesLikeHelperText">' +
				'Pages:' + 
			'</div>' +
			'<div class="helperText ht_morePagesLikeTitle">' +
				query +
			'</div><br>' +
			'<div class="helperText ht_goBack">' +
				'<-- Go back' +
			'</div>' +
		'</div>'
	);
}

function createDetailedPage(suggestion) {
	$('#sw_detailedPage').empty();
	$('#sw_detailedPage').append(
		'<a class="detailedPageTitle" href="' + suggestion.url + '">' +
			suggestion.title +
		'</a>');
	$('#sw_detailedPage').append(			
		'<p class="detailedPageSummary">' +
			'Page summary here.. Page summary here.. Page summary here.. Page summary here.. Page summary here.. Page summary here..' +	// TODO 
		'</p>'
	);
	
	$('#sw_similarPages').empty();
	$('#sw_similarPages').append('<p class = "helperText ht_morePagesLikeThis"> More pages like this: </p>');
}

function addSuggestions(source, nMax, w){
	var wDiv = (w == 'pw') ? '#pw_mainArea' : '#sw_similarPages';
	
	$(wDiv).append('<ul></ul>');
	for (var i = 0; (i < source.scores.length) && (i < nMax); i++) {
		$(wDiv + ' ul').append(
			'<li class = "suggestion">' +
				'<a class="suggestionTitle" href="' + source.scores[i].url + '" target="_blank">' +
					source.scores[i].title +
				'</a>' +
				'<img id="'+w+'_more'+i+'" class="suggestionMore" src="chrome-extension://hkkggmcdiaknkkhajaafmlgmnfcohnck/UI/arrow2.gif"></img>' +
			'</li>'
		);
	}
};
