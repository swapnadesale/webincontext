if (document.body != null) {
	var port = chrome.extension.connect();
	
	var title = (document.title != null) ? document.title : document.URL;
	var trace = new Array();
	trace.push({ url: document.URL, title:title, type:'initial' });
	var primaryWindow, secondaryWindow;
	var primaryWindowVisible = true, secondaryWindowVisible = false;
	
	
	/*
	 * Send the body of the page to the extension to compute suggestions.
	 * ==================================================================
	 */
	port.postMessage({
		action: 'pageLoaded',
		url: document.URL,
		title: title,
		body: document.body.innerHTML
	});


	/*
	 * Create the inContext Windows
	 * ==============================
	 */
	$('body').append('<div id="primaryWindow" class="inContextWindow"></div>');
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
	
	$('body').append('<div id="secondaryWindow" class="inContextWindow"></div>');
	secondaryWindow = $('#secondaryWindow');
	$('#secondaryWindow').append('<div id="sw_detailedPage"></div>');
	$('#secondaryWindow').append('<div id="sw_similarPages"></div>');
	$('#secondaryWindow').remove();		// Hide for now.
	

	/*
	 * Listen for moreLikeThis requests.
	 * ================================= 
	 */
	$('.suggestionMore').live('click', function(event) {
		// Determine what suggestion was clicked
		var id = event.target.id;
		var w = id.slice(0,2);
		var source = ((w == 'pw') && (secondaryWindowVisible)) ?  
			trace[trace.length-2] : trace[trace.length-1];
		var idx = parseInt(id.slice(7));
		var suggestion = source.scores[idx];
		
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
		port.postMessage({
			action: 'moreLikeThisRequested',
			sourceURL: source.url,
			suggestionURL: suggestion.url,
		});
	});

	$('.ht_goBack').live('click', function(event) {
		if(secondaryWindowVisible) {
			$('#secondaryWindow').remove();
			secondaryWindowVisible = false;
			trace.pop();
		}
		
		trace.pop();
		if(trace.length == 1) createInitialPage(trace[0]);
		else createMorePagesLikePage(trace[trace.length-1]);
	});
	
	$('.ht_evenMore').live('click', function(event) {
	});


	/*
	 * Listen for suggestions computed.
	 * ================================
	 */
	port.onMessage.addListener(function(msg) {
		if(msg.url == trace[trace.length-1].url) {	// If I obtained the last thing I requested.
			var type = trace[trace.length-1].type;
			trace[trace.length-1].scores = msg.scores;
			
			switch(type) {
				case 'initial':
					createInitialPage(msg);
					break;
				case 'search':
					// TODO
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
				'<img id="'+w+'_more'+i+'" class="suggestionMore" src="chrome-extension://hkkggmcdiaknkkhajaafmlgmnfcohnck/arrow2.gif"></img>' +
			'</li>'
		);
	}
};
