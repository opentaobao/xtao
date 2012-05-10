/**
 * Create a new widget with the following structure
 * 
 * WidgetName
 * |
 * |--Version 
 * |		|--assets
 * |		|		|--WidgetName.css
 * |		|--demo
 * |		|		|--src
 * |		|		|		|--demo.js
 * | 		|		|		|--demo.css
 * | 		|		|		|--demo.html
 * | 		|		|
 * |		|		|--WidgetName-development.html
 * |		|		|--WidgetName-production.html
 * |		|--WidgetName.js
 * |    |--config.json
 */

var program = require('commander')
	, p = require('path')
	, u = require('../utils');

var tpls = {
	"css": [
					'/* CSS for {{widgetName}} */'
				, '/* your css code here */'
			 ].join(u.getEOL())
, "js": [
					'/* JavaScript for {{widgetName}} */'
				, ';(function(win, undefined){'
				, '  var doc = win.document'
				, '	 	 , TOP = win.TOP;'
				, ''
				, '	 /* your code here */'
				, '})(window);'
			].join(u.getEOL())

, "config": [
						'{'
					, 	'	 "name": "{{widgetName}}"'
					, 	', "description": "This is widget {{widgetName}}"'
					, 	', "ui": {'
					, 	'    "groups": {'
					, 	'      "groupname": {"label": "text"}'
					,   '    }'
					,   '  }'
					,   ', "options": {'
					,   '			"option_key": {'
					,   '				"type": "String|Selection|Boolean"'
					,   '			, "default": "Only support for String type"'
					,   '			, "label": "text"'
					,   '			, "description": "Description of this option"'
					,   '			, "required": false'
					,   '			, "group": "group name"'
					,		'			}'
					,		'	 	}'
					, '}'
					].join(u.getEOL())
, "demo-js": [
					'/**' 
				, ' * JavaScript for demo both in development and production environment'
				, ' * '
				, ' * !Attention: '
				, ' * 	This file will be merged into {{widgetName}}-development.html'
				, ' * 	and {{widgetName}}-production.html when you run `racoon build` command'
				, ' */'
				, ' ;(function(win, undefined){'
				, ' 	var $ = win.$'
				, ' 		, R = win.Racoon;'
				, ''
				, ' 	$("#config-form").submit(function(e){'
				, ' 		e.preventDefault();'
				, ''
				, ' 		var cfg = Racoon.getConfigurations();'
				, ' 		TOP.ui("{{widgetName}}", cfg);'
				, ' 	});'
				, ' })(window);'
				].join(u.getEOL())
, "demo-css": [
								'/* CSS for demo both in development and production environment */'
							, '/* !Attention: */'
							, '/* 	This file will be merged into {{widgetName}}-development.html and {{widgetName}}-production.html when you run `racoon build` command */'
							].join(u.getEOL())

, "demo-html": [
									'<!-- Write your html code here -->'
							 ].join(u.getEOL())
};

var widgetName;

function create(path, version){
	var widgetRoot = p.join(path, version);
	widgetName = path;
	u.emptyDirectory(widgetRoot, function(empty){
		if(empty){
			createApplicationAt(widgetRoot);
		}else{
			program.confirm('destination is not empty, continue?(yes|no)', function(ok){
				if(!ok){
					return u.abort();
				}
				createApplicationAt(widgetRoot);
				process.stdin.destroy();
			});
		}
	});
};

function createApplicationAt(path){
	u.mkdir(path, function(dir){
		u.mkdir(p.join(path, 'assets'), function(dir){
			u.write(p.join(dir, widgetName + '.css'), 
								tpls.css.replace(/{{widgetName}}/g, widgetName));
		});
		u.mkdir(p.join(path, 'demo'), function(dir){
			u.mkdir(p.join(dir, 'src'), function(dir){
				['demo.js', 'demo.css', 'demo.html'].forEach(function(file){
					u.write(p.join(dir, file),
									tpls[file.replace(/\./, '-')].replace(/{{widgetName}}/g, widgetName));
				});
			})
		});

		u.write(p.join(dir, widgetName + '.js'), 
								tpls.js.replace(/{{widgetName}}/g, widgetName));
		u.write(p.join(dir, 'config.json'),
								tpls.config.replace(/{{widgetName}}/g, widgetName));
	});
};


module.exports = create;