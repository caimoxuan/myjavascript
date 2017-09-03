(function(gloabl){
	var defaults = {
		audioUrl:"",
		nodeId:"",
		boxStyle:"",
		buttonSrc:"",
		htmls:'<audio autoplay loop style = "width:0px;">'+
				'<source src = "" type = "audio/mpeg" />'+
			  '</audio>'+
			  '<a href = "javascript:;" style = "width:24px;height:24px;background:#33ffff">音乐</a>'+
			  '<select style = "vertical-align:top;">'+
				
			  '</select>'
		
	};
	var plugcode = function(options){
		var setting = Object.assign({},defaults,options);
		var audioDom = document.getElementById(setting.nodeId);
		if(!audioDom){
			audioDom = document.body;
		}
		var audioBox = document.createElement("div");
		audioBox.id = "dnmusiccontrol";
		console.log(setting.boxStyle);
		audioBox.style = "opacity:0.5overflow:hidden;position:absolute;z-index:2147483646;"+ setting.boxStyle+"";
		audioBox.innerHTML = setting.htmls;
		audioDom.appendChild(audioBox);

		var audioButton = audioBox.querySelectorAll("a")[0];
		var audioList = audioBox.querySelectorAll("select")[0];
		var audioTag = audioBox.querySelectorAll("audio")[0];

		//传入buttonSrc功能
		if(setting.buttonSrc) audioButton.style.backgroundImage = "url("+ setting.buttonSrc+")";
		//结束buttonSrc


		//判断对象的类型
		var _type = toString.apply(setting.audioUrl);
		
		
		if(_type === '[object Object]'){
			var arr = [];
			arr.push(setting.audioUrl);
			setting.audioUrl = arr;
		}
		if(!setting.audioUrl.length){
			console.log("启动失败，请传入音乐资源");
		}


		if(typeof setting.audioUrl === 'object'){
			audioTag.src = setting.audioUrl[0].source;
			console.log(setting.audioUrl[0].source)
			for(var i = 0; i< setting.audioUrl.length; i++){
				var _option = new Option(setting.audioUrl[i].title, setting.audioUrl[i].source);
				audioList.add(_option);
			}
		}else{
			audioTag.src = setting.audioUrl;
			audioList.style.display = "none";
		}
		//判断结束


		
		
		

		var audioFN = {
			play:function(url){
				if(url) audioTag.src = url;
				audioTag.play();
			},
			stop:function(){
				audioTag.pause();
			}
		}
		//判断是手机端还是浏览器
		var _device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
		var clickEventName = _device ? "touchstart" : "mousedown";

		audioButton.addEventListener(clickEventName, function(e){
			if(this.state){
				this.state = false;
				audioFN.play();
			}else{
				this.state = true;
				audioFN.stop();
			}
		});

		audioList.addEventListener("change", function(e){
			var _value = this.options[this.selectedIndex].value;
			audioFN.play(_value);
			audioButton.state = false;
		});

		//如果是微信，如何让音乐自动播放
		if(navigator.userAgent.toLowerCase().match(/micormessenger/i)){//判断是微信
			document.addEventListener("WeiXinJSBridgeReady", function onBridgeReady(){
				WeiXinJSBridge.invoke("getNetworkType", {}, function(e){
					audioFN.play();	
				});
			});
		}

	}
	
	gloabl.DNmusicPlay = plugcode;

})(typeof window !== null? window : this);


/*
	README

	使用方法：
	
	DNmusicPlay({
		audioUrl:"音乐地址"(可以是对象、数组)
		buttonSrc:"按钮的src"
		boxStyle:"设置的style"
	})
*/