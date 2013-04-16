/*
 TODO :
 make initial version, in raw code, for basic entity, sections, properties, and configs.
 Implement Templates for teh views
 Use decorators, or factories, or something, so that new types of views can be created.

*/



var EntityViewEditable = Backbone.View.extend ({

	ident : "EntityViewEditable",
	tagName : "div",

// look at this: http://stackoverflow.com/questions/6353607/backbone-js-structuring-nested-views-and-models
	initialize : function(){
		this.listenTo(this.model, "change", this.modelChanged);

		// the config element, should be hidable, default hidden
		var configElem = $("<div class='entityConfigDiv'></div>");
		this.$el.append(configElem);
		new EntityConfigViewEditable({model : this.model.get("config"), el : configElem });


		// building up the sections
		var realthis = this;
		this.model.get("sections").each(function(section){
			var sectionElem = $("<div class='sectionDiv'></div>");
			realthis.$el.append(sectionElem);
			new SectionViewEditable({model : section, el : sectionElem, parent : realthis});
		});
		this.render();
	},

	render : function (){
		//this.$el.html("the html for the entity goes here");

		return this;
	},

	modelChanged : function(){
		this.render();

	}

});



var EntityConfigViewEditable = Backbone.View.extend ({

	ident : "EntityConfigViewEditable",
	tagName : "div",

// look at this: http://stackoverflow.com/questions/6353607/backbone-js-structuring-nested-views-and-models
	initialize : function(){
		this.listenTo(this.model, "change", this.modelChanged);

		// build up dijit form that's editable

		this.render();
	},

	render : function (){
		//this.$el.html("the html for the entity goes here");
		return this;
	},

	modelChanged : function(){
		this.render();
	}

});




var SectionViewEditable = Backbone.View.extend({

//	propertyViews : [],
//	propertyViews :  new Backbone.Collection([], {model: PropertyViewEditable}),
	ident : "SectionViewEditable",
	tagName : "div",

	initialize : function(){
		this.listenTo(this.model, "change", this.modelChanged);
		var configElem = $("<div class='sectionConfigDiv'></div>");
		this.$el.append(configElem);
		new SectionConfigViewEditable({model : this.model.get("config"), el : configElem });		
		var realthis = this;
		this.model.get("properties").each(function(property){
			var propElem = $("<div class='properyDiv'></div>");
			realthis.$el.append(propElem);			
			new PropertyViewEditable({model : property, el : propElem, parent : realthis});
		});
		this.render();
	},

	render : function (){

		//$(this.propertyViews).each(function(index, propertyView){propertyView.render()});
		
	},

	modelChanged : function(){
		this.render();

	}	

});



var SectionConfigViewEditable = Backbone.View.extend ({

	ident : "SectionConfigViewEditable",
	tagName : "div",

// look at this: http://stackoverflow.com/questions/6353607/backbone-js-structuring-nested-views-and-models
	initialize : function(){
		this.listenTo(this.model, "change", this.modelChanged);
		this.render();
	},

	render : function (){
		//this.$el.html("the html for the entity goes here");
		return this;
	},

	modelChanged : function(){
		this.render();
	}

});


var PropertyViewEditable = Backbone.View.extend ({
	ident: "PropertyViewEditable",
	tagName : "div",
	events : {


	},

	initialize : function(){

		var configElem = $("<div class='propertyConfigDiv'></div>");
		this.$el.append(configElem);
		new PropertyConfigViewEditable({model : this.model.get("config"), el : configElem });	

		this.listenTo(this.model, "change", this.modelChanged);
		this.render();
	},

	render: function(){

		var msg = this.model.get("config").get("name");
		msg += this.model.get("value");
		this.$el.html("the html for the property goes here : " +msg);
		return this;
	},

	modelChanged : function(){
		this.render();

	}

});


var PropertyConfigViewEditable = Backbone.View.extend ({

	ident : "PropertyConfigViewEditable",
	tagName : "div",

// look at this: http://stackoverflow.com/questions/6353607/backbone-js-structuring-nested-views-and-models
	initialize : function(){
		this.listenTo(this.model, "change", this.modelChanged);
		this.render();
	},

	render : function (){
		//this.$el.html("the html for the entity goes here");
		return this;
	},

	modelChanged : function(){
		this.render();
	}

});