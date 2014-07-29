/*
 * 此文件依赖zepto.js
*/
var host="http://192.168.30.208";
//var host="http://ccp.weke.com";
var url=host+"/t/r";
var url2=host+"/t/r2";
//当前调用的产品ID
var id=null;
//需要跳转到的第三方地址
var url3d=null;
var from=null;
/*
 * 判断是否是微信浏览器
 */
function isInWeixin(){
	var _useragent1 = navigator.userAgent.toLowerCase();
	return _useragent1.indexOf('micromessenger') > -2;
}
/**
 * 发送请求到服务器
 */
function send(t){
	console.log(" in send,id="+id+",st="+t);
	if(id!=null){
		$.ajax({type:'get',url:url,data:{"id":id,"st":t,"from":from},success:function(data){
			console.log("ajax success:"+data.c);
			//这里可以避免分享的时候带了hash,朋友打开会自动重新更新为自己的cookie对应的hash
			window.location.hash=getCookie("ccp_testing");
		}});
	}
}
/**
 * 同步方法
 * @param id 数据ID
 * @param t 步骤编号
 * @param url3rd 第三方ur;
 * @return
 */
function sendAsyNot(t){
	console.log(" in sendAsyNot,id="+id+",st="+t+",c="+window.location.hash);
	/* */
	if(id!=null && url3d!=null){
		$.ajax({type:'get',url:url2,async:'false',data:{"id":id,"st":t,"c":window.location.hash},
			success:function(data){
				//window.location.href=url3d;
			}
		});
	}
	
}
//读取cookies
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}
function setCookie(name,value){
    var Days = 300;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}


/*!
 * urlParameters 获取js文件后的url参数组，如：test.js?id=1&classid=2中的?后面的内容
 */
urlParameters = (function(script) {
	var l = script.length;
	for ( var i = 0; i < l; i++) {
		me = !!document.querySelector ? script[i].src : script[i].getAttribute(
				'src', 4);
		if (me.substr(me.lastIndexOf('/')).indexOf('s.js') == 1) {
			url3d=script[i].getAttribute('url3rd');
			break;
		}
	}
	return me.split('?')[1];
})(document.getElementsByTagName('script'));
/*!
 * 获取url参数值函数
 */
GetParameters = function(name) {
	if (urlParameters && urlParameters.indexOf('=') > 0) {
		var parame = urlParameters.split('&'), i = 0, l = parame.length, arr;
		for ( var i = 0; i < l; i++) {
			arr = parame[i].split('=');
			if (name === arr[0]) {
				return arr[1];
			}
		}
	}
	return null;
}
/**
 * 获取网页URL参数
 * @param name
 * @return
 */
function getQueryString(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


id=GetParameters("id");
//console.log(id);
//console.log(url3d);
if(id==null || url3d==null){
	alert("严重错误，缺少必要参数！");
}
/*通用处理
 */
var send1=false;
if(isInWeixin()){
	console.log("in wx");
	//这里用变量记录打开动作，避免发两次的情况
	if(!send1){
		send(1);
		send1=true;
	}
}else{
	console.log("not in wx,step=8 and redirect to 3d url");
	sendAsyNot(8);
}
from=getQueryString("f")
console.log(from);