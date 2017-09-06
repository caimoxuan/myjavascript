(function(root, factory, plug){
	return factory(root.jQuery, plug);
})(window, function($, plug){

	//默认属性
	var __OPTIONS__ = {
		trigger:"change"
	}

	//规则引擎
	var __RULES__ = {
		required:function(){
			return this.val()!="";
		},
		regex:function(){
			return new RegExp(this.data('sv-regex')).test(this.val());
		},
		email:function(){
			return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.val());///^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
		},
		uri:function(){
			var strRegex = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';
			var re=new RegExp(strRegex);
			return re.test(this.val());
		}
	}
	$.fn[plug] = function(options){
		$(this).on("submit", function(){
			console.log("提交表单事件");
			return false;
		});
		$.extend(this, __OPTIONS__, options);
		var $fileds = this.find('input').not("[type=button],[type=reset],[type=submit]");
		$fileds.on(this.trigger, function(){
			var $filed = $(this);//取出验证对象
			var result = true;//默认认证成功
			$filed.next().remove();

			$.each(__RULES__, function(value, validater){
				if($filed.data('sv-'+value)){
					//console.log($filed.attr("name")+"需要验证"+value+"属性");
					result = validater.call($filed);
					if(!result){
						$filed.after("<p>"+ $filed.data('sv-'+value+"-message")+"</p>");
					}

					return result;
				}


			});

			/*
			var dataType = $filed.data();//这样获取了data-* 所有的以data开头的属性，但是后面*的内容貌似自动将-替换成了下一个字母大写

			$.each(dataType, function(name, value){
				//var validater = eval("__RULES__."+name);
				var validater = __RULES__[name];
				if(validater == undefined){
					console.log("ss");
				}else{
					result = validater.call($filed);
					if(!result){
						$filed.after('<div>' + value +"</div>");
					}
				}

			});
			*/

		});

	}

}, "sxxValidator");
