var mp3src="";
/*!
 * 获取url参数值函数
 */
/*!
 * urlParameters 获取js文件后的url参数组，如：test.js?id=1&classid=2中的?后面的内容
 */
myurlParames = (function(script) {
	var l = script.length;
	for ( var i = 0; i < l; i++) {
		me = !!document.querySelector ? script[i].src : script[i].getAttribute(
				'src', 4);
		if (me.substr(me.lastIndexOf('/')).indexOf('good.js') == 1) {
			mp3src=script[i].getAttribute('mp3Src');
			break;
		}
	}
	return me.split('?')[1];
})(document.getElementsByTagName('script'));
$(function() {
        var commentFlag, introFlag;
        var introTop = $('#intro').offset().top
        var commentTop = $('#comment').offset().top
        $(window).scroll(function(event) {
            if ($(this).scrollTop() >= introTop) {
                if (!introFlag) {
                    console.log('到属性了');
                    send(5);
                    introFlag = true;
                }
            }
            if ($(this).scrollTop() >= commentTop) {
                if (!commentFlag) {
                    console.log('到评价了');
                    send(6);
                    commentFlag = true;
                }
            }
        });
        var _height = $(window).height();
        $('.first-screen').height(_height);
        var h=(_height-450)+"px";
        $('.page-number').css("margin-top",h);

        var myCirclePlayer = new CirclePlayer("#jquery_jplayer_1", {
            mp3: mp3src
        }, {
            cssSelectorAncestor: "#cp_container_1",
        });
        $('.cp-play').click(function(event) {
            $('.cp-avatar').removeClass('cp-avatar-stop');
            $('.q-pause').removeClass('hide');
            $('.q-play').addClass('hide');
        });
        $('.cp-pause').click(function(event) {
            $('.cp-avatar').addClass('cp-avatar-stop');
            $('.q-pause').addClass('hide');
            $('.q-play').removeClass('hide');
        });
        $('.q-play').click(function(event) {
            myCirclePlayer.play();
            $('.q-pause').removeClass('hide');
            $('.q-play').addClass('hide');
        });
        $('.q-pause').click(function(event) {
            myCirclePlayer.pause();
            $('.q-pause').addClass('hide');
            $('.q-play').removeClass('hide');
        });
        var end=false;
        $('audio').bind('play',function(event){
            console.log('开始播放 2')
            send(2);
        }).bind('pause',function(event){
        	//因为完成后会调用一次暂停，所以这里判断是否完成过
        	if(!end){
        		console.log('pause 3');
        		send(3);
        	}
        }).bind('ended',function(event){
        	console.log('ended 4');
        	end=true;
        	send(4);
        }).bind('loadstart',function(event){
        	console.log('loadstart 9');
        	send(9);
        }).bind('canplaythrough',function(event){
        	console.log('canplaythrough 10');
        	send(10);
        });
        //点击带我回家
        $('.buy-btn').on('click', function(e){
    		e.preventDefault();
    		var _useragent = navigator.userAgent.toLowerCase();
    		if(_useragent.indexOf('micromessenger') > -1){
    			if(_useragent.indexOf('iphone') > -1){
    				$('#js-fuck-taobao').find('.js-step-2').removeClass('step-and-2').addClass('step-2');
    			}
    			$('#js-fuck-taobao').show();
    		}
    		console.log("带我回家");
    		send(7);
    	});
    	$('.js-close-taobao').on('click', function(){
    		$('#js-fuck-taobao').hide();
    	});
    	$('.go-list,.back-list').on('click', function(e){
    		e.preventDefault();
    		console.log("去列表");
    		sendAsyNot(11,$(this).attr("href"));
    	});
    });