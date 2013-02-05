(function($, window){
    var g = {
        options: {
            url: {
                uploadFromUrl: "ajax.php?route=esDownloadFromUrl",
                uploadFromPC: "ajax.php?route=esDownloadFromPC",
				downloadESFile: "ajax.php?route=esGenerate",
				downloadESFileAsArchive: "ajax.php?route=esGenerate"
            },
            basePath: "js/",
			callback_esUpdate: function(es){
				if(g.data.form.main.activeForm.itemInfo){
					g.data.form.main.activeForm.itemInfo.reload();
				};
				if(g.data.form.main.activeForm instanceof g.form.editor){
					g.data.form.main.infoArea.setSize(g.data.form.main.activeForm.getSize());
					if(window.localStorage) window.localStorage[g.const.cookie.es] = es.getJSON();
				};
			}
        },
        data: {
            control: {
                tooltip: null,
				loader: null
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
			es: 'es',
            expiriesday: 30
        },
        lng: {
            ru: 'ru_ru',
            en: 'en_en',
            ua: 'ua_ua'
        },
        attr: {
            tooltip: "_tooltip"
        },
		form: {
			messageBox: {
				type: {
					info: "info",
					error: "error",
					confirm: "confirm",
					input: "input",
					textarea: "textarea",
					number: "number",
					uploadFile: "uploadFile"
				}
			}
		},
		control: {
			textline: {
				type: {
					text: "text",
					password: "password",
					number: "number"
				}
			}
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
        },
		onChangeSize: function(element, action){
			var oldSize = {
				width: $(element).width(),
				height: $(element).height()
			};

			this.timer = new g.utils.Interval(function(){
				if($(element).width() != oldSize.width || $(element).height() != oldSize.height){
					oldSize = {
						width: $(element).width(),
						height: $(element).height()
					};
					action(element);
				};
			}, 300);
			this.timer.start();
		},
		getCountSymbols: function(text, regexp){
			var count = 0;
			while ((myArray = regexp.exec(text)) != null) {
				count++;
			};
			return count;
		},
		existMsgBox: function(){
			return !($("[wa_type='messageBox']").length == 0);
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
                SelfObj.hide({effect: false});
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
                        password: "password",
						number: "number"
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
				step: 1,
				min: -999999999,
				max: 999999999,
                regexp: /^.*$/,
                "class": {
                    error: "error",
					range: "range"
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
					case _const.type.number:
						type = "text";
						break;
                };
                var input = proto.data.input = cwe("input",{
                    type: type,
                    placeholder: options.placeholder
                },parent);

				if(options.type == _const.type.number){
					$.extend(true, options, {
						regexp: /^\-?\d*$/,
						checkData: true,
						userCheckDataError: function(textline){
							var value = ((parseInt(textline.getValue())) ? parseInt(textline.getValue()) : 0);

							if(value < options.min || value > options.max) return {state: true, callback: function(){}};
							else return {state: false, callback: function(){}};
						}
					});
					$(parent).addClass(options["class"].range);
					var rangeBox = cwe("span","class,rangebox",parent);
					var range_up = cwe("b","class,range top",rangeBox);
					var range_down = cwe("b","class,range bottom",rangeBox);

					//set events rangeBox
					var downing_up = false,
						downing_down = false,
						timeDelay = 1000,
						periodChange = 75,
						interval_up = new g.utils.Interval(function(){
							if(downing_up) SelfObj.plus();
							else interval_up.stop();
						},periodChange),
						interval_down = new g.utils.Interval(function(){
							if(downing_down) SelfObj.minus();
							else interval_down.stop();
						},periodChange);
					$(range_up).mousedown(function(){
						$(window).disableSelection();
						downing_up = true;

						setTimeout(function(){
							if(downing_up) interval_up.start();
						},timeDelay);
					});
					$(range_down).mousedown(function(){
						$(window).disableSelection();
						downing_down = true;

						setTimeout(function(){
							if(downing_down) interval_down.start();
						},timeDelay);
					});
					$(window).mouseup(function(){
						$(window).enableSelection();
						downing_up = false;
						downing_down = false;
						if(interval_up) interval_up.stop();
						if(interval_down) interval_down.stop();
					});
					$(range_up).click(SelfObj.plus);
					$(range_down).click(SelfObj.minus);
				};

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
			this.plus = function(){
				var value = ((parseInt(SelfObj.getValue())) ? parseInt(SelfObj.getValue()) : options.min),
					new_value = ((value+options.step > options.max) ? options.max : value+options.step);

				SelfObj.setValue(
					(new_value < options.min ? options.min : new_value)
				);
			};
			this.minus = function(){
				var value = ((parseInt(SelfObj.getValue())) ? parseInt(SelfObj.getValue()) : options.min+options.step),
					new_value = ((value-options.step < options.min) ? options.min : value-options.step);

				SelfObj.setValue(
					(new_value > options.max ? options.max : new_value)
				);
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
					var buttonHolder = SelfObj.buttonHolder = cwe("span","class,button-holder",parent);
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
				this.buttonHolder = null;

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
				this.click = function(){
					$(SelfObj.htmlElement).click();
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
			this.setEnabledHotKey = function(state){
				$.each(SelfObj.buttons, function(key, btn){
					btn.setEnabledHotKey(state);
				});
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
				element: null,
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
						name: "useragents",
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

				SelfObj.reload();
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
			this.setElement = function(element){
				options.element = element;
			};
			this.reload = function(){
				if(options.element == null) return;

				SelfObj.setTextAndValue({
					pages: {
						value: options.element.getPages().getCount()
					},
					referers: {
						value: options.element.getReferers().getCount()
					},
					paths: {
						value: options.element.getPaths().getCount()
					},
					useragents: {
						value: options.element.getUserAgents().getCount()
					}
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
			this.click = function(){
				$(SelfObj.htmlElement).click();
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
					"class": "iconset" + ((options.iconSize == 16) ? " x16" : "")
				},options.holder);
				//add other classes
				$(parent).addClass(options["classes"].join(" "));
				//set tooltip
				SelfObj.setTooltip(options.tooltip);
				//set onClick handler
				$(parent).click(function(e){
					e.stopPropagation();
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
			this.click = function(){
				$(SelfObj.htmlElement).click();
			};

			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		infoText: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				"classes": [],
				text: ""
			});

			proto.constructor = function(){
				var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("span","class,info-txt",options.holder);
				//add other classes
				$(parent).addClass(options["classes"].join(" "));
				//set text
				SelfObj.setText(options.text);
			};

			//PROPERTYS
			this.state = {};
			this.htmlElement = null;

			//METHODS
			this.setText = function(text){
				$.extend(true, options, {
					text: text
				});

				$(SelfObj.htmlElement).html(options.text);
			};

			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		boxClose: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				onClick: function(boxClose){}
			});

			proto.constructor = function(){
				var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("b","class,p-close",options.holder);

				//EVENTS
				$(parent).click(function(e){
					options.onClick(SelfObj);
				});
				$(window).keydown(keydownTrigger);
			};
			function keydownTrigger(e){
				if(e.keyCode == 27 && SelfObj.state.enableHotKey){
					$(SelfObj.htmlElement).click();
				};
			};

			//PROPERTYS
			this.state = {
				enableHotKey: true
			};
			this.htmlElement = null;

			//METHODS
			this.setEnabledHotKey = function(state){
				if(state){
					SelfObj.state.enableHotKey = true;
				}else{
					SelfObj.state.enableHotKey = false;
				};
			};

			this.destroy = function(param){
				$(window).unbind("keydown", keydownTrigger);
				proto.destroy(param);
			};
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		areaset: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body
			});

			proto.constructor = function(){
				var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("ul","class,areaset",options.holder);
			};

			//PROPERTYS
			this.state = {};
			this.htmlElement = null;
			this.items = {};

			//METHODS
			this.addControl = function(data){
				if(!data.name) return;
				if(!data.control) return;
				if(SelfObj.items[data.name]) return;

				var d = {
					text: null,
					control: null
				};

				//create text
				d.text = cwe("li","class,set",SelfObj.htmlElement);
				//set control
				d.control = data.control(cwe("li","",SelfObj.htmlElement));

				//apply data
				SelfObj.items[data.name] = d;

				//set text
				SelfObj.setControlText(data.name, data.text);
			};
			this.getControl = function(name){
				if(SelfObj.items[name]){
					return SelfObj.items[name].control;
				}
				else{
					return false;
				};
			};
			this.setControlText = function(name, text){
				if(SelfObj.items[name]){
					$(SelfObj.items[name].text).html(text);

					if(!text || text.length == 0){
						$(SelfObj.items[name].text).hide();
					}else{
						$(SelfObj.items[name].text).show();
					};
				};
			};
			this.remove = function(name){
				if(SelfObj.items[name]){
					$(SelfObj.items[name].text).remove();
					SelfObj.items[name].control.destroy();
				};
			};
			this.removeAll = function(){
				$(SelfObj.items, function(key, data){
					SelfObj.remove(key);
				});
			};

			this.destroy = function(param){
				SelfObj.removeAll();

				proto.destroy(param);
			};
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		loader: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body
			});

			proto.constructor = function(){
				var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("div","id,loader",options.holder);
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
		selectFile: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				lng = g.lng.control.selectFile,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				flashUrl: g.options.basePath + "swfupload/swfupload.swf",
				uploadUrl: "",
				fileTypes : "*.*",
				fileTypesDescription : lng.allFiles,
				postParams: {},
				filePostName : "Filedata",
				callback: function(data){}
			});

			proto.constructor = function(){
				var btnId = "uploadButton_"+ g.utils.randomInt(1,9999);
				var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("div","class,checkfile",options.holder);

				var buttonContainer = new g.control.buttonContainer({
					holder: parent,
					buttons: {
						selectFile: {
							enable: true,
							order: 1,
							text: lng.selectFile,
							classes: ["file"],
							click: function(e, button){},
							hotKey: [],
							tooltip: ""
						}
					}
				},{visible: true});
				var btnUpload = buttonContainer.getButton("selectFile");
				$(btnUpload.buttonHolder).attr("id", btnId);
				var fileInfo = proto.htmlNodes.fileInfo = cwe("span","class,fileinfo",parent);

				SelfObj.setSelectedFile(false);

				init_uploader();
				function init_uploader(){
					proto.data.swfu = new SWFUpload({
						flash_url : options.flashUrl,
						upload_url: options.uploadUrl,
						file_types : options.fileTypes,
						file_types_description : options.fileTypesDescription,
						post_params: options.postParams,
						file_post_name : options.filePostName,
						debug: false,

						// Button settings
						button_width: $(btnUpload.htmlElement).outerWidth(),
						button_height: $(btnUpload.htmlElement).outerHeight(),
						button_placeholder_id: btnId,
						button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
						button_cursor: SWFUpload.CURSOR.HAND,

						// The event handler functions are defined in handlers.js
						file_dialog_complete_handler: function(numFilesSelected, numFilesQueued){
							try{
								if(numFilesQueued > 0){
									for(var i=0;i<getCountAllFiles(this)-1;i++) this.cancelUpload(this.getFile(i)["id"]);
                                    SelfObj.setSelectedFile(this.getFile(getCountAllFiles(this)-1)["name"]);
								};
							}catch(ex){};
						},
						upload_progress_handler     : function(file, bytesLoaded, bytesTotal){
							try{}catch(ex){};
						},
						upload_success_handler      : function(file, serverData){
							try{
								options.callback(serverData);
							}catch(ex){};
						},
						upload_error_handler        : function(file, errorCode, message){
							try{
								switch (errorCode){
									case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
										break;
									case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
										break;
									case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
										break;
									case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
										break;
									default:
										break;
								};
							}catch(ex){};
						},
						upload_complete_handler     : function(){
							if (this.getStats().files_queued == 0){
								proto.data.swfu.setButtonDisabled(false);
                                SelfObj.setSelectedFile(false);
								g.data.control.loader.hide({effect: true});
							};
						}
					});
				};
			};
			function getCountAllFiles(swfu){
				var out = 0;
				$.each(swfu.getStats(), function(key, val){
					out += val;
				});
				return out;
			};

			//PROPERTYS
			this.state = {
				selectedFile: false
			};
			this.htmlElement = null;

			//METHODS
			this.setSelectedFile = function(text){
				if(text){
                    $(proto.htmlNodes.fileInfo).text(text);
                    SelfObj.state.selectedFile = true;
                }else{
                    $(proto.htmlNodes.fileInfo).text(lng.notSelectedFile);
                    SelfObj.state.selectedFile = false;
                };
			};
			this.startUpload = function(){
				proto.data.swfu.setButtonDisabled(true);
				g.data.control.loader.show({effect: true});
				proto.data.swfu.startUpload();
			};
			this.stopUpload = function(){
				for(var i=0;i<getCountAllFiles(proto.data.swfu);i++) proto.data.swfu.cancelUpload(proto.data.swfu.getFile(i)["id"]);
				proto.data.swfu.setButtonDisabled(false);
                SelfObj.setSelectedFile(false);
				g.data.control.loader.hide({effect: true});
			};

			this.destroy = proto.destroy;
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
		navigation: function(opt, param){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				lng = g.lng.control.navigation,
				_const = {};

			//options
			$.extend(true, options, {
				holder: document.body,
				data: [],
				currentPage: 1,
				callback_selectPage: function(data){},
				activePageView: 10,
				countPageSpace: 2,
				countPageView: [
					10,
					30,
					50,
					100,
					250
				]
			});

			proto.constructor = function(){
				proto.data.pages = [];

				var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("div","class,pagenavi-box",options.holder);
				var pageNavi = cwe("div","class,pagenavi",parent);
				var pageView = cwe("div","class,page-view",parent);
					$(cwe("span","class,ename",pageView)).html(lng.countPageView.show);
				$.each(options.countPageView, function(key, val){
					$(cwe("span","class,elink",pageView)).html(val).addClass((val == options.activePageView) ? "active" : "").click(function(){
						if(SelfObj.state.working) return;

						$.each(pageView.childNodes, function(key, node){
							if($(node).hasClass("elink"))$(node).removeClass("active");
						});
						$(this).addClass("active");

						SelfObj.setActiveCountPageView(val);
					});
				});

				var backListing = cwe("ul","class,back-listing",pageNavi);
				var pages = proto.htmlNodes.pages = cwe("ul","class,pages",pageNavi);
					var pageJump = cwe("li","class,page-jump",pages);
				var nextListing = cwe("ul","class,next-listing",pageNavi);

				proto.data.btn_first = new navItem({
					holder: backListing,
					"class": "first",
					text: lng.first,
					onClick: function(btn){
						SelfObj.selectPage(1);
					}
				},{visible: true});
				proto.data.btn_prev = new navItem({
					holder: backListing,
					"class": "prev",
					text: lng.prev,
					onClick: function(btn){
						SelfObj.selectPage((options.currentPage-1 >= 1) ? options.currentPage-1 : 1);
					}
				},{visible: true});
				proto.data.btn_next = new navItem({
					holder: nextListing,
					"class": "next",
					text: lng.next,
					onClick: function(btn){
						SelfObj.selectPage((options.currentPage+1 <= SelfObj.getCountPages()) ? options.currentPage+1 : SelfObj.getCountPages());
					}
				},{visible: true});
				proto.data.btn_last = new navItem({
					holder: nextListing,
					"class": "last",
					text: lng.last,
					onClick: function(btn){
						SelfObj.selectPage(SelfObj.getCountPages());
					}
				},{visible: true});
				var btn_pageJump = new navItem({
					holder: pageJump,
					"class": "page-num",
					text: lng.pages,
					onClick: function(btn){
						proto.data.pageRunBox.toogle({effect: true});
					}
				},{visible: true});
				proto.data.pageRunBox = new pageRunBox({
					holder: pageJump,
					navigation: SelfObj
				},{visible: false});

				SelfObj.selectPage(1);
			};

			function navItem(opt, param){
				var proto = new Proto(),
					options = proto.options,
					SelfObj = this,
					lng = g.lng.control.navigation,
					_const = {};

				//options
				$.extend(true, options, {
					holder: document.body,
					"class": "",
					text: "",
					onClick: function(button){}
				});

				proto.constructor = function(){
					var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = $(cwe("li","",options.holder)).addClass(options["class"])[0];

					SelfObj.setText(options.text);
					$(parent).click(function(e){
						e.stopPropagation();

						options.onClick(SelfObj);
					});
				};

				//PROPERTYS
				this.state = {};
				this.htmlElement = null;

				//METHODS
				this.setText = function(text){
					options.text = text;
					$(SelfObj.htmlElement).html(options.text);
				};
				this.setOnClick = function(onClick){
					option.onClick = onClick;
				};
				this.getParam = function(name){
					return options[name];
				};

				this.destroy = proto.destroy;
				this.show = proto.show;
				this.hide = proto.hide;
				this.toogle = proto.toogle;

				proto.init(opt, param);
			};
			function pageRunBox(opt, param){
				var proto = new Proto(),
					options = proto.options,
					SelfObj = this,
					lng = g.lng.control.navigation,
					_const = {};

				//options
				$.extend(true, options, {
					holder: document.body,
					animateTime: 25,
					navigation: false
				});

				proto.constructor = function(){
					var parent = proto.htmlNodes.main[0] = SelfObj.htmlElement = cwe("span","class,page-run-box",options.holder);
					$(cwe("div","class,page-run-title",parent)).html(lng.goToPage);
					var inputHolder = cwe("div","class,page-run-value",parent);
					var input = proto.data.input = new g.control.textline({
						holder: inputHolder,
						type: g.const.control.textline.type.number,
						min: 1
					},{visible: true});
					var buttonHolder = cwe("div","class,page-run-btn",parent);
					$(parent).click(function(e){
						e.stopPropagation();
					});
					$(window).keydown(function(e){
						buttonContainer.setEnabledHotKey(!g.utils.existMsgBox());
					});
					$(window).click(function(e){
						SelfObj.hide();
					});
					var buttonContainer = new g.control.buttonContainer({
						holder: buttonHolder,
						buttons: {
							ok: {
								enable: true,
								click: function(e, button){
									input.checkValue();
									if(!input.state.error && input.getValue() <= options.navigation.getCountPages()) options.navigation.selectPage(parseInt(input.getValue()));
									SelfObj.hide({effect: true});
									input.setValue("");
									input.setVisualError(false);
								}
							}
						}
					},{visible: true});
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
			this.state = {
				working: false
			};
			this.htmlElement = null;

			//METHODS
			this.getCountData = function(){
				return options.data.length;
			};
			this.getCountPages = function(){
				return (Math.ceil(SelfObj.getCountData()/options.activePageView) > 0) ? Math.ceil(SelfObj.getCountData()/options.activePageView) : 1;
			};
			this.getCurrentPage = function(){
				return options.currentPage;
			};
			this.setCurrentPage = function(number){
				return (options.currentPage = number);
			};
			this.setActiveCountPageView = function(count){
				options.activePageView = count;
				SelfObj.selectPage(1);
			};
			this.selectPage = function(number){
				SelfObj.state.working = true;

				var countData = SelfObj.getCountData(),
					countPages = SelfObj.getCountPages(),
					currentPage = SelfObj.setCurrentPage(number);

				//change first button
				if(currentPage-options.countPageSpace > 1) proto.data.btn_first.show();
				else proto.data.btn_first.hide();
				//change prev button
				if(currentPage-1 >= 1) proto.data.btn_prev.show();
				else proto.data.btn_prev.hide();
				//change next button
				if(currentPage+1 <= countPages) proto.data.btn_next.show();
				else proto.data.btn_next.hide();
				//change last button
				if(currentPage+options.countPageSpace < countPages) proto.data.btn_last.show();
				else proto.data.btn_last.hide();

				//change page buttons
				$.each(proto.data.pages, function(key, page){
					page.destroy();
				});
				proto.data.pages.length = 0;
				for(var i=currentPage-options.countPageSpace;i<=currentPage+options.countPageSpace;i++){
					if(i >= 1 && i <= countPages){
						var page = new navItem({
							holder: proto.htmlNodes.pages,
							"class": "page",
							text: i,
							onClick: function(btn){
								SelfObj.selectPage(btn.getParam("text"));
							}
						},{visible: true});

						if(i == currentPage) $(page.htmlElement).addClass("active");

						proto.data.pages.push(page);
					};
				};

				//prepare array to callback
				var out = $.extend([],options.data);
				out.splice(0,(currentPage-1)*options.activePageView);
				out.length = (out.length > options.activePageView) ? options.activePageView : out.length;

				options.callback_selectPage(out, function(){
					SelfObj.state.working = false;
				});
			};
			this.reload = function(){
				SelfObj.selectPage((SelfObj.getCountPages() <= SelfObj.getCurrentPage()) ? SelfObj.getCurrentPage() : SelfObj.getCountPages());
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
		messageBox: function(opt, param, _setData){
			var proto = new Proto(),
				options = proto.options,
				SelfObj = this,
				lng = g.lng.form.messageBox,
				_const = {
					type: {
						info: "info",
						error: "error",
						confirm: "confirm",
						input: "input",
						textarea: "textarea",
						number: "number",
						uploadFile: "uploadFile"
					},
					input: {
						input: "input",
						textarea: "textarea",
						number: "number",
						selectFile: "selectFile"
					}
				};

			//options
			$.extend(true, options, {
				holder: document.body,
				type: _const.type.info,
				setData: {}
			});
			////set default data to setData
			options.setData[((opt.type) ? opt.type : options.type)] = function(){
				return {
					title: "",
					text: "",
					"class": "",
					controls: [],
					buttons: {},
					onClick: {},
					events: [],
					functions: {},
					data: {}
				};
			};
			////special lng of type msgbox
			lng = lng[((opt.type) ? opt.type : options.type)];
			////add special data to setData
			var specialData = {
				info: function(){
					return {
						buttons: {
							ok: {
								enable: true,
								text: lng.buttons.ok.text,
								classes: ["save"]
							}
						}
					};
				},
				error: function(){
					return {
						"class": "error",
						buttons: {
							ok: {
								enable: true,
								text: lng.buttons.ok.text,
								classes: ["save"]
							}
						}
					};
				},
				confirm: function(){
					return {
						"class": "confirm",
						buttons: {
							ok: {
								enable: true,
								text: lng.buttons.ok.text,
								classes: ["save"]
							},
							cancel: {
								enable: true,
								text: lng.buttons.cancel.text,
								classes: ["cancel"]
							}
						}
					};
				},
				input: function(){
					return {
						buttons: {
							ok: {
								enable: true,
								text: lng.buttons.ok.text,
								classes: ["save"]
							},
							cancel: {
								enable: true,
								text: lng.buttons.cancel.text,
								classes: ["cancel"]
							}
						},
						controls: [
							//textline
							{
								name: _const.input.input,
								control: function(holder){
									return new g.control.textline({
										holder: holder,
										focus: true,
										value: getParam("data.value"),
										checkData: (getParam("data.allowEmpty") ? false: true),
										minLength: (getParam("data.allowEmpty") ? 0: 1),
										maxLength: 9999,
										placeholder: getParam("data.placeholder"),
										regexp: getParam("data.regexp")
									},{visible: true});
								}
							}
						],
						data: {
							value: "",
							allowEmpty: true,
							placeholder: "",
							regexp: /^.*$/
						}
					};
				},
				textarea: function(){
					return {
						buttons: {
							ok: {
								enable: true,
								text: lng.buttons.ok.text,
								classes: ["save"],
								hotKey: ["ctrlKey", "13"]
							},
							cancel: {
								enable: true,
								text: lng.buttons.cancel.text,
								classes: ["cancel"]
							}
						},
						controls: [
							//textarea
							{
								name: _const.input.textarea,
								control: function(holder){
									return new g.control.textarea({
										holder: holder,
										focus: true,
										value: getParam("data.value")
									},{visible: true});
								}
							}
						],
						data: {
							valule: ""
						}
					};
				},
				number: function(){
					return {
						buttons: {
							ok: {
								enable: true,
								text: lng.buttons.ok.text,
								classes: ["save"],
								hotKey: ["13"]
							},
							cancel: {
								enable: true,
								text: lng.buttons.cancel.text,
								classes: ["cancel"]
							}
						},
						controls: [
							//textline number
							{
								name: _const.input.number,
								control: function(holder){
									return new g.control.textline({
										holder: holder,
										focus: true,
										type: g.const.control.textline.type.number,
										min: 0,
										max: 999999999,
										value: getParam("data.value")
									},{visible: true});
								}
							}
						],
						data: {
							value: 0
						}
					};
				},
				uploadFile: function(){
					return {
						buttons: {
							ok: {
								enable: true,
								text: lng.buttons.ok.text,
								classes: ["save"],
								hotKey: ["13"]
							},
							cancel: {
								enable: true,
								text: lng.buttons.cancel.text,
								classes: ["cancel"]
							}
						},
						controls: [
							//select file
							{
								name: _const.input.selectFile,
								control: function(holder){
									return new g.control.selectFile({
										holder: holder,
										uploadUrl: getParam("data.uploadUrl"),
										fileTypes: getParam("data.fileTypes"),
										fileTypesDescription: getParam("data.fileTypesDescription"),
										postParams: getParam("data.postParams"),
										filePostName: getParam("data.filePostName"),
										callback: getParam("data.callback")
									},{visible: true});
								}
							}
						],
						data: {
							uploadUrl: "",
							fileTypes : "*.*",
							fileTypesDescription : "",
							postParams: {},
							filePostName : "Filedata",
							callback: function(data){}
						}
					};
				}
			};
			$.each(options.setData, function(key, data){
				var _data = $.extend(true, data(), specialData[key](), _setData[key]);
				options.setData[key] = function(){
					return _data;
				};
			});

			proto.constructor = function(){
				//prepare data msg
				//////////////////
				var setData = options.setData[options.type]();
					proto.data.zIndex = getNeedZindex(getMsgBoxes());
				SelfObj.input = _const.input;
				//////////////////

				//EVENT - toogle active state buttons and close icon
				$(window).keydown(keydowntrigger);
				//

				var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = $(cwe("div","class,p-wrap;wa_type,messageBox",options.holder)).css("zIndex", proto.data.zIndex)[0];
					var pBox = $(cwe("div","class,p-box",parent)).addClass(setData["class"])[0];
						var title = cwe("div","class,p-title",pBox);
						//set title text
						$(title).html(setData.title);
							proto.data.boxClose = new g.control.boxClose({
								holder: title,
								onClick: function(box){
									if(setData.buttons.cancel && setData.buttons.cancel.enable){
										SelfObj.buttonContainer.getButton("cancel").click();
									}else{
										SelfObj.buttonContainer.getButton("ok").click();
									};
								}
							},{visible: true});
						var content = cwe("div","class,p-content-area",pBox);
							var contentData = cwe("div","class,p-content",content);
							var footer = cwe("div","class,p-footer",content);
						var contentClear = $(cwe("div","class,p-content-clear",pBox)).hide()[0];

				//set msg text
				var msgText = proto.data.msgText = new g.control.infoText({
					holder: contentData,
					text: setData.text
				},{visible: true});
				//set error text
				var errorText = proto.data.errorText = new g.control.infoText({
					holder: contentData,
					"classes": ["error"]
				},{visible: false});

				//set controls
				SelfObj.areaset = new g.control.areaset({
					holder: contentData
				},{visible: true});
				$.each(setData.controls, function(key, control){
					SelfObj.areaset.addControl(control);
				});

				//set buttons
				$.each(setData.buttons, function(key, btn_cfg){
					setData.buttons[key].click = function(e, button){
						if(setData.onClick[key]){
							setData.onClick[key](SelfObj);
						}else{
							SelfObj.destroy({effect: true});
						};
					};
				});
				SelfObj.buttonContainer = new g.control.buttonContainer({
					holder: footer,
					buttons: setData.buttons
				},{visible: true});

				//EVENTS
				$.each(setData.events, function(key, event){
					event(SelfObj);
				});

				////set draggable
				$(pBox).draggable({
					handle: title,
					opacity: 0.5,
					containment: "document",
					start: function(event, ui) {
						$(contentClear).css({
							width: $(content).outerWidth(),
							height: $(content).outerHeight()
						}).show();
						$(content).hide();
					},
					stop: function(event, ui) {
						$(contentClear).hide();
						$(content).show();
					}
				});
				////set to center
				setToCenter(pBox);
				$(window).resize(function(e){
					setToCenter(pBox);
				});
				////set width msg text & error text
				/*proto.data.textResizer = new g.utils.onChangeSize(contentData, function(element){
					$(msgText.htmlElement).width($(element).width());
					$(errorText.htmlElement).width($(element).width());
				})*/
			};

			function getMsgBoxes(){
				return $("[wa_type='messageBox']");
			};
			function getNeedZindex(msgboxes){
				var zIndex_default = 100;

				if(msgboxes.length == 0) return zIndex_default;
				else{
					return zIndex_default + (msgboxes.length);
				};
			};
			function isActiveMsgBox(cur_zIndex, msgboxes){
				var output = true;

				$.each(msgboxes, function(key, value){
					if(cur_zIndex < $(value).css("zIndex")) output = false;
				});

				return output;
			};
			function setToCenter(element){
				$(element).css({
					top: $(window).height()/2-$(element).height()/2,
					left: $(window).width()/2-$(element).width()/2
				});
			};
			function keydowntrigger(e){
				var state = isActiveMsgBox(proto.data.zIndex, getMsgBoxes());
				SelfObj.buttonContainer.setEnabledHotKey(state);
				proto.data.boxClose.setEnabledHotKey(state);
			};
			function getParam(path){
				return eval("options.setData[((opt.type) ? opt.type : options.type)]()" + ((path) ? "."+path : ""));
			};

			//PROPERTYS
			this.input = null;
			this.state = {};
			this.htmlElement = null;
			this.buttonContainer = null;
			this.areaset = null;

			//METHODS
			this.errorShow = function(text){
				proto.data.errorText.setText(text);
				proto.data.errorText.show({effect: true});
			};
			this.errorHide = function(){
				proto.data.errorText.hide();
			};

			this.destroy = function(param){
				SelfObj.hide({
					effect: true,
					callback: function(){
						proto.data.boxClose.destroy();
						SelfObj.areaset.destroy();
						//proto.data.textResizer.timer.stop();

						proto.destroy(param);
					}
				});
			};
			this.show = proto.show;
			this.hide = proto.hide;
			this.toogle = proto.toogle;

			proto.init(opt, param);
		},
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
							//INFO AREA
							var infoArea = proto.htmlNodes.infoArea = $(cwe("div","id,infoarea",boxWrap_header)).hide()[0];
								var infoArea_info = cwe("div","class,info",infoArea);
								var infoArea_holder_1 = cwe("tbody","",cwe("table","class,projectinfo",infoArea_info));
								var tr_1 = cwe("tr","",infoArea_holder_1),
									tr_2 = cwe("tr","",infoArea_holder_1);
								$(cwe("td","class,name",tr_1)).html(lng.projectName);
								proto.htmlNodes.projectName = cwe("td","class,value",tr_1);
								$(cwe("td","class,name",tr_2)).html(lng.fileSize);
								proto.htmlNodes.fileSize = cwe("td","class,value",tr_2);
								var div_options = cwe("div","class,options",infoArea);
								var icon_renameProject = new g.control.icon({
									holder: div_options,
									classes: ["rename"],
									tooltip: lng.icons.rename.tooltip,
									onClick: function(icon){
										var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
											input: {
												title: lng.msg.renameProject.title,
												text: lng.msg.renameProject.text,
												onClick: {
													ok: function(msg){
														SelfObj.infoArea.setNameProject(msg.areaset.getControl(msg.input.input).getValue());

														msg.destroy();
													}
												},
												data: {
													value: g.es.getProjectName()
												}
											}
										});
										msg.show({effect: true});
									}
								},{visible: true});
								var icon_downloadZip = new g.control.icon({
									holder: div_options,
									classes: ["download_zip"],
									tooltip: lng.icons.download_zip.tooltip,
									onClick: function(icon){
                                        g.data.control.loader.show({
                                            callback: function(){
                                                $.post(g.options.url.downloadESFile, {
                                                    json: g.es.getJSON(),
                                                    zip: true
                                                },function(data){
                                                    g.data.control.loader.hide();
                                                    try{
                                                        data = $.evalJSON(data);
                                                        window.location.href=data.url
                                                    }catch(e){
                                                        var msg = new g.form.messageBox({type: g.const.form.messageBox.type.error},{visible: false},{
                                                            error: {
                                                                title: lng.msg.errorDownloadES.title,
                                                                text: lng.msg.errorDownloadES.text
                                                            }
                                                        });
                                                        msg.show({effect: true});
                                                    };
                                                });
                                            }
                                        });
									}
								},{visible: true});
								var icon_downloadFile = new g.control.icon({
									holder: div_options,
									classes: ["download_file"],
									tooltip: lng.icons.download_file.tooltip,
									onClick: function(icon){
                                        g.data.control.loader.show({
                                            callback: function(){
                                                $.post(g.options.url.downloadESFile, {
                                                    json: g.es.getJSON()
                                                },function(data){
                                                    g.data.control.loader.hide();
                                                    try{
                                                        data = $.evalJSON(data);
                                                        window.location.href=data.url
                                                    }catch(e){
                                                        var msg = new g.form.messageBox({type: g.const.form.messageBox.type.error},{visible: false},{
                                                            error: {
                                                                title: lng.msg.errorDownloadES.title,
                                                                text: lng.msg.errorDownloadES.text
                                                            }
                                                        });
                                                        msg.show({effect: true});
                                                    };
                                                });
                                            }
                                        });
									}
								},{visible: true});
							///////////
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
			this.infoArea = {
				setVisible: function(state){
					if(state){
						$(proto.htmlNodes.infoArea).show();
					}else{
						$(proto.htmlNodes.infoArea).hide();
					};
				},
				setNameProject: function(text){
					g.es.setProjectName(text);
					$(proto.htmlNodes.projectName).text(((typeof g.es.getProjectName()) == "string" && g.es.getProjectName().length > 0) ? g.es.getProjectName() : lng.unNamedProject);
				},
				setSize: function(bytes){
					var out = bytes,
						type = lng.byte;

					//mb
					if(bytes / (1024 * 1024) > 1){
						out = (bytes / (1024 * 1024)).toFixed(2);
						type = lng.megabyte;
					}else if(bytes / 1024 > 1){//kb
						out = (bytes / (1024)).toFixed(2);
						type = lng.kilobyte;
					}else{//byte
						out = bytes.toFixed(2);
						type = lng.byte;
					};

					$(proto.htmlNodes.fileSize).html(out + " " + type);
				}
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
							var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
								input: {
									title: lng.msg.setNameProject.title,
									text: lng.msg.setNameProject.text,
									onClick: {
										ok: function(msg){
											g.es = new wa_extSource({},{
												onChange: g.options.callback_esUpdate
											});
											g.es.setProjectName(msg.areaset.getControl(msg.input.input).getValue());
											g.data.form.main.setActiveForm({
												form: function(holder){
													return new g.form.editor({
														holder: holder
													},{visible: false});
												}
											});

											msg.destroy();
										}
									}
								}
							});
							msg.show({effect: true});
						},
						order: 1,
						enable: true
					},
					{
						title: lng.menuItems.downloadFromUrl.title,
						text: lng.menuItems.downloadFromUrl.text,
						"class": "url",
						onClick: function(){
							var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
								input: {
									title: lng.msg.uploadFromUrl.title,
									text: lng.msg.uploadFromUrl.text,
									onClick: {
										ok: function(msg){
											msg.errorHide();

											msg.areaset.getControl(msg.input.input).checkValue();
											if(msg.areaset.getControl(msg.input.input).state.error){
												msg.errorShow(lng.msg.uploadFromUrl.badUrl);
												msg.areaset.getControl(msg.input.input).focus(true);
												return;
											};

											g.data.control.loader.show({
												callback: function(){
													$.post(g.options.url.uploadFromUrl, {
														url: msg.areaset.getControl(msg.input.input).getValue()
													}, function(data){
														g.data.control.loader.hide({
															callback: function(){
																if(data && data.length > 0){
																	try{
																		var d = "";
																		eval("d="+data);

																		g.es = new wa_extSource(d,{
																			onChange: g.options.callback_esUpdate
																		});
																		g.data.form.main.setActiveForm({
																			form: function(holder){
																				return new g.form.editor({
																					holder: holder
																				},{visible: false});
																			}
																		});

																		msg.destroy();
																	}catch(e){
																		msg.errorShow(lng.msg.uploadFromUrl.notValidJSON);
																	};
																}else{
																	msg.errorShow(lng.msg.uploadFromUrl.failedLoadFromUrl);
																};
															}
														});
													});
												}
											});
										}
									},
									data: {
										placeholder: "http://",
										allowEmpty: false,
										regexp: /^(http|https|ftp)(:\/\/)((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(([a-zA-Zа-яА-Я0-9\-]*\.)+[a-zA-Zа-яА-Я\-\d]{2,9}))(\/{1}.{1,})?$/
									}
								}
							});
							msg.show({effect: true});
						},
						order: 2,
						enable: true
					},
					{
						title: lng.menuItems.upload.title,
						text: lng.menuItems.upload.text,
						"class": "file",
						onClick: function(){
							var msg = new g.form.messageBox({type: g.const.form.messageBox.type.uploadFile},{visible: false},{
								uploadFile: {
									title: lng.msg.uploadFromPC.title,
									text: lng.msg.uploadFromPC.text,
									data: {
										uploadUrl: g.options.url.uploadFromPC,
										fileTypes : "*.txt;*.zip",
										fileTypesDescription : "",
										postParams: {},
										filePostName : "es",
										callback: function(data){
											if(data && data.length > 0){
												try{
													var d = "";
													eval("d="+data);

													g.es = new wa_extSource(d,{
														onChange: g.options.callback_esUpdate
													});
													g.data.form.main.setActiveForm({
														form: function(holder){
															return new g.form.editor({
																holder: holder
															},{visible: false});
														}
													});

													msg.destroy();
												}catch(e){
													msg.errorShow(lng.msg.uploadFromPC.notValidJSON);
												};
											}else{
												msg.errorShow(lng.msg.uploadFromPC.failedLoadFromPC);
											};
										}
									},
									onClick: {
										ok: function(msg){
											msg.errorHide();

											if(!msg.areaset.getControl(msg.input.selectFile).state.selectedFile){
												msg.errorShow(lng.msg.uploadFromPC.notSelectedFile);
												return;
											};

											msg.areaset.getControl(msg.input.selectFile).startUpload();
										}
									}
								}
							});
							msg.show({effect: true});
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

				//use prev es
				if(window.localStorage[g.const.cookie.es]){
					var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
						confirm: {
							title: lng.msg.usePrevES.title,
							text: lng.msg.usePrevES.text,
							onClick: {
								ok: function(msg){
									msg.destroy({
										callback: function(){
											try{
												var d = "";
												eval("d="+window.localStorage[g.const.cookie.es]);

												g.es = new wa_extSource(d,{
													onChange: g.options.callback_esUpdate
												});
												g.data.form.main.setActiveForm({
													form: function(holder){
														return new g.form.editor({
															holder: holder
														},{visible: false});
													}
												});
											}catch(e){
												delete window.localStorage[g.const.cookie.es];

												var _msg = new g.form.messageBox({type: g.const.form.messageBox.type.error},{visible: false},{
													error: {
														title: lng.msg.failedLoadFromBrowser.title,
														text: lng.msg.failedLoadFromBrowser.text
													}
												});
												_msg.show({error: true});
											};
										}
									});
								}
							}
						}
					});
					msg.show({effect: true});
				};
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
						SelfObj.itemInfo.hide();

						//set form
						SelfObj.setActiveForm({
							form: function(holder){
								return new form_setElements({
									holder: holder,
									callback_selectElement: function(element){
										SelfObj.itemInfo.setElement(element);
										SelfObj.itemInfo.reload();
										SelfObj.itemInfo.show();
									}
								}, {visible: false});
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
						SelfObj.itemInfo.hide();

						//set form
						SelfObj.setActiveForm({
							form: function(holder){
								return new form_exMasks({holder: holder}, {visible: false});
							}
						});
					}
				},{visible: true});
				//////adress report
				SelfObj.items.left.leftMenu.adressReport = new g.control.list({
					holder: leftMenu,
					text: lng.leftMenu.adressReport,
					onClick: function(list){
						leftMenu_setActiveItem(list);
						SelfObj.itemInfo.hide();

						//set form
						SelfObj.setActiveForm({
							form: function(holder){
								return new form_report({holder: holder}, {visible: false});
							}
						});
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

				g.data.form.main.infoArea.setNameProject(g.es.getProjectName());
				g.data.form.main.infoArea.setSize(SelfObj.getSize());
				g.data.form.main.infoArea.setVisible(true);
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
					holder: document.body,
					callback_selectElement: function(element){}
				});

				proto.constructor = function(){
					var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","class,itemarea",options.holder);
					proto.htmlNodes.main[1] = cwe("div","class,cleared",options.holder);
						var listOption = cwe("div","class,listoption",parent);
							var list_priority = proto.data.btnPriority = new g.control.list({
								holder: listOption,
								text: lng.listOption.priority.text,
								classes: ["priority"],
								onClick: function(list){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.number},{visible: false},{
										number: {
											title: lng.msg.setPriority.title,
											text: lng.msg.setPriority.text,
											data: {
												value: 1
											},
											onClick: {
												ok: function(msg){
													msg.errorHide();

													if(msg.areaset.getControl(msg.input.number).state.error){
														msg.errorShow(lng.msg.setPriority.error);
														msg.areaset.getControl(msg.input.number).focus(true);
														return;
													};

													$.each(getCheckedFormItems(SelfObj.items), function(key, item){
														item.setPriority(msg.areaset.getControl(msg.input.number).getValue());
														item.setChecked(false);
													});

													proto.htmlNodes.checkBox_all.checked = false;
													SelfObj.groupButtonVisibleState(false);

													msg.destroy();
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: false});
							var list_delete = proto.data.btnDelete = new g.control.list({
								holder: listOption,
								text: lng.listOption["delete"].text,
								classes: ["delete"],
								onClick: function(list){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
										confirm: {
											title: lng.msg.removeItems.title,
											text: lng.msg.removeItems.text,
											onClick: {
												ok: function(msg){
													msg.destroy({callback: function(){
														$.each(getCheckedFormItems(SelfObj.items), function(key, item){
															item.destroy();
														});

														proto.htmlNodes.checkBox_all.checked = false;
														SelfObj.groupButtonVisibleState(false);
													}});
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: false});
							var btn_add = new g.control.button({
								holder: listOption,
								text: lng.listOption.add.text,
								classes: ["add"],
								onClick: function(list){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
										input: {
											title: lng.msg.add.title,
											text: lng.msg.add.text,
											onClick: {
												ok: function(msg){
													SelfObj.addItem(g.es.getItems().addRaw(msg.areaset.getControl(msg.input.input).getValue()));

													msg.destroy();
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});

						var listArea = cwe("div","class,listarea",parent);
							var navigation = proto.data.navigation = new g.control.navigation({
								holder: listArea,
								data: g.es.getItems().get(),
								callback_selectPage: function(data, callback){
									$(proto.htmlNodes.itemHolder).html("");
									SelfObj.items.length = 0;

									$.each(data, function(key, item){
										setTimeout(function(){
											SelfObj.addItem(item);
										}, 1);
									});
									setTimeout(callback,data.length);
								}
							},{visible: true});
							var listTable = cwe("table","class,listtable",listArea);
								var listTable_header = cwe("tr","",cwe("thead","",listTable));
									var checkBox = proto.htmlNodes.checkBox_all = cwe("input","type,checkbox",cwe("td","class,checkbx",listTable_header));
									$(cwe("td","class,name",listTable_header)).text(lng.listTable.name.text);
									$(cwe("td","class,priority",listTable_header)).text(lng.listTable.priority.text);
									$(cwe("td","class,option",listTable_header)).text(lng.listTable.option.text);
								var listTable_body = proto.htmlNodes.itemHolder = cwe("tbody","",listTable);

					//set events
					$(checkBox).click(function(e){
						$.each(SelfObj.items, function(key, item){
							item.setChecked(e.target.checked);
							SelfObj.groupButtonVisibleState(e.target.checked);
						});
					});
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
						"class": {
							checked: "checked"
						},
						element: null,
						callback_remove: function(){},
						callback_checkbox: function(){},
						callback_selectElement: function(element){}
					});

					proto.constructor = function(){
						var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("tr","",options.holder);
							var checkBox = proto.htmlNodes.checkBox = cwe("input","type,checkbox",cwe("td","class,checkbx",parent));
							var name = proto.htmlNodes.name = cwe("span","class,elink",cwe("td","class,name",parent));
							var priority = proto.htmlNodes.priority = cwe("td","class,priority",parent);
							var option = cwe("td","class,option",parent);

						var icon_edit = new g.control.icon({
							holder: option,
							iconSize: 16,
							classes: ["edit"],
							tooltip: lng.listTable.option.icons.edit.tooltip,
							onClick: function(icon){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
									input: {
										title: lng.msg.rename.title,
										text: lng.msg.rename.text,
										data: {
											value: SelfObj.getName()
										},
										onClick: {
											ok: function(msg){
												SelfObj.setName(msg.areaset.getControl(msg.input.input).getValue());

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});
						var icon_priority = new g.control.icon({
							holder: option,
							iconSize: 16,
							classes: ["priority"],
							tooltip: lng.listTable.option.icons.priority.tooltip,
							onClick: function(icon){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.number},{visible: false},{
									number: {
										title: lng.msg.setPriority.title,
										text: lng.msg.setPriority.text,
										data: {
											value: SelfObj.getPriority()
										},
										onClick: {
											ok: function(msg){
												msg.errorHide();

												if(msg.areaset.getControl(msg.input.number).state.error){
													msg.errorShow(lng.msg.setPriority.error);
													msg.areaset.getControl(msg.input.number).focus(true);
													return;
												};

												SelfObj.setPriority(msg.areaset.getControl(msg.input.number).getValue());

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});
						var icon_delete = new g.control.icon({
							holder: option,
							iconSize: 16,
							classes: ["delete"],
							tooltip: lng.listTable.option.icons["delete"].tooltip,
							onClick: function(icon){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
									confirm: {
										title: lng.msg.removeItem.title,
										text: lng.msg.removeItem.text,
										onClick: {
											ok: function(msg){
												msg.destroy({callback: function(){
													SelfObj.destroy();
												}});
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});

						//set name & priority
						SelfObj.setName(SelfObj.getName());
						SelfObj.setPriority(SelfObj.getPriority());

						//set events
						$(checkBox).click(function(e){
							e.stopPropagation();
						});
						$(checkBox).change(function(e){
							SelfObj.setChecked(e.target.checked);
							options.callback_checkbox();
						});
						$(name).click(function(e){
							e.stopPropagation();
							options.callback_selectElement(options.element);
							g.data.form.main.activeForm.setActiveForm({
								form: function(holder){
									return new form_element({
										holder: holder,
										element: options.element
									},{visible: false});
								}
							});
						});
						$(parent).click(function(e){
							$(checkBox).click();
						});
					};

					//PROPERTYS
					this.state = {
						checked: false
					};
					this.htmlElement = null;

					//METHODS
					this.getName = function(){
						return options.element.getName();
					};
					this.getPriority = function(){
						return options.element.getPriority();
					};
					this.getElement = function(){
						return options.element;
					};
					this.setName = function(name){
						options.element.setName(name);
						$(proto.htmlNodes.name).text(((typeof SelfObj.getName()) == "string" && SelfObj.getName().length > 0) ? SelfObj.getName() : lng.unnamed);
					};
					this.setPriority = function(priority){
						options.element.setPriority(priority);
						$(proto.htmlNodes.priority).text(SelfObj.getPriority());
					};
					this.setChecked = function(state){
						if(state){
							SelfObj.state.checked = true;
							proto.htmlNodes.checkBox.checked = true;
							$(SelfObj.htmlElement).addClass(options["class"].checked);
						}else{
							SelfObj.state.checked = false;
							proto.htmlNodes.checkBox.checked = false;
							$(SelfObj.htmlElement).removeClass(options["class"].checked);
						};
					};

					this.destroy = function(){
						g.es.getItems().remove(options.element);
						options.callback_remove(SelfObj);
						proto.destroy();
					};
					this.show = proto.show;
					this.hide = proto.hide;
					this.toogle = proto.toogle;

					proto.init(opt, param);
				};

				//PROPERTYS
				this.state = {};
				this.htmlElement = null;
				this.items = [];

				//METHODS
				this.addItem = function(item){
					SelfObj.items.push(
						new Item({
							holder: proto.htmlNodes.itemHolder,
							element: item,
							callback_remove: function(item){
								SelfObj.removeItem(item);
								proto.data.navigation.reload();
							},
							callback_checkbox: function(){
								var checkAll = true,
									checkOneOrMore = false;

								$.each(SelfObj.items, function(key, item){
									if(!item.state.checked){
										checkAll = false;
									}else{
										checkOneOrMore = true;
									};
								});

								proto.htmlNodes.checkBox_all.checked = checkAll;
								SelfObj.groupButtonVisibleState(checkOneOrMore);
							},
							callback_selectElement: options.callback_selectElement
						},{visible: true})
					);
				};
				this.removeItem = function(item){
					var index = $.inArray(item, SelfObj.items);
					if(index != -1){
						SelfObj.items.splice(index, 1);
					};
				};
				this.groupButtonVisibleState = function(state){
					if(state){
						proto.data.btnPriority.show();
						proto.data.btnDelete.show();
					}else{
						proto.data.btnPriority.hide();
						proto.data.btnDelete.hide();
					};
				};

				this.destroy = proto.destroy;
				this.show = proto.show;
				this.hide = proto.hide;
				this.toogle = proto.toogle;

				proto.init(opt, param);
			};
			function form_exMasks(opt, param){
				var proto = new Proto(),
					options = proto.options,
					SelfObj = this,
					lng = g.lng.form.editor.form.exMasks,
					_const = {};

				//options
				$.extend(true, options, {
					holder: document.body
				});

				proto.constructor = function(){
					var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","class,itemarea",options.holder);
					proto.htmlNodes.main[1] = cwe("div","class,cleared",options.holder);
					var listOption = cwe("div","class,listoption",parent);
					var list_delete = proto.data.btnDelete = new g.control.list({
						holder: listOption,
						text: lng.listOption["delete"].text,
						classes: ["delete"],
						onClick: function(list){
							var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
								confirm: {
									title: lng.msg.removeItems.title,
									text: lng.msg.removeItems.text,
									onClick: {
										ok: function(msg){
											msg.destroy({callback: function(){
												$.each(getCheckedFormItems(SelfObj.items), function(key, item){
													item.destroy();
												});

												proto.htmlNodes.checkBox_all.checked = false;
												SelfObj.groupButtonVisibleState(false);
											}});
										}
									}
								}
							});
							msg.show({effect: true});
						}
					},{visible: false});
					var btn_add = new g.control.button({
						holder: listOption,
						text: lng.listOption.add.text,
						classes: ["add"],
						onClick: function(list){
							var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
								input: {
									title: lng.msg.add.title,
									text: lng.msg.add.text,
									onClick: {
										ok: function(msg){
											msg.errorHide();

											if(msg.areaset.getControl(msg.input.input).state.error){
												msg.errorShow(lng.msg.add.error);
												msg.areaset.getControl(msg.input.input).focus(true);
												return;
											};

											SelfObj.addItem(g.es.getExMasks().addRaw(msg.areaset.getControl(msg.input.input).getValue()));

											msg.destroy();
										}
									},
									data: {
										allowEmpty: false
									}
								}
							});
							msg.show({effect: true});
						}
					},{visible: true});

					var listArea = cwe("div","class,listarea",parent);
					var listTable = cwe("table","class,listtable",listArea);
					var listTable_header = cwe("tr","",cwe("thead","",listTable));
					var checkBox = proto.htmlNodes.checkBox_all = cwe("input","type,checkbox",cwe("td","class,checkbx",listTable_header));
					$(cwe("td","class,name",listTable_header)).text(lng.listTable.name.text);
					$(cwe("td","class,option",listTable_header)).text(lng.listTable.option.text);
					var listTable_body = proto.htmlNodes.itemHolder = cwe("tbody","",listTable);

					//set events
					$(checkBox).click(function(e){
						$.each(SelfObj.items, function(key, item){
							item.setChecked(e.target.checked);
							SelfObj.groupButtonVisibleState(e.target.checked);
						});
					});

					//set items
					$.each(g.es.getExMasks().get(), function(key, item){
						SelfObj.addItem(item);
					});
				};

				function Item(opt, param){
					var proto = new Proto(),
						options = proto.options,
						SelfObj = this,
						lng = g.lng.form.editor.form.exMasks,
						_const = {};

					//options
					$.extend(true, options, {
						holder: document.body,
						"class": {
							checked: "checked"
						},
						element: null,
						callback_remove: function(){},
						callback_checkbox: function(){}
					});

					proto.constructor = function(){
						var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("tr","",options.holder);
						var checkBox = proto.htmlNodes.checkBox = cwe("input","type,checkbox",cwe("td","class,checkbx",parent));
						var name = proto.htmlNodes.name = cwe("span","class,elink",cwe("td","class,name",parent));
						var option = cwe("td","class,option",parent);

						var icon_edit = new g.control.icon({
							holder: option,
							iconSize: 16,
							classes: ["edit"],
							tooltip: lng.listTable.option.icons.edit.tooltip,
							onClick: function(icon){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
									input: {
										title: lng.msg.edit.title,
										text: lng.msg.edit.text,
										data: {
											value: SelfObj.getExMask(),
											allowEmpty: false
										},
										onClick: {
											ok: function(msg){
												msg.errorHide();

												if(msg.areaset.getControl(msg.input.input).state.error){
													msg.errorShow(lng.msg.edit.error);
													msg.areaset.getControl(msg.input.input).focus(true);
													return;
												};

												SelfObj.setExMask(msg.areaset.getControl(msg.input.input).getValue());

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});
						var icon_delete = new g.control.icon({
							holder: option,
							iconSize: 16,
							classes: ["delete"],
							tooltip: lng.listTable.option.icons["delete"].tooltip,
							onClick: function(icon){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
									confirm: {
										title: lng.msg.removeItem.title,
										text: lng.msg.removeItem.text,
										onClick: {
											ok: function(msg){
												msg.destroy({callback: function(){
													SelfObj.destroy();
												}});
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});

						//set name & priority
						SelfObj.setExMask(SelfObj.getExMask());

						//set events
						$(name).click(function(e){
							e.stopPropagation();
							icon_edit.click();
						});
						$(checkBox).click(function(e){
							e.stopPropagation();
						});
						$(checkBox).change(function(e){
							SelfObj.setChecked(e.target.checked);
							options.callback_checkbox();
						});
						$(name).click(function(e){
							e.stopPropagation();
						});
						$(parent).click(function(e){
							$(checkBox).click();
						});
					};

					//PROPERTYS
					this.state = {
						checked: false
					};
					this.htmlElement = null;

					//METHODS
					this.getExMask = function(){
						return options.element.getExMask();
					};
					this.getElement = function(){
						return options.element;
					};
					this.setExMask = function(mask){
						options.element.setExMask(mask);
						$(proto.htmlNodes.name).text(SelfObj.getExMask());
					};
					this.setChecked = function(state){
						if(state){
							SelfObj.state.checked = true;
							proto.htmlNodes.checkBox.checked = true;
							$(SelfObj.htmlElement).addClass(options["class"].checked);
						}else{
							SelfObj.state.checked = false;
							proto.htmlNodes.checkBox.checked = false;
							$(SelfObj.htmlElement).removeClass(options["class"].checked);
						};
					};

					this.destroy = function(){
						g.es.getExMasks().remove(options.element);
						options.callback_remove(SelfObj);
						proto.destroy();
					};
					this.show = proto.show;
					this.hide = proto.hide;
					this.toogle = proto.toogle;

					proto.init(opt, param);
				};

				//PROPERTYS
				this.state = {};
				this.htmlElement = null;
				this.items = [];

				//METHODS
				this.addItem = function(item){
					SelfObj.items.push(
						new Item({
							holder: proto.htmlNodes.itemHolder,
							element: item,
							callback_remove: function(item){
								SelfObj.removeItem(item);
							},
							callback_checkbox: function(){
								var checkAll = true,
									checkOneOrMore = false;

								$.each(SelfObj.items, function(key, item){
									if(!item.state.checked){
										checkAll = false;
									}else{
										checkOneOrMore = true;
									};
								});

								proto.htmlNodes.checkBox_all.checked = checkAll;
								SelfObj.groupButtonVisibleState(checkOneOrMore);
							}
						},{visible: true})
					);
				};
				this.removeItem = function(item){
					var index = $.inArray(item, SelfObj.items);
					if(index != -1){
						SelfObj.items.splice(index, 1);
					};
				};
				this.groupButtonVisibleState = function(state){
					if(state){
						proto.data.btnDelete.show();
					}else{
						proto.data.btnDelete.hide();
					};
				};

				this.destroy = proto.destroy;
				this.show = proto.show;
				this.hide = proto.hide;
				this.toogle = proto.toogle;

				proto.init(opt, param);
			};
			function form_report(opt, param){
				var proto = new Proto(),
					options = proto.options,
					SelfObj = this,
					lng = g.lng.form.editor.form.report,
					_const = {};

				//options
				$.extend(true, options, {
					holder: document.body
				});

				proto.constructor = function(){
					var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","class,itemarea",options.holder);
					proto.htmlNodes.main[1] = cwe("div","class,cleared",options.holder);
					var listOption = cwe("div","class,listoption",parent);
					var list_delete = proto.data.btnDelete = new g.control.list({
						holder: listOption,
						text: lng.listOption["delete"].text,
						classes: ["delete"],
						onClick: function(list){
							var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
								confirm: {
									title: lng.msg.removeItem.title,
									text: lng.msg.removeItem.text,
									onClick: {
										ok: function(msg){
											msg.destroy({callback: function(){
												$.each(getCheckedFormItems(SelfObj.items), function(key, item){
													item.destroy();
												});

												proto.htmlNodes.checkBox_all.checked = false;
												SelfObj.groupButtonVisibleState(false);
											}});
										}
									}
								}
							});
							msg.show({effect: true});
						}
					},{visible: false});
					var btn_add = new g.control.button({
						holder: listOption,
						text: lng.listOption.add.text,
						classes: ["add"],
						onClick: function(list){
							if(SelfObj.items.length >= 1){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.error},{visible: false},{
									error: {
										title: lng.msg.canNotAdd.title,
										text: lng.msg.canNotAdd.text
									}
								});
								msg.show({effect: true});

								return;
							};

							var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
								input: {
									title: lng.msg.add.title,
									text: lng.msg.add.text,
									onClick: {
										ok: function(msg){
											msg.errorHide();

											if(msg.areaset.getControl(msg.input.input).state.error){
												msg.errorShow(lng.msg.add.error);
												msg.areaset.getControl(msg.input.input).focus(true);
												return;
											};

											SelfObj.addItem(g.es.setReport(msg.areaset.getControl(msg.input.input).getValue()));

											msg.destroy();
										}
									},
									data: {
										allowEmpty: false
									}
								}
							});
							msg.show({effect: true});
						}
					},{visible: true});

					var listArea = cwe("div","class,listarea",parent);
					var listTable = cwe("table","class,listtable",listArea);
					var listTable_header = cwe("tr","",cwe("thead","",listTable));
					var checkBox = proto.htmlNodes.checkBox_all = cwe("input","type,checkbox",cwe("td","class,checkbx",listTable_header));
					$(cwe("td","class,name",listTable_header)).text(lng.listTable.name.text);
					$(cwe("td","class,option",listTable_header)).text(lng.listTable.option.text);
					var listTable_body = proto.htmlNodes.itemHolder = cwe("tbody","",listTable);

					//set events
					$(checkBox).click(function(e){
						$.each(SelfObj.items, function(key, item){
							item.setChecked(e.target.checked);
							SelfObj.groupButtonVisibleState(e.target.checked);
						});
					});

					//set items
					if(g.es.getReport().length > 0) SelfObj.addItem(g.es);
				};

				function Item(opt, param){
					var proto = new Proto(),
						options = proto.options,
						SelfObj = this,
						lng = g.lng.form.editor.form.report,
						_const = {};

					//options
					$.extend(true, options, {
						holder: document.body,
						"class": {
							checked: "checked"
						},
						element: null,
						callback_remove: function(){},
						callback_checkbox: function(){}
					});

					proto.constructor = function(){
						var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("tr","",options.holder);
						var checkBox = proto.htmlNodes.checkBox = cwe("input","type,checkbox",cwe("td","class,checkbx",parent));
						var name = proto.htmlNodes.name = cwe("span","class,elink",cwe("td","class,name",parent));
						var option = cwe("td","class,option",parent);

						var icon_edit = new g.control.icon({
							holder: option,
							iconSize: 16,
							classes: ["edit"],
							tooltip: lng.listTable.option.icons.edit.tooltip,
							onClick: function(icon){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
									input: {
										title: lng.msg.edit.title,
										text: lng.msg.edit.text,
										data: {
											value: SelfObj.getReport(),
											allowEmpty: false
										},
										onClick: {
											ok: function(msg){
												msg.errorHide();

												if(msg.areaset.getControl(msg.input.input).state.error){
													msg.errorShow(lng.msg.edit.error);
													msg.areaset.getControl(msg.input.input).focus(true);
													return;
												};

												SelfObj.setReport(msg.areaset.getControl(msg.input.input).getValue());

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});
						var icon_delete = new g.control.icon({
							holder: option,
							iconSize: 16,
							classes: ["delete"],
							tooltip: lng.listTable.option.icons["delete"].tooltip,
							onClick: function(icon){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
									confirm: {
										title: lng.msg.removeItem.title,
										text: lng.msg.removeItem.text,
										onClick: {
											ok: function(msg){
												msg.destroy({callback: function(){
													SelfObj.destroy();
												}});
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});

						//set name & priority
						SelfObj.setReport(SelfObj.getReport());

						//set events
						$(name).click(function(e){
							e.stopPropagation();
							icon_edit.click();
						});
						$(checkBox).click(function(e){
							e.stopPropagation();
						});
						$(checkBox).change(function(e){
							SelfObj.setChecked(e.target.checked);
							options.callback_checkbox();
						});
						$(name).click(function(e){
							e.stopPropagation();
						});
						$(parent).click(function(e){
							$(checkBox).click();
						});
					};

					//PROPERTYS
					this.state = {
						checked: false
					};
					this.htmlElement = null;

					//METHODS
					this.getReport = function(){
						return options.element.getReport();
					};
					this.getElement = function(){
						return options.element;
					};
					this.setReport = function(report){
						options.element.setReport(report);
						$(proto.htmlNodes.name).text(SelfObj.getReport());
					};
					this.setChecked = function(state){
						if(state){
							SelfObj.state.checked = true;
							proto.htmlNodes.checkBox.checked = true;
							$(SelfObj.htmlElement).addClass(options["class"].checked);
						}else{
							SelfObj.state.checked = false;
							proto.htmlNodes.checkBox.checked = false;
							$(SelfObj.htmlElement).removeClass(options["class"].checked);
						};
					};

					this.destroy = function(){
						g.es.setReport("");
						options.callback_remove(SelfObj);
						proto.destroy();
					};
					this.show = proto.show;
					this.hide = proto.hide;
					this.toogle = proto.toogle;

					proto.init(opt, param);
				};

				//PROPERTYS
				this.state = {};
				this.htmlElement = null;
				this.items = [];

				//METHODS
				this.addItem = function(item){
					SelfObj.items.push(
						new Item({
							holder: proto.htmlNodes.itemHolder,
							element: item,
							callback_remove: function(item){
								SelfObj.removeItem(item);
							},
							callback_checkbox: function(){
								var checkAll = true,
									checkOneOrMore = false;

								$.each(SelfObj.items, function(key, item){
									if(!item.state.checked){
										checkAll = false;
									}else{
										checkOneOrMore = true;
									};
								});

								proto.htmlNodes.checkBox_all.checked = checkAll;
								SelfObj.groupButtonVisibleState(checkOneOrMore);
							}
						},{visible: true})
					);
				};
				this.removeItem = function(item){
					var index = $.inArray(item, SelfObj.items);
					if(index != -1){
						SelfObj.items.splice(index, 1);
					};
				};
				this.groupButtonVisibleState = function(state){
					if(state){
						proto.data.btnDelete.show();
					}else{
						proto.data.btnDelete.hide();
					};
				};

				this.destroy = proto.destroy;
				this.show = proto.show;
				this.hide = proto.hide;
				this.toogle = proto.toogle;

				proto.init(opt, param);
			};
			function form_element(opt, param){
				var proto = new Proto(),
					options = proto.options,
					SelfObj = this,
					lng = g.lng.form.editor.form.element,
					_const = {
						itemList: {
							"class": {
								active: "active"
							}
						}
					};

				//options
				$.extend(true, options, {
					holder: document.body,
					element: null,
					items: [
						{
							name: "pages",
							text: lng.itemList.pages,
							onClick: function(item, form){
								//set active
								items_setActiveItem(item);

								SelfObj.setActiveForm({
									form: function(holder){
										return new form_pages({
											holder: holder,
											element: options.element.getPages()
										},{visible: false});
									}
								});
							},
							order: 1,
							show: true
						},
						{
							name: "paths",
							text: lng.itemList.paths,
							onClick: function(item, form){
								//set active
								items_setActiveItem(item);

								SelfObj.setActiveForm({
									form: function(holder){
										return new form_paths({
											holder: holder,
											element: options.element.getPaths()
										},{visible: false});
									}
								});
							},
							order: 2,
							show: true
						},
						{
							name: "referers",
							text: lng.itemList.referers,
							onClick: function(item, form){
								//set active
								items_setActiveItem(item);

								SelfObj.setActiveForm({
									form: function(holder){
										return new form_referers({
											holder: holder,
											element: options.element.getReferers()
										},{visible: false});
									}
								});
							},
							order: 3,
							show: true
						},
						{
							name: "useragents",
							text: lng.itemList.useragents,
							onClick: function(item, form){
								//set active
								items_setActiveItem(item);

								SelfObj.setActiveForm({
									form: function(holder){
										return new form_useragents({
											holder: holder,
											element: options.element.getUserAgents()
										},{visible: false});
									}
								});
							},
							order: 4,
							show: true
						}
					]
				});

				proto.constructor = function(){
					var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","class,itemlist",options.holder),
						parent_2 = proto.htmlNodes.main[1] = cwe("div","",options.holder);

					//select and generate items
					var items = [];
					$.each(options.items, function(key, cfg){
						if(cfg.show) items.push(cfg);
					});
					items.sort(function(a,b){return a.order- b.order;});
					$.each(items, function(key, cfg){
						SelfObj.items[cfg.name] = new g.control.list({
							holder: parent,
							text: cfg.text,
							onClick: function(item){
								cfg.onClick(item, SelfObj);
							}
						},{visible: true});
					});

					//click default item
					SelfObj.items["pages"].click();
				};
				//function set active
				function items_setActiveItem(menuItem){
					$.each(SelfObj.items, function(key, item){
						//set not active
						$(item.htmlElement).removeClass(_const.itemList["class"].active);

						//set active
						if(menuItem == item) $(menuItem.htmlElement).addClass(_const.itemList["class"].active);
					});
				};
				//forms
				function form_pages(opt, param){
					var proto = new Proto(),
						options = proto.options,
						SelfObj = this,
						lng = g.lng.form.editor.form.element.form.pages,
						_const = {};

					//options
					$.extend(true, options, {
						holder: document.body,
						element: null
					});

					proto.constructor = function(){
						var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","class,itemarea",options.holder);
						proto.htmlNodes.main[1] = cwe("div","class,cleared",options.holder);
						var listOption = cwe("div","class,listoption",parent);
						var list_priority = proto.data.btnPriority = new g.control.list({
							holder: listOption,
							text: lng.listOption.priority.text,
							classes: ["priority"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.number},{visible: false},{
									number: {
										title: lng.msg.setPriority.title,
										text: lng.msg.setPriority.text,
										data: {
											value: 1
										},
										onClick: {
											ok: function(msg){
												msg.errorHide();

												if(msg.areaset.getControl(msg.input.number).state.error){
													msg.errorShow(lng.msg.setPriority.error);
													msg.areaset.getControl(msg.input.number).focus(true);
													return;
												};

												$.each(getCheckedFormItems(SelfObj.items), function(key, item){
													item.setPriority(msg.areaset.getControl(msg.input.number).getValue());
													item.setChecked(false);
												});

												proto.htmlNodes.checkBox_all.checked = false;
												SelfObj.groupButtonVisibleState(false);

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: false});
						var list_delete = proto.data.btnDelete = new g.control.list({
							holder: listOption,
							text: lng.listOption["delete"].text,
							classes: ["delete"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
									confirm: {
										title: lng.msg.removeItems.title,
										text: lng.msg.removeItems.text,
										onClick: {
											ok: function(msg){
												msg.destroy({callback: function(){
													$.each(getCheckedFormItems(SelfObj.items), function(key, item){
														item.destroy();
													});

													proto.htmlNodes.checkBox_all.checked = false;
													SelfObj.groupButtonVisibleState(false);
												}});
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: false});
						var btn_add = new g.control.button({
							holder: listOption,
							text: lng.listOption.add.text,
							classes: ["add"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.textarea},{visible: false},{
									textarea: {
										title: lng.msg.add.title,
										text: lng.msg.add.text,
										onClick: {
											ok: function(msg){
												var out = [];

												$.each(msg.areaset.getControl(msg.input.textarea).getValue(), function(key, text){
													if(text.length > 0) out.push(text);
												});

												msg.destroy({
													callback: function(){
														$.each(out, function(key, val){
                                                            SelfObj.addItemRaw(val, options.element);
														});
													}
												});
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});

						var listArea = cwe("div","class,listarea",parent);
						var navigation = proto.data.navigation = new g.control.navigation({
							holder: listArea,
							data: options.element.get(),
							callback_selectPage: function(data, callback){
								$(proto.htmlNodes.itemHolder).html("");
								SelfObj.items.length = 0;

								$.each(data, function(key, item){
									setTimeout(function(){
										SelfObj.addItem(item, options.element);
									}, 1);
								});
								setTimeout(callback,data.length);
							}
						},{visible: true});
						var listTable = cwe("table","class,listtable",listArea);
						var listTable_header = cwe("tr","",cwe("thead","",listTable));
						var checkBox = proto.htmlNodes.checkBox_all = cwe("input","type,checkbox",cwe("td","class,checkbx",listTable_header));
						$(cwe("td","class,name",listTable_header)).text(lng.listTable.name.text);
						$(cwe("td","class,priority",listTable_header)).text(lng.listTable.priority.text);
						$(cwe("td","class,option",listTable_header)).text(lng.listTable.option.text);
						var listTable_body = proto.htmlNodes.itemHolder = cwe("tbody","",listTable);

						//set events
						$(checkBox).click(function(e){
							$.each(SelfObj.items, function(key, item){
								item.setChecked(e.target.checked);
								SelfObj.groupButtonVisibleState(e.target.checked);
							});
						});
					};

					function Item(opt, param){
						var proto = new Proto(),
							options = proto.options,
							SelfObj = this,
							lng = g.lng.form.editor.form.element.form.pages,
							_const = {};

						//options
						$.extend(true, options, {
							holder: document.body,
							"class": {
								checked: "checked"
							},
							element: null,
							parentElement: null,
							callback_remove: function(){},
							callback_checkbox: function(){}
						});

						proto.constructor = function(){
							var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("tr","",options.holder);
							var checkBox = proto.htmlNodes.checkBox = cwe("input","type,checkbox",cwe("td","class,checkbx",parent));
							var name = proto.htmlNodes.name = cwe("span","class,elink",cwe("td","class,name",parent));
							var priority = proto.htmlNodes.priority = cwe("td","class,priority",parent);
							var option = cwe("td","class,option",parent);

							var icon_edit = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["edit"],
								tooltip: lng.listTable.option.icons.edit.tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
										input: {
											title: lng.msg.edit.title,
											text: lng.msg.edit.text,
											data: {
												value: SelfObj.getPage()
											},
											onClick: {
												ok: function(msg){
													SelfObj.setPage(msg.areaset.getControl(msg.input.input).getValue());

													msg.destroy();
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});
							var icon_priority = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["priority"],
								tooltip: lng.listTable.option.icons.priority.tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.number},{visible: false},{
										number: {
											title: lng.msg.setPriority.title,
											text: lng.msg.setPriority.text,
											data: {
												value: SelfObj.getPriority()
											},
											onClick: {
												ok: function(msg){
													msg.errorHide();

													if(msg.areaset.getControl(msg.input.number).state.error){
														msg.errorShow(lng.msg.setPriority.error);
														msg.areaset.getControl(msg.input.number).focus(true);
														return;
													};

													SelfObj.setPriority(msg.areaset.getControl(msg.input.number).getValue());

													msg.destroy();
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});
							var icon_delete = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["delete"],
								tooltip: lng.listTable.option.icons["delete"].tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
										confirm: {
											title: lng.msg.removeItem.title,
											text: lng.msg.removeItem.text,
											onClick: {
												ok: function(msg){
													msg.destroy({callback: function(){
														SelfObj.destroy();
													}});
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});

							//set name & priority
							SelfObj.setPage(SelfObj.getPage());
							SelfObj.setPriority(SelfObj.getPriority());

							//set events
							$(checkBox).click(function(e){
								e.stopPropagation();
							});
							$(checkBox).change(function(e){
								SelfObj.setChecked(e.target.checked);
								options.callback_checkbox();
							});
							$(name).click(function(e){
								e.stopPropagation();
								icon_edit.click();
							});
							$(parent).click(function(e){
								$(checkBox).click();
							});
						};

						//PROPERTYS
						this.state = {
							checked: false
						};
						this.htmlElement = null;

						//METHODS
						this.getPage = function(){
							return options.element.getPage();
						};
						this.getPriority = function(){
							return options.element.getPriority();
						};
						this.getElement = function(){
							return options.element;
						};
						this.setPage = function(page){
							options.element.setPage(page);
							$(proto.htmlNodes.name).text(SelfObj.getPage());
						};
						this.setPriority = function(priority){
							options.element.setPriority(priority);
							$(proto.htmlNodes.priority).text(SelfObj.getPriority());
						};
						this.setChecked = function(state){
							if(state){
								SelfObj.state.checked = true;
								proto.htmlNodes.checkBox.checked = true;
								$(SelfObj.htmlElement).addClass(options["class"].checked);
							}else{
								SelfObj.state.checked = false;
								proto.htmlNodes.checkBox.checked = false;
								$(SelfObj.htmlElement).removeClass(options["class"].checked);
							};
						};

						this.destroy = function(){
							options.parentElement.remove(options.element);
							options.callback_remove(SelfObj);
							proto.destroy();
						};
						this.show = proto.show;
						this.hide = proto.hide;
						this.toogle = proto.toogle;

						proto.init(opt, param);
					};

					//PROPERTYS
					this.state = {};
					this.htmlElement = null;
					this.items = [];

					//METHODS
					this.addItem = function(item, parentElement){
						SelfObj.items.push(
							new Item({
								holder: proto.htmlNodes.itemHolder,
								element: item,
								parentElement: parentElement,
								callback_remove: function(item){
									SelfObj.removeItem(item);
									proto.data.navigation.reload();
								},
								callback_checkbox: function(){
									var checkAll = true,
										checkOneOrMore = false;

									$.each(SelfObj.items, function(key, item){
										if(!item.state.checked){
											checkAll = false;
										}else{
											checkOneOrMore = true;
										};
									});

									proto.htmlNodes.checkBox_all.checked = checkAll;
									SelfObj.groupButtonVisibleState(checkOneOrMore);
								}
							},{visible: true})
						);
					};
					this.addItemRaw = function(text, parentElement){
						SelfObj.addItem(options.element.addRaw(text), parentElement);
					};
					this.removeItem = function(item){
						var index = $.inArray(item, SelfObj.items);
						if(index != -1){
							SelfObj.items.splice(index, 1);
						};
					};
					this.groupButtonVisibleState = function(state){
						if(state){
							proto.data.btnPriority.show();
							proto.data.btnDelete.show();
						}else{
							proto.data.btnPriority.hide();
							proto.data.btnDelete.hide();
						};
					};

					this.destroy = proto.destroy;
					this.show = proto.show;
					this.hide = proto.hide;
					this.toogle = proto.toogle;

					proto.init(opt, param);
				};
				function form_referers(opt, param){
					var proto = new Proto(),
						options = proto.options,
						SelfObj = this,
						lng = g.lng.form.editor.form.element.form.referers,
						_const = {};

					//options
					$.extend(true, options, {
						holder: document.body,
						element: null
					});

					proto.constructor = function(){
						var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","class,itemarea",options.holder);
						proto.htmlNodes.main[1] = cwe("div","class,cleared",options.holder);
						var listOption = cwe("div","class,listoption",parent);
						var list_priority = proto.data.btnPriority = new g.control.list({
							holder: listOption,
							text: lng.listOption.priority.text,
							classes: ["priority"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.number},{visible: false},{
									number: {
										title: lng.msg.setPriority.title,
										text: lng.msg.setPriority.text,
										data: {
											value: 1
										},
										onClick: {
											ok: function(msg){
												msg.errorHide();

												if(msg.areaset.getControl(msg.input.number).state.error){
													msg.errorShow(lng.msg.setPriority.error);
													msg.areaset.getControl(msg.input.number).focus(true);
													return;
												};

												$.each(getCheckedFormItems(SelfObj.items), function(key, item){
													item.setPriority(msg.areaset.getControl(msg.input.number).getValue());
													item.setChecked(false);
												});

												proto.htmlNodes.checkBox_all.checked = false;
												SelfObj.groupButtonVisibleState(false);

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: false});
						var list_delete = proto.data.btnDelete = new g.control.list({
							holder: listOption,
							text: lng.listOption["delete"].text,
							classes: ["delete"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
									confirm: {
										title: lng.msg.removeItems.title,
										text: lng.msg.removeItems.text,
										onClick: {
											ok: function(msg){
												msg.destroy({callback: function(){
													$.each(getCheckedFormItems(SelfObj.items), function(key, item){
														item.destroy();
													});

													proto.htmlNodes.checkBox_all.checked = false;
													SelfObj.groupButtonVisibleState(false);
												}});
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: false});
						var btn_add = new g.control.button({
							holder: listOption,
							text: lng.listOption.add.text,
							classes: ["add"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.textarea},{visible: false},{
									textarea: {
										title: lng.msg.add.title,
										text: lng.msg.add.text,
										onClick: {
											ok: function(msg){
												$.each(msg.areaset.getControl(msg.input.textarea).getValue(), function(key, text){
													if(text.length > 0) SelfObj.addItemRaw(text, options.element);
												});

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});

						var listArea = cwe("div","class,listarea",parent);
						var navigation = proto.data.navigation = new g.control.navigation({
							holder: listArea,
							data: options.element.get(),
							callback_selectPage: function(data, callback){
								$(proto.htmlNodes.itemHolder).html("");
								SelfObj.items.length = 0;

								$.each(data, function(key, item){
									setTimeout(function(){
										SelfObj.addItem(item, options.element);
									}, 1);
								});
								setTimeout(callback,data.length);
							}
						},{visible: true});
						var listTable = cwe("table","class,listtable",listArea);
						var listTable_header = cwe("tr","",cwe("thead","",listTable));
						var checkBox = proto.htmlNodes.checkBox_all = cwe("input","type,checkbox",cwe("td","class,checkbx",listTable_header));
						$(cwe("td","class,name",listTable_header)).text(lng.listTable.name.text);
						$(cwe("td","class,priority",listTable_header)).text(lng.listTable.priority.text);
						$(cwe("td","class,option",listTable_header)).text(lng.listTable.option.text);
						var listTable_body = proto.htmlNodes.itemHolder = cwe("tbody","",listTable);

						//set events
						$(checkBox).click(function(e){
							$.each(SelfObj.items, function(key, item){
								item.setChecked(e.target.checked);
								SelfObj.groupButtonVisibleState(e.target.checked);
							});
						});
					};

					function Item(opt, param){
						var proto = new Proto(),
							options = proto.options,
							SelfObj = this,
							lng = g.lng.form.editor.form.element.form.referers,
							_const = {};

						//options
						$.extend(true, options, {
							holder: document.body,
							"class": {
								checked: "checked"
							},
							element: null,
							parentElement: null,
							callback_remove: function(){},
							callback_checkbox: function(){}
						});

						proto.constructor = function(){
							var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("tr","",options.holder);
							var checkBox = proto.htmlNodes.checkBox = cwe("input","type,checkbox",cwe("td","class,checkbx",parent));
							var name = proto.htmlNodes.name = cwe("span","class,elink",cwe("td","class,name",parent));
							var priority = proto.htmlNodes.priority = cwe("td","class,priority",parent);
							var option = cwe("td","class,option",parent);

							var icon_edit = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["edit"],
								tooltip: lng.listTable.option.icons.edit.tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
										input: {
											title: lng.msg.edit.title,
											text: lng.msg.edit.text,
											data: {
												value: SelfObj.getReferer()
											},
											onClick: {
												ok: function(msg){
													SelfObj.setReferer(msg.areaset.getControl(msg.input.input).getValue());

													msg.destroy();
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});
							var icon_priority = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["priority"],
								tooltip: lng.listTable.option.icons.priority.tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.number},{visible: false},{
										number: {
											title: lng.msg.setPriority.title,
											text: lng.msg.setPriority.text,
											data: {
												value: SelfObj.getPriority()
											},
											onClick: {
												ok: function(msg){
													msg.errorHide();

													if(msg.areaset.getControl(msg.input.number).state.error){
														msg.errorShow(lng.msg.setPriority.error);
														msg.areaset.getControl(msg.input.number).focus(true);
														return;
													};

													SelfObj.setPriority(msg.areaset.getControl(msg.input.number).getValue());

													msg.destroy();
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});
							var icon_delete = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["delete"],
								tooltip: lng.listTable.option.icons["delete"].tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
										confirm: {
											title: lng.msg.removeItem.title,
											text: lng.msg.removeItem.text,
											onClick: {
												ok: function(msg){
													msg.destroy({callback: function(){
														SelfObj.destroy();
													}});
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});

							//set name & priority
							SelfObj.setReferer(SelfObj.getReferer());
							SelfObj.setPriority(SelfObj.getPriority());

							//set events
							$(checkBox).click(function(e){
								e.stopPropagation();
							});
							$(checkBox).change(function(e){
								SelfObj.setChecked(e.target.checked);
								options.callback_checkbox();
							});
							$(name).click(function(e){
								e.stopPropagation();
								icon_edit.click();
							});
							$(parent).click(function(e){
								$(checkBox).click();
							});
						};

						//PROPERTYS
						this.state = {
							checked: false
						};
						this.htmlElement = null;

						//METHODS
						this.getReferer = function(){
							return options.element.getReferer();
						};
						this.getPriority = function(){
							return options.element.getPriority();
						};
						this.getElement = function(){
							return options.element;
						};
						this.setReferer = function(referer){
							options.element.setReferer(referer);
							$(proto.htmlNodes.name).text(SelfObj.getReferer());
						};
						this.setPriority = function(priority){
							options.element.setPriority(priority);
							$(proto.htmlNodes.priority).text(SelfObj.getPriority());
						};
						this.setChecked = function(state){
							if(state){
								SelfObj.state.checked = true;
								proto.htmlNodes.checkBox.checked = true;
								$(SelfObj.htmlElement).addClass(options["class"].checked);
							}else{
								SelfObj.state.checked = false;
								proto.htmlNodes.checkBox.checked = false;
								$(SelfObj.htmlElement).removeClass(options["class"].checked);
							};
						};

						this.destroy = function(){
							options.parentElement.remove(options.element);
							options.callback_remove(SelfObj);
							proto.destroy();
						};
						this.show = proto.show;
						this.hide = proto.hide;
						this.toogle = proto.toogle;

						proto.init(opt, param);
					};

					//PROPERTYS
					this.state = {};
					this.htmlElement = null;
					this.items = [];

					//METHODS
					this.addItem = function(item, parentElement){
						SelfObj.items.push(
							new Item({
								holder: proto.htmlNodes.itemHolder,
								element: item,
								parentElement: parentElement,
								callback_remove: function(item){
									SelfObj.removeItem(item);
									proto.data.navigation.reload();
								},
								callback_checkbox: function(){
									var checkAll = true,
										checkOneOrMore = false;

									$.each(SelfObj.items, function(key, item){
										if(!item.state.checked){
											checkAll = false;
										}else{
											checkOneOrMore = true;
										};
									});

									proto.htmlNodes.checkBox_all.checked = checkAll;
									SelfObj.groupButtonVisibleState(checkOneOrMore);
								}
							},{visible: true})
						);
					};
					this.addItemRaw = function(text, parentElement){
						SelfObj.addItem(options.element.addRaw(text), parentElement);
					};
					this.removeItem = function(item){
						var index = $.inArray(item, SelfObj.items);
						if(index != -1){
							SelfObj.items.splice(index, 1);
						};
					};
					this.groupButtonVisibleState = function(state){
						if(state){
							proto.data.btnPriority.show();
							proto.data.btnDelete.show();
						}else{
							proto.data.btnPriority.hide();
							proto.data.btnDelete.hide();
						};
					};

					this.destroy = proto.destroy;
					this.show = proto.show;
					this.hide = proto.hide;
					this.toogle = proto.toogle;

					proto.init(opt, param);
				};
				function form_useragents(opt, param){
					var proto = new Proto(),
						options = proto.options,
						SelfObj = this,
						lng = g.lng.form.editor.form.element.form.useragents,
						_const = {};

					//options
					$.extend(true, options, {
						holder: document.body,
						element: null
					});

					proto.constructor = function(){
						var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","class,itemarea",options.holder);
						proto.htmlNodes.main[1] = cwe("div","class,cleared",options.holder);
						var listOption = cwe("div","class,listoption",parent);
						var list_priority = proto.data.btnPriority = new g.control.list({
							holder: listOption,
							text: lng.listOption.priority.text,
							classes: ["priority"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.number},{visible: false},{
									number: {
										title: lng.msg.setPriority.title,
										text: lng.msg.setPriority.text,
										data: {
											value: 1
										},
										onClick: {
											ok: function(msg){
												msg.errorHide();

												if(msg.areaset.getControl(msg.input.number).state.error){
													msg.errorShow(lng.msg.setPriority.error);
													msg.areaset.getControl(msg.input.number).focus(true);
													return;
												};

												$.each(getCheckedFormItems(SelfObj.items), function(key, item){
													item.setPriority(msg.areaset.getControl(msg.input.number).getValue());
													item.setChecked(false);
												});

												proto.htmlNodes.checkBox_all.checked = false;
												SelfObj.groupButtonVisibleState(false);

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: false});
						var list_delete = proto.data.btnDelete = new g.control.list({
							holder: listOption,
							text: lng.listOption["delete"].text,
							classes: ["delete"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
									confirm: {
										title: lng.msg.removeItems.title,
										text: lng.msg.removeItems.text,
										onClick: {
											ok: function(msg){
												msg.destroy({callback: function(){
													$.each(getCheckedFormItems(SelfObj.items), function(key, item){
														item.destroy();
													});

													proto.htmlNodes.checkBox_all.checked = false;
													SelfObj.groupButtonVisibleState(false);
												}});
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: false});
						var btn_add = new g.control.button({
							holder: listOption,
							text: lng.listOption.add.text,
							classes: ["add"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.textarea},{visible: false},{
									textarea: {
										title: lng.msg.add.title,
										text: lng.msg.add.text,
										onClick: {
											ok: function(msg){
												$.each(msg.areaset.getControl(msg.input.textarea).getValue(), function(key, text){
													if(text.length > 0) SelfObj.addItemRaw(text, options.element);
												});

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});

						var listArea = cwe("div","class,listarea",parent);
						var navigation = proto.data.navigation = new g.control.navigation({
							holder: listArea,
							data: options.element.get(),
							callback_selectPage: function(data, callback){
								$(proto.htmlNodes.itemHolder).html("");
								SelfObj.items.length = 0;

								$.each(data, function(key, item){
									setTimeout(function(){
										SelfObj.addItem(item, options.element);
									}, 1);
								});
								setTimeout(callback,data.length);
							}
						},{visible: true});
						var listTable = cwe("table","class,listtable",listArea);
						var listTable_header = cwe("tr","",cwe("thead","",listTable));
						var checkBox = proto.htmlNodes.checkBox_all = cwe("input","type,checkbox",cwe("td","class,checkbx",listTable_header));
						$(cwe("td","class,name",listTable_header)).text(lng.listTable.name.text);
						$(cwe("td","class,priority",listTable_header)).text(lng.listTable.priority.text);
						$(cwe("td","class,option",listTable_header)).text(lng.listTable.option.text);
						var listTable_body = proto.htmlNodes.itemHolder = cwe("tbody","",listTable);

						//set events
						$(checkBox).click(function(e){
							$.each(SelfObj.items, function(key, item){
								item.setChecked(e.target.checked);
								SelfObj.groupButtonVisibleState(e.target.checked);
							});
						});
					};

					function Item(opt, param){
						var proto = new Proto(),
							options = proto.options,
							SelfObj = this,
							lng = g.lng.form.editor.form.element.form.useragents,
							_const = {};

						//options
						$.extend(true, options, {
							holder: document.body,
							"class": {
								checked: "checked"
							},
							element: null,
							parentElement: null,
							callback_remove: function(){},
							callback_checkbox: function(){}
						});

						proto.constructor = function(){
							var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("tr","",options.holder);
							var checkBox = proto.htmlNodes.checkBox = cwe("input","type,checkbox",cwe("td","class,checkbx",parent));
							var name = proto.htmlNodes.name = cwe("span","class,elink",cwe("td","class,name",parent));
							var priority = proto.htmlNodes.priority = cwe("td","class,priority",parent);
							var option = cwe("td","class,option",parent);

							var icon_edit = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["edit"],
								tooltip: lng.listTable.option.icons.edit.tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
										input: {
											title: lng.msg.edit.title,
											text: lng.msg.edit.text,
											data: {
												value: SelfObj.getUserAgent()
											},
											onClick: {
												ok: function(msg){
													SelfObj.setUserAgent(msg.areaset.getControl(msg.input.input).getValue());

													msg.destroy();
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});
							var icon_priority = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["priority"],
								tooltip: lng.listTable.option.icons.priority.tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.number},{visible: false},{
										number: {
											title: lng.msg.setPriority.title,
											text: lng.msg.setPriority.text,
											data: {
												value: SelfObj.getPriority()
											},
											onClick: {
												ok: function(msg){
													msg.errorHide();

													if(msg.areaset.getControl(msg.input.number).state.error){
														msg.errorShow(lng.msg.setPriority.error);
														msg.areaset.getControl(msg.input.number).focus(true);
														return;
													};

													SelfObj.setPriority(msg.areaset.getControl(msg.input.number).getValue());

													msg.destroy();
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});
							var icon_delete = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["delete"],
								tooltip: lng.listTable.option.icons["delete"].tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
										confirm: {
											title: lng.msg.removeItem.title,
											text: lng.msg.removeItem.text,
											onClick: {
												ok: function(msg){
													msg.destroy({callback: function(){
														SelfObj.destroy();
													}});
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});

							//set name & priority
							SelfObj.setUserAgent(SelfObj.getUserAgent());
							SelfObj.setPriority(SelfObj.getPriority());

							//set events
							$(checkBox).click(function(e){
								e.stopPropagation();
							});
							$(checkBox).change(function(e){
								SelfObj.setChecked(e.target.checked);
								options.callback_checkbox();
							});
							$(name).click(function(e){
								e.stopPropagation();
								icon_edit.click();
							});
							$(parent).click(function(e){
								$(checkBox).click();
							});
						};

						//PROPERTYS
						this.state = {
							checked: false
						};
						this.htmlElement = null;

						//METHODS
						this.getUserAgent = function(){
							return options.element.getUserAgent();
						};
						this.getPriority = function(){
							return options.element.getPriority();
						};
						this.getElement = function(){
							return options.element;
						};
						this.setUserAgent = function(userAgent){
							options.element.setUserAgent(userAgent);
							$(proto.htmlNodes.name).text(SelfObj.getUserAgent());
						};
						this.setPriority = function(priority){
							options.element.setPriority(priority);
							$(proto.htmlNodes.priority).text(SelfObj.getPriority());
						};
						this.setChecked = function(state){
							if(state){
								SelfObj.state.checked = true;
								proto.htmlNodes.checkBox.checked = true;
								$(SelfObj.htmlElement).addClass(options["class"].checked);
							}else{
								SelfObj.state.checked = false;
								proto.htmlNodes.checkBox.checked = false;
								$(SelfObj.htmlElement).removeClass(options["class"].checked);
							};
						};

						this.destroy = function(){
							options.parentElement.remove(options.element);
							options.callback_remove(SelfObj);
							proto.destroy();
						};
						this.show = proto.show;
						this.hide = proto.hide;
						this.toogle = proto.toogle;

						proto.init(opt, param);
					};

					//PROPERTYS
					this.state = {};
					this.htmlElement = null;
					this.items = [];

					//METHODS
					this.addItem = function(item, parentElement){
						SelfObj.items.push(
							new Item({
								holder: proto.htmlNodes.itemHolder,
								element: item,
								parentElement: parentElement,
								callback_remove: function(item){
									SelfObj.removeItem(item);
									proto.data.navigation.reload();
								},
								callback_checkbox: function(){
									var checkAll = true,
										checkOneOrMore = false;

									$.each(SelfObj.items, function(key, item){
										if(!item.state.checked){
											checkAll = false;
										}else{
											checkOneOrMore = true;
										};
									});

									proto.htmlNodes.checkBox_all.checked = checkAll;
									SelfObj.groupButtonVisibleState(checkOneOrMore);
								}
							},{visible: true})
						);
					};
					this.addItemRaw = function(text, parentElement){
						SelfObj.addItem(options.element.addRaw(text), parentElement);
					};
					this.removeItem = function(item){
						var index = $.inArray(item, SelfObj.items);
						if(index != -1){
							SelfObj.items.splice(index, 1);
						};
					};
					this.groupButtonVisibleState = function(state){
						if(state){
							proto.data.btnPriority.show();
							proto.data.btnDelete.show();
						}else{
							proto.data.btnPriority.hide();
							proto.data.btnDelete.hide();
						};
					};

					this.destroy = proto.destroy;
					this.show = proto.show;
					this.hide = proto.hide;
					this.toogle = proto.toogle;

					proto.init(opt, param);
				};
				function form_paths(opt, param){
					var proto = new Proto(),
						options = proto.options,
						SelfObj = this,
						lng = g.lng.form.editor.form.element.form.paths,
						_const = {};

					//options
					$.extend(true, options, {
						holder: document.body,
						element: null
					});

					proto.constructor = function(){
						var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("div","class,itemarea",options.holder);
						proto.htmlNodes.main[1] = cwe("div","class,cleared",options.holder);
						var listOption = cwe("div","class,listoption",parent);
						var list_priority = proto.data.btnPriority = new g.control.list({
							holder: listOption,
							text: lng.listOption.priority.text,
							classes: ["priority"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.number},{visible: false},{
									number: {
										title: lng.msg.setPriority.title,
										text: lng.msg.setPriority.text,
										data: {
											value: 1
										},
										onClick: {
											ok: function(msg){
												msg.errorHide();

												if(msg.areaset.getControl(msg.input.number).state.error){
													msg.errorShow(lng.msg.setPriority.error);
													msg.areaset.getControl(msg.input.number).focus(true);
													return;
												};

												$.each(getCheckedFormItems(SelfObj.items), function(key, item){
													item.setPriority(msg.areaset.getControl(msg.input.number).getValue());
													item.setChecked(false);
												});

												proto.htmlNodes.checkBox_all.checked = false;
												SelfObj.groupButtonVisibleState(false);

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: false});
						var list_delete = proto.data.btnDelete = new g.control.list({
							holder: listOption,
							text: lng.listOption["delete"].text,
							classes: ["delete"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
									confirm: {
										title: lng.msg.removeItems.title,
										text: lng.msg.removeItems.text,
										onClick: {
											ok: function(msg){
												msg.destroy({callback: function(){
													$.each(getCheckedFormItems(SelfObj.items), function(key, item){
														item.destroy();
													});

													proto.htmlNodes.checkBox_all.checked = false;
													SelfObj.groupButtonVisibleState(false);
												}});
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: false});
						var btn_add = new g.control.button({
							holder: listOption,
							text: lng.listOption.add.text,
							classes: ["add"],
							onClick: function(list){
								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.textarea},{visible: false},{
									textarea: {
										title: lng.msg.add.title,
										text: lng.msg.add.text,
										onClick: {
											ok: function(msg){
												var out = [];
												$.each(msg.areaset.getControl(msg.input.textarea).getValue(), function(key, text){
													if(text.length > 0) out.push(text);
												});

												if(out.length > 0) SelfObj.addItemRaw(out, options.element);

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							}
						},{visible: true});

						var listArea = cwe("div","class,listarea",parent);
						var navigation = proto.data.navigation = new g.control.navigation({
							holder: listArea,
							data: options.element.get(),
							callback_selectPage: function(data, callback){
								$(proto.htmlNodes.itemHolder).html("");
								SelfObj.items.length = 0;

								$.each(data, function(key, item){
									setTimeout(function(){
										SelfObj.addItem(item, options.element);
									}, 1);
								});
								setTimeout(callback,data.length);
							}
						},{visible: true});
						var listTable = cwe("table","class,listtable",listArea);
						var listTable_header = cwe("tr","",cwe("thead","",listTable));
						var checkBox = proto.htmlNodes.checkBox_all = cwe("input","type,checkbox",cwe("td","class,checkbx",listTable_header));
						$(cwe("td","class,name",listTable_header)).text(lng.listTable.name.text);
						$(cwe("td","class,priority",listTable_header)).text(lng.listTable.priority.text);
						$(cwe("td","class,option",listTable_header)).text(lng.listTable.option.text);
						var listTable_body = proto.htmlNodes.itemHolder = cwe("tbody","",listTable);

						//set events
						$(checkBox).click(function(e){
							$.each(SelfObj.items, function(key, item){
								item.setChecked(e.target.checked);
								SelfObj.groupButtonVisibleState(e.target.checked);
							});
						});
					};

					function Item(opt, param){
						var proto = new Proto(),
							options = proto.options,
							SelfObj = this,
							lng = g.lng.form.editor.form.element.form.paths,
							_const = {};

						//options
						$.extend(true, options, {
							holder: document.body,
							"class": {
								checked: "checked"
							},
							element: null,
							parentElement: null,
							callback_remove: function(){},
							callback_checkbox: function(){}
						});

						proto.constructor = function(){
							var parent = SelfObj.htmlElement = proto.htmlNodes.main[0] = cwe("tr","",options.holder);
							var checkBox = proto.htmlNodes.checkBox = cwe("input","type,checkbox",cwe("td","class,checkbx",parent));
							var td_name = cwe("td","class,name",parent);
							var name = proto.htmlNodes.name = cwe("span","class,drop",td_name);
							var itemsHolder = proto.htmlNodes.itemsHolder = cwe("ul","id,sortable;class,list-sortable",td_name);
							$(proto.htmlNodes.itemsHolder).disableSelection();
							var priority = proto.htmlNodes.priority = cwe("td","class,priority",parent);
							var option = cwe("td","class,option",parent);

							var icon_edit = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["edit"],
								tooltip: lng.listTable.option.icons.edit.tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.input},{visible: false},{
										input: {
											title: lng.msg.rename.title,
											text: lng.msg.rename.text,
											data: {
												value: SelfObj.getName()
											},
											onClick: {
												ok: function(msg){
													SelfObj.setName(msg.areaset.getControl(msg.input.input).getValue());

													msg.destroy();
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});
							var icon_priority = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["priority"],
								tooltip: lng.listTable.option.icons.priority.tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.number},{visible: false},{
										number: {
											title: lng.msg.setPriority.title,
											text: lng.msg.setPriority.text,
											data: {
												value: SelfObj.getPriority()
											},
											onClick: {
												ok: function(msg){
													msg.errorHide();

													if(msg.areaset.getControl(msg.input.number).state.error){
														msg.errorShow(lng.msg.setPriority.error);
														msg.areaset.getControl(msg.input.number).focus(true);
														return;
													};

													SelfObj.setPriority(msg.areaset.getControl(msg.input.number).getValue());

													msg.destroy();
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});
							var icon_delete = new g.control.icon({
								holder: option,
								iconSize: 16,
								classes: ["delete"],
								tooltip: lng.listTable.option.icons["delete"].tooltip,
								onClick: function(icon){
									var msg = new g.form.messageBox({type: g.const.form.messageBox.type.confirm},{visible: false},{
										confirm: {
											title: lng.msg.removeItem.title,
											text: lng.msg.removeItem.text,
											onClick: {
												ok: function(msg){
													msg.destroy({callback: function(){
														SelfObj.destroy();
													}});
												}
											}
										}
									});
									msg.show({effect: true});
								}
							},{visible: true});

							//set name & priority
							SelfObj.setName(SelfObj.getName());
							SelfObj.setPriority(SelfObj.getPriority());
							SelfObj.setPathRaw(SelfObj.getPathRaw());

							//set events
							$(checkBox).click(function(e){
								e.stopPropagation();
							});
							$(checkBox).change(function(e){
								SelfObj.setChecked(e.target.checked);
								options.callback_checkbox();
							});
							$(name).click(function(e){
								e.stopPropagation();

								var msg = new g.form.messageBox({type: g.const.form.messageBox.type.textarea},{visible: false},{
									textarea: {
										title: lng.msg.edit.title,
										text: lng.msg.edit.text,
										data: {
											value: SelfObj.getPathRaw().join("\r\n")
										},
										onClick: {
											ok: function(msg){
												msg.errorHide();

												var out = [];
												$.each(msg.areaset.getControl(msg.input.textarea).getValue(), function(key, text){
													if(text.length > 0) out.push(text);
												});

												if(out.length == 0){
													msg.errorShow(lng.msg.edit.error);
													msg.areaset.getControl(msg.input.textarea).focus(true);
													return;
												};

												SelfObj.setPathRaw(out);

												msg.destroy();
											}
										}
									}
								});
								msg.show({effect: true});
							});
							$(parent).click(function(e){
								$(checkBox).click();
							});
						};

						//PROPERTYS
						this.state = {
							checked: false
						};
						this.htmlElement = null;
						this.itemsOrder = [];

						//METHODS
						this.getName = function(){
							return options.element.getName();
						};
						this.getPriority = function(){
							return options.element.getPriority();
						};
						this.getElement = function(){
							return options.element;
						};
						this.getPathRaw = function(){
							var out = [];

							$.each(options.element.getPath().get(), function(key, pathItem){
								out.push(pathItem.getPathItem());
							});

							return out;
						};
						this.setName = function(name){
							options.element.setName(name);
							$(proto.htmlNodes.name).text(((typeof SelfObj.getName()) == "string" && SelfObj.getName().length > 0) ? SelfObj.getName() : lng.unnamed);
						};
						this.setPriority = function(priority){
							options.element.setPriority(priority);
							$(proto.htmlNodes.priority).text(SelfObj.getPriority());
						};
						this.setChecked = function(state){
							if(state){
								SelfObj.state.checked = true;
								proto.htmlNodes.checkBox.checked = true;
								$(SelfObj.htmlElement).addClass(options["class"].checked);
							}else{
								SelfObj.state.checked = false;
								proto.htmlNodes.checkBox.checked = false;
								$(SelfObj.htmlElement).removeClass(options["class"].checked);
							};
						};
						this.setPathRaw = function(raw){
							//clear old items
							$(proto.htmlNodes.itemsHolder).html("");
							SelfObj.itemsOrder = [];

							options.element.setPathRaw(raw);
							$.each(options.element.getPath().get(), function(key, pathItem){
								var index = SelfObj.itemsOrder.push(pathItem)-1;
								$(cwe("li",{
									"class": "default",
									id: index
								},proto.htmlNodes.itemsHolder)).text(pathItem.getPathItem());
							});
							$(proto.htmlNodes.itemsHolder).sortable({
								placeholder: "move-hover",
								axis: "y",
								start: function(event, ui){
									$(ui.item).removeClass("default").addClass("move");
								},
								stop: function(event, ui){
									$(ui.item).removeClass("move").addClass("default");
									$.each($(this).sortable("toArray"), function(order, key){
										options.element.getPath().setOrder(SelfObj.itemsOrder[key], order);
									});
								}
							});
						};

						this.destroy = function(){
							options.parentElement.remove(options.element);
							options.callback_remove(SelfObj);
							proto.destroy();
						};
						this.show = proto.show;
						this.hide = proto.hide;
						this.toogle = proto.toogle;

						proto.init(opt, param);
					};

					//PROPERTYS
					this.state = {};
					this.htmlElement = null;
					this.items = [];

					//METHODS
					this.addItem = function(item, parentElement){
						SelfObj.items.push(
							new Item({
								holder: proto.htmlNodes.itemHolder,
								element: item,
								parentElement: parentElement,
								callback_remove: function(item){
									SelfObj.removeItem(item);
									proto.data.navigation.reload();
								},
								callback_checkbox: function(){
									var checkAll = true,
										checkOneOrMore = false;

									$.each(SelfObj.items, function(key, item){
										if(!item.state.checked){
											checkAll = false;
										}else{
											checkOneOrMore = true;
										};
									});

									proto.htmlNodes.checkBox_all.checked = checkAll;
									SelfObj.groupButtonVisibleState(checkOneOrMore);
								}
							},{visible: true})
						);
					};
					this.addItemRaw = function(raw, parentElement){
						SelfObj.addItem(options.element.addRaw(raw), parentElement);
					};
					this.removeItem = function(item){
						var index = $.inArray(item, SelfObj.items);
						if(index != -1){
							SelfObj.items.splice(index, 1);
						};
					};
					this.groupButtonVisibleState = function(state){
						if(state){
							proto.data.btnPriority.show();
							proto.data.btnDelete.show();
						}else{
							proto.data.btnPriority.hide();
							proto.data.btnDelete.hide();
						};
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
				this.items = {};
				this.activeForm = null;

				//METHODS
				this.setActiveForm = function(obj){
					var data = $.extend(true, {
						form: function(holder){
							return null;
						},
						callback: function(){}
					}, obj);

					if(SelfObj.activeForm != null){
						SelfObj.activeForm.destroy({
							callback: function(){
								SelfObj.activeForm = data.form(proto.htmlNodes.main[1]);
								SelfObj.activeForm.show({
									effect: false,
									callback: data.callback
								});
							}
						});
					}else{
						SelfObj.activeForm = data.form(proto.htmlNodes.main[1]);
						SelfObj.activeForm.show({
							effect: false,
							callback: data.callback
						});
					};
				};

				this.destroy = proto.destroy;
				this.show = proto.show;
				this.hide = proto.hide;
				this.toogle = proto.toogle;

				proto.init(opt, param);
			};
			//other functions
			function getCheckedFormItems(itemsContainer){
				var out = [];

				$.each(itemsContainer, function(key, item){
					if(item.state.checked) out.push(item);
				});

				return out;
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
			this.getSize = function(){
				var text = g.es.getJSON();
				return g.utils.getCountSymbols(text, /[а-я]/ig) * 2 + g.utils.getCountSymbols(text, /[^а-я]/ig);
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
			//init loader
			g.data.control.loader = new g.control.loader();
			//init main form
			g.data.form.main = new g.form.main({},{visible: true});
			//set window title
			g.utils.setTitle([g.lng.title.base]);
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