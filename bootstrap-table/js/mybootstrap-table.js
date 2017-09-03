(function(root, factory, plug){
	return factory(root.$, plug);
})(window, function($, plug){
	
	var pageContent = {
		columnSize:1,
		pageSize:10,
		pageStart:1,
		pageEnd:5,
		pageCount:5,
		url:"http://localhost:8080/CloudnetServiceTest/filedownload/getjson",
		pageHtml:'<li><a href="#">1</a></li>'+
					'<li><a href="#">2</a></li>'+
					'<li><a href="#">3</a></li>'
		
	}
	
	
	function settings(pageContent) {
		
		this.pageContent = pageContent;
		this.tableWidth="80%";
		this.tableHeight=100;
		this.pagination='<tr><td colspan = "'+pageContent.columnSize+'"><ul class="pagination">'+
						'<li><a href="#">&laquo;</a></li>'+
						pageContent.pageHtml+
						'<li><a href="#">&raquo;</a></li>'+
					'</tr></td></ul>';
		
	}
	
	function initPage(page){
		var page_ = null;
		if(page)
			page_ = $.extend({},pageContent,page);
		else
			page_ = pageContent;
		var pageHtml_ = "";
		for(var i = page_.pageStart; i <= page_.pageCount; i++){
			pageHtml_ += '<li><a href = "#">'+i+'</a></li>';
		}
		
		pageContent = page_;
		pageContent.pageHtml = pageHtml_;
		return pageContent;
	}
		
	function ajaxData(pageContent){
		var data = "";
		if(pageContent.url){
			console.log("pageAjax");
			$.ajax({
				url:pageContent.url,
				
				type:'POST',
				dataType:'json',
				async:false,
				success:function(result){
					//console.log(result);
					data = result;
				},
				error:function(data){
					console.log(data);
				}
			});
		}
		return data;
	}
	
	
	
	$.fn[plug] = function(result, rule){
		//这里的this就是调用方法的dom对象
		
		var self_ = this;
		var thead_ = this.find('table').find('thead').find('tr').find('th');
		console.log(thead_);
		var tbody_ = this.find('table').find('tbody');
		var tfoot_ = this.find('table').find('tfoot');
		var pagination_ = $(".page_nav.page-bottom");
		
		tfoot_.css({"text-align":"center","height":50,"vertical-align":"middle"});
		//初始化pageContent
		var pageContent_ = initPage({columnSize:thead_.length});
		var settings_ = new settings(pageContent_);
		pageContent_.columnSize = result.pageSize;
		//初始化settings
		tfoot_.html(settings_.pagination);
		self_.css({width:settings_.tableWidth});
		
		var options = null;
		//ajax
		var data = ajaxData(pageContent_);
		console.log(data);
		if(data)
			options = data.row;
		else
			options = result.row;
		var html = "";
		
		
		for(var i = 0; i < options.length; i++){
			var html_ = "<tr>";
			$.each(rule, function(index){
				var type_ = toString.apply(rule[index]);
				if(type_ === "[object String]"){
					var obj = "options[i]."+rule[index];
					//console.log(eval(obj));
					html_+="<td>"+eval(obj)+"</td>";
				}
				if(type_ === "[object Object]"){
					var obj = "options[i]."+rule[index].key;
					var val = eval(obj);
					//console.log(eval(obj));
					if(rule[index].format){
						var formatter = rule[index].format;
						//console.log(formatter(val,i,options));
						html_+="<td>"+formatter(val,i,options)+"</td>";
					}else{
						html_+="<td>"+eval(obj)+"</td>";
					}
				}
			});
			html_+="</tr>";
			html+=html_;
		}
		
		//console.log(html);
		tbody_.html(html);
	}
	
}, "mybootstrapTable");


//基于bootstrap的一个翻页绑定数据的table框
//传入的参数是列的名称，和需要的数据的格式化信息；
//底部有个自定义的分页插件