/*
 TODO :
 make initial version, in raw code, for basic entity, sections, properties, and configs.
 Implement Templates for teh views
 Use decorators, or factories, or something, so that new types of views can be created.

*/



var EntityViewEditable = Backbone.View.extend ({

	ident : "EntityViewEditable",
	tagName : "div",

	configElem : null,
	contentElem: null,
	sectionsElem: null,


// look at this: http://stackoverflow.com/questions/6353607/backbone-js-structuring-nested-views-and-models
	initialize : function(args){
		console.log(args);


		// the config element, should be hidable, default hidden
		if(args.configElem == null){
			this.configElem = $("<div class='entityConfigDiv'></div>");
			this.$el.append(this.configElem);
		}else{
			this.configElem = args.configElem;
		}
		if(args.contentElem == null){
			this.contentElem = $("<div class='entityContentDiv'></div>");
			this.$el.append(this.contentElem);
		}else{
			this.contentElem = args.contentElem;
		}

		this.sectionsElem = $("<div class='entitySectionsDiv centerPanel'  data-dojo-type='dijit/layout/TabContainer'  data-dojo-props=\"region: 'center', tabPosition: 'top'\"></div>");

		/*
<div class="centerPanel goldsearch"  id="goldsearch"
                data-dojo-type="dijit/layout/TabContainer"
                data-dojo-props="region: 'center', tabPosition: 'top'">
		*/
		this.$el.append(this.sectionsElem);
		new EntityConfigViewEditable({model : this.model.get("config"), el : this.configElem });

		// building up the sections

		this.listenTo(this.model, "change", this.modelChanged);
		this.listenTo(this.model.get("config"), "change", this.modelChanged);	

		this.render();
	},

	render : function (){
		//this.$el.html("the html for the entity goes here");
		var id = this.model.get("_id");
		console.log(this.contentElem);
		this.contentElem.html("id: " +id);
		this.sectionsElem.empty();
		var realthis = this;
		this.model.get("sections").each(function(section){
			var sectionElem = $("<div class='sectionDiv' data-dojo-type='dijit/layout/ContentPane' data-dojo-props=\"title: 'Group 1'\"></div>");
			realthis.sectionsElem.append(sectionElem);
			new SectionViewEditable({model : section, el : sectionElem, parent : realthis});
		});		
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
	contentElem : null,
	configElem : null,
	propertiesElem : null,

	initialize : function(){
		this.configElem = $("<div class='sectionConfigDiv'></div>");
		this.contentElem = $("<div class='sectionContentDiv'></div>");
		this.propertiesElem = $("<div class='sectionPropertiesDiv'></div>");
		this.$el.append(this.contentElem);
		this.$el.append(this.propertiesElem);
		this.$el.append(this.configElem);
		new SectionConfigViewEditable({model : this.model.get("config"), el : this.configElem });	
		this.listenTo(this.model, "change", this.modelChanged);
		this.listenTo(this.model.get("config"), "change", this.modelChanged);	

		this.render();
	},


	render : function (){
		var realthis = this;
		this.propertiesElem.empty();
		this.model.get("properties").each(function(property){
			var propElem = $("<div class='properyDiv'>"+Math.random(100)+"</div>");
			realthis.propertiesElem.append(propElem);			
			new PropertyViewEditable({model : property, el : propElem, parent : realthis});
		});

		var name = this.model.get("config").get("name");
		this.contentElem.html(name);
		return this;
		//$(this.propertyViews).each(function(index, propertyView){propertyView.render()});
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

		// build up dijit form that's editable
		var configSpan = $("<span class='entityConfigLink'>eC</span>");
		var realthis = this;
		this.editDiv = $("<div class='entityConfigEdit'>");

		var configForm = $("<form>");
		this.editDiv.append(configForm);
//		configForm.append("name:<input type='text' name = 'name' value='"+this.model.get("name")+"' />");

		var addSectionDiv = $("<span>add Section</span>");
		this.editDiv.append(addSectionDiv);
		addSectionDiv.click(function(){
			console.log("adding sectionConfig");
			realthis.model.addSectionConfig();
		});


		configForm.change(function(changed){
			console.log(changed.target.name);
			realthis.model.set(changed.target.name, changed.target.value);
		});

		this.editDiv.hide();
		var realthis = this;
		configSpan.click(function(){realthis.editDiv.toggle();});

		this.$el.append(configSpan);
		this.$el.append(this.editDiv);

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






var SectionConfigViewEditable = Backbone.View.extend ({

	ident : "SectionConfigViewEditable",
	tagName : "div",
	editDiv : null,

// look at this: http://stackoverflow.com/questions/6353607/backbone-js-structuring-nested-views-and-models
	initialize : function(){
		var configSpan = $("<span class='sectionConfigLink'>sC</span>");
		var realthis = this;
		this.editDiv = $("<div class='sectionConfigEdit'>");

		var configForm = $("<form>");
		this.editDiv.append(configForm);
		configForm.append("name:<input type='text' name = 'name' value='"+this.model.get("name")+"' />");

		if(this.model.get("service")){
			configForm.append("uri: <input  type='text'  name = 'uri' value='"+this.model.get("service").get("uri")+"' />");
		}
		var addPropDiv = $("<span>add Property</span>");
		this.editDiv.append(addPropDiv);
		addPropDiv.click(function(){
			realthis.model.addPropertyConfig();
		});


		configForm.change(function(changed){
			console.log(changed.target.name);
			realthis.model.set(changed.target.name, changed.target.value);
		});

		this.editDiv.hide();
		var realthis = this;
		configSpan.click(function(){realthis.editDiv.toggle();});

		this.$el.append(configSpan);
		this.$el.append(this.editDiv);


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
	contentElem : null,
	events : {


	},

	initialize : function(){

		var configElem = $("<div class='propertyConfigDiv'></div>");
		this.contentElem = $("<div class='propertyContentDiv'></div>")
		this.$el.append(this.contentElem);
		this.$el.append(configElem);
		new PropertyConfigViewEditable({model : this.model.get("config"), el : configElem });	

		this.listenTo(this.model, "change", this.modelChanged);
		this.listenTo(this.model.get("config"), "change", this.modelChanged);
		this.render();
	},

	render: function(){

		var msg = this.model.get("config").get("name") + " :  ";
		msg += this.model.get("value");
		this.contentElem.html("property : " + msg);
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

		var configSpan = $("<span class='propertyConfigLink'>pC</span>");
		this.editDiv = $("<div class='propertyConfigEdit'>");

		var configForm = $("<form>");

		this.editDiv.append(configForm);
		configForm.append("name:<input type='text' name = 'name' value='"+this.model.get("name")+"' />");
		configForm.append("type:<input type='text' name = 'uri' value='"+this.model.get("type")+"' />");

		var realthis = this;
		configForm.change(function(changed){
			console.log(changed.target.name);
			realthis.model.set(changed.target.name, changed.target.value);
		});

		this.editDiv.hide();
		var realthis = this;
		configSpan.click(function(){realthis.editDiv.toggle();});

		this.$el.append(configSpan);
		this.$el.append(this.editDiv);


		this.listenTo(this.model, "change", this.modelChanged);
		this.render();


		this.render();
	},

	render : function (){
		//this.$el.html("the html for the propertyconfig goes here");

		return this;


	},

	modelChanged : function(){
		this.render();
	}

});