if (document.body != null) {
	var port = chrome.extension.connect();

	trace = new Array();
	trace.push({ url: document.URL, type:'initial' });
	var primaryWindow, secondaryWindow;
	var primaryWindowVisible = true, secondaryWindowVisible = false;
	
	
	/*
	 * Send the body of the page to the extension to compute suggestions.
	 * ==================================================================
	 */
	var title = (document.title != null) ? document.title : document.URL;
	port.postMessage({
		action: 'pageLoaded',
		url: document.URL,
		title: title,
		body: document.body.innerHTML
	});


	/*
	 * Create the UI
	 * =============
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
		var sourceURL = source.url;
		var idx = parseInt(id.slice(7));
		var suggestionURL = source.scores[idx].url;
		
		trace.push({url:sourceURL + " -> " + suggestionURL, type:'more'});
		
		// First update the UI
		if (w == 'pw') {
			if (!secondaryWindowVisible) {
				$('body').append(secondaryWindow);
				secondaryWindowVisible = true;
			}
		} else {
			// TODO: Recreate in left window.
		}
		// Reset the contents of the secondary window.
		// TODO: Already add here the contents of detailedPage.
		$('#sw_detailedPage').empty();
		$('#sw_similarPages').empty();
		
		// Send the request for data.
		port.postMessage({
			action: 'moreLikeThisRequested',
			sourceURL: sourceURL,
			suggestionURL: suggestionURL,
		});
	});
	
	/*
	 * Listen for suggestions computed.
	 * ================================
	 */
	port.onMessage.addListener(function(msg) {
		if(msg.url == trace[trace.length-1].url) {	// If I obtained the last thing I requested.
			var type = trace[trace.length-1].type;
			trace[trace.length-1].scores = msg.scores;
			
			if (type == 'initial') { 
				$('#pw_mainArea').append('<p class = "helperText ht_initial"> Similar pages: </p>');
				$('#pw_mainArea').append('<ul></ul>');
				
				for (var i = 0; (i < msg.scores.length) && (i < 5); i++) {
					$('#pw_mainArea ul').append(
						'<li class = "suggestion">' +
							'<a class="suggestionTitle" href="' + msg.scores[i].url + '" target="_blank">' +
								msg.scores[i].title +
							'</a>' +
							'<img id="pw_more' + i + '" class="suggestionMore" src="chrome-extension://hkkggmcdiaknkkhajaafmlgmnfcohnck/arrow2.gif"></img>' +
						'</li>');
				}
				
				$('#pw_mainArea').append('<p class = "helperText ht_evenMore"> Even more.. </p>');
				
			} else if (type == 'search'){
				// TODO
				
			} else {
				$('#sw_similarPages').append('<p class = "helperText ht_morePagesLikeThis"> More pages like this: </p>');
				$('#sw_similarPages').append('<ul></ul>');
				
				for (var i = 0; (i < msg.scores.length) && (i < 4); i++) {
					$('#sw_similarPages ul').append(
						'<li class = "suggestion">' +
							'<a class="suggestionTitle" href="' + msg.scores[i].url + '" target="_blank">' +
								msg.scores[i].title +
							'</a>' +
							'<img id="sw_more' + i + '" class="suggestionMore" src="chrome-extension://hkkggmcdiaknkkhajaafmlgmnfcohnck/arrow2.gif"></img>' +
						'</li>');
				}
				
				$('#sw_similarPages').append('<p class = "helperText ht_evenMore"> Even more.. </p>');
			}
		}
	});
}
