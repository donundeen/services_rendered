   

var Workspace = Backbone.Router.extend({

	viewElem : null,
	ident : "Workspace",

	routes : {
		"" : "home",
		"entity/:type/:entityid" : "entity",
		"*default" : "defaultAction"
	},


	initialize : function(options){
		this.viewElem = options.viewElem;
	},

	defaultAction : function(stuff){
		console.log("catchall " + stuff);
	},



	entity : function (type, id){

		console.log("entity " + type + " : " + id);

		var service = new Service({
			uri : "http://someuri"
		});


		// fake up some configs here
		/*
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
			propertyConfigs :  new Backbone.Collection([propconf1, propconf2], {model : PropertyConfig}),
		});
*/

		var entityConfig = new EntityConfig({_id: "config/" + type,
//											sectionConfigs : new Backbone.Collection([secconf1], {model : SectionConfig})
											sectionConfigs : new Backbone.Collection([], {model : SectionConfig})
							});


		var entity = new Entity({_id: "entity/"+type+"/"+id ,config: entityConfig});
//		entity.set({config: entityConfig});

		var view = new EntityViewEditable({model : entity, el : this.viewElem});
		//entity.store();
		//entityConfig.store();

	},

	home : function(){

		console.log("in home");
	},


});

