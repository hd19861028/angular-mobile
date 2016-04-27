/**
 * 作者：胡锦柢
 * 用途：适用于移动端的angular迷你版，压缩大小：5.50k，gzip大小：1.84k
 * 依赖：纯原生js，无任何依赖
 * 概述：蜂飞医技(蓝海之略临床医疗技术服务平台移动端)插件
 * 支持：原生js调用或者require.js模块化
 * 调用：
 * 			一般用法
 * 				var angular = new hjd_angular(); 
 * 				angular.set('info', info);
 * 				angular.get('info');
 * 			require.js用法
 * 				define(['zepto', 'am-angular'], function($, angular) {
 * 					angular.set('info', info)
 * 					angular.get('info')
 * 				})
 * 用法：
 * 			 1. 双向绑定【am-bind】
 * 					<input am-bind="info.user.name"/>
 * 			 2. 单向绑定【am-single】
 * 					{{info.user.age>=20?成年:未成年}}
 * 					<input am-single="info.user.age>=20?成年:未成年"/>
 *  		 3. 绑定列表数据【am-repeat】
 * 					<ul am-repeat="info.users">
 *						<li>姓名：{{name}}，年龄：{{age}}</li>
 *					</ul>
 * 			 4. 根据字段值隐藏元素【am-hide】
 * 					<span am-hide="info.user.name" am-single="info.user.name"></span>
 * 			 5. 自动化的图片懒加载【am-src】，但是必须设置图片高度
 * 					<img height='75' am-src="{{info.src}}" />
 * */
