//define('static/js/seckill', function(require, exports, module) {
var _actList = [];
var _serverNowDate = 0;
var _listLeftTimeObj = [];//剩余时间数据
var _intervalId = 0;//计时器
var _txtDesc = ['即将开始', '抢购中', '抢购结束'];
var _curActivityId = 0;//每个nav中指向服务器返回来活动ID
var _goodsTypeId = '';//商品所属的类目ID
var _goodsNavActivityID = -1;
var _currentPage = 1;//默认为第一页
var _totalPages = 0;//当前总页数
var ONE_PAGE_NUMBERS = 10;//每页最多的数据

IOSCallH5("notifySeckillTypeBtnClicked");
window.notifySeckillTypeBtnClicked = function(){
    H5callApp("setThePageLoading",{loading:true});

    if ($('#seckillAlert').css('display') == 'block') {
        $('#seckillAlert').css({
            'display': 'none'
        });
    } else {
        $('#seckillAlert').css({
            'display': 'block'
        });

        $('#goods-list').html('');
        $('#noMoreDataP').hide();
        initGoodsTypeByCurId(_curActivityId);
    }
}


$('#head-title').html(languageObj.titleList.secKill);



proxyObj.reqGetSecKillActListAjax({
    el: $,
    success: getSeckillListRes,
    error: getSeckillListError
});

function getSeckillListRes(res) {
    _serverNowDate = res.nowDate;
    _actList = res.model;
    $('#goods-list').html('');
    $('#noMoreDataP').hide();

    var liStr = '';
    var obj = null;
    var infoObj = null;
    var timeObj = null;

    for (var i = 0; i < _actList.length; i++) {
        obj = _actList[i];

        timeObj = commonObj.getLeftTotalTime(_serverNowDate, obj.startDate, obj.endDate);

        infoObj = {
            'id': obj.id,
            'leftStartTime': timeObj.leftStartTime,
            'leftEndTime': timeObj.leftEndTime
        }

        if (i == 0) {
            _curActivityId = obj.id;
            liStr += "<li data-id='" + obj.id + "' class='current'><h1>" + obj.name + "</h1><p>" + _txtDesc[commonObj.getTimeLevelDesc(infoObj)] + "</p></li>";

        } else {
            liStr += "<li data-id='" + obj.id + "'><h1>" + obj.name + "</h1><p>" + _txtDesc[commonObj.getTimeLevelDesc(infoObj)] + "</p></li>";
        }

        _listLeftTimeObj.push(infoObj);
    }


    $('#nav').html(liStr);
    $('#nav>li').click(function () {
        var $ele = $(this);

        var dataId = parseInt($ele.attr('data-id'));
        if (dataId != _curActivityId) {
            _curActivityId = dataId;
            _currentPage = 1;
            _totalPages = 0;
            $('#goods-list').html('');
            $('#noMoreDataP').hide();

            showGoodsListBy(_goodsTypeId, _curActivityId, _currentPage);
        }

        $ele.addClass('current').siblings().removeClass('current');
    });

    $('#typeBtn').click(function () {
        if ($('#seckillAlert').css('display') == 'block') {
            $('#seckillAlert').css({
                'display': 'none'
            });
        } else {
            $('#seckillAlert').css({
                'display': 'block'
            });

            $('#goods-list').html('');
            $('#noMoreDataP').hide();
            initGoodsTypeByCurId(_curActivityId);
        }
    });

    $('#no-data').click(function () {
        $('#seckillAlert').css({
            'display': 'none'
        });
    });

    updateEndTimeDistance();

    showGoodsListBy(_goodsTypeId, _curActivityId, _currentPage);

    _intervalId = setInterval(coolDownTimeFunc, 1000);
}

function clearAndResetAllData() {
    clearInterval(_intervalId);

    _serverNowDate = 0;
    _listLeftTimeObj = [];
    _intervalId = 0;
    _curActivityId = 0;
    _goodsTypeId = null;
    _goodsNavActivityID = -1;
    _currentPage = 1;
    _totalPages = 0;

    proxyObj.reqGetSecKillActListAjax({
        el: $,
        success: getSeckillListRes,
        error: getSeckillListError
    });

    //initUI();
}

function coolDownTimeFunc() {
    var obj = null;

    for (var i = 0; i < _listLeftTimeObj.length; i++) {
        obj = _listLeftTimeObj[i];
        obj.leftStartTime++;
        obj.leftEndTime++;

        var $this = getElementByDataID(obj.id);
        $this.find('p').html(_txtDesc[commonObj.getTimeLevelDesc(obj)]);


        if (obj.leftStartTime > 0 && obj.leftEndTime >= 0) {
            clearAndResetAllData();
            break;
        }
    }

    updateEndTimeDistance();
}

/**距离结束时间的计算**/
function updateEndTimeDistance() {
    var curSelectTimeObj = getLeftTimeInfoById(_curActivityId);
    var leftEndTimeObj = commonObj.timeFormat(Math.abs(curSelectTimeObj.leftEndTime));
    $('#t-hour').html(leftEndTimeObj.hour);
    $('#t-min').html(leftEndTimeObj.minute);
    $('#t-sec').html(leftEndTimeObj.second);
}

