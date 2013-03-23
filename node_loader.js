/* 

alternativemethod for development
- get a good method for adding sections to the page, editing the config and storing it

and then start adding config bits ad-hoc to avoid over-planning

make it an exercise in learning dijit and mongo/couch.



the idea being, that you hit the node server with a request,
and the server parses the url, and loads necessary config and data portions as it traverses the url.

not entirely sure how this should work yet.

The overall goal of the app is:
- easy to create a front-end client that lets you add service components to a node type
- easy to reuse those service components for a variety of views.
- data from services is stored locally, but refreshed, or re-retrieved, as needed.
- easy to tie into indexing systems
- new nodes created when they are referenced, so the data collection builds itself out in the background?
- should be able to apply configs to entire enitities or sections, 
  or just to sub-groups of entities or sections, based on some matching criteria
- mostly the same code used on client and server


config data for a node type:
- how the unique ID is constructed - chicken and egg?
- description of the entity type
- unique human-readable name
- unique script name
- available display formats
-- if a display format is selected for a node type, then all the sections will use that same display format.
- sections 


each section 
- sections are generally a set of data pulled from a webservice, then (optionally) transformed, formatted and displayed
- we want easy default behaviours for sections, that can then be modified by configs
-- eg, show ALL the data from a service, key-value style. Then allow user to de-select certain pieces, or change formatting as required
- sections may have sub-sections, and may call OTHER services.
- in constructing the URL, and other display scenarios, sections need access to the data values in OTHER sections
-- maybe just in PARENT sections?
- data is stored locally, but refreshes can be configured.

section config:
- data source url
- display formats available
- refresh metadata


display formats
- things like :
-- html
-- lido_xml
-- generic_xml
-- json


entity (has a url)
- section (has a url)
-- the data to display in that section, and how to parse, process and format it 
   (part of url, has a default)
   - and storage mechanism
   - defined in config
--- the ways that data can be displayed or delivered (xml, lido, json, html, etc) 
    (part of url, has a default)
    - and caching mechanism
    - defined with templates, and/or config
    - some of those formats are globally defined, and you get them for free


eg config
{
	name : 'art object',
	script_name : 'art_object',
	description : 'A Met Art Object',
	url_match : |^object/[0-9a-zA-Z:]+|,
	display_formats : [
		'json','generic_xml','html','lido_xml'
	],
	default_display_format : 'html',
	url_data : [
		{ 
			token_name : 'database'
			regex : |^object/([0-9a-zA-Z]+):[0-9a-zA-Z]+/|}
		},
		{ 
			token_name : 'objectid'
			regex : |^object/[0-9a-zA-Z]+:([0-9a-zA-Z]+)/|}
		}
	],
		
	
	sections : [
		{
			name : 'tombstone',
			script_name : 'object_tombstone',
			url_match : |^/tombstone|,
			display_formats : [
				'json','generic_xml','html','lido_xml'
			],
			default_display_format : 'html',
			data_source : {
				url :'http://data.metmuseum.org/get_object_tombstone?objectid={{parent:objectid}}&db={{parent:database}}',
				response_format : 'xml',
			},
			include_only_elements : [
				'//results/result/ObjectName'
			],
			exclude_only_elements : [
				'//'
			]

		}

	]


}

eg entity instance config
{
	

}








*/