var angular = new angular_mobile();
var info = {
	user: {
		name: "hjd",
		title: 'qd',
		desc: 'ms',
		selected: "2",
		age:5
	},
	users: [{name:'hjd', age:18},{name:'zj', age:16}],
	testarray: ['a','b','c','d','e'],
	src: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=567500855,645854378&fm=58'
}

angular.set('info', info);

function submit() {
	alert(JSON.stringify(angular.get('info')))
}

function add(count) {
	for (var i = 0; i < count; i++) {
		var item = {
			name: "name" + i,
			age: i
		}
		info.users.push(item);
	}
	angular.set('info', info);
}

function test(e){
	console.log(e)
	console.log(e.id)
}
