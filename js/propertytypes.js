/*
need a factory method for implementing types


works something like this:

function imageType(options){
	
	

}

*/


var abstractPropertyFactory = (function(){
	var types = {};

 	var defaultType = PropertyViewEditable;

	return {
		registerPropertyType : function(typeString, type){

			types[typeString] = type;
			return abstractPropertyFactory;

		},

		getProperty : function(typeString, options){
			var propertyType = types[typeString];

			console.log("type is ");
			console.log(propertyType);
			if(propertyType){
				console.log("trying");
				var newthing = new imageView();
				console.log("new");
				console.log(newthing);

			}
			return (propertyType) ?  new propertyType(options) : null;

		}
	}; 


})();

var imageView = Backbone.View.extend({

	somfunc : function(){
		console.log("in new func");

	},

	events : {


	},

	initialize : function(){
		if(this.model){
			this.listenTo(this.model, "change", this.render);
		}
	},

	setModel : function (model){
		this.listenTo(this.model, "change", this.render);


	},

	render: function(){
		this.$el.html("the html for the sectionproperty goes here");
		return this;
	}


});

/*
var newview2 = new imageView();

console.log("newview is ");
console.log(newview2);

abstractPropertyFactory.registerPropertyType("imageView", imageView);

var newview = abstractPropertyFactory.getProperty("imageView", {});
*/
/*
newview.somefunc();
*/



/*usage:

function imageType(options){

	this default = "foo";

	this.somefunc = function(vars){
		console.log("in imageType somefunc")/;

	}

}



*/


