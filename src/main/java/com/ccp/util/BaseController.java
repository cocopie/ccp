package com.ccp.util;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ccp.core.entity.user.CUser;
import com.ccp.core.entity.user.CUserBind;
import com.ccp.util.user.UserCookieUtil;
import com.ccp.util.web.CcpBaseController;

/**
 * 所有controller父类
 * 
 * @author liupengfei@weke.com
 * 
 */
public abstract class BaseController extends CcpBaseController{
	static Logger log=LoggerFactory.getLogger(BaseController.class);
	
	/**
	 * 获取当前requset请求中的CUser
	 * @return
	 */
	public CUser getUser() {
		String wxccpCookie = CookieHelper.getCookieValue(super.getRequest(),
				CookieHelper.COOKIE_NAME_CUSER);
		if (StringUtils.isEmpty(wxccpCookie)) {
			return null;
		}
		try{
			CUserBind c=UserCookieUtil.getUserFromCookie(wxccpCookie);
			return s.cUserService.getCUserByWxOpenId(c.getBindId());
		}catch(Exception ex){
			log.error(ex.toString());
			return null;
		}
	}
}
