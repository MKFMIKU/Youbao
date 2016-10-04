$(function() {
	$V.controller.productDetail.start();
	$V.outtradeNo;
});

$V.controller.productDetail = function() {
	function start(){
		bindEvent();
	}	
	
	function bindEvent(){
		
		var coupons   	= $('.coupon');
		var couponInfo 	= $('.couponInfo');
		
		var payBtn    	= $('.btnbox');				//支付按钮
		var realPay   	= $('.realpay');			//支付金额
		var jisuan      = $('.st2');             //计算过程
		
		var payMethod	= $('.pay_method_ubox');	//友宝余额支付方式
	  	var useCoupon	= $('.use_coupon');			//使用友宝优惠券
	  	var useDiscount	= $('.use_discount');		//使用友宝折扣
		
		var address 	= $('.address');			//售货机位置导航
	  	
	  	//售货机位置导航
		address.click(function() {
	      	var map 	= $(this);
	      	var vmlat	= map.attr('vm-lat');
	      	var vmlng	= map.attr('vm-lng');
	      	var vmname	= map.attr('vm-name');
	      	var vmaddress	= map.attr('vm-address');
	      	var vmurl	= map.attr('vm-url');
	      	 	
	      	if(Number(vmlat) > 0 && Number(vmlng) > 0) {
				wx.openLocation({
					latitude: Number(vmlat),
		      		longitude: Number(vmlng),
		      		name: String(vmname),
		      		address: String(vmaddress),
		      		scale: 14,
		      		infoUrl: String(vmurl)
		    	});      
	    	}
		});
		
		jisuan.click(function(){
			$V.MSG({'cancel' : true, 'sure' : false, 'body' : '友宝根据用户在1元有宝支付1元钱后，产生的手Q交易单号计算。<br> 交易单号末10位数除以商品价格（以分为单位），如余数在0~99间，则为中奖。', 'canotClick' : false, 'title' : '计算过程'}, function(){});
    		return;
		});
		
		payMethod.click(function() {
			  var Days = 365;
			  var exp = new Date();
			  exp.setTime(exp.getTime() + Days*24*60*60*1000);
			  document.cookie = 'isOn' + "="+ escape ('isOn') + ";expires=" + exp.toGMTString();
			  var isOn	= payMethod.hasClass('on');
			
			//支付效果切换
			if(isOn) {
				//当前已选中，点击后取消标识
			  exp.setTime(exp.getTime('-1'));
			  document.cookie = 'isOn' + "="+ escape ('') + ";expires=" + exp.toGMTString();
			  payMethod.removeClass('on');
			 
			} else {
				//当前未选中，选中后增加选中标识
			  payMethod.addClass('on');
			}

		});
		
	    //立即支付
	    payBtn.on('click', function() {
	    	
			var isOnUobx	= payMethod.hasClass('on');		//true: 当前ubox余额支付	false: 当前手Q支付
			
			//支付金额	
			if(isOnUobx) {
				//当前处于选中，不做任何处理

			} else {
				//当前处于未选中，选中后修改支付金额
				$V.MSG({'cancel' : true, 'sure' : false, 'body' : '请先阅读并同意《服务协议》', 'canotClick' : false, 'title' : '用户协议条款'}, function(){});
	    		return;
			}
			
			function getCookie(name){ //读取cookie
				var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
				if(arr=document.cookie.match(reg))
				return unescape(arr[2]);
				else
				return null;
			  }
		   function setCookie(name,value){ //设置cookie
				var limitTime = 2;  //小时
				var exp = new Date();
				exp.setTime(exp.getTime() + limitTime*60*60*1000);
				document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
			  }
		      var tipcontexts = [
		             	    '已连续参与10次，休息一会也许手气会更好呢！',
		             	    '也真不怕手机累着，反正售货机需要休息啦！',
		             	    '别总低头玩手机，跟我一起左三圈、右三圈做会运动吧！',
		             	    '已经进入沉迷状态，本宝宝强制你下线休息！',
		             	    '作业写完了吗？工作完成了吗？梦想实现了吗？给你思考！'
		             	   ];
			  var userCountNum = 1;
	          if(getCookie('userCount')){
	              userCountNum = parseInt(getCookie('userCount'))+1;
	          }
	          if(userCountNum%10 == 0){
	        	  var suijinum = Math.floor(Math.random()*tipcontexts.length);
	        	  $V.MSG({'cancel' : false, 'sure' : true, 'body' :tipcontexts[suijinum] , 'canotClick' : false, 'title' : '防沉迷提示'}, function(){});
	          	  setCookie('userCount',userCountNum);
	          	  return;
	          }
	          setCookie('userCount',userCountNum);
			
	    	//支付中...
	    	var btn = $(this);
	    	if(btn.hasClass('paying')) {
	    		//$.get('/statistics/ajax_page_log?s=b_new-payBtn_click_paying-' + $V.key + '-' + $V.weixinId);
	    		$V.MSG({'cancel' : true, 'sure' : false, 'body' : '正在进行支付，请稍候...', 'canotClick' : false, 'title' : '下单失败:('}, function(){});
	    		return;
	    	};
	    	btn.addClass('paying');
	    	
	    	//获取支付状态中...	点击确认跳转至支付结果页面
	    	$V.MSG({'cancel' : false,  'sure' : false, 'body' : '正在获取支付状态，请稍候...', 'canotClick' : true}, function() {
	    		//btn.html('正在获取支付状态，请稍候...');
      			//延迟5秒显示支付结果页面
      			/*
	    		setTimeout(function(){
        			payOK(1);
      			}, 	5000);*/
      			//允许重新支付
      			$('.btnbox').removeClass('paying')
	    	});
	    	
	    	var self   = $(this);
	      	var vmcode = $V.vmcode;
	      	var vmtype = $V.vmtype;
	      	var pid    = $V.pid;
	      	var pname = $V.pname;

	      	var postData = {
	          	'vmcode'   : vmcode,
	          	'vmtype' : vmtype,
	          	'pid' : pid,
	          	'pname' : pname
	       	}
	       	//创建支付订单
	       	var ajaxUrl	= '/wingame/ajax_pay_pars?' + Math.random();
	       
	       	$V.util.ajax({
	           	url       : ajaxUrl,
	           	type      : 'post',
	           	data      : postData,
	           	dataType  : 'json',
	           	success   : function(d){
	           		//处理订单结果
	           		callThirdPay(d)
	           	}
	       	});
	       	
	       	return false;
	    });
	}
	
	//唤起手Q的支付界面框
    function callThirdPay(d) {
        if(d.code == '20000' && d.status == 1) {
            outTradeNo = d.data.trade_id; 
            $V.outtradeNo = outTradeNo;
            mqq.tenpay.pay({ tokenId: d.data.token_id, 
				pubAcc: "3187074187",
				pubAccHint: "关注友宝公众账号",
				appInfo: "appid#200461737|bargainor_id#1216228901|channel#wallet" }, 
				function(result, resultCode){ 
					payCallback(result);
					payBtn.html('立即购买');
					payBtn.removeClass('paying');
					});
        } else {
            $V.MSG({'cancel' : false, 'body' : d.msg ? d.msg : '购买失败!'});
            cancelPay();
        }
    }	

    //支付完 后的 回调 d＝'{result:{"status":"9000"}}'
    function payCallback(d){ 
    	if(d.resultCode==0){
			$V.MSG({'cancel' : false, 'body' : '购买成功!', 'canotClick' : true});
			payOK(1);
		}else{
			$V.MSG({'cancel' : false, 'body' : d.retmsg});
		}
    }
    
  	//清除定时器
  	function delNotifyOut(){
    	notifyOut && clearTimeout(notifyOut);
  	}

  	//用户取消了支付
	function cancelPay(){
	  	//android，取消支付，页面为拿到焦点，无法修改ui~~直接刷页面
	  	if($V.is_android){
	    	window.location = window.location.href;
	  	}else{
	  		//按钮文字修改
  	  		$('.btnbox').removeClass('paying'); //.html('立即购买');
  	  		//隐藏弹框
      		$V.MSG.clear();
	  	}
	}
  
  	//支付完成，跳到订单页  1.页面js返回支付成功  2.页面轮训返回支付成功
  	function payOK(success){
    	if(success){
    		window.location = "/qr/winrepay?outTradeNo=" + $V.outtradeNo +"&vmcode="+ $V.vmcode + "&vmtype="+ $V.vmtype + "&pid=" + $V.pid+ "&repay=1";
      		window.event.returnValue = false;
    	}else {
    		window.location = window.location.href;
    	}
  	}
  
	return {
		start : start
	};
}();
