package com.ccp.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ui.ModelMap;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.context.request.WebRequestInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.DispatcherServletWebRequest;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ccp.util.Config;
import com.ccp.util.CookieHelper;
import com.ccp.util.user.UserCookieUtil;

/**
 * 记录用户访问足迹
 * 
 * @author liupengfei@weke.com
 * 
 */
public class VisitInterceptor extends HandlerInterceptorAdapter {

	static Logger log = LoggerFactory.getLogger(VisitInterceptor.class);
	/**
	 * 未登录时请求URL，在跳到登录时需要临时保存
	 */
	public final static String URI_BEFORE_LOGIN = "_to_url";

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		// TODO Auto-generated method stub
		log.debug(" preHandle " + this.toString());
		String url=request.getRequestURL().toString();
		log.info("url=" + url);
		String wxccpCookie = CookieHelper.getCookieValue(request,
				CookieHelper.COOKIE_NAME_CUSER);
		System.out.println("wxccpCookie=" + wxccpCookie);
		if (StringUtils.isEmpty(wxccpCookie)) {
			//如果是debug状态，则给cookie中写入一个
			if (Config.DEBUG) {
				log
						.info(" in debug ...no user in cookie,write a default cookie");
				String cookieValue=UserCookieUtil.makeCookie(1, "om_zSjhI6tZlZIcpaE7GZ7u3b6bM");
				CookieHelper.setCookie(response,
						CookieHelper.COOKIE_NAME_CUSER, cookieValue);
			} else {
				log.info("没有COOKIE,引导登录,记录当前请求URL和参数，为了下次登录回跳");
				CookieHelper.setCookie(response, URI_BEFORE_LOGIN,
						url, 60 * 5);
				response.sendRedirect("http://baidu.com");
				return false;
			}
		}
		// 记录请求开始时间
		request.setAttribute("beginTime", System.currentTimeMillis());
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		if (Config.DEBUG) {
//			log.debug(" postHandle " + this.toString());
			long now = System.currentTimeMillis();
			long begin = (Long) request.getAttribute("beginTime");
			log.debug(" postHandle use time = " + (now - begin));
		}
	}

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex) {
		if (Config.DEBUG) {
//			log.debug(" afterCompletion " + this.toString());
			long now = System.currentTimeMillis();
			long begin = (Long) request.getAttribute("beginTime");
			log.debug(" afterCompletion use time = " + (now - begin));
		}
	}

}
