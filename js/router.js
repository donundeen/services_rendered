   

var Workspace = Backbone.Router.extend({

	viewElem : null,
	headerElem : null,
	configElem : null,
	ident : "Workspace",

	routes : {
		"" : "home",
		"entity/:type/:entityid" : "entity",
		"*default" : "defaultAction"
	},


	initialize : function(options){
		this.viewElem = options.viewElem;
		this.headerElem = options.headerElem;
		this.configElem = options.configElem;
	},

	defaultAction : function(stuff){
		console.log("catchall " + stuff);
	},



	entity : function (type, id){

		console.log("entity " + type + " : " + id);

		var service = new Service({
			uri : "http://someuri"
		});


		// this can call the factory method for an entity, returning the entity object. 
		var result = Entity.getInstance("thing");

		console.log(result);

		// fake up some configs here
		
		var propconf1 = new PropertyConfig({
			name : "countryCode",
			type : "text"
		});
		var propconf2 = new PropertyConfig({
			name : "state",
			type : "text"
		});

		var secconf1 = new SectionConfig({
			name : "geography",
			service : service,
//			propertyConfigs :  new Backbone.Collection([propconf1, propconf2], {model : PropertyConfig}),
		});

		secconf1.addPropertyConfig(propconf1);
		secconf1.addPropertyConfig(propconf2);


		var entityConfig = new EntityConfig({_id: "config/" + type
							});

		//entityConfig.load();

		entityConfig.addSectionConfig(secconf1);

		//entityConfig.store();
		console.log("67");

		var entity = new Entity({_id: "entity/"+type+"/"+id ,config: entityConfig});
		console.log("70");
//		var entity = new Entity({_id: "entity/"+type+"/"+id });
		//entity.store();
//		entity.set({config: entityConfig});

//		entity.addSection(secconf1);

//		entity.store();

		var view = new EntityViewEditable({model : entity, 
											el : this.viewElem, 
											contentElem : this.headerElem,
											configElem : this.configElem});
		//entity.store();
		//entityConfig.store();

	},

	home : function(){

		console.log("in home");
	},


});

