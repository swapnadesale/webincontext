/* 
 * Constants
 * =========
 */
var rootID, lastEventID = 0, userFeedback;
var recentPages = new Array();
var date = new Date();

var primaryWindow, secondaryWindow, loaderWindow;
var pwVisible = false, swVisible = false, lwVisible = false;
var swWidth, swHeight, swBottom, swRight;

var timerLoader, timerHoverPw, timerHoverSw, timerHideWindow, timerMoreLikeThis, timerBack;
var animationLength = 200;
var loaderDelay = 15000, hoverDelay = hideWindowDelay = 100, moreLikeThisDelay = backDelay = 500;


/*
 * Page first loaded
 * ==================
 */
if ((!filterURL(document.URL)) && (document.body != null)) {
	var title = (document.title != null) ? document.title : document.URL;
	
	var trace = new Array();
	trace.push({
		url: document.URL,
		title: title,
		type: 'initial',
		ready: false
	});
	
	var pollForHistoryReady = function(){
		chrome.extension.sendRequest({
			action: 'stateRequested',
		}, function(msg){
			if (!msg.historyLoaded) {
				if(!lwVisible) createLoaderWindow(msg.percentLoaded);
				else updatePercentLoaded(msg.percentLoaded);
			} else {
				clearInterval(timerLoader);
				
				rootID = msg.id;
				userFeedback = msg.userFeedback;
				
				chrome.extension.sendRequest({
					action: 'pageLoaded',
					url: document.URL,
					title: title,
					body: document.body.innerHTML,
					userFeedback: userFeedback,
				});
				
				var eventID = reportEvent({type:'pageLoaded'});
				trace[0].eventID = eventID;
				
				destroyLoaderWindow();
				createInContextWindow();
			}
		});
	}
	timerLoader = setInterval(pollForHistoryReady, loaderDelay);
	pollForHistoryReady();
}


function createLoaderWindow(percentLoaded) {
	$('body').append('<div id="progressbar"></div>');
	loaderWindow = $('#progressbar');
	lwVisible = true;
	loaderWindow.progressbar({
		value: percentLoaded
	});
}

function updatePercentLoaded(percentLoaded) {
	loaderWindow.progressbar({
		value: percentLoaded
	});
}

function destroyLoaderWindow() {
	if (lwVisible) {
		lwVisible = false;
		loaderWindow.progressbar('destroy');
		loaderWindow.remove();
	}
}

