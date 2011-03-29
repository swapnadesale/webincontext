if (document.body != null) {
	var port = chrome.extension.connect();
	
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


	trace = new Array();
	trace.push(document.URL);
	var primaryWindow, secondaryWindow;
	var primaryWindowVisible = true, secondaryWindowVisible = false;
		
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
	
	$('.suggestionMore').live('click', function() {
		// First update the UI
		if(!secondaryWindowVisible) {
			$('body').append(secondaryWindow);
			secondaryWindowVisible = true;
		}
	});
	
	/*
	 * Listen for suggestions computed.
	 * ================================
	 */
	port.onMessage.addListener(function(msg) {
		if(msg.url == trace[trace.length-1]) {	// If I obtained the last thing I requested.
			$('#pw_mainArea').append('<p class = "helperText ht_initial"> Similar pages: </p>');
			$('#pw_mainArea').append('<ul></ul>');
			
			for(var i=0; (i<msg.scores.length) && (i<5); i++) {
				$('#pw_mainArea ul').append(
					'<li class = "suggestion">' + 
						'<a class="suggestionTitle" href="' + msg.scores[i].url +'" target="_blank">' + 
							msg.scores[i].title + 
						'</a>' + 
						'<img id="pw_more' + i + '" class="suggestionMore" src="chrome-extension://hkkggmcdiaknkkhajaafmlgmnfcohnck/arrow2.gif"></img>' + 
					'</li>');	
			}
			
			$('#pw_mainArea').append('<p class = "helperText ht_evenMore"> Even more.. </p>');
		}
	});
}
