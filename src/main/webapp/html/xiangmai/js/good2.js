var mp3url="";
var musicTimeAll=0;

myurlParames = (function(script) {
	var l = script.length;
	for ( var i = 0; i < l; i++) {
		me = !!document.querySelector ? script[i].src : script[i].getAttribute(
				'src', 4);
		if (me.substr(me.lastIndexOf('/')).indexOf('good2.js') == 1) {
			mp3url=script[i].getAttribute('mp3Src');
			musicTimeAll=script[i].getAttribute('t');
			console.log("mp3url+"+mp3url);
			console.log("musicTimeAll+"+musicTimeAll);
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
        
        //计算位置
        var h2 = $('.arr:eq(0)').offset().top;
        var h1 = $('#cp_container_1').offset().top+170;
    	var th=h2-h1;
        if(th>47){
        	$('.page-number').css("margin-top",((th-47)/2)+"px");
        }else{
        	$('.page-number').css("margin-top",(0)+"px");
        }

        //点击带我回家
        $('.buy-btn').on('click', function(e){
    		e.preventDefault();
    		var _useragent = navigator.userAgent.toLowerCase();
    		//if(_useragent.indexOf('micromessenger') > -1){
    			if(_useragent.indexOf('iphone') > -1){
    				$('#js-fuck-taobao').find('.js-step-2').removeClass('step-and-2').addClass('step-2');
    			}
    			$('#js-fuck-taobao').show();
    		//}
    		console.log("带我回家");
    		send(7);
    	});
    	$('.js-close-taobao').on('click', function(){
    		$('#js-fuck-taobao').hide();
    	});
    	$('.go-list,.back-list a').on('click', function(e){
    		e.preventDefault();
    		console.log("去列表");
    		sendAsyNot(11,$(this).attr("href"));
    	});
    });
var end=false;
//以下是播放器处理
var myAudio = new Audio();
$(function() {
    myAudio.src = mp3url;
    $('.cp-play,.q-play').click(function(event) {
        $('.cp-avatar').removeClass('cp-avatar-stop');
        $('.cp-play').hide();
        $('.cp-pause').show();
        $('.q-pause').removeClass("hide");
        $('.q-play').addClass("hide");
        play();
    });
    $('.cp-pause,.q-pause').click(function(event) {
        $('.cp-avatar').addClass('cp-avatar-stop');
        $('.cp-play').show();
        $('.cp-pause').hide();
        $('.q-pause').addClass('hide');
        $('.q-play').removeClass('hide');
        ccppause();
    });
    $(myAudio).bind('ended',function(){
    	$('.cp-avatar').addClass('cp-avatar-stop');
        $('.cp-play').show();
        $('.cp-pause').hide();
        $('.q-pause').addClass('hide');
        $('.q-play').removeClass('hide');
    });
    
    $(myAudio).bind('ended',function(){
    	$('.cp-avatar').addClass('cp-avatar-stop');
        $('.cp-play').show();
        $('.cp-pause').hide();
        $('.q-pause').addClass('hide');
        $('.q-play').removeClass('hide');
        hasEnd=true;
        console.log("end,"+myAudio.ended);
        clearInterval(moveE);
        //end send ajax
        console.log('ended 4');
    	end=true;
    	send(4);
    });
    
    $(myAudio).bind('play',function(event){
        console.log('开始播放 2')
        send(2);
    }).bind('pause',function(event){
    	console.log('pause 3');
    	send(3);
    }).bind('loadstart',function(event){
    	console.log('loadstart 9');
    	send(9);
    }).bind('canplaythrough',function(event){
    	console.log('canplaythrough 10');
    	send(10);
    });
});
var hasEnd=false;//刚刚结束过一次
var musicTimeShow=musicTimeAll*1000;
var degreeAll=270;

var rotate=0;
var moveE;
function move(){
    var t=myAudio.currentTime;
	rotate=(t/musicTimeAll)*degreeAll;
	if(rotate>270){
		rotate=270;
    }
	$("#start").css("transform","rotate("+rotate+"deg)");
	var bigRotate=rotate+45;
	$(".cp-progress-holder").show();
	if(rotate<135){
		$(".cp-progress-1").css("transform","rotate("+bigRotate+"deg)");
		$(".cp-progress-2").hide();
	}else{
		$(".cp-progress-holder").addClass("cp-gt50");
		$(".cp-progress-2").css("transform","rotate("+bigRotate+"deg)").show();
	}
	showTime(musicTimeShow-t*1000);
}

//播放
function play(){
    if(hasEnd){
    	myAudio.src = mp3url;
    	hasEnd=false;
    	$(".cp-progress-holder").removeClass("cp-gt50");
    	$(".cp-progress-1,.cp-progress-2").css("transform","rotate(0deg)");
    	$(".cp-progress-2").hide();
    	$("#start").css("transform","rotate(0deg)");
    }
	myAudio.play();
	moveE=setInterval(move, 200);
}
//暂停
function ccppause(){
	myAudio.pause();
	clearInterval(moveE);
}
//显示倒计时
function showTime(tt){
	var exam = Math.round(tt / 1000);
	var minate=parseInt(exam/60.0);
	var seco=parseInt(exam-parseInt(minate*60));
	var etime ="";
	if(minate<1){
		minate="00";
    }else if(minate<10){
    	minate="0"+minate;
    }
    if(seco<1){
    	seco="00";
    }else if(seco<10){
    	seco="0"+seco;
    }
	$(".jp-duration:eq(0)").text(minate+":"+seco);
}