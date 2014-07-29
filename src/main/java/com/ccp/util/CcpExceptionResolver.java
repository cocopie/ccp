package com.ccp.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;

/**
 * 未来的异常处理可以在这里面做
 * 
 * @author liupengfei@weke.com
 */
public class CcpExceptionResolver extends SimpleMappingExceptionResolver {
	final static Log log = LogFactory.getLog(CcpExceptionResolver.class);

	public ModelAndView resolveException(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex) {
		log.warn("in CcpExceptionResolver...");
		log.warn(ex.toString());
		return super.resolveException(request, response, handler, ex);
	}
}
