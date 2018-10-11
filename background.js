(function () {
    initJquery();
    clapListener();
    requestIntercepter();

    function requestIntercepter(){
        chrome.webRequest.onBeforeSendHeaders.addListener(
            function(details) {
                console.log(details.requestHeaders);
        
                if(!isMSCRequest(details.requestHeaders)){
                    return { requestHeaders: details.requestHeaders };
                }

                return { requestHeaders: replaceHeaders(details.requestHeaders) };
            },
            {urls: ['https://medium.com/_/api/posts/*']},
            ['blocking', 'requestHeaders']
          );
    }

    function isMSCRequest(requestHeaders){
        let returnValue = false;
        $.each( requestHeaders, function( key, meta ) {
            if(meta.name === "identifier" && meta.value === "msc"){
                returnValue = true;
            }
        });

        return returnValue;
    }

    function replaceHeaders(requestHeaders){
        $.each( requestHeaders, function( key, meta ) {
            if(meta.name === "Origin"){
                requestHeaders[key] = {
                    name:"Origin",
                    value:"https://medium.com",
                }
            }
            if(meta.name === "Referer"){
                requestHeaders[key] = {
                    name:"Referer",
                    value:"https://medium.com",
                }
            }
        });

        return requestHeaders;
    }

    function clapListener(){
        chrome.extension.onMessage.addListener(
            function(request, sender, sendResponse){
                if(request.requestMethod == "clap"){
                    clap(request.requestData);
                }
            }
        );
    }

    function initJquery(){
        chrome.browserAction.onClicked.addListener(function(tab) {
            chrome.tabs.executeScript(null, {file: "lib/jquery.js"});
        });
    }

    function clap(requestData){
        $.ajax({
            url: 'https://medium.com/_/api/posts/' + requestData.additionalData.postID + '/claps',
            type: 'post',
            data: JSON.stringify(requestData.body),
            headers: requestData.headers,
            dataType: 'json',
            success: function (data) {
                console.info(data);
            }
        });
    }
})();