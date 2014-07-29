(function(w, d) {
    var that; //that指向Init对象
    var Init = function(wrapper_id, options) {
        this.wrapper_id = wrapper_id;
        this.options = options;
        this.obj = $('#' + this.wrapper_id);
        var supportsOrientationChange = "onorientationchange" in window;
        this.orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
        if (this.options && this.options !== undefined) {
            this.pullDownFunc = this.options.pullDownFunc;
            this.pullUpFunc = this.options.pullUpFunc;
        } else {
            this.options = {};
        }
        that = this;
        var _myScroll = this.init(this.wrapper_id, this.options);
        return _myScroll;
    };

    Init.prototype = {
        //初始化函数
        init: function(w_id, op) {
            //如果容器元素存在，创建框体
            if (that.obj.length > 0) {
                that.obj.css({
                    'z-index': 1,
                    'position': 'absolute',
                    'bottom': 0,
                    'width': '100%'
                });
                var _myScroll = that._init(w_id, op);
                return _myScroll;
            } else {
                return false;
            }
        },
        //初始化方法
        _init: function(w_id, op) {
            var _myScroll;
            op = that.regOptions();
            _myScroll = new iScroll(w_id, op);
            //横屏竖屏事件
            w.addEventListener(that.orientationEvent, function() {
                setTimeout(function() {
                    _myScroll.refresh();
                }, 1000);
            }, false);
            //屏幕大小改变事件
            w.addEventListener('resize', function() {
                _myScroll.refresh();
            }, false);
            //页面加载完毕事件
            var imgs = document.getElementsByTagName('img');
            if (imgs.length > 0) {
                for (var i = 0; i < imgs.length; i++) {
                    imgs[i].addEventListener('load', function() {
                        _myScroll.refresh();
                    }, false);
                }
            }
            if (that.options.start) that.options.start.call(that);
            return _myScroll;
        },
        //下拉刷新
        pullDown: function() {
            if (that.pullDownFunc && that.pullDownFunc !== undefined) {
                that.pullDownEl = $('#pullDown');
                that.pullDownEl.html('<div class="pullInner"><span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span></div>');
                that.pullDownOffset = that.pullDownEl.height();
                that.pullDownAction = that.pullDownFunc;
                that.options.useTransition = true;
                that.options.topOffset = that.pullDownOffset;
            }
        },
        //上拉加载更多
        pullUp: function() {
            if (that.pullUpFunc && that.pullUpFunc !== undefined) {
                that.pullUpEl = $('#pullUp');
                that.pullUpEl.html('<span class="pullUpIcon"></span><span class="pullUpLabel">加载更多...</span>')
                that.pullUpOffset = that.pullUpEl.height();
                that.pullUpAction = that.pullUpFunc;
            }
        },
        //添加动作
        pullRefresh: function() {
            if (that.pullDownFunc && that.pullDownFunc !== undefined) {
                that.pullDownRefresh();
            }
            if (that.pullUpFunc && that.pullUpFunc !== undefined) {
                that.pullUpRefresh();
            }

        },
        //下拉刷新改变样式
        pullDownRefresh: function() {
            if (that.pullDownEl.hasClass('loading')) {
                that.pullDownEl.removeClass();
                that.pullDownEl.find('.pullDownLabel').html('下拉刷新');
            }
        },
        //上拉更多改变样式
        pullUpRefresh: function() {
            if (that.pullUpEl.hasClass('loading')) {
                that.pullUpEl.removeClass();
                that.pullUpEl.find('.pullUpLabel').html('加载更多');
            }
        },
        //滚动事件
        pullScroll: function() {
            if (that.pullDownFunc && that.pullDownFunc !== undefined) {
                //下拉滚动事件
                //此处this指向iScroll框架
                if (this.y > 5 && !that.pullDownEl.hasClass('flip')) {
                    that.pullDownEl.addClass('flip');
                    that.pullDownEl.find('.pullDownLabel').html('松开刷新');
                    this.minScrollY = 0;
                } else if (this.y < 5 && that.pullDownEl.hasClass('flip')) {
                    that.pullDownEl.removeClass();
                    that.pullDownEl.find('.pullDownLabel').html('下拉刷新');
                    this.minScrollY = -that.pullDownOffset;
                }
            }
            if (that.pullUpFunc && that.pullUpFunc !== undefined) {
                //上拉滚动事件
                //此处this指向iScroll框架
                if (this.y < (this.maxScrollY - 5) && !that.pullUpEl.hasClass('flip')) {
                    that.pullUpEl.addClass('flip');
                    that.pullUpEl.find('.pullUpLabel').html('松开加载更多');
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && that.pullUpEl.hasClass('flip')) {
                    that.pullUpEl.removeClass();
                    that.pullUpEl.find('.pullUpLabel').html('加载更多');
                    this.maxScrollY = that.pullUpOffset;
                }
            }
        },
        //下拉滚动完成事件
        pullDownScrollEnd: function() {
            if (that.pullDownEl.hasClass('flip')) {
                that.pullDownEl.removeClass();
                that.pullDownEl.addClass('loading');
                that.pullDownEl.find('.pullDownLabel').html('刷新中...');
                if (that.pullUpFunc && that.pullUpFunc !== undefined) {
                    that.pullUpEl.removeClass();
                }
                that.pullDownAction();
            }
        },
        //上拉滚动完成事件
        pullUpScrollEnd: function() {
            if (that.pullUpEl.hasClass('flip')) {
                that.pullUpEl.removeClass();
                that.pullUpEl.addClass('loading');
                that.pullUpEl.find('.pullUpLabel').html('加载中...');
                that.pullUpAction();
            }
        },
        //滚动完成事件
        pullScrollEnd: function() {
            if (that.pullDownFunc && that.pullDownFunc !== undefined) {
                that.pullDownScrollEnd();
            }
            if (that.pullUpFunc && that.pullUpFunc !== undefined) {
                that.pullUpScrollEnd();
            }
        },
        //注册事件
        regOptions: function() {
            that.options.onBeforeScrollStart = function(e) {
                var target = e.target;
                while (target.nodeType != 1) target = target.parentNode;
                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                    e.preventDefault();
            }
            if ((that.pullDownFunc && that.pullDownFunc !== undefined) || (that.pullUpFunc && that.pullUpFunc !== undefined)) {
                that.pullDown();
                that.pullUp();
                that.options.onRefresh = that.pullRefresh;
                that.options.onScrollMove = that.pullScroll;
                that.options.onScrollEnd = that.pullScrollEnd;
            }
            return that.options;
        }
    }

    w.iscroll_init = Init;
})(window, document);