


var evt=document.createEvent("CustomEvent");
evt.initCustomEvent("yourCustomEvent", true, true, {
    headers:{
        "X-Client-Date": new Date().getTime(),
        "Origin":"https://medium.com",
        "X-XSRF-Token":window.GLOBALS.xsrfToken,
        "Content-Type":"application/json",
        "Referer":location.href,
        "X-Obvious-CID":"web",
        "Accept-Language":"en-US,en;q=0.9",
        "Accept-Encoding":"gzip, deflate, br",
        "User-Agent":window.navigator.userAgent,
        "identifier": "msc"
    },
    userId:window.GLOBALS.currentUser.userId,
});
document.dispatchEvent(evt);


document.addEventListener('yourCustomEvent2', function (e)
{
    var url=e.detail;
    setTimeout(() => {
        window.claps = getCurrentClaps();
        $("#currentVal").html(claps);
        $("#range").slider({
          orientation: "vertical",
          range: "min",
          max: 50,
          value: window.claps,
          create: function( event, ui ) {
                $(".ui-slider-handle").show();
                $(".ui-slider-handle").css('background', 'url("'+ url+'") 50% 50% repeat-x');              
              },
          slide: function(e, ui) {
            $("#currentVal").html(ui.value);
          },
          change: function(e, ui) {
            clapState(window.claps, ui.value);
            sendChangeValue();
            if(window.mscClaps.recentChange < 0 ){
                $("#range").slider('value', 0);
                $("#currentVal").html(0);
            }
          }
        });
    }, 1000)
});

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
    evt.initCustomEvent("yourCustomEvent3", true, true, {
        claps: window.mscClaps.recentChange
    });
    document.dispatchEvent(evt);
}
