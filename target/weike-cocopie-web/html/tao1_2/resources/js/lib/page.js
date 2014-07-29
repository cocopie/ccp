/*页面框架
 *单页应用的实现
 */

(function(w, d) {
    var that;
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        CLICK_EV = hasTouch ? 'tap' : 'click';
    var page = function() {
        var _el = $('body').find('*');
        that = this;
        that.pages, that.old_pages = [];
        this.el = [];
        $.each(_el, function(index, item) {
            if (item.tagName === 'SCRIPT' || item.tagName === 'LINK') {
                return true;
            }
            if ($(item).data('page') !== undefined) {
                that.el.push(item);
            }
        });
    }

    page.prototype = {
        init: function() {
            that._init();
            w.onhashchange = that.hashChange;
            that.hashChange();
        },
        //每次调用事件
        _init: function(items) {
            if (items) {
                var _el = items;
            } else {
                var _el = that.el;
            }
            $.each(_el, function(index, item) {
                $(item).off(CLICK_EV);
                if (CLICK_EV !== 'click') {
                    $(item).on('click', function(e) {
                        e.preventDefault()
                    })
                }
                $(item).on(CLICK_EV, function(e) {
                    if ($(this).data('type') === 'home') {
                        if(location.hash !== ''){
                            $('.loading').show();
                            that.backHome();
                        }
                        return false;
                    }
                    e.preventDefault();
                    var href = href || $(item).attr('href');
                    var id = id || $(item).data('page');
                    that.addHash(href, id);
                });
            });
        },
        //生成框体
        creatPage: function(el, href, id, type) {
            var href = href || el.attr('href');
            var id = id || el.data('page');
            if ($('#' + id).length > 0) {
                var _html = $('#' + id);
                _html.css('-webkit-transform', 'translateX(0)');
                return false;
            } else {
                if (type === 'left') {
                    var _html = $('<div class="page" id="' + id + '"><div class="content">loading...</div></div>').css('-webkit-transform', 'translateX(-100%)');
                } else {
                    var _html = $('<div class="page" id="' + id + '"><div class="content">loading...</div></div>').css('-webkit-transform', 'translateX(100%)');
                }
                if (that.old_pages.length > 1 && $('.page').length === 2) {
                    $('.page').each(function(i) {
                        if (i > 0) {
                            $(this).css('-webkit-transform', 'translateX(100%)');
                        }
                    });
                } else {
                    $('.page').css('-webkit-transform', 'translateX(-100%)');
                }
                $('.pages').append(_html);
                setTimeout(function() {
                    $('#' + id).css('-webkit-transform', 'translateX(0)');
                }, 0);
                var a = 'scroll_' + id;
                eval('var ' + a + ' = new iscroll_init(id)');
                w['scroll_' + id] = eval(a);
                w['scroll_' + id]['page_refresh'] = that._init;
                w['scroll_' + id]['onJsReady'] = function() {};
                FastClick.attach(document.getElementById(id));
            }
            that.ajaxPage(href, id, eval(a));
        },
        //拼接URL
        addHash: function(href, id) {
            var _hash_code = id + '!' + href;
            if (location.href.indexOf(_hash_code) < 0) {
                if (location.href.indexOf('#') > -1) {
                    location.hash += '#' + _hash_code;
                } else {
                    location.hash = _hash_code;
                }
            } else {
                location.hash = _hash_code;
            }
        },
        //ajax调取页面
        ajaxPage: function(url, id, scroll_id) {
            $.ajax({
                url: url,
                type: 'get',
                success: function(data) {
                    $('#' + id).find('.content').html(data);
                    //判断是否有外部需要引入的JS文件
                    var _scripts = $('#' + id).find('script');
                    var _script = [];
                    if (_scripts.length > 0) {
                        //循环添加需要添加的JS
                        _scripts.each(function() {
                            var _src = $(this).attr('src');
                            if (_src !== '' && _src !== undefined) {
                                var _new_js = that._getScript(_src);
                                if (_new_js) {
                                    _script.push(_new_js);
                                }
                            }
                        });
                    }
                    that._scriptOnReady(_script, id);
                    var items = $('#' + id).find('*[data-page]');
                    that._init(items);
                    scroll_id.refresh();
                },
                error: function() {
                    $('#' + id).html('error');
                }
            });
        },
        //浏览器发生变化
        hashChange: function() {
            try {
                document.addEventListener('WeixinJSBridgeReady', function() {
                    WeixinJSBridge.call('hideToolbar');
                });
                WeixinJSBridge.call('hideToolbar');
            } catch (e) {}
            $('.loading').show();
            $('.title_cont').css({
                'opacity': '0'
            });
            $('.pages').css({
                'opacity': '0'
            });
            $('.footer_bar').hide();
            $('.footer_bar .reply_btn').hide();
            that.pages = location.hash.split('#');
            that.pages[0] === '' ? that.pages.splice(0, 1) : '';
            //判断是否是返回事件
            if (that.old_pages.length > that.pages.length && $('.page').length > 1 && that.pages.length > 0) {
                if($('.header_bar h3').length === 1){
                    $('.header_bar h3').eq(0).remove();
                }else{
                    $('.header_bar h3').eq(that.old_pages.length - 1).remove();
                }
                setTimeout(function() {
                    $('.loading').hide();
                    $('.title_cont').css({
                        'opacity': '1'
                    });
                    $('.header_bar h3').eq(that.pages.length - 1).show();
                    $('.pages').css({
                        'opacity': '1'
                    });
                    $('.footer_bar').show();
                }, 500);
                var more_page = that.old_pages.length - that.pages.length;
                if (that.old_pages.length > 1) {
                    $('.page').last().css('-webkit-transform', 'translateX(100%)');
                } else {
                    $('.page').last().css('-webkit-transform', 'translateX(-100%)');
                }
                var _del_page = $('.page').last().attr('id');
                if ($('.page').length === 1) {
                    that.addPage('left');
                } else {
                    if (that.old_pages.length > 1) {
                        that.addPage('left');
                    } else {
                        that.addPage();
                    }
                }
                setTimeout(function() {
                    for (var i = 0; i < more_page; i++) {
                        $('#' + _del_page).remove();
                        if (w['scroll_' + _del_page]) {
                            w['scroll_' + _del_page].destroy();
                            w['scroll_' + _del_page] = null;
                        }
                        _del_page = $('.page').last().attr('id');
                    }

                }, 300);
                return false;
            }
            //判断是否到首页   
            if (that.pages.length < 1) {
                that.backHome();
            } else {
                that.addPage();
            }
        },
        resetPages: function() {
            $('.title_cont').height(50);
            $('.music_bar').hide();
            $('.header_bar').children().hide();
            $('.pages').height($(window).height() - $('.title_cont').height() - 50);
        },
        addPage: function(type) {
            that.resetPages();
            var _resize = window.onresize;
            window.onresize = function() {
                if (_resize && _resize !== undefined) _resize();
                $('.title_cont').height(50);
                $('.pages').height($(window).height() - $('.title_cont').height() - 50);
            }
            var _href = that.pages[that.pages.length - 1].split('!');
            var _id = _href[0];
            _href = _href[_href.length - 1];
            if (that.old_pages.length > that.pages.length && $('.page').length > 1) {
                that.creatPage('', _href, _id, 'left');
            } else {
                if (type === 'left') {
                    that.creatPage('', _href, _id, type);
                } else {
                    that.creatPage('', _href, _id);
                }
            };
            that.old_pages = that.pages;
        },
        resetIndex: function() {
            $('.title_cont').height(230);
            $('.music_bar').show();
            $('.header_bar nav').show().siblings().remove();
            $('.footer_bar').show();
            $('.pages').height($(window).height() - $('.title_cont').height() - 50);
        },
        //回到首页的方法
        backHome: function() {
            that.resetIndex();
            var _resize = window.onresize;
            window.onresize = function() {
                if (_resize && _resize !== undefined) _resize();
                $('.title_cont').height(230);
                $('.pages').height($(window).height() - $('.title_cont').height() - 50);
                if (typeof homeScroll !== 'undefined') {
                    homeScroll.refresh();
                }
            }
            setTimeout(function() {
                $('.loading').hide();
                $('.title_cont').css({
                    'opacity': '1'
                });
                $('.pages').css({
                    'opacity': '1'
                });
                if (typeof homeScroll !== 'undefined') homeScroll.refresh();
            }, 500);
            location.hash = '';
            $('.page').each(function(i) {
                if (i > 0) {
                    var _self = $(this);
                    _self.css('-webkit-transform', 'translateX(100%)');
                    var _id = _self.attr('id');
                    setTimeout(function() {
                        _self.remove();
                        if (w['scroll_' + _id]) {
                            w['scroll_' + _id].destroy();
                            w['scroll_' + _id] = null;
                        }
                    }, 300);
                }
            });
            $('.page').first().css('-webkit-transform', 'translateX(0)');
        },
        //调用外部JS方法
        _getScript: function(url) {
            var head = d.getElementsByTagName('head')[0];

            var flag = false;
            //判断头部是否已经有需要加载的JS
            $(head).find('script').each(function() {
                console.log($(this).attr('src'));
                if ($(this).attr('src') && $(this).attr('src') !== undefined) {
                    if ($(this).attr('src').indexOf(url) > -1 || url.indexOf($(this).attr('src')) > -1) {
                        flag = true;
                        return false;
                    }
                }

            });

            //如果头部不存在需要添加的JS，则返回需要添加的JS文件
            if (!flag) {
                var js = d.createElement('script');
                js.setAttribute('type', 'text/javascript');
                js.setAttribute('src', url);

                head.appendChild(js);
                return js;
            } else {
                return false;
            }
        },
        //判断外部JS加载完成的方法
        _scriptOnReady: function(scripts, id) {
            var flag = false;
            //循环验证JS的加载状态
            for (var i = 0; i < scripts.length; i++) {
                if (d.all) { //IE
                    scripts[i].onreadystatechange = function() {
                        if (scripts[i].readyState == 'loaded' || scripts[i].readyState == 'complete') {
                            if (i === scripts.length) {
                                flag = true;
                            }
                        }
                    }
                } else {
                    scripts[i].onload = function() {
                        if (i === scripts.length) {
                            flag = true;
                        }
                    }
                }
            }

            //在全部JS加载完成后，执行外部的onJsReady方法
            if (scripts.length > 0) {
                var f = setInterval(function() {
                    if (flag === true || scripts.length === 0) {
                        if (typeof w['scroll_' + id].onJsReady !== 'undefined') {
                            w['scroll_' + id].onJsReady.call(that);
                        }
                        clearInterval(f);
                    }
                }, 1);
            }

        }


    }
    w.page = page;
})(window, document);
