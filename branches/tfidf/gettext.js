if (document.body != null) {
	var title;
	if (document.title != null) title = document.title;
	else title = document.URL;
	
	chrome.extension.sendRequest({
		url: document.URL,
		title: title,
		body: document.body.innerHTML
	});
}

