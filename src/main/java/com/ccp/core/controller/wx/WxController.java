package com.ccp.core.controller.wx;

import java.io.IOException;
import java.util.Enumeration;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ccp.core.entity.user.CUser;
import com.ccp.core.entity.user.CUserBind;
import com.ccp.interceptor.VisitInterceptor;
import com.ccp.processor.TestProcessor;
import com.ccp.util.BaseController;
import com.ccp.util.CookieHelper;
import com.ccp.util.https.HttpClient;
import com.ccp.util.user.UserCookieUtil;
import com.dick.weixin.base.control.IControl;
import com.dick.weixin.base.control.impl.MessageControl;
import com.dick.weixin.base.processor.IProcessor;
import com.dick.weixin.base.processor.ProcessorFactory;
import com.dick.weixin.utils.ConfigUtil;
import com.dick.weixin.utils.Constant;
import com.dick.weixin.utils.MessageUtil;

/**
 * 和微信认证、交互的入口
 * 
 * @author liupengfei@weke.com
 * 
 */
@Controller
@RequestMapping(value = { "/ccpwx" })
public class WxController extends BaseController {
	static Logger log = LoggerFactory.getLogger(WxController.class);

	@RequestMapping(value = "/wx", method = RequestMethod.GET)
	@ResponseBody
	public Object index(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		log.info(" 微信认证请求begin...");
		// 微信加密签名
		String signature = request.getParameter("signature");
		// 时间戳
		String timestamp = request.getParameter("timestamp");
		// 随机数
		String nonce = request.getParameter("nonce");
		// 随机字符串
		String echostr = request.getParameter("echostr");
		log.info("signature=" + signature);
		log.info("timestamp=" + timestamp);
		log.info("nonce=" + nonce);
		log.info("echostr=" + echostr);
		try {
			boolean check = MessageUtil.checkSignature(signature, timestamp,
					nonce, ConfigUtil.TOKEN);
			log.info(" 微信认证请求end...check=" + check);
			if (check) {
				return echostr;
			} else {
				return "error";
			}
		} catch (Exception ex) {
			return "error";
		}
	}

	@RequestMapping(value = "/wx", method = RequestMethod.POST)
	private void doPost(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		log.info("==========in doPost===========");
		IControl control = new MessageControl();
		Map<String, IProcessor> map = ProcessorFactory.getProcessorMap();
		map.put(Constant.REQ_MESSAGE_TYPE_TEXT, new TestProcessor());
		control.normalFlowControl(request, response);
	}
	/**
	 * 授权登陆回调-高级授权
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/ucode")
	public void ucode(HttpServletRequest request, HttpServletResponse response){
		Enumeration names = request.getParameterNames();
		while(names.hasMoreElements()){
			String n=(String)names.nextElement();
			log.info(n+" = "+request.getParameter(n));
		}
		String code=request.getParameter("code");
		String url="https://api.weixin.qq.com/sns/oauth2/access_token?appid="+ConfigUtil.APPID
		+"&secret="+ConfigUtil.SECRET+"&code="+code+"&grant_type=authorization_code";
		String content=HttpClient.getHttps(url);
		log.info("get access_token url:"+content);
		
		JSONObject obj=(JSONObject)JSON.parse(content);
		String openId=obj.getString("openid");
		String access_token=obj.getString("access_token");
		String refresh_token=obj.getString("refresh_token");
		Integer expires_in=obj.getInteger("expires_in");
//		String scope=obj.getString("scope");
		
		/*log.info("access_token:"+access_token);
		log.info("refresh_token:"+refresh_token);
		log.info("openid:"+openId);
		log.info("scope:"+scope);
		log.info("expires_in:"+expires_in);*/
		
		String url2="https://api.weixin.qq.com/sns/userinfo?access_token="
			+obj.getString("access_token")+"&openid="+
			obj.getString("openid")+"&lang=zh_CN";
		String content2=HttpClient.getHttps(url2);
		log.info(content2);
		JSONObject obj2=(JSONObject)JSON.parse(content2);
		String nickname=obj2.getString("nickname");
		String headimgurl=obj2.getString("headimgurl");
		String country=obj2.getString("country");
		String province=obj2.getString("province");
		String city=obj2.getString("city");
		Integer sex=obj2.getInteger("sex");
		
		CUserBind cUserBind=new CUserBind();
		cUserBind.setNick(nickname);
		cUserBind.setHeadImgUrl(headimgurl);
		cUserBind.setBindType(CUserBind.BIND_TYPE_WX);//微信
		cUserBind.setToken(access_token);
		cUserBind.setRefreshToken(refresh_token);
		cUserBind.setExpires(expires_in);
		cUserBind.setSex(sex);
		cUserBind.setCountry(country);
		cUserBind.setProvince(province);
		cUserBind.setCity(city);
		//检查openId是否已经注册过
		CUser cuser=s.cUserService.getCUserByWxOpenId(openId);
		if(cuser!=null){
			log.info(" 此用户数据已经在系统中，openId="+openId);
			//在这里可以操作更新bind表中某几个数据字段--token/expires/
		}else{
			//是第一次授权登录，则保存进数据库
			log.info(" 此用户尚未在系统中注册,开始注册流程，openId="+openId);
			cuser=s.cUserService.saveNewUserFromWx(cUserBind);
		}
		//登录成功，开始写Cookie
		CookieHelper.setCookie(response, CookieHelper.COOKIE_NAME_CUSER, 
				UserCookieUtil.makeCookie(cuser.getId(), openId));
		//登录成功，跳转到登录前访问的页面地址
		String toUrl = CookieHelper.getCookieValue(request,
				VisitInterceptor.URI_BEFORE_LOGIN);
		if (StringUtils.isEmpty(toUrl)) {
			log.info("登录成功，没有发现登录目标前的意向URL,跳转到指定的默认页面");
			toUrl = "http://qq.com";
		}
		try {
			//移除登录回调URL
			CookieHelper.removeCookie(response,VisitInterceptor.URI_BEFORE_LOGIN);
			response.sendRedirect(toUrl);
		} catch (IOException e) {
			e.printStackTrace();
		}
		/*PrintWriter out;
		try {
			out = response.getWriter();
			out.print(content2);
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}*/
	}

}
