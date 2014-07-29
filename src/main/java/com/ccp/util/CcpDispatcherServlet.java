package com.ccp.util;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.support.PropertiesLoaderUtils;

import com.ccp.util.web.CcpBaseDispatcherServlet;
import com.dick.weixin.utils.ConfigUtil;

/**
 * 继承SpringMvc的DispatcherServlet
 * 
 * @author liupengfei@weke.com
 * 
 */
public class CcpDispatcherServlet extends CcpBaseDispatcherServlet {

	static Logger log = LoggerFactory.getLogger(CcpDispatcherServlet.class);
	static String PROPERTIES_NAME = "ccp_web_config.properties";
	// 加载配置文件，其他地方使用时，可以通过这个对象获取
	public static Properties properties = null;

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		log.info(" CcpDispatcherServlet init... ");
		initCcp();
		log.info(" CcpDispatcherServlet init OK! ");
	}

	// 加载配置文件，做一些初始化
	private void initCcp() {
		try {
			properties = PropertiesLoaderUtils
					.loadAllProperties(PROPERTIES_NAME);
			ConfigUtil.APPID = properties.getProperty("wx.appid");
			ConfigUtil.SECRET = properties.getProperty("wx.secret");
			ConfigUtil.TOKEN = properties.getProperty("wx.token");
			Config.DEBUG="true".equals(properties.getProperty("debug"));
			if(Config.DEBUG){
				System.out.println(" 正在DEBUG模式中，修改请在ccp_web_config.properties中设置");
			}
		} catch (IOException e) {
			log.error(" 初始化读取配置发生异常 " + e.toString());
			e.printStackTrace();
		}
	}

}
