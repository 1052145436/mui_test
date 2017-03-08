/**
 * Created by Administrator on 2017/3/4.
 */
var indexObj = {
    init: function () {

        require(['./ChineseCities'], function (citiesJS) {
            initUI();

            function initUI() {
                var picker = new mui.PopPicker({
                    layer: 4
                });

                var cities = citiesJS.ChineseCitiesObj.allCities;

                var lv1Obj = null;
                var lv1List = [];
                var lv2Obj = null;
                var lv2List = null;
                var lv3Obj = null;
                var lv3List = null;
                var lv4Obj = null;
                var lv4List = null;
                var lv1Name = null;//得到省份名称
                var lv2Name = null;//得到城市名称
                var lv3Name = null;//得到一个区的名称
                var lv4Name = null;//上午还是下午

                var tempLv1Obj = null;
                var tempLv2Obj = null;
                var tempLv3Obj = null;
                var tempLv4Obj = null;

                for (var i = 0; i < cities.length; i++) {
                    tempLv1Obj = cities[i];//得到一个省份数据
                    lv1Name = tempLv1Obj.name; //得到一个省份名称

                    lv2List = [];
                    lv2Obj = null;
                    for (var j = 0; j < tempLv1Obj.city.length; j++) {
                        tempLv2Obj = tempLv1Obj.city[j]; //得到一个市的数据
                        lv2Name = tempLv2Obj.name;//得到一个城市的名称

                        lv3List = [];
                        lv3Obj = null;
                        for (var k = 0; k < tempLv2Obj.area.length; k++) {
                            tempLv3Obj = tempLv2Obj.area[k]; //得到一个区的数据
                            lv3Name = tempLv3Obj.name;//得到一个城市名称

                            lv4Obj = null;
                            lv4List = [];

                            for (var m = 0; m < tempLv3Obj.address.length; m++) {
                                tempLv4Obj = tempLv3Obj.address[m];
                                lv4Name = tempLv4Obj;

                                lv4Obj = {
                                    text: lv4Name
                                };

                                lv4List.push(lv4Obj);
                            }

                            lv3Obj = {
                                text: lv3Name,
                                children: lv4List
                            }

                            lv3List.push(lv3Obj);
                        }

                        lv2Obj = {
                            text: lv2Name,
                            children: lv3List
                        }

                        lv2List.push(lv2Obj);
                    }

                    lv1Obj = {
                        text: lv1Name,
                        children: lv2List
                    }

                    lv1List.push(lv1Obj);
                }


                //console.log(lv1List);

                picker.setData(lv1List);


                picker.pickers[0].setSelectedIndex(3);
                picker.pickers[1].setSelectedIndex(0);
                picker.pickers[2].setSelectedIndex(0);
                picker.pickers[3].setSelectedIndex(0);

                picker.show(function (selectedItem) {
                    console.log(selectedItem);
                    picker.pickers[1].setSelectedIndex(0);
                    picker.pickers[2].setSelectedIndex(0);
                    picker.pickers[3].setSelectedIndex(0);
                });


                document.getElementById('showBtn').addEventListener('click', function () {
                    picker.show(function (selectedItem) {
                        picker.pickers[1].setSelectedIndex(0);
                        picker.pickers[2].setSelectedIndex(0);
                        picker.pickers[3].setSelectedIndex(0);
                        console.log(selectedItem);
                    });
                });
            }
        })
    }
}

exports.indexObj = indexObj;