(function(root, factory, plug){
	return factory(root.$, plug);
})(window, function($, plug){
	
	var pageContent = {
		columnSize:1,//总列数，方便分页脚注使用colspan
		pageSize:10,//每一页有多少条记录
		pageStart:1,//开始页码
		pageCount:30,//总共有多少页
		pageNow:10,//当前是第几页
		url:"http://localhost:8080/CloudnetServiceTest/filedownload/getjson",
		pageHtml:'<li><a href="#" >1</a></li>'+
					'<li><a href="#">2</a></li>'+
					'<li><a href="#">3</a></li>'
	}
	
	var domElement = {
		tbody:"",
		thead:"",
		tfoot:""
	}
	
	function settings(pageContent) {
		
		this.pageContent = pageContent;
		this.tableWidth="80%";
		this.tableHeight=100;
		this.pagination='<tr><td colspan = "'+pageContent.columnSize+'"><ul class="pagination">'+
						'<li class = "'+(pageContent.pageNow>1?"":"disabled")+'"><a href="#" class = "disabled">&laquo;</a></li>'+
						pageContent.pageHtml+
						'<li class = "'+(pageContent.pageNow>=pageContent.pageCount?"disabled":"")+'"><a href="#" class = "disabled">&raquo;</a></li>'+
						'</tr></td></ul>';
	}
	
	//生成页码
	function initPage(page){
		var page_ = null;
		if(page)
			page_ = $.extend({},pageContent,page);
		else
			page_ = pageContent;
		var pageHtml_ = "";
		
		
		
		if(page_.pageNow != 1 && page_.pageNow >= 4 && page_.pageCount != 4){
			pageHtml_ += '<li><a href = "#" class = "page_pager" >'+1+'</a></li>';
		}
		if(page_.pageNow-2>2 && page_.pageNow<=page_.pageCount && page_.pageCount>5) {
			pageHtml_ += '<li class = "disabled"><a href="javascript:void(0);">...</a></li>';
		}
		
		var start = page_.pageNow - 2;
		var end = page_.pageNow + 2;
		var active = page_.pageNow;
			
		if((start>1 && page_.pageNow<4) || page_.pageNow==1) {
			end++;
		}
		if(page_.pageNow>page_.pageCount-4 && page_.pageNow>=page_.pageCount) {
			start--;
		}
		console.log(start + "," + end);
		for(; start<=end; start++) {
			if(start<=page_.pageCount && start>=1) {
				pageHtml_ += '<li class="'+(start==active?"active":"")+'"><a href="javascript:void(0);" class = "page_pager" >'+start+'</a></li>';
			}
		}
		if(page_.pageNow+2<page_.pageCount-1 && page_.pageNow>=1 && page_.pageCount>5) {
			pageHtml_ += "<li class='disabled'><a href='javascript:void(0);'>...</a></li>";
		}

		if(page_.pageNow!=page_.pageCount && page_.pageNow<page_.pageCount-2 && page_.pageCount!=4) {
			pageHtml_ += '<li class="ali"><a href="javascript:void(0);" class = "page_pager" >'+page_.pageCount+'</a></li>';
		}
		
		
		pageContent = page_;
		pageContent.pageHtml = pageHtml_;
		return pageContent;
	}
	
	//页码点击事件
	function bindClick(dom){
		dom.on("click", "a.page_pager", function(){
			var pageNow = parseInt($(this).text());
			pageContent.pageNow = pageNow;
			//var content = initPage(pageContent);
			
			ajaxData(pageContent);
			console.log(pageContent);
			initPage(pageContent);
			var setting = new settings(pageContent);
			reflash(setting.pagination);
			bindClick($(".pagination"));
		});
	}
		
	function ajaxData(pageContent){
		var data = "";
		if(pageContent.url){
			console.log("pageAjax");
			$.ajax({
				url:pageContent.url,
				type:'POST',
				data:{pageSize:pageContent.pageSize,pageNow:pageContent.pageNow},
				dataType:'json',
				async:false,
				success:function(result){
					data = result;
					pageContent.pageNow = data.pageNow;
					pageContent.pageCount = data.pageCount;
				},
				error:function(data){
					console.log(data);
				}
			});
		}
		return data;
	}
	
	function reflash(html){
		domElement.tfoot.html(html);
		
	}
	
	
	
	$.fn[plug] = function(result, rule){
		//这里的this就是调用方法的dom对象
		console.log(result.row.length);
		var self_ = this;
		var thead_ = this.find('table').find('thead').find('tr').find('th');
		var tbody_ = this.find('table').find('tbody');
		var tfoot_ = this.find('table').find('tfoot');
		domElement.thead = thead_;
		domElement.tbody = tbody_;
		domElement.tfoot = tfoot_;
		var pagination_ = $(".page_nav.page-bottom");
		
		tfoot_.css({"text-align":"center","height":50,"vertical-align":"middle"});
		
		var options = null;
		//ajax
		var data = ajaxData(pageContent);
		if(data)
			options = data.row;
		else
			options = result.row;
		
		//初始化pageContent
		var pageContent_ = initPage({columnSize:thead_.length});
		var settings_ = new settings(pageContent_);
		//填充分页html
		tfoot_.html(settings_.pagination);
		self_.css({width:settings_.tableWidth});
		
		var html = "";
		//判断是否使用格式化函数来格式化数据，并且组装数据
		for(var i = 0; i < options.length; i++){
			var html_ = "<tr>";
			$.each(rule, function(index){
				var type_ = toString.apply(rule[index]);
				if(type_ === "[object String]"){
					var obj = "options[i]."+rule[index];
					html_+="<td>"+eval(obj)+"</td>";
				}
				if(type_ === "[object Object]"){
					var obj = "options[i]."+rule[index].key;
					var val = eval(obj);
					if(rule[index].format){
						var formatter = rule[index].format;
						html_+="<td>"+formatter(val,i,options)+"</td>";
					}else{
						html_+="<td>"+eval(obj)+"</td>";
					}
				}
			});
			html_+="</tr>";
			html+=html_;
		}
		tbody_.html(html);
		//绑定事件
		bindClick($(".pagination"));
	}
}, "mybootstrapTable");


//基于bootstrap的一个翻页绑定数据的table框
//传入的参数是列的名称，和需要的数据的格式化信息；
//底部有个自定义的分页插件