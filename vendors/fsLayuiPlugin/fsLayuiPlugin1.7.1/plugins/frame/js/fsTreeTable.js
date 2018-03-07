layui.define(['fsCommon', 'fsConfig', 'form', 'fsButtonCommon', 'tree'], function (exports) {
    var $ = layui.jquery,
        fsCommon = layui.fsCommon,
        fsConfig = layui.fsConfig;

    FsTreeTable = function () {
        this.config = {
            id: "",
            elem: null,
            getTreeTable: null,
            layout: null
        };
    };

    FsTreeTable.prototype.render = function (options, params) {
        var _this = this;
        $.extend(true, _this.config, options);

        if ($.isEmpty(_this.config.id)) {
            fsCommon.warnMsg("表格id不能为空!");
            return;
        }

        if (!$.isEmpty(_this.config.id)) {
            _this.config.elem = $("#" + _this.config.id);
        }

        _this.loadData(params);

        return _this;
    };

    FsTreeTable.prototype.loadData = function (params) {
        var _this = this;
        var _table = $(_this.config.elem);
        var tableId = _table.attr("id");
        if ($.isEmpty(tableId)) {
            fsCommon.errorMsg("表格id未配置!");
            return;
        }

        //获取table属性
        var defaultForm = _table.attr("defaultForm");//查询条件formid
        if ($.isEmpty(defaultForm)) {
            defaultForm = "query_form";
        }

        //获取查询表单的参数
        var formData = $("#" + defaultForm).getFormData(true);
        if (!$.isEmpty(params)) {
            $.extend(formData, params);
        }

        var inputs = _table.attr("inputs");//参数
        if (!$.isEmpty(inputs)) {
            var param = fsCommon.getParamByInputs(inputs, urlParam);
            $.extend(formData, param);
        }

        var funcNo = _table.attr("funcNo");//功能号

        var url = _table.attr("url");//请求url
        if ($.isEmpty(url)) {
            url = "/fsbus/" + funcNo;
        }

        var servletUrl = $.result(fsConfig, "global.servletUrl");
        if (!$.isEmpty(servletUrl)) {
            url = servletUrl + url;
        }

        var isLoad = _table.attr("isLoad");//是否自动加载数据，1 :默认加载，0 ：不加载
        if (isLoad != "0") {
            isLoad = "1";
        }

        if (!_this.config.layout) {
            _this.config.layout = _table.getTreeTableCols();
        }

        //执行渲染
        fsCommon.invoke(url, 'GET', params, function (result) {
            _this.config.elem.empty();
            layui.treeGird({
                elem: _this.config.elem,
                nodes: result.data,
                layout: _this.config.layout
            });
        },
            true,
            function () {
                var data = [
                    {
                        id: 1,
                        level: 1,
                        name: 'test1',
                        path: 'xxxxx',
                        open: true,
                        children: [
                            { id: 3, parentId: 1, level: 2, name: 'test1_1', path: 'xxxxx', open: true },
                            { id: 4, parentId: 1, level: 2, name: 'test1_2', path: 'xxxxx', open: true }
                        ]
                    },
                    {
                        id: 2,
                        level: 1,
                        name: 'test2',
                        open: true,
                        path: 'xxxxx',
                        children: [
                            { id: 5, parentId: 2, level: 2, name: 'test2_1', path: 'xxxxx', open: true },
                            { id: 6, parentId: 2, level: 2, name: 'test2_2', path: 'xxxxx', open: true }
                        ]
                    },
                ];

                _this.config.elem.empty();
                layui.treeGird({
                    elem: _this.config.elem,
                    nodes: data,
                    layout: _this.config.layout
                });
            });
    };

    /**
	 * 刷新
	 */
    FsTreeTable.prototype.refresh = function () {
        this.loadData();
    };

    exports("fsTreeTable", new FsTreeTable());
});