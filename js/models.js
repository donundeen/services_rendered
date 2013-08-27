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


the big config/entity question:
- configs apply to ALL entities of that type
- what if the config changes, and then the object is loaded?
- what if the config removes a sectionConfig - does that section go away from the object?
-- let's say yes
- what if a config has had a sectionconfig added
-- how does the entity match up it's saved sections, to the sections in the sectionConfig?
-- need an identifier for each section, and each sectionconfig


*/


Backbone.sync = function(method, model){
	console.log("started sync");
	console.log(method + ": " );
	console.log(model);
	console.log("did sync")
  	model.id = 1;

  	// so, I think save stuff happens here? or, put save method in individual models, or in CouchModel
  	// need to figure out how to make it work with couch, if we want to use this. just use our own store method for now.
};


var CouchModel = Backbone.Model.extend({


	db: null,

	serviceRunning : true,

	dontSave : [],

	defaults : {
		ident : "CouchModel",
	},

	idAttribute : "_id",


	connect : function (){

		if(this.serviceRunning){
			this.db = new CouchDB("http://localhost:8088/localhost:5984","example", {"X-Couch-Full-Commit":"false"});
		}
	},



	store : function(){   

		this.preStore(); 
		var realthis = this;
		if(this.db == null){
			this.connect();
		}
		if(this.serviceRunning){
			var doc = this.clone();//attributes;

			$(this.nestedCollections).each(function(index, value){
				var collectionListID = "nested_" + value;
				var collection = doc.get(value);
				var collectionids = [];
				collection.each(function(item){
					item.store();
					collectionids.push(item.id);
				});
				doc.set(collectionListID, collectionids);
				doc.unset(value);
			});

			$(this.dontSave).each(function(index, value){
				if(doc.has(value)){
					doc.unset(value);
				}
			});

			this.preSave(doc);

			try{
			    var saveresult = this.db.save(doc.attributes);
			}catch(e){
			    console.log("store error");
			    console.log(e);  
			}
		}
		this.postStore();
	},

	postStore : function (){
	},

	preSave : function(doc){
	},

	preStore : function(){

	},

	load: function(overrides){

		if(!this.has("_id")){
			return;
		}

		if(this.db === null){
			this.connect();
		}		
		if(this.serviceRunning){
			realthis = this;
			try{
				console.log("trying to load :: " + this.get("_id"));
			    var storeddoc = this.db.open(this.get("_id"));
			}catch(e){
			    console.log("retrieval error");
			    console.log(e); 
			}
		    this.set(storeddoc);
			$(this.nestedCollections).each(function(index, value){
				var collectionListID = "nested_" + value;
				var collection = realthis.get(value);
				var collectionids = realthis.get(collectionListID);
				$(collectionids).each(function(index, item_id){
					var item = {_id : item_id};
					collection.add(item);
					var newitem = collection.at(collection.length - 1);
					newitem.load();
				});
				realthis.set(value, collection);
				realthis.unset(collectionListID);
			});
		    this.set(overrides);
		}
		this.postLoad();
	},

	postLoad : function(){

	}

});



