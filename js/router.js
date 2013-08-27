   

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
			uri : "http://someuri",
			new: true
		});


		// this can call the factory method for an entity, returning the entity object. 
		//var result = Entity.getInstance("thing");

		//console.log(result);

		// fake up some configs here
		

		var propconf1 = PropertyConfig.getInstance(null, {
			name : "countryCode",
			type : "text",
			new: true
		});
		var propconf2 = PropertyConfig.getInstance(null, {
			name : "state",
			type : "text",
			new: true
		});


		var secconf1 = SectionConfig.getInstance(null, {
			name : "geography",
			service : service,
			new: true
		});



//		var entityConfig = EntityConfig.getInstance(type, {new:true});
		var entityConfig = EntityConfig.getInstance(type);//, {new:true});

		entityConfig.load();

		console.log(entityConfig);

/*
		entityConfig.addSectionConfig(secconf1);

		secconf1.addPropertyConfig(propconf1);
		secconf1.addPropertyConfig(propconf2);
*/


	//	entityConfig.store();

		var entity = Entity.getInstance(id , type, {config: entityConfig, new : true});

		//entity.store();


		var view = new EntityViewEditable({model : entity, 
											el : this.viewElem, 
											contentElem : this.headerElem,
											configElem : this.configElem});

	},

	home : function(){

		console.log("in home");
	},


});

