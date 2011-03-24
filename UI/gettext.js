if (document.body != null) {
        var title = (document.title != null) ? document.title : document.URL;
        chrome.extension.sendRequest({
                url: document.URL,
                title: title,
                body: document.body.innerHTML
        });
}
