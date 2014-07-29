package com.ccp.core.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.ccp.core.entity.comm.CommonVisitHistory;
import com.ccp.util.BaseController;

/**
 * 访问统计 需要统计的页面引用JS，发送请求到这个地址
 * 
 * @author liupengfei@weke.com
 * 
 */
@Controller
public class VisitHistoryController extends BaseController {
	@RequestMapping(value = "/ccp_v_r")
	@ResponseBody
	public void writeVisit() {
		try {
			Integer visitedType = r.getIntParameter("",1);
			Integer visitedId = r.getIntParameter("",2);
			Integer visitorId = r.getIntParameter("",3);
			String visitorCookie = r.getStringParameter("","cookie");

			String url = "";
			String ip = "";
			String referer = "";
			String userAgent = "";
			CommonVisitHistory cv=new CommonVisitHistory();
			cv.setVisitedType(visitedType);
			cv.setVisitedId(visitedId);
			cv.setVisitorId(visitorId);
			cv.setVisitorCookie(visitorCookie);
			cv.setUrl(url);
			cv.setIp(ip);
			cv.setReferer(referer);
			cv.setUserAgent(userAgent);
			System.out.println(new Date());
			cv.setVisitTime(new Date());
//			s.commonVisitHistoryService.saveCommonVisitHistory(cv);
			
			System.out.println(RequestContextHolder.getRequestAttributes());
			RequestAttributes ra=RequestContextHolder.getRequestAttributes();
			ServletRequestAttributes sr=(ServletRequestAttributes) ra;
			HttpServletRequest request = sr.getRequest();
			
			HttpServletResponse response = super.getResponse();
			response.setContentType("text/Xml;charset=gbk");
			PrintWriter out = null;
			try {
				out = response.getWriter();
				out.print("var v_r_ccp=0;");
			} catch (IOException ex1) {
				ex1.printStackTrace();
			} finally {
				out.close();
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

}
