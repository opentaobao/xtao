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
            '     * @param {String} guid {{widgetName}}的guid',
            '     * @param {Object} cfg {{widgetName}}的配置参数',
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
            '        var self = this;',
            '',
            '        if(!(self instanceof {{widgetName}})){',
            '            return new {{widgetName}}(guid, cfg);',
            '        }',
            '',
            '        self.config = cfg;',
            '        self.init();',
            '        self.render();',
            '        self.bind();',
            '    };',
            '',
            '    {{widgetName}}.prototype.init = function(){',
            '        var self = this;',
            '        self.dom = dom.get(self.config.container);',
            '        self.events = [];',
            '    };',
            '',
            '    {{widgetName}}.prototype.render = function(){',
            '        var self = this;',
            '',
            '        self.btn = doc.createElement("button");',
            '        self.btn.id = "top-selfintro-btn";',
            '        self.btn.innerHTML = "查看我的介绍";',
            '',
            '        self.dom.appendChild(self.btn);',
            '    };',
            '',
            '    {{widgetName}}.prototype.bind = function(){',
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
            '        self.events.push(event);',
            '',
            '        ev.add(event.el, event.type, event.handler);',
            '    };',
            '',
            '    /**',
            '     * 自我销毁（释放内存）',
            '     * 当调用者需要将创建出来的组件进行销毁的时候需要调用此函数',
            '     * 此函数负责清除如下内容：',
            '     *     1. 组件的DOM需要从文档中删除',
            '     *     2. 移除绑定的DOM事件',
            '     *     3. 移除绑定的系统事件',
            '     */',
            '    {{widgetName}}.prototype.destroy = function(){',
            '        var self = this;',
            '        var event;',
            '',
            '        self.dom.removeChild(self.btn);',
            '',
            '        for(var i = 0, len = self.events.length; i < len; i++){',
            '            event = self.events[i];',
            '            ev.remove(event.el, event.type, event.handler);',
            '        }',
            '    };',
            '',
            '',
            '    TOP.ui["{{widgetName}}"] = {{widgetName}};',
            '})(window);'
            ].join(u.getEOL()),

    "iframe": [
                '<!doctype html>',
                '<html>',
                '    <head>',
                '        <meta charset="utf-8">',
                '        <title>{{widgetName}} Iframe Page</title>',
                '        <link rel="stylesheet" href="assets/{{widgetName}}-iframe.css" />',
                '        <script src="http://a.tbcdn.cn/apps/top/x/sdk.js"></script>',
                '        <script src="assets/{{widgetName}}-iframe.js"></script>',
                '    </head>',
                '    <body>',
                '        <div id="page"></div>',
                '    </body>',
                '</html>'
              ].join(u.getEOL()),

    "iframe-js": '',

    "iframe-css": '',

    "config":   [
                    '{',
                    '    "name": "{{widgetName}}",',
                    '    "description": "This is widget {{widgetName}}",',
                    '    "thumbnail": "http://img03.taobaocdn.com/tps/i3/T1zyq5XdRaXXXXXXXX-50-50.png",',
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
                    '',
                    '',
                    '    // 初始化脚本',
                    '    var cfg = X.getConfigurations();',
                    '    TOP.ui("{{widgetName}}", cfg, function(widget){',
                    '        cache.currentWidget = widget;',
                    '    });',
                    '',
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
            u.write(p.join(dir, 'assets', widgetName + '-iframe.js'),
                    tpls['iframe-js']);
            
            u.write(p.join(dir, 'assets', widgetName + '-iframe.css'),
                    tpls['iframe-js']);
        }
    });
};


module.exports = create;