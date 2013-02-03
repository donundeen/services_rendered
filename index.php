<!DOCTYPE html>
<html>
  <head>
    <title>Bootstrap 101 Template</title>
    <!-- Bootstrap -->
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
    <script src="doT/doT.js"></script>
    <script src="ed_template.js"></script>
    <script src="js-tables/jpath.js"></script>
    <script type="text/javascript">
$().ready(function(){

  var engine = createEngine(window.document);

  var result = engine.processTemplates();
 
});
    </script>
  </head>
  <body>
<div class="template" 
datasrc="http://www.vam.ac.uk/api/json/museumobject/?q=medieval&materialsearch=gold&images=1" 
type="json"
>
<ul>
{{~ it.records :record:index}}
<li>{{=record.fields.object_number}} : http://www.vam.ac.uk/api/json/museumobject/{{=record.fields.object_number}}
<div class="template" 
datasrc="http://www.vam.ac.uk/api/json/museumobject/{{=record.fields.object_number}}"
type="json">
:
{{=it[0].fields.museum_number}}
  :
</div>

</li>
{{~}}

</ul>

</div>

    <div class="container-fluid">
  		<div class="row-fluid">
    		<div class="span2">
    			sidebar
		      <!--Sidebar content-->
    		</div>
		    <div class="span10">
		    	bodyx
      		<!--Body content-->
		    </div>
		</div>
	</div>
  </body>
</html>