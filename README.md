Statistical Learning
=====================

Proof of concept demonstration for generating custom infographics, built in javascript using node.js, angular.js, d3.js and GraphicsMagick.

- http://statistical-learning.jamesmcguigan.com - live demo with unminified sources
- https://production.statistical-learning.jamesmcguigan.com - live SSL demo with minified js/css

Installation
============
<pre><code># packagemanager install node
git clone git@github.com:JamesMcGuigan/statistical-learning.git
cd statistical-learning
npm install  # will also download bower dependencies and compile the client side browserify.js file
npm start    # runs nodemon and compass for development

# For production deployment
npm run production  # compiles minified js/css into ./production/
node Server.js NODE_ENV=production PORT_HTTP=4000 PORT_HTTPS=4001
</code></pre>

Then open up the following localhost url
http://localhost:4000/

See [package.json](https://github.com/JamesMcGuigan/statistical-learning/blob/master/package.json) for a list of other project npm scripts


Puppet configuration
====================

Demo server deployment is managed via puppet using the following project:  
https://github.com/JamesMcGuigan/puppet-config


Project Layout
==============

- [/app/config/config.js](https://github.com/JamesMcGuigan/statistical-learning/tree/master/app/config/config.js) - Node configuration file
- [/app/controllers/](https://github.com/JamesMcGuigan/statistical-learning/tree/master/app/controllers/) - Node API logic
- [/app/server/routes/](https://github.com/JamesMcGuigan/statistical-learning/tree/master/app/server/routes/) - Node URL routing
- [/app/server/views/](https://github.com/JamesMcGuigan/statistical-learning/tree/master/app/server/views/) - Mustache templates for generating initial HTML page
- [/app/public/scss-src/](https://github.com/JamesMcGuigan/statistical-learning/tree/master/app/public/scss-src/) - SASS source files
- [/app/public/scss/](https://github.com/JamesMcGuigan/statistical-learning/tree/master/app/public/scss/) - Compiled SASS -> CSS
- [/app/public/html/](https://github.com/JamesMcGuigan/statistical-learning/tree/master/app/public/html/) - Angular HTML Snippits
- [/app/public/angular/](https://github.com/JamesMcGuigan/statistical-learning/tree/master/app/public/angular/) - Angular.js Application
