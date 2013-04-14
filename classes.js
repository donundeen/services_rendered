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


	db: null,

	serviceRunning : true,

	dontSave : [],

	defaults : {
	},

	connect : function (){

		if(this.serviceRunning){
			console.log("trying to connect");
			this.db = new CouchDB("http://localhost:8080/localhost:5984","example", {"X-Couch-Full-Commit":"false"});
		}
	},




	store : function(){    
		if(this.db == null){
			this.connect();
		}
		if(this.serviceRunning){
			var doc = this.clone();//attributes;
				
			$(this.dontSave).each(function(index, value){
				if(doc.has(value)){
					console.log("unsetting " + value);
					doc.unset(value);
				}
			});
			try{
			    var saveresult = this.db.save(doc.attributes);
			}catch(e){
			    console.log("store error");
			    console.log(e);  
			}
		}
		
	},


	load: function(overrides){

		if(this.db === null){
			this.connect();
		}		
		if(this.serviceRunning){
			try{
			    var storeddoc = this.db.open(this.get("_id"));
			    this.set(storeddoc);
			    this.set(overrides);
			}catch(e){
			    console.log("retrieval error");
			    console.log(e); 
			}
		}
	}
});



var Service = CouchModel.extend ({

	defaults : {

	},

	initialize : function(){
		this.load();


	}

});

var EntityConfig = CouchModel.extend({

	defaults : {
	//	"foo" : "bar",
		sectionConfigs : []
	},

	initialize : function(){
		this.load();

		// load sectionConfigs (or maybe it gets saved with entityConfig already? )

	}


});

var Entity = CouchModel.extend ({


	defaults : {
		sections : [],
	},

	dontSave : ["sections", "config"],

	initialize : function(){
		this.load(arguments[0]);


		// load sections here, by looking at this.config to see what sections get loaded..
		$(this.get("config").get("sectionConfigs")).each(function(index, sectionConfig){

		});

	}

});


var EntitySectionConfig = CouchModel.extend({

	defaults : {
		propertyConfigs : [],
	},

	initialize : function(){
		this.load();	
	}
});


var EntitySection = CouchModel.extend ({

	config : null,

	dontSave : ["properties", "config"],

	defaults : {
		properties : []
	},

	initialize : function(){
		this.load();		

		// load sectionproperties, by looking at this.configs propertyConfigs

	}


});


var SectionPropertyConfig = CouchModel.extend ({

	defaults : {

	},

	initialize : function(){
		this.load();
	}

});

var SectionProperty = CouchModel.extend ({

	dontSave : ["config"],

	defaults : {

	},

	initialize : function(){
		this.load();


	}

});

var EntityViewEditable = Backbone.View.extend ({


// look at this: http://stackoverflow.com/questions/6353607/backbone-js-structuring-nested-views-and-models
	initialize : function(){
		this.listenTo(this.model, "change", this.render);
	},

	render : function (){
		console.log("rendering");
		this.$el.html("the html for the entity goes here");
		return this;
	}

});

var SectionViewEditable = Backbone.View.extend({
	initialize : function(){
		this.listenTo(this.model, "change", this.render);

	},

	render : function (){
		
	}

});

var SectionPropertyViewEditable = Backbone.View.extend ({


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

	viewElem : null,

	routes : {
		"" : "home",
		"entity/:type/:entityid" : "entity",
		"*default" : "defaultAction"
	},


	initialize : function(options){
		console.log("init routes");
		console.log(options);
		this.viewElem = options.viewElem;
		console.log(this.viewElem);

	},

	defaultAction : function(stuff){
		console.log("catchall " + stuff);
	},



	entity : function (type, id){

		console.log("entity " + type + " : " + id);

		var entityConfig = new EntityConfig({_id: "config/" + type});

		// fake up some configs here


		var entity = new Entity({_id: "entity/"+type+"/"+id ,config: entityConfig});
//		entity.set({config: entityConfig});
		console.log(entity);



		var view = new EntityViewEditable({model : entity, el : this.viewElem});
		view.render();


		entity.store();
		entityConfig.store();

	},

	home : function(){

		console.log("in home");
	},


});

