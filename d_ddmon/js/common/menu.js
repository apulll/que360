//checkbox
$(":radio, :checkbox").uniform();
//登录下拉
$("#headerLoginBtn").on({
    mouseenter: function () {
        $("#headerLoginForm").slideDown();
        $("#headerLoginForm").on("mouseleave", function () {
            $("#headerLoginForm").slideUp();
        });
    },
    mouseleave: function () {
        var _this = this;
        setTimeout(function () {
            if (!$("#headerLoginForm:hover").length) {
                $("#headerLoginForm").slideUp();
            }
        }, 100);
    }
})
$("#userPwd").on({
    focus: function () {
        $("#loginBtn").addClass("active");
    },
    blur: function () {
        $("#loginBtn").removeClass("active");
    }
});
//登陆;
$("#loginForm").validate({
    // 验证规则
    rules: {
        email: {
            required: true,
            byteRangeLength: [6, 30],
            isEmail: true
        },
        password: {
            required: true,
            minlength: 6,
            maxlength: 15
        },
        //code: {
        //    required: true,
        //    isNumber: false,
        //    minlength: 6,
        //    maxlength: 6
        //}
    },
    // 设置错误信息
    messages: {
        email: {
            required: "请输入电子邮箱",
            byteRangeLength: "请输入正确的电子邮箱",
            isEmail: "请输入正确的电子邮箱",
            remote: '该电子邮箱已被注册'
        },
        password: {
            required: '登陆密码必须填写',
            minlength: '登陆密码不正确',
            maxlength: '登陆密码不正确'
        },
        code: {
            required: "请输入验证码",
            isNumber: "请输入正确的验证码",
            minlength: "请输入6位验证码",
            maxlength: "验证码错误"
        }
    },
    ignore: "#PWD",
    // 错误信息显示
    errorPlacement: function (error, element) {

    },
    invalidHandler: function (form, validator) {
        // $("#pp").html(this.numberOfInvalids());
        //if ($("#emailAgree").is(":checked")) {
        //    this.defaultShowErrors();
        //}
        $.each(validator.errorList, function (key, value) {
            $(value.element).parent().parent().shake(4, 10, 400);
            $("#loginErrorMsg").show().text(value.message);
            return false;
        });
    },
    // 成功信息显示
    success: function (error, element) {
        // $("#loginErrorMsg").hide();
    },
    submitHandler: function (form) {
        var param = $("#loginForm").serialize();
        $.ajax({
            cache: true,
            type: "POST",// 请求类型
            url: "/account/login",
            async: false,
            data: param,
            success: function (data) {
                if (data.status) {
                    window.location.href = data.msg;
                }
                else {
                    $('#loginErrorMsg').show().text(data.msg);
                }
            },
            error: function () {
                alert("后台出错，哥不说'请稍后再试'了就是后台出错了，啦啦啦");
            }
        });
    }
});

$(function () {
    //购物车数量
    if (!login_flag) {
        return false;
    } else {
        $.ajax({
            url: '/api/money/shopcart_num',
            type: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.status) {
                    $("#shopCartNum").text(data.msg);
                }
            },
            error: function () {
                // alert("后台出错，哥不说'请稍后再试'了就是后台出错了，啦啦啦");
            }
        });
    }
})
//$('#demo').BootSideMenu(
//    {
//        side: "right",
//    }
//    );
////侧边栏
//$("#userIcoBtn").on("click", function () {
//    $("#demo").animate({
//        right: 0
//    })
//    return false;
//})


