(function($, window){
    window.wa_extSource = function(_data, options){
        var SelfObj = this;

        //options
        var opts = $.extend(true, {}, options);
        //External Source Constant
        var constants = {
            items: "Items",
            item: "Item",
            priority: "Priority",
            report: "Report",
            pages: "Pages",
            page: "Page",
            paths: "Paths",
            path: "Path",
            referers: "Referers",
            referer: "Referer",
            userAgents: "UserAgents",
            userAgent: "UserAgent",
            exMasks: "ExMasks",
            exMask: "ExMask",

            //const for generator info
            genInfo: {
                blockName: "generator info",
                name: "wa_name",
                dateCreate: "date create",
                dateEditLast: "date edit last"
            }
        };
        //Data External Source
        var dataExtSource = {};

        //PROPERTIES
        this.const = constants;

        //METHODS
        this.set = function(obj){
            if(obj) $.each(obj, function(key, value){
                dataExtSource[key] = value;
            });
        };
        this.setReport = function(report){
            dataExtSource[constants.report] = report;
        };
        this.get = function(param){
            if(param){
                return dataExtSource[param];
            }else{
                return dataExtSource;
            };
        };
        this.getReport = function(){
            return dataExtSource[constants.report];
        };
        this.getJSON = function(){
            var out = {};

            //set report
            if(SelfObj.getReport()) out[constants.report] = SelfObj.getReport();

            //set ExMasks
            if(SelfObj.get(constants.exMasks) && SelfObj.get(constants.exMasks).count() > 0){
                out[constants.exMasks] = [];
                $.each(SelfObj.get(constants.exMasks).get(), function(key, mask){
                    out[constants.exMasks].push(mask.getExMask());
                });
            };

            //set Items
            if(SelfObj.get(constants.items) && SelfObj.get(constants.items).count() > 0){
                out[constants.items] = [];
                $.each(SelfObj.get(constants.items).get(), function(key, item){
                    if(item.get(constants.pages).count() > 0 || item.get(constants.paths).count() > 0 || item.get(constants.referers).count() > 0 || item.get(constants.userAgents).count() > 0){
                        var json_item = {};
                        if(item.getName()) json_item[constants.genInfo.name] = item.getName();
                        out[constants.items].push(json_item);

                        //set pages
                        if(item.get(constants.pages).count() > 0){
                            var json_pages = json_item[constants.pages] = [];
                            $.each(item.get(constants.pages).get(), function(key, page){
                                var json_page = {};

                                json_page[constants.page] = page.getPage();
                                if(page.getPriority() != 0) json_page[constants.priority] = page.getPriority();

                                json_pages.push(json_page);
                            });
                        };

                        //set paths
                        if(item.get(constants.paths).count() > 0){
                            var json_paths = json_item[constants.paths] = [];
                            $.each(item.get(constants.paths).get(), function(key, path){
                                var json_path = {};

                                var json_path_arr = [];
                                $.each(path.getPath().get(), function(key, path_item){
                                    json_path_arr.push(path_item.get());
                                });
                                if(json_path_arr.length > 0) json_path[constants.path] = json_path_arr;
                                if(path.getPriority() != 0) json_path[constants.priority] = path.getPriority();

                                json_path.push(json_path);
                            });
                        };

                        //set referers
                        if(item.get(constants.referers).count() > 0){
                            var json_referers = json_item[constants.referers] = [];
                            $.each(item.get(constants.referers).get(), function(key, referer){
                                var json_referer = {};

                                json_referer[constants.referer] = referer.getReferer();
                                if(referer.getPriority() != 0) json_referer[constants.priority] = referer.getPriority();

                                json_referers.push(json_referer);
                            });
                        };

                        //set userAgents
                        if(item.get(constants.userAgents).count() > 0){
                            var json_userAgents = json_item[constants.userAgents] = [];
                            $.each(item.get(constants.userAgents).get(), function(key, userAgent){
                                var json_userAgent = {};

                                json_userAgent[constants.userAgent] = userAgent.getUserAgent();
                                if(userAgent.getPriority() != 0) json_userAgent[constants.priority] = userAgent.getPriority();

                                json_userAgents.push(json_userAgent);
                            });
                        };
                    };
                });
            };

            return $.toJSON(out);
        };
        this.addItem = function(){
            SelfObj.get(constants.items).add();
        };

        //other objects
        function Page(_data){
            var SelfObj = this,
                data = {};

            //METHODS
            this.get = function(param){
                if(param){
                    return data[param];
                }else{
                    return data;
                };
            };
            this.getPage = function(){
                return SelfObj.get(constants.page);
            };
            this.getPriority = function(){
                return SelfObj.get(constants.priority);
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    data[key] = value;
                });
            };
            this.setPage = function(page){
                data[constants.page] = page;
            };
            this.setPriority = function(priority){
                data[constants.priority] = priority;
            };

            //INIT
            var def_obj = {};
           def_obj[constants.priority] = 0;
            _data = $.extend(true, def_obj, _data);
            SelfObj.set(_data);
        };
        function Pages(_data){
            var SelfObj = this,
                data = [];

            //METHODS
            this.add = function(obj){
                data.push(new Page(obj));
            };
            this.remove = function(page){
                var index = $.inArray(page, data);
                if(index != -1) data.splice(index, 1);
            };
            this.get = function(){
                return data;
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    SelfObj.add(value);
                });
            };
            this.count = function(){
                return data.length;
            };

            //INIT
            SelfObj.set(_data);
        };
        function PathItem(_data){
            var SelfObj = this,
                data = null;

            //METHODS
            this.get = function(){
                return data;
            };
            this.set = function(param){
                data = param;
            };

            //INIT
            SelfObj.set(_data);
        };
        function PathItemCollection(_data){
            var SelfObj = this,
                data = [];

            //METHODS
            this.get = function(){
                return data;
            };
            this.set = function(arr){
                if(arr) $.each(arr, function(key, value){
                    data.push(new PathItem(value));
                });
            };
            this.setOrder = function(pathItem, order){
                var index = $.inArray(pathItem, data);
                if(index == -1) return;

                data.splice(index, 1);
                data.splice(order, 0, pathItem);
            };

            //INIT
            SelfObj.set(_data);
        };
        function Path(_data){
            var SelfObj = this,
                data = {};

            //METHODS
            this.get = function(param){
                if(param){
                    return data[param];
                }else{
                    return data;
                }
            };
            this.getPath = function(index){
                if(index){
                    return data[constants.path].get()[index].get();
                }else{
                    return data[constants.path];
                };
            };
            this.getPriority = function(){
                return data[constants.priority];
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    if(key != constants.path){
                        data[key] = value;
                    }else{
                        data[constants.path] = new PathItemCollection(value);
                    };
                });
            };
            this.setPriority = function(priority){
                data[constants.priority] = priority;
            };

            //INIT
            var def_obj = {};
            def_obj[constants.priority] = 0;
            _data = $.extend(true, def_obj, _data);
            SelfObj.set(_data);
        };
        function Paths(_data){
            var SelfObj = this,
                data = [];

            //METHODS
            this.add = function(obj){
                data.push(new Path(obj));
            };
            this.remove = function(path){
                var index = $.inArray(path, data);
                if(index != -1) data.splice(index, 1);
            };
            this.get = function(){
                return data;
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    SelfObj.add(value);
                });
            };
            this.count = function(){
                return data.length;
            };

            //INIT
            SelfObj.set(_data);
        };
        function Referer(_data){
            var SelfObj = this,
                data = {};

            //METHODS
            this.get = function(param){
                if(param){
                    return data[param];
                }else{
                    return data;
                };
            };
            this.getReferer = function(){
                return data[constants.referer];
            };
            this.getPriority = function(){
                return data[constants.priority];
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    data[key] = value;
                });
            };
            this.setReferer = function(referer){
                data[constants.referer] = referer;
            };
            this.setPriority = function(priority){
                data[constants.priority] = priority;
            };

            //INIT
            var def_obj = {};
            def_obj[constants.priority] = 0;
            _data = $.extend(true, def_obj, _data);
            SelfObj.set(_data);
        };
        function Referers(_data){
            var SelfObj = this,
                data = [];

            //METHODS
            this.add = function(obj){
                data.push(new Referer(obj));
            };
            this.remove = function(referer){
                var index = $.inArray(referer, data);
                if(index != -1) data.splice(index, 1);
            };
            this.get = function(){
                return data;
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    SelfObj.add(value);
                });
            };
            this.count = function(){
                return data.length;
            };

            //INIT
            SelfObj.set(_data);
        };
        function UserAgent(_data){
            var SelfObj = this,
                data = {};

            //METHODS
            this.get = function(param){
                if(param){
                    return data[param];
                }else{
                    return data;
                };
            };
            this.getUserAgent = function(){
                return data[constants.userAgent];
            };
            this.getPriority = function(){
                return data[constants.priority];
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    data[key] = value;
                });
            };
            this.setUserAgent = function(userAgent){
                data[constants.userAgent] = userAgent;
            };
            this.setPriority = function(priority){
                data[constants.priority] = priority;
            };

            //INIT
            var def_obj = {};
            def_obj[constants.priority] = 0;
            _data = $.extend(true, def_obj, _data);
            SelfObj.set(_data);
        };
        function UserAgents(_data){
            var SelfObj = this,
                data = [];

            //METHODS
            this.add = function(obj){
                data.push(new UserAgent(obj));
            };
            this.remove = function(userAgent){
                var index = $.inArray(userAgent, data);
                if(index != -1) data.splice(index, 1);
            };
            this.get = function(){
                return data;
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    SelfObj.add(value);
                });
            };
            this.count = function(){
                return data.length;
            };

            //INIT
            SelfObj.set(_data);
        };
        function ExMask(_data){
            var SelfObj = this,
                data = {};

            //METHODS
            this.get = function(param){
                if(param){
                    return data[param];
                }else{
                    return data;
                };
            };
            this.getExMask = function(){
                return data[constants.exMask];
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    data[key] = value;
                });
            };
            this.setExMask = function(exMask){
                data[constants.exMask] = exMask;
            };

            //INIT
            SelfObj.set(_data);
        };
        function ExMasks(_data){
            var SelfObj = this,
                data = [];

            //METHODS
            this.add = function(obj){
                data.push(new ExMask(obj));
            };
            this.remove = function(exMask){
                var index = $.inArray(exMask, data);
                if(index != -1) data.splice(index, 1);
            };
            this.get = function(){
                return data;
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    SelfObj.add(value);
                });
            };
            this.count = function(){
                return data.length;
            };

            //INIT
            SelfObj.set(_data);
        };
        function Item(_data){
            var SelfObj = this,
                data = {};

            //METHODS
            this.get = function(param){
                if(param){
                    return data[param];
                }else{
                    return data;
                };
            };
            this.getPages = function(){
                return data[constants.pages];
            };
            this.getPaths = function(){
                return data[constants.paths];
            };
            this.getReferers = function(){
                return data[constants.referers];
            };
            this.getUserAgents = function(){
                return data[constants.userAgents];
            };
            this.getPriority = function(){
                return data[constants.priority];
            };
            this.getName = function(){
                return SelfObj.get(constants.genInfo.name);
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    switch(key){
                        case constants.pages:
                            data[constants.pages] = new Pages(value);
                            break;
                        case constants.paths:
                            data[constants.paths] = new Paths(value);
                            break;
                        case constants.referers:
                            data[constants.referers] = new Referers(value);
                            break;
                        case constants.userAgents:
                            data[constants.userAgents] = new UserAgents(value);
                            break;
                        default:
                            data[key] = value;
                    };
                });
            };
            this.setPriority = function(priority){
                data[constants.priority] = priority;
            };
            this.setName = function(name){
                data[constants.genInfo.name] = name;
            };

            //INIT
            var stand_obj = {};
            stand_obj[constants.pages] = null;
            stand_obj[constants.paths] = null;
            stand_obj[constants.referers] = null;
            stand_obj[constants.userAgents] = null;
            stand_obj[constants.priority] = 0;
            _data = $.extend(true, stand_obj, _data);
            SelfObj.set(_data);
        };
        function Items(_data){
            var SelfObj = this,
                data = [];

            //METHODS
            this.add = function(obj){
                data.push(new Item(obj));
            };
            this.remove = function(item){
                var index = $.inArray(item, data);
                if(index != -1) data.splice(index, 1);
            };
            this.get = function(){
                return data;
            };
            this.set = function(obj){
                if(obj) $.each(obj, function(key, value){
                    SelfObj.add(value);
                });
            };
            this.count = function(){
                return data.length;
            };

            //INIT
            SelfObj.set(_data);
        };

        //INIT
        var _obj = {}, def_data = {};
        def_data[constants.items] = null;
        def_data[constants.exMasks] = null;
        _data = $.extend(true, def_data, _data);
        $.each(_data, function(key, value){
            switch(key){
                case constants.items:
                    _obj[key] = new Items(value);
                    SelfObj.set(_obj);
                    break;
                case constants.exMasks:
                    _obj[key] = new ExMasks(value);
                    SelfObj.set(_obj);
                    break;
                case constants.report:
                    _obj[key] = value;
                    SelfObj.set(_obj);
                    break;
                default:
                    _obj[key] = value;
                    SelfObj.set(_obj);
            };
        });
    };
})(jQuery, window);