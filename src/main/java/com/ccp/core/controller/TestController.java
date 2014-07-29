package com.ccp.core.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.ccp.core.entity.Car;
import com.ccp.core.entity.user.CUser;
import com.ccp.util.BaseController;


/**
 * Controller测试
 * @author liupengfei@weke.com
 */
@Controller
public class TestController extends BaseController{
	static Logger log = LoggerFactory.getLogger(TestController.class);

	/**
	 * 返回页面测试
	 * @return
	 */
	@RequestMapping(value ={ "/a/b","/ddd"})
	public ModelAndView toLogin() throws Exception {
		log.debug(" in toLogin ");
		
		CUser c=super.getUser();
		System.out.println(c);
		
		Map<String, Object> map = new HashMap<String, Object>();
		List result = s.carService.selectCarList();
		map.put("result", result);
		map.put("first","11111");
		return new ModelAndView("test", map);
	}
	
	/**
	 * ajax测试
	 * @return
	 */
	@RequestMapping(value = "/aj")
	@ResponseBody
	public Object ajax(){
		log.debug(" in ajax ");
		List<String> list=new ArrayList<String>();
		list.add("aaa");
		list.add("bbb汉字测试ss");
		list.add("cccasdfasdf");
		Map<String,Object> m=new HashMap();
		m.put("fist", "ffff111");
		m.put("second", list);
		return m;
	}
	
	/**
	 * 事务测试1--报错
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/cc")
	public String change(){
		log.debug(" in change ");
		Car car=new Car();
		car.setId(1);
		car.setTotalNumber(r.getIntParameter("t", 111));
		s.carService.changeTotalNumber(car);
		return "redirect:/a/b";
	}
	/**
	 * 事务测试2--OK
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/dd")
	public String change2(){
		log.debug(" in change2 ");
		Car car=new Car();
		car.setId(1);
		car.setTotalNumber(r.getIntParameter("t", 111));
		System.out.println("汉字测试：" + r.getStringParameter("name"));
//		s.carService.changeTotalNumber(car);
		s.carService.updateCarTotalNumber(car);
		return "redirect:/a/b";
	}
	
}
