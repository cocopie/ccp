package com.ccp.testing.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.ccp.util.BaseController;

/**
 * 用于测试产品模型的统计支持
 * 
 * @author liupengfei@weke.com
 * 
 */
@Controller
public class DataLookController extends BaseController {
	static Logger log = LoggerFactory.getLogger(DataLookController.class);

	/**
	 * 统计记录
	 * 
	 * @return
	 * @throws ParseException 
	 */
	@RequestMapping(value = "/t/data")
	public ModelAndView index() throws ParseException {
		Map<String, Object> map = new HashMap<String, Object>();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date begin = format.parse("2014-07-03");
		Date end = format.parse("2015-01-01");
		Integer t0=s.commonVisitHistoryService.count(1, 1,null,null);
		Integer t1=s.commonVisitHistoryService.countWithStep(1, 1,1,begin,end);
		Integer t2=s.commonVisitHistoryService.countWithStep(1, 1,2,begin,end);
		Integer t3=s.commonVisitHistoryService.countWithStep(1, 1,3,begin,end);
		Integer t4=s.commonVisitHistoryService.countWithStep(1, 1,4,begin,end);
		Integer t5=s.commonVisitHistoryService.countWithStep(1, 1,5,begin,end);
		Integer t6=s.commonVisitHistoryService.countWithStep(1, 1,6,begin,end);
		Integer t7=s.commonVisitHistoryService.countWithStep(1, 1,7,begin,end);
		Integer t8=s.commonVisitHistoryService.countWithStep(1, 1,8,begin,end);
		map.put("t0", t0);
		map.put("t1", t1);
		map.put("t2", t2);
		map.put("t3", t3);
		map.put("t4", t4);
		map.put("t5", t5);
		map.put("t6", t6);
		map.put("t7", t7);
		map.put("t8", t8);
		return new ModelAndView("testing/index", map);
	}
}
