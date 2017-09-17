(function(root, factory, plug){
  return factory(root.jQuery, plug);
})(window, function($, options){

  var __CONTENT__ = {
      rolelist : new Array(new Role(0, "main", "img/1.png", "online")),
      rolenow : new Role(0, "main", "img/1.png", "online")
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
    this.html = '<li class="role-list" data-chater = "'+roleid+'"><a href="#" class="ui-link"><img src="'+headpath+'"></a></li>';
    this.message = "";
  }

  $.fn[options] = function(fileds){
	
  }

  window.addRole = function(role){
	var role = new Role(role.roleid,role.rolename, role.headpath, role.state);
	var exist = hasChatRole(role.roleid);
	
	if(exist){
		console.log("请不要重复点击");
	}else{
		var roleUl = $("#role-container").find('ul');
		var ulHtml = roleUl.html();
		roleUl.html(ulHtml+role.html);
		__CONTENT__.rolelist.push(role);
		
		var allli = $("#role-container").find('ul').find('li');
		allli.on('click', function(){clickRole(this);});
		var li = $("#role-container").find('ul').find('li[data-chater='+role.roleid+']');
		clickRole(li);
	}

  }
  
  window.clickRole = function(e){
	  var roleid = $(e).data('chater');
	  
	  var roleUl = $("#role-container").find('ul');
	  var rolist = roleUl.find('li');
	  rolist.css({"border-right":"none"});
	  var messageHtml = $("#responseText").html();
	  var index = findRole(__CONTENT__.rolenow.roleid);
	  __CONTENT__.rolelist[index].message=messageHtml;
	  var roleindex = findRole(roleid);
	  __CONTENT__.rolenow = __CONTENT__.rolelist[roleindex];
	  $("#responseText").html(__CONTENT__.rolelist[roleindex].message);
  }

  window.removeRole = function(roleid){
	var li = $("#role-container").find('ul').find('li[data-chater='+roleid+']');
	li.remove();
  }
  
  function hasChatRole(roleid){
	  var li = $("#role-container").find('ul').find('li[data-chater='+roleid+']');
	  return li.length > 0;
  }
  
  function contain(roleid){
	  var roleIdList = new Array();
	  $.each(__CONTENT__.rolelist, function(index){
		  roleIdList.push(__CONTENT__.rolelist[index].roleid);
	  });
	  return roleIdList.indexOf(roleid);
  }
  
  function findRole(roleid){
	  var i;
	  $.each(__CONTENT__.rolelist, function(index){
		 if(__CONTENT__.rolelist[index].roleid === roleid){
			 i = index;
			 return false;
		 } 
	  });
	  return i;
  }



},"leftTabEvent");

/*需要参数：
1.显示消息的ul 的id



*/