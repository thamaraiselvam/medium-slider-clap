//Inject clap html into DOM
$.get(chrome.extension.getURL('/clap.html'), function(data) {
    $(data).appendTo('body');
});

//Appending script.js to "real" webpage. So will it can full access to webpate.
var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
(document.head || document.documentElement).appendChild(s);
//Our script.js only add listener to window object, 
//so we don't need it after it finish its job. But depend your case, 
//you may want to keep it.
s.parentNode.removeChild(s);

s.onload = function(){
    $( document ).ready(function() {
        $( "#currentVal" ).change( function() {
            
        });
        
    });

    var url = chrome.runtime.getURL("clap.png");
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("yourCustomEvent2", true, true, url);
    document.dispatchEvent(evt);
  };

var globalData;
document.addEventListener('yourCustomEvent', function (e) {
    console.log(e.detail)
    globalData = e.detail;
});

document.addEventListener('yourCustomEvent3', function (e) {
    console.log(e.detail)
    chrome.extension.sendMessage(
        {
            requestMethod: "clap",
            requestData :{
                headers:globalData.headers,
                body:{
                    "userId":globalData.userId,
                    "clapIncrement":e.detail.claps
                },
                additionalData:{
                    postID: $('.button--bookmark').attr('data-action-value')
                }
            }
        }
    );
});