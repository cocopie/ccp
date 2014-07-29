package com.ccp.processor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dick.weixin.base.message.bean.request.message.TextMessage;
import com.dick.weixin.base.message.bean.response.message.TextResMessage;
import com.dick.weixin.base.message.response.IResponseMessage;
import com.dick.weixin.base.message.response.ResponseMessageFactory;
import com.dick.weixin.base.processor.IProcessor;
import com.dick.weixin.utils.Constant;

public class TestProcessor implements IProcessor<TextMessage> {
	static Logger log = LoggerFactory.getLogger(TestProcessor.class);

	@Override
	public IResponseMessage processor(TextMessage t) {
		// TODO Auto-generated method stub
		log.info("in TestProcessor.processor");
		log.info(" text: "+t.getContent());
		IResponseMessage responseMessage = ResponseMessageFactory
				.getRequestMessage(Constant.RESP_MESSAGE_TYPE_TEXT, t);
		TextResMessage textMessageTemp = (TextResMessage) responseMessage
				.getBean();
		textMessageTemp.setContent(t.getContent());
		return responseMessage;
	}

}
