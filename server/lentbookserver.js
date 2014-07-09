  Meteor.publish("Categories",function(){
  	//注意这里的字段应该是field,而不是fields
  	//注意查看mongodb的文档
   return library.find({owner:this.userId},{field:{Category:1}});
  });

  Meteor.publish("listdetails",function(category_id){
    return library.find({_id:category_id});
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
