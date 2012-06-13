/**
 * Create a new widget with the following structure
 * 
 * WidgetName
 * |
 * |--Version 
 * |        |--assets
 * |        |       |--WidgetName.css
 * |        |--demo
 * |        |       |--src
 * |        |       |       |--demo.js
 * |        |       |       |--demo.css
 * |        |       |       |--config.html
 * |        |       |       |--preview.html
 * |        |       |
 * |        |       |--WidgetName-development.html
 * |        |       |--WidgetName-production.html
 * |        |--WidgetName.js
 * |    |--config.json
 */

var program = require('commander'),
    p = require('path'),
    u = require('../utils');

var tpls = {
    "css":  [
                '/* CSS for {{widgetName}} */',
                '/* your css code here */'
            ].join(u.getEOL()),

    "js": [
            '/* JavaScript for {{widgetName}} */',
            ';(function(win, undefined){',
            '    var doc = win.document,',
            '        TOP = win.TOP,',
            '        dom = TOP.dom,',
            '        ev = TOP.ev;',
            '',
            '    /**',
            '     * Class {{widgetName}}',
            '     *',
            '     * @param {Object} cfg The configuration of the {{widgetName}}',
            '     *',
            '     * @example',
            '     *     var widget = new {{widgetName}}({',
            '     *         container: "#top-{{widgetName}}-container",',
            '     *         name: "Goddy Zhao",',
            '     *         education: "bachelor",',
            '     *         isF2E: true',
            '     *     })',
            '     */',
            '    function {{widgetName}}(guid, cfg){',
            '        this.config = cfg;',
            '        this.init();',
            '        this.render();',
            '        this.bindEvents();',
            '    };',
            '',
            '    {{widgetName}}.prototype.init = function(){',
            '        this.dom = dom.get(this.config.container);',
            '        this.events = []',
            '    };',
            '',
            '    {{widgetName}}.prototype.render = function(){',
            '        this.btn = doc.createElement("button");',
            '        this.btn.id = "top-selfintro-btn";',
            '        this.btn.innerHTML = "查看我的介绍";',
            '',
            '        this.dom.appendChild(this.btn);',
            '    };',
            '',
            '    {{widgetName}}.prototype.bindEvents = function(){',
            '        var self = this;',
            '        var event = {',
            '            el: self.btn,',
            '            type: "click",',
            '            handler: function(e){',
            '                var info = "大家好！我叫" + self.config.name + "，";',
            '                info += "我拥有" + self.config.education + "学历，";',
            '                info += self.config.isF2E ? "当然了，我是一名前端攻城师!" : "可惜，我不是前端工程师！";',
            '                alert(info);',
            '            }',
            '        }',
            '',
            '        this.events.push(event);',
            '',
            '        ev.add(event.el, event.type, event.handler);',
            '    };',
            '',
            '    {{widgetName}}.prototype.destroy = function(){',
            '        var event;',
            '',
            '        this.dom.removeChild(this.btn);',
            '',
            '        for(var i = 0, len = this.events.length; i < len; i++){',
            '            event = this.events[i];',
            '            ev.remove(event.el, event.type, event.handler);',
            '        }',
            '    };',
            '',
            '    function createWidget(guid, cfg){',
            '        return new {{widgetName}}(guid, cfg);',
            '    }',
            '',
            '    TOP.ui["{{widgetName}}"] = createWidget;',
            '})(window);'
            ].join(u.getEOL()),

    "iframe": [
                '<!doctype html>',
                '<html>',
                '    <head>',
                '        <meta charset="utf-8">',
                '        <title>{{widgetName}} Iframe Page</title>',
                '    </head>',
                '    <body>',
                '        <div id="page"></div>',
                '    </body>',
                '</html>'
              ].join(u.getEOL()),

    "config":   [
                    '{',
                    '    "name": "{{widgetName}}",',
                    '    "description": "This is widget {{widgetName}}",',
                    '    "ui": {',
                    '        "groups": [',
                    '            {"key": "basic", "label": "Basic Settings"},',
                    '            {"key": "advanced", "label": "Advanced Settings"}',
                    '        ]',
                    '    },',
                    '    "options": {',
                    '        "container": {',
                    '            "type": "String",',
                    '            "label": "组件容器",',
                    '            "default": ".top-{{widgetName}}-container",',
                    '            "tips": "组件容器的选择器",',
                    '            "required": true,',
                    '            "group": "basic"',
                    '        },',
                    '        "name": {',
                    '            "type": "String",',
                    '            "label": "姓名",',
                    '            "default": "Goddy Zhao",',
                    '            "tips": "填写姓名",',
                    '            "required": true,',
                    '            "group": "basic"',
                    '        },',
                    '        "education": {',
                    '            "type": "Selection",',
                    '            "label": "学历",',
                    '            "default": "bachelor",',
                    '            "values": [',
                    '                {"key": "bachelor", "label": "本科"},',
                    '                {"key": "master", "label": "硕士"},',
                    '                {"key": "doctor", "label": "博士"},',
                    '                {"key": "god", "label": "圣斗士"}',
                    '            ],',
                    '            "required": true,',
                    '            "group": "basic"',
                    '        },',
                    '        "isF2E": {',
                    '            "type": "Boolean",',
                    '            "label": "是否前端",',
                    '            "default": false,',
                    '            "description": "是",',
                    '            "required": true,',
                    '            "group": "basic"',
                    '        }',
                    '    }',
                    '}'
                ].join(u.getEOL()),

    "demo-js": [
                    '/**',
                    ' * JavaScript for demo both in development and production environment',
                    ' * ',
                    ' */',
                    ';(function(win, undefined){',
                    '    var $ = win.$;',
                    '    var X = win.XTAO;',
                    '    var cache = {};',
                    '',
                    '    $("#config-form").submit(function(e){',
                    '        e.preventDefault();',
                    '        if(cache.currentWidget){',
                    '            cache.currentWidget.destroy();',
                    '            delete cache.currentWidget',
                    '        }',
                    '',
                    '        var cfg = X.getConfigurations();',
                    '        TOP.ui("{{widgetName}}", cfg, function(widget){',
                    '            cache.currentWidget = widget;',
                    '        });',
                    '    });',
                    '})(window);'
                ].join(u.getEOL()),

    "demo-css": [
                    '/* CSS for demo both in development and production environment */'
                ].join(u.getEOL()),

    "config-html": [
                        '<!-- Write your config html code here -->'
                   ].join(u.getEOL()),

    "preview-html": [
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