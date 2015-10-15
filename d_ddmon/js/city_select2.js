
(function($){
    $.fn.RegionList = function() {
        var cid,scrollTop,data_city;
        var obj_click = $('#social_area');
        var return_btn = $('#region-back-arrow');
        var sideBarCont = $('.sidebar-region-content');
        var obj = $('#cityList');
        var city_id = $('#city_id');//城市最终id隐藏的input
        var cityarr=[];//存储c城市名称
        var flag = false;
        var Region = {
            init: function() {
                cid = 45;
                return_btn.on('click', function () {
                    Region.returnMain();
                });
                Region.getCity();
                Region.setBtnTrigger();
                Region.setEventToLists();

            },
            setBtnTrigger:function() {
                obj_click.on('click', function () {
                    scrollTop = document.body.scrollTop;
                    flag = false;
                    cityarr = [];
                    Region.showBarContent();
                    Region.getRegionInfo(cid,data_city);
                });
            },
            getCity: function() {
                //异步获取城市列表信息
                $.get(cityUrl, function(data) {
                    data_city = data.data;
                    Region.getRegionInfo(cid,data_city);
                    // console.log(data_city)
                });
            },
            getRegionInfo:function(cid,data) {
                setTimeout(function(){
                    if(data &&data.length>0) {
                        console.log(data);
                        Region.drawRegionList(cid,data);
                    }else {
                        
                    }
                },300)
            },
            drawRegionList:function(cid,data) {
                var str = '';
                    obj.html('');
                for (var i = 0; i < data.length; i++) {
                    if (data[i].parent_id == cid) {
                        str += '<li  data-id="' + data[i].id + '"><i class="tick"></i><span> ' + data[i].name + '</span></li>'
                    }else {

                    }
                };
                if(str){
                    console.log(str)
                    obj.append(str);
                    this.setEventToLists();
                }else {
                    Region.getResult(cid,cityarr);
                }
            },
            setEventToLists:function() {
                var ev_li = obj.find('li');
                ev_li.on('click', function(event) {
                    $(this).addClass("checked");
                    cid = $(this).data("id");
                    cityarr.push($(this).text());
                    Region.getRegionInfo(cid,data_city);
                });
            },
            getResult:function(cid,cityarr) {
                var ss = "";
                var dinput = obj_click.find('.data-input');
                for (var i = 0; i < cityarr.length; i++) {
                    ss += cityarr[i]+"";
                };
                dinput.val(ss);
                city_id.val(cid);
                Region.returnMain();
            },
            showBarContent :function() {
                sideBarCont.addClass('on');
            },
            returnMain:function() {
                sideBarCont.removeClass('on');
                cid = 45;
            }
        };
        return Region.init();
    }
})(Zepto);

;(function($){
$.fn.personList = function() {
    var social_person = $('#social_person');//参保人点击入口
    var sideBarCont = $('.sideinsure-content')//参保人的sidebar
    var return_btn = $('#person-back-arrow');
    var select_em = $('.select_em');
    var new_slide_content = $('.new_slide_content');//新建 content
    var new_return = $('#person-new-back-arrow');//新建 返回按钮
    var new_person = $('.new_person');//新建按钮
    var scrolltop ;
    var Person = {

        init: function() {
            var self = this;
            return_btn.on('click', function () {
                Person.returnMain();
            });
            new_return.on('click', function(event) {
                // return_btn.off();
                // alert(666);
                Person.returnNew();
            });
            Person.setBtnTrigger();
        },
        setBtnTrigger:function() {
            social_person.on('click', function () {
                scrollTop = document.body.scrollTop;
                Person.showBarContent();
            });
            new_person.on('click', function(event) {
                Person.showNewContent()
            });
        },
        showBarContent:function() {
            sideBarCont.addClass('on');
        },
        returnMain:function() {
            sideBarCont.removeClass('on');
            
        },
        showNewContent:function() {
            select_em.addClass("hide");
            new_slide_content.removeClass('hide').css("z-index","999999");

        },
        returnNew : function(){
            new_slide_content.addClass("hide");
            select_em.removeClass("hide");
        }
    };
    return Person.init();
}
})(Zepto);

