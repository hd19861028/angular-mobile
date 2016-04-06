# angular-mobile

angular-mobile是根据angular班门弄斧捣鼓出来的，其大小仅有1.84k(gzip之后)

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
<span am-single="info.user.age>5?真:假"></span>
<!--真-->
```

<h3>双向绑定</h3>

>基本用法

```html
<input value="" am-bind="info.user.name" />
```

>maxlength约束

```html
<input value="" am-bind="info.user.name" maxlength="6" />
<!--maxlength属性也能用于其他元素，也可以用于单向绑定，例如下面的-->
<span am-single="info.user.name" maxlength="6"></span>
```

>select元素

```html

<!--info.user.selected=2-->
<select am-bind="info.user.selected">
	<option value="1">选项1</option>
	<option value="2">选项2</option>
	<option value="3">选项3</option>
</select>

```

<h3>列表数据绑定</h3>

>数组绑定

```html
<!--
var info = {
	……
	users: [{name:'hjd', age:18},{name:'zj', age:16}],
	testarray: ['a','b','c','d','e']
}
-->
<!--对于数组，{{$index}}表示索引，{{$v}}表示当前item的值-->
<ul am-repeat="info.testarray">
	<li>{{$index}}. {{$v}}</li>
</ul>
```

>json数组绑定

```html
<!--{{$index}}属性只要是am-repeat就可以使用-->
<ul am-repeat="info.users" >
	<li>{{$index}}. 姓名：{{name}}，年龄：{{age}} </li>
</ul>
```

>子列表绑定

```javascript
var info = {
	users: [{
		name: 'hjd',
		age: 18,
		titles: [{
			titlename: 'TL',
			titledesc: 'team leader'
		}, {
			titlename: 'SA',
			titledesc: 'System Asnysdf'
		}]
	}, {
		name: 'zj',
		age: 16,
		titles: [{
			titlename: 'LP',
			titledesc: 'my wife'
		}, {
			titlename: 'W',
			titledesc: 'women'
		}]
	}]
}
```
```html
<!--1. {{$index}}属性只能作用于顶层列表，子列表不支持该属性-->
<!--2. 子列表绑定不支持普通数组，只能用于json数组-->
<!--3. 表达式{{}}支持==,>=,<=,>,<,!= 6种三元运算符-->
<!--4. 子列表绑定最多支持2级嵌套，超过2级则不支持！-->
<ul am-repeat="info.users">
	<li>
		{{$index}}. 姓名：{{name}}，年龄：{{age}}
		<div am-repeat="info.users.titles">
			<p>职位：{{titlename}}，描述：{{titledesc}}</p>
		</div>
	</li>
</ul>
```

<h3>图片懒加载</h3>

>示例

```html
<!--每个图片都要设置一个高度，否则懒加载是无效的！-->
<img height='75' am-src="{{info.src}}" />
<br />
……
<img height='75' am-src="{{info.src}}" />
<br />
```

<h3>元素自动隐藏</h3>

>有时候一个属性没有值，我们需要自动将该元素隐藏掉

```html
<!--作用于数组类型的字段-->
<ul am-repeat="info.testarray" am-hide="info.testarray">
	<li>{{$index}}. {{$v}}</li>
</ul>
<!--作用于文本类型的字段-->
<input value="" am-hide="info.user.name" />
```