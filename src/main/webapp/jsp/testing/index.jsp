<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html>
	<head>
		<title>数据结果</title>
	</head>
	<body>
		<h2>数据结果</h2>
		<div>
			<p>总访问人数(微信+外部，外部会多算一次): ${t0}</p>
			<p>step1（微信打开）用户数: ${t1}</p>
			<p>step2（开始播放）用户数: ${t2}</p>
			<p>step3（暂停）用户数: ${t3}</p>
			<p>step4（听完）用户数: ${t4}</p>
			<p>step5（浏览到属性）用户数: ${t5}</p>
			<p>step6（浏览到评论）用户数: ${t6}</p>
			<p>step7（点击带我回家）用户数: ${t7}</p>
			<p>step8（外部浏览器打开）用户数: ${t8}</p>
			<p><a href="/t/data">刷新</a></p>
		</div>
	</body>
</html>