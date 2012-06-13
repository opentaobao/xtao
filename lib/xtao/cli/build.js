/**
 * Build the widget demo
 *  - generate demo/src/demo.html
 *  - generate demo/widgetName-development.html
 *  - generate demo/widgetName-production.html
 *  - generate demo/widgetName-publication.html
 */

var fs = require('fs'),
    path = require('path'),
    doT = require('dot'),
    u = require('../utils'),
    ui = require('../ui-helper'),
    config = require('../config'),
    configDevelopement = config.development,
    configProduction = config.production,
    configPublication = config.publication;

var demoRoot = process.cwd(),
    root = path.join(__dirname, '..'),
    tplRootPath = path.join(root, 'tpl'),
    configJSONPath = path.join(demoRoot, 'config.json'),
    demoConfigHTMLPath = path.join(demoRoot, 'demo', 'src', 'config.html'),
    demoPreviewHTMLPath = path.join(demoRoot, 'demo', 'src', 'preview.html'),

    OPTIONS_TYPE = {
        "STRING": "String", //text
        "SELECTION": "Selection", //[a|b|c]
        "BOOLEAN": "Boolean" //[true|false]
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
    if(force || !isFileModified(demoConfigHTMLPath,41)){
        buildConfig(configJSONPath);
    }

    if(force || !isFileModified(demoPreviewHTMLPath, 42)){
        buildPreview(configJSONPath);
    }

    var list = [
        {
            fileName: 'demo-dev.html',
            config: configDevelopement
        },
        {
            fileName: 'demo-pro.html',
            config: configProduction
        }
    ];
    
    isAll && list.push({
        fileName: 'demo.html',
        config: configPublication
    });

    buildDemo(list);
};  

/**
 * src/demo.html is created with only comments at the first time(racoon create ...)
 * 
 */
function isFileModified(filename, len){
    var content = u.read(filename);
    return content.length !== len;
};

function buildConfig(configPath){
    var widgetConfig = JSON.parse(u.read(configPath)),
        widgetName = widgetConfig.name,
        widgetDescription = widgetConfig.description,
        options = widgetConfig.options,
        wui = widgetConfig.ui,
        groups = wui ? wui.groups : [],
        demoConfigHTMLContent,
        demoConfigFilePath = demoConfigHTMLPath,
        cfg = {
            name: widgetName,
            options: {}
        }, 
        cfgOptions = cfg.options,
        allOptionsUI = [];

    //groups []
    var groupsui = _buildGroups(groups);

    //options
    for(var p in options){
        var option = options[p],
            type = option.type || 'String',
            label = option.label || p,
            label = (option.required ? label + '(必填)' : label) + ":",
            tips = option.tips,
            group = option.group || "default",
            optionsui = _findGroup(groupsui, group).uiBuffer;

        switch(type){
            case OPTIONS_TYPE.STRING:
                optionsui.push(ui.generateInputOption({
                    key: p,
                    label: label,
                    default: option.default,
                    help: tips
                }));
                cfgOptions[p] = option.hasOwnProperty('default') ? option.default : '';
                break;
            case OPTIONS_TYPE.SELECTION:
                optionsui.push(ui.generateListOption({
                    key: p,
                    label: label,
                    options: option.values,
                    default: option.default,
                    help: tips
                }));
                cfgOptions[p] = option.hasOwnProperty('default') ? option.default : option.values[0];
                break;
            case OPTIONS_TYPE.BOOLEAN:
                optionsui.push(ui.generateCheckboxOption({
                    key: p,
                    label: label,
                    description: option.description,
                    help: tips
                }));
                cfgOptions[p] = option.hasOwnProperty('default') ? option.default : false;
                break;
            default:
                cfgOptions[p] = option.hasOwnProperty('default') ? option.default : '';
                break;
        }
    };

    //concat all the options ui
    for(var j = 0, len = groupsui.length; j<len; j++){
        allOptionsUI = allOptionsUI.concat(groupsui[j].uiBuffer);
    }

    //write config file into src/demo.html
    doT.templateSettings.strip = false;
    demoConfigHTMLContent = doT.template(u.read(path.join(tplRootPath, 'config.html.dot')))({
        options: allOptionsUI.join(u.getEOL()),
        cfg: JSON.stringify(cfg)
    });

    u.write(demoConfigHTMLPath, demoConfigHTMLContent);
};