function angular_mobile() {
	window.scope = {};
	window.scope.elements = [];
	window.scope.events = [];
	var self = this;
	var repeat = {

	};

	this._is_array = function(val) {
		if (typeof val == 'object' && val != null && val != undefined && typeof val.push == 'function') {
			return true;
		} else {
			return false;
		}
	}

	this._get_value = function(attr, e, isrepeat) {
		var result;
		var exp;

		if (isrepeat) {
			var exps = attr.split('.');
			var length = exps.length;
			var repeatKey = exps.join('');
			var index = repeat[repeatKey];
			if (index == undefined || index == null) {
				repeat[repeatKey] = 0;
				index = 0;
			} else {
				repeat[repeatKey] = repeat[repeatKey] + 1;
				index += 1;
			}

			exp = "window.scope";
			for (var i = 0; i < exps.length; i++) {
				if (i < exps.length - 2) {
					exp += "." + exps[i];
				} else if (i == exps.length - 2) {
					exp += "." + exps[i];
					eval("result=" + exp);
					if (!this._is_array(result)) {
						exp += "." + exps[i + 1];
						break;
					}
				} else if (i == exps.length - 1) {
					exp += '[' + index + '].' + exps[i];
				}
			}
			eval("result=" + exp);
		} else {
			exp = "window.scope." + attr;
			eval("result=" + exp);
		}

		if (e) {
			var max = e.getAttribute('maxlength');
			if (max && result) result = result.substr(0, parseInt(max));
		}
		return result || "";
	}

	this._set_value = function(attr, value, e) {
		var exp = "window.scope." + attr;
		value = value.replace(/\n/ig, '');
		if (e) {
			var max = e.getAttribute('maxlength');
			if (max && value) value = value.substr(0, parseInt(max));
		}
		eval(exp + "='" + value + "'");
	}

	this._add_event = function(ele, eventname, func) {
		var oldevent = ele[eventname];
		if (typeof oldevent != 'function') {
			ele[eventname] = function() {
				func(ele);
			};
		} else {
			ele[eventname] = function() {
				func(ele);
				oldevent.apply(this, arguments);
			};
		}
	}

	this._invoke_expression = function(exp, e, row) {
		var content;
		var cur = this;
		if (exp.indexOf('?') >= 0) {
			var getValue = function(key) {
				if (row) return row[key]
				else return cur._get_value(key).toString()
			}
			var sanyuan = exp.split('?');
			var result = null;
			var sanyuan_T = sanyuan[1].split(':')[0];
			var sanyuan_F = sanyuan[1].split(':')[1];
			if (sanyuan[0].indexOf('==') >= 0 && result == null) {
				var temp = sanyuan[0].split('==');
				if (getValue(temp[0]) == temp[1]) result = sanyuan_T;
				else result = sanyuan_F;
			}
			if (sanyuan[0].indexOf('!=') >= 0 && result == null) {
				var temp = sanyuan[0].split('!=');
				if (getValue(temp[0]) != temp[1]) result = sanyuan_T;
				else result = sanyuan_F;
			}
			if (sanyuan[0].indexOf('>=') >= 0 && result == null) {
				var temp = sanyuan[0].split('>=');
				if (getValue(temp[0]) >= temp[1]) result = sanyuan_T;
				else result = sanyuan_F;
			}
			if (sanyuan[0].indexOf('<=') >= 0 && result == null) {
				var temp = sanyuan[0].split('<=');
				if (getValue(temp[0]) <= temp[1]) result = sanyuan_T;
				else result = sanyuan_F;
			}
			if (sanyuan[0].indexOf('>') >= 0 && result == null) {
				var temp = sanyuan[0].split('>');
				if (getValue(temp[0]) > temp[1]) result = sanyuan_T;
				else result = sanyuan_F;
			}
			if (sanyuan[0].indexOf('<') >= 0 && result == null) {
				var temp = sanyuan[0].split('<');
				if (getValue(temp[0]) < temp[1]) result = sanyuan_T;
				else result = sanyuan_F;
			}
			content = result || "";
		} else {
			content = cur._get_value(exp, e);
		}
		return content;
	}

	this._invoke_value = function(v) {
		var html = v;
		var s = html.indexOf('{{');

		while (s >= 0) {
			var e = html.indexOf('}}', s + 2);
			var exp = html.substring(s + 2, e);
			var length = exp.length + 4;
			var content = this._invoke_expression(exp);
			var expression = html.substring(s, e + 2);
			html = html.replace(expression, content)

			s = html.indexOf('{{', e + 2 - (length - content.length));
		}
		return html;
	}

	this._bind_double = function() {
		var o = this;
		for (var i = 0; i < document.all.length; i++) {
			var ele = document.all[i];
			var attr = ele.getAttribute("am-bind");
			if (attr) {
				var content = this._get_value(attr, ele);
				var type = ele.toString();
				if (type == "[object HTMLInputElement]") {
					ele.value = content;
					this._add_event(ele, 'onchange', function(evt) {
						var elem = evt
						var e = elem.getAttribute("am-bind");
						var v = elem.value;
						o._set_value(e, v, elem);
					})
				} else if (type == "[object HTMLTextAreaElement]") {
					ele.innerHTML = content;
					this._add_event(ele, 'onchange', function(evt) {
						var elem = evt
						var e = elem.getAttribute("am-bind");
						var v = elem.value;
						o._set_value(e, v, elem);
					})
				} else if (type == "[object HTMLSelectElement]") {
					ele.value = content;
					this._add_event(ele, 'onchange', function(evt) {
						var elem = evt
						var e = elem.getAttribute("am-bind");
						var v = elem.value;
						o._set_value(e, v, elem);
					})
				} else {
					ele.innerHTML = content;
				}
			}
		}
	}

	this._bind_single = function(e) {
		var nodes = e || document.body.childNodes;

		for (var i = 0; i < nodes.length; i++) {
			var nodeValue = nodes[i].nodeValue;
			var nodeHtml = nodes[i].innerHTML;
			var nodeName = nodes[i].nodeName;
			var attrs = nodes[i].attributes;
			var childNodes = nodes[i].childNodes;
			if (nodeName != "#comment" && nodeName != "SCRIPT") {
				if (nodeValue) {
					nodes[i].nodeValue = this._invoke_value(nodeValue)
				}

				if (nodeName == "OPTION" || nodeName == "LI") {
					if (nodeHtml) {
						nodes[i].innerHTML = this._invoke_value(nodeHtml)
					}
				}

				if (attrs && attrs.length > 0) {
					for (var j = 0; j < attrs.length; j++) {
						var node_n = attrs[j].nodeName || attrs[j].name;
						var node_v = attrs[j].nodeValue;
						if (node_n == "am-single") {
							nodes[i].value = this._invoke_expression(node_v, nodes[i]);
							nodes[i].innerHTML = this._invoke_expression(node_v, nodes[i]);
						} else {
							if (node_v.indexOf('{{') >= 0) {
								attrs[j].nodeValue = this._invoke_value(node_v);
							}
						}
						if (node_n.indexOf('{{') >= 0) {
							var temp = node_n.replace('{{', '').replace('}}', '')
							temp = this._get_value(temp);
							if (temp) nodes[i].setAttribute(temp, '')
						}
					}
				}
				if (childNodes.length > 0) {
					this._bind_single(childNodes)
				}
			}
		}
	}

	this._bind_repeat = function() {
		for (var i = 0; i < document.all.length; i++) {
			var ele = document.all[i];
			var attr = ele.getAttribute("am-repeat");
			if (attr) {
				var dataset = this._get_value(attr, null, true);
				var template = this._get_value(attr + "_TEMPLATE");
				if (!template) {
					this._set_value(attr + "_TEMPLATE", ele.innerHTML);
					template = ele.innerHTML;
				}
				var result = '';
				var temp = '';

				if (dataset && dataset.length > 0) {
					for (var j = 0; j < dataset.length; j++) {
						var row = dataset[j];
						temp = template;
						var start = temp.indexOf('{{');
						var end = -1;
						while (start >= 0) {
							end = temp.indexOf('}}', start);
							var tempexp = temp.substring(start + 2, end);
							var temp_replace = temp.substring(start, end + 2);
							var value = "";
							if (tempexp == "$v") value = row;
							else if (tempexp == "$index") value = j + 1;
							else if (tempexp.indexOf('?') >= 0) {
								value = this._invoke_expression(tempexp, null, row);
							} else {
								if (row[tempexp] || row[tempexp] === false || row[tempexp] === 0)
									value = row[tempexp].toString();
								else value = '';
							}

							if (value) {
								temp = temp.replace(temp_replace, value)
								start = temp.indexOf('{{')
							} else {
								start = temp.indexOf('{{', end)
							}
						}
						result += temp;
					}
				}
				ele.innerHTML = result;
				ele.style.display = "";
			}
		}
	}

	this._Screen = {
		/**
		 * 获取页面可视高度
		 */
		ViewHeight: function() {
			var d = document;
			var a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
			return a.clientHeight;
		},
		/**
		 * 获取页面浏览器的真实高度
		 */
		Height: function() {
			var g = document;
			var a = g.body;
			var f = g.documentElement;
			var d = g.compatMode == "BackCompat" ? a : g.documentElement;
			return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
		},
		/**
		 * 获取元素的绝对Y坐标
		 */
		Top: function(e) {
			var offset = e.offsetTop;
			if (e.offsetParent != null) offset += this.Top(e.offsetParent);
			return offset;
		},
		/**
		 * 获取滚动条顶部距离页面顶部的高度
		 */
		ScrollBar: function() {
			var scrollPos;
			if (window.pageYOffset) {
				scrollPos = window.pageYOffset;
			} else if (document.compatMode && document.compatMode != 'BackCompat') {
				scrollPos = document.documentElement.scrollTop;
			} else if (document.body) {
				scrollPos = document.body.scrollTop;
			}
			return scrollPos;
		}
	}

	//var not_bindsrc = false;

	this._bind_src = function() {
		var scroll = this._Screen.ScrollBar();
		var h = this._Screen.ViewHeight() + scroll;
		var th = this._Screen.Height();

		//if (!not_bindsrc) {
		var imgs = document.getElementsByTagName('img');

		for (var i = 0; i < imgs.length; i++) {
			var attr = imgs[i].getAttribute('am-src');
			if (attr) {
				var t = this._Screen.Top(imgs[i]);
				if (t < h) {
					imgs[i].setAttribute('src', attr);
					imgs[i].setAttribute('am-src', '');
				}
			}
		}
		//}

		//		if (th == h && scroll > 0) {
		//			not_bindsrc = true;
		//		}
	}

	this._bind_hide = function() {
		for (var i = 0; i < document.all.length; i++) {
			var ele = document.all[i];
			var attr = ele.getAttribute("am-hide");
			if (attr) {
				var v = null;
				if (attr.indexOf('!') == -1) {
					v = !!this._get_value(attr).toString();
				} else {
					v = !(this._get_value(attr.substr(1)).toString());
				}
				if (!v) {
					ele.style.display = "none";
				} else {
					ele.style.display = "";
				}
			}
		}
	}

	return {
		"get": function(name) {
			return window.scope[name];
		},
		"set": function(name, obj, callback) {
			self._add_event(window, 'onload', function() {
				try {
					window.scope[name] = obj;
					self._bind_repeat();
					self._bind_hide();
					self._bind_single();
					self._bind_double();

					self._bind_src();
					self._add_event(window, 'onscroll', function() {
						self._bind_src();
					})
					for (k in repeat) {
						repeat[k] = null;
					}
					if (callback) callback()
				} catch (e) {
					console.error(e.stack)
				}
			})
		}
	}
}

if (typeof define === 'function' && define.amd) {
	define(function() {
		return new angular_mobile();
	});
}