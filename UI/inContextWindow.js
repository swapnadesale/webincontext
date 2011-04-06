if (document.body != null) {
	var title = (document.title != null) ? document.title : document.URL;
	
	var trace = new Array();
	trace.push({ 
		url: document.URL, 
		title:title, 
		type:'initial',
		ready:false 
	});
	
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
	var primaryWindow, secondaryWindow;
	var pwVisible = true, swVisible = false;
	var swWidth, swHeight, swBottom, swRight;

	$('body').append('<div id="primaryWindow"></div>');
	primaryWindow = $('#primaryWindow');
	primaryWindow.append('<div id="pw_titleBar">inContext</div>');
	primaryWindow.append('<div id="pw_mainArea"></div>');
	primaryWindow.append(
		'<div id="pw_searchBar">' +
			'<form>' +
				'<input type="text" id="searchBox" value="Search.. " ' +
				'onfocus = \'document.getElementById("searchBox").setAttribute("value", "");\'' +
				'onblur = \'document.getElementById("searchBox").setAttribute("value", "Search..");\' />' +
			'</form>' +
		'</div>');
	
	primaryWindow.append('<div id="secondaryWindow"></div>');
	secondaryWindow = $('#secondaryWindow');
	secondaryWindow.append('<div id="sw_detailedPage"></div>');
	secondaryWindow.append('<div id="sw_similarPages"></div>');
	swWidth = secondaryWindow.width();
	swHeight = secondaryWindow.height();
	swRight = getCSSSizeValue(secondaryWindow, 'right');
	swBottom = getCSSSizeValue(secondaryWindow, 'bottom');
	hideSecondaryWindow();
	
	$('body').append('<div id="minimizedWindow"></div>');
	minimizedWindow = $('#minimizedWindow');
	minimizedWindow.hide();

	/*
	 * Listen to minimize/maximize events
	 * ===================================
	 */
	primaryWindow.bind('click', function(event) {
		primaryWindow.hide();
		minimizedWindow.show();
		pwVisible = false;
	});
	minimizedWindow.bind('click', function(event){
		primaryWindow.show();
		minimizedWindow.hide();
		pwVisible = true;
	});

	/*
	 * Listen to search events.
	 * =======================
	 */
	
	$('#pw_searchBar input').live('keydown', function(event){
    	if(event.keyCode == 13) {
			event.preventDefault();

			// First update the UI
			hideSecondaryWindow();			
			createSearchPage(trace[1]);			

			// Then send the request for data.
			var query = event.target.value;
			for(var i=trace.length-1; i>0; i--) trace.pop();	// Only keep the original suggestions.
			trace.push({
				url:trace[0].url + " -> " + query,
				title:trace[0].title + " -> " + query, 
				type:'search',
				ready:false
			});
			
			chrome.extension.sendRequest({
				action: 'searchRequested',
				url: trace[0].url,
				query: query,
			});
    	}
  	});

	/*
	 * Listen to mouse-over suggestion events.
	 * ======================================= 
	 */
	var timerHoverPw, timerHoverSw, timerHideWindow, timerMoreLikeThis, timerBack;
	var animationLength = 500;
	var hoverDelay = hideWindowDelay = 100, moreLikeThisDelay = backDelay = 500;

	$('.suggestion').live('mouseenter', function(event){
		var target = (event.target.nodeName == 'LI') ? event.target : event.target.parentNode;
		var id = target.id;
		var w = id.slice(0,2);
		if(w == 'pw') clearTimeout(timerHoverPw)
		else clearTimeout(timerHoverSw);
		
		w = (w == 'pw') ? '#primaryWindow' : '#secondaryWindow';
		$(w + ' .suggestion').css('opacity', '0.65');
		$(w + ' .suggestion:hover').css('opacity', '1.0');
	});
	
	$('.suggestion').live('mouseleave', function(event){
		var target = (event.target.nodeName == 'LI') ? event.target : event.target.parentNode;
		var id = target.id;
		var w = id.slice(0,2);
		if(w == 'pw') 
			timerHoverPw = setTimeout(function() { 
				$('#primaryWindow .suggestion').css('opacity', '1.0');
			}, hoverDelay);
		else 
			timerHoverSw = setTimeout(function() { 
				$('#secondaryWindow .suggestion').css('opacity', '1.0');
			}, hoverDelay);
	});
	
	
	$('.suggestionMore').live('mouseenter', function(event) {
		clearTimeout(timerHideWindow);	
		
		// Determine what suggestion was clicked
		var id = event.target.parentNode.id;
		var w = id.slice(0,2);
		var sourceIsTop = ((w == 'sw') || (!swVisible)); 
		var source =  sourceIsTop ? trace[trace.length-1] : trace[trace.length-2];
		var idx = parseInt(id.slice(7));
		var suggestion = source.scores[idx];

		if (trace[trace.length - 1].url == (source.url + ' -> ' + suggestion.url)) // If already showing this
			return;

		timerMoreLikeThis = setTimeout(function(){
			// First update the UI
			if (w == 'pw') showSecondaryWindow();
			else createMorePagesLikePage(source);
			createDetailedPage(suggestion);
			
	
			// Then send the request for data.
			if(!sourceIsTop) trace.pop();
			trace.push({
				url:source.url + " -> " + suggestion.url,
				title:source.title + " -> " + suggestion.title, 
				type:'more',
				ready:false
			});
		
			chrome.extension.sendRequest({
				action: 'moreLikeThisRequested',
				sourceURL: source.url,
				suggestionURL: suggestion.url,
			});
		}, moreLikeThisDelay);
	});

	$('.suggestionMore').live('mouseleave', function(event) {
		clearTimeout(timerMoreLikeThis);
		timerHideWindow = setTimeout('hideSecondaryWindow();', hideWindowDelay);
	});

	secondaryWindow.bind('mouseover', function(event) {
		clearTimeout(timerHoverPw);
		clearTimeout(timerHideWindow);
	});
	
	secondaryWindow.bind('mouseleave', function(event) {
		$('#primaryWindow .suggestion').css('opacity', '1.0');
		timerHideWindow = setTimeout('hideSecondaryWindow();', hideWindowDelay);
	});

	/*
	 * Listen to goBack events.
	 * ========================
	 */
	$('.ht_goBack').live('mouseenter', function(event) {
		timerBack = setTimeout(function(){
			hideSecondaryWindow();
			trace.pop();
			
			var source = trace[trace.length - 1];
			switch (source.type) {
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
		}, backDelay);
	});
	
	$('.ht_goBack').live('mouseleave', function(event) {
		clearTimeout(timerBack);
	});

	$('.ht_evenMore').live('click', function(event) {
	});


	/*
	 * Listen for suggestions computed events from the background page.
	 * ================================================================
	 */
	chrome.extension.onRequest.addListener(function(msg) {
		var lastTraceEntry = trace[trace.length-1];
		if((msg.url == lastTraceEntry.url) && (!lastTraceEntry.ready)) {	// If I obtained the last thing I requested.
			lastTraceEntry.scores = msg.scores;
			lastTraceEntry.ready = true;
			
			var type = lastTraceEntry.type;
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

function showSecondaryWindow(){
	swVisible = true;
	secondaryWindow.stop();
	secondaryWindow.animate({width:swWidth}, animationLength, 'linear');
}

function hideSecondaryWindow(){
	if (swVisible) {
		swVisible = false;
		trace.pop();
		secondaryWindow.stop();
		secondaryWindow.animate({width: 0}, animationLength, 'linear');
	} else secondaryWindow.width(0);	// Useful for the first time to script is run.
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
			suggestion.summary + '...' +
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
			'<li id="'+w+'_more'+i+'" class = "suggestion">' +
				'<a class="suggestionTitle" href="' + source.scores[i].url + '" target="_blank">' +
					source.scores[i].title +
				'</a>' +
				'<img class="suggestionMore" src="chrome-extension://pjilfelijdjlbknppjejhbjppbcchein/UI/arrow2.gif"></img>' +
			'</li>'
		);
	}
};

function getCSSSizeValue(node, property) {
	var s = node.css(property);
	return parseInt(s.substr(0, s.length - 2));
}