// class definitions, using bootstrap

/*
Service :
- has a url (assuming REST)
- urls request parameters, that go into url
- response type (xml/json)
- binding response values to property names (using jpaht, xpath, etc)
-- which can be hierarchical


Entity
- contains sections
- can render itself, according to output type (xml, json, html, etc) - using templates or logic
- exists at a particular url
- has values, based on url



Section
- calls a service, or services
- has parameters, that it feeds to services
-- can populate those parameters, by looking at entity, or entity's other sections, or parent sections
-- maps service properties to section properties
-- can render itself according to output type (xml, json, html, etc) - using templates or logic
-- can store its property values, for caching
-- can contain child sections

Property
- can render themselves according to output type (xml, json, html, etc)
- can render forms for editing itself


*/

var ServiceConfig = Backbone.Model.extend({

	defaults : {

	},

	initialize : function(){

		
	}
});


var Service = Backbone.Model.extend ({

	defaults : {

	},

	initialize : function(){


	}

});


var EntityConfig = Backbone.Model.extend({

	defaults : {

	},

	initialize : function(){

		
	}
});

var Entity = Backbone.Model.extend ({

	defaults : {

	},

	initialize : function(){

		
	}

});


var EntitySectionConfig = Backbone.Model.extend({

	defaults : {

	},

	initialize : function(){

		
	}
});
var EntitySection = Backbone.Model.extend ({

	defaults : {

	},

	initialize : function(){

		
	}

});


var SectionPropertyConfig = Backbone.Model.extend ({

	defaults : {

	},

	initialize : function(){

		
	}

});

var SectionProperty = Backbone.Model.extend ({

	defaults : {

	},

	initialize : function(){

		
	}

});

var SectionPropertyEditable = Backbone.View.extend ({


	events : {


	},

	initialize : function(){
		this.listeTo(this.model, "change", this.render);

	},

	render: function(){
		this.$el.html("the html for the sectionproperty goes here");
		return this;
	}

});


var Workspace = Backbone.Router.extend({


	routes : {
		"" : "home",
		"home2" : "home2",
		"object/:objectid" : "object",
		"*default" : "defaultAction"
	},


	initialize : function(options){
		console.log("init routes");

	},

	defaultAction : function(stuff){
		console.log("catchall " + stuff);
	},

	home : function(){

		console.log("in home");
	},

	home2  : function(){
		console.log("home2");

	},

	object : function (objectid){
		console.log("object " + objectid);
	}

});