jQuery(document).ready(function ($) {
    var $lateral_menu_trigger = $('#cd-menu-trigger,#userIcoBtn'),
		$content_wrapper = $('.cd-main-content'),
		$navigation = $('header');

    //open-close lateral menu clicking on the menu icon
    $lateral_menu_trigger.on('click', function (event) {
        event.preventDefault();

        $lateral_menu_trigger.toggleClass('is-clicked');
        $navigation.toggleClass('lateral-menu-is-open');
        $content_wrapper.toggleClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
            //$('body').toggleClass('overflow-hidden');
        });
        $('#cd-lateral-nav').toggleClass('lateral-menu-is-open');

        //check if transitions are not supported - i.e. in IE9
        if ($('html').hasClass('no-csstransitions')) {
            //$('body').toggleClass('overflow-hidden');
        }
    });

    //close lateral menu clicking outside the menu itself
    $content_wrapper.on('click', function (event) {
        if (!$(event.target).is('#cd-menu-trigger, #cd-menu-trigger span')) {
            $lateral_menu_trigger.removeClass('is-clicked');
            $navigation.removeClass('lateral-menu-is-open');
            $content_wrapper.removeClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                //$('body').removeClass('overflow-hidden');
            });
            $('#cd-lateral-nav').removeClass('lateral-menu-is-open');
            //check if transitions are not supported
            if ($('html').hasClass('no-csstransitions')) {
                // $('body').removeClass('overflow-hidden');
            }

        }
    });

    //open (or close) submenu items in the lateral menu. Close all the other open submenu items.
    $('.item-has-children').children('a').on('click', function (event) {
        event.preventDefault();
        $(this).toggleClass('submenu-open').next('.sub-menu').slideToggle(200).end().parent('.item-has-children').siblings('.item-has-children').children('a').removeClass('submenu-open').next('.sub-menu').slideUp(200);
    });
});

//登录密码框
$("#headerPwd").on({
    focus: function () {
        $("#loginBtn").addClass("swing active");
    },
    blur: function () {
        $("#loginBtn").removeClass("swing active")
    }
});
//工具栏
$('#leftToolsList a').popover({
    placement: 'left',
    trigger: 'hover',
    html: true
})
$('#leftToolsList a').on({
    mouseenter: function () {
        $(this).find("i").addClass("hover");
    },
    mouseleave: function () {
        $(this).find("i").removeClass("hover");
    }
})
//回到顶部
var $fixedWrap = $('#leftTools');
var $goTop = $('#toolsBacktopBtn');
function ContactusPos() {
    //手机隐藏
    if ($(window).width() < 1000) {
        $("#tools").css("display", "none");
        return;
    }
    if ($(this).scrollTop() > 0) {
        $goTop.slideDown(300);
    } else {
        $goTop.slideUp(300);
    }

    var a = $("body").innerHeight(), b = $(window).height(), c = parseInt($(this).scrollTop()), d = a - c - b;

    280 > d ? $fixedWrap.css({
        position: "absolute",
        bottom: "308px"
    }) : $fixedWrap.css({
        position: "fixed",
        bottom: "50%"
    })
}

//页面加载判断一次
ContactusPos();
$(window).scroll(function () {
    ContactusPos();
});

$goTop.click(function () {
    $('body, html').animate({
        scrollTop: 0
    }, 800);
});
//...
function preLoadImg(url) {
    var img = new Image();
    img.src = url;
}
preLoadImg("images/tools_weixin.png");

//全局ajax
$.ajaxSettings.beforeSend = function (XHR) {
    $("#top-tip").stop(true,true).fadeIn(500);
}
$.ajaxSettings.complete = function (XHR) {
    $("#top-tip").stop(true, true).fadeOut(500);
}
jQuery.fn.shake = function(intShakes /*Amount of shakes*/, intDistance /*Shake distance*/, intDuration /*Time duration*/) {
    this.each(function() {
        var jqNode = $(this);
        jqNode.css({position: 'relative'});
        for (var x=1; x<=intShakes; x++) {
            jqNode.animate({ left: (intDistance * -1) },(((intDuration / intShakes) / 4)))
            .animate({ left: intDistance },((intDuration/intShakes)/2))
            .animate({ left: 0 },(((intDuration/intShakes)/4)));
        }
    });
    return this;
}