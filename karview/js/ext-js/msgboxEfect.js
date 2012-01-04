Ext.onReady(function(){
    Ext.example = function(){
        var msgCt;

        function createBox(t, s){
            return '<div class="msg">' + s + '</div>';
        }
        return {
            msg : function(title, format){
                if(!msgCt){

                    msgCt = document.getElementById("msg-div");

                }
                var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
                var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
                m.hide();
                m.slideIn('t').ghost("t", {
                    duration:8,
                    delay:5,
                    remove: true
                }); //

            },

            init : function(){
            }
        };
    }();
});


