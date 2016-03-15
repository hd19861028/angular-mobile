describe("the tiny angular library", function() {
	it("should not happend error", function() {
		var errorObj = null;
		try {
			var angular = new angular_mobile();
			var info = {
				user: {
					name: "hu jin di",
					title: '系统架构师',
					desc: '拥有8年web开发经验',
					selected: "2",
					age: 29
				},
				users: [{
					name: 'hjd',
					age: 18
				}, {
					name: 'zj',
					age: 16
				}],
				testarray: ['a', 'b', 'c', 'd', 'e'],
				src: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=567500855,645854378&fm=58'
			}
			angular.set('info', info);
		} catch (e) {
			errorObj = e;
		}

		/*
		    expect(x).toEqual(y); 当x和y相等时候通过
		    expect(x).toBe(y); 当x和y是同一个对象时候通过
		    expect(x).toMatch(pattern); x匹配pattern（字符串或正则表达式）时通过
		    expect(x).toBeDefined(); x不是undefined时通过
		    expect(x).toBeUndefined(); x 是 undefined时通过
		    expect(x).toBeNull(); x是null时通过
		    expect(x).toBeTruthy(); x和true等价时候通过
		    expect(x).toBeFalsy(); x和false等价时候通过
		    expect(x).toContain(y);x（数组或字符串）包含y时通过
		    expect(x).toBeLessThan(y); x小于y时通过
		    expect(x).toBeGreaterThan(y); x大于y时通过
		    expect(function(){fn();}).toThrow(e); 函数fn抛出异常时候通过
		    
		    expect(x).not.toEqual(y); not取反
		  */
		expect(errorObj).toBeNull();
	});
});