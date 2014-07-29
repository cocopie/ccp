 <%@ page contentType="text/html;charset=UTF-8" language="java"%>
<!DOCTYPE html>
<html >

<head>
    <meta charset="UTF-8">
    <title>响买-用耳朵挑货</title>
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <link rel="stylesheet" type="text/css" href="css/animations.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
	 
</head>

<body>
	<a name="test3"></a>
    <section class="first-screen">
        <div class="nine-icon">
            <img src="images/9.png" alt="">
        </div>
        <div class="list-wapper clearfix">
            <div class="list-title"></div>
            <div class="arr pull-right"></div>
        </div>

    </section>

    <section class="list">
    	<div class="img">
            <a href="test/t5/index.html?v=1311231231"><img src="pic/list/5.png"></a>
        </div>
        <div class="img">
            <a href="test/t3/index.html?v=1311231231"><img src="pic/list/3.png"></a>
        </div>
        <div class="img">
            <a href="test/t7/index.html?v=1311231231"><img src="pic/list/7.png"></a>
        </div>
        <div class="img">
            <a href="test/t6/index.html?v=1311231231"><img src="pic/list/6.png"></a>
        </div>
        <div class="img">
            <a href="test/t9/index.html?v=1311231231"><img src="pic/list/9.png"></a>
        </div>
        <div class="img">
            <a href="test/t2/index.html?v=1311231231"><img src="pic/list/2.png"></a>
        </div>
        <div class="img">
            <a href="test/t10/index.html?v=1311231231"><img src="pic/list/10.png"></a>
        </div>
        <div class="img">
            <a href="test/t8/index.html?v=1311231231"><img src="pic/list/8.png"></a>
        </div>
        <div class="img">
            <a href="test/t4/index.html?v=1311231231"><img src="pic/list/4.png"></a>
        </div>
    </section>
    <script src="js/jquery.1.7.2.min.js" type="text/javascript"></script>
    <script src="js/jquery.mobile.custom.js?v=072501"></script>
    <script src="js/cu.js?v=07250111"></script>
    <script type="text/javascript">

    	var ssession = "<%=session.getId() %>";

    	
    	//服务器端写cookie
    	<%
    		String p = request.getParameter("p");
    		if(p!=null && p.equals("sc")){
    			
    		    Cookie cookie = new Cookie("csession", session.getId());
    		 
    			cookie.setMaxAge(5);
    			cookie.setPath("/");
    			response.addCookie(cookie);
    		    
    			//System.out.println("set cookie Ok !")1;
    		}
    	%>
   
     	
    	
    $(function() {
        $('.nine-icon').addClass("animated fadeInLeft");
        $('.list-wapper').addClass("animated fadeInRight");

		var csession = gCookie("csession");
		//当cookie和session不一致时写cookie
		if(ssession!=csession){
			  $('.first-screen').show();
              $('.list').fadeOut();
              //发请求 写cookie
              $.ajax({
						url:"list.jsp?p=sc&v=072501",
						success:function(){
							console.log("set cookie OK ");
						}

                  });
		}else{
			
        	$('.first-screen').fadeOut();
            $('.list').show()
            $('.img').each(function() {
                var _this = $(this)
                var _index = $(this).index()
                setTimeout(function() {
                    _this.addClass("animated bounceInUp");
                }, 200 * _index)
            });
		}
      
		 $(".first-screen").swipe({
	            swipeUp: function(event, direction, distance, duration) {
	                $('.first-screen').fadeOut();
	                $('.list').show()
	                $('.img').each(function() {
	                    var _this = $(this)
	                    var _index = $(this).index()
	                    setTimeout(function() {
	                        _this.addClass("animated bounceInUp");
	                    }, 200 * _index)
	                });
	            },
	            threshold:30
	        });
	        /*
	        $(".list").swipe({
	            swipeDown: function(event, direction, distance, duration) {
	                $('.first-screen').show();
	                $('.list').fadeOut()
	            },
	            threshold:30
	        });
	*/
	        

    });
    
    </script>
</body>

</html>
