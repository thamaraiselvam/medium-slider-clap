chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file: "jquery.js"});
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        console.log(details.requestHeaders);
        var isMSCRequest = false;
        $.each( details.requestHeaders, function( key, meta ) {
            if(meta.name === "identifier" && meta.value === "msc"){
                console.log( "yes");
                isMSCRequest = true;
            }
        });

        if(!isMSCRequest){
            return { requestHeaders: details.requestHeaders };
        }

        $.each( details.requestHeaders, function( key, meta ) {
            if(meta.name === "Origin"){
                details.requestHeaders[key] = {
                    name:"Origin",
                    value:"https://medium.com",
                }
            }
            if(meta.name === "Referer"){
                details.requestHeaders[key] = {
                    name:"Referer",
                    value:"https://medium.com",
                }
            }
        });

        return { requestHeaders: details.requestHeaders };
    },
    {urls: ['https://medium.com/_/api/posts/*']},
    ['blocking', 'requestHeaders']
  );


chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.requestMethod == "clap"){
            clap(request.requestData);
        }
    }
);

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