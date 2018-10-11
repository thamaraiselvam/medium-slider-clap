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
        window.totalClaps = getTotalClaps();
        $("#msc-currentVal").html(window.claps);
    }

    function initSlider(){
        $("#msc-range").slider({
            orientation: "vertical",
            range: "min",
            max: 50,
            value: window.claps,
            create: function( event, ui ) {
                    $(".ui-slider-handle").show();
                    $(".ui-slider-handle").css('background', 'url("'+ window.mscImageURL+'") 50% 50% repeat-x');              
                },
            slide: function(e, ui) {
                $("#msc-currentVal").html(ui.value);
                // var oldValue =  jQuery('.js-postActionsFooter').find('.js-multirecommendCountButton').html();
                var value = parseInt(ui.value) + parseInt( window.totalClaps);
                jQuery('.js-postActionsFooter').find('.js-multirecommendCountButton').html(value);

                // var ui.value =  jQuery('.js-postLeftSidebar').find('.js-multirecommendCountButton').html();
                jQuery('.js-postLeftSidebar').find('.js-multirecommendCountButton').html(value);
            },
            change: function(e, ui) {
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
            mojoThing(window.mscClaps.recentChange);
            setTimeout(() => {
                sendChangeValue(window.mscClaps.current);
            }, 500);
        } else {
            sendChangeValue(window.mscClaps.recentChange);
            mojoThing(window.mscClaps.recentChange);
        }
    }
    
    function clapState(oldValue, newValue){
        window.mscClaps = {current: newValue, recentChange: newValue - oldValue};
        console.log(window.mscClaps);
        window.claps = newValue;
    }
    
    function getCurrentClaps(){
        const clapCountData = $('body').html().match(/clapCount":(.*)$/gm);
        if(!clapCountData){
            return 0;
        }
        var clapCount = clapCountData[0].substring(0, clapCountData[0].indexOf(','));
        return clapCount.substring(clapCount.indexOf(":") + 1);
    }
    
    function getTotalClaps(){
        const clapCountData = $('body').html().match(/totalClapCount":(.*)$/gm);
        if(!clapCountData){
            return 0;
        }
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

    function mojoThing(clapsCount){
        var clap = document.getElementById('clap');
    //   var clapIcon = document.getElementById('clap--icon');
      var clapCount = document.getElementById('clap--count');
      var clapTotalCount = document.getElementById('msc-currentVal');
      var initialNumberOfClaps = 10;
    //   var btnDimension = 80;
      var tlDuration = 300;
      var numberOfClaps = 0;
    //   var clapHold = void 0;
      
    //   var triangleBurst = new mojs.Burst({
    //     parent: clap,
    //     radius: { 50: 95 },
    //     count: 5,
    //     angle: 30,
    //     children: {
    //       shape: 'polygon',
    //       radius: { 6: 0 },
    //       scale: 1,
    //       stroke: 'rgba(211,84,0 ,0.5)',
    //       strokeWidth: 2,
    //       angle: 210,
    //       delay: 30,
    //       speed: 0.2,
    //       easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
    //       duration: tlDuration } });
      
      
    //   var circleBurst = new mojs.Burst({
    //     parent: clap,
    //     radius: { 50: 75 },
    //     angle: 25,
    //     duration: tlDuration,
    //     children: {
    //       shape: 'circle',
    //       fill: 'rgba(149,165,166 ,0.5)',
    //       delay: 30,
    //       speed: 0.2,
    //       radius: { 3: 0 },
    //       easing: mojs.easing.bezier(0.1, 1, 0.3, 1) } });
      
      
      var countAnimation = new mojs.Html({
        el: '#clap--count',
        isShowStart: false,
        isShowEnd: true,
        y: { 0: -30 },
        opacity: { 0: 1 },
        duration: tlDuration }).
      then({
        opacity: { 1: 0 },
        y: -80,
        delay: tlDuration / 2 });
      
      
    //   var scaleButton = new mojs.Html({
    //     el: '#clap',
    //     duration: tlDuration,
    //     scale: { 1.3: 1 },
    //     easing: mojs.easing.out });
      
      clap.style.transform = "scale(1, 1)"; /*Bug1 fix*/
      
      var animationTimeline = new mojs.Timeline();
      animationTimeline.add([
    //   triangleBurst,
    //   circleBurst,
      countAnimation,
    //   scaleButton
    ]);
      
    function repeatClapping(clapsCount) {
        if(clapsCount > 0 ){
            var clap1 = "+" + clapsCount;
            console.log(clap1);
            $(".clap--count").html("+" + clapsCount);
        } else {
            $(".clap--count").html(clapsCount);
        }
        animationTimeline.replay();
      }
      
      repeatClapping(clapsCount);
    }
    
})();


