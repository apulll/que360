(function (a) {
    a.fn.generateRegionList = function (e) {
        var c, j;
        var b = a("#btn-select-region");
        var i = a("#region-back-arrow");
        var f = false;
        var h = "click";
        var d = false;
        var g = {
            init: function () {
                c = 1;
                a(".list_content_mask").on(h, function () {
                    g.closeMsk()
                });
                g.setBtnTrigger();
                g.setEventToLists(1);
                g.setEventToBack();
                b.trigger(h)
            },
            setBtnTrigger: function () {
                b.on(h, function () {
                    j = document.body.scrollTop;
                    f = false;
                    g.showMsk();
                    var k = a(this).attr("region-data");
                    k = k.split(",")[c - 1];
                    g.getRegionInfo(c, k)
                })
            },
            showLoading: function () {
                a(".loading-mask").show()
            },
            hideLoading: function () {
                a(".loading-mask").hide()
            },
            regionUrl: function (l) {
                var k = e.actionURL;
                if (l == 1) {
                    k += "selectProvince.action"
                } else {
                    if (l == 2) {
                        k += "selectCity.action"
                    } else {
                        if (l == 3) {
                            k += "selectArea.action"
                        } else {
                            if (l == 4) {
                                k += "selectTown.action"
                            }
                        }
                    }
                }
                return k
            },
            regionParam: function (l) {
                var k = null;
                if (l == 1) {
                    k = {
                        sid: e.sid
                    }
                } else {
                    if (l == 2) {
                        k = {
                            sid: e.sid,
                            idProvince: a("#jdDeliverList1 li.checked").attr("id")
                        }
                    } else {
                        if (l == 3) {
                            k = {
                                sid: e.sid,
                                idCity: a("#jdDeliverList2 li.checked").attr("id")
                            }
                        } else {
                            if (l == 4) {
                                k = {
                                    sid: e.sid,
                                    idArea: a("#jdDeliverList3 li.checked").attr("id")
                                }
                            }
                        }
                    }
                }
                return k
            },
            getRegionInfo: function (l, k) {
                if (l < 5) {
                    a.ajax({
                        dataType: "json",
                        url: g.regionUrl(l),
                        data: g.regionParam(l),
                        cache: false,
                        beforeSend: function () {
                            g.showLoading()
                        },
                        success: function (n) {
                            var m = n;
                            setTimeout(function () {
                                g.hideLoading();
                                if (n.addressList && n.addressList.length > 0) {
                                    g.delEventToLists(l);
                                    g.drawRegionList(l, n.addressList)
                                } else {
                                    if (Number(l) == 3) {
                                        g.cleanUL(Number(l) + 1)
                                    }
                                    g.getResult(m)
                                }
                                d = false
                            }, 300)
                        },
                        error: function (m, o, n) {
                            d = false
                        }
                    })
                } else {
                    g.getResult("")
                }
            },
            drawRegionList: function (p, n) {
                var k = a("#jdDeliverList" + p);
                var m = "";
                k.html("");
                var o = a("#btn-select-region").attr("region-data");
                o = o.split(",")[p - 1];
                for (var l = 0; l < n.length; l++) {
                    m += "<li";
                    if (o && o == n[l].id) {
                        if (!f) {
                            m += ' class="checked"'
                        }
                    }
                    m += ' id="' + n[l].id + '" ';
                    if (p == 2) {
                        m += ' action="getCountys"'
                    } else {
                        if (p > 2) {
                            m += ' action="' + n[l].action + '"'
                        }
                    }
                    m += '><i class="tick"></i><a name="region' + n[l].id + '"></a><span>' + n[l].name + "</span></li>"
                }
                k.append(m);
                g.setEventToLists(p);
                g.switchTo(p)
            },
            cleanUL: function (k) {
                a("#jdDeliverList" + k).empty()
            },
            showMsk: function () {
                a("#btn-select-region").on(h, function () {
                    a("html").removeClass("sidebar-back");
                    a("html").addClass("sidebar-move");
                    a(".list_content_mask").css("display", "block");
                    a(".sidebar-content").css("display", "block")
                })
            },
            closeMsk: function () {
                var k = a("#btn-select-region").attr("region-data");
                a("html").addClass("sidebar-back");
                setTimeout(function () {
                    a("html").removeClass("sidebar-back");
                    a("html").removeClass("sidebar-move")
                }, 300);
                a(".list_content_mask").css("display", "none");
                a(".sidebar-content").css("display", "none");
                c = 1;
                f = false;
                setTimeout(function () {
                    window.scrollTo(0, j)
                }, 300)
            },
            delEventToLists: function (k) {
                a("#jdDeliverList" + k + " li").off(h)
            },
            setEventToLists: function (o) {
                var k = a("#jdDeliverList" + o + " li");
                var n = a("#jdDeliverList" + o);
                var m = o + 1;
                var l = function () {
                    for (var p = 0; p < k.length; p++) {
                        k.eq(p).removeClass("checked")
                    }
                };
                k.on(h, function () {
                    d = (o == 2) ? true : false;
                    l();
                    a(this).addClass("checked");
                    var q = a("#btn-select-region").attr("region-data");
                    q = q.split(",")[o - 1];
                    var p = this.id;
                    if (p != q) {
                        f = true
                    }
                    g.getRegionInfo(m, p)
                })
            },
            setEventToBack: function () {
                i.on(h, function () {
                    if (c == 1) {
                        g.closeMsk()
                    } else {
                        var k = c - 1;
                        g.switchTo(k)
                    }
                })
            },
            switchTo: function (l) {
                for (var k = 1; k < 5; k++) {
                    if (k == l) {
                        a("#jdDeliverList" + k).addClass("cur")
                    } else {
                        a("#jdDeliverList" + k).removeClass("cur")
                    }
                }
                c = l
            },
            getResult: function (m) {
                var k = "";
                var n = "";
                for (var l = 1; l < 5; l++) {
                    k += a("#jdDeliverList" + l + " .checked").attr("id");
                    k += (l == 4) ? "" : ",";
                    n += (a("#jdDeliverList" + l + " .checked").length == 0) ? "" : a("#jdDeliverList" + l +
                        " .checked").html()
                }
                n += '<i class="icon icon-location"></i>';
                b.attr("region-data", k);
                b.find(".address").html(n);
                if (e.callBack != null && e.callBack != undefined) {
                    e.callBack()
                }
                g.closeMsk()
            }
        };
        return g.init()
    }
})(Zepto);
 
function addPresentTime(a) {
    var b = new Date();
    b = b.getTime();
    if (a.indexOf("newtime=") != -1) {
        a = a.replace(/(\?|\&)newtime=\d*/, "")
    }
    var c = (a.indexOf("?") == -1) ? "?" : "&";
    a = a + c + "newtime=" + b;
    return a
}
function jdAddEvent(d, a, c) {
    var b = "on" + a;
    if (d.attachEvent) {
        d.attachEvent(b, c)
    } else {
        if (d.addEventListener) {
            d.addEventListener(a, c, false)
        } else {
            d[b] = c
        }
    }
}
function jdRemoveEvent(d, a, c) {
    var b = "on" + a;
    if (d.detachEvent) {
        d.detachEvent(b, c)
    } else {
        if (d.removeEventListener) {
            d.removeEventListener(a, c, false)
        } else {
            d[b] = null
        }
    }
};

//ceshi 2
