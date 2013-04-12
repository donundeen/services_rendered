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




var CouchModel = Backbone.Model.extend({

	db: null;

	connect : function (){
		this.db = new CouchDB("http://localhost:8080/localhost:5984","example", {"X-Couch-Full-Commit":"false"});


	},

	store: function(){
		var doc = {_id : id , data : this.defaults};
		try{
		    var saveresult = db.save(doc);
		}catch(e){
		    console.log("error");
		    console.log(e);  
		}

	},

	get: function(){
		try{
		    var storeddoc = db.open(this.id);
		    console.log(storeddoc);
		    this.defaults = storeddoc.data;

		}catch(e){
		    console.log("error");
		    console.log(e);  
		}


	}


});



var ServiceConfig = CouchModel.extend({

	defaults : {

	},

	initialize : function(){

		this.get();
	},

});


var Service = CouchModel.extend ({

	defaults : {

	},

	initialize : function(){
		this.get();


	}

});


var EntityConfig = CouchModel.extend({

	defaults : {

	},

	initialize : function(){
		this.get();

		
	}


});

var Entity = CouchModel.extend ({

	defaults : {
		id : null;
		config : null;
	},

	initialize : function(){
		this.get();

		
	}

});


var EntitySectionConfig = CouchModel.extend({

	defaults : {

	},

	initialize : function(){
		this.get();

		
	}



});
var EntitySection = CouchModel.extend ({

	defaults : {

	},

	initialize : function(){
		this.get();

		
	}


});


var SectionPropertyConfig = CouchModel.extend ({

	defaults : {

	},

	initialize : function(){
		this.get();

		
	}

});

var SectionProperty = CouchModel.extend ({

	defaults : {

	},

	initialize : function(){
		this.get();

		
	}

});

var EntityViewEditable = Backbone.View.extend ({
	initialize : function(){
		this.listenTo(this.model, "change", this.render);

	},

	render : function (){

	}

});

var SectionViewEditable = Backbone.View.extned({
	initialize : function(){
		this.listenTo(this.model, "change", this.render);

	},

	render : function (){
		
	}
	
});

var SectionPropertyEditable = Backbone.View.extend ({


	events : {


	},

	initialize : function(){
		this.listenTo(this.model, "change", this.render);

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
		var objectConfig = new EntityConfig({type : "object"});
		var object = new Entity({id : "object/" + objectid, config: objectConfig});
		var view = new EntityView({model: object});

		view.render();

	}

});