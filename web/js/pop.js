/*
弹出层组件
DEMO
 $('body').popup({
   title:'提示',
   formId:'form1',
   id:'pop-1'
 });
 手动关闭
 $("#pop-1").trigger("close");
 */
(function($) {
    //队列
    var queue = [];
    //默认值配置
    var defaults = {
        id: '',
        formId: null,
        title: "",
        message: "",
        cnacel: "取消",
        onCancel: function() {},
        ok: "确认",
        onOk: function() {},
        cancelOnly: false,
        okOnly: false,
        okClass: 'button',
        cancelClass: 'button',
        onShow: function() {},
        onHide: function() {},
        closeOnOk: true,
        hideTitle: false,
        //重写样式
        popClass: '',
        touchmove: false,
        popOnlyOne: true,
        //是否显示右上角关闭图标
        closeIcon: false
    };
    //弹出层类
    var Popup = (function() {

        var Popup = function(containerEl, opts) {
            this.container = containerEl;
            if (!this.container) {
                this.container = document.body;
            }

            try {
                if (typeof(opts) === "string" || typeof(opts) === "number") {
                    opts = {
                        message: opts,
                        cancelOnly: "true",
                        cnacel: "关闭",
                        hideTitle: true
                    };
                }
                var opts = $.extend({}, defaults, opts);

                if (!opts.title) {
                    opts.hideTitle = true;
                }
                if (!opts.id) {
                    opts.id = 'popup-' + Math.floor(Math.random() * 1000);
                }
                for (var k in opts) {
                    this[k] = opts[k];
                }

                setTimeout($.proxy(this.show, this), 50);
            } catch (e) {
                console.log("配置错误：" + e);
            }
        };

        Popup.prototype = {
            show: function() {
                var _this = this;
                if (_this.popOnlyOne) {
                    _this.popOnlyOne = true;
                    $('.default-popup').remove();

                }

                this.$mask = $mask = $("#pop-mask").length ? $("#pop-mask") : $("<div id='pop-mask' style='opacity:0.3'></div>").appendTo("body");

                if (_this.touchmove) {
                    $('body').css("position", "fixed").css("width", "100%");
                }
                var markup = '<div id="' + this.id + '" class="default-popup hidden ' + this.popClass + '">';
                if (!_this.hideTitle) {
                    markup += '<header>' + this.title + '</header>';
                }
                markup += '<div class="content-body"><div>' + this.message + '</div></div>' +
                    '<footer style="clear:both;">' +
                    '<a href="javascript:;" class="default-popup-cancel ' + this.cancelClass + '">' + this.cnacel + '</a>' +
                    '<a href="javascript:;" class="default-popup-ok ' + this.okClass + '"  >' + this.ok + '</a>' +
                    ' </footer>' +
                    '</div></div>';


                this.$wrap = $wrap = $("#" + this.id).length ? $("#" + this.id) : $(markup).appendTo($(this.container));

                this.$wrap.css("z-index", "10001");
                if(this.closeIcon){
                    this.$wrap.append('<i class="pop-icon-close iconfontcommon icon_error" style=""></i>');
                }

                //添加外部表单
                if (this.formId) {
                    var $content = $(this.container).find('.content-body');
                    var $form = $('#' + this.formId);
                    this.$formParent = $form.parent();
                    $form.appendTo($content);
                }

                if (this.cancelOnly) {
                    $wrap.find('.default-popup-ok').hide();
                    $wrap.find('.default-popup-cancel').addClass('center');
                }
                if (this.okOnly) {
                    $wrap.find('.default-popup-cancel').hide();
                    $wrap.find('.default-popup-ok').addClass('center');
                }
                this.positionPopup();
                setTimeout(function() {
                    _this.positionPopup();
                    //force header/footer showing to fix CSS style bugs
                    $wrap.find("header").show();
                    $wrap.find("footer").show();

                    $wrap.removeClass('hidden').addClass('animate');
                    _this.onShow(_this);
                }, 300);


                this.bindEvents();
            },

            hide: function() {
                var _this = this;
                this.$wrap.addClass('hidden');
                $('body').css("position", "static");
                _this.$wrap.removeClass('animate');
                setTimeout(function() {
                    _this.remove();
                    $('.default-popup').length === 0 && _this.removeMask();//最后一个弹窗增移除蒙层
                },400);
            },
            setMaskHeight: function() {
                this.$mask.css({
                    "height": Math.max($(window).height(), $(document).height()),
                    //"height":"100%",
                    "position": "fixed"
                });
                //console.log("resizeed");
            },
            remove: function() {
                var _this = this;
                if (_this.onHide) {
                    _this.onHide.call();
                }
                var $wrap = this.$wrap;

                if (_this.formId) {
                    var $form = $('#' + _this.formId);
                    $form.appendTo(_this.$formParent);
                }

                $wrap.unbind("close");
                $wrap.find('.default-popup-ok').unbind('click');
                $wrap.find('.default-popup-cancel').unbind('click');
                $wrap.unbind("orientationchange").remove();

                //Add 2015-12-22 fix 有弹框的时候窗体高度变化
                $(window).off("resize", $.proxy(_this.setMaskHeight, _this));
            },
            removeMask: function() {
                 var $mask = this.$mask;
                 $mask.length && $mask.unbind("touchstart").unbind("touchmove").remove();
            },
            positionPopup: function() {
                var w0 = $(window).width() || 360,
                    h0 = $(window).height() || 500,
                    w1 = $wrap[0].clientWidth || 300,
                    h1 = $wrap[0].clientHeight || 100;

                this.$wrap.css("top", ((h0 / 2)) - (h1 / 2) + "px")
                    .css("left", (w0 / 2) - (w1 / 2) + "px")
                    .css("margin", 0 + " auto");

                this.setMaskHeight();
            },
            bindEvents: function() {
                var _this = this;

                if (_this.touchmove) {
                    _this.touchmove = false;
                    setTimeout(function() {
                        _this.touchmove = true;
                    }, 300);
                }

                var $wrap = this.$wrap;
                $wrap.find('a').each(function() {
                    var button = $(this);
                    button.bind('click', function(e) {
                        if (button.hasClass('default-popup-cancel')) {
                            _this.onCancel.call(_this);
                            _this.hide();
                        } else if (button.hasClass('default-popup-ok')) {
                            var r = _this.onOk.call(_this);
                            if (r !== false) {
                                _this.hide();
                            }
                        }
                       // e.preventDefault();
                    });
                });

                $wrap.bind("orientationchange", function() {
                    _this.positionPopup();
                }).bind("close", function() {
                    _this.hide();
                }).bind("touchmove", function(e) {
                    e.preventDefault();
                });

                $wrap.find('.pop-icon-close').bind('tap', function (e) {
                   _this.hide();
                });


                //$wrap.find(".content-body").on("touchend",function(e){
                $wrap.find(".content-body").bind("touchmove", function(e) {
                    var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
                    var nScrollTop = 0;   //滚动到的当前位置
                    var nDivHight = $wrap.find(".content-body").height();


                    e = e ? e : window.event;
                    if (!_this.touchmove) {
                        e.preventDefault();
                    }
                    e.cancelBubble && e.cancelBubble();
                    e.stopPropagation && e.stopPropagation();
                });

                this.$mask.bind("touchstart", function(e) {
                    e.preventDefault();
                }).bind("touchmove", function(e) {
                    e.preventDefault();
                });
                //Add 2015-12-22 fix 有弹框的时候窗体高度变化
                $(window).on("resize", $.proxy(_this.resize, _this));

            },
            resize: function(){
                this.setMaskHeight();
                this.positionPopup();
            }
        };
        return Popup;
    })();


    //注册到对象
    $.fn.popup = function(opts) {
        return new Popup(this[0], opts);
    };
})(Zepto);
