(function(root, factory, plug){
  return factory(root.jQuery, plug);
})(window, function($, options){

  var __CONTENT__ = {
      messagelist : new Array(),
      rolenow : new Role("1", "main", "img/1.png", "online")
  }

  function Message(roleid, messagehtml){
    this.roleid = roleid;
    this.messagehtml = messagehtml;
  }

  function Role(roleid, rolename, headpath, onlinestate){
    this.roleid = roleid;
    this.rolename = rolename;
    this.headpath = headpath;
    this.onlinestate = onlinestate;
    this.html = '<li class="role-list" id = "'+roleid+'"><a href="#" class="ui-link"><img src="'+headpath+'">'+rolename+'</a></li>';
    this.message = "";
  }

  $.fn[options] = function(fileds){
	
  }

  window.addRole = function(role){
	var role = new Role(role.roleid,role.rolename, role.headpath, role.state);
	var exist = contain(role.roleid);
	
	if(exist != -1){
		console.log("请不要重复点击");
	}else{
		var roleUl = $("#role-container").find('ul');
		var rolist = roleUl.find('li');
		rolist.css({"border-right":"none"});
		var ulHtml = $("#right").html();
		$("#right").html(ulHtml+role.html);
		__CONTENT__.messagelist.push(role);
	}

  }
  
  window.clickRole = function(e){
	  var roleid = e.attr('id');
	  var roleUl = $("#role-container").find('ul');
	  var rolist = roleUl.find('li');
	  rolist.css({"border-right":"none"});
	  var ulHtml = $("#right").html();
  }

  window.removeRole = function(roleid){
	
  }
  
  function contain(roleid){
	  var roleIdList = new Array();
	  $.each(__CONTENT__.messagelist, function(index){
		  roleIdList.push(__CONTENT__.messagelist[index].roleid);
	  });
	  return roleIdList.indexOf(roleid);
  }



},"leftTabEvent");

/*需要参数：
1.显示消息的ul 的id



*/