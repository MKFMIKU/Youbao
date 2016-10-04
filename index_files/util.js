$V.util = function(){
  function ajax(p){
    p.type = p.type || 'GET';
    p.dataType = p.dataType || 'json';
    var succFun = p.success || '';
    p.success = function(d){
      if(d && d.code && d.code == 9999){
        window.location = d.url || '/';
        return;
      }
      succFun && succFun(d);
    }
    $.ajax(p);
  }
  function confirm(m, yf, nf) {
    $V.MSG.confirm(m, yf, nf);
  }
  
  var lds, ld1, ld2, st, ti = 0;
  function showLoading(s){//s 1 显示  0 隐藏
    lds = lds || $('div#d_l_loading, div#d_l_mask');
    ld1 = ld1 || $('div#d_l_mask');
    ld2 = ld2 || $('div#d_l_loading').css('left', ($(window).width()/2-17.5));
    st && clearInterval(st);
    if(s){
      ld2.show();
  //    ld1.fadeTo(1, 0).fadeTo(300, 0.1);
      console.log(ld1.length);
      ld1.css({display:'block', opacity:'0'});
      st = setInterval(function(){
        if(++ti == 12) ti = 0;
        ld2.css('background-position', '0 ' + (35 * ti) + 'px');
      }, 100);
    }else{
      lds.hide();
    }
  }
  
  return {
    ajax : ajax,
    confirm : confirm,
    alert : confirm,
    msg : confirm,
    log : function(s){1&&window.console.log(s);},
    showLoading : showLoading
  };
}();


$V.MSG = function (m, yf, nf) {
	var wrapper = $('.msgWrap');
    var layer = $('.msgWrap .layer');
    var container = $('.msgWrap .container');
    var title = $('.msgWrap .title');
    var body = $('.msgWrap .body');
    var cancelBtn = $('.msgWrap .action .gray');
    var sureBtn = $('.msgWrap .action .orange');
	
    function MsgFun() {
    	this.wrapper = wrapper;
	    this.layer = layer;
	    this.container = container;
	    this.title = title;
	    this.body = body;
	    this.cancelBtn = cancelBtn.unbind();
	    this.sureBtn = sureBtn.unbind();
	    this.sure = true;
	    this.cancel = false;
	    this.msg = {};
    }
    
    MsgFun.prototype = {
        init: function() {
        	this.title.html('');
        	this.body.html('');
        	this.cancelBtn.hide();
        	this.sureBtn.css('width', '50%');
        	this.msg = {
                cancel: false,
                sure: true,
                body: null,
                title: '友情提醒',
                canotClick : (m && m.canotClick) ? true : false
            };
        	var that = this;
        },
        
        clear: function() {
        	this.init();
        	this.wrapper.find('.button').off();
        },
        
        showMsg: function() {
        	var that = this;
            if ( !! this.msg.title) {
            	this.title.html(that.msg.title);
            }
            this.body.html(this.msg.body);
            if (this.msg.cancel) {
            	this.cancelBtn.show();
            	if(!this.msg.sure){
            	  this.sureBtn.hide();
                this.cancelBtn.css('width', '100%');
            	}
            } else {
            	this.sureBtn.css('width', '100%');
            }
            this.wrapper.show();
            this.container.css('top', ($(window).height() - that.container.height()) / 2 + 'px');
        },
 
        hideMsg: function() {
        	if(this.msg.canotClick) return;
        	this.wrapper.hide();
            this.init();
        },
 
        initMsg: function(m) {
            if (!m) return false;
            if ((typeof m) === 'string') {
            	this.msg.body = m;
            	this.msg.cancel = false;
            } else if ((typeof m) === 'object') {
            	if(!!m.title) this.msg.title = m.title;
            	if(m.cancel != 'undefined' || m.cancel != null) this.msg.cancel = m.cancel;
            	this.msg.sure = typeof m.sure == 'undefined' ? this.msg.sure : m.sure;
            	this.msg.body = m.body;
            }
        },
        
        confirm: function(m, yf, nf) {
            this.initMsg(m);
            this.showMsg();
            var that = this;
            this.cancelBtn.bind('click', function(event) {
            	that.hideMsg();
            	that.destructor();
            	if(!!nf) {
                    nf && nf();
                    nf = null;
                    yf = null;
            	}
                event.preventDefault();
            });
            this.sureBtn.bind('click', function(event) {
            	that.hideMsg();
            	that.destructor();
            	if(!!yf) {
            		yf && yf();
                    nf = null;
                    yf = null;
            	}
                event.preventDefault()
            });
        },
 
        destructor: function() {
        	this.cancelBtn.unbind();
        	this.sureBtn.unbind();
        }
 
    };
 
    var R = function(m, yf, nf){
      $('.msgWrap').hide();
      var msg = new MsgFun();
      msg.init();
      msg.confirm(m, yf, nf);
    };
    
    R.clear = function(){
      wrapper.hide();
    }
    return R;
/*    function alert(m, yf, nf){
        var msg = new MsgFun();
        msg.init(m);
        msg.confirm(m, yf, nf);
      };
    function clear() {
    	var msg = new MsgFun();
        msg.clear();
    }
    return {
    	alert : alert,
    	confirm : alert,
    	clear : clear
    }*/
}();