function buildPreview(configPath){
    var widgetConfig = JSON.parse(u.read(configPath)),
        widgetName = widgetConfig.name,
        containerCfg = widgetConfig.options.container,
        container = containerCfg ? containerCfg.default : ('.' + widgetName + '-container'),
        demoPreviewHTMLContent;

    if(container[0] === '#'){
        container = 'id="' + container.substr(1) + '"';
    }else{
        container = 'class="' + container.substr(1) + '"';
    }
    
    doT.templateSettings.strip = false;
    demoPreviewHTMLContent = doT.template(u.read(path.join(tplRootPath, 'preview.html.dot')))({
        container: container
    });

    u.write(demoPreviewHTMLPath, demoPreviewHTMLContent);
};

function _buildGroups(groups){
    var defaultGroup = {key: 'default', uiBuffer: []};
    if(!groups){
        return [defaultGroup];
    }
    var len = groups.length,
        ret = [];

    //no groups then return the default one 
    if(0 === len){
        return [defaultGroup];
    }

    var group;
    for(var i = 0; i < len; i++){
        group = groups[i];
        ret.push({
            key: group.key,
            uiBuffer: [ui.generateGroup({label: group.label})]
        });
    };
    ret.push(defaultGroup);
    return ret;
};

function _findGroup(groups, key){
    var group;
    for(var i = 0, len = groups.length; i < len; i++){
        group = groups[i]
        if(key === group.key){
            return group;
        }
    }
};

function buildDemo(list){
    if(!list || 0 === list.length){ return; }

    var demoConfigPath = path.join(demoRoot, 'config.json');

    fs.stat(demoConfigPath, function(err, status){
        if(err){ u.abort(err.message); }

        var demoPath = path.join(demoRoot, 'demo'),
            demoSrcPath = path.join(demoPath, 'src'),
            demoCSSPath = path.join(demoSrcPath, 'demo.css'),
            demoJSPath = path.join(demoSrcPath, 'demo.js'),
            demoConfigHTMLPath = path.join(demoSrcPath, 'config.html'),
            demoPreviewHTMLPath = path.join(demoSrcPath, 'preview.html'),
            tplDemoPath = path.join(tplRootPath, 'demo.html.dot'),

            widgetConfig = JSON.parse(u.read(demoConfigPath)),

            tplDemoContent,
            demoConfigHTMLContent,
            demoPreviewHTMLContent,
            demoCSSContent,
            demoJSContent,

            tplDemoFn;

        tplDemoContent = u.read(tplDemoPath);
        demoConfigHTMLContent = u.read(demoConfigHTMLPath);
        demoPreviewHTMLContent = u.read(demoPreviewHTMLPath);
        demoCSSContent = u.read(demoCSSPath);
        demoJSContent = u.read(demoJSPath);

        doT.templateSettings.strip = false;
        tplDemoFn = doT.template(tplDemoContent);

        //write list
        list.forEach(function(item){
            var itemConfig = item.config;
            u.write(path.join(demoPath, item.fileName), tplDemoFn({
                title: widgetConfig.name,
                css: demoCSSContent,
                config: demoConfigHTMLContent,
                preview: demoPreviewHTMLContent,
                sdkUrl: itemConfig.sdkUrl + '?t=' + new Date().getTime(),
                key: itemConfig.key,
                secret: itemConfig.secret,
                hostname: itemConfig.hostname,
                channelUrl: itemConfig.channelUrl,
                js: demoJSContent
            }));
        });
    });
};

module.exports =  build;