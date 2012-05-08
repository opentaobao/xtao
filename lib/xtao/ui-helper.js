var u = require('./utils');

var id = 1;

var exports = {
	generateOption: function(){
		return [
			'<div class="control-group" data-item="{{data}}">'
		, '	<label class="control-label" for="{{id}}">{{label}}</label>'
		,	'	<div class="controls">'
		,	'		{{controls}}'
		,	'		{{help}}'
		,	'	</div>'
		, '</div>'
		].join(u.getEOL());
	}

, generateHelp: function(help){
		return help ? '<p class="help-block">' + help + '</p>'
								: '';
	}

/**
 * {
 *	 key: ''
 * , label: ''
 * , default: ''
 * , help: ''
 * }
 */
, generateInputOption: function(cfg){
		var controls = [
			'<input type="text" value="{{default}}" id="{{id}}" class="op-trigger" data-event="blur"/>'
		].join(u.getEOL());

		var html = this.generateOption()
								.replace(/{{controls}}/g, controls)
								.replace(/{{id}}/g, id++)
								.replace(/{{label}}/g, cfg.label)
								.replace(/{{default}}/g, cfg.default ? cfg.default : '')
								.replace(/{{help}}/g, this.generateHelp(cfg.help))
								.replace(/{{data}}/g, cfg.key + "/input");

		return html;
	}

/**
 * {
 *	 key: ''	
 * , label: ''	
 * , options: '["left", "right", "top" , "bottom", ...]'	
 * , help: ''	
 * }
 */
, generateListOption: function(cfg){
		var controls = [
			'<select id="{{id}}" class="op-trigger" data-event="change">'
		, '{{options}}'
		, '</select>'
		].join(u.getEOL())
			, options = [];

		cfg.options.forEach(function(option){
			options.push('<option value="' + option + '">' + option + '</option>');
		});

		controls = controls.replace(/{{options}}/g, options.join(u.getEOL()));

		var html = this.generateOption()
								.replace(/{{controls}}/g, controls)
								.replace(/{{id}}/g, id++)
								.replace(/{{label}}/g, cfg.label)
								.replace(/{{help}}/g, this.generateHelp(cfg.help))
								.replace(/{{data}}/g, cfg.key + "/list");

		return html;
	}

/**
 * {
 *	 key: ''	
 * , label: ''	
 * , description: ''	
 * , help: ''	
 * }
 */
, generateCheckboxOption: function(cfg){
		var controls = [
			'<label class="checkbox">'
		, '	<input type="checkbox" class="input-checkbox op-trigger" id="{{id}}" data-event="click" />{{description}}'
		, '</label>'
		].join(u.getEOL());

		var html = this.generateOption()
								.replace(/{{controls}}/g, controls)
								.replace(/{{id}}/g, id++)
								.replace(/{{label}}/g, cfg.label)
								.replace(/{{description}}/g, cfg.description)
								.replace(/{{help}}/g, this.generateHelp(cfg.help))
								.replace(/{{data}}/g, cfg.key + "/checkbox");

		return html;
	}

/**
 * {
 *	 label: ''	
 * }
 */
, generateGroup: function(cfg){
		return '<h4 class="group">' + cfg.label + '</h4>';
	}
};

module.exports = exports;