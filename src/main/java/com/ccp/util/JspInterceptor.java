package com.ccp.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class JspInterceptor extends HandlerInterceptorAdapter{
	public boolean preHandle(HttpServletRequest req, HttpServletResponse res,
			Object handler) {
		System.out.println(" in JspInterceptor ,"+req.getRequestURI());
		return false;
	}
}