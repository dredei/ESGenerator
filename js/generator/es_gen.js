(function($, window){
    var g = {
        options: {
            url: {
                upload: "",
                downloadFromUrl: "",
                download: ""
            },
            basePath: "js/"
        },
        data: {
            control: {
                tooltip: null
            },
			form: {
				main: null
			}
        },
		es: null//data ext source
    };

    //constants
    g.const = {
        cookie: {
            lng: 'lng',
            expiriesday: 30
        },
        lng: {
            ru: 'ru_ru',
            en: 'en_en',
            ua: 'ua_ua'
        },
        attr: {
            tooltip: "_tooltip"
        }
    };

    //utils
    g.utils = {
        cwe : function(tag, attr, parent){
            var element = document.createElement(tag);
            if(attr){
                if(attr instanceof Object){
                    $.each(attr, function(name, value){
                        element.setAttribute(name, value);
                    });
                }else{
                    if (attr.length > 0) {
                        var array = attr.split(";");
                        for (var x = 0; x<=array.length - 1; x++) {
                            var tattr = array[x].split(",");
                            element.setAttribute(tattr[0], tattr[1]);
                        };
                    };
                };
            };

            if(parent){
                if(window.jQuery)$(parent).append(element);
                else parent.appendChild(element);
            };

            return element;
        },
        addScript : function(path, anticache){
            return this.cwe('script','type,text/javascript;src,'+path+((anticache)?"?rnd="+Math.random():""), document.getElementsByTagName('head')[0]);
        },
        addStyleSheet : function(path, anticache){
            return this.cwe('link','rel,stylesheet;type,text/css;href,'+path+((anticache)?"?rnd="+Math.random():""), document.getElementsByTagName('head')[0]);
        },
        Cookie : {
            get : function(name){
                var cookie = " " + document.cookie;
                var search = " " + name + "=";
                var setStr = null;
                var offset = 0;
                var end = 0;
                if (cookie.length > 0){
                    offset = cookie.indexOf(search);
                    if (offset != -1){
                        offset += search.length;
                        end = cookie.indexOf(";", offset);
                        if (end == -1) {
                            end = cookie.length;
                        };
                        setStr = unescape(cookie.substring(offset, end));
                    };
                };
                return(setStr);
            },
            set : function(name, value, expires, path, domain, secure){
                document.cookie = name + "=" + escape(value) +
                    ((expires) ? "; expires=" + expires : "") +
                    ((path) ? "; path=" + path : "") +
                    ((domain) ? "; domain=" + domain : "") +
                    ((secure) ? "; secure" : "");
            },
            remove : function(name){
                var cookie_date = new Date ( );
                cookie_date.setTime ( cookie_date.getTime() - 1 );
                document.cookie = name += "=; expires=" + cookie_date.toGMTString();
            },
            getExpiresDataByDay : function(countDays){
                var exdate=new Date();
                exdate.setDate(exdate.getDate() + countDays);
                return exdate.toGMTString();
            }
        },
        Interval: function(action, time){
            var stop = false;

            function interval(){
                action();
                if(!stop) setTimeout(arguments.callee, time);
            };

            this.start = function(){
                stop = false;
                interval();
            };
            this.stop = function(){
                stop = true;
            };
        },
        isInt: function(string){
            return (string == parseInt(string).toString());
        },
        Verify: {
            regexp: {}
        },
        randomInt: function(min, max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        Language: {
            get: function(){
                var lng = g.utils.Storage.get(g.const.cookie.lng);

                $.each(g.const.lng, function(index, value){
                    if(value == lng) return lng;
                });

                return g.const.lng.ru;
            },
            set: function(lng){
                g.utils.Storage.set(g.const.cookie.lng, lng);
                window.location.href = "";
            }
        },
        Storage: {
            get: function(name){
                if(window.localStorage){
                    return window.localStorage[name];
                }else{
                    return g.utils.Cookie.get(name);
                };
            },
            set: function(name, value){
                if(window.localStorage){
                    window.localStorage[name] = value;
                }else{
                    g.utils.Cookie.set(name, value, wa_api.utils.cookie.getExpiresDataByDay(wa_manager.constants.cookie.expiriesday));
                };
            },
            remove: function(name){
                if(window.localStorage){
                    delete window.localStorage[name];
                }else{
                    g.utils.Cookie.remove(name);
                };
            }
        },
        isCompatibleBrowser: function(){
            return (($.browser.msie) ? false : true);
        },
        setTitle: function(elements){
            if(!elements) return;

            elements.reverse();

            var title = "";

            $.each(elements, function(key, value){
                if(value) title += value + " | ";
            });

            document.title = title.substr(0, title.length - 3);
        },
        formatDate: function(formatDate, formatString){
            var yyyy = formatDate.getFullYear();
            var yy = yyyy.toString().substring(2);
            var m = formatDate.getMonth() + 1;
            var mm = m < 10 ? "0" + m : m;
            var d = formatDate.getDate();
            var dd = d < 10 ? "0" + d : d;

            var h = formatDate.getHours();
            var hh = h < 10 ? "0" + h : h;
            var n = formatDate.getMinutes();
            var nn = n < 10 ? "0" + n : n;
            var s = formatDate.getSeconds();
            var ss = s < 10 ? "0" + s : s;

            formatString = formatString.replace(/yyyy/i, yyyy);
            formatString = formatString.replace(/yy/i, yy);
            formatString = formatString.replace(/mm/i, mm);
            formatString = formatString.replace(/m/i, m);
            formatString = formatString.replace(/dd/i, dd);
            formatString = formatString.replace(/d/i, d);
            formatString = formatString.replace(/hh/i, hh);
            formatString = formatString.replace(/h/i, h);
            formatString = formatString.replace(/nn/i, nn);
            formatString = formatString.replace(/n/i, n);
            formatString = formatString.replace(/ss/i, ss);
            formatString = formatString.replace(/s/i, s);

            return formatString;
        }
    };

    var Proto = function(){
        this.constructor = function(){};
        this.destructor = function(opt){
            SelfObj.actions.destroy(opt);
        };
        this.show = function(opt){
            opt = $.extend(true, {
                force: false,
                effect: false,
                callback: function(){}
            }, opt);

            //если принудительное выполнение апперации не включено и эллемент отображается, то прерываем выполнение
            if(!opt.force && SelfObj.state.visible) return;

            //отображаем эллемнт с аннимацией или без нее
            if(opt.effect) SelfObj.actions.show({effect: true, callback: opt.callback});
            else SelfObj.actions.show({effect: false, callback: opt.callback});
        };
        this.hide = function(opt){
            opt = $.extend(true, {
                force: false,
                effect: false,
                callback: function(){}
            }, opt);

            //если принудительное выполнение апперации не включено и эллемент отображается, то прерываем выполнение
            if(!opt.force && !SelfObj.state.visible) return;

            //скрываем эллемнт с аннимацией или без нее
            if(opt.effect) SelfObj.actions.hide({effect: true, callback: opt.callback});
            else SelfObj.actions.hide({effect: false, callback: opt.callback});
        };
        this.toogle = function(opt){
            opt = $.extend(true, {
                force: false,
                effect: false,
                callback: function(){}
            }, opt);

            if(SelfObj.state.visible) SelfObj.actions.hide(opt);
            else SelfObj.actions.show(opt);
        };
        this.htmlNodes = {
            'main': []
        };
        this.state = {
            'visible': false
        };
        this.options = {
            'animateTime': 500
        };
        this.data = {};

        var SelfObj = this;

        this.init = function(opt, param){
            //задаем настройки
            $.extend(true, SelfObj.options, opt);

            //запускаем конструктор
            SelfObj.constructor();

            //задаем начальное состояние эллемента
            param = $.extend(true, {
                visible: false
            }, param);

            if(param.visible) SelfObj.actions.show({effect: false, force: true});
            else SelfObj.actions.hide({effect: false, force: true});
        };
        this.destroy = function(opt){
            SelfObj.destructor(opt);
        };

        this.actions = {
            destroy: function(opt){
                opt = $.extend(true, {
                    effect: false,
                    callback: function(){}
                }, opt);

                //если эффекты включены, то скрываем эллемент
                if(opt.effect) SelfObj.actions.hide({
                    force: true,
                    effect: true,
                    callback: function(){
                        SelfObj.actions.destroy({
                            effect: false,
                            callback: opt.callback
                        });
                    }
                });
                else {
                    //удаляем эллемент
                    $.each(SelfObj.htmlNodes.main, function(key, main){
                        $(main).remove();
                    });

                    //запускаем callback
                    opt.callback();
                };
            },
            hide: function(opt){
                opt = $.extend(true, {
                    effect: false,
                    callback: function(){}
                }, opt);

                if(opt.effect){
                    $.each(SelfObj.htmlNodes.main, function(key, main){
                        $(main).fadeOut(SelfObj.options.animateTime, function(){
                            $(main).css({visibility: "hidden"});
                        });
                    });
                    setTimeout(function(){
                        opt.callback();
                    },SelfObj.options.animateTime * SelfObj.htmlNodes.main.length)
                }else{
                    $.each(SelfObj.htmlNodes.main, function(key, main){
                        $(main).fadeOut(0, function(){
                            $(main).css({visibility: "hidden"});
                        });
                    });
                    opt.callback();
                };

                SelfObj.state.visible = false;
            },
            show: function(opt){
                opt = $.extend(true, {
                    effect: false,
                    callback: function(){}
                }, opt);

                if(opt.effect){
                    $.each(SelfObj.htmlNodes.main, function(key, main){
                        $(main).css({visibility: "visible"}).fadeIn(SelfObj.options.animateTime);
                    });
                    setTimeout(function(){
                        opt.callback();
                    },SelfObj.options.animateTime * SelfObj.htmlNodes.main.length)
                }else{
                    $.each(SelfObj.htmlNodes.main, function(key, main){
                        $(main).css({visibility: "visible"}).fadeIn(0);
                    });
                    opt.callback();
                };

                SelfObj.state.visible = true;
            }
        };
    },
        cwe = g.utils.cwe;

    //controls
    g.control = {
        tooltip: function(opt, param){
            var proto = new Proto(),
                options = proto.options,
                SelfObj = this,
                elements = [],
                _const = {
                    attr: {
                        tooltip: "_tooltip",
                        state: "_tooltip_state"
                    }
                };

            //options
            $.extend(true, options, {
                holder: document.body,
                timeDelay: 350,
                AnimateTime: 55,
                timerReloadTooltips: 2500,
                margin: {
                    x: 15,
                    y: 15
                }
            });

            proto.constructor = function(){
                var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("div","class,tooltip",options.holder);

                var interval = new g.utils.Interval(SelfObj.reloadTooltips, options.timerReloadTooltips);
                interval.start();

                $(parent).hover(function(e){SelfObj.hide({effect: true});},function(e){SelfObj.hide({effect: true});});
            };

            function get_elements(){
                return $("["+_const.attr.tooltip+"]");
            };
            function tooltip_show(e){
                var element = this;

                if($(element).attr(_const.attr.tooltip).length < 1) return;

                $(element).attr(_const.attr.state, true);

                setTimeout(function(){
                    if($(element).attr(_const.attr.state) == 'true'){
                        $(proto.htmlNodes.main[0]).html($(element).attr(_const.attr.tooltip));
                        SelfObj.show({effect: true});
                        set_position(proto.htmlNodes.main[0], e, options.margin);
                    };
                }, options.timeDelay);
            };
            function tooltip_hide(e){
                var element = this;
                $(element).attr(_const.attr.state, false);
                SelfObj.hide({effect: true});
            };
            function set_position(element, e, margin){
                var window_temp = {
                        width: $(window).width(),
                        height: $(window).height()
                    },
                    el = {
                        width: $(element).width(),
                        height: $(element).height()
                    },
                    cursor = {
                        x: e.pageX,
                        y: e.pageY
                    },
                    top = 0,
                    left = 0;

                if(cursor.x + el.width + margin.x > window_temp.width){
                    left = window_temp.width - el.width;
                }else{
                    left = cursor.x  + margin.x;
                };

                if(cursor.y - el.height - margin.x < 0){
                    top = cursor.y + el.height + margin.x;
                }else{
                    top = cursor.y - el.height - margin.x;
                };

                $(element).css({
                    top: top,
                    left: left
                });
            };
            function set_elements(elements_old, elements_new){
                var output = [];

                function set_pos_temp(e){
                    set_position(proto.htmlNodes.main[0], e, options.margin);
                };

                $.each(elements_new, function(key, value){
                    if($.inArray(value, elements_old) == -1){
                        elements_old.push(value);
                        $(value).hover(tooltip_show, tooltip_hide);
                        $(value).mousemove(set_pos_temp);
                    };
                });

                $.each(elements_old, function(key, value){
                    if($.inArray(value, elements_new) == -1){
                        $(value).unbind('hover', tooltip_show);
                        $(value).unbind('hover', tooltip_hide);
                        $(value).unbind('mousemove', set_pos_temp);
                    }else{
                        output.push(value);
                    };
                });

                return output;
            };

            //PROPERTYS
            this.state = {};
            this.htmlElement = null;

            //METHODS
            this.reloadTooltips = function(){
                elements = set_elements(elements, get_elements());
            };

            this.destroy = proto.destroy;
            this.show = proto.show;
            this.hide = proto.hide;
            this.toogle = proto.toogle;

            proto.init(opt, param);
        },
        textline: function(opt, param){
            var proto = new Proto(),
                options = proto.options,
                SelfObj = this,
                _const = {
                    type: {
                        text: "text",
                        password: "password"
                    }
                };

            //options
            $.extend(true, options, {
                holder: document.body,
                focus: false,
                value: "",
                placeholder: "",
                type: _const.type.text,
                minLength: 0,
                maxLength: 0,
                regexp: /^.*$/,
                "class": {
                    error: "error"
                },
                checkData: false,
                onError: function(SelfObj, options){},
                tooltip: "",
                userCheckDataError: function(SelfObj, options){
                    return {
                        state: false,
                        callback: function(){}
                    };
                },
                blackList: []
            });

            proto.constructor = function(){
                var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("div","class,line-box",options.holder);
                var type = "";
                switch(options.type){
                    case _const.type.text:
                        type = "text";
                        break;
                    case _const.type.password:
                        type = "password";
                        break;
                };
                var input = proto.data.input = cwe("input",{
                    type: type,
                    placeholder: options.placeholder
                },parent);

                //set value
                SelfObj.setValue(options.value);
                //set maxlength
                if(options.maxLength != 0) $(input).attr("maxlength", options.maxLength);
                //set tooltip
                SelfObj.setTooltip(options.tooltip);
                //set focus
                if(options.focus) SelfObj.focus(true);
                //set autocheck value
                if(options.checkData){
                    var oldValue = SelfObj.getValue();

                    $(input).bind('keyup change', function(e){
                        if(oldValue != SelfObj.getValue()){
                            oldValue = $(input).val();
                            SelfObj.checkValue();
                        };
                    });

                    var interval = new g.utils.Interval(function(){
                        if(oldValue != SelfObj.getValue()){
                            oldValue = SelfObj.getValue();
                            SelfObj.checkValue();
                        };
                    },300);
                    interval.start();

                    //check value
                    SelfObj.setError(checkData(input), false);
                };
            };

            function checkData(input){
                var value = $(input).val();
                if(
                    (value.length < options.minLength && options.minLength != 0) ||
                        (value.length > options.maxLength && options.maxLength != 0) ||
                        (value.search(options.regexp) == -1) ||
                        ($.inArray(value, options.blackList) != -1)
                    ) return true;
                else return false;
            };

            //PROPERTYS
            this.state = {
                error: false
            };
            this.htmlElement = null;

            //METHODS
            this.setValue = function(value){
                $(proto.data.input).val(value);
            };
            this.setTooltip = function(value){
                $(proto.htmlNodes.main[0]).attr(g.const.attr.tooltip, value);
            };
            this.setVisualError = function(state){
                if(state) $(proto.htmlNodes.main[0]).addClass(options["class"].error);
                else $(proto.htmlNodes.main[0]).removeClass(options["class"].error);
            };
            this.setError = function(state, toogleClass){
                if(state){
                    SelfObj.state.error = true;
                    if(toogleClass) $(proto.htmlNodes.main[0]).addClass(options["class"].error);
                }else{
                    SelfObj.state.error = false;
                    if(toogleClass) $(proto.htmlNodes.main[0]).removeClass(options["class"].error);
                };
            };
            this.getBlacklist = function(){
                return options.blackList;
            };
            this.getTooltip = function(){
                return $(proto.htmlNodes.main[0]).attr(g.const.attr.tooltip);
            };
            this.getValue = function(){
                return $(proto.data.input).val();
            };
            this.addBlacklist = function(value){
                options.blackList.push(value);
            };
            this.removeBlacklist = function(value){
                var index = $.inArray(value, options.blackList);
                if(index != -1) options.blackList.splice(index, 1);
            };
            this.checkValue = function(){
                var default_check = checkData(proto.data.input),
                    user_check = options.userCheckDataError(SelfObj, options);

                if(default_check){
                    SelfObj.setError(true, true);
                    user_check.callback();
                }else if(user_check.state){
                    SelfObj.setError(true, true);
                    user_check.callback();
                }else if(!user_check.state){
                    SelfObj.setError(false, true);
                    user_check.callback();
                };

                if(SelfObj.state.error){
                    options.onError(SelfObj, options);
                    return false;
                }else return true;
            };
            this.focus = function(state){
                if(state) $(proto.data.input).focus();
                else $(proto.data.input).blur();
            };
            this.clear = function(){
                $(proto.data.input).val("");
            };

            this.destroy = proto.destroy;
            this.show = proto.show;
            this.hide = proto.hide;
            this.toogle = proto.toogle;

            proto.init(opt, param);
        },
        textarea: function(opt, param){
            var proto = new Proto(),
                options = proto.options,
                SelfObj = this;

            //options
            $.extend(true, options, {
                lineNumbers: true,
                resize: true,
                autoscroll: true,
                readonly: false,
                line: {
                    height: 15,
                    delimiter: '\n',
                    minLength: 0,
                    maxLength: 0,
                    regexp: /^.*$/
                },
                onResize: function(e){},
                holder: document.body,
                tooltip: "",
                value: "",
                focus: false
            });

            proto.constructor = function(){
                if($.browser.opera){
                    options.lineNumbers = false,
                        options.line.delimiter= "\r\n";
                };

                var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("div","id,addmod-box",options.holder);
                var editor = cwe("div","id,addmod",parent);

                if(options.lineNumbers){
                    var lines = proto.data.lines = cwe('div','class,numbox',editor);
                    var codelines = proto.data.codelines = cwe('div','class,num',lines);
                };

                var linedtextarea = proto.data.linedtextarea = cwe('div','class,linearea',editor);
                var textarea = proto.data.textarea = cwe('textarea','class,lined;wrap,off',linedtextarea);

                if(options.readonly) $(textarea).attr('readonly', 'on');

                if(options.resize){
                    var resize = proto.data.resize = cwe('div','class,resize',editor);
                }else{
                    $(textarea).css({resize: 'none'});
                };

                //set tooltip
                SelfObj.setTooltip(options.tooltip);
                //set focus
                if(options.focus) SelfObj.focus(true);
                //set value
                SelfObj.setValue(options.value, (options.value instanceof Array) ? false : true);

                //EVENTS
                if(options.lineNumbers){
                    $(textarea).bind('keyup click scroll', numberLineTrigger);
                    proto.data.oldValue = null;
                    var interval = new g.utils.Interval(function(){
                        if(proto.data.oldValue != SelfObj.getValue(true)) numberLineTrigger();
                    },500);
                    interval.start();
                };
                if(options.resize){
                    proto.data.goResize = false;
                    $(resize).mousedown(function(e){
                        //get textarea selection
                        proto.data.textareaSelection = {
                            start: proto.data.textarea.selectionStart,
                            end: proto.data.textarea.selectionEnd
                        };

                        //get mouse position
                        proto.data.mouse = {
                            top: e.pageY,
                            left: e.pageX
                        };

                        $(document).disableSelection();
                        $(window).mousemove(resizerTrigger);

                        proto.data.goResize = true;
                    });
                    $(window).mouseup(function(e){
                        if(proto.data.goResize){
                            proto.data.goResize = false;

                            $(window).unbind('mousemove',resizerTrigger);
                            $(document).enableSelection();

                            //set textarea selection
                            proto.data.textarea.selectionStart = proto.data.textareaSelection.start;
                            proto.data.textarea.selectionEnd = proto.data.textareaSelection.end;

                            //redraw number lines
                            if(options.lineNumbers) numberLineTrigger();
                        };
                    });
                };
                //EVENTS
            };

            function numberLine(opt, param){
                var proto = new Proto(),
                    options = proto.options,
                    SelfObj = this;

                //options
                $.extend(true, options, {
                    number: 1,
                    active: false,
                    error: false,
                    holder: document.body,
                    "class": {
                        active: 'active',
                        error: 'error'
                    }
                });

                proto.constructor = function(){
                    var parent = proto.data.main = proto.htmlNodes.main[0] = cwe("div","class,row", options.holder);

                    //set number
                    SelfObj.setNumber(options.number);
                };

                this.active = options.active;
                this.error = options.error;
                this.number = options.number;

                this.setActive = function(state){
                    if(state){
                        $(proto.data.main).addClass(options['class'].active);
                        SelfObj.active = true;
                    }else{
                        $(proto.data.main).removeClass(options['class'].active);
                        SelfObj.active = false;
                    };
                };
                this.setError = function(state){
                    if(state){
                        $(proto.data.main).addClass(options['class'].error);
                        SelfObj.error = true;
                    }else{
                        $(proto.data.main).removeClass(options['class'].error);
                        SelfObj.error = false;
                    };
                };
                this.setNumber = function(number){
                    $(proto.data.main).text(number);
                    SelfObj.number = number;
                };
                this.destroy = function(opt){
                    proto.destroy(opt);
                };

                proto.init(opt, param);
            };
            var CollectionNumberLine = {
                numbers: {},
                numbersError: {},
                activeNumber: 0,
                add: function(number){
                    if(CollectionNumberLine.numbers[number] == null){
                        CollectionNumberLine.numbers[number] = new numberLine({number: number, holder: proto.data.codelines},{visible: true});

                        if(CollectionNumberLine.numbersError[number] != null) CollectionNumberLine.setError([number], true);
                    };
                },
                changeNumber: function(number, newnumber){
                    if(CollectionNumberLine.numbers[number] != null){
                        CollectionNumberLine.numbers[number].setNumber(newnumber);
                        if(newnumber != number){
                            CollectionNumberLine.numbers[newnumber] = CollectionNumberLine.numbers[number];
                            CollectionNumberLine.remove(number);
                        };

                        if(CollectionNumberLine.numbersError[newnumber] != null) CollectionNumberLine.setError([newnumber], true);
                    };
                },
                remove: function(number){
                    if(CollectionNumberLine.numbers[number] != null){
                        CollectionNumberLine.numbers[number].destroy();
                        delete CollectionNumberLine.numbers[number];
                    };
                },
                setActive: function(number){
                    if(CollectionNumberLine.activeNumber == number) return;

                    $.each(CollectionNumberLine.numbers, function(key, value){
                        if(value != null){
                            if(key == number){
                                value.setActive(true);
                                CollectionNumberLine.activeNumber = value.number;
                            }else value.setActive(false);
                        };
                    });
                },
                setError: function(numbers, state){
                    $.each(numbers, function(key, number){
                        if(CollectionNumberLine.numbers[number] != null){
                            CollectionNumberLine.numbers[number].setError(state);
                        };

                        if(state) CollectionNumberLine.numbersError[number] = number;
                        else delete CollectionNumberLine.numbersError[number];
                    });
                },
                count: function(){
                    var count = 0;
                    $.each(CollectionNumberLine.numbers, function(key, value){
                        if(value != null) count++;
                    });

                    return count;
                },
                existsNumber: function(number){
                    if(CollectionNumberLine.numbers[number] == null) return false;
                    else return true;
                },
                setRange: function(first, length){
                    var count = 0, temp_obj = {};
                    $.each(CollectionNumberLine.numbers, function(key, value){
                        if(count <= length-1){
                            var number = temp_obj[first+count] = value;
                            number.setNumber(first+count);
                            number.setError(false);
                            count++;
                        }else{
                            CollectionNumberLine.remove(key);
                        };
                    });

                    while(count <= length-1){
                        temp_obj[first+count] = new numberLine({number: first+count, holder: proto.data.codelines},{visible: true});
                        count++;
                    };

                    CollectionNumberLine.numbers = temp_obj;

                    CollectionNumberLine.setError(CollectionNumberLine.numbersError, true);
                    CollectionNumberLine.setActive(CollectionNumberLine.activeNumber);
                }
            };

            function numberLineTrigger(){
                proto.data.oldValue = SelfObj.getValue(true);

                var firstNumber = SelfObj.getFirstDisplayLine(), count = SelfObj.getCountDisplayLine();

                $(proto.data.codelines).css('top', -$(proto.data.textarea).scrollTop()%options.line.height);

                CollectionNumberLine.setRange(firstNumber, count);
                CollectionNumberLine.setActive(SelfObj.getActiveLine());
            };
            function resizerTrigger(e){
                var size = SelfObj.getSize();
                SelfObj.setSize({
                    width: size.width + Math.ceil(e.pageX - proto.data.mouse.left),
                    height: size.height + Math.ceil(e.pageY - proto.data.mouse.top)
                });

                //set mouse position
                proto.data.mouse = {
                    top: e.pageY,
                    left: e.pageX
                };

                //redraw number lines
                if(options.lineNumbers) numberLineTrigger();

                //onResize event
                options.onResize(e);
            };
            function autoScrollTrigger(countLine){
                var first = SelfObj.getFirstDisplayLine(),
                    countDisplay = SelfObj.getCountDisplayLine();

                if(first + countDisplay - 1 >= countLine){
                    SelfObj.setActiveLine(countLine);
                };
            };

            //PROPERTYS
            this.htmlElement = null;

            this.getValue = function(return_string){
                if(return_string){
                    return $(proto.data.textarea).val().replace('\r\n', '\n');
                }else{
                    var out = SelfObj.getValue(true).split('\n');
                    if(out.length == 1 && out[0].length == 0) return [];
                    else return out;
                };
            };
            this.getCountLine = function(){
                var len = SelfObj.getValue().length;

                if(len == 0) return 1;
                else return len;
            };
            this.getCountDisplayLine = function(){
                var count = SelfObj.getCountLine() - SelfObj.getFirstDisplayLine() + 1,
                    maxCount = SelfObj.getMaxCountDisplayLine();

                if(count > maxCount) return maxCount;
                else return count;
            };
            this.getMaxCountDisplayLine = function(){
                var countLines = $(proto.data.textarea).innerHeight()/options.line.height;

                if(proto.data.textarea.clientHeight < $(proto.data.textarea).innerHeight()) countLines--;

                var scroll = $(proto.data.textarea).scrollTop()/options.line.height;
                var float_scroll = scroll - parseInt(scroll);
                //!!!!
				if(float_scroll > 0.20) countLines++;

                var float = countLines-parseInt(countLines);

                if(float > 0.30) return Math.ceil(countLines);
                else return Math.floor(countLines);
            };
            this.getActiveLine = function(){
                var selStart = proto.data.textarea.selectionStart,
                    curLength = 0,
                    val_arr = SelfObj.getValue();
                for(var i=0;i<val_arr.length;i++){
                    curLength += val_arr[i].length + options.line.delimiter.length;
                    if(selStart < curLength) return i+1;
                };

                return 1;
            };
            this.getFirstDisplayLine = function(){
                var first = ($(proto.data.textarea).scrollTop()/options.line.height)+1;

                var float = first-parseInt(first);

                if(float > 0.90) return Math.ceil(first);
                else return Math.floor(first);
            };
            this.getLines = function(numbers){
                var lines_out = [], lines = SelfObj.getValue();

                $.each(numbers, function(key, value){
                    lines_out.push({number: value, value: lines[value-1]});
                });

                return lines_out;
            };
            this.getNotCompatibleLines = function(){
                var lines_arr = SelfObj.getValue(), lines_out = [];

                $.each(lines_arr, function(key, value){
                    if(
                        (value.length < options.line.minLength && options.line.minLength != 0) ||
                            (value.length > options.line.maxLength && options.line.maxLength != 0) ||
                            (value.search(options.line.regexp) == -1)
                        )
                        lines_out.push({number: key+1, value: value});
                });

                return lines_out;
            };
            this.getSize = function(){
                return {
                    width: parseInt($(proto.data.linedtextarea).css('width')) + ((proto.data.lines) ? parseInt($(proto.data.lines).css('width')) : 0),
                    height: parseInt($(proto.data.linedtextarea).css('height'))
                };
            };
            this.getTooltip = function(){
                return $(proto.htmlNodes.main[0]).attr(g.const.attr.tooltip);
            };

            this.setValue = function(value, is_string){
                //get old value
                var old_value = SelfObj.getValue();

                //get textarea selection
                var textareaSelection = {
                    start: proto.data.textarea.selectionStart,
                    end: proto.data.textarea.selectionEnd
                };

                if(is_string) value = value.replace('\r\n','\n').split('\n');

                //set value
                $(proto.data.textarea).val(value.join(options.line.delimiter));

                //set textarea selection
                proto.data.textarea.selectionStart = textareaSelection.start;
                proto.data.textarea.selectionEnd = textareaSelection.end;

                //run autoscroll
                if(options.autoscroll) autoScrollTrigger(old_value.length);
            };
            this.setCountLine = function(count){
                SelfObj.setValue(SelfObj.getValue().slice(0, count));
            };
            this.setActiveLine = function(number){
                var cur_length = 0;
                $.each(SelfObj.getValue().slice(0, number-1), function(key, value){
                    cur_length += value.length + options.line.delimiter.length
                });

                SelfObj.setFirstDisplayLine(number);
                proto.data.textarea.selectionStart = cur_length + 1;
                proto.data.textarea.selectionEnd = cur_length + 1;
            };
            this.setFirstDisplayLine = function(number){
                $(proto.data.textarea).scrollTop(options.line.height * (number-1));
            };
            this.setSize = function(obj){
                $(proto.data.linedtextarea).css({
                    width: obj.width - ((proto.data.lines) ? parseInt($(proto.data.lines).outerWidth()) : 0),
                    height: obj.height
                });

                $(proto.data.lines).css({
                    height: obj.height
                });
            };
            this.setTooltip = function(value){
                $(proto.htmlNodes.main[0]).attr(g.const.attr.tooltip, value);
            };

            this.setErrorLines = function(numbers, state, focus){
                CollectionNumberLine.setError(numbers, state);

                if(focus) SelfObj.setActiveLine(numbers[0]);
            };
            this.disableErrorAllLines = function(){
                var lines_arr = [];
                for(var i=0;i<SelfObj.getValue().length;i++) lines_arr.push(i+1);

                SelfObj.setErrorLines(lines_arr, false, false);
            };

            this.addLine = function(lines, is_string){
                if(is_string) lines = lines.replace('\r\n', '\n').split('\n');

                SelfObj.setValue($.merge(SelfObj.getValue(), lines));
            };

            this.removeLines = function(numbers){
                numbers.sort(function(a,b){return a-b;});
                var arr_lines = SelfObj.getValue(), count = 0;

                $.each(numbers, function(key, value){
                    arr_lines.splice(value-1-count, 1);
                    count++;
                });
                CollectionNumberLine.setError(numbers, false);

                SelfObj.setValue(arr_lines);
            };
            this.removeNotCompatibleLines = function(){
                var arr_lines = SelfObj.getNotCompatibleLines(), lines_out = [];

                $.each(arr_lines, function(key, value){
                    lines_out.push(value.number);
                });

                SelfObj.removeLines(lines_out);
            };
            this.removeAllLines = function(){
                var arr_out = [];
                for(var i = 1;i<=SelfObj.getCountLine();i++) arr_out.push(i);
                SelfObj.removeLines(arr_out);
            };

            this.focus = function(state){
                if(state) $(proto.data.textarea).focus();
                else $(proto.data.textarea).blur();
            };

            this.destroy = proto.destroy;
            this.show = proto.show;
            this.hide = proto.hide;
            this.toogle = proto.toogle;

            proto.init(opt, param);
        },
		buttonContainer: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				buttons: {
					ok: {
						enable: false,
						order: 1,
						text: "OK",
						classes: [],
						click: function(e, button){},
						hotKey: ["13"],
						tooltip: ""
					},
					apply: {
						enable: false,
						order: 2,
						text: "Apply",
						classes: [],
						click: function(e, button){},
						hotKey: [],
						tooltip: ""
					},
					cancel: {
						enable: false,
						order: 3,
						text: "Cancel",
						classes: [],
						click: function(e, button){},
						hotKey: ["27"],
						tooltip: ""
					}
				}
			});

			proto.constructor = function(){
				var buttons = [];
				$.each(options.buttons, function(key, btn){
					if(btn.enable) buttons.push($.extend(true, btn, {name: key}));
				});
				buttons.sort(function(a,b){
					return a.order - b.order;
				});
				$.each(buttons, function(key, btn){
					SelfObj.buttons[btn.name] = new button($.extend(true, btn, {holder: options.holder}), {visible: true});
				});
			};

			function button(opt, param){
				var proto = new Proto(),
					options = proto.options,
					SelfObj = this,
					_const = {};

				//options
				$.extend(true, options, {
					holder: document.body,
					text: "",
					classes: [],
					click: function(e, button){},
					hotKey: [],
					tooltip: ""
				});

				proto.constructor = function(){
					var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("span","class,button",options.holder);

					//set classes
					$(parent).addClass(options.classes.join(" "));
					//set text
					SelfObj.setText(options.text);
					//set click
					$(parent).click(function(e){
						options.click(e, SelfObj);
					});
					//set tooltip
					SelfObj.setTooltip(options.tooltip);
					//set hotKey
					$(window).keydown(function(e){
							function isInt(string){
								return (string == parseInt(string).toString());
							};

						if(SelfObj.state.enableHotKey){
							var condition = "",
								symbol_event = "e";
							$.each(options.hotKey, function(key, value){
								if(isInt(value)){
									condition += symbol_event + ".keyCode == " + value + " && ";
								}else{
									condition += symbol_event + "." + value + " && ";
								};
							});
							condition = condition.substr(0, condition.length - 4);

							if(condition.length < 1) return;

							if(eval(condition)){
								$(parent).click();
							};
						};
					});
				};

				//PROPERTYS
				this.state = {
					enableHotKey: true
				};
				this.htmlElement = null;

				//METHODS
				this.setText = function(text){
					$.extend(true, options, {
						text: text
					});

					$(proto.htmlNodes.main[0]).text(options.text);
				};
				this.setClick = function(func){
					$.extend(true, options, {
						click: func
					});
				};
				this.setTooltip = function(value){
					$(proto.htmlNodes.main[0]).attr(g.const.attr.tooltip, value);
				};
				this.setEnabledHotKey = function(state){
					SelfObj.state.enableHotKey = (state) ? true : false;
				};
				this.getTooltip = function(){
					return $(proto.htmlNodes.main[0]).attr(g.const.attr.tooltip);
				};
				this.getText = function(){
					return options.text;
				};

				this.destroy = proto.destroy;
				this.show = proto.show;
				this.hide = proto.hide;
				this.toogle = proto.toogle;

				proto.init(opt, param);
			};

			//PROPERTYS
			this.state = {};
			this.htmlElement = null;
			this.buttons = {};

			//METHODS
			this.getButton = function(name){
				return SelfObj.buttons[name];
			};

			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		itemInfo: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				lng = g.lng.control.itemInfo,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				items: [
					{
						name: "pages",
						text: lng.pages,
						show: true,
						order: 1
					},
					{
						name: "referers",
						text: lng.referers,
						show: true,
						order: 3
					},
					{
						name: "paths",
						text: lng.paths,
						show: true,
						order: 2
					},
					{
						name: "uaseragents",
						text: lng.useragents,
						show: true,
						order: 4
					}
				]
			});

			proto.constructor = function(){
				var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("div","class,iteminfo",options.holder);
					var itemName = cwe("div","class,itemname",parent);
					SelfObj.items["itemName"] = {
						text: itemName
					};
					var info = cwe("table","class,iteminfotable",parent);
						var infoItemsHolder = cwe("tbody","",info);

				//select and sort items
				var items = [];
				$.each(options.items, function(key, val){
					if(val.show) items.push(val);
				});
				items.sort(function(a,b){return a.order- b.order;});
				//generate items
				$.each(items, function(key, cfg){
					if(!SelfObj.items[cfg.name]){
						var itemParent = cwe("tr","",infoItemsHolder);
						SelfObj.items[cfg.name] = {
							text: cwe("td","class,name",itemParent),
							value: cwe("td","class,value",itemParent)
						};
					};
				});
				//set all values to 0 and set text
				var _items = {
					itemName: {
						text: lng.itemNoName
					}
				};
				$.each(items, function(key, item){
					_items[item.name] = {
						text: item.text,
						value: 0
					};
				});
				SelfObj.setTextAndValue(_items);
			};

			//PROPERTYS
			this.state = {};
			this.items = {};
			this.htmlElement = null;

			//METHODS
			this.setTextAndValue = function(obj){
				$.each(obj, function(key, data){
					if(SelfObj.items[key]){
						if((typeof data.text) != undefined){
							if(key == "itemName"){
								if(data.text!= null && data.text.toString().length > 0) $(SelfObj.items[key].text).text(data.text);
								else $(SelfObj.items[key].text).text(lng.itemNoName);
							}else{
								$(SelfObj.items[key].text).text(data.text);
							};
						};
						if(data.value != null) $(SelfObj.items[key].value).text(data.value);
					};
				});
			};

			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		list: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				"classes": [],
				text: "",
				tooltip: "",
				onClick: function(list){}
			});

			proto.constructor = function(){
				var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("span","class,list",options.holder);
				//add other classes
				$(parent).addClass(options["classes"].join(" "));
				//set tooltip
				SelfObj.setTooltip(options.tooltip);
				//set text
				SelfObj.setText(options.text);
				//set onClick handler
				$(parent).click(function(e){
					options.onClick(SelfObj);
				});
			};

			//PROPERTYS
			this.state = {};
			this.htmlElement = null;

			//METHODS
			this.setTooltip = function(tooltip){
				$.extend(true, options, {
					tooltip: tooltip
				});

				$(SelfObj.htmlElement).attr(g.const.attr.tooltip, options.tooltip);
			};
			this.setText = function(text){
				$.extend(true, options, {
					text: text
				});

				$(SelfObj.htmlElement).text(options.text);
			};
			this.setOnClick = function(onClick){
				$.extend(true, options, {
					onClick: onClick
				});
			};

			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		button: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				"classes": [],
				text: "",
				tooltip: "",
				onClick: function(button){}
			});

			proto.constructor = function(){
				var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("span","class,button",options.holder);
				//add other classes
				$(parent).addClass(options["classes"].join(" "));
				//set tooltip
				SelfObj.setTooltip(options.tooltip);
				//set text
				SelfObj.setText(options.text);
				//set onClick handler
				$(parent).click(function(e){
					options.onClick(SelfObj);
				});
			};

			//PROPERTYS
			this.state = {};
			this.htmlElement = null;

			//METHODS
			this.setTooltip = function(tooltip){
				$.extend(true, options, {
					tooltip: tooltip
				});

				$(SelfObj.htmlElement).attr(g.const.attr.tooltip, options.tooltip);
			};
			this.setText = function(text){
				$.extend(true, options, {
					text: text
				});

				$(SelfObj.htmlElement).text(options.text);
			};
			this.setOnClick = function(onClick){
				$.extend(true, options, {
					onClick: onClick
				});
			};

			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		icon: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				iconSize: 32,
				"classes": [],
				tooltip: "",
				onClick: function(list){}
			});

			proto.constructor = function(){
				var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("span",{
					"class": "iconset" + ((options.iconSize == 16) ? "16" : "")
				},options.holder);
				//add other classes
				$(parent).addClass(options["classes"].join(" "));
				//set tooltip
				SelfObj.setTooltip(options.tooltip);
				//set onClick handler
				$(parent).click(function(e){
					options.onClick(SelfObj);
				});
			};

			//PROPERTYS
			this.state = {};
			this.htmlElement = null;

			//METHODS
			this.setTooltip = function(tooltip){
				$.extend(true, options, {
					tooltip: tooltip
				});

				$(SelfObj.htmlElement).attr(g.const.attr.tooltip, options.tooltip);
			};
			this.setOnClick = function(onClick){
				$.extend(true, options, {
					onClick: onClick
				});
			};

			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		}
    };

    //forms
    g.form = {
		main: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				lng = g.lng.form.main,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				lng: [
					{
						text: lng.lng.ru,
						"class": "ru",
						value: g.const.lng.ru,
						order: 1,
						enable: true
					},
					{
						text: lng.lng.en,
						"class": "eng",
						value: g.const.lng.en,
						order: 2,
						enable: false
					},
					{
						text: lng.lng.ua,
						"class": "ukr",
						value: g.const.lng.ua,
						enable: false
					}
				]
			});

			proto.constructor = function(){
				var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","id,container",options.holder);
				//header
					var header = cwe("div","id,header",parent);
						var boxWrap_header = cwe("div","class,boxwrap",header);
							var logo = cwe("div","id,logo",boxWrap_header);
								var tags = {
									href: ""
								};
								tags[g.const.attr.tooltip] = lng.goToStart;
								var toStart = cwe("a",tags,logo);
							cwe("div","class,cleared",boxWrap_header);
				//main
					var main = cwe("div","id,main",parent);
						var content = SelfObj.contentHolder = cwe("div","id,content",cwe("div","class,boxwrap", cwe("div","id,allbox",main)));
				//footer
					var footer = cwe("div","id,footer",parent);
						var boxWrap_footer = cwe("div","class,boxwrap",footer);
							var lng_list = cwe("ul","", cwe("div","class,lang",boxWrap_footer));
							//show lng
							options.lng.sort(function(a,b){return a.order- b.order;});
							$.each(options.lng, function(key, val){
								$(cwe("li","class,lng",lng_list))
									.addClass(val["class"] + ((g.utils.Language.get() == val.value) ? " active" : ""))
									.text(val.text)
									.click(function(e){
										if(val.enable){
											g.utils.Language.set(val.value);
											window.location.href = "";
										}else{
											alert(lng.localizationIsNotAvailable);
											return false;
										};
									});
							});
							$(cwe("div","class,copy",boxWrap_footer)).html("&copy; " + new Date().getFullYear() + " ESGenerator");
			};


			//PROPERTYS
			this.state = {};
			this.htmlElement = null;
			this.contentHolder = null;
			this.activeForm = null;

			//METHODS
			this.setActiveForm = function(data){
				data = $.extend(true, {
					form: null,
					callback: function(mainForm){}
				}, data);

				if(SelfObj.activeForm != null){
					SelfObj.activeForm.destroy({
						effect: false,
						callback: function(){
							SelfObj.activeForm = data.form(SelfObj.contentHolder);
							SelfObj.activeForm.show({
								effect: true,
								callback: function(){
									data.callback(SelfObj)
								}
							});
						}
					});
				}else{
					SelfObj.activeForm = data.form(SelfObj.contentHolder);
					SelfObj.activeForm.show({
						effect: true,
						callback: function(){
							data.callback(SelfObj)
						}
					});
				};
			};

			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		start: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				lng = g.lng.form.start,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				menuItems: [
					{
						title: lng.menuItems.createNew.title,
						text: lng.menuItems.createNew.text,
						"class": "new",
						onClick: function(){
							g.es = new wa_extSource({},{});
							g.data.form.main.setActiveForm({
								form: function(holder){
									return new g.form.editor({
										holder: holder
									},{visible: false});
								}
							});
						},
						order: 1,
						enable: true
					},
					{
						title: lng.menuItems.downloadFromUrl.title,
						text: lng.menuItems.downloadFromUrl.text,
						"class": "url",
						onClick: function(){
							alert(g.lng.other.functionalityIsNotAvailable);
						},
						order: 2,
						enable: true
					},
					{
						title: lng.menuItems.upload.title,
						text: lng.menuItems.upload.text,
						"class": "file",
						onClick: function(){
							alert(g.lng.other.functionalityIsNotAvailable);
						},
						order: 3,
						enable: true
					}
				]
			});

			proto.constructor = function(){
				var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","class,startmenu",options.holder);
					$(cwe("div","class,text",parent)).html(lng.aboutGenerator);

				//generate menu items
				options.menuItems.sort(function(a,b){return a.order- b.order;});
				$.each(options.menuItems, function(key, val){
					var container = $(cwe("div","class,list",parent)).addClass(val["class"]).click(function(e){
						val.onClick();
					});
					//set title
					$(cwe("h1","",container)).text(val.title);
					//set text
					$(cwe("p","",container)).text(val.text);
				});
			};


			//PROPERTYS
			this.state = {};
			this.htmlElement = null;

			//METHODS
			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		badBrowser: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				lng = g.lng.form.badBrowser,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				items: [
					{
						text: lng.items.chrome.text,
						"class": "chrome",
						url: "https://www.google.com/chrome/",
						show: true,
						order: 1
					},
					{
						text: lng.items.firefox.text,
						"class": "firefox",
						url: "http://www.mozilla.org",
						show: true,
						order: 2
					},
					{
						text: lng.items.opera.text,
						"class": "opera",
						url: "http://opera.com",
						show: true,
						order: 3
					},
					{
						text: lng.items.safari.text,
						"class": "safari",
						url: "http://www.apple.com/safari/download/",
						show: true,
						order: 4
					}
				]
			});

			proto.constructor = function(){
				var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("table","id,browsers_box",options.holder);
				var textHolder = cwe("td", "colspan,4", cwe("tr", "", cwe("thead","",parent)));
					$(cwe("h3","",textHolder)).text(lng.textTitle);
					$(cwe("div","",textHolder)).text(lng.text);
				var itemsHolder = cwe("tr", "", cwe("tbody","",parent));

				//select & sort items
				var items = [];
				$.each(options.items, function(key, val){
					if(val.show) items.push(val);
				});
				items.sort(function(a,b){
					return a.order- b.order;
				});
				//generate items
				$.each(items, function(key, cfg){
					var item = cwe("td","class,item",itemsHolder);
					$(cwe("div","class,browsers",item)).addClass(cfg["class"]);
					$(cwe("a",{
						target: "_blank",
						href: cfg.url
					},item)).text(cfg.text);
				});
			};


			//PROPERTYS
			this.state = {};
			this.htmlElement = null;

			//METHODS
			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		editor: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				lng = g.lng.form.editor,
				_const = {
					leftMenu: {
						item: {
							"class": {
								active: "active"
							}
						}
					}
				};

			//options
			$.extend(true, options, {
				holder: document.body
			});

			proto.constructor = function(){
				var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","id,editor",options.holder);
					var left = cwe("div","class,left",parent);
					var right = proto.data.right = cwe("div","class,right",parent);

				//set left
				////item info
				SelfObj.itemInfo = new g.control.itemInfo({
					holder: left
				},{visible: false});
				////menu
				var leftMenu = cwe("div","class,menu",left);
				//////set elements
				SelfObj.items.left.leftMenu.setElemets = new g.control.list({
					holder: leftMenu,
					text: lng.leftMenu.setElemets,
					onClick: function(list){
						leftMenu_setActiveItem(list);

						//set form
						SelfObj.setActiveForm({
							form: function(holder){
								return new form_setElements({holder: holder}, {visible: false});
							}
						});
					}
				},{visible: true});
				//////ex masks
				SelfObj.items.left.leftMenu.exMasks = new g.control.list({
					holder: leftMenu,
					text: lng.leftMenu.exMasks,
					onClick: function(list){
						leftMenu_setActiveItem(list);
					}
				},{visible: true});
				//////adress report
				SelfObj.items.left.leftMenu.adressReport = new g.control.list({
					holder: leftMenu,
					text: lng.leftMenu.adressReport,
					onClick: function(list){
						leftMenu_setActiveItem(list);
					}
				},{visible: true});
				////menu functions
				////// function set active
				function leftMenu_setActiveItem(item){
					$.each(SelfObj.items.left.leftMenu, function(key, menuItem){
						//set not active
						$(menuItem.htmlElement).removeClass(_const.leftMenu.item["class"].active);

						//set active
						if(menuItem == item) $(menuItem.htmlElement).addClass(_const.leftMenu.item["class"].active);
					});
				};

				//run default action
				$(SelfObj.items.left.leftMenu.setElemets.htmlElement).click();
			};

			//right forms
			function form_setElements(opt, param){
				var proto = new Proto(),
					options = proto.options,
					SelfObj = this,
					lng = g.lng.form.editor.form.setElements,
					_const = {};

				//options
				$.extend(true, options, {
					holder: document.body
				});

				proto.constructor = function(){
					var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","class,itemarea",options.holder);
					proto.htmlNodes.main[1] = cwe("div","class,cleared",options.holder);
						var listOption = cwe("div","class,listoption",parent);
							var list_priority = new g.control.list({
								holder: listOption,
								text: lng.listOption.priority.text,
								classes: ["priority"],
								onClick: function(list){
									alert("priority");
								}
							},{visible: true});
							var list_delete = new g.control.list({
								holder: listOption,
								text: lng.listOption["delete"].text,
								classes: ["delete"],
								onClick: function(list){
									alert("delete");
								}
							},{visible: true});
							var btn_add = new g.control.button({
								holder: listOption,
								text: lng.listOption.add.text,
								classes: ["add"],
								onClick: function(list){
									alert("add");
								}
							},{visible: true});

						var listArea = cwe("div","class,listarea",parent);
							var listTable = cwe("table","class,listtable",listArea);
								var listTable_header = cwe("tr","",cwe("thead","",listTable));
									var checkBox = cwe("input","type,checkbox",cwe("td","class,checkbx",listTable_header));
									$(cwe("td","class,name",listTable_header)).text(lng.listTable.name.text);
									$(cwe("td","class,priority",listTable_header)).text(lng.listTable.priority.text);
									$(cwe("td","class,option",listTable_header)).text(lng.listTable.option.text);
								var listTable_body = proto.data.itemHolder = cwe("tbody","",listTable);
				};

				function Item(opt, param){
					var proto = new Proto(),
						options = proto.options,
						SelfObj = this,
						lng = g.lng.form.editor.form.setElements,
						_const = {};

					//options
					$.extend(true, options, {
						holder: document.body,
						element: null
					});

					proto.constructor = function(){
						var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("tr","",options.holder);
					};

					//PROPERTYS
					this.state = {};
					this.htmlElement = null;

					//METHODS
					this.destroy = proto.destroy;
					this.show = proto.show;
					this.hide = proto.hide;
					this.toogle = proto.toogle;

					proto.init(opt, param);
				};

				//PROPERTYS
				this.state = {};
				this.htmlElement = null;
				this.items = {};

				//METHODS
				this.destroy = proto.destroy;
				this.show = proto.show;
				this.hide = proto.hide;
				this.toogle = proto.toogle;

				proto.init(opt, param);
			};

			//PROPERTYS
			this.state = {};
			this.itemInfo = null;
			this.htmlElement = null;
			this.items = {
				left: {
					leftMenu: {}
				},
				right: {
					form: {
						active: null
					}
				}
			};

			//METHODS
			this.setActiveForm = function(obj){
				var data = $.extend(true, {
					form: function(holder){
						return null;
					},
					callback: function(){}
				}, obj);

				if(SelfObj.items.right.form.active != null){
					SelfObj.items.right.form.active.destroy({
						callback: function(){
							SelfObj.items.right.form.active = data.form(proto.data.right);
							SelfObj.items.right.form.active.show({
								effect: true,
								callback: data.callback
							});
						}
					});
				}else{
					SelfObj.items.right.form.active = data.form(proto.data.right);
					SelfObj.items.right.form.active.show({
						effect: true,
						callback: data.callback
					});
				};
			};

			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		}
	};

    g.init = function(opt){
        //set options
        $.extend(true, g.options, opt);
        //set language
        g.utils.addScript(g.options.basePath+'generator/lng/es_gen.lng.'+g.utils.Language.get()+'.js', true);
        //init for moment document ready
        $(document).ready(function(e){
			//init tooltip
			g.data.control.tooltip = new g.control.tooltip();
			//init main form
			g.data.form.main = new g.form.main({},{visible: true});
			//init start form OR init badBrowser form
			g.data.form.main.setActiveForm({
				form: function(holder){
					return new g.form[(($.browser.msie) ? "badBrowser" : "start")]({
						holder: holder
					},{visible: false});
				}
			});
        });
    };

    window.wa_gen = g;
}(jQuery, window));
