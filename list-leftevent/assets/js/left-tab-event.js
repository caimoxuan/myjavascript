(function(root, factory, plug){
  return factory(root.jQuery, plug);
})(window, function($, options){

  var __CONTENT__ = {
      messagelist : new Array(),
      rolenow : new Role("1", "main", "img/1.png", "online");
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
    this.html = '<li data-role-list="common" ><a href = "#"><img src = "'+headpath+'" class = "'+onlinestate+'">'+rolename+'</a><a href = "#" onclick = "removeRole()"><span>X</span></a></li>';
    this.message = "";
  }

  $.fn[options] = function(fileds){

  }

  window.addRole = function(){
    var role = new Role("123","cmx","img/1.png","online");
    $.each(__CONTENT__.messagelist, function(index){
      if(__CONTENT__.messagelist[index].roleid === role.roleid){
        console.log("请不要重复点击");
      }else{
        
        $("#right").html(role.html);
        __CONTENT__.messagelist.push(role);
      }
    });


  }

  window.removeRole = function(){

  }



},"leftTabEvent");
