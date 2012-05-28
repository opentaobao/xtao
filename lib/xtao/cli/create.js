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
 * | 		|		|		|--config.html
 * | 		|		|		|--preview.html
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

, "iframe": [
					'<!doctype html>'
				, '<html>'
				, '	<head>'
				, '		<meta charset="utf-8">'
				, '		<title>{{widgetName}} Iframe Page</title>'
				, '	</head>'
				, '	<body>'
				, '		<div id="page">'
				, '		</div>'
				, '	</body>'
				, '</html>'
			].join(u.getEOL())

, "config": [
						'{'
					, 	'  "name": "{{widgetName}}"'
					, 	', "description": "This is widget {{widgetName}}"'
					, 	', "ui": {'
					, 	'    "groups": ['
					, 	'      {"key": "basic", "label": "Basic Settings"}'
					, 	'    , {"key": "advanced", "label": "Advanced Settings"}'
					,   '    ]'
					,   '  }'
					,   ', "options": {'
					,   '			"container": {'
					,   '				"type": "String"'
					,   '			, "default": ".container"'
					,   '			, "label": "Container"'
					,   '			, "tips": "Help information for this option"'
					,   '			, "required": false'
					,   '			, "group": "basic"'
					,		'			}'
					,   '		, "position": {'
					,   '				"type": "Selection"'
					,   '			, "default": "top"'
					,   '			, "values": ['
					,   '					{"key": "top", "label": "Top"}'
					,   '				, {"key": "bottom", "label": "Bottom"}'
					,   '				]'
					,   '			, "label": "Position"'
					,   '			, "tips": "Position of the widget"'
					,   '			, "required": false'
					,   '			, "group": "advanced"'
					,		'			}'
					,   '		, "showTooltip": {'
					,   '				"type": "Boolean"'
					,   '			, "default": false'
					,   '			, "label": "Tooltip"'
					,   '			, "description": "Show the tooltip"'
					,   '			, "tips": "Help information for tooltip"'
					,   '			, "required": false'
					,   '			, "group": "basic"'
					,		'			}'
					,		'	 	}'
					, '}'
					].join(u.getEOL())
, "demo-js": [
					'/**' 
				, ' * JavaScript for demo both in development and production environment'
				, ' * '
				, ' */'
				, ' ;(function(win, undefined){'
				, ' 	var $ = win.$'
				, ' 		, X = win.XTAO;'
				, ''
				, ' 	$("#config-form").submit(function(e){'
				, ' 		e.preventDefault();'
				, ''
				, ' 		var cfg = X.getConfigurations();'
				, ' 		TOP.ui("{{widgetName}}", cfg);'
				, ' 	});'
				, ' })(window);'
				].join(u.getEOL())
, "demo-css": [
								'/* CSS for demo both in development and production environment */'
							].join(u.getEOL())

, "config-html": [
									'<!-- Write your config html code here -->'
							 ].join(u.getEOL())

, "preview-html": [
									'<!-- Write your preview html code here -->'
							 ].join(u.getEOL())
};

var widgetName;

function create(path, version, hasIframe){
	var widgetRoot = p.join(path, version);
	widgetName = path;
	u.emptyDirectory(widgetRoot, function(empty){
		if(empty){
			createApplicationAt(widgetRoot, hasIframe);
		}else{
			program.confirm('destination is not empty, continue?(yes|no)', function(ok){
				if(!ok){
					return u.abort();
				}
				createApplicationAt(widgetRoot, hasIframe);
				process.stdin.destroy();
			});
		}
	});
};

function createApplicationAt(path, hasIframe){
	u.mkdir(path, function(dir){
		u.mkdir(p.join(path, 'assets'), function(dir){
			u.write(p.join(dir, widgetName + '.css'), 
								tpls.css.replace(/{{widgetName}}/g, widgetName));
		});
		u.mkdir(p.join(path, 'demo'), function(dir){
			u.mkdir(p.join(dir, 'src'), function(dir){
				['demo.js', 'demo.css', 'config.html', 'preview.html'].forEach(function(file){
					u.write(p.join(dir, file),
									tpls[file.replace(/\./, '-')].replace(/{{widgetName}}/g, widgetName));
				});
			})
		});

		u.write(p.join(dir, widgetName + '.js'), 
								tpls.js.replace(/{{widgetName}}/g, widgetName));
		u.write(p.join(dir, 'config.json'),
								tpls.config.replace(/{{widgetName}}/g, widgetName));

		if(hasIframe){
			u.write(p.join(dir, widgetName + '.html'),
								tpls.iframe.replace(/{{widgetName}}/g, widgetName));
		}
	});
};


module.exports = create;