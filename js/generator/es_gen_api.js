(function($, window){
	window.wa_extSource = function(_data, opt){
		var SelfObj = this, ES = this,
			options = $.extend(true, {
				onChange: function(es){}
			}, opt);
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
			projectName: "ProjectName",
			name: "name"
		},
			defaultPriority = 1;
		//Data External Source
		var dataExtSource = {};

		//METHODS
		this.set = function(obj){
			if(obj) $.each(obj, function(key, value){
				dataExtSource[key] = value;
			});

			options.onChange(ES);

			return SelfObj;
		};
		this.setReport = function(report){
			var data = {};
			data[constants.report] = report;
			SelfObj.set(data);

			return SelfObj;
		};
		this.setProjectName = function(name){
			var data = {};
			data[constants.projectName] = name;
			SelfObj.set(data);

			return SelfObj;
		};
		this.get = function(param){
			if(param){
				return dataExtSource[param];
			}else{
				return dataExtSource;
			};
		};
		this.getProjectName = function(){
			return SelfObj.get(constants.projectName);
		};
		this.getReport = function(){
			return SelfObj.get(constants.report);
		};
		this.getItems = function(){
			return SelfObj.get(constants.items);
		};
		this.getExMasks = function(){
			return SelfObj.get(constants.exMasks)
		};
		this.getJSON = function(){
			var out = {};

			//set Project Name
			if(SelfObj.getProjectName().length > 0) out[constants.projectName] = SelfObj.getProjectName();

			//set report
			if(SelfObj.getReport().length > 0) out[constants.report] = SelfObj.getReport();

			//set ExMasks
			if(SelfObj.get(constants.exMasks).getCount() > 0){
				var temp_exMasks = [];
				$.each(SelfObj.getExMasks().get(), function(key, mask){
					if(mask.getExMask().length > 0) temp_exMasks.push(mask.getExMask());
				});

				if(temp_exMasks.length > 0) out[constants.exMasks] = temp_exMasks;
			};

			//set Items
			if(SelfObj.get(constants.items).getCount() > 0){
				var temp_items = [];

				$.each(SelfObj.getItems().get(), function(key, ITEM){
					var temp_item = {};

					//set pages
					if(ITEM.getPages().getCount() > 0){
						var temp_pages = [];

						$.each(ITEM.getPages().get(), function(key, page){
							if(page.getPage().length > 0){
								var temp_page = {};
								if(page.getPriority() != defaultPriority) temp_page[constants.priority] = page.getPriority();
								temp_page[constants.page] = page.getPage();
								temp_pages.push(temp_page);
							};
						});

						if(temp_pages.length > 0) temp_item[constants.pages] = temp_pages;
					};

					//paths
					if(ITEM.getPaths().getCount() > 0){
						var temp_paths = [];

						$.each(ITEM.getPaths().get(), function(key, path){
							if(path.getPath().get().length> 0) {
								var temp_path_path = [];
								$.each(path.getPath().get(), function(key, pathItem){
									if(pathItem.getPathItem().length > 0) temp_path_path.push(pathItem.getPathItem());
								});

								if(temp_path_path.length > 0){
									var temp_path = {};
									if(path.getName().length > 0) temp_path[constants.name] = path.getName();
									if(path.getPriority() != defaultPriority) temp_path[constants.priority] = path.getPriority();
									temp_path[constants.path] = temp_path_path;

									temp_paths.push(temp_path);
								};
							};
						});

						if(temp_paths.length > 0) temp_item[constants.paths] = temp_paths;
					};

					//set referers
					if(ITEM.getReferers().getCount() > 0){
						var temp_referers = [];

						$.each(ITEM.getReferers().get(), function(key, referer){
							if(referer.getReferer().length > 0){
								var temp_referer = {};
								if(referer.getPriority() != defaultPriority) temp_referer[constants.priority] = referer.getPriority();
								temp_referer[constants.referer] = referer.getReferer();
								temp_referers.push(temp_referer);
							};
						});

						if(temp_referers.length > 0) temp_item[constants.referers] = temp_referers;
					};

					//set useragents
					if(ITEM.getUserAgents().getCount() > 0){
						var temp_useragents = [];

						$.each(ITEM.getUserAgents().get(), function(key, useragent){
							if(useragent.getUserAgent().length > 0){
								var temp_useragent = {};
								if(useragent.getPriority() != defaultPriority) temp_useragent[constants.priority] = useragent.getPriority();
								temp_useragent[constants.userAgent] = useragent.getUserAgent();
								temp_useragents.push(temp_useragent);
							};
						});

						if(temp_useragents.length > 0) temp_item[constants.userAgents] = temp_useragents;
					};

					if(!$.isEmptyObject(temp_item)){
						if(ITEM.getPriority() != defaultPriority) temp_item[constants.priority] = ITEM.getPriority();
						if(ITEM.getName().length > 0) temp_item[constants.name] = ITEM.getName();
						temp_items.push(temp_item);
					};
				});

				if(temp_items.length > 0) out[constants.items] = temp_items;
			};

			return $.toJSON(out);
		};

		//objects
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

				options.onChange(ES);

				return SelfObj;
			};
			this.setPage = function(page){
				var data = {};
				data[constants.page] = page;
				SelfObj.set(data);

				return SelfObj;
			};
			this.setPriority = function(priority){
				var data = {};
				data[constants.priority] = priority;
				SelfObj.set(data);

				return SelfObj;
			};

			//INIT
			var def_obj = {};
			def_obj[constants.priority] = defaultPriority;
			def_obj[constants.page] = "";
			_data = $.extend(true, def_obj, _data);
			SelfObj.set(_data);
		};
		function Pages(_data){
			var SelfObj = this,
				data = [];

			//METHODS
			this.add = function(obj){
				var index = data.push(new Page(obj))-1;

				options.onChange(ES);

				return data[index];
			};
			this.addRaw = function(raw){
				if(raw instanceof Array){
					var out = [];
					$.each(raw, function(key, value){
						var obj = {};
						obj[constants.page] = value;
						out.push(SelfObj.add(obj));
					});
					return out;
				}else{
					var obj = {};
					obj[constants.page] = raw;
					return SelfObj.add(obj);
				};
			};
			this.remove = function(page){
				var index = $.inArray(page, data);
				if(index != -1) data.splice(index, 1);

				options.onChange(ES);

				return SelfObj;
			};
			this.get = function(){
				return data;
			};
			this.getCount = function(){
				return data.length;
			};
			this.set = function(arr){
				if(arr) $.each(arr, function(key, value){
					SelfObj.add(value);
				});

				return SelfObj;
			};

			//INIT
			SelfObj.set(_data);
		};
		function PathItem(_data){
			var SelfObj = this,
				data = "";

			//METHODS
			this.get = function(){
				return data;
			};
			this.getPathItem = function(){
				return SelfObj.get();
			};
			this.set = function(param){
				data = param;

				options.onChange(ES);

				return SelfObj;
			};
			this.setPathItem = function(param){
				SelfObj.set();

				return SelfObj;
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

				options.onChange(ES);

				return SelfObj;
			};
			this.setOrder = function(pathItem, order){
				var index = $.inArray(pathItem, data);
				if(index == -1) return;

				data.splice(index, 1);
				data.splice(order, 0, pathItem);

				return SelfObj;
			};
			this.remove = function(pathItem){
				var index = $.inArray(pathItem, data);
				if(index != -1) data.splice(index, 1);

				options.onChange(ES);

				return SelfObj;
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
				};
			};
			this.getPath = function(){
				return data[constants.path];
			};
			this.getPriority = function(){
				return SelfObj.get(constants.priority);
			};
			this.getName = function(){
				return SelfObj.get(constants.name);
			};
			this.set = function(obj){
				if(obj) $.each(obj, function(key, value){
					if(key != constants.path){
						data[key] = value;
					}else{
						data[constants.path] = new PathItemCollection(value);
					};
				});

				options.onChange(ES);

				return SelfObj;
			};
			this.setPriority = function(priority){
				var data = {};
				data[constants.priority] = priority;
				SelfObj.set(data);

				return SelfObj;
			};
			this.setName = function(name){
				var data = {};
				data[constants.name] = name;
				SelfObj.set(data);

				return SelfObj;
			};
			this.setPathRaw = function(raw){
				var obj = {};
				obj[constants.path] = raw;
				SelfObj.set(obj);

				return SelfObj;
			};

			//INIT
			var def_obj = {};
			def_obj[constants.priority] = defaultPriority;
			def_obj[constants.name] = "";
			def_obj[constants.path] = [];
			_data = $.extend(true, def_obj, _data);
			SelfObj.set(_data);
		};
		function Paths(_data){
			var SelfObj = this,
				data = [];

			//METHODS
			this.add = function(obj){
				var index = data.push(new Path(obj))-1;

				options.onChange(ES);

				return data[index];
			};
			this.addRaw = function(raw){
				var obj = {};
				obj[constants.path] = raw;
				return SelfObj.add(obj);
			};
			this.remove = function(path){
				var index = $.inArray(path, data);
				if(index != -1) data.splice(index, 1);

				options.onChange(ES);

				return SelfObj;
			};
			this.get = function(){
				return data;
			};
			this.set = function(arr){
				if(arr) $.each(arr, function(key, value){
					SelfObj.add(value);
				});

				options.onChange(ES);

				return SelfObj;
			};
			this.getCount = function(){
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
				return SelfObj.get(constants.referer);
			};
			this.getPriority = function(){
				return SelfObj.get(constants.priority);
			};
			this.set = function(obj){
				if(obj) $.each(obj, function(key, value){
					data[key] = value;
				});

				options.onChange(ES);

				return SelfObj;
			};
			this.setReferer = function(referer){
				var data = {};
				data[constants.referer] = referer;
				SelfObj.set(data);

				return SelfObj;
			};
			this.setPriority = function(priority){
				var data = {};
				data[constants.priority] = priority;
				SelfObj.set(data);

				return SelfObj;
			};

			//INIT
			var def_obj = {};
			def_obj[constants.priority] = defaultPriority;
			def_obj[constants.referer] = "";
			_data = $.extend(true, def_obj, _data);
			SelfObj.set(_data);
		};
		function Referers(_data){
			var SelfObj = this,
				data = [];

			//METHODS
			this.add = function(obj){
				var index = data.push(new Referer(obj))-1;

				options.onChange(ES);

				return data[index];
			};
			this.addRaw = function(raw){
				if(raw instanceof Array){
					var out = [];
					$.each(raw, function(key, value){
						var obj = {};
						obj[constants.referer] = value;
						out.push(SelfObj.add(obj));
					});
					return out;
				}else{
					var obj = {};
					obj[constants.referer] = raw;
					return SelfObj.add(obj);
				};
			};
			this.remove = function(referer){
				var index = $.inArray(referer, data);
				if(index != -1) data.splice(index, 1);

				options.onChange(ES);

				return SelfObj;
			};
			this.get = function(){
				return data;
			};
			this.set = function(arr){
				if(arr) $.each(arr, function(key, value){
					SelfObj.add(value);
				});

				options.onChange(ES);

				return SelfObj;
			};
			this.getCount = function(){
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
				return SelfObj.get(constants.userAgent);
			};
			this.getPriority = function(){
				return SelfObj.get(constants.priority);
			};
			this.set = function(obj){
				if(obj) $.each(obj, function(key, value){
					data[key] = value;
				});

				options.onChange(ES);

				return SelfObj;
			};
			this.setUserAgent = function(userAgent){
				var data = {};
				data[constants.userAgent] = userAgent;
				SelfObj.set(data);

				return SelfObj;
			};
			this.setPriority = function(priority){
				var data = {};
				data[constants.priority] = priority;
				SelfObj.set(data);

				return SelfObj;
			};

			//INIT
			var def_obj = {};
			def_obj[constants.priority] = defaultPriority;
			def_obj[constants.userAgent] = "";
			_data = $.extend(true, def_obj, _data);
			SelfObj.set(_data);
		};
		function UserAgents(_data){
			var SelfObj = this,
				data = [];

			//METHODS
			this.add = function(obj){
				var index = data.push(new UserAgent(obj))-1;

				options.onChange(ES);

				return data[index];
			};
			this.addRaw = function(raw){
				if(raw instanceof Array){
					var out = [];
					$.each(raw, function(key, value){
						var obj = {};
						obj[constants.userAgent] = value;
						out.push(SelfObj.add(obj));
					});
					return out;
				}else{
					var obj = {};
					obj[constants.userAgent] = raw;
					return SelfObj.add(obj);
				};
			};
			this.remove = function(userAgent){
				var index = $.inArray(userAgent, data);
				if(index != -1) data.splice(index, 1);

				options.onChange(ES);

				return SelfObj;
			};
			this.get = function(){
				return data;
			};
			this.set = function(arr){
				if(arr) $.each(arr, function(key, value){
					SelfObj.add(value);
				});

				options.onChange(ES);

				return SelfObj;
			};
			this.getCount = function(){
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
				return SelfObj.get(constants.exMask);
			};
			this.set = function(obj){
				if(obj) $.each(obj, function(key, value){
					data[key] = value;
				});

				options.onChange(ES);

				return SelfObj;
			};
			this.setExMask = function(exMask){
				var data = {};
				data[constants.exMask] = exMask;
				SelfObj.set(data);

				return SelfObj;
			};

			//INIT
			var def_obj = {};
			def_obj[constants.exMask] = "";
			var param_obj = {};
			param_obj[constants.exMask] = _data;
			_data = $.extend(true, def_obj, _data);
			SelfObj.set(_data);
		};
		function ExMasks(_data){
			var SelfObj = this,
				data = [];

			//METHODS
			this.add = function(obj){
				var index = data.push(new ExMask(obj))-1;

				options.onChange(ES);

				return data[index];
			};
			this.addRaw = function(raw){
				if(raw instanceof Array){
					var out = [];
					$.each(raw, function(key, value){
						var obj = {};
						obj[constants.exMask] = value;
						out.push(SelfObj.add(obj));
					});
					return out;
				}else{
					var obj = {};
					obj[constants.exMask] = raw;
					return SelfObj.add(obj);
				};
			};
			this.remove = function(exMask){
				var index = $.inArray(exMask, data);
				if(index != -1) data.splice(index, 1);

				options.onChange(ES);

				return SelfObj;
			};
			this.get = function(){
				return data;
			};
			this.set = function(obj){
				if(obj) $.each(obj, function(key, value){
					var obj = {};
					obj[constants.exMask] = value;
					SelfObj.add(obj);
				});

				options.onChange(ES);

				return SelfObj;
			};
			this.getCount = function(){
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
				return SelfObj.get(constants.pages);
			};
			this.getPaths = function(){
				return SelfObj.get(constants.paths);
			};
			this.getReferers = function(){
				return SelfObj.get(constants.referers);
			};
			this.getUserAgents = function(){
				return SelfObj.get(constants.userAgents);
			};
			this.getPriority = function(){
				return SelfObj.get(constants.priority);
			};
			this.getName = function(){
				return SelfObj.get(constants.name);
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

				options.onChange(ES);

				return SelfObj;
			};
			this.setPriority = function(priority){
				var data = {};
				data[constants.priority] = priority;
				SelfObj.set(data);

				return SelfObj;
			};
			this.setName = function(name){
				var data = {};
				data[constants.name] = name;
				SelfObj.set(data);

				return SelfObj;
			};

			//INIT
			var def_obj = {};
			def_obj[constants.pages] = null;
			def_obj[constants.paths] = null;
			def_obj[constants.referers] = null;
			def_obj[constants.userAgents] = null;
			def_obj[constants.name] = "";
			def_obj[constants.priority] = defaultPriority;
			_data = $.extend(true, def_obj, _data);
			SelfObj.set(_data);
		};
		function Items(_data){
			var SelfObj = this,
				data = [];

			//METHODS
			this.add = function(obj){
				var index = data.push(new Item(obj))-1;

				options.onChange(ES);

				return data[index];
			};
			this.addRaw = function(raw){
				if(raw instanceof Array){
					var out = [];
					$.each(raw, function(key, value){
						var obj = {};
						obj[constants.name] = value;
						out.push(SelfObj.add(obj));
					});
					return out;
				}else{
					var obj = {};
					obj[constants.name] = raw;
					return SelfObj.add(obj);
				};
			};
			this.remove = function(item){
				var index = $.inArray(item, data);
				if(index != -1) data.splice(index, 1);

				options.onChange(ES);

				return SelfObj;
			};
			this.get = function(){
				return data;
			};
			this.set = function(obj){
				if(obj) $.each(obj, function(key, value){
					SelfObj.add(value);
				});

				options.onChange(ES);

				return SelfObj;
			};
			this.getCount = function(){
				return data.length;
			};

			//INIT
			SelfObj.set(_data);
		};

		//INIT
		var _obj = {}, def_data = {};
		def_data[constants.items] = null;
		def_data[constants.exMasks] = null;
		def_data[constants.projectName] = "";
		def_data[constants.report] = "";
		_data = $.extend(true, def_data, _data);
		$.each(_data, function(key, value){
			_obj = {};
			switch(key){
				case constants.items:
					_obj[key] = new Items(value);
					SelfObj.set(_obj);
					break;
				case constants.exMasks:
					_obj[key] = new ExMasks(value);
					SelfObj.set(_obj);
					break;
				default:
					_obj[key] = value;
					SelfObj.set(_obj);
			};
		});
	};
})(jQuery, window);
