/*
 * 
 * cookie util
 */


var counterCookie=1;
function wCookie2(){
	var s = gCookie("csession");
	counterCookie++;
	console.log("wc2: "+s);
	// cookie为空 写cookie  5分钟发一次请求保持session
	if((s==null || counterCookie%80==0 )&& gCookie("JSESSIONID") != null){
		console.log("wc2 set cookie: "+s);
		sCookie("csession",gCookie("JSESSIONID"));
		return;
	}
	sCookie("csession",s);
}

function wCookie(){
	var s = gCookie("csession");
	counterCookie++;
	// cookie为空 写cookie  5分钟发一次请求保持session
	if(s==null||counterCookie%80==0 ){
//		alert(location.href+ "  cookie is ："+s);
		 $.ajax({
			url:"/html/xiangmai/list.jsp?p=sc",
			success:function(){
//					alert("set session OK ");
			}

       });
		return;
	}
	sCookie("csession",s);
	
	
	 	
}
	
//读取cookies
function gCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}
function sCookie(name,value){
    
    var exp = new Date();
    exp.setTime(exp.getTime() + 5000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/";
}


$(function() {
    

       //不断写cookie中的session
	setInterval('wCookie2()',3000);

});