/**向服务器获取act-list数据出错*/
function getSeckillListError(res) {

}


/**根据dataID获取到nav下的li元素的剩余时间object*/
function getLeftTimeInfoById(dataID) {
    var obj = null;
    var targetObj = null;
    for (var i = 0; i < _listLeftTimeObj.length; i++) {
        obj = _listLeftTimeObj[i];
        if (obj.id == parseInt(dataID)) {
            targetObj = obj;
            break;
        }
    }

    return targetObj;
}

/**根据dataID获取到nav下的li元素*/
function getElementByDataID(dataId) {
    var $targetEle = null;
    var $ele = null;
    $('#nav>li').each(function () {
        $ele = $(this);
        var id = parseInt($ele.attr('data-id'));
        if (id == dataId) {
            $targetEle = $ele;
        }
    })

    return $targetEle;
}

function showGoodsListBy(categoryId, dataID, pageNum) {
    proxyObj.reqGetSeckillGoodsListByActivityIDAjax({
        categoryId: categoryId,
        id: dataID,
        pageNum: pageNum,
        pageSize: ONE_PAGE_NUMBERS,
        success: getGoodsListRes,
        error: getGoodsListError
    });


    /**商品列表返回成功*/
    function getGoodsListRes(res) {
        console.log('==========商品列表返回成功===========');
        console.log(res);

        var goodsObj = null;
        var liStr = '';
        //$('#goods-list').html('');
        _totalPages = res.pageCount;


        var tempObj = null;
        var timeTargetObj = null;
        for (var m = 0; m < _listLeftTimeObj.length; m++) {
            tempObj = _listLeftTimeObj[m];
            if (tempObj.id == _curActivityId) {
                timeTargetObj = tempObj;
                break;
            }
        }


        for (var i = 0; i < res.resultList.length; i++) {
            goodsObj = res.resultList[i];
            liStr += '<li>'
                + '<div class="g-box">'
                + '<img src="' + goodsObj.pic + '" alt="" class="icon"/>'
                + '<div class="right">'
                + '<p>' + goodsObj.name + '</p>'
                + '<div class="oper-box">'
                + '<span class="now-price"><em>¥</em>' + goodsObj.killPrice + '</span>'
                + '<del class="old-price"><em>¥</em>' + goodsObj.originalProdPrice + '</del>';

            if (timeTargetObj.leftStartTime >= 0 && timeTargetObj.leftEndTime < 0) {
                liStr += '<a class="buyBtn" href="' + proxyObj.goodsUrlPath + goodsObj.prodId + '">去抢购</a>';
            } else {
                liStr += '<a class="remindBtn" href="' + proxyObj.goodsUrlPath + goodsObj.prodId + '">待开始</a>';
            }


            if (goodsObj.processRate != null) {
                goodsObj.processRate = parseInt(goodsObj.processRate);

                liStr += '<div class="buyBar">'
                    + '<div class="sold-per">已售' + goodsObj.processRate + '%</div>'
                    + '<div class="bar">'
                    + '<div class="progress" style="left:-' + parseInt(103 - goodsObj.processRate) + '%"></div>'
                    + '</div>'
                    + '</div>'
            }

            liStr += '<div class="clear-fix"></div>'
                + '</div>'
                + '</div>'
                + '<div class="clear-fix"></div>'
                + '</div>'
                + '</li>'
        }

        $('#goods-list').append(liStr);


        if(_currentPage>1 && _currentPage>=_totalPages){
            $('#noMoreDataP').show();
        }
    }

    /**商品列表返回失败*/
    function getGoodsListError(res) {

    }
}

function getGoodsTypeRes(res) {
    $('#goodTypesList').html('');
    $('#no-data').hide();

    var obj = null;
    var liStr = '';

    if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
            obj = res[i];
            liStr += "<li data-id='" + obj.id + "'>" + obj.name + "</li>";
        }

        $('#goodTypesList').html(liStr);

        $('#goodTypesList>li').click(function () {
            var categoryIdNum = parseInt($(this).attr('data-id'));
            if (_goodsTypeId != categoryIdNum) {
                _goodsTypeId = categoryIdNum;
                _currentPage = 1;
                _totalPages = 0;
                $('#goods-list').html('');
                $('#noMoreDataP').hide();
                showGoodsListBy(_goodsTypeId, _curActivityId, _currentPage);
            }

            $('#seckillAlert').css({
                'display': 'none'
            });
        });
    } else {
        $('#no-data').show();
    }
}

function getGoodsTypeError(res) {

}

function initGoodsTypeByCurId(curId) {

    if (_goodsNavActivityID != curId) {
        _goodsNavActivityID = curId;

        $('#goodTypesList').html('');

        proxyObj.reqGetGoodsTypesListAjax({
            id: curId,
            success: getGoodsTypeRes,
            error: getGoodsTypeError
        })
    }
}

var load_flag = false;
$(function () {

    $(window).scroll(function () {

        if (load_flag) {

            return;

        }

        var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());

        if (totalheight >= $(document).height()) {

            if (_currentPage < _totalPages) {
                _currentPage++;
                showGoodsListBy(_goodsTypeId, _curActivityId, _currentPage);
            }

        }

    });

});