$("#userPwd").on({
    focus: function () {
        $("#loginBtn").addClass("swing active");
    },
    blur: function () {
        $("#loginBtn").removeClass("swing active")
    }
});
//
$("#comLogoBtn").on("click", function () {
    $("#comBoxer").animate({
        height: "536px"
    }, 1000)
})
//
/*var $menu = $("#headerMenu");
var current = true;
$(window).scroll(function () {
    if ($(this).scrollTop() > 0 && current) {
        current = false;
        $menu.css({ paddingTop: 0 }).children(".head-wrap").css({ width: '100%' });
    }
    if ($(this).scrollTop() == 0) {
        current = true;
        $menu.css({ paddingTop: '2%' }).children(".head-wrap").css({ width: '90%' });;
    }
});*/