function createInContextWindow(){
	$('body').append('<div id="primaryWindow"></div>');
	primaryWindow = $('#primaryWindow');
	if (userFeedback) {
		primaryWindow.addClass('userFeedback');
		addBeforeUnloadFeedbackCheck();
	}
	
	primaryWindow
		.append('<div id="pw_titleBar">inContext</div>')
		.append('<div id="pw_mainArea"></div>')
		.append(
			'<div id="pw_searchBar">' +
				'<form>' +
					'<input type="text" id="searchBox" value="Search.. " ' +
						'onfocus = \'document.getElementById("searchBox").setAttribute("value", "");\'' +
						'onblur = \'document.getElementById("searchBox").setAttribute("value", "Search..");\' />' +
				'</form>' +
			'</div>');
	$('#pw_mainArea')
		.empty()
		.append('<p class = "helperText ht_initial"> Similar pages: </p>')
		.append(
			'<div class="load_spinner">' +
				'Loading: ' +
				'<img src="' + chrome.extension.getURL('UI/load_spinner.gif') + '"></img>' +
			'</div>'
		);
	pwVisible = true;
	
	primaryWindow.append('<div id="secondaryWindow"></div>');
	secondaryWindow = $('#secondaryWindow');
	secondaryWindow
		.append('<div id="sw_detailedPage"></div>')
		.append('<div id="sw_similarPages"></div>');
	swWidth = secondaryWindow.width();
	swHeight = secondaryWindow.height();
	swRight = getCSSSizeValue(secondaryWindow, 'right');
	swBottom = getCSSSizeValue(secondaryWindow, 'bottom');
	hideSecondaryWindow();
	
	$('body').append('<div id="minimizedWindow"></div>');
	minimizedWindow = $('#minimizedWindow');
	minimizedWindow.hide();
	
	// For the user study.
	primaryWindow.append('<div class="randomIndicator"></div>');
	secondaryWindow.append('<div class="randomIndicator"></div>');
	$('.randomIndicator').hide();
	
	/*
	 * Listen to minimize/maximize events
	 * ===================================
	 */
	$('#pw_titleBar').bind('click', function(event){
		primaryWindow.hide();
		minimizedWindow.show();
		pwVisible = false;
		reportEvent({type:'minimize', relatedID:trace[trace.length-1].eventID});
	});
	minimizedWindow.bind('click', function(event){
		primaryWindow.show();
		minimizedWindow.hide();
		pwVisible = true;
		reportEvent({type:'maximize', relatedID:trace[trace.length-1].eventID});
	});
	
	/*
	 * Listen to search events.
	 * =======================
	 */
	$('#pw_searchBar input').live('keydown', function(event){
		if (event.keyCode == 13) {
			event.preventDefault();

			hideSecondaryWindow();

			// First construct the new page.
			var query = event.target.value;
			var newURL = trace[0].url + " -> " + query;
			var newPage = recentPages[newURL];		// Try to get it from cache.
			var cached = true;
			if (newPage == null) { 					// Else request it.
				cached = false;
				var newPage = {
					url: trace[0].url + " -> " + query,
					title: trace[0].title + " -> " + query,
					type: 'search',
					ready: false
				};
				
				chrome.extension.sendRequest({
					action: 'searchRequested',
					url: trace[0].url,
					query: query,
				});
			}
			for (var i = trace.length - 1; i > 0; i--) 	trace.pop(); 
			trace.push(newPage);					// Push the new page in the trace.

			var eventID = reportEvent({type:'searchRequested'});	// Report the event.
			newPage.eventID = eventID;

			// Then update the UI
			createSearchPage(newPage);
			$('#pw_mainArea').append(
				'<div class="load_spinner">' +
					'Loading: ' +
					'<img src="' + chrome.extension.getURL('UI/load_spinner.gif') + '"></img>' +
				'</div>'
			);
			if(cached) addResponseToRequest(newPage);
		}
	});
	
	/*
	 * Listen to mouse-over suggestion events.
	 * =======================================
	 */
	$('.suggestion').live('mouseenter', function(event){
		var target = (event.target.nodeName == 'LI') ? event.target : event.target.parentNode;
		var id = target.id;
		var w = id.slice(0, 2);
		if (w == 'pw') clearTimeout(timerHoverPw)
		else clearTimeout(timerHoverSw);
		
		w = (w == 'pw') ? '#primaryWindow' : '#secondaryWindow';
		$(w + ' .suggestion').css('opacity', '0.65');
		$(w + ' .suggestion:hover').css('opacity', '1.0');
	});
	
	$('.suggestion').live('mouseleave', function(event){
		var target = (event.target.nodeName == 'LI') ? event.target : event.target.parentNode;
		var id = target.id;
		var w = id.slice(0, 2);
		if (w == 'pw') 
			timerHoverPw = setTimeout(function(){
				$('#primaryWindow .suggestion').css('opacity', '1.0');
			}, hoverDelay);
		else 
			timerHoverSw = setTimeout(function(){
				$('#secondaryWindow .suggestion').css('opacity', '1.0');
			}, hoverDelay);
	});
	
	
	$('.suggestionMore').live('mouseenter', function(event){
		clearTimeout(timerHideWindow);
		
		// Determine what suggestion was clicked
		var id = event.target.parentNode.id;
		var w = id.slice(0, 2);
		var sourceIsTop = ((w == 'sw') || (!swVisible));
		var source = sourceIsTop ? trace[trace.length - 1] : trace[trace.length - 2];
		var idx = parseInt(id.slice(7));
		var suggestion = source.scores[idx];
		
		if (trace[trace.length - 1].url == (source.url + ' -> ' + suggestion.url)) // If already showing this
			return;
		
		timerMoreLikeThis = setTimeout(function(){
			// First construct the new page.
			var newURL = source.url + " -> " + suggestion.url;
			var newPage = recentPages[newURL];		// Try to get it from cache.
			var cached = true;
			if (newPage == null) {					// Else request it.
				cached = false;
				newPage = {
					url: source.url + " -> " + suggestion.url,
					title: source.title + " -> " + suggestion.title,
					type: 'more',
					ready: false
				};
				
				chrome.extension.sendRequest({
					action: 'moreLikeThisRequested',
					sourceURL: source.url,
					suggestionURL: suggestion.url,
					userFeedback: userFeedback,
				});
			}
			if (!sourceIsTop) trace.pop();			// Push the new page in the trace.
			trace.push(newPage);

			var eventID = reportEvent({				// Report the event.
				type:'moreLikeThisRequested', 
				relatedID:source.eventID,
				suggestionIdx:idx, 
			});
			newPage.eventID = eventID;

			
			// Then update the UI
			if (w == 'pw') showSecondaryWindow();
			else createMorePagesLikePage(source);
			createDetailedPage(suggestion);
			if(cached) addResponseToRequest(newPage);		// If cached already show the suggestions.
			
		}, moreLikeThisDelay);
	});
	
	$('.suggestionMore').live('mouseleave', function(event){
		clearTimeout(timerMoreLikeThis);
		timerHideWindow = setTimeout('hideSecondaryWindow();', hideWindowDelay);
	});
	
	secondaryWindow.bind('mouseover', function(event){
		clearTimeout(timerHoverPw);
		clearTimeout(timerHideWindow);
	});
	
	secondaryWindow.bind('mouseleave', function(event){
		$('#primaryWindow .suggestion').css('opacity', '1.0');
		timerHideWindow = setTimeout('hideSecondaryWindow();', hideWindowDelay);
	});
	
	$('.suggestionTitle').live('click', function(event) {
		// Determine what suggestion was clicked
		var idx = parseInt(event.target.parentNode.id.slice(7));
		
		reportEvent({
			type:'suggestionClicked',
			relatedID:trace[trace.length-1].eventID,
			suggestionIdx:idx,
		});
	});
	
	$('.ht_evenMore').live('click', function(event){
		var w = event.target.parentNode.id.slice(0, 2);
		var sourceIsTop = ((w == 'sw') || (!swVisible));
		var source = sourceIsTop ? trace[trace.length - 1] : trace[trace.length - 2];
		addMoreSuggestions(source, w)
		
		// Readjust the width of the text to fit with the scroll bar.
		var wDiv = (w == 'pw') ? '#pw_mainArea' : '#sw_similarPages';
		var currentWidth = getCSSSizeValue($(wDiv + ' .suggestionTitle'), 'width');
		$(wDiv + ' .suggestionTitle').css('width', currentWidth - 12);
		
		$(wDiv + ' ul').jScrollPane();
		
		reportEvent({
			type:'evenMoreClicked',
			relatedID:source.eventID,
		});
	});
	
	
	/*
	 * Listen to goBack events.
	 * ========================
	 */
	$('.ht_goBack').live('click', function(event){
		hideSecondaryWindow();
		var oldSource = trace.pop();
		
		var source = trace[trace.length - 1];
		switch (source.type) {
			case 'initial':
				$('#pw_mainArea').empty().append('<p class = "helperText ht_initial"> Similar pages: </p>');
				addSuggestions(source, 5, 'pw');
				break;
			case 'search':
				createSearchPage(source);
				addSuggestions(source, 4, 'pw');
				break;
			case 'more':
				createMorePagesLikePage(source);
				break;
		}
		
		reportEvent({
			type:'goBackClicked',
			relatedID:oldSource.eventID,
		});
	});
	
	/*
	 * Listen for suggestions computed events from the background page.
	 * ================================================================
	 */
	chrome.extension.onRequest.addListener(function(msg){
		var lastTraceEntry = trace[trace.length - 1];
		if ((msg.url == lastTraceEntry.url) && (!lastTraceEntry.ready)) { // If I obtained the last thing I requested.
			lastTraceEntry.scores = msg.scores;
			lastTraceEntry.randomSuggestions = msg.randomSuggestions;
			lastTraceEntry.ready = true;
			recentPages[lastTraceEntry.url] = lastTraceEntry;	// Cache page.
			
			addResponseToRequest(lastTraceEntry);
		}
	});
}

