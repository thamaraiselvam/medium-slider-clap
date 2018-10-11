(function (){

    listenLoadEvent();
    sendDOMDataToContentScript();

    function listenLoadEvent(){
        document.addEventListener('injectScriptOnLoadEvent', function (e) {
            window.mscImageURL = e.detail;
            setTimeout(() => {
                setClaps();
                initSlider();
            }, 2000)
        });
    }

    function setClaps(){
        window.claps = getCurrentClaps();
        $("#currentVal").html(window.claps);
    }

    function initSlider(){
        $("#range").slider({
            orientation: "vertical",
            range: "min",
            max: 50,
            value: window.claps,
            create: function( event, ui ) {
                    $(".ui-slider-handle").show();
                    $(".ui-slider-handle").css('background', 'url("'+ window.mscImageURL+'") 50% 50% repeat-x');              
                },
            slide: function(e, ui) {
                $("#currentVal").html(ui.value);
            },
            change: function(e, ui) {
                if(ui.value === 0){
                    return ;
                }
                clapState(window.claps, ui.value);
                triggerClapsRequest();
            }
        });
    }

    function sendDOMDataToContentScript(){
        var evt=document.createEvent("CustomEvent");
        evt.initCustomEvent("injectScriptInitEvent", true, true, {
            headers:{
                "X-Client-Date": new Date().getTime(),
                "X-XSRF-Token":window.GLOBALS.xsrfToken,
                "Content-Type":"application/json",
                "X-Obvious-CID":"web",
                "Accept-Language":"en-US,en;q=0.9",
                "identifier": "msc"
            },
            userId:window.GLOBALS.currentUser.userId,
        });
        document.dispatchEvent(evt);
    }

    function triggerClapsRequest(){
        if(window.mscClaps.recentChange < 0 ){
            sendChangeValue(-Math.abs(window.mscClaps.current + Math.abs(window.mscClaps.recentChange)));
            setTimeout(() => {
                sendChangeValue(window.mscClaps.current);
            }, 500);
        } else {
            sendChangeValue(window.mscClaps.recentChange);
        }
    }
    
    function clapState(oldValue, newValue){
        window.mscClaps = {current: newValue, recentChange: newValue - oldValue};
        console.log(window.mscClaps);
        window.claps = newValue;
    }
    
    function getCurrentClaps(){
        const clapCountData = $('body').html().match(/clapCount":(.*)$/gm);
        var clapCount = clapCountData[0].substring(0, clapCountData[0].indexOf(','));
        return clapCount.substring(clapCount.indexOf(":") + 1);
    }
    
    
    function  sendChangeValue(value){
        var evt=document.createEvent("CustomEvent");
        evt.initCustomEvent("triggerClapEvent", true, true, {
            claps: value
        });
        document.dispatchEvent(evt);
    }
    
})();