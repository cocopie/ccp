package com.ccp.testing.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ccp.core.entity.comm.CommonVisitHistory;
import com.ccp.util.BaseController;
import com.ccp.util.IPUtil;

/**
 * 用于测试产品模型的数据统计查看
 * 
 * @author liupengfei@weke.com
 * 
 */
@Controller
public class TestingController extends BaseController {
	static Logger log = LoggerFactory.getLogger(TestingController.class);
	//产品模型测试中使用的用于定位用户身份的cookie名称
	final static String COOKIE_NAME_TESTING="ccp_testing";
	/**
	 * 微信内部发送的请求
	 * 统计记录
	 * st含义
	 * 打开页面：1
	 * 开始播放：2
	 * 暂停：3
	 * 播放中止：4
	 * 滑动到产品详情：5
	 * 滑动到产品评价：6
	 * 点击带我回家：7
	 * 新浏览器打开时：8
	 * @return
	 */
	@RequestMapping(value = "/t/r")
	@ResponseBody
	public Object addRecord() {
		Map<String, Object> m = new HashMap();
		//判断有无cookie，如果没有，则初始化一个写入
		String cookie=super.getCookieValue(COOKIE_NAME_TESTING);
		if(StringUtils.isEmpty(cookie)){
			cookie=UUID.randomUUID().toString();
			super.setCookie(COOKIE_NAME_TESTING, cookie);
			log.info("没有查到Cookie,新创建一个："+cookie);
		}
		//访问对象
		Integer visitedId=r.getIntParameter("id");
		//操作到哪一步
		Integer step=r.getIntParameter("st");
		if(visitedId==null || step==null){
			//参数不够
			m.put("r", 0);
			m.put("msg", "缺少必要参数");
			return m;
		}
		log.info("id="+visitedId+",st="+step);
		CommonVisitHistory cv=new CommonVisitHistory();
		cv.setVisitedType(CommonVisitHistory.VISITED_TYPE_TEST);
		cv.setVisitedId(visitedId);
		cv.setStep(step);
		cv.setVisitorCookie(cookie);
		HttpServletRequest req=super.getRequest();
		cv.setIp(IPUtil.getClientIP(req));
		cv.setReferer(req.getHeader("referer"));
		cv.setUserAgent(req.getHeader("user-agent"));
		cv.setVisitTime(new Date());
		if(1 == step){
			//如果是打开页面操作，记录页面的访问来源
			cv.setValue(req.getParameter("from"));
			m.put("count", 100+s.commonVisitHistoryService.countPlayMusic(
					CommonVisitHistory.VISITED_TYPE_TEST, visitedId, 1));
			
			//记录访问时的网络类型
			CommonVisitHistory net=new CommonVisitHistory();
			net.setVisitedType(CommonVisitHistory.VISITED_TYPE_TEST);
			net.setVisitorCookie(cookie);
			net.setVisitTime(cv.getVisitTime());
			net.setVisitedId(visitedId);
			net.setStep(13);//13用来记录访问的网络类型
			//微信的agent可以区分，其他浏览器如UC则不含wifi标识，不过不要紧，我们只支持微信内部打开
			if(cv.getUserAgent().toLowerCase().contains("wifi")){
				net.setValue("wifi");
			}else{
				net.setValue("other");
			}
			s.commonVisitHistoryService.saveCommonVisitHistory(net);
		}
		s.commonVisitHistoryService.saveCommonVisitHistory(cv);
		m.put("r", 1);
		m.put("st", step);
		m.put("c", cookie);
		return m;
	}
	
	/**
	 * 用于外部浏览器发送请求
	 * @return
	 */
	@RequestMapping(value = "/t/r2")
	@ResponseBody
	public Object addRecord2() {
		Map<String, Object> m = new HashMap();
		//这个方法用于外部浏览器打开，使用URL里传递的参数
		//这里的cookie来自微信里,cookie取自window.location.hash，所以要将#去掉
		String cookie=r.getStringParameter("c");
		if(StringUtils.isNotEmpty(cookie)){
			if(cookie.indexOf("#")==0){
				cookie=cookie.substring(1);
			}
		}
		//访问对象
		Integer visitedId=r.getIntParameter("id");
		//操作到哪一步
		Integer step=r.getIntParameter("st");
		if(visitedId==null || step==null){
			//参数不够
			m.put("r", 0);
			m.put("msg", "缺少必要参数");
			return m;
		}
		log.info("id="+visitedId+",st="+step);
		CommonVisitHistory cv=new CommonVisitHistory();
		cv.setVisitedType(CommonVisitHistory.VISITED_TYPE_TEST);
		cv.setVisitedId(visitedId);
		cv.setStep(step);
		cv.setVisitorCookie(cookie);
		HttpServletRequest req=super.getRequest();
		cv.setIp(IPUtil.getClientIP(req));
		cv.setReferer(req.getHeader("referer"));
		cv.setUserAgent(req.getHeader("user-agent"));
		cv.setVisitTime(new Date());
		s.commonVisitHistoryService.saveCommonVisitHistory(cv);
		m.put("r", 1);
		m.put("st", step);
		m.put("c", cookie);
		return m;
	}
}
