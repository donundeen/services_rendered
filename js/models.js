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

	},

	initialize : function(){
	//	this.load();

		// load sectionConfigs (or maybe it gets saved with entityConfig already? )

	}


});



var Entity = CouchModel.extend ({


	defaults : {
		sections :  new Backbone.Collection([], {model : Section}),
		ident : "Entity",
	},

	dontSave : ["sections", "config"],

	initialize : function(){
	//	this.load(arguments[0]);
		var realthis = this;

		// load sections here, by looking at this.config to see what sections get loaded..
		this.get("config").get("sectionConfigs").each(function(sectionConfig){
			var section = new Section({config : sectionConfig, parent : realthis});
			realthis.get("sections").add(section);
		});
	},

	doThing : function(){
		this.get("sections").first().get("properties").first().set({value : "beef"});

	}

});


var SectionConfig = CouchModel.extend({

	defaults : {
    	ident : "SectionConfig",
		propertyConfigs :  new Backbone.Collection([], {model : PropertyConfig}),		
	},

	initialize : function(){
	//	this.load();	
	}
});


var Section = CouchModel.extend ({

	config : null,

	dontSave : ["properties", "config"],

	defaults : {
		ident : "Section",
		properties :  new Backbone.Collection([], {model : Property}),
	},

	initialize : function(){
	//	this.load();		
		// load properties, by looking at this.configs propertyConfigs
		var realthis = this;

		this.get("config").get("propertyConfigs").each(function(propertyConfig){
			var property = new Property({config : propertyConfig, parent: realthis});
			realthis.get("properties").add(property);
		});		

	}


});


var PropertyConfig = CouchModel.extend ({
	defaults : {
		ident : "PropertyConfig",
	},

	initialize : function(){
		//this.load();
	}

});

var Property = CouchModel.extend ({


	dontSave : ["config"],

	defaults : {
		ident : "Property",
		value : "chicken",

	},

	initialize : function(){
	//	this.load();

	}

});

