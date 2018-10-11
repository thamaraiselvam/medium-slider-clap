(function () {
    
    injectHTMLFile();
    injectScriptFile();
    listenScriptInit();
    listenClapEvent();

    function injectHTMLFile(){
        //Inject clap html into DOM
        $.get(chrome.extension.getURL('/inject/clap.html'), function(data) {
            $(data).appendTo('body');
        });
    }

    function injectScriptFile(){
        // //Appending inject/script to "real" webpage. So will it can full access to webpate.
        var s = document.createElement('script');
        // TODO: add "script.js" to web_accessible_resources in manifest.json
        s.src = chrome.extension.getURL('inject/script.js');
        (document.head || document.documentElement).appendChild(s);

        s.onload = function(){
            var url = chrome.runtime.getURL("assets/clap.png");
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent("injectScriptOnLoadEvent", true, true, url);
            document.dispatchEvent(evt);
        };
    }

    function listenScriptInit(){
        document.addEventListener('injectScriptInitEvent', function (e) {
            window.mscData = e.detail;
        });
    }

    function listenClapEvent(){
        document.addEventListener('triggerClapEvent', function (e) {
            chrome.extension.sendMessage(
                {
                    requestMethod: "clap",
                    requestData :{
                        headers:window.mscData.headers,
                        body:{
                            "userId":window.mscData.userId,
                            "clapIncrement":e.detail.claps
                        },
                        additionalData:{
                            postID: $('.button--bookmark').attr('data-action-value')
                        }
                    }
                }
            );
        });
    }
})();