var Service = CouchModel.extend ({
	// services encapsulate everything you need to describe a webservice, but not he specific CALL of that service.
	/* 
		things like : 
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

// this can be the factory method for creating an object
Service.getInstance = (function(){
	return function(id, args){
		if(!args){
			args = {};
		}
		if(id){
			args._id = id;
		}
		var service = new Service(args);
		if(id && !args.new){
			service.load();
		}
		return service;
	};
})();


var EntityConfig = CouchModel.extend({

	defaults : {
	//	"foo" : "bar",
		sectionConfigs :  new Backbone.Collection([], {model : SectionConfig}),
		ident : "EntityConfig",
		rand : null
	},

//	dontSave : ["sectionConfigs"] ,//["sections", "config"],

	nestedCollections : ["sectionConfigs"],

	initialize : function(){
		this.set("rand", Math.random());
	},

	resetSectionConfigs : function(){
		this.set("sectionConfigs", new Backbone.Collection([], {model : SectionConfig}));
	},

	addSectionConfig : function(sectionConfig){
		// what do we need to add a new, undescribed sectionConfig?

		// add the empty setionConfig

		// then let entities that use this config know that they need to add an entity with that config

		// therefore, need entities to be able to listen to 'addSectionConfig' events in thier config models
		if(!sectionConfig){
			sectionConfig = SectionConfig.getInstance(null, {new:true});
//			sectionConfig = new SectionConfig({});
		}
		if(!sectionConfig.id){
			var newid = this.id + "/" + sectionConfig.cid;
			sectionConfig.set("_id", newid);
		}
		console.log("adding sectionConfig");
		this.get("sectionConfigs").add(sectionConfig);
		this.set("rand", Math.random(1000)); // triggering change. Probably a better way, Need to listen for add event on the Colleciton, I think.
	}
});

// this can be the factory method for creating an object
EntityConfig.getInstance = (function(){
	return function(type, args){
		if(!args){
			args = {};
		}
		if(type){
			var entityConfigID = "config/" + type;
			args._id = entityConfigID;
		}
		var entityConfig = new EntityConfig(args);
		entityConfig.resetSectionConfigs();
		if(type && !args.new){
			entityConfig.load();
		}
		return entityConfig;
	};
})();


var Entity = CouchModel.extend ({


	defaults : {
		sections :  new Backbone.Collection([], {model : Section}),
		ident : "Entity",
		title : "untitled"
	},


	dontSave : ["sections", "config"] ,//["sections", "config"],

	initialize : function(){
	},

	resetSections : function(){
		this.set("sections", new Backbone.Collection([], {model : Section}));
	},

	doThing : function(){
		this.get("sections").first().get("properties").first().set({value : "beef"});
	},

	configChanged : function(var1){
		// for when config attributes change
	},

	setConfig : function(config){
		this.set("config", config);
		// need to attach a listener to the config, so when changes happen to the config, this model is notified.
		this.listenTo(this.get("config"), "change", this.configChanged);
		this.listenTo(this.get("config").get("sectionConfigs"), "add", this.sectionConfigAdded);
	},

	reconcileConfig : function(){
		// add sections that are in config but not entity
		// load sections here, by looking at this.config to see what sections get loaded..
		var realthis = this;
		this.get("config").get("sectionConfigs").each(function(sectionConfig){
			// need to determine what sections are already in the object
			// if the section is already in the entity, don't create it (how to determine?)
			realthis.addSection(sectionConfig);
		});

		// remove sections that are in entity but not config

		this.get("sections").each(function(entitySection){
			outerSectionConfig = entitySection.get("config");
			var found = false;
			realthis.get("config").get("sectionConfigs").each(function(sectionConfig){
				if(sectionConfig == outerSectionConfig){
					found = true;
					return false;
				}
			});
			if(found == false){
				// remove the section
				realthis.removeSection(entitySection);
			}
		});					

	},

	sectionConfigAdded : function(sectionConfig, entireList){
		// for when sections are added
		this.addSection(sectionConfig);
	},

	addSection : function(sectionConfig){
		// what do we need when we add a new section?
		// should already have a config to go with it, even if that config doesn't have any details

		// make sure sectionConfig isn't already in use in a section
		/*
		var found = false;
		this.get("config").get("sectionConfigs").each(function(innerSectionConfig){
			if(innerSectionConfig == sectionConfig){
				console.log("setionConfig already in this entity");
				// if it's already in there, then don't load it again.
				found = true;
				return false;
			}
		});
		if(found){
			return;
		}
*/
		// otherwise, add the section
		var section = Section.getInstance(null, {config : sectionConfig, new:true});//, parent: this});
		// here, section.cid will exist, and be unique (for this collection, at least);
		this.get("sections").add(section);
	},

	removeSection : function(sectionID){
		this.get("sections").remove(section);
	}
});


// this can be the factory method for creating an object
Entity.getInstance = (function(){
	return function(id, type, args){
		// this should load the appropriate stuff from couch, I think.

		// first, load the config object
		// load the nested objects in that config

		// then load the entity, 
		// then load the entities' setions, 
		// then and add the config object to it, which should remove any unneeded sections, add any new ones.
		// load the nested objects in that config

		// then, do any initialization on the object

		if(!args){
			args = {};
		}
		if(id){
			args._id = "entity/"+type+"/"+id;
		}
		var entity = new Entity(args);

		if(!args || !args.config){
			console.log("getting new config");
			console.log(args);
			var config = EntityConfig.getInstance(type, {new:true});
			entity.setConfig(config);
		}else{
			entity.setConfig(args.config);
		}

		if(args.new){
			entity.resetSections();
		}

		if(id && !args.new){
			entity.load();
		}

		// load the entities sections?

		entity.reconcileConfig();
		return entity;
	};
})();



