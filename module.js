/*checks to see if the current user making the reqest to update the admin user */
library = new Meteor.Collection("mylibrary");

function adminUser(userId){
	//console.log("the userId  "+userId);
	var adminUser = Meteor.users.findOne({username:"admin"});
	return (userId&&adminUser&&userId===adminUser._id);
}

library.allow({
	insert: function(userId,doc){
		return adminUser(userId);
	},
	update: function(userId,docs,fields,modifer){
		return adminUser(userId);
	},
	remove: function(userId,docs){
		return adminUser(userId);
	}
});