/*
 * UI Construction functions.
 * ==========================
 */

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

function createMorePagesLikePage(source) {
	var titleSequence = source.title.split(" -> ");
	var sourceTitle = titleSequence[titleSequence.length - 1];
	
	$('#pw_mainArea')
		.empty()
		.append(
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
	$('#pw_mainArea ul').addClass('morePagesLike');
}

function createSearchPage(source) {
	var titleSequence = source.title.split(" -> ");
	var query = titleSequence[titleSequence.length - 1];
	
	$('#pw_mainArea')
		.empty()
		.append(
			'<div class="ht_morePagesLikeDiv">' +
				'<div class="helperText ht_morePagesLikeHelperText">' +
					'Pages<br>related to:' + 
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
	$('#sw_detailedPage')
		.empty()
		.append(
			'<a class="detailedPageTitle" href="' + suggestion.url + '">' +
				suggestion.title +
			'</a>')
		.append(			
			'<p class="detailedPageSummary">' +
				suggestion.summary + '...' +
			'</p>'
		);
	
	$('#sw_similarPages')
		.empty()
		.append('<p class = "helperText ht_morePagesLikeThis"> More pages like this: </p>')
		.append(
			'<div class="load_spinner">' +
				'Loading: ' + 
				'<img src="' + chrome.extension.getURL('UI/load_spinner.gif') + '"></img>' + 
			'</div>' 
		);
}

function addResponseToRequest(page) {
	$('.load_spinner').remove();
	showHideRandomIndicator(page.randomSuggestions);
			
	var type = page.type;
	switch (type) {
		case 'initial':
			addSuggestions(page, 5, 'pw');
			break;
		case 'search':
			addSuggestions(page, 4, 'pw');
			$('#pw_mainArea ul').addClass('search');
			break;
		case 'more':
			addSuggestions(page, 4, 'sw');
			break;
	};
			
	var eventID = reportEvent({
		type:'showSuggestions',
		relatedID:page.eventID,	// The request ID.
		nrSuggestions:page.scores.length, 
	});
	page.eventID = eventID;	// Replace with the response ID.
}

function addSuggestions(source, nMax, w){
	var wDiv = (w == 'pw') ? '#pw_mainArea' : '#sw_similarPages';
	
	if (source.scores.length > 0) {
		$(wDiv).append('<ul></ul>');
		for (var i = 0; (i < source.scores.length) && (i < nMax); i++) {
			$(wDiv + ' ul').append(suggestionString(source, i, w));
			if (userFeedback) addRating(source, i, w);
		}	
		$(wDiv).append('<p class = "helperText ht_evenMore"> Even more.. </p>');
	} else
		$(wDiv).append('<div class="helperText ht_noSimilarPages">No similar pages to show!</div>');
};

function addMoreSuggestions(source, w) {
	var wDiv = (w == 'pw') ? '#pw_mainArea' : '#sw_similarPages';
	var nExisting = $(wDiv + ' ul li').length;
	for (var i = nExisting; (i < source.scores.length) && (i < 100); i++) {
		$(wDiv + ' ul').append(suggestionString(source, i, w));
		if (userFeedback) addRating(source, i, w);
	}
}

function suggestionString(source, i, w) {
	var s = '<li id="'+w+'_more'+i+'" class = "suggestion">' +
				'<a class="suggestionTitle" href="' + source.scores[i].url + '" target="_blank">' +
					source.scores[i].title +
				'</a>' +
				'<img class="suggestionMore" src="' + chrome.extension.getURL('UI/arrow2.gif') + '"></img>' +
			'</li>';
	return s;
}


/*
* User study
*/
function showHideRandomIndicator(randomSuggestions) {
	var w = swVisible ? "#secondaryWindow" : "#primaryWindow";
	if (randomSuggestions) $(w + ' .randomIndicator').show();
	else $(w + ' .randomIndicator').hide();
}

function reportEvent(event) {
	lastEventID++;
	var eventID = rootID + '-' + lastEventID;
	event.eventID = eventID;
	event.date = date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear();
	event.time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+':'+date.getMilliseconds();
	
	chrome.extension.sendRequest({
		action: 'logRequested',
		event:event
	});
	
	return eventID;
}

function addRating(source, i, w) {
	if (source.type == 'initial') 
		$('#' + w + '_more' + i).append(
			'<div class="helperText ht_rating">' +
				'Related: ' +
				'<div id="'+w +'_rating_relat_'+i+'" class="rating"></div>' +
			'</div>' +
			'<div class="helperText ht_rating">' +
				'Interesting: ' +
				'<div id="'+w+'_rating_inter_'+i+'" class="rating"></div>' +
			'</div>' +
				'<div class="helperText ht_rating">' +
				'Relevant: ' +
				'<div id="'+w+'_rating_relev_'+i+'" class="rating"></div>' +
			'</div>'
		);
	else 
		$('#' + w + '_more' + i).append(
			'<div class="helperText ht_rating">' +
				'Useful: ' +
				'<div id="'+w+'_rating_usefu_'+i +'" class="rating"></div>' +
			'</div>' +
			'<div class="helperText ht_rating">' +
				'Interesting: ' +
				'<div id="'+w+'_rating_inter_'+i+'" class="rating"></div>' +
			'</div>'
		);


	var path = chrome.extension.getURL('libraries/rate/img');
	var sourceIsTop = ((w == 'sw') || (!swVisible));
	var source = sourceIsTop ? trace[trace.length - 1] : trace[trace.length - 2];
	var suggestion = source.scores[i];
	var questions = ['relat', 'inter', 'relev', 'usefu'];
	for (var j=0; j<questions.length; j++) {
		var question = questions[j];
		var start = ((suggestion.rating == null) || (suggestion.rating[question] == null)) ? 0 : 
			suggestion.rating[question];
		$('#'+w+'_rating_'+question+'_'+i).raty({
			path: path,
			start: start,  
			click: makeClickRatingListener(source, suggestion, i, question),
		});
	}
}

function makeClickRatingListener(source, suggestion, suggestionIdx, question) {
	var listener = function(score){
		if (suggestion.rating == null) suggestion.rating = {};
		suggestion.rating[question] = score;
		
		// If all ratings filled, report them.
		var ratings;
		if (source.type == 'initial') {
			if ((suggestion.rating.relat != null) && (suggestion.rating.inter != null) && (suggestion.rating.relev != null)) 
				ratings = suggestion.rating.relat + ', ' + suggestion.rating.inter + ', ' + suggestion.rating.relev + ', ';
		}
		else 
			if ((suggestion.rating.usefu != null) && (suggestion.rating.inter != null)) 
				ratings = ', ' + suggestion.rating.inter + ', , ' + suggestion.rating.usefu;
		if(ratings != null) {
			reportEvent({
				type: source.type + 'SuggestionsRated',
				relatedID: source.eventID,
				suggestionIdx: suggestionIdx,
				ratings: ratings,
			});
		}

	};
	return listener;
}

function addBeforeUnloadFeedbackCheck() {
	window.onbeforeunload = function(){
		// Check if feedback has been given.
		var initialRatings = false, moreRatings = false, ready;
		for (url in recentPages) {
			var page = recentPages[url];
			if (checkFilled(page)) 
				if (page.type == 'initial') initialRatings = true;
				else if (page.type == 'more') moreRatings = true;
		}
		ready = initialRatings && moreRatings;
		
		if(!ready) return 'Please provide feedback before navigating away!';
	};
}

function checkFilled(page) {
	var filled = true;
	var nMax = (page.type == 'initial') ? 5 : 4;
	
	for (var i = 0; (i < page.scores.length) && (i<nMax); i++) {		
		var suggestion = page.scores[i];
		if (page.type == 'initial') {
			if ((suggestion.rating == null) || (suggestion.rating.relat == null) ||
				(suggestion.rating.inter == null) || (suggestion.rating.relev == null)) 
				filled = false;
		} else 
			if ((suggestion.rating == null) || (suggestion.rating.usefu == null) || 
				(suggestion.rating.inter == null)) 
				filled = false;
		if(!filled) break;
	}

	return filled;
}

/*
 * Util
 * ====
 */
function getCSSSizeValue(node, property) {
	var s = node.css(property);
	return parseInt(s.substr(0, s.length - 2));
}

