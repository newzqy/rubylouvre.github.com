define("valuechange", ["$event"], function(){
    var DATA = "valuechangeData";
    var ID  = "valuechangeID"
    var interval = 50;
    //如果值前后发生改变,触发绑定回调
    function testChange(elem, type, poll) {
        if(poll){
            $._data(elem, ID, setTimeout(function(){
                testChange(elem, type, poll);
            },interval));
        }
        var old = $._data(elem, DATA);
        var neo = elem.value;
        if(old !== neo){
            $._data(elem, DATA, neo);
            var event = new $.Event("valuechange")
            event.realType = type
            event.oldValue = old;
            event.newValue = neo;
            $.event.fire.call(elem, event)
        }
    }
    function unTestChange(elem){
        var id = $._removeData(elem, ID)
        clearTimeout( id )
        $.log($._removeData)
        $._removeData(elem, DATA);
    }
   
    function startTest(event) {
        var elem = event.target;
        if (event.type == 'mousedown' ) {
            $._data(elem, DATA , elem.value);
        }
        testChange(elem,event.type, true);
    }
    function stopTest(event){
        unTestChange(event.target)
    }
    
    function listen(elem) {
        unlisten(elem);
        "keydown keyup mousedown".replace($.rword, function(name){
            $(elem).bind(name+"._valuechange", startTest)
        })
        $(elem).bind('blur._valuechange', stopTest);
        //http://liumiao.me/html/wd/W3C/264.html
        $(elem).bind('webkitspeechchange._valuechange', function(e){//chrome 11
            testChange(e.target,e.type)
        });
    }
    function unlisten(elem){
        unTestChange(elem)
        $(elem).unbind("._valuechange")
    }
    $.fn.valuechange = function(callback){
         return callback?  this.bind( "valuechange", callback ) : this.fire( "valuechange" );
    }
    $.eventAdapter.valuechange = {
        setup: function(desc){
            var elem = desc.currentTarget, nodeName = elem.tagName;
            if (nodeName == 'INPUT' || nodeName == 'TEXTAREA') {
                listen(elem);
                return false
            }
        },
        tearDown: function (desc) {
            unlisten(desc.currentTarge);
            return false
        }
    }
})
