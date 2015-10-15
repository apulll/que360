$(function() {

    //开关按钮
     $(".p-content .p-title label").on("click", function (e) {
        e.preventDefault();
        if ($(this).hasClass("open")) {
            $(this).removeClass("open").children().attr("value", 0);
            $(this).parent().next().addClass("hide");
        } else {
            $(this).addClass("open").children().attr("value", 1);
            $(this).parent().next().removeClass("hide");
        }
    })

 //先把所有的城市列表保存在内存
    var censusList  = []; //险种列表
    var reserveList = []; //公积金列表
    var social_lower = social_upper = reserve_lower = reserve_upper = 0; //各项最大值最小值

    //城市选择
    $('#forArea').on('change', '.areaSel', function(e){
        e.preventDefault();

        var $self    = $(this); //当前元素
        var $parent  = $self.closest('#forArea');
        var areaId   = $self.val();

        $self.next('.areaSel').remove();

        if (areaId == '' || areaId == 'undefined'){
            //清空显示的下级的城市列表
            resetToInit();
            return false;
        }

        var optionStr = '';
        var hasCensus = false; //当前城市是否有险种类型
        $.each(areaList, function(index, el){ //循环获取下级城市
            if (el.parent_id == areaId){
                optionStr += '<option value="'+el.id+'">'+el.name+'</option>';
            }
            if (el.id == areaId){
                hasCensus = el.hasCensus;
            }
        });

        if (optionStr != '' && $self.find('option:selected').attr('data-flag') != 'true'){ //有子选项的话，会有个
            // $self.next('.areaSel').remove();
            var aIndex = $parent.find('.areaSel:last').index();
            var opText = aIndex == 0 ? '请选择城市' : '请选择区县';
            if (hasCensus){ //当前选中的城市也有险种类型,这里再添加个标识符
                optionStr  = '<option value="'+areaId+'" data-flag="true">'+$self.find('option:selected').text()+'</option>' + optionStr;
            }
            $self.after('<select class="areaSel newArea"><option value="">'+opText+'</option>'+optionStr+'</select>');
            resetToInit();
        }else {
            $('#city_id').val(areaId);
            //该异步处理获取社保公积金参数据了
            $.ajax({
                url: securityURL,
                type: 'POST',
                data: {
                    _token: _token,
                    city_id: areaId //城市
                },
                dataType: 'JSON',
                success: function(data){
                    if (data.status){ //返回成功了
                        censusList  = data.data.census;
                        reserveList = data.data.reserve;
                    }else {
                        //暂时先不处理错误信息吧
                        censusList  = [];
                        reserveList = [];
                    }
                    getCensus();
                    getReserve();
                }
            });
        }
    });

    //显示险种类型(随城市变动)
    function getCensus(){
        if (censusList.length > 0){ //开始填充社保相关的信息
            var optionStr = '';
            $.each(censusList, function(index, el){
                optionStr += '<option value="'+el.census_id+'">'+el.census_name+'</option>';
            })
            //添加险种类型
            $('#censusSel').empty().append(optionStr);
            social_lower = censusList[0].base_min;
            social_upper = censusList[0].base_max;

            //变更社保基数范围
            $('#socialBase').val('').attr('placeholder', '范围值:'+social_lower+'~'+social_upper);
        }else {
            //清空社保相关的信息
            $('#censusSel').empty().append('<option value="">请选择险种类型</option>');
            //变更社保基数范围
            $('#socialBase').val('').attr('placeholder', '范围值');
            social_lower = 0;
            social_upper = 0;
        }
        $('#forSocialFlag').removeClass('select');
    }

    //显示公积金(随城市变动)
    function getReserve(){
        if (!$.isArray(reserveList) && reserveList.company_ratios.length > 0){
            var optionStr = '';
            $.each(reserveList.company_ratios, function(index, el){
                optionStr += '<option value="'+el+'">'+el+'%</option>';
            });
            $('#companySel').empty().append(optionStr);

            var optionStr2 = '';
            $.each(reserveList.person_ratios, function(index, el){
                optionStr2 += '<option value="'+el+'">'+el+'%</option>';
            });
            $('#personSel').empty().append(optionStr2);

            //显示公积金范围
            $('#reserveBase').val('').attr('placeholder', '范围值:'+reserveList.lowwer_limit+'~'+reserveList.upper_limit);
            reserve_lower = reserveList.lowwer_limit;
            reserve_upper = reserveList.upper_limit;

            //显示下公积金
            if (!$('#reserveSwitch label').hasClass('open')){ //是关闭的，就点击打开
                $('#reserveSwitch label').trigger('click');
            }
            $('#reserveSwitch').removeClass('hide');
        }else {
            $('.ratioSel').empty().append('<option value="">比例</option>');
            $('#reserveBase').val('').attr('placeholder', '范围值');
            reserve_lower = 0;
            reserve_upper = 0;
            //隐藏下公积金
            if ($('#reserveSwitch label').hasClass('open')){ //是打开的，就点击关闭下
                $('#reserveSwitch label').trigger('click');
            }
            $('#reserveSwitch').addClass('hide');
        }
        $('#forReserveFlag').removeClass('select');
    }

    //重置到初始化状态
    function resetToInit(){
        //险种类型
        $('#censusSel').empty().append('<option value="">请选择险种类型</option>');
        //社保基数范围及提示
        $('#socialBase').val('').attr('placeholder', '范围值');
        //公积金比例
        $('.ratioSel').empty().append('<option value="">比例</option>');
        //公积金基数
        $('#reserveBase').val('').attr('placeholder', '范围值');
        //清空选择的城市
        $('#city_id').val('');
        //清除选中最低社保
        $('.socialBase').removeClass('select');
        social_lower = social_upper = reserve_lower = reserve_upper = 0;

        //公积金必须需要显示出来，且回复到最初状态
        $('#reserveSwitch').removeClass('hide');
        //显示下公积金
        if (!$('#reserveSwitch label').hasClass('open')){ //是关闭的，就点击打开
            $('#reserveSwitch label').trigger('click');
        }
    }

    //险种类型变更
    $('#censusSel').on('change', function(e){
        e.preventDefault();

        var $self = $(this);
        var census_id = $self.val(); //选中的险种
        if (census_id > 0 && censusList.length > 0){
            $.each(censusList, function(index, el){
                if (el.census_id == census_id){
                    $('#socialBase').val('').attr('placeholder', '范围值:'+el.base_min+'~'+el.base_max);
                    social_lower = el.base_min;
                    social_upper = el.base_max;
                    return false;
                }
            })
        }else {
            //清空公积金范围值及placeholder
            $('#socialBase').val('').attr('placeholder', '请选择险种类型');
            social_lower = 0;
            social_upper = 0;
        }
        $('#forSocialFlag').removeClass('select');
    })

    //公积金比例变更,比例取消联动处理
    // $('#personSel, #companySel').on('change', function(e){
    //     e.preventDefault();

    //     var $self    = $(this);
    //     var selected = $self.val();
    //     //同步处理
    //     $('.ratioSel').val(selected);
    // })

    //社保基数变更
    $('#socialBase').on('change', function(e){
        e.preventDefault();

        var $self = $(this);
        var socialBase = $self.val();
        if (socialBase == '' || isNaN(socialBase)){
            $self.val('');
            return false;
        }

        //处理输入的值
        if (parseFloat(social_lower) > socialBase){
            socialBase = social_lower;
        }
        if (parseFloat(social_upper) > 0 && parseFloat(social_upper) < socialBase){
            socialBase = social_upper;
        }
        $self.val(socialBase);
        $('#forSocialFlag').removeClass('select');
    })

    //公积金基数变更
    $('#reserveBase').on('change', function(e){
        e.preventDefault();

        var $self = $(this);
        var reserveBase = $self.val();
        if (reserveBase == '' || isNaN(reserveBase)){
            $self.val('');
            return false;
        }

        //处理输入的值
        if (parseFloat(reserve_lower) > reserveBase){
            reserveBase = reserve_lower;
        }
        if (parseFloat(reserve_upper) > 0 && parseFloat(reserve_upper) < reserveBase){
            reserveBase = reserve_upper;
        }
        $self.val(reserveBase);
        $('#forReserveFlag').removeClass('select');
    })

    //开始计算社保
    $('.btn-cal').on('click', function(){
        $('#forError').empty();

        var $self = $(this);

        //先验证前端,从上到下吧
        if ($('#city_id').val() == ''){ //城市
            $('#forError').append('<div class="alert alert-warning">城市不能为空</div>');
            return false;
        }

        //社保开关
        var social_flag  = $('input[name=social_flag]').val();
        //公积金开关
        var reserve_flag = $('input[name=reserve_flag]').val();
        if (social_flag == 0 && reserve_flag == 0){
            $('#forError').append('<div class="alert alert-warning">社保和公积金至少选择一种</div>');
            return false;
        }

        if (social_flag == 1){ //购买了社保
            if ($('#census_id').val() == ''){
                $('#forError').append('<div class="alert alert-warning">险种类型不能为空</div>');
                return false;
            }else if ($('#socialBase').val().trim() == ''){
                $('#forError').append('<div class="alert alert-warning">社保基数不能为空</div>');
                return false;
            }
        }

        if (reserve_flag == 1){ //购买了公积金
            if ($('#companySel').val() == ''){
                $('#forError').append('<div class="alert alert-warning">公积金公司比例不能为空</div>');
                return false;
            }else if ($('#personSel').val() == ''){
                $('#forError').append('<div class="alert alert-warning">公积金个人比例不能为空</div>');
                return false;
            }else if ($('#reserveBase').val().trim() == ''){
                $('#forError').append('<div class="alert alert-warning">公积金基数不能为空</div>');
                return false;
            }
        }

        //开始异步计算数据
        $.ajax({
            url: calculateUrl,
            type: 'POST',
            data: '_token='+_token+'&'+$('#calculatorForm').serialize(),
            dataType: 'JSON',
            success: function(data){
                if (data.status){
                    //开始填充数据啦
                    fillTableDetail(data.data);
                    $("#calList").removeClass("hide");
                }else {
                    $('#forError').empty().append('<div class="alert alert-warning">'+data.msg+'</div>');
                    return false;
                }
            },
            beforeSend: function(){
                $self.text('计算中...');
            },
            complete: function(){
                $self.text('计算');
            }
        });
    })

    //填充数据详情
    function fillTableDetail(data){
        //填充总金额
        $('#amount_total').text(data.amount_total);
        //填充社保总金额
        $('#social_total').text(data.social_total);
        //填充公积金总金额
        $('#reserve_total').text(data.reserve_total);
        //填充个人总计
        $('#person_total').text(data.person_total);
        //填充公司总计
        $('#company_total').text(data.company_total);

        var $table = $('#sList');
        //填充公积金数据
        var $tr9 = $table.find('tr:eq(9)');
        if (!$.isArray(data.reserve)){
            $tr9.find('td:eq(1)').text(data.reserve.count_base);
            $tr9.find('td:eq(2)').text(data.reserve.person_ratio + '%');
            $tr9.find('td:eq(3)').text(data.reserve.person_fee);
            $tr9.find('td:eq(4)').text(data.reserve.company_ratio + '%');
            $tr9.find('td:eq(5)').text(data.reserve.company_fee);
        }else {
            $tr9.find('td:eq(1)').text('0.00');
            $tr9.find('td:eq(2)').text('0.00%');
            $tr9.find('td:eq(3)').text('0.00');
            $tr9.find('td:eq(4)').text('0.00%');
            $tr9.find('td:eq(5)').text('0.00');
        }

        //填充社保数据
        if (!$.isArray(data.social)){
            //养老
            $table.find('tr:eq(2)').find('td:eq(1)').text(data.social.yanglao.count_base);
            $table.find('tr:eq(2)').find('td:eq(2)').text(data.social.yanglao.person_ratio + '%');
            $table.find('tr:eq(2)').find('td:eq(3)').text(data.social.yanglao.person_fee);
            $table.find('tr:eq(2)').find('td:eq(4)').text(data.social.yanglao.company_ratio + '%');
            $table.find('tr:eq(2)').find('td:eq(5)').text(data.social.yanglao.company_fee);
            //失业
            $table.find('tr:eq(3)').find('td:eq(1)').text(data.social.shiye.count_base);
            $table.find('tr:eq(3)').find('td:eq(2)').text(data.social.shiye.person_ratio + '%');
            $table.find('tr:eq(3)').find('td:eq(3)').text(data.social.shiye.person_fee);
            $table.find('tr:eq(3)').find('td:eq(4)').text(data.social.shiye.company_ratio + '%');
            $table.find('tr:eq(3)').find('td:eq(5)').text(data.social.shiye.company_fee);
            //工伤
            $table.find('tr:eq(4)').find('td:eq(1)').text(data.social.gongshang.count_base);
            $table.find('tr:eq(4)').find('td:eq(2)').text(data.social.gongshang.person_ratio + '%');
            $table.find('tr:eq(4)').find('td:eq(3)').text(data.social.gongshang.person_fee);
            $table.find('tr:eq(4)').find('td:eq(4)').text(data.social.gongshang.company_ratio + '%');
            $table.find('tr:eq(4)').find('td:eq(5)').text(data.social.gongshang.company_fee);
            //生育
            $table.find('tr:eq(5)').find('td:eq(1)').text(data.social.shengyu.count_base);
            $table.find('tr:eq(5)').find('td:eq(2)').text(data.social.shengyu.person_ratio + '%');
            $table.find('tr:eq(5)').find('td:eq(3)').text(data.social.shengyu.person_fee);
            $table.find('tr:eq(5)').find('td:eq(4)').text(data.social.shengyu.company_ratio + '%');
            $table.find('tr:eq(5)').find('td:eq(5)').text(data.social.shengyu.company_fee);
            //医疗
            $table.find('tr:eq(6)').find('td:eq(1)').text(data.social.yiliao.count_base);
            $table.find('tr:eq(6)').find('td:eq(2)').text(data.social.yiliao.person_ratio + '%');
            $table.find('tr:eq(6)').find('td:eq(3)').text(data.social.yiliao.person_fee);
            $table.find('tr:eq(6)').find('td:eq(4)').text(data.social.yiliao.company_ratio + '%');
            $table.find('tr:eq(6)').find('td:eq(5)').text(data.social.yiliao.company_fee);
            //重大
            $table.find('tr:eq(7)').find('td:eq(1)').text(data.social.zhongda.count_base);
            $table.find('tr:eq(7)').find('td:eq(2)').text(data.social.zhongda.person_ratio + '%');
            $table.find('tr:eq(7)').find('td:eq(3)').text(data.social.zhongda.person_fee);
            $table.find('tr:eq(7)').find('td:eq(4)').text(data.social.zhongda.company_ratio + '%');
            $table.find('tr:eq(7)').find('td:eq(5)').text(data.social.zhongda.company_fee);
            //残保
            $table.find('tr:eq(8)').find('td:eq(1)').text(data.social.canbao.count_base);
            $table.find('tr:eq(8)').find('td:eq(2)').text(data.social.canbao.person_ratio + '%');
            $table.find('tr:eq(8)').find('td:eq(3)').text(data.social.canbao.person_fee);
            $table.find('tr:eq(8)').find('td:eq(4)').text(data.social.canbao.company_ratio + '%');
            $table.find('tr:eq(8)').find('td:eq(5)').text(data.social.canbao.company_fee);
        }else {
            //清空到初始值
            for (var i=2; i<=8; i++){
                $table.find('tr:eq('+i+')').find('td:eq(1)').text('0.00');
                $table.find('tr:eq('+i+')').find('td:eq(2)').text('0.00%');
                $table.find('tr:eq('+i+')').find('td:eq(3)').text('0.00');
                $table.find('tr:eq('+i+')').find('td:eq(4)').text('0.00%');
                $table.find('tr:eq('+i+')').find('td:eq(5)').text('0.00');
            }
        }
    }

    //点击选择最低基数
    $(".socialBase").on("click", function() {
        $(this).toggleClass("select");

        var $self = $(this);

        if ($self.hasClass('select')){ //已选中了
            var id = $self.attr('id');
            if (id == 'forSocialFlag'){ //社保
                $('#socialBase').val(social_lower);
            }

            if (id == 'forReserveFlag'){ //公积金
                $('#reserveBase').val(reserve_lower);
            }
        }
    })

    //重置按钮
    $('.btn-res').on('click', function(e){
        e.preventDefault();

        $self = $(this);
        //隐藏计算结果
        $("#calList").addClass("hide");
        //删除多余的城市
        $('#forArea .newArea').remove();
        //重置下输入
        resetToInit();
        $self.closest('form')[0].reset();
    })
})


