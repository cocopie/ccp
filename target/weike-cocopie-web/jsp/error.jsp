<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ page import="java.util.Enumeration" %>
<html>
<head>
<title>出错了-error.jsp</title>
</head>
<body>
<h2>报错了，保存信息如下：</h2>
<%
Enumeration e=request.getAttributeNames();
while(e.hasMoreElements()){
	String name=e.nextElement().toString();
	if(name.contains("excep")||name.contains("error")){
		out.print("<br/><B style='color:red;font-size:22px;'>【"+name+"】</B>");
		out.print("<span style='color:red;font-size:16px;'>"+request.getAttribute(name)+"</span>");
	}else{
		out.print("<br/><B>["+name+"]</B>");
		out.print(request.getAttribute(name));
	}
}
%>
</body>
</html>