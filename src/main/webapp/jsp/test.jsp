<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Insert title here</title>
</head>
<body>
	显示：
	<c:if test="${result ne null}">
		数据：<br />
		<c:forEach items="${result }" var="item">
			${item.id }--${item.name }--${item.price }--${item.totalNumber }<br />
		</c:forEach>
	</c:if>
	
	<form action="/dd" method="post">
		修改ID=1的totalNumber
		数字：<input name="t" />
		后台获取汉字测试：<input name="name" />
		<button type="submit" value="提交">提交</button>
	</form>
</body>
</html>