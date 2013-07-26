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
		ident : "CouchModel",
	},

	connect : function (){

		if(this.serviceRunning){
			console.log("trying to connect");
			this.db = new CouchDB("http://localhost:8088/localhost:5984","example", {"X-Couch-Full-Commit":"false"});
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
	// services encapsulate everything you need to describe a webservice, but not he specific CALL of that service.
	/* things like : 
		uri
		name
		variables 
		return type
	*/
	defaults : {
		ident : "Service",
	},

	initialize : function(){
		//	this.load();
	}

});



var EntityConfig = CouchModel.extend({

	defaults : {
	//	"foo" : "bar",
		sectionConfigs :  new Backbone.Collection([], {model : SectionConfig}),
		ident : "EntityConfig",
		rand : null
	},

	initialize : function(){
		//	this.load();
		// load sectionConfigs (or maybe it gets saved with entityConfig already? )
		//this.set("sectionConfigs", new Backbone.Collection([], {model : SectionConfig}));
		this.set("rand", Math.random());
	},


	addSectionConfig : function(sectionConfig){
		// what do we need to add a new, undescribed sectionConfig?

		// add the empty setionConfig

		// then let entities that use this config know that they need to add an entity with that config

		// therefore, need entities to be able to listen to 'addSectionConfig' events in thier config models
		if(!sectionConfig){
			sectionConfig = new SectionConfig({});
		}
		this.get("sectionConfigs").add(sectionConfig);
		this.set("rand", Math.random(1000)); // triggering change. Probably a better way, Need to listen for add event on the Colleciton, I think.

	}
});



var Entity = CouchModel.extend ({


	defaults : {
		sections :  new Backbone.Collection([], {model : Section}),
		ident : "Entity",
		title : "untitled"
	},

	dontSave : ["sections", "config"],

	initialize : function(){
	//	this.load(arguments[0]);
		// now when this loads, we might need to load/save from db somehow.

		var realthis = this;

		this.set("sections", new Backbone.Collection([], {model : Section}));

		// need to attach a listener to the config, so when changes happen to the config, this model is notified.
		this.listenTo(this.get("config"), "change", this.configChanged);
		this.listenTo(this.get("config").get("sectionConfigs"), "add", this.sectionConfigAdded);

		// load sections here, by looking at this.config to see what sections get loaded..
		this.get("config").get("sectionConfigs").each(function(sectionConfig){
			realthis.addSection(sectionConfig);
		});
	},

	doThing : function(){
		this.get("sections").first().get("properties").first().set({value : "beef"});
	},

	configChanged : function(var1){
		// for when config attributes change
	},

	sectionConfigAdded : function(sectionConfig, entireList){
		// for when sections are added
		this.addSection(sectionConfig);
	},

	addSection : function(sectionConfig){
		// what do we need when we add a new section?
		// should already have a config to go with it, even if that config doesn't have any details
		var section = new Section({config : sectionConfig, parent: this});
		this.get("sections").add(section);
	}
});


var SectionConfig = CouchModel.extend({

	defaults : {
    	ident : "SectionConfig",
		propertyConfigs :  new Backbone.Collection([], {model : PropertyConfig}),	
		name: "new section",	
		rand: null,
	},

	initialize : function(){
		//	this.load();			
		this.set("propertyConfigs", new Backbone.Collection([], {model : PropertyConfig}));
		this.set("rand", Math.random(1000));
	},

	addPropertyConfig : function(){
		// what details do we need for a new, unformed propertyConfig?
		var propertyConfig = new PropertyConfig({});
		this.get("propertyConfigs").add(propertyConfig);
		this.set("rand", Math.random(1000)); // triggering change. Probably a better way, Need to listen for add event on the Colleciton, I think.
		// need to notify all sections that use this config that the config has changed.
	}
});


var Section = CouchModel.extend ({

	config : null,

	dontSave : ["properties", "config"],

	defaults : {
		ident : "Section",
		properties :  new Backbone.Collection([], {model : Property}),
		rand : Math.random()
	},

	initialize : function(){
		var realthis = this;
		//	this.load();		

		// if i don't set the value here, it seems to get the properties of whatever the other section is. strange.
		this.set("properties", new Backbone.Collection([], {model : Property}));

		this.set("rand", Math.random(100));
		// need to attach listener to the config, so that when the config changes, this class is notified.
		this.listenTo(this.get("config"), "change", this.configChanged);
		this.listenTo(this.get("config").get("propertyConfigs"), "add", this.propertyConfigAdded);

		// load properties, by looking at this.configs propertyConfigs
		this.get("config").get("propertyConfigs").each(function(propertyConfig){
			realthis.addProperty(propertyConfig);
		});		
	},

	configChanged : function(var1){
	},


	propertyConfigAdded : function(propertyConfig, entireList){
		this.addProperty(propertyConfig);
	},

	addProperty : function(propertyConfig){
		var property = new Property({config : propertyConfig, parent: this});
		this.get("properties").add(property);
	}
});


var PropertyConfig = CouchModel.extend ({
	defaults : {
		ident : "PropertyConfig",
		name  : "new property",
		rand : null,
	},

	initialize : function(){
		this.set("rand", Math.random(1000));
		//this.load();
	}
});

var Property = CouchModel.extend ({

	dontSave : ["config"],

	defaults : {
		ident : "Property",
		value : "default value",
		rand: null
	},

	initialize : function(){
		this.set("rand", Math.random(1000));
		this.set("value", "default " + Math.random()); // bug: properties are being re-used in each section this value is the same in all sections
	//	this.load();
	}
});

