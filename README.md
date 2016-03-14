# angular-mobile

angular-mobile是根据angular班门弄斧捣鼓出来的

<h3>起因</h3>

公司做移动端产品，对文件大小有要求，所以不能使用过大的脚本框架，所以angular，bootstrap，fundation都不能使用，连jquery都放弃了，只用zepto，而移动端业务同样有很多复杂的业务，本人因不愿意使用dom操作，而参照angular，实现了自己的一套“迷你angular”

<h3>使用方式</h3>

>非模块化加载

```javascript
var angular = new angular_mobile();
var info = {
	user: {
		name: "hu jin di",
		title: '系统架构师',
		desc: '拥有8年web开发经验',
		selected: "2",
		age:29
	},
	users: [{name:'hjd', age:18},{name:'zj', age:16}],
	testarray: ['a','b','c','d','e'],
	src: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=567500855,645854378&fm=58'
}

//赋值并启动
angular.set('info', info);
//在点击事件中如此便可以成功抓取用户的所有修改过的值
var result = angular.get('info');
```


> 模块化加载

```javascript
define(['domready', 'zepto', 'common', 'angular'], function(doc, $, c, angular) {
	doc(function() {
		var info = {};
		//赋值并启动
		angular.set('info', info);
		//在点击事件中如此便可以成功抓取用户的所有修改过的值
		var result = angular.get('info');
	})
})
```

<h3>单向绑定</h3>

>表达式绑定

```html
{{ info.user.name }}   
<!--hu jin di-->
{{info.user.age>18?真:假}} 
<!--真-->
```

>属性绑定

```html
<a href="#id={{info.user.age}}">id={{info.user.age}}</a>
<!--id=29-->
```
