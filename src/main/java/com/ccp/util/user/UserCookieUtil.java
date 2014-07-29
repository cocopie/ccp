package com.ccp.util.user;

import com.ccp.core.entity.user.CUserBind;
import com.ccp.util.XXTea;

/**
 * user cookie操作工具类
 * 
 * @author liupengfei@weke.com
 * 
 */
public class UserCookieUtil {
	final static String F = ",";

	public static String makeCookie(Integer userId, String openId) {
		String str = String.valueOf(userId) + F + openId;
		return XXTea.encrypt(str);
	}

	public static CUserBind getUserFromCookie(String cookieValue) {
		if (cookieValue == null) {
			return null;
		}
		String after=XXTea.decrypt(cookieValue);
		String ids[]=after.split(F);
		if(ids.length!=2){
			return null;
		}
		CUserBind c=new CUserBind();
		c.setUserId(Integer.parseInt(ids[0]));
		c.setBindId(ids[1]);
		return c;
	}
	public static void main(String[] args) {
		System.out.println(makeCookie(1,"om_zSjhI6tZlZIcpaE7GZ7u3b6bM"));
		
		String mm="p34vzq12SSa6kAM7XBa3A1YyoLZA7313olhspV7kNA7opu8w";
		CUserBind c=getUserFromCookie(mm);
		System.out.println(c.getUserId()+"  "+c.getBindId());
	}
}
