services_rendered
=================

a project for integrating and displaying data from webservices. 


Goals:
- ultimately all the adding of services, defining data packages, layout, happens on the client
- auto-indexing of data to indexers like SOLR
- storage of configs in mongo, couch, or other NoSQL db
- storage of cached service data in NoSQL
- runs client or server-side
- developing on it has to be FUN. Need to see useful things soon before I get bored.



TODOs:
- set up NoSQL backend
- retreive/editing/store json config data from browser
- binding html elements to data bits, stored in NoSQL
- url processing mechanism - determine page to display from path/url vars
- sensible architecture
- page generation from config data
- NoSQL Caching of data
- indexing in solr
- look at https://github.com/nodejitsu/node-http-proxy
- look at http://writings.nunojob.com/2011/08/nano-minimalistic-couchdb-client-for-nodejs.html


ARCHITECTURE:
- configs
-- define external data sources
-- define data types (aggregations of service calls and fields from those services)
-- define entity types (aggregations of data types, displayed in a particular way)
-- define view types (types of display of entities, or data types)
- templates
-- generic enough to be apply broadly to all views of same type, but can be overridden for particular entities or data types
