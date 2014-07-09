  Meteor.subscribe("Categories");
  Meteor.autosubscribe(function(){
    Meteor.subscribe("listdetails",Session.get('current_list'));
  });

 //Session.setDefault("userid",Accounts.connection.userId());
  Session.set('adding_category',false);


 Template.categories.lists = function(){
  var us=Accounts.connection.userId();
  return library.find({owner:us});
 };

 Template.categories.new_cat = function(){
  return Session.equals('adding_category',true);
 };

Template.categories.events({
  'click #btnNewCat': function(e,t){
    Session.set('adding_category',true);
    Meteor.flush();
    //set the focus onto the input box
    focusText(t.find("#add-category"));
  },
  'keyup #add-category':function(e,t){
    //输入完毕，按下enter键
    if(e.which ===13){
      var catVal = String(e.target.value||"");
      var ss=Accounts.connection.userId();
      //checks to see if the input field has any value in it
      if(catVal){
       library.insert({Category:catVal,owner:ss});
       Session.set('adding_category',false);
      }
    }
  },
  'focusout #add-category': function(e,t){
    Session.set('adding_category',false);
  },
  'click .category':function(e,t){
    //select the category
    Session.set('current_list',this._id);
  } 
});

function focusText(i,val){
  i.focus();
  i.value = val?val:"";
  i.select();
};

function selectCategory(e,t){
  Session.set('current_list',this._id);
};

Template.list.items = function(){
  if(Session.equals('current_list',null))
    return null;
  else{
    var cats = library.findOne({_id:Session.get('current_list')});
    if(cats&&cats.items){
      for(var i=0;i<cats.items.length;i++){
        var d = cats.items[i];
        d.Lendee = d.lentto?d.lentto:"free";
        d.LendClass = d.lentto? "label-important":"label-success";
      }
      return cats.items;
    }
  }
};

Template.list.list_selected = function(){
  //检查'current_list'，看它是不是未定义或者是空值，这两种情况都要检查
  return ((Session.get('current_list')!=null)&&(!Session.equals('current_list',null)));
};
Template.categories.list_status = function(){
  if(Session.equals('current_list',this._id))
    return "";
  else
    return "btn-inverse";
};

Template.list.list_adding = function(){
  return (Session.equals('list_adding',true));
};
Template.list.lendee_editing =function(){
  return (Session.equals('lendee_input',this.name));
};
Template.list.events({
  'click #btnAddItem': function(e,t){
    Session.set('list_adding',true);
    Meteor.flush();
    focusText(t.find("#item_to_add"));
  },
  'keyup #item_to_add':function(e,t){
    if(e.which === 13){
      addItem(Session.get('current_list'),e.target.value);
      console.log("adding item is success?");
      Session.set('list_adding',false);
    }
  },
  'focusout #item_to_add': function(e,t){
    Session.set('list_adding',false);
  },
  'click .delete_item':function(e,t){
    removeItem(Session.get('current_list'),e.target.id);
  },
  'click .lendee':function(e,t){
    Session.set('lendee_input',this.name);
    Meteor.flush();
    focusText(t.find("#edit_lendee"),this.lentto);
  },
  'keyup #edit_lendee':function(e,t){
    if(e.which === 13){
      updateLendee(Session.get('current_list'),this.name,e.target.value);
      Session.set('lendee_input',null);
    }
    if(e.which ===27){
      Session.set('lendee_input',null);
    }
  }
});
function addItem(list_id,item_name){
  if(!item_name&&!list_id)
    return;
  library.update({_id:list_id},{$addToSet:{items:{name:item_name}}});
};
function removeItem(list_id,item_name){
  if(!item_name&&!list_id)
    return;
  library.update({_id:list_id},{$pull:{items:{name:item_name}}});
};
function updateLendee(list_id,item_name,lendee_name){
  var l = library.findOne({"_id":list_id,"items.name":item_name});
  console.log("the element has been found");
  if(l&&l.items){
    for(var i=0;i<l.items.length;i++){
      if(l.items[i].name===item_name)
        l.items[i].lentto=lendee_name;
    }
    library.update({"_id":list_id},{$set:{"items":l.items}});
  }
}

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});