var SectionConfig = CouchModel.extend({

	defaults : {
    	ident : "SectionConfig",
		propertyConfigs :  new Backbone.Collection([], {model : PropertyConfig}),	
		name: "new section",	
		rand: null,
		service: null,
	},

	nestedCollections : ["propertyConfigs"],
   

	initialize : function(){
		//	this.load();	

		// i think this needs to go into some other function, keep the initializer empty.
		// make getInstance objects for all of these objects, ie factories.		yConfig}));
		this.set("rand", Math.random(1000));
	},


	resetPropertyConfigs : function(){

		this.set("propertyConfigs", new Backbone.Collection([], {model : PropertyConfig}));
	},

	preSave : function(doc){
		if(this.get("service")){
			doc.set("service_obj", this.get("service").attributes);
		}else{
			console.log("no service found");
			console.log(this);
		}
	},	

	postLoad : function(){
		if(this.get("service_obj")){
			this.set("service", new Service(this.get("service_obj")));
			this.unset("service_obj");
		}
	},

	addPropertyConfig : function(propertyConfig){
		// what details do we need for a new, unformed propertyConfig?
		if(!propertyConfig){
			var propertyConfig = new PropertyConfig({});
		}
		if(!propertyConfig.id){
			var newid = this.id + "/" + propertyConfig.cid;
			propertyConfig.set("_id", this.id + "/" + propertyConfig.cid);
		}
		this.get("propertyConfigs").add(propertyConfig);
		this.set("rand", Math.random(1000)); // triggering change. Probably a better way, Need to listen for add event on the Colleciton, I think.
		// need to notify all sections that use this config that the config has changed.
	}
});



SectionConfig.getInstance = (function(){
	return function(id, args){
		if(!args){
			args = {};
		}
		if(id){
			args._id = id;
		}
		var sectionConfig = new SectionConfig(args);

		if(args.new){
			sectionConfig.resetPropertyConfigs();
		}
		if(id && !args.new){
			sectionConfig.load();
		}
		return sectionConfig;
	};
})();



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
		this.set("rand", Math.random(100));
		// need to attach listener to the config, so that when the config changes, this class is notified.
	},

	setConfig : function(config){
		this.set("config", config);
		this.listenTo(this.get("config"), "change", this.configChanged);
		this.listenTo(this.get("config").get("propertyConfigs"), "add", this.propertyConfigAdded);
		this.reconcileConfig();
	},

	reconcileConfig : function(){
		var realthis = this;
		// load properties, by looking at this.configs propertyConfigs
		this.get("config").get("propertyConfigs").each(function(propertyConfig){
			realthis.addProperty(propertyConfig);
		});		


	},


	resetProperties : function(){
		this.set("properties", new Backbone.Collection([], {model : Property}));
	},

	configChanged : function(var1){
	},


	propertyConfigAdded : function(propertyConfig, entireList){
		this.addProperty(propertyConfig);
	},

	addProperty : function(propertyConfig){
		var property = Property.getInstance(null, {config : propertyConfig, new: true }); // new Property({config : propertyConfig });//, parent: this});
		this.get("properties").add(property);
	}
});



Section.getInstance = (function(){
	return function(id, args){
		if(!args){
			args = {};
		}
		if(id){
			args._id = id;
		}
		var section = new Section(args);
		if(args.new){
			section.resetProperties();
		}
		if(args.config){
			section.setConfig(args.config);
		}
		if(id && !args.new){
			section.load();
		}
		section.reconcileConfig();
		return section;
	};
})();



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


PropertyConfig.getInstance = (function(){
	return function(id, args){
		if(!args){
			args = {};
		}
		if(id){
			args._id = id;
		}else{
		}
		var propertyConfig = new PropertyConfig(args);
		if(id && !args.new){
			propertyConfig.load();
		}
		return propertyConfig;
	};
})();



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



Property.getInstance = (function(){
	return function(id, args){
		if(!args){
			args = {};
		}
		if(id){
			args._id = id;
		}
		var property = new Property(args);
		if(id && !args.new){
			property.load();
		}
		return property;
	};
})();


