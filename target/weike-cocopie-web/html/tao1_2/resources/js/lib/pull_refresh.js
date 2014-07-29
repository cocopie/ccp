function pullRefresh(scroll, options) {
    options = $.extend({}, options);
    var pullUpEl = options.pullUpEl;
    var pullDownEl = options.pullDownEl;
    var pullUpFunc = options.pullUpFunc;
    var pullDownFunc = options.pullDownFunc;
    if (pullUpFunc && pullUpFunc !== undefined) {
        var pullUpOffset = pullUpEl.height();
    }

    var _move = scroll.options.onScrollMove;
    var _end = scroll.options.onScrollEnd;
    var _refresh = scroll.options.onRefresh;


    if (pullDownFunc && pullDownFunc !== undefined) {
        var pullDownOffset = pullDownEl.height();
        scroll.options.useTransition = true;
        scroll.options.topOffset = pullDownOffset;
    }

    scroll.options.onRefresh = function() {
        _refresh && _refresh.call(scroll, arguments);
        if (pullDownFunc && pullDownFunc !== undefined) {
            if (pullDownEl.hasClass('loading')) {
                pullDownEl.removeClass().addClass('pullDown');
                pullDownEl.find('.pullDownLabel').html('下拉刷新');
            }
        }
        if (pullUpFunc && pullUpFunc !== undefined) {
            if (pullUpEl.hasClass('loading')) {
                pullUpEl.removeClass().addClass('pullUp');
                pullUpEl.find('.pullUpLabel').html('加载更多');
            }
        }

    }
    scroll.options.onScrollMove = function() {
        _move && _move.call(scroll, arguments);
        if (pullDownFunc && pullDownFunc !== undefined) {
            //下拉滚动事件
            //此处this指向iScroll框架
            if (this.y > 5 && !pullDownEl.hasClass('flip')) {
                pullDownEl.addClass('flip');
                pullDownEl.find('.pullDownLabel').html('松开刷新');
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.hasClass('flip')) {
                pullDownEl.removeClass().addClass('pullDown');
                pullDownEl.find('.pullDownLabel').html('下拉刷新');
                this.minScrollY = -pullDownOffset;
            }
        }
        if (pullUpFunc && pullUpFunc !== undefined) {
            //上拉滚动事件
            //此处this指向iScroll框架
            if (this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip')) {
                pullUpEl.addClass('flip');
                pullUpEl.find('.pullUpLabel').html('松开加载更多');
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.hasClass('flip')) {
                pullUpEl.removeClass().addClass('pullUp');
                pullUpEl.find('.pullUpLabel').html('加载更多');
                this.maxScrollY = pullUpOffset;
            }
        }

    }
    scroll.options.onScrollEnd = function() {
        _end && _end.call(scroll, arguments);
        if (pullDownFunc && pullDownFunc !== undefined) {
            if (pullDownEl.hasClass('flip')) {
                pullDownEl.removeClass().addClass('pullDown');
                pullDownEl.addClass('loading');
                pullDownEl.find('.pullDownLabel').html('刷新中...');
                if (pullUpFunc && pullUpFunc !== undefined) {
                    pullUpEl.removeClass().addClass('pullUp');
                }
                pullDownFunc();
            }
        }
        if (pullUpFunc && pullUpFunc !== undefined) {
            if (pullUpEl.hasClass('flip')) {
                pullUpEl.removeClass().addClass('pullUp');
                pullUpEl.addClass('loading');
                pullUpEl.find('.pullUpLabel').html('加载中...');
                pullUpFunc();
            }
        }
    }
}