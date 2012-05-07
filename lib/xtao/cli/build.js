/**
 * Build the widget demo
 *  - generate demo/src/demo.html
 * 	- generate demo/widgetName-development.html
 *  - generate demo/widgetName-production.html
 *  - generate demo/widgetName-publication.html
 */

var fs = require('fs')
	, path = require('path')
	, doT = require('dot')
	, u = require('../utils')
	, ui = require('../ui-helper')
	, config = require('../config')
	, configDevelopement = config.development
	, configProduction = config.production
	, configPublication = config.publication;

var demoRoot = process.cwd()
	, root = path.join(__dirname, '..')
	, tplRoot = path.join(root, 'tpl')
	, demoConfigPath = path.join(demoRoot, 'config.json')
	, demoHTMLPath = path.join(demoRoot, 'demo', 'src', 'demo.html')

	, OPTIONS_TYPE = {
			"STRING": "String" //text
		, "SELECTION": "Selection" //[a|b|c]
		, "BOOLEAN": "Boolean" //[true|false]
		};



/**
 * Build demo file for development and production environment
 * If isAll is set, demo file for publication environment will be built as well
 *
 * @param {Boolean} isAll Need to build demos for all of the three environments
 * @param {Boolean} force force building demo.html 
 * @api public 
 */
function build(isAll, force){
	if(force || !isDemoHTMLModified()){
		buildConfig(demoConfigPath);
	}
	var list = [
		{
			fileName: 'demo-development.html'
		, config: configDevelopement
		}
	, {
			fileName: 'demo-production.html'
		, config: configProduction
		}
	];
	
	isAll && list.push({
		fileName: 'demo-publication.html'
	, config: configPublication
	});

	buildDemo(list);
};	

/**
 * src/demo.html is created with only comments at the first time(racoon create ...)
 * 
 */
function isDemoHTMLModified(){
	return u.read(demoHTMLPath).length !== 34;
};

function buildConfig(configPath){
	var widgetConfig = JSON.parse(u.read(configPath))
		, widgetName = widgetConfig.name
		, options = widgetConfig.options
		, optionsui = []
		, demoHTMLContent
		, demoConfigFilePath = demoHTMLPath
		, cfg = { //cfg data
				name: widgetName
			, options: {}
			} 
		, cfgOptions = cfg.options;

	for(var p in options){
		var option = options[p]
			, type = option.type || 'String'
			, label = (option.required ? p + '(必填)' : p) + ":";
		switch(type){
			case OPTIONS_TYPE.STRING:
				optionsui.push(ui.generateInputOption({
					key: p
				, label: label
				, default: option.default
				, help: option.description
				}));
				cfgOptions[p] = option.hasOwnProperty('default') ? option.default : '';
				break;
			case OPTIONS_TYPE.SELECTION:
				optionsui.push(ui.generateListOption({
					key: p
				, label: label
				, options: option.options
				, help: option.description
				}));
				cfgOptions[p] = option.hasOwnProperty('default') ? option.default : option.options[0];
				break;
			case OPTIONS_TYPE.BOOLEAN:
				optionsui.push(ui.generateCheckboxOption({
					key: p
				, label: label
				, description: option.description
				, help: option.description
				}));
				cfgOptions[p] = option.hasOwnProperty('default') ? option.default : false;
				break;
			default:
				cfgOptions[p] = option.hasOwnProperty('default') ? option.default : '';
				break;
		}
	};

	//write config file into src/demo.html
	doT.templateSettings.strip = false;
	demoHTMLContent = doT.template(u.read(path.join(tplRoot, 'config.html.dot')))({
		title: widgetName
	, description: 'demo for ' + widgetName
	, options: optionsui.join(u.getEOL())
	, cfg: JSON.stringify(cfg)
	});

	u.write(demoConfigFilePath, demoHTMLContent);
};

function buildDemo(list){
	if(!list || 0 === list.length){ return; }

	var demoConfigPath = path.join(demoRoot, 'config.json');

	fs.stat(demoConfigPath, function(err, status){
		if(err){ u.abort(err.message); }

		var demoPath = path.join(demoRoot, 'demo')
			, demoSrcPath = path.join(demoPath, 'src')
			, demoCSSPath = path.join(demoSrcPath, 'demo.css')
			, demoJSPath = path.join(demoSrcPath, 'demo.js')
			, demoHTMLPath = path.join(demoSrcPath, 'demo.html')
			, tplDemoPath = path.join(tplRoot, 'demo.html.dot')

			, tplDemoContent
			, demoHTMLContent
			, demoCSSContent
			, demoJSContent

			, tplDemoFn;

		tplDemoContent = u.read(tplDemoPath);
		demoHTMLContent = u.read(demoHTMLPath);
		demoCSSContent = u.read(demoCSSPath);
		demoJSContent = u.read(demoJSPath);

		doT.templateSettings.strip = false;
		tplDemoFn = doT.template(tplDemoContent);

		//write list
		list.forEach(function(item){
			var itemConfig = item.config;
			u.write(path.join(demoPath, item.fileName), tplDemoFn({
				title: item.fileName.replace(/\.html$/,'')
			, css: demoCSSContent
			, html: demoHTMLContent
			, sdkUrl: itemConfig.sdkUrl
			, key: itemConfig.key
			, secret: itemConfig.secret
			, hostname: itemConfig.hostname
			, channelUrl: itemConfig.channelUrl
			, js: demoJSContent
			}));
		});
	});
};

module.exports =  build;