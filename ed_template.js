var _ed_template_mode="client";
if(typeof module !== 'undefined'){
	// if we're running server-side, this stuff needs to happen.
	module.exports.createEngine = createEngine;
	var $ = require('jquery');
	var jQuery = $;
	var doT = require('dot');
	_ed_template_mode= 'server';
}else{
	// we're running client-side, and need a different way to include the necessary code.
}



$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results == null)
      return "";
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
});



function createEngine(doc, vars){

	var options = {
		doc : doc, // is a jquery object
		vars : vars
	};
	return new templateEngine(options);
}

var templateEngine= function(options) {
	this.doc = options.doc || null;
	this.vars = options.vars;
	this.outstandingTasks = 0; // since it's all threaded and whatnot.
  this.end_function = false;
}

templateEngine.prototype.foo = function(){
	return "hi there" + this.doc;

}

templateEngine.prototype.getResults = function(){
  return this.doc;
}


templateEngine.prototype.processTemplate = function(template){
  var thisObj = this;
    var dataurl = $(template).attr("datasrc");
    var proxyurl = "http://localhost/services_rendered/proxy.php";

    // escape inner templates
    $(".template", template).html(function(index, oldHtml){
      return oldHtml.replace("{{", "^^^^^");
    });

    $.ajax({
      url : proxyurl,
      data : {
        //url: objJsonUrl,
        url: dataurl,
        
        //cache : "true",
        
        //cachefail : "OVER_QUERY_LIMIT"
        
      },
      error : function(retdata){
      	console.log("failure");

      },
      success : function (retdata){
       // console.log("|"+retdata+"|");
        if(retdata == ''){
          return true;
        }
        console.log("parsting");
        console.log(retdata);
        retdata = jQuery.parseJSON(retdata);
        console.log("parsed");
       // console.log(retdata);
        var tpl = doT.template($(template).html());
       // console.log(tpl);
        var results = tpl(retdata);

        $(template).html(results);

        // now do sub-templates
        $set = $(".template", template).filter(function(){
          return $(this).parentsUntil(template, ".template").length < 1;
        });
		    thisObj.outstandingTasks += $set.length;
		    //console.log("add" + thisObj.outstandingTasks);
        $set.each(function(index, element2){
          
          $(element2).html(function(index, oldHtml){
            return oldHtml.replace("^^^^^", "{{");
          });
          thisObj.processTemplate(element2);
        });
        thisObj.outstandingTasks--;


        if(thisObj.outstandingTasks == 0){
          if(thisObj.end_function){
            thisObj.end_function();
          }else{
          }

        }
      }
    });


}

templateEngine.prototype.onEnd = function(end_function){
  this.end_function = end_function;
}

templateEngine.prototype.processTemplates = function(){
    console.log("starting");
  
  var thisObj = this;

  $set = $(".template", this.doc).filter(function(){
    return $(this).parents(".template", this.doc).length < 1;
  });

  console.log("set " + $set.length);


  if($set.length == 0){

    if(thisObj.end_function){
      thisObj.end_function();
    }else{
    }
  }

  thisObj.outstandingTasks += $set.length;

  $set.each(function(index, element){

    thisObj.processTemplate(element);
  });
 
//  console.log(this.outstandingTasks);

  return;
}

