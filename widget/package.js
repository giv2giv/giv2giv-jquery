/*! jQuery Validation Plugin - v1.13.1 - 10/14/2014
 * http://jqueryvalidation.org/
 * Copyright (c) 2014 Jörn Zaefferer; Licensed MIT */
function initPlugins(jQuery) {
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }

/*! jQuery Validation Plugin - v1.14.0 - 6/30/2015
 *  * http://jqueryvalidation.org/
 *   * Copyright (c) 2015 JÃ¶rn Zaefferer; Licensed MIT */
    !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){a.extend(a.fn,{validate:function(b){if(!this.length)return void(b&&b.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing."));var c=a.data(this[0],"validator");return c?c:(this.attr("novalidate","novalidate"),c=new a.validator(b,this[0]),a.data(this[0],"validator",c),c.settings.onsubmit&&(this.on("click.validate",":submit",function(b){c.settings.submitHandler&&(c.submitButton=b.target),a(this).hasClass("cancel")&&(c.cancelSubmit=!0),void 0!==a(this).attr("formnovalidate")&&(c.cancelSubmit=!0)}),this.on("submit.validate",function(b){function d(){var d,e;return c.settings.submitHandler?(c.submitButton&&(d=a("<input type='hidden'/>").attr("name",c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)),e=c.settings.submitHandler.call(c,c.currentForm,b),c.submitButton&&d.remove(),void 0!==e?e:!1):!0}return c.settings.debug&&b.preventDefault(),c.cancelSubmit?(c.cancelSubmit=!1,d()):c.form()?c.pendingRequest?(c.formSubmitted=!0,!1):d():(c.focusInvalid(),!1)})),c)},valid:function(){var b,c,d;return a(this[0]).is("form")?b=this.validate().form():(d=[],b=!0,c=a(this[0].form).validate(),this.each(function(){b=c.element(this)&&b,d=d.concat(c.errorList)}),c.errorList=d),b},rules:function(b,c){var d,e,f,g,h,i,j=this[0];if(b)switch(d=a.data(j.form,"validator").settings,e=d.rules,f=a.validator.staticRules(j),b){case"add":a.extend(f,a.validator.normalizeRule(c)),delete f.messages,e[j.name]=f,c.messages&&(d.messages[j.name]=a.extend(d.messages[j.name],c.messages));break;case"remove":return c?(i={},a.each(c.split(/\s/),function(b,c){i[c]=f[c],delete f[c],"required"===c&&a(j).removeAttr("aria-required")}),i):(delete e[j.name],f)}return g=a.validator.normalizeRules(a.extend({},a.validator.classRules(j),a.validator.attributeRules(j),a.validator.dataRules(j),a.validator.staticRules(j)),j),g.required&&(h=g.required,delete g.required,g=a.extend({required:h},g),a(j).attr("aria-required","true")),g.remote&&(h=g.remote,delete g.remote,g=a.extend(g,{remote:h})),g}}),a.extend(a.expr[":"],{blank:function(b){return!a.trim(""+a(b).val())},filled:function(b){return!!a.trim(""+a(b).val())},unchecked:function(b){return!a(b).prop("checked")}}),a.validator=function(b,c){this.settings=a.extend(!0,{},a.validator.defaults,b),this.currentForm=c,this.init()},a.validator.format=function(b,c){return 1===arguments.length?function(){var c=a.makeArray(arguments);return c.unshift(b),a.validator.format.apply(this,c)}:(arguments.length>2&&c.constructor!==Array&&(c=a.makeArray(arguments).slice(1)),c.constructor!==Array&&(c=[c]),a.each(c,function(a,c){b=b.replace(new RegExp("\\{"+a+"\\}","g"),function(){return c})}),b)},a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusCleanup:!1,focusInvalid:!0,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(a){this.lastActive=a,this.settings.focusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass),this.hideThese(this.errorsFor(a)))},onfocusout:function(a){this.checkable(a)||!(a.name in this.submitted)&&this.optional(a)||this.element(a)},onkeyup:function(b,c){var d=[16,17,18,20,35,36,37,38,39,40,45,144,225];9===c.which&&""===this.elementValue(b)||-1!==a.inArray(c.keyCode,d)||(b.name in this.submitted||b===this.lastElement)&&this.element(b)},onclick:function(a){a.name in this.submitted?this.element(a):a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).addClass(c).removeClass(d):a(b).addClass(c).removeClass(d)},unhighlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).removeClass(c).addClass(d):a(b).removeClass(c).addClass(d)}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date ( ISO ).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:!1,prototype:{init:function(){function b(b){var c=a.data(this.form,"validator"),d="on"+b.type.replace(/^validate/,""),e=c.settings;e[d]&&!a(this).is(e.ignore)&&e[d].call(c,this,b)}this.labelContainer=a(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm),this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var c,d=this.groups={};a.each(this.settings.groups,function(b,c){"string"==typeof c&&(c=c.split(/\s/)),a.each(c,function(a,c){d[c]=b})}),c=this.settings.rules,a.each(c,function(b,d){c[b]=a.validator.normalizeRule(d)}),a(this.currentForm).on("focusin.validate focusout.validate keyup.validate",":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']",b).on("click.validate","select, option, [type='radio'], [type='checkbox']",b),this.settings.invalidHandler&&a(this.currentForm).on("invalid-form.validate",this.settings.invalidHandler),a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required","true")},form:function(){return this.checkForm(),a.extend(this.submitted,this.errorMap),this.invalid=a.extend({},this.errorMap),this.valid()||a(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(b){var c=this.clean(b),d=this.validationTargetFor(c),e=!0;return this.lastElement=d,void 0===d?delete this.invalid[c.name]:(this.prepareElement(d),this.currentElements=a(d),e=this.check(d)!==!1,e?delete this.invalid[d.name]:this.invalid[d.name]=!0),a(b).attr("aria-invalid",!e),this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),e},showErrors:function(b){if(b){a.extend(this.errorMap,b),this.errorList=[];for(var c in b)this.errorList.push({message:b[c],element:this.findByName(c)[0]});this.successList=a.grep(this.successList,function(a){return!(a.name in b)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){a.fn.resetForm&&a(this.currentForm).resetForm(),this.submitted={},this.lastElement=null,this.prepareForm(),this.hideErrors();var b,c=this.elements().removeData("previousValue").removeAttr("aria-invalid");if(this.settings.unhighlight)for(b=0;c[b];b++)this.settings.unhighlight.call(this,c[b],this.settings.errorClass,"");else c.removeClass(this.settings.errorClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(a){var b,c=0;for(b in a)c++;return c},hideErrors:function(){this.hideThese(this.toHide)},hideThese:function(a){a.not(this.containers).text(""),this.addWrapper(a).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(b){}},findLastActive:function(){var b=this.lastActive;return b&&1===a.grep(this.errorList,function(a){return a.element.name===b.name}).length&&b},elements:function(){var b=this,c={};return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function(){return!this.name&&b.settings.debug&&window.console&&console.error("%o has no name assigned",this),this.name in c||!b.objectLength(a(this).rules())?!1:(c[this.name]=!0,!0)})},clean:function(b){return a(b)[0]},errors:function(){var b=this.settings.errorClass.split(" ").join(".");return a(this.settings.errorElement+"."+b,this.errorContext)},reset:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=a([]),this.toHide=a([]),this.currentElements=a([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset(),this.toHide=this.errorsFor(a)},elementValue:function(b){var c,d=a(b),e=b.type;return"radio"===e||"checkbox"===e?this.findByName(b.name).filter(":checked").val():"number"===e&&"undefined"!=typeof b.validity?b.validity.badInput?!1:d.val():(c=d.val(),"string"==typeof c?c.replace(/\r/g,""):c)},check:function(b){b=this.validationTargetFor(this.clean(b));var c,d,e,f=a(b).rules(),g=a.map(f,function(a,b){return b}).length,h=!1,i=this.elementValue(b);for(d in f){e={method:d,parameters:f[d]};try{if(c=a.validator.methods[d].call(this,i,b,e.parameters),"dependency-mismatch"===c&&1===g){h=!0;continue}if(h=!1,"pending"===c)return void(this.toHide=this.toHide.not(this.errorsFor(b)));if(!c)return this.formatAndAdd(b,e),!1}catch(j){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+b.id+", check the '"+e.method+"' method.",j),j instanceof TypeError&&(j.message+=".  Exception occurred when checking element "+b.id+", check the '"+e.method+"' method."),j}}if(!h)return this.objectLength(f)&&this.successList.push(b),!0},customDataMessage:function(b,c){return a(b).data("msg"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase())||a(b).data("msg")},customMessage:function(a,b){var c=this.settings.messages[a];return c&&(c.constructor===String?c:c[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(void 0!==arguments[a])return arguments[a];return void 0},defaultMessage:function(b,c){return this.findDefined(this.customMessage(b.name,c),this.customDataMessage(b,c),!this.settings.ignoreTitle&&b.title||void 0,a.validator.messages[c],"<strong>Warning: No message defined for "+b.name+"</strong>")},formatAndAdd:function(b,c){var d=this.defaultMessage(b,c.method),e=/\$?\{(\d+)\}/g;"function"==typeof d?d=d.call(this,c.parameters,b):e.test(d)&&(d=a.validator.format(d.replace(e,"{$1}"),c.parameters)),this.errorList.push({message:d,element:b,method:c.method}),this.errorMap[b.name]=d,this.submitted[b.name]=d},addWrapper:function(a){return this.settings.wrapper&&(a=a.add(a.parent(this.settings.wrapper))),a},defaultShowErrors:function(){var a,b,c;for(a=0;this.errorList[a];a++)c=this.errorList[a],this.settings.highlight&&this.settings.highlight.call(this,c.element,this.settings.errorClass,this.settings.validClass),this.showLabel(c.element,c.message);if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight)for(a=0,b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(b,c){var d,e,f,g=this.errorsFor(b),h=this.idOrName(b),i=a(b).attr("aria-describedby");g.length?(g.removeClass(this.settings.validClass).addClass(this.settings.errorClass),g.html(c)):(g=a("<"+this.settings.errorElement+">").attr("id",h+"-error").addClass(this.settings.errorClass).html(c||""),d=g,this.settings.wrapper&&(d=g.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.length?this.labelContainer.append(d):this.settings.errorPlacement?this.settings.errorPlacement(d,a(b)):d.insertAfter(b),g.is("label")?g.attr("for",h):0===g.parents("label[for='"+h+"']").length&&(f=g.attr("id").replace(/(:|\.|\[|\]|\$)/g,"\\$1"),i?i.match(new RegExp("\\b"+f+"\\b"))||(i+=" "+f):i=f,a(b).attr("aria-describedby",i),e=this.groups[b.name],e&&a.each(this.groups,function(b,c){c===e&&a("[name='"+b+"']",this.currentForm).attr("aria-describedby",g.attr("id"))}))),!c&&this.settings.success&&(g.text(""),"string"==typeof this.settings.success?g.addClass(this.settings.success):this.settings.success(g,b)),this.toShow=this.toShow.add(g)},errorsFor:function(b){var c=this.idOrName(b),d=a(b).attr("aria-describedby"),e="label[for='"+c+"'], label[for='"+c+"'] *";return d&&(e=e+", #"+d.replace(/\s+/g,", #")),this.errors().filter(e)},idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},validationTargetFor:function(b){return this.checkable(b)&&(b=this.findByName(b.name)),a(b).not(this.settings.ignore)[0]},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(b){return a(this.currentForm).find("[name='"+b+"']")},getLength:function(b,c){switch(c.nodeName.toLowerCase()){case"select":return a("option:selected",c).length;case"input":if(this.checkable(c))return this.findByName(c.name).filter(":checked").length}return b.length},depend:function(a,b){return this.dependTypes[typeof a]?this.dependTypes[typeof a](a,b):!0},dependTypes:{"boolean":function(a){return a},string:function(b,c){return!!a(b,c.form).length},"function":function(a,b){return a(b)}},optional:function(b){var c=this.elementValue(b);return!a.validator.methods.required.call(this,c,b)&&"dependency-mismatch"},startRequest:function(a){this.pending[a.name]||(this.pendingRequest++,this.pending[a.name]=!0)},stopRequest:function(b,c){this.pendingRequest--,this.pendingRequest<0&&(this.pendingRequest=0),delete this.pending[b.name],c&&0===this.pendingRequest&&this.formSubmitted&&this.form()?(a(this.currentForm).submit(),this.formSubmitted=!1):!c&&0===this.pendingRequest&&this.formSubmitted&&(a(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(b){return a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:!0,message:this.defaultMessage(b,"remote")})},destroy:function(){this.resetForm(),a(this.currentForm).off(".validate").removeData("validator")}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(b,c){b.constructor===String?this.classRuleSettings[b]=c:a.extend(this.classRuleSettings,b)},classRules:function(b){var c={},d=a(b).attr("class");return d&&a.each(d.split(" "),function(){this in a.validator.classRuleSettings&&a.extend(c,a.validator.classRuleSettings[this])}),c},normalizeAttributeRule:function(a,b,c,d){/min|max/.test(c)&&(null===b||/number|range|text/.test(b))&&(d=Number(d),isNaN(d)&&(d=void 0)),d||0===d?a[c]=d:b===c&&"range"!==b&&(a[c]=!0)},attributeRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)"required"===c?(d=b.getAttribute(c),""===d&&(d=!0),d=!!d):d=f.attr(c),this.normalizeAttributeRule(e,g,c,d);return e.maxlength&&/-1|2147483647|524288/.test(e.maxlength)&&delete e.maxlength,e},dataRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)d=f.data("rule"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase()),this.normalizeAttributeRule(e,g,c,d);return e},staticRules:function(b){var c={},d=a.data(b.form,"validator");return d.settings.rules&&(c=a.validator.normalizeRule(d.settings.rules[b.name])||{}),c},normalizeRules:function(b,c){return a.each(b,function(d,e){if(e===!1)return void delete b[d];if(e.param||e.depends){var f=!0;switch(typeof e.depends){case"string":f=!!a(e.depends,c.form).length;break;case"function":f=e.depends.call(c,c)}f?b[d]=void 0!==e.param?e.param:!0:delete b[d]}}),a.each(b,function(d,e){b[d]=a.isFunction(e)?e(c):e}),a.each(["minlength","maxlength"],function(){b[this]&&(b[this]=Number(b[this]))}),a.each(["rangelength","range"],function(){var c;b[this]&&(a.isArray(b[this])?b[this]=[Number(b[this][0]),Number(b[this][1])]:"string"==typeof b[this]&&(c=b[this].replace(/[\[\]]/g,"").split(/[\s,]+/),b[this]=[Number(c[0]),Number(c[1])]))}),a.validator.autoCreateRanges&&(null!=b.min&&null!=b.max&&(b.range=[b.min,b.max],delete b.min,delete b.max),null!=b.minlength&&null!=b.maxlength&&(b.rangelength=[b.minlength,b.maxlength],delete b.minlength,delete b.maxlength)),b},normalizeRule:function(b){if("string"==typeof b){var c={};a.each(b.split(/\s/),function(){c[this]=!0}),b=c}return b},addMethod:function(b,c,d){a.validator.methods[b]=c,a.validator.messages[b]=void 0!==d?d:a.validator.messages[b],c.length<3&&a.validator.addClassRules(b,a.validator.normalizeRule(b))},methods:{required:function(b,c,d){if(!this.depend(d,c))return"dependency-mismatch";if("select"===c.nodeName.toLowerCase()){var e=a(c).val();return e&&e.length>0}return this.checkable(c)?this.getLength(b,c)>0:b.length>0},email:function(a,b){return this.optional(b)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)},url:function(a,b){return this.optional(b)||/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(a)},date:function(a,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(a).toString())},dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)},number:function(a,b){return this.optional(b)||/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},creditcard:function(a,b){if(this.optional(b))return"dependency-mismatch";if(/[^0-9 \-]+/.test(a))return!1;var c,d,e=0,f=0,g=!1;if(a=a.replace(/\D/g,""),a.length<13||a.length>19)return!1;for(c=a.length-1;c>=0;c--)d=a.charAt(c),f=parseInt(d,10),g&&(f*=2)>9&&(f-=9),e+=f,g=!g;return e%10===0},minlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d},maxlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||d>=e},rangelength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d[0]&&e<=d[1]},min:function(a,b,c){return this.optional(b)||a>=c},max:function(a,b,c){return this.optional(b)||c>=a},range:function(a,b,c){return this.optional(b)||a>=c[0]&&a<=c[1]},equalTo:function(b,c,d){var e=a(d);return this.settings.onfocusout&&e.off(".validate-equalTo").on("blur.validate-equalTo",function(){a(c).valid()}),b===e.val()},remote:function(b,c,d){if(this.optional(c))return"dependency-mismatch";var e,f,g=this.previousValue(c);return this.settings.messages[c.name]||(this.settings.messages[c.name]={}),g.originalMessage=this.settings.messages[c.name].remote,this.settings.messages[c.name].remote=g.message,d="string"==typeof d&&{url:d}||d,g.old===b?g.valid:(g.old=b,e=this,this.startRequest(c),f={},f[c.name]=b,a.ajax(a.extend(!0,{mode:"abort",port:"validate"+c.name,dataType:"json",data:f,context:e.currentForm,success:function(d){var f,h,i,j=d===!0||"true"===d;e.settings.messages[c.name].remote=g.originalMessage,j?(i=e.formSubmitted,e.prepareElement(c),e.formSubmitted=i,e.successList.push(c),delete e.invalid[c.name],e.showErrors()):(f={},h=d||e.defaultMessage(c,"remote"),f[c.name]=g.message=a.isFunction(h)?h(b):h,e.invalid[c.name]=!0,e.showErrors(f)),g.valid=j,e.stopRequest(c,j)}},d)),"pending")}}});var b,c={};a.ajaxPrefilter?a.ajaxPrefilter(function(a,b,d){var e=a.port;"abort"===a.mode&&(c[e]&&c[e].abort(),c[e]=d)}):(b=a.ajax,a.ajax=function(d){var e=("mode"in d?d:a.ajaxSettings).mode,f=("port"in d?d:a.ajaxSettings).port;return"abort"===e?(c[f]&&c[f].abort(),c[f]=b.apply(this,arguments),c[f]):b.apply(this,arguments)})});

    ! function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
    }(function(a) {
        a.extend(a.fn, {
            validate: function(b) {
                if (!this.length) return void(b && b.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
                var c = a.data(this[0], "validator");
                return c ? c : (this.attr("novalidate", "novalidate"), c = new a.validator(b, this[0]), a.data(this[0], "validator", c), c.settings.onsubmit && (this.validateDelegate(":submit", "click", function(b) {
                    c.settings.submitHandler && (c.submitButton = b.target), a(b.target).hasClass("cancel") && (c.cancelSubmit = !0), void 0 !== a(b.target).attr("formnovalidate") && (c.cancelSubmit = !0)
                }), this.submit(function(b) {
                    function d() {
                        var d, e;
                        return c.settings.submitHandler ? (c.submitButton && (d = a("<input type='hidden'/>").attr("name", c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)), e = c.settings.submitHandler.call(c, c.currentForm, b), c.submitButton && d.remove(), void 0 !== e ? e : !1) : !0
                    }
                    return c.settings.debug && b.preventDefault(), c.cancelSubmit ? (c.cancelSubmit = !1, d()) : c.form() ? c.pendingRequest ? (c.formSubmitted = !0, !1) : d() : (c.focusInvalid(), !1)
                })), c)
            },
            valid: function() {
                var b, c;
                return a(this[0]).is("form") ? b = this.validate().form() : (b = !0, c = a(this[0].form).validate(), this.each(function() {
                    b = c.element(this) && b
                })), b
            },
            removeAttrs: function(b) {
                var c = {},
                    d = this;
                return a.each(b.split(/\s/), function(a, b) {
                    c[b] = d.attr(b), d.removeAttr(b)
                }), c
            },
            rules: function(b, c) {
                var d, e, f, g, h, i, j = this[0];
                if (b) switch (d = a.data(j.form, "validator").settings, e = d.rules, f = a.validator.staticRules(j), b) {
                    case "add":
                        a.extend(f, a.validator.normalizeRule(c)), delete f.messages, e[j.name] = f, c.messages && (d.messages[j.name] = a.extend(d.messages[j.name], c.messages));
                        break;
                    case "remove":
                        return c ? (i = {}, a.each(c.split(/\s/), function(b, c) {
                            i[c] = f[c], delete f[c], "required" === c && a(j).removeAttr("aria-required")
                        }), i) : (delete e[j.name], f)
                }
                return g = a.validator.normalizeRules(a.extend({}, a.validator.classRules(j), a.validator.attributeRules(j), a.validator.dataRules(j), a.validator.staticRules(j)), j), g.required && (h = g.required, delete g.required, g = a.extend({
                    required: h
                }, g), a(j).attr("aria-required", "true")), g.remote && (h = g.remote, delete g.remote, g = a.extend(g, {
                    remote: h
                })), g
            }
        }), a.extend(a.expr[":"], {
            blank: function(b) {
                return !a.trim("" + a(b).val())
            },
            filled: function(b) {
                return !!a.trim("" + a(b).val())
            },
            unchecked: function(b) {
                return !a(b).prop("checked")
            }
        }), a.validator = function(b, c) {
            this.settings = a.extend(!0, {}, a.validator.defaults, b), this.currentForm = c, this.init()
        }, a.validator.format = function(b, c) {
            return 1 === arguments.length ? function() {
                var c = a.makeArray(arguments);
                return c.unshift(b), a.validator.format.apply(this, c)
            } : (arguments.length > 2 && c.constructor !== Array && (c = a.makeArray(arguments).slice(1)), c.constructor !== Array && (c = [c]), a.each(c, function(a, c) {
                b = b.replace(new RegExp("\\{" + a + "\\}", "g"), function() {
                    return c
                })
            }), b)
        }, a.extend(a.validator, {
            defaults: {
                messages: {},
                groups: {},
                rules: {},
                errorClass: "error",
                validClass: "valid",
                errorElement: "label",
                focusCleanup: !1,
                focusInvalid: !0,
                errorContainer: a([]),
                errorLabelContainer: a([]),
                onsubmit: !0,
                ignore: ":hidden",
                ignoreTitle: !1,
                onfocusin: function(a) {
                    this.lastActive = a, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(a)))
                },
                onfocusout: function(a) {
                    this.checkable(a) || !(a.name in this.submitted) && this.optional(a) || this.element(a)
                },
                onkeyup: function(a, b) {
                    (9 !== b.which || "" !== this.elementValue(a)) && (a.name in this.submitted || a === this.lastElement) && this.element(a)
                },
                onclick: function(a) {
                    a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode)
                },
                highlight: function(b, c, d) {
                    "radio" === b.type ? this.findByName(b.name).addClass(c).removeClass(d) : a(b).addClass(c).removeClass(d)
                },
                unhighlight: function(b, c, d) {
                    "radio" === b.type ? this.findByName(b.name).removeClass(c).addClass(d) : a(b).removeClass(c).addClass(d)
                }
            },
            setDefaults: function(b) {
                a.extend(a.validator.defaults, b)
            },
            messages: {
                required: "This field is required.",
                remote: "Please fix this field.",
                email: "Please enter a valid email address.",
                url: "Please enter a valid URL.",
                date: "Please enter a valid date.",
                dateISO: "Please enter a valid date ( ISO ).",
                number: "Please enter a valid number.",
                digits: "Please enter only digits.",
                creditcard: "Please enter a valid credit card number.",
                equalTo: "Please enter the same value again.",
                maxlength: a.validator.format("Please enter no more than {0} characters."),
                minlength: a.validator.format("Please enter at least {0} characters."),
                rangelength: a.validator.format("Please enter a value between {0} and {1} characters long."),
                range: a.validator.format("Please enter a value between {0} and {1}."),
                max: a.validator.format("Please enter a value less than or equal to {0}."),
                min: a.validator.format("Please enter a value greater than or equal to {0}.")
            },
            autoCreateRanges: !1,
            prototype: {
                init: function() {
                    function b(b) {
                        var c = a.data(this[0].form, "validator"),
                            d = "on" + b.type.replace(/^validate/, ""),
                            e = c.settings;
                        e[d] && !this.is(e.ignore) && e[d].call(c, this[0], b)
                    }
                    this.labelContainer = a(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || a(this.currentForm), this.containers = a(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
                    var c, d = this.groups = {};
                    a.each(this.settings.groups, function(b, c) {
                        "string" == typeof c && (c = c.split(/\s/)), a.each(c, function(a, c) {
                            d[c] = b
                        })
                    }), c = this.settings.rules, a.each(c, function(b, d) {
                        c[b] = a.validator.normalizeRule(d)
                    }), a(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']", "focusin focusout keyup", b).validateDelegate("select, option, [type='radio'], [type='checkbox']", "click", b), this.settings.invalidHandler && a(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler), a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
                },
                form: function() {
                    return this.checkForm(), a.extend(this.submitted, this.errorMap), this.invalid = a.extend({}, this.errorMap), this.valid() || a(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
                },
                checkForm: function() {
                    this.prepareForm();
                    for (var a = 0, b = this.currentElements = this.elements(); b[a]; a++) this.check(b[a]);
                    return this.valid()
                },
                element: function(b) {
                    var c = this.clean(b),
                        d = this.validationTargetFor(c),
                        e = !0;
                    return this.lastElement = d, void 0 === d ? delete this.invalid[c.name] : (this.prepareElement(d), this.currentElements = a(d), e = this.check(d) !== !1, e ? delete this.invalid[d.name] : this.invalid[d.name] = !0), a(b).attr("aria-invalid", !e), this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), e
                },
                showErrors: function(b) {
                    if (b) {
                        a.extend(this.errorMap, b), this.errorList = [];
                        for (var c in b) this.errorList.push({
                            message: b[c],
                            element: this.findByName(c)[0]
                        });
                        this.successList = a.grep(this.successList, function(a) {
                            return !(a.name in b)
                        })
                    }
                    this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
                },
                resetForm: function() {
                    a.fn.resetForm && a(this.currentForm).resetForm(), this.submitted = {}, this.lastElement = null, this.prepareForm(), this.hideErrors(), this.elements().removeClass(this.settings.errorClass).removeData("previousValue").removeAttr("aria-invalid")
                },
                numberOfInvalids: function() {
                    return this.objectLength(this.invalid)
                },
                objectLength: function(a) {
                    var b, c = 0;
                    for (b in a) c++;
                    return c
                },
                hideErrors: function() {
                    this.hideThese(this.toHide)
                },
                hideThese: function(a) {
                    a.not(this.containers).text(""), this.addWrapper(a).hide()
                },
                valid: function() {
                    return 0 === this.size()
                },
                size: function() {
                    return this.errorList.length
                },
                focusInvalid: function() {
                    if (this.settings.focusInvalid) try {
                        a(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                    } catch (b) {}
                },
                findLastActive: function() {
                    var b = this.lastActive;
                    return b && 1 === a.grep(this.errorList, function(a) {
                        return a.element.name === b.name
                    }).length && b
                },
                elements: function() {
                    var b = this,
                        c = {};
                    return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled], [readonly]").not(this.settings.ignore).filter(function() {
                        return !this.name && b.settings.debug && window.console && console.error("%o has no name assigned", this), this.name in c || !b.objectLength(a(this).rules()) ? !1 : (c[this.name] = !0, !0)
                    })
                },
                clean: function(b) {
                    return a(b)[0]
                },
                errors: function() {
                    var b = this.settings.errorClass.split(" ").join(".");
                    return a(this.settings.errorElement + "." + b, this.errorContext)
                },
                reset: function() {
                    this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = a([]), this.toHide = a([]), this.currentElements = a([])
                },
                prepareForm: function() {
                    this.reset(), this.toHide = this.errors().add(this.containers)
                },
                prepareElement: function(a) {
                    this.reset(), this.toHide = this.errorsFor(a)
                },
                elementValue: function(b) {
                    var c, d = a(b),
                        e = b.type;
                    return "radio" === e || "checkbox" === e ? a("input[name='" + b.name + "']:checked").val() : "number" === e && "undefined" != typeof b.validity ? b.validity.badInput ? !1 : d.val() : (c = d.val(), "string" == typeof c ? c.replace(/\r/g, "") : c)
                },
                check: function(b) {
                    b = this.validationTargetFor(this.clean(b));
                    var c, d, e, f = a(b).rules(),
                        g = a.map(f, function(a, b) {
                            return b
                        }).length,
                        h = !1,
                        i = this.elementValue(b);
                    for (d in f) {
                        e = {
                            method: d,
                            parameters: f[d]
                        };
                        try {
                            if (c = a.validator.methods[d].call(this, i, b, e.parameters), "dependency-mismatch" === c && 1 === g) {
                                h = !0;
                                continue
                            }
                            if (h = !1, "pending" === c) return void(this.toHide = this.toHide.not(this.errorsFor(b)));
                            if (!c) return this.formatAndAdd(b, e), !1
                        } catch (j) {
                            throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + b.id + ", check the '" + e.method + "' method.", j), j
                        }
                    }
                    if (!h) return this.objectLength(f) && this.successList.push(b), !0
                },
                customDataMessage: function(b, c) {
                    return a(b).data("msg" + c.charAt(0).toUpperCase() + c.substring(1).toLowerCase()) || a(b).data("msg")
                },
                customMessage: function(a, b) {
                    var c = this.settings.messages[a];
                    return c && (c.constructor === String ? c : c[b])
                },
                findDefined: function() {
                    for (var a = 0; a < arguments.length; a++)
                        if (void 0 !== arguments[a]) return arguments[a];
                    return void 0
                },
                defaultMessage: function(b, c) {
                    return this.findDefined(this.customMessage(b.name, c), this.customDataMessage(b, c), !this.settings.ignoreTitle && b.title || void 0, a.validator.messages[c], "<strong>Warning: No message defined for " + b.name + "</strong>")
                },
                formatAndAdd: function(b, c) {
                    var d = this.defaultMessage(b, c.method),
                        e = /\$?\{(\d+)\}/g;
                    "function" == typeof d ? d = d.call(this, c.parameters, b) : e.test(d) && (d = a.validator.format(d.replace(e, "{$1}"), c.parameters)), this.errorList.push({
                        message: d,
                        element: b,
                        method: c.method
                    }), this.errorMap[b.name] = d, this.submitted[b.name] = d
                },
                addWrapper: function(a) {
                    return this.settings.wrapper && (a = a.add(a.parent(this.settings.wrapper))), a
                },
                defaultShowErrors: function() {
                    var a, b, c;
                    for (a = 0; this.errorList[a]; a++) c = this.errorList[a], this.settings.highlight && this.settings.highlight.call(this, c.element, this.settings.errorClass, this.settings.validClass), this.showLabel(c.element, c.message);
                    if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
                        for (a = 0; this.successList[a]; a++) this.showLabel(this.successList[a]);
                    if (this.settings.unhighlight)
                        for (a = 0, b = this.validElements(); b[a]; a++) this.settings.unhighlight.call(this, b[a], this.settings.errorClass, this.settings.validClass);
                    this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
                },
                validElements: function() {
                    return this.currentElements.not(this.invalidElements())
                },
                invalidElements: function() {
                    return a(this.errorList).map(function() {
                        return this.element
                    })
                },
                showLabel: function(b, c) {
                    var d, e, f, g = this.errorsFor(b),
                        h = this.idOrName(b),
                        i = a(b).attr("aria-describedby");
                    g.length ? (g.removeClass(this.settings.validClass).addClass(this.settings.errorClass), g.html(c)) : (g = a("<" + this.settings.errorElement + ">").attr("id", h + "-error").addClass(this.settings.errorClass).html(c || ""), d = g, this.settings.wrapper && (d = g.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(d) : this.settings.errorPlacement ? this.settings.errorPlacement(d, a(b)) : d.insertAfter(b), g.is("label") ? g.attr("for", h) : 0 === g.parents("label[for='" + h + "']").length && (f = g.attr("id").replace(/(:|\.|\[|\])/g, "\\$1"), i ? i.match(new RegExp("\\b" + f + "\\b")) || (i += " " + f) : i = f, a(b).attr("aria-describedby", i), e = this.groups[b.name], e && a.each(this.groups, function(b, c) {
                        c === e && a("[name='" + b + "']", this.currentForm).attr("aria-describedby", g.attr("id"))
                    }))), !c && this.settings.success && (g.text(""), "string" == typeof this.settings.success ? g.addClass(this.settings.success) : this.settings.success(g, b)), this.toShow = this.toShow.add(g)
                },
                errorsFor: function(b) {
                    var c = this.idOrName(b),
                        d = a(b).attr("aria-describedby"),
                        e = "label[for='" + c + "'], label[for='" + c + "'] *";
                    return d && (e = e + ", #" + d.replace(/\s+/g, ", #")), this.errors().filter(e)
                },
                idOrName: function(a) {
                    return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
                },
                validationTargetFor: function(b) {
                    return this.checkable(b) && (b = this.findByName(b.name)), a(b).not(this.settings.ignore)[0]
                },
                checkable: function(a) {
                    return /radio|checkbox/i.test(a.type)
                },
                findByName: function(b) {
                    return a(this.currentForm).find("[name='" + b + "']")
                },
                getLength: function(b, c) {
                    switch (c.nodeName.toLowerCase()) {
                        case "select":
                            return a("option:selected", c).length;
                        case "input":
                            if (this.checkable(c)) return this.findByName(c.name).filter(":checked").length
                    }
                    return b.length
                },
                depend: function(a, b) {
                    return this.dependTypes[typeof a] ? this.dependTypes[typeof a](a, b) : !0
                },
                dependTypes: {
                    "boolean": function(a) {
                        return a
                    },
                    string: function(b, c) {
                        return !!a(b, c.form).length
                    },
                    "function": function(a, b) {
                        return a(b)
                    }
                },
                optional: function(b) {
                    var c = this.elementValue(b);
                    return !a.validator.methods.required.call(this, c, b) && "dependency-mismatch"
                },
                startRequest: function(a) {
                    this.pending[a.name] || (this.pendingRequest++, this.pending[a.name] = !0)
                },
                stopRequest: function(b, c) {
                    this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[b.name], c && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (a(this.currentForm).submit(), this.formSubmitted = !1) : !c && 0 === this.pendingRequest && this.formSubmitted && (a(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
                },
                previousValue: function(b) {
                    return a.data(b, "previousValue") || a.data(b, "previousValue", {
                        old: null,
                        valid: !0,
                        message: this.defaultMessage(b, "remote")
                    })
                }
            },
            classRuleSettings: {
                required: {
                    required: !0
                },
                email: {
                    email: !0
                },
                url: {
                    url: !0
                },
                date: {
                    date: !0
                },
                dateISO: {
                    dateISO: !0
                },
                number: {
                    number: !0
                },
                digits: {
                    digits: !0
                },
                creditcard: {
                    creditcard: !0
                }
            },
            addClassRules: function(b, c) {
                b.constructor === String ? this.classRuleSettings[b] = c : a.extend(this.classRuleSettings, b)
            },
            classRules: function(b) {
                var c = {},
                    d = a(b).attr("class");
                return d && a.each(d.split(" "), function() {
                    this in a.validator.classRuleSettings && a.extend(c, a.validator.classRuleSettings[this])
                }), c
            },
            attributeRules: function(b) {
                var c, d, e = {},
                    f = a(b),
                    g = b.getAttribute("type");
                for (c in a.validator.methods) "required" === c ? (d = b.getAttribute(c), "" === d && (d = !0), d = !!d) : d = f.attr(c), /min|max/.test(c) && (null === g || /number|range|text/.test(g)) && (d = Number(d)), d || 0 === d ? e[c] = d : g === c && "range" !== g && (e[c] = !0);
                return e.maxlength && /-1|2147483647|524288/.test(e.maxlength) && delete e.maxlength, e
            },
            dataRules: function(b) {
                var c, d, e = {},
                    f = a(b);
                for (c in a.validator.methods) d = f.data("rule" + c.charAt(0).toUpperCase() + c.substring(1).toLowerCase()), void 0 !== d && (e[c] = d);
                return e
            },
            staticRules: function(b) {
                var c = {},
                    d = a.data(b.form, "validator");
                return d.settings.rules && (c = a.validator.normalizeRule(d.settings.rules[b.name]) || {}), c
            },
            normalizeRules: function(b, c) {
                return a.each(b, function(d, e) {
                    if (e === !1) return void delete b[d];
                    if (e.param || e.depends) {
                        var f = !0;
                        switch (typeof e.depends) {
                            case "string":
                                f = !!a(e.depends, c.form).length;
                                break;
                            case "function":
                                f = e.depends.call(c, c)
                        }
                        f ? b[d] = void 0 !== e.param ? e.param : !0 : delete b[d]
                    }
                }), a.each(b, function(d, e) {
                    b[d] = a.isFunction(e) ? e(c) : e
                }), a.each(["minlength", "maxlength"], function() {
                    b[this] && (b[this] = Number(b[this]))
                }), a.each(["rangelength", "range"], function() {
                    var c;
                    b[this] && (a.isArray(b[this]) ? b[this] = [Number(b[this][0]), Number(b[this][1])] : "string" == typeof b[this] && (c = b[this].replace(/[\[\]]/g, "").split(/[\s,]+/), b[this] = [Number(c[0]), Number(c[1])]))
                }), a.validator.autoCreateRanges && (null != b.min && null != b.max && (b.range = [b.min, b.max], delete b.min, delete b.max), null != b.minlength && null != b.maxlength && (b.rangelength = [b.minlength, b.maxlength], delete b.minlength, delete b.maxlength)), b
            },
            normalizeRule: function(b) {
                if ("string" == typeof b) {
                    var c = {};
                    a.each(b.split(/\s/), function() {
                        c[this] = !0
                    }), b = c
                }
                return b
            },
            addMethod: function(b, c, d) {
                a.validator.methods[b] = c, a.validator.messages[b] = void 0 !== d ? d : a.validator.messages[b], c.length < 3 && a.validator.addClassRules(b, a.validator.normalizeRule(b))
            },
            methods: {
                required: function(b, c, d) {
                    if (!this.depend(d, c)) return "dependency-mismatch";
                    if ("select" === c.nodeName.toLowerCase()) {
                        var e = a(c).val();
                        return e && e.length > 0
                    }
                    return this.checkable(c) ? this.getLength(b, c) > 0 : a.trim(b).length > 0
                },
                email: function(a, b) {
                    return this.optional(b) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)
                },
                url: function(a, b) {
                    return this.optional(b) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)
                },
                date: function(a, b) {
                    return this.optional(b) || !/Invalid|NaN/.test(new Date(a).toString())
                },
                dateISO: function(a, b) {
                    return this.optional(b) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)
                },
                number: function(a, b) {
                    return this.optional(b) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)
                },
                digits: function(a, b) {
                    return this.optional(b) || /^\d+$/.test(a)
                },
                creditcard: function(a, b) {
                    if (this.optional(b)) return "dependency-mismatch";
                    if (/[^0-9 \-]+/.test(a)) return !1;
                    var c, d, e = 0,
                        f = 0,
                        g = !1;
                    if (a = a.replace(/\D/g, ""), a.length < 13 || a.length > 19) return !1;
                    for (c = a.length - 1; c >= 0; c--) d = a.charAt(c), f = parseInt(d, 10), g && (f *= 2) > 9 && (f -= 9), e += f, g = !g;
                    return e % 10 === 0
                },
                minlength: function(b, c, d) {
                    var e = a.isArray(b) ? b.length : this.getLength(b, c);
                    return this.optional(c) || e >= d
                },
                maxlength: function(b, c, d) {
                    var e = a.isArray(b) ? b.length : this.getLength(b, c);
                    return this.optional(c) || d >= e
                },
                rangelength: function(b, c, d) {
                    var e = a.isArray(b) ? b.length : this.getLength(b, c);
                    return this.optional(c) || e >= d[0] && e <= d[1]
                },
                min: function(a, b, c) {
                    return this.optional(b) || a >= c
                },
                max: function(a, b, c) {
                    return this.optional(b) || c >= a
                },
                range: function(a, b, c) {
                    return this.optional(b) || a >= c[0] && a <= c[1]
                },
                equalTo: function(b, c, d) {
                    var e = a(d);
                    return this.settings.onfocusout && e.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                        a(c).valid()
                    }), b === e.val()
                },
                remote: function(b, c, d) {
                    if (this.optional(c)) return "dependency-mismatch";
                    var e, f, g = this.previousValue(c);
                    return this.settings.messages[c.name] || (this.settings.messages[c.name] = {}), g.originalMessage = this.settings.messages[c.name].remote, this.settings.messages[c.name].remote = g.message, d = "string" == typeof d && {
                        url: d
                    } || d, g.old === b ? g.valid : (g.old = b, e = this, this.startRequest(c), f = {}, f[c.name] = b, a.ajax(a.extend(!0, {
                        url: d,
                        mode: "abort",
                        port: "validate" + c.name,
                        dataType: "json",
                        data: f,
                        context: e.currentForm,
                        success: function(d) {
                            var f, h, i, j = d === !0 || "true" === d;
                            e.settings.messages[c.name].remote = g.originalMessage, j ? (i = e.formSubmitted, e.prepareElement(c), e.formSubmitted = i, e.successList.push(c), delete e.invalid[c.name], e.showErrors()) : (f = {}, h = d || e.defaultMessage(c, "remote"), f[c.name] = g.message = a.isFunction(h) ? h(b) : h, e.invalid[c.name] = !0, e.showErrors(f)), g.valid = j, e.stopRequest(c, j)
                        }
                    }, d)), "pending")
                }
            }
        }), a.format = function() {
            throw "$.format has been deprecated. Please use $.validator.format instead."
        };
        var b, c = {};
        a.ajaxPrefilter ? a.ajaxPrefilter(function(a, b, d) {
            var e = a.port;
            "abort" === a.mode && (c[e] && c[e].abort(), c[e] = d)
        }) : (b = a.ajax, a.ajax = function(d) {
            var e = ("mode" in d ? d : a.ajaxSettings).mode,
                f = ("port" in d ? d : a.ajaxSettings).port;
            return "abort" === e ? (c[f] && c[f].abort(), c[f] = b.apply(this, arguments), c[f]) : b.apply(this, arguments)
        }), a.extend(a.fn, {
            validateDelegate: function(b, c, d) {
                return this.bind(c, function(c) {
                    var e = a(c.target);
                    return e.is(b) ? d.apply(e, arguments) : void 0
                })
            }
        })
    });

    // shareThis?
    if (typeof(stlib) == "undefined") {
        var stlib = {}
    }
    if (!stlib.functions) {
        stlib.functions = [];
        stlib.functionCount = 0
    }
    stlib.global = {};
    stlib.global.hash = document.location.href.split("#");
    stlib.global.hash.shift();
    stlib.global.hash = stlib.global.hash.join("#");
    stlib.dynamicOn = true;
    stlib.debugOn = false;
    stlib.debug = {
        count: 0,
        messages: [],
        debug: function(b, a) {
            if (a && (typeof console) != "undefined") {
                console.log(b)
            }
            stlib.debug.messages.push(b)
        },
        show: function(a) {
            for (message in stlib.debug.messages) {
                if ((typeof console) != "undefined") {
                    if (a) {
                        /ERROR/.test(stlib.debug.messages[message]) ? console.log(stlib.debug.messages[message]) : null
                    } else {
                        console.log(stlib.debug.messages[message])
                    }
                }
            }
        },
        showError: function() {
            stlib.debug.show(true)
        }
    };
    var _$d = function(a) {
        stlib.debug.debug(a, stlib.debugOn)
    };
    var _$d0 = function() {
        _$d(" ")
    };
    var _$d_ = function() {
        _$d("___________________________________________")
    };
    var _$d1 = function(a) {
        _$d(_$dt() + "| " + a)
    };
    var _$d2 = function(a) {
        _$d(_$dt() + "|  * " + a)
    };
    var _$de = function(a) {
        _$d(_$dt() + "ERROR: " + a)
    };
    var _$dt = function() {
        var b = new Date();
        var e = b.getHours();
        var a = b.getMinutes();
        var d = b.getSeconds();
        return e + ":" + a + ":" + d + " > "
    };
    stlib.allServices = {
        adfty: {
            title: "Adfty"
        },
        allvoices: {
            title: "Allvoices"
        },
        amazon_wishlist: {
            title: "Amazon Wishlist"
        },
        arto: {
            title: "Arto"
        },
        att: {
            title: "AT&T"
        },
        baidu: {
            title: "Baidu"
        },
        blinklist: {
            title: "Blinklist"
        },
        blip: {
            title: "Blip"
        },
        blogmarks: {
            title: "Blogmarks"
        },
        blogger: {
            title: "Blogger",
            type: "post"
        },
        buddymarks: {
            title: "BuddyMarks"
        },
        buffer: {
            title: "Buffer"
        },
        care2: {
            title: "Care2"
        },
        chiq: {
            title: "chiq"
        },
        citeulike: {
            title: "CiteULike"
        },
        chiq: {
            title: "chiq"
        },
        corkboard: {
            title: "Corkboard"
        },
        dealsplus: {
            title: "Dealspl.us"
        },
        delicious: {
            title: "Delicious"
        },
        digg: {
            title: "Digg"
        },
        diigo: {
            title: "Diigo"
        },
        dzone: {
            title: "DZone"
        },
        edmodo: {
            title: "Edmodo"
        },
        email: {
            title: "Email"
        },
        embed_ly: {
            title: "Embed.ly"
        },
        evernote: {
            title: "Evernote"
        },
        facebook: {
            title: "Facebook"
        },
        fark: {
            title: "Fark"
        },
        fashiolista: {
            title: "Fashiolista"
        },
        flipboard: {
            title: "Flipboard"
        },
        folkd: {
            title: "folkd.com"
        },
        foodlve: {
            title: "FoodLve"
        },
        fresqui: {
            title: "Fresqui"
        },
        friendfeed: {
            title: "FriendFeed"
        },
        funp: {
            title: "Funp"
        },
        fwisp: {
            title: "fwisp"
        },
        google: {
            title: "Google"
        },
        googleplus: {
            title: "Google +"
        },
        google_bmarks: {
            title: "Bookmarks"
        },
        google_reader: {
            title: "Google Reader"
        },
        google_translate: {
            title: "Google Translate"
        },
        hatena: {
            title: "Hatena"
        },
        instapaper: {
            title: "Instapaper"
        },
        jumptags: {
            title: "Jumptags"
        },
        kaboodle: {
            title: "Kaboodle"
        },
        kik: {
            title: "Kik"
        },
        linkagogo: {
            title: "linkaGoGo"
        },
        linkedin: {
            title: "LinkedIn"
        },
        livejournal: {
            title: "LiveJournal",
            type: "post"
        },
        mail_ru: {
            title: "mail.ru"
        },
        meneame: {
            title: "Meneame"
        },
        messenger: {
            title: "Messenger"
        },
        mister_wong: {
            title: "Mr Wong"
        },
        moshare: {
            title: "moShare"
        },
        myspace: {
            title: "MySpace"
        },
        n4g: {
            title: "N4G"
        },
        netlog: {
            title: "Netlog"
        },
        netvouz: {
            title: "Netvouz"
        },
        newsvine: {
            title: "Newsvine"
        },
        nujij: {
            title: "NUjij"
        },
        odnoklassniki: {
            title: "Odnoklassniki"
        },
        oknotizie: {
            title: "Oknotizie"
        },
        pinterest: {
            title: "Pinterest"
        },
        pocket: {
            title: "Pocket"
        },
        print: {
            title: "Print"
        },
        raise_your_voice: {
            title: "Raise Your Voice"
        },
        reddit: {
            title: "Reddit"
        },
        segnalo: {
            title: "Segnalo"
        },
        sharethis: {
            title: "ShareThis"
        },
        sina: {
            title: "Sina"
        },
        sonico: {
            title: "Sonico"
        },
        startaid: {
            title: "Startaid"
        },
        startlap: {
            title: "Startlap"
        },
        stumbleupon: {
            title: "StumbleUpon"
        },
        stumpedia: {
            title: "Stumpedia"
        },
        typepad: {
            title: "TypePad",
            type: "post"
        },
        tumblr: {
            title: "Tumblr"
        },
        twitter: {
            title: "Twitter"
        },
        viadeo: {
            title: "Viadeo"
        },
        virb: {
            title: "Virb"
        },
        vkontakte: {
            title: "Vkontakte"
        },
        voxopolis: {
            title: "VOXopolis"
        },
        whatsapp: {
            title: "WhatsApp"
        },
        weheartit: {
            title: "We Heart It"
        },
        wordpress: {
            title: "WordPress",
            type: "post"
        },
        xerpi: {
            title: "Xerpi"
        },
        xing: {
            title: "Xing"
        },
        yammer: {
            title: "Yammer"
        }
    };
    stlib.allOauthServices = {
        twitter: {
            title: "Twitter"
        },
        linkedIn: {
            title: "LinkedIn"
        },
        facebook: {
            title: "Facebook"
        }
    };
    stlib.allNativeServices = {
        fblike: {
            title: "Facebook Like"
        },
        fbrec: {
            title: "Facebook Recommend"
        },
        fbsend: {
            title: "Facebook Send"
        },
        fbsub: {
            title: "Facebook Subscribe"
        },
        foursquaresave: {
            title: "Foursquare Save"
        },
        foursquarefollow: {
            title: "Foursquare Follow"
        },
        instagram: {
            title: "Instagram Badge"
        },
        plusone: {
            title: "Google +1"
        },
        pinterestfollow: {
            title: "Pinterest Follow"
        },
        twitterfollow: {
            title: "Twitter Follow"
        },
        youtube: {
            title: "Youtube Subscribe"
        }
    };
    stlib.allDeprecatedServices = {
        google_bmarks: {
            title: "Google Bookmarks"
        },
        yahoo_bmarks: {
            title: "Yahoo Bookmarks"
        }
    };
    stlib.allOtherServices = {
        copy: {
            title: "Copy Paste"
        },
        sharenow: {
            title: "ShareNow"
        },
        sharenow_auto: {
            title: "Frictionless Sharing"
        },
        fbunlike: {
            title: "Facebook Unlike"
        }
    };
    var _all_services = stlib.allServices;
    stlib.buttonInfo = {
        buttonList: [],
        addButton: function(a) {
            stlib.buttonInfo.buttonList.push(a)
        },
        getButton: function(a) {
            if (!isNaN(a)) {
                if (a >= stlib.buttonInfo.buttonList.length) {
                    return false
                } else {
                    return stlib.buttonInfo.buttonList[a]
                }
            } else {
                for (c = 0; c < stlib.buttonInfo.buttonList.length; c++) {
                    if (stlib.buttonInfo.buttonList[c].service == a) {
                        debug(stlib.buttonInfo.buttonList[c])
                    }
                }
            }
        },
        clickButton: function(a) {
            if (!isNaN(a)) {
                if (a >= stlib.buttonInfo.buttonList.length) {
                    return false
                } else {
                    if (stlib.buttonInfo.getButton(a).service == "sharethis" || stlib.buttonInfo.getButton(a).service == "email" || stlib.buttonInfo.getButton(a).service == "wordpress") {
                        stlib.buttonInfo.getButton(a).popup()
                    } else {
                        stlib.buttonInfo.getButton(a).element.childNodes[0].onclick()
                    }
                }
            } else {
                for (c = 0; c < stlib.buttonInfo.buttonList.length; c++) {
                    if (stlib.buttonInfo.buttonList[c].service == a) {
                        if (stlib.buttonInfo.getButton(c).service == "sharethis" || stlib.buttonInfo.getButton(c).service == "email" || stlib.buttonInfo.getButton(c).service == "wordpress") {
                            stlib.buttonInfo.getButton(c).popup();
                            return true
                        } else {
                            stlib.buttonInfo.getButton(c).element.childNodes[0].onclick()
                        }
                    }
                }
            }
        },
        resetButton: function() {
            stlib.buttonInfo.buttonList = []
        },
        listButton: function() {
            for (c = 0; c < stlib.buttonInfo.buttonList.length; c++) {
                debug(stlib.buttonInfo.buttonList[c])
            }
        }
    };
    stlib.buttonInfo.resetButton();
    stlib.messageQueue = function() {
        var a = this;
        this.pumpInstance = null;
        this.queue = [];
        this.dependencies = ["data"];
        this.sending = true;
        this.setPumpInstance = function(b) {
            this.pumpInstance = b
        };
        this.send = function(f, d) {
            if ((typeof(f) == "string") && (typeof(d) == "string")) {
                _$d_();
                _$d1("Queueing message: " + d + ": " + f)
            }(typeof(f) == "string") && (typeof(d) == "string") ? this.queue.push([d, f]): null;
            if (this.sending == false || stlib.browser.ieFallback) {
                if (this.pumpInstance != null) {
                    if (this.dependencies.length > 0) {
                        for (messageSet in this.queue) {
                            if (this.queue.hasOwnProperty(messageSet) && this.queue[messageSet][0] == this.dependencies[0]) {
                                if (this.queue.length > 0) {
                                    _$d1("Current Queue Length: " + this.queue.length);
                                    var b = this.queue.shift();
                                    this.pumpInstance.broadcastSendMessage(b[1]);
                                    this.dependencies.shift();
                                    this.sending = true
                                }
                            }
                        }
                    } else {
                        if (this.queue.length > 0) {
                            _$d1("Current Queue Length: " + this.queue.length);
                            var b = this.queue.shift();
                            this.pumpInstance.broadcastSendMessage(b[1]);
                            this.sending = true
                        }
                    }
                } else {
                    _$d_();
                    _$d1("Pump is null")
                }
            }
            if ((stlib.browser.ieFallback) && (this.queue.length > 0)) {
                var e = "process" + stlib.functionCount;
                stlib.functionCount++;
                stlib.functions[e] = a.process;
                setTimeout("stlib.functions['" + e + "']()", 500)
            }
        };
        this.process = function() {
            _$d1("Processing MessageQueue");
            a.sending = false;
            _$d(this.queue);
            a.send()
        }
    };
    stlib.sharer = {
        sharerUrl: (("https:" == document.location.protocol) ? "https://ws." : "http://wd.") + "sharethis.com/api/sharer.php",
        regAuto: new RegExp(/(.*?)_auto$/),
        constructParamString: function() {
            stlib.data.validate();
            stlib.hash.checkURL();
            var a = stlib.data.pageInfo;
            var d = "?";
            var b;
            for (b in a) {
                d += b + "=" + encodeURIComponent(a[b]) + "&";
                _$d1("constructParamStringPageInfo: " + b + ": " + a[b])
            }
            a = stlib.data.shareInfo;
            for (b in a) {
                d += b + "=" + encodeURIComponent(a[b]) + "&";
                _$d1("constructParamStringShareInfo: " + b + ": " + a[b])
            }
            d += "ts=" + new Date().getTime() + "&";
            return d.substring(0, d.length - 1)
        },
        stPrint: function() {
            window.print()
        },
        sharePinterest: function() {
            if (stlib.data.get("image", "shareInfo") == false || stlib.data.get("image", "shareInfo") == null || stlib.data.get("pinterest_native", "shareInfo") == "true") {
                if (typeof(stWidget) != "undefined" && typeof(stWidget.closeWidget) === "function") {
                    stWidget.closeWidget()
                }
                if (typeof(stcloseWidget) === "function") {
                    stcloseWidget()
                }
                if (typeof(stToolbar) != "undefined" && typeof(stToolbar.closeWidget) === "function") {
                    stToolbar.closeWidget()
                }
                var a = document.createElement("script");
                a.setAttribute("type", "text/javascript");
                a.setAttribute("charset", "UTF-8");
                a.setAttribute("src", "//assets.pinterest.com/js/pinmarklet.js?r=" + Math.random() * 99999999);
                document.body.appendChild(a)
            }
        },
        share: function(e, a) {
            var d = stlib.sharer.constructParamString();
            _$d_();
            _$d1("Initiating a Share with the following url:");
            _$d2(stlib.sharer.sharerUrl + d);
            if ((stlib.data.get("destination", "shareInfo") == "print") || (stlib.data.get("destination", "shareInfo") == "email") || (stlib.data.get("destination", "shareInfo") == "pinterest" && stlib.data.get("source", "shareInfo").match(/share4xmobile/) == null && stlib.data.get("source", "shareInfo").match(/share4xpage/) == null && stlib.data.get("source", "shareInfo").match(/5xpage/) == null && (stlib.data.get("image", "shareInfo") == false || stlib.data.get("image", "shareInfo") == null)) || stlib.data.get("destination", "shareInfo") == "snapsets" || stlib.data.get("destination", "shareInfo") == "copy" || stlib.data.get("destination", "shareInfo") == "plusone" || stlib.data.get("destination", "shareInfo").match(stlib.sharer.regAuto) || (typeof(stlib.nativeButtons) != "undefined" && stlib.nativeButtons.checkNativeButtonSupport(stlib.data.get("destination", "shareInfo"))) || (stlib.data.get("pinterest_native", "shareInfo") != false && stlib.data.get("pinterest_native", "shareInfo") != null)) {
                var b = new Image(1, 1);
                b.src = stlib.sharer.sharerUrl + d;
                b.onload = function() {
                    return
                }
            } else {
                if (typeof(a) != "undefined" && a == true) {
                    window.open(stlib.sharer.sharerUrl + d, (new Date()).valueOf(), "scrollbars=1, status=1, height=480, width=640, resizable=1")
                } else {
                    window.open(stlib.sharer.sharerUrl + d)
                }
            }
            e ? e() : null
        }
    };
    stlib.browser = {
        iemode: null,
        firefox: null,
        firefoxVersion: null,
        safari: null,
        chrome: null,
        opera: null,
        windows: null,
        mac: null,
        ieFallback: (/MSIE [6789]/).test(navigator.userAgent),
        init: function() {
            var a = navigator.userAgent.toString().toLowerCase();
            if (/msie|trident/i.test(a)) {
                if (document.documentMode) {
                    stlib.browser.iemode = document.documentMode
                } else {
                    stlib.browser.iemode = 5;
                    if (document.compatMode) {
                        if (document.compatMode == "CSS1Compat") {
                            stlib.browser.iemode = 7
                        }
                    }
                }
            }
            stlib.browser.firefox = ((a.indexOf("firefox") != -1) && (typeof InstallTrigger !== "undefined")) ? true : false;
            stlib.browser.firefoxVersion = (a.indexOf("firefox/5.0") != -1 || a.indexOf("firefox/9.0") != -1) ? false : true;
            stlib.browser.safari = (a.indexOf("safari") != -1 && a.indexOf("chrome") == -1) ? true : false;
            stlib.browser.chrome = (a.indexOf("safari") != -1 && a.indexOf("chrome") != -1) ? true : false;
            stlib.browser.opera = (window.opera || a.indexOf(" opr/") >= 0) ? true : false;
            stlib.browser.windows = (a.indexOf("windows") != -1) ? true : false;
            stlib.browser.mac = (a.indexOf("macintosh") != -1) ? true : false
        },
        getIEVersion: function() {
            return stlib.browser.iemode
        },
        isFirefox: function() {
            return stlib.browser.firefox
        },
        firefox8Version: function() {
            return stlib.browser.firefoxVersion
        },
        isSafari: function() {
            return stlib.browser.safari
        },
        isWindows: function() {
            return stlib.browser.windows
        },
        isChrome: function() {
            return stlib.browser.chrome
        },
        isOpera: function() {
            return stlib.browser.opera
        },
        isMac: function() {
            return stlib.browser.mac
        }
    };
    stlib.browser.init();
    stlib.browser.mobile = {
        mobile: false,
        uagent: null,
        android: null,
        iOs: null,
        silk: null,
        windows: null,
        kindle: null,
        url: null,
        sharCreated: false,
        sharUrl: null,
        isExcerptImplementation: false,
        iOsVer: 0,
        init: function() {
            this.uagent = navigator.userAgent.toLowerCase();
            if (this.isAndroid()) {
                this.mobile = true
            } else {
                if (this.isIOs()) {
                    this.mobile = true
                } else {
                    if (this.isSilk()) {
                        this.mobile = true
                    } else {
                        if (this.isWindowsPhone()) {
                            this.mobile = true
                        } else {
                            if (this.isKindle()) {
                                this.mobile = true
                            }
                        }
                    }
                }
            }
        },
        isMobile: function isMobile() {
            return this.mobile
        },
        isAndroid: function() {
            if (this.android === null) {
                this.android = this.uagent.indexOf("android") > -1
            }
            return this.android
        },
        isKindle: function() {
            if (this.kindle === null) {
                this.kindle = this.uagent.indexOf("kindle") > -1
            }
            return this.kindle
        },
        isIOs: function isIOs() {
            if (this.iOs === null) {
                this.iOs = (this.uagent.indexOf("ipad") > -1) || (this.uagent.indexOf("ipod") > -1) || (this.uagent.indexOf("iphone") > -1)
            }
            return this.iOs
        },
        isSilk: function() {
            if (this.silk === null) {
                this.silk = this.uagent.indexOf("silk") > -1
            }
            return this.silk
        },
        getIOSVersion: function() {
            if (this.isIOs()) {
                this.iOsVer = this.uagent.substr((this.uagent.indexOf("os ")) + 3, 5).replace(/\_/g, ".")
            }
            return this.iOsVer
        },
        isWindowsPhone: function() {
            if (this.windows === null) {
                this.windows = this.uagent.indexOf("windows phone") > -1
            }
            return this.windows
        },
        handleForMobileFriendly: function(k, d, l) {
            if (!this.isMobile()) {
                return false
            }
            if (typeof(stLight) === "undefined") {
                stLight = {};
                stLight.publisher = d.publisher;
                stLight.sessionID = d.sessionID;
                stLight.fpc = ""
            }
            var t = (typeof(k.title) !== "undefined") ? k.title : encodeURIComponent(document.title);
            var e = (typeof(k.url) !== "undefined") ? k.url : document.URL;
            var u = (d.short_url != "" && d.short_url != null) ? d.short_url : "";
            if (d.service == "sharethis") {
                var t = (typeof(k.title) !== "undefined") ? k.title : encodeURIComponent(document.title);
                var e = (typeof(k.url) !== "undefined") ? k.url : document.URL;
                var f = "";
                if (typeof(k.summary) != "undefined" && k.summary != null) {
                    f = k.summary
                }
                var a = document.createElement("form");
                a.setAttribute("method", "GET");
                a.setAttribute("action", "http://edge.sharethis.com/share4x/mobile.html");
                a.setAttribute("target", "_blank");
                var p = {
                    url: e,
                    title: t,
                    summary: f,
                    destination: d.service,
                    publisher: stLight.publisher,
                    fpc: stLight.fpc,
                    sessionID: stLight.sessionID,
                    short_url: u
                };
                if (typeof(k.image) != "undefined" && k.image != null) {
                    p.image = k.image
                }
                if (typeof(k.summary) != "undefined" && k.summary != null) {
                    p.desc = k.summary
                }
                if (typeof(l) != "undefined" && typeof(l.exclusive_services) != "undefined" && l.exclusive_services != null) {
                    p.exclusive_services = l.exclusive_services
                }
                if (typeof(d.exclusive_services) != "undefined" && d.exclusive_services != null) {
                    p.exclusive_services = d.exclusive_services
                }
                if (typeof(l) != "undefined" && typeof(l.services) != "undefined" && l.services != null) {
                    p.services = l.services
                }
                if (typeof(d.services) != "undefined" && d.services != null) {
                    p.services = d.services
                }
                var h = d;
                if (typeof(l) != "undefined") {
                    h = l
                }
                if (typeof(h.doNotHash) != "undefined" && h.doNotHash != null) {
                    p.doNotHash = h.doNotHash
                }
                if (typeof(k.via) != "undefined" && k.via != null) {
                    p.via = k.via
                }
                p.service = d.service;
                p.type = d.type;
                if (stlib.data) {
                    var r = stlib.json.encode(stlib.data.pageInfo);
                    var q = stlib.json.encode(stlib.data.shareInfo);
                    if (stlib.browser.isFirefox() && !stlib.browser.firefox8Version()) {
                        r = encodeURIComponent(encodeURIComponent(r));
                        q = encodeURIComponent(encodeURIComponent(q))
                    } else {
                        r = encodeURIComponent(r);
                        q = encodeURIComponent(q)
                    }
                    p.pageInfo = r;
                    p.shareInfo = q
                }
                for (var s in p) {
                    var g = document.createElement("input");
                    g.setAttribute("type", "hidden");
                    g.setAttribute("name", s);
                    g.setAttribute("value", p[s]);
                    a.appendChild(g)
                }
                document.body.appendChild(a);
                a.submit();
                return true
            }
            if (d.service == "email") {
                var b, n = 0;
                stlib.browser.mobile.url = e;
                if (stlib.browser.mobile.sharUrl == null) {
                    stlib.browser.mobile.createSharOnPage()
                }
                var j = (u != "") ? u + "%0A%0a" : "{sharURLValue}%0A%0a";
                if ((typeof(k.summary) != "undefined") && k.summary != null) {
                    j += k.summary + "%0A%0a"
                }
                j += "Sent using ShareThis";
                var m = "mailto:?";
                m += "subject=" + t;
                m += "&body=" + j;
                b = setInterval(function() {
                    if (stlib.browser.mobile.sharUrl != null) {
                        clearInterval(b);
                        window.location.href = m.replace("{sharURLValue}", stlib.browser.mobile.sharUrl)
                    }
                    if (n > 500) {
                        clearInterval(b);
                        window.location.href = m.replace("{sharURLValue}", stlib.browser.mobile.sharUrl)
                    }
                    n++
                }, 100)
            }
            return true
        },
        createSharOnPage: function() {
            if (stlib.browser.mobile.url !== "" && stlib.browser.mobile.url !== " " && stlib.browser.mobile.url !== null && !stlib.browser.mobile.sharCreated) {
                var a = ["return=json", "cb=stlib.browser.mobile.createSharOnPage_onSuccess", "service=createSharURL", "url=" + encodeURIComponent(stlib.browser.mobile.url)];
                a = a.join("&");
                stlib.scriptLoader.loadJavascript((("https:" == document.location.protocol) ? "https://ws." : "http://wd.") + "sharethis.com/api/getApi.php?" + a, function() {})
            }
        },
        createSharOnPage_onSuccess: function(a) {
            if (a.status == "SUCCESS") {
                stlib.browser.mobile.sharCreated = true;
                stlib.browser.mobile.sharUrl = a.data.sharURL
            } else {
                stlib.browser.mobile.sharUrl = stlib.browser.mobile.url
            }
        }
    };
    stlib.browser.mobile.init();
    stlib.util = {
        getWindowDoc: function() {
            return window.document
        }
    };
    var tpcCookiesEnableCheckingDone = false;
    var tpcCookiesEnabledStatus = true;
    stlib.cookie = {
        setCookie: function(e, n, p) {
            var d = (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1);
            var b = (navigator.userAgent.indexOf("MSIE") != -1);
            if (d || b) {
                var r = (p) ? p * 24 * 60 * 60 : 0;
                var k = document.createElement("div");
                k.setAttribute("id", e);
                k.setAttribute("type", "hidden");
                document.body.appendChild(k);
                var a = document.getElementById(e),
                    f = document.createElement("form");
                try {
                    var m = document.createElement('<iframe name="' + e + '" ></iframe>')
                } catch (l) {
                    m = document.createElement("iframe")
                }
                m.name = e;
                m.src = "javascript:false";
                m.style.display = "none";
                a.appendChild(m);
                f.action = (("https:" == document.location.protocol) ? "https://sharethis.com/" : "http://sharethis.com/") + "account/setCookie.php";
                f.method = "POST";
                var j = document.createElement("input");
                j.setAttribute("type", "hidden");
                j.setAttribute("name", "name");
                j.setAttribute("value", e);
                f.appendChild(j);
                var q = document.createElement("input");
                q.setAttribute("type", "hidden");
                q.setAttribute("name", "value");
                q.setAttribute("value", n);
                f.appendChild(q);
                var o = document.createElement("input");
                o.setAttribute("type", "hidden");
                o.setAttribute("name", "time");
                o.setAttribute("value", r);
                f.appendChild(o);
                f.target = e;
                a.appendChild(f);
                f.submit()
            } else {
                if (p) {
                    var i = new Date();
                    i.setTime(i.getTime() + (p * 24 * 60 * 60 * 1000));
                    var g = "; expires=" + i.toGMTString()
                } else {
                    var g = ""
                }
                var h = e + "=" + escape(n) + g;
                h += "; domain=" + escape(".sharethis.com") + ";path=/";
                document.cookie = h
            }
        },
        setTempCookie: function(e, f, g) {
            if (g) {
                var d = new Date();
                d.setTime(d.getTime() + (g * 24 * 60 * 60 * 1000));
                var a = "; expires=" + d.toGMTString()
            } else {
                var a = ""
            }
            var b = e + "=" + escape(f) + a;
            b += "; domain=" + escape(".sharethis.com") + ";path=/";
            document.cookie = b
        },
        getCookie: function(b) {
            var a = document.cookie.match("(^|;) ?" + b + "=([^;]*)(;|$)");
            if (a) {
                return (unescape(a[2]))
            } else {
                return false
            }
        },
        deleteCookie: function(e) {
            var l = "/";
            var k = ".sharethis.com";
            document.cookie = e.replace(/^\s+|\s+$/g, "") + "=" + ((l) ? ";path=" + l : "") + ((k) ? ";domain=" + k : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
            var d = (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1);
            var b = (navigator.userAgent.indexOf("MSIE") != -1);
            if (d || b) {
                var h = document.createElement("div");
                h.setAttribute("id", e);
                h.setAttribute("type", "hidden");
                document.body.appendChild(h);
                var a = document.getElementById(e),
                    f = document.createElement("form");
                try {
                    var j = document.createElement('<iframe name="' + e + '" ></iframe>')
                } catch (i) {
                    j = document.createElement("iframe")
                }
                j.name = e;
                j.src = "javascript:false";
                j.style.display = "none";
                a.appendChild(j);
                f.action = (("https:" == document.location.protocol) ? "https://sharethis.com/" : "http://sharethis.com/") + "account/deleteCookie.php";
                f.method = "POST";
                var g = document.createElement("input");
                g.setAttribute("type", "hidden");
                g.setAttribute("name", "name");
                g.setAttribute("value", e);
                f.appendChild(g);
                f.target = e;
                a.appendChild(f);
                f.submit()
            }
        },
        deleteAllSTCookie: function() {
            var e = document.cookie;
            e = e.split(";");
            for (var g = 0; g < e.length; g++) {
                var d = e[g];
                d = d.split("=");
                if (!/st_optout/.test(d[0])) {
                    var f = d[0];
                    var j = "/";
                    var h = ".edge.sharethis.com";
                    document.cookie = f + "=;path=" + j + ";domain=" + h + ";expires=Thu, 01-Jan-1970 00:00:01 GMT"
                }
            }
        },
        setFpcCookie: function(a, h) {
            var d = new Date;
            var j = d.getFullYear();
            var g = d.getMonth() + 9;
            var i = d.getDate();
            var e = a + "=" + escape(h);
            if (j) {
                var b = new Date(j, g, i);
                e += "; expires=" + b.toGMTString()
            }
            var f = stlib.cookie.getDomain();
            e += "; domain=" + escape(f) + ";path=/";
            document.cookie = e
        },
        getFpcCookie: function(b) {
            var a = document.cookie.match("(^|;) ?" + b + "=([^;]*)(;|$)");
            if (a) {
                return (unescape(a[2]))
            } else {
                return false
            }
        },
        getDomain: function() {
            var b = document.domain.split(/\./);
            var a = "";
            if (b.length > 1) {
                a = "." + b[b.length - 2] + "." + b[b.length - 1]
            }
            return a
        },
        checkCookiesEnabled: function() {
            if (!tpcCookiesEnableCheckingDone) {
                stlib.cookie.setTempCookie("STPC", "yes", 1);
                if (stlib.cookie.getCookie("STPC") == "yes") {
                    tpcCookiesEnabledStatus = true
                } else {
                    tpcCookiesEnabledStatus = false
                }
                tpcCookiesEnableCheckingDone = true;
                return tpcCookiesEnabledStatus
            } else {
                return tpcCookiesEnabledStatus
            }
        },
        hasLocalStorage: function() {
            try {
                localStorage.setItem("stStorage", "yes");
                localStorage.removeItem("stStorage");
                return true
            } catch (a) {
                return false
            }
        }
    };
    stlib.fpc = {
        cookieName: "__unam",
        cookieValue: "",
        createFpc: function() {
            if (!document.domain || document.domain.search(/\.gov/) > 0) {
                return false
            }
            var i = stlib.cookie.getFpcCookie(stlib.fpc.cookieName);
            if (i == false) {
                var d = Math.round(Math.random() * 2147483647);
                d = d.toString(16);
                var g = (new Date()).getTime();
                g = g.toString(16);
                var f = window.location.hostname.split(/\./)[1];
                if (!f) {
                    return false
                }
                var h = "";
                h = stlib.fpc.determineHash(f) + "-" + g + "-" + d + "-1";
                i = h
            } else {
                var b = i;
                var a = b.split(/\-/);
                if (a.length == 4) {
                    var e = Number(a[3]);
                    e++;
                    i = a[0] + "-" + a[1] + "-" + a[2] + "-" + e
                }
            }
            stlib.cookie.setFpcCookie(stlib.fpc.cookieName, i);
            stlib.fpc.cookieValue = i;
            return i
        },
        determineHash: function(b) {
            var f = 0;
            var e = 0;
            for (var d = b.length - 1; d >= 0; d--) {
                var a = parseInt(b.charCodeAt(d));
                f = ((f << 8) & 268435455) + a + (a << 12);
                if ((e = f & 161119850) != 0) {
                    f = (f ^ (e >> 20))
                }
            }
            return f.toString(16)
        }
    };
    stlib.validate = {
        regexes: {
            notEncoded: /(%[^0-7])|(%[0-7][^0-9a-f])|["{}\[\]\<\>\\\^`\|]/gi,
            tooEncoded: /%25([0-7][0-9a-f])/gi,
            publisher: /^(([a-z]{2}(-|\.))|)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            url: /^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i,
            fpc: /^[0-9a-f]{7}-[0-9a-f]{11}-[0-9a-f]{7,8}-[0-9]*$/i,
            sessionID: /^[0-9]*\.[0-9a-f]*$/i,
            title: /.*/,
            description: /.*/,
            buttonType: /^(chicklet|vcount|hcount|large|custom|button|)$/,
            comment: /.*/,
            destination: /.*/,
            source: /.*/,
            image: /(^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))|^$/i,
            sourceURL: /^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i,
            sharURL: /(^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))|^$/i
        }
    };
    stlib.html = {
        encode: function(a) {
            if (stlib.html.startsWith(a, "http")) {
                return String(a).replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            } else {
                return String(a).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            }
        },
        startsWith: function(a, b) {
            return (a.match("^" + b) == b)
        }
    };
    stlib.stfp = {
        screenResolutionDepthHash: "ERROR",
        pluginsListHash: "ERROR",
        fontsListHash: "ERROR",
        timezoneoffsetHash: "ERROR",
        checkIEPlugins: ["ShockwaveFlash.ShockwaveFlash", "AcroPDF.PDF", "PDF.PdfCtrl", "QuickTime.QuickTime", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "RealPlayer", "SWCtl.SWCtl", "WMPlayer.OCX", "AgControl.AgControl", "Skype.Detection"],
        getPluginsHash: function() {
            var b = "";
            if (stlib.browser.getIEVersion() != null) {
                for (var a = 0; a < stlib.stfp.checkIEPlugins.length; a++) {
                    try {
                        new ActiveXObject(stlib.stfp.checkIEPlugins[a]);
                        b += stlib.stfp.checkIEPlugins[a] + ":"
                    } catch (d) {}
                }
            }
            if (stlib.browser.getIEVersion() == null || stlib.browser.getIEVersion() >= 11) {
                if (((typeof navigator) != "undefined" || navigator != null) && ((typeof navigator.plugins) != "undefined" || navigator.plugins != null)) {
                    for (var a = 0; a < navigator.plugins.length; a++) {
                        b += navigator.plugins[a].name + ":"
                    }
                }
            }
            if (b.length > 0) {
                stlib.stfp.pluginsListHash = stlib.stfp.getFpHash(b)
            }
        },
        getResolutionDepthHash: function() {
            if (screen) {
                stlib.stfp.screenResolutionDepthHash = stlib.stfp.getFpHash((((typeof screen.width) != "undefined") ? screen.width : "NA") + ":" + (((typeof screen.height) != "undefined") ? screen.height : "NA") + ":" + (((typeof screen.colorDepth) != "undefined") ? screen.colorDepth : "NA"))
            }
        },
        getTimezoneOffsetHash: function() {
            var b = new Date();
            var a = b.getTimezoneOffset();
            stlib.stfp.timezoneoffsetHash = stlib.stfp.getFpHash(a.toString())
        },
        getFontsHash: function() {
            var d = false;
            var h = document;
            var a = h.createElement("iframe");
            a.id = "st_ifr";
            a.style.width = "0px";
            a.style.height = "0px";
            a.src = "about:blank";
            var b = stlib.browser.isChrome();
            var f = '<html><head><title>st_bf</title><script type="text/javascript">var stlib1={};stlib1.stfp={fontStr:"",fontsListHash:"ERROR",checkFonts:["Aharoni","algerian","Andalus","\'Angsana New\'","\'Apple Symbols\'","\'Arabic Typesetting\'","Arial","\'Baskerville Old Face\'","Batang","BatangChe","\'Bell MT\'","\'Berlin Sans FB\'","\'Bitstream Charter\'","\'Book Antiqua\'","\'Bookman Old Style\'","\'Bradley Hand ITC\'","Calibri","\'Californian FB\'","\'Cambria Math\'","\'Century Schoolbook\'","\'Century Schoolbook L\'","Charter","\'colonna mt\'","Consolas","Corbel","\'Cordia New\'","Courier","cursive","David","default","DFKai-SB","DilleniaUPC","DotumChe","Ebrima","\'Estrangelo Edessa\'","fantasy","FrankRuehl","Garamond","Gentium","Gungsuh","GungsuhChe","Haettenschweiler","\'Heiti TC\'","\'High Tower Text\'","\'Informal Roman\'","IrisUPC","\'Juice ITC\'","KaiTi","Kalinga","Kartika","Kokonor","Leelawadee","\'Liberation Mono\'","\'Liberation Sans\'","Loma","Magneto","\'Malgun Gothic\'","\'matura mt script capitals\'","\'Microsoft Himalaya\'","\'Microsoft JhengHei\'","\'Microsoft Sans Serif\'","\'Microsoft Uighur\'","\'Microsoft YaHei\'","\'Microsoft Yi Baiti\'","MingLiU","Mistral","Modena","\'Mongolian Baiti\'","\'Monotype Corsiva\'","\'MS Mincho\'","\'MS Outlook\'","\'MS PGothic\'","\'MS PMincho\'","\'MT Extra\'","\'Nimbus Mono L\'","\'Nimbus Sans L\'","NSimSun","Optima","Papyrus","PMingLiU-ExtB","Saab","\'Segoe Print\'","\'Segoe Script\'","\'Showcard Gothic\'","SimHei","\'Simplified Arabic\'","\'Simplified Arabic Fixed\'","SimSun","SimSun-ExtB","Tahoma","\'Traditional Arabic\'","Tunga","Ubuntu","\'URW Gothic L\'","\'URW Palladio L\'","Utopia","Verona","\'Viner Hand ITC\'","Vrinda","webdings","\'wide latin\'","Zapfino"],checkFontsLength:0,baseFonts:["monospace","sans-serif","serif"],baseFontsLength:0,testString:"mmmmmmmmmmlli",testSize:"72px",s:document.createElement("span"),sty:document.createElement("style"),hd:document.head||document.getElementsByTagName("head")[0],defaultWidth:{},defaultHeight:{},';
            if (b) {
                f += "checkFontForCrome:function(checkFontIndex){var detected = false;var checkElement;for(var baseFontIndex=0;baseFontIndex<stlib1.stfp.baseFontsLength;baseFontIndex++){checkElement = document.getElementById(\"st_check_fonts_\" + checkFontIndex + \"_\" + baseFontIndex);var matched = checkElement.offsetWidth!=stlib1.stfp.defaultWidth[baseFontIndex]||checkElement.offsetHeight!=stlib1.stfp.defaultHeight[baseFontIndex];detected = detected || matched;}return detected;},createFragments:function(){var span, fragment = document.createDocumentFragment();var doc = document;var d = doc.createElement('div');d.className = 'st_fontDetect';var baseFontName, checkFontName, baseElement, checkElement;for(var baseFontIndex=0;baseFontIndex<stlib1.stfp.baseFontsLength;baseFontIndex++){baseFontName = stlib1.stfp.baseFonts[baseFontIndex];baseElement = document.createElement('span');baseElement.style.fontFamily=baseFontName;baseElement.id = \"st_base_fonts_\" + baseFontIndex;baseElement.innerHTML = stlib1.stfp.testString;baseElement.style.fontSize = stlib1.stfp.testSize;fragment.appendChild(baseElement);}for(var checkFontIndex=0;checkFontIndex<stlib1.stfp.checkFontsLength;checkFontIndex++){checkFontName = stlib1.stfp.checkFonts[checkFontIndex];for(var baseFontIndex=0;baseFontIndex<stlib1.stfp.baseFontsLength;baseFontIndex++){baseFontName = stlib1.stfp.baseFonts[baseFontIndex];checkElement = document.createElement('span');checkElement.style.fontFamily= checkFontName + ',' + baseFontName;checkElement.id = \"st_check_fonts_\" + checkFontIndex + \"_\" + baseFontIndex;checkElement.innerHTML = stlib1.stfp.testString;checkElement.style.fontSize = stlib1.stfp.testSize;fragment.appendChild(checkElement);}}d.appendChild(fragment);doc.body.appendChild(d);},"
            } else {
                f += 'checkFont:function(font){var detected = false;for(var baseFontIndex=0;baseFontIndex<stlib1.stfp.baseFontsLength;baseFontIndex++){stlib1.stfp.s.style.fontFamily = font +"," + stlib1.stfp.baseFonts[baseFontIndex];var matched = stlib1.stfp.s.offsetWidth!=stlib1.stfp.defaultWidth[stlib1.stfp.baseFonts[baseFontIndex]]||stlib1.stfp.s.offsetHeight!=stlib1.stfp.defaultHeight[stlib1.stfp.baseFonts[baseFontIndex]];detected = detected || matched;}return detected;},'
            }
            f += 'createStyle:function(){var css =".st_fontDetect{display:inline !important}";stlib1.stfp.sty.type="text/css";stlib1.stfp.sty.id="st_style";if(stlib1.stfp.sty.styleSheet){stlib1.stfp.sty.styleSheet.cssText = css;}else{stlib1.stfp.sty.appendChild(document.createTextNode(css))}stlib1.stfp.hd.appendChild(stlib1.stfp.sty)},getFontsHash:function(){var isBodyStyleSet = false;stlib1.stfp.s.className="st_fontDetect";stlib1.stfp.createStyle();stlib1.stfp.s.style.fontSize=stlib1.stfp.testSize;stlib1.stfp.s.innerHTML=stlib1.stfp.testString;stlib1.stfp.baseFontsLength = stlib1.stfp.baseFonts.length;stlib1.stfp.checkFontsLength = stlib1.stfp.checkFonts.length;var bodyDisplay = null;var bodyVisibility = null;if(document.body.style.display==="none"){isBodyStyleSet = true;bodyDisplay = document.body.style.display;bodyVisibility = document.body.style.visibility;document.body.style.display="block";document.body.style.visibility="hidden";}';
            if (b) {
                f += "stlib1.stfp.createFragments();stlib1.stfp.defaultWidth[0] = document.getElementById('st_base_fonts_0').offsetWidth;stlib1.stfp.defaultHeight[0] = document.getElementById('st_base_fonts_0').offsetHeight;stlib1.stfp.defaultWidth[1] = document.getElementById('st_base_fonts_1').offsetWidth;stlib1.stfp.defaultHeight[1] = document.getElementById('st_base_fonts_1').offsetHeight;stlib1.stfp.defaultWidth[2] = document.getElementById('st_base_fonts_2').offsetWidth;stlib1.stfp.defaultHeight[2] = document.getElementById('st_base_fonts_2').offsetHeight;for(var checkFontIndex=0;checkFontIndex<stlib1.stfp.checkFontsLength;checkFontIndex++){var tempCheckFontName = stlib1.stfp.checkFonts[checkFontIndex];if(stlib1.stfp.checkFontForCrome(checkFontIndex)){stlib1.stfp.fontStr += tempCheckFontName +\":\";}}"
            } else {
                f += 'for(var baseFontIndex=0;baseFontIndex<stlib1.stfp.baseFontsLength;baseFontIndex++){var tempBaseFontName = stlib1.stfp.baseFonts[baseFontIndex];stlib1.stfp.s.style.fontFamily = tempBaseFontName;document.body.appendChild(stlib1.stfp.s);stlib1.stfp.defaultWidth[tempBaseFontName]=stlib1.stfp.s.offsetWidth;stlib1.stfp.defaultHeight[tempBaseFontName]=stlib1.stfp.s.offsetHeight;document.body.removeChild(stlib1.stfp.s)}stlib1.stfp.s.style.fontFamily="st_font";document.body.appendChild(stlib1.stfp.s);for(var checkFontIndex=0;checkFontIndex<stlib1.stfp.checkFontsLength;checkFontIndex++){var tempCheckFontName = stlib1.stfp.checkFonts[checkFontIndex];if(stlib1.stfp.checkFont(tempCheckFontName)){stlib1.stfp.fontStr += tempCheckFontName +":"}}var sheet = document.getElementById("st_style");sheet.parentNode.removeChild(sheet);document.body.removeChild(stlib1.stfp.s);'
            }
            f += 'if(isBodyStyleSet){document.body.style.display = bodyDisplay;document.body.style.visibility = bodyVisibility;}}};<\/script></head><body id="st_ifr"><div><script type="text/javascript">stlib1.stfp.getFontsHash();<\/script></div></body></html>';
            h.body.appendChild(a);
            try {
                a.contentWindow.document.open("text/html", "replace")
            } catch (g) {
                if (stlib.browser.getIEVersion() != null) {
                    if (stlib.browser.getIEVersion() < 11 && g.message.match(/denied/g)) {
                        h.body.removeChild(a);
                        d = true
                    }
                }
            }
            if (!d) {
                a.contentWindow.document.write(f);
                a.contentWindow.document.close();
                stlib.stfp.fontsListHash = stlib.stfp.getFpHash(document.getElementById("st_ifr").contentWindow.stlib1.stfp.fontStr);
                h.body.removeChild(a)
            }
        },
        init: function() {
            stlib.stfp.getFontsHash();
            stlib.stfp.getPluginsHash();
            stlib.stfp.getResolutionDepthHash();
            stlib.stfp.getTimezoneOffsetHash()
        },
        getFpHash: function(a) {
            var f = 0,
                e = 0;
            for (var d = a.length - 1; d >= 0; d--) {
                var b = parseInt(a.charCodeAt(d));
                f = ((f << 8) & 268435455) + b + (b << 12);
                if ((e = f & 161119850) != 0) {
                    f = (f ^ (e >> 20))
                }
            }
            return f.toString(16)
        }
    };
    if (typeof(stlib.data) == "undefined") {
        stlib.data = {
            bInit: false,
            publisherKeySet: false,
            pageInfo: {},
            shareInfo: {},
            resetPageData: function() {
                stlib.data.pageInfo.fpc = "ERROR";
                stlib.data.pageInfo.sessionID = "ERROR";
                stlib.data.pageInfo.hostname = "ERROR";
                stlib.data.pageInfo.location = "ERROR"
            },
            resetShareData: function() {
                stlib.data.shareInfo = {};
                stlib.data.shareInfo.url = "ERROR";
                stlib.data.shareInfo.sharURL = "";
                stlib.data.shareInfo.buttonType = "ERROR";
                stlib.data.shareInfo.destination = "ERROR";
                stlib.data.shareInfo.source = "ERROR"
            },
            resetData: function() {
                stlib.data.resetPageData();
                stlib.data.resetShareData()
            },
            validate: function() {
                var a = stlib.validate.regexes;

                function b(f, h) {
                    if (h != encodeURIComponent(h)) {
                        a.notEncoded.test(h) ? _$de(f + " not encoded") : null;
                        a.tooEncoded.test(h) ? _$de(f + " has too much encoding") : null
                    }
                    var g = a[f] ? a[f].test(decodeURIComponent(h)) : true;
                    if (!g) {
                        _$de(f + " failed validation")
                    }
                }
                var d = stlib.data.pageInfo;
                var e;
                for (e in d) {
                    b(e, d[e])
                }
                d = stlib.data.shareInfo;
                for (e in d) {
                    b(e, d[e])
                }
            },
            init: function() {
                if (!stlib.data.bInit) {
                    stlib.data.bInit = true;
                    stlib.data.resetData();
                    var h = document.location.href,
                        d = "",
                        a = "",
                        g = [],
                        k = "",
                        j = "",
                        e = "",
                        b = "",
                        f = "",
                        i = "";
                    g = stlib.data.getRefDataFromUrl(h);
                    if (g.length > 0) {
                        d = (typeof(g[0]) != "undefined") ? g[0] : "";
                        a = (typeof(g[1]) != "undefined") ? g[1] : "";
                        j = stlib.data.removeRefDataFromUrl(h);
                        stlib.data.showModifiedUrl(j);
                        stlib.data.set("url", j, "shareInfo")
                    } else {
                        k = document.referrer;
                        g = k.replace("http://", "").replace("https://", "").split("/");
                        d = g.shift();
                        a = g.join("/");
                        stlib.data.set("url", h, "shareInfo")
                    }
                    stlib.hash.init();
                    stlib.data.set("shareHash", stlib.hash.shareHash, "pageInfo");
                    stlib.data.set("incomingHash", stlib.hash.incomingHash, "pageInfo");
                    if (!stlib.hash.doNotHash) {
                        e = "#" + stlib.data.get("shareHash", "pageInfo")
                    }
                    b = stlib.hash.updateParams();
                    stlib.data.set("url", b + e, "shareInfo");
                    if (stlib.data.publisherKeySet != true) {
                        stlib.data.set("publisher", "ur.00000000-0000-0000-0000-000000000000", "pageInfo")
                    }
                    stlib.fpc.createFpc();
                    stlib.data.set("fpc", stlib.fpc.cookieValue, "pageInfo");
                    f = (new Date()).getTime().toString();
                    i = Number(Math.random().toPrecision(5).toString().substr(2)).toString();
                    stlib.data.set("sessionID", f + "." + i, "pageInfo");
                    stlib.data.set("hostname", document.location.hostname, "pageInfo");
                    stlib.data.set("location", document.location.pathname, "pageInfo");
                    stlib.data.set("refDomain", d, "pageInfo");
                    stlib.data.set("refQuery", a, "pageInfo")
                }
            },
            showModifiedUrl: function(b) {
                if (window.history && history.replaceState) {
                    history.replaceState(null, document.title, b)
                } else {
                    if ((/MSIE/).test(navigator.userAgent)) {
                        var g = 0,
                            d = window.location.hash,
                            a = new RegExp("(&st_refDomain=?)[^&|]+"),
                            f = new RegExp("(#st_refDomain=?)[^&|]+"),
                            e = document.location.href;
                        if (a.test(e)) {
                            g = d.indexOf("&st_refDomain");
                            window.location.hash = d.substr(0, g)
                        } else {
                            if (f.test(e)) {
                                window.location.replace("#")
                            }
                        }
                    } else {
                        document.location.replace(b)
                    }
                }
            },
            getRefDataFromUrl: function(b) {
                var e = new RegExp("st_refDomain="),
                    f = "",
                    d = "",
                    a = [];
                if (e.test(b)) {
                    f = b.match(/(st_refDomain=?)[^\&|]+/g);
                    a.push(f[0].split("=")[1]);
                    d = b.match(/(st_refQuery=?)[^\&|]+/g);
                    a.push(d[0].replace("st_refQuery=", ""))
                }
                return a
            },
            removeRefDataFromUrl: function(b) {
                var f = "",
                    d = "",
                    a = new RegExp("(&st_refDomain=?)[^&|]+"),
                    e = new RegExp("(#st_refDomain=?)[^&|]+");
                if (a.test(b)) {
                    f = b.replace(/\&st_refDomain=(.*)/g, "")
                } else {
                    if (e.test(b)) {
                        f = b.replace(/\#st_refDomain=(.*)/g, "")
                    } else {
                        f = b
                    }
                }
                return f
            },
            setPublisher: function(a) {
                stlib.data.set("publisher", a, "pageInfo");
                stlib.data.publisherKeySet = true
            },
            setSource: function(d, a) {
                var b = "";
                if (a) {
                    if (a.toolbar) {
                        b = "toolbar" + d
                    } else {
                        if (a.page && a.page != "home" && a.page != "") {
                            b = "chicklet" + d
                        } else {
                            b = "button" + d
                        }
                    }
                } else {
                    b = d
                }
                stlib.data.set("source", b, "shareInfo")
            },
            set: function(a, d, b) {
                if (typeof(d) == "number" || typeof(d) == "boolean") {
                    stlib.data[b][a] = d
                } else {
                    if (typeof(d) == "undefined" || d == null) {} else {
                        stlib.data[b][a] = encodeURIComponent(decodeURIComponent(unescape(d.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
                        if (a == "url" || a == "location" || a == "image") {
                            try {
                                stlib.data[b][a] = encodeURIComponent(decodeURIComponent(decodeURI(d.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")))
                            } catch (f) {
                                stlib.data[b][a] = encodeURIComponent(decodeURIComponent(unescape(d.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")))
                            }
                        }
                    }
                }
            },
            get: function(a, b) {
                if (stlib.data[b] && stlib.data[b][a]) {
                    return decodeURIComponent(stlib.data[b][a])
                } else {
                    return false
                }
            },
            unset: function(a, b) {
                if (stlib.data[b] && typeof(stlib.data[b][a]) != "undefined") {
                    delete stlib.data[b][a]
                }
            }
        };
        stlib.data.resetData()
    }
    stlib.hash = {
        doNotHash: true,
        hashAddressBar: false,
        doNotCopy: true,
        prefix: "sthash",
        shareHash: "",
        incomingHash: "",
        validChars: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
        servicePreferences: {
            linkedin: "param",
            stumbleupon: "param",
            bebo: "param"
        },
        hashDestination: function(b) {
            if (b == "copy") {
                return "dpuf"
            }
            var d = b.substring(0, 2) + b.substring(b.length - 2, b.length);
            var a = function(e, f) {
                if (e.charCodeAt(f) == 122) {
                    return "a"
                }
                return String.fromCharCode(e.charCodeAt(f) + 1)
            };
            return a(d, 0) + a(d, 1) + a(d, 2) + a(d, 3)
        },
        getHash: function() {
            var d = false;
            var b = "";
            var e = document.location.href;
            e = e.split("#").shift();
            var a = e.split("?");
            if (a.length > 1) {
                a = a[1].split("&");
                for (arg in a) {
                    try {
                        if (a[arg].substring(0, 6) == "sthash") {
                            d = true;
                            b = a[arg]
                        }
                    } catch (f) {}
                }
                if (d) {
                    return b
                } else {
                    return document.location.hash.substring(1)
                }
            } else {
                return document.location.hash.substring(1)
            }
        },
        stripHash: function(a) {
            var b = a;
            b = b.split("#");
            if (b.length > 1) {
                return b[1]
            } else {
                return ""
            }
        },
        clearHash: function() {
            if (stlib.hash.validateHash(document.location.hash)) {
                var a = document.location.href.split("#").shift();
                if (window.history && history.replaceState) {
                    history.replaceState(null, document.title, a)
                } else {
                    if ((/MSIE/).test(navigator.userAgent)) {
                        window.location.replace("#")
                    } else {
                        document.location.hash = ""
                    }
                }
            }
        },
        init: function() {
            var b = "";
            var a = stlib.hash.validChars.length;
            for (var f = 0; f < 8; f++) {
                b += stlib.hash.validChars[Math.random() * a | 0]
            }
            if (stlib.hash.getHash() == "") {
                stlib.hash.shareHash = stlib.hash.prefix + "." + b
            } else {
                var d = stlib.hash.getHash().split(".");
                var e = d.shift();
                if (e == stlib.hash.prefix || e == stlib.hash.prefix) {
                    stlib.hash.incomingHash = stlib.hash.getHash();
                    stlib.hash.shareHash = stlib.hash.prefix + "." + d.shift() + "." + b
                } else {
                    stlib.hash.shareHash = stlib.hash.prefix + "." + b
                }
            }
            if (!stlib.hash.doNotHash && stlib.hash.hashAddressBar) {
                if (document.location.hash == "" || stlib.hash.validateHash(document.location.hash)) {
                    if (window.history && history.replaceState) {
                        history.replaceState(null, "ShareThis", "#" + stlib.hash.shareHash + ".dpbs")
                    } else {
                        if ((/MSIE/).test(navigator.userAgent)) {
                            window.location.replace("#" + stlib.hash.shareHash + ".dpbs")
                        } else {
                            document.location.hash = stlib.hash.shareHash + ".dpbs"
                        }
                    }
                }
            } else {
                stlib.hash.clearHash()
            }
            if (!stlib.hash.doNotHash && !stlib.hash.doNotCopy) {
                stlib.hash.copyPasteInit()
            }
            stlib.hash.copyPasteLog()
        },
        checkURL: function() {
            var b = stlib.data.get("destination", "shareInfo");
            var g = stlib.hash.updateParams(b);
            var e = "." + stlib.hash.hashDestination(b);
            stlib.hash.updateDestination(e);
            if (!stlib.hash.doNotHash && typeof(stlib.data.pageInfo.shareHash) != "undefined") {
                var d = stlib.data.get("url", "shareInfo");
                var h = stlib.hash.stripHash(d);
                if (stlib.hash.validateHash(h) || h == "") {
                    if (typeof(stlib.hash.servicePreferences[b]) != "undefined") {
                        if (stlib.hash.servicePreferences[b] == "param") {
                            _$d1("Don't use hash, use params");
                            _$d2(g);
                            if (g.split("?").length > 1) {
                                var f = g.split("?")[1].split("&");
                                var i = false;
                                for (var a = 0; a < f.length; a++) {
                                    if (f[a].split(".")[0] == "sthash") {
                                        i = true
                                    }
                                }
                                if (i) {
                                    stlib.data.set("url", g, "shareInfo")
                                } else {
                                    stlib.data.set("url", g + "&" + stlib.data.pageInfo.shareHash, "shareInfo")
                                }
                            } else {
                                stlib.data.set("url", g + "?" + stlib.data.pageInfo.shareHash, "shareInfo")
                            }
                            if (b == "linkedin") {
                                if (stlib.data.get("sharURL", "shareInfo") != "") {
                                    stlib.data.set("sharURL", stlib.data.get("url", "shareInfo"), "shareInfo")
                                }
                            }
                        } else {
                            _$d1("Using Hash");
                            stlib.data.set("url", g + "#" + stlib.data.pageInfo.shareHash, "shareInfo")
                        }
                    } else {
                        _$d1("Not using custom destination hash type");
                        stlib.data.set("url", g + "#" + stlib.data.pageInfo.shareHash, "shareInfo")
                    }
                }
            }
        },
        updateParams: function(a) {
            var g = stlib.data.get("url", "shareInfo").split("#").shift();
            var f = /(\?)sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}/;
            var e = /(&)sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}/;
            var d = /(\?)sthash\.[a-zA-z0-9]{8}/;
            var b = /(&)sthash\.[a-zA-z0-9]{8}/;
            if (f.test(g)) {
                g = g.replace(f, "?" + stlib.data.pageInfo.shareHash)
            } else {
                if (e.test(g)) {
                    g = g.replace(e, "&" + stlib.data.pageInfo.shareHash)
                } else {
                    if (d.test(g)) {
                        g = g.replace(d, "?" + stlib.data.pageInfo.shareHash)
                    } else {
                        if (b.test(g)) {
                            g = g.replace(b, "&" + stlib.data.pageInfo.shareHash)
                        }
                    }
                }
            }
            return g
        },
        updateDestination: function(b) {
            var a = /sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}\.[a-z]{4}/;
            var d = /sthash\.[a-zA-z0-9]{8}\.[a-z]{4}/;
            _$d_();
            _$d1("Updating Destination");
            if (a.test(stlib.data.pageInfo.shareHash)) {
                _$d2(stlib.data.pageInfo.shareHash.substring(0, 24));
                stlib.data.pageInfo.shareHash = stlib.data.pageInfo.shareHash.substring(0, 24) + b
            } else {
                if (d.test(stlib.data.pageInfo.shareHash)) {
                    _$d2(stlib.data.pageInfo.shareHash.substring(0, 15));
                    stlib.data.pageInfo.shareHash = stlib.data.pageInfo.shareHash.substring(0, 15) + b
                } else {
                    stlib.data.pageInfo.shareHash += b
                }
            }
        },
        validateHash: function(a) {
            var b = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}$/;
            var d = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}\.[a-z]{4}$/;
            var e = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-z]{4}$/;
            var f = /[\?#&]?sthash\.[a-zA-z0-9]{8}$/;
            return f.test(a) || e.test(a) || d.test(a) || b.test(a)
        },
        appendHash: function(a) {
            var b = stlib.hash.stripHash(a);
            if (stlib.data.pageInfo.shareHash && (stlib.hash.validateHash(b) || b == "")) {
                a = a.replace("#" + b, "") + "#" + stlib.data.pageInfo.shareHash
            } else {}
            return a
        },
        copyPasteInit: function() {
            var a = document.getElementsByTagName("body")[0];
            var d = document.createElement("div");
            d.id = "stcpDiv";
            d.style.position = "absolute";
            d.style.top = "-1999px";
            d.style.left = "-1988px";
            a.appendChild(d);
            d.innerHTML = "ShareThis Copy and Paste";
            var b = document.location.href.split("#").shift();
            var e = "#" + stlib.hash.shareHash;
            if (document.addEventListener) {
                a.addEventListener("copy", function(i) {
                    if (typeof(Tynt) != "undefined") {
                        return
                    }
                    var h = document.getSelection();
                    if (h.isCollapsed) {
                        return
                    }
                    var g = h.getRangeAt(0).cloneContents();
                    d.innerHTML = "";
                    d.appendChild(g);
                    if (d.textContent.trim().length == 0) {
                        return
                    }
                    if ((h + "").trim().length == 0) {} else {
                        if (d.innerHTML == (h + "") || d.textContent == (h + "")) {
                            d.innerHTML = stlib.html.encode(stlib.hash.selectionModify(h))
                        } else {
                            d.innerHTML += stlib.html.encode(stlib.hash.selectionModify(h, true))
                        }
                    }
                    var f = document.createRange();
                    f.selectNodeContents(d);
                    var j = h.getRangeAt(0);
                    h.removeAllRanges();
                    h.addRange(f);
                    setTimeout(function() {
                        h.removeAllRanges();
                        h.addRange(j)
                    }, 0)
                }, false)
            } else {
                if (document.attachEvent) {}
            }
        },
        copyPasteLog: function() {
            var d = window.addEventListener ? "addEventListener" : "attachEvent";
            var b = d == "attachEvent" ? "oncopy" : "copy";
            var a = document.getElementsByTagName("body")[0];
            a[d](b, function(g) {
                var f = true;
                stlib.data.resetShareData();
                stlib.data.set("url", document.location.href, "shareInfo");
                stlib.data.setSource("copy");
                stlib.data.set("destination", "copy", "shareInfo");
                stlib.data.set("buttonType", "custom", "shareInfo");
                if (typeof(Tynt) != "undefined") {
                    stlib.data.set("result", "tynt", "shareInfo");
                    stlib.logger.log("debug");
                    f = false
                }
                if (typeof(addthis_config) != "undefined") {
                    stlib.data.set("result", "addThis", "shareInfo");
                    if (typeof(addthis_config.data_track_textcopy) == "undefined" || addthis_config.data_track_textcopy) {
                        stlib.data.set("enabled", "true", "shareInfo");
                        f = false
                    } else {
                        stlib.data.set("enabled", "false", "shareInfo")
                    }
                    stlib.logger.log("debug")
                }
                if (f) {
                    stlib.data.set("result", "pass", "shareInfo");
                    stlib.logger.log("debug")
                }
            }, false)
        },
        logCopy: function(a, b) {
            stlib.data.resetShareData();
            stlib.data.set("url", a, "shareInfo");
            stlib.data.setSource("copy");
            stlib.data.set("destination", "copy", "shareInfo");
            stlib.data.set("buttonType", "custom", "shareInfo");
            if (b) {
                stlib.data.set("description", b, "shareInfo")
            }
            stlib.sharer.share()
        },
        selectionModify: function(o, m) {
            o = "" + o;
            _$d_();
            _$d1("Copy Paste");
            var n = /^((http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))/i;
            var h = /^([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i;
            var f = /^\+?1?[\.\-\\)_\s]?[\\(]?[0-9]{3}[\.\-\\)_\s]?[0-9]{3}[\.\-_\s]?[0-9]{4}$|^[0-9]{3}[\.\-_\s]?[0-9]{4}$/;
            var j = /^[0-9]{3}[\.\-_\s]?[0-9]{8}$/;
            var l = /^[0-9]{2}[\.\-_\s]?[0-9]{4}[\.\-_\s]?[0-9]{4}$/;
            var d = /[\-_\.a-z0-9]+@[\-_\.a-z0-9]+\.[\-_\.a-z0-9]+/i;
            var g = /[\s@]/;
            var b = document.location.href.split("#").shift();
            var i = "#" + stlib.hash.shareHash;
            var a = "";
            var k = "";
            var e = "";
            if (typeof(m) == "undefined" && ((n.test(o) || h.test(o)) && !g.test(o.trim()))) {
                _$d2("is Url");
                if (o.match(/#/) == null || stlib.hash.validateHash(o)) {
                    k = o.split("#")[0] + i + ".dpuf";
                    e = k
                } else {
                    k = o;
                    e = k
                }
            } else {
                _$d2("is Not Url");
                if (document.location.hash == "" || (/^#$/).test(document.location.hash) || stlib.hash.validateHash(document.location.hash)) {
                    k = b + i + ".dpuf"
                } else {
                    k = document.location.href
                }
                e = o;
                if (o.length > 50) {
                    a = " - See more at: " + k + "";
                    if (!f.test(o) && !j.test(o) && !l.test(o) && !d.test(o)) {
                        e += a
                    }
                }
            }
            if (o.length > 140) {
                o = o.substring(0, 137) + "..."
            }
            stlib.hash.logCopy(k, o);
            return ((m && m == true) ? a : e)
        }
    };
    stlib.pump = function(a, d, e) {
        var b = this;
        this.isIframeReady = false;
        this.isIframeSending = false;
        this.getHash = function(f) {
            var g = f.split("#");
            g.shift();
            return g.join("#")
        };
        this.broadcastInit = function(f) {
            this.destination = f;
            _$d_("---------------------");
            _$d1("Initiating broadcaster:");
            _$d(this.destination)
        };
        this.broadcastSendMessage = function(f) {
            _$d_("---------------------");
            _$d1("Initiating Send:");
            if (this.destination === window) {
                if (stlib.browser.ieFallback) {
                    window.location.replace(window.location.href.split("#")[0] + "#" + f);
                    _$d2("child can't communicate with parent");
                    return
                }
                _$d2("Iframe to publisher: " + f);
                parent.postMessage("#" + f, document.referrer)
            } else {
                _$d2("Publisher to Iframe: " + f);
                if (stlib.browser.ieFallback) {
                    if (this.destination.contentWindow) {
                        this.destination.contentWindow.location.replace(this.destination.src + "#" + f);
                        this.isIframeSending = true
                    }
                    return
                }
                this.destination.contentWindow.postMessage("#" + f, this.destination.src)
            }
        };
        this.receiverInit = function(h, k) {
            _$d_("---------------------");
            _$d1("Initiating Receiver:");
            _$d(h);
            if (stlib.browser.ieFallback) {
                this.callback = k;
                this.source = h;
                if (h === window) {
                    window.location.replace(window.location.href.split("#")[0] + "#");
                    this.currentIframe = window.location.hash;
                    var g = "receiver" + stlib.functionCount;
                    stlib.functions[g] = function(m) {
                        if ("" != window.location.hash && "#" != window.location.hash) {
                            var l = window.location.hash;
                            m(l);
                            window.location.replace(window.location.href.split("#")[0] + "#")
                        }
                    };
                    stlib.functionCount++;
                    var j = "callback" + stlib.functionCount;
                    stlib.functions[j] = k;
                    stlib.functionCount++;
                    setInterval("stlib.functions['" + g + "'](stlib.functions['" + j + "'])", 200)
                } else {}
                var i = window.addEventListener ? "addEventListener" : "attachEvent";
                var f = i == "attachEvent" ? "onmessage" : "message";
                window[i](f, function(l) {
                    if (h == window) {} else {
                        if (l.origin.indexOf("sharethis.com") != -1) {
                            if (l.data.match(/#Pinterest Click/)) {
                                stlib.sharer.sharePinterest()
                            }
                            if (l.data.match(/#Print Click/)) {
                                stlib.sharer.stPrint()
                            }
                        }
                    }
                }, false);
                return
            }
            var i = window.addEventListener ? "addEventListener" : "attachEvent";
            var f = i == "attachEvent" ? "onmessage" : "message";
            window[i](f, function(l) {
                if (h == window) {
                    _$d1("arrived in iframe from:");
                    _$d(l.origin);
                    if (l.data.match(/#fragmentPump/) || l.data.match(/#Buttons Ready/) || l.data.match(/#Widget Ready/) || l.data.indexOf("#light") == 0 || l.data.indexOf("#widget") == 0 || l.data.indexOf("#popup") == 0 || l.data.indexOf("#show") == 0 || l.data.indexOf("#init") == 0 || l.data.indexOf("#test") == 0 || l.data.indexOf("#data") == 0) {
                        k(l.data)
                    }
                } else {
                    if (l.origin.indexOf("sharethis.com") != -1) {
                        _$d1("arrived in parent from:");
                        _$d(l.origin);
                        if (l.data.match(/#fragmentPump/) || l.data.match(/#Buttons Ready/) || l.data.match(/#Widget Ready/) || l.data.indexOf("#light") == 0 || l.data.indexOf("#widget") == 0 || l.data.indexOf("#popup") == 0 || l.data.indexOf("#show") == 0 || l.data.indexOf("#init") == 0 || l.data.indexOf("#test") == 0 || l.data.indexOf("#data") == 0) {
                            k(l.data)
                        } else {
                            if (l.data.match(/#Pinterest Click/)) {
                                stlib.sharer.sharePinterest()
                            } else {
                                if (l.data.match(/#Print Click/)) {
                                    stlib.sharer.stPrint()
                                }
                            }
                        }
                    } else {
                        _$d1("discarded event from:");
                        _$d(l.origin)
                    }
                }
            }, false)
        };
        this.broadcastInit(a);
        this.receiverInit(d, e)
    };
    stlib.json = {
        c: {
            "\b": "b",
            "\t": "t",
            "\n": "n",
            "\f": "f",
            "\r": "r",
            '"': '"',
            "\\": "\\",
            "/": "/"
        },
        d: function(a) {
            return a < 10 ? "0".concat(a) : a
        },
        e: function(c, f, e) {
            e = eval;
            delete eval;
            if (typeof eval === "undefined") {
                eval = e
            }
            f = eval("" + c);
            eval = e;
            return f
        },
        i: function(d, b, a) {
            return 1 * d.substr(b, a)
        },
        p: ["", "000", "00", "0", ""],
        rc: null,
        rd: /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/,
        rs: /(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g,
        rt: /^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/,
        ru: /([\x00-\x07]|\x0b|[\x0e-\x1f])/g,
        s: function(a, b) {
            return "\\".concat(stlib.json.c[b])
        },
        u: function(a, b) {
            var e = b.charCodeAt(0).toString(16);
            return "\\u".concat(stlib.json.p[e.length], e)
        },
        v: function(b, a) {
            return stlib.json.types[typeof result](result) !== Function && (a.hasOwnProperty ? a.hasOwnProperty(b) : a.constructor.prototype[b] !== a[b])
        },
        types: {
            "boolean": function() {
                return Boolean
            },
            "function": function() {
                return Function
            },
            number: function() {
                return Number
            },
            object: function(a) {
                return a instanceof a.constructor ? a.constructor : null
            },
            string: function() {
                return String
            },
            "undefined": function() {
                return null
            }
        },
        $$: function(a) {
            function b(f, d) {
                d = f[a];
                delete f[a];
                try {
                    stlib.json.e(f)
                } catch (e) {
                    f[a] = d;
                    return 1
                }
            }
            return b(Array) && b(Object)
        },
        encode: function() {
            var d = arguments.length ? arguments[0] : this,
                a, h;
            if (d === null) {
                a = "null"
            } else {
                if (d !== undefined && (h = stlib.json.types[typeof d](d))) {
                    switch (h) {
                        case Array:
                            a = [];
                            for (var g = 0, e = 0, b = d.length; e < b; e++) {
                                if (d[e] !== undefined && (h = stlib.json.encode(d[e]))) {
                                    a[g++] = h
                                }
                            }
                            a = "[".concat(a.join(","), "]");
                            break;
                        case Boolean:
                            a = String(d);
                            break;
                        case Date:
                            a = '"'.concat(d.getFullYear(), "-", stlib.json.d(d.getMonth() + 1), "-", stlib.json.d(d.getDate()), "T", stlib.json.d(d.getHours()), ":", stlib.json.d(d.getMinutes()), ":", stlib.json.d(d.getSeconds()), '"');
                            break;
                        case Function:
                            break;
                        case Number:
                            a = isFinite(d) ? String(d) : "null";
                            break;
                        case String:
                            a = '"'.concat(d.replace(stlib.json.rs, stlib.json.s).replace(stlib.json.ru, stlib.json.u), '"');
                            break;
                        default:
                            var g = 0,
                                f;
                            a = [];
                            for (f in d) {
                                if (d[f] !== undefined && (h = stlib.json.encode(d[f]))) {
                                    a[g++] = '"'.concat(f.replace(stlib.json.rs, stlib.json.s).replace(stlib.json.ru, stlib.json.u), '":', h)
                                }
                            }
                            a = "{".concat(a.join(","), "}");
                            break
                    }
                }
            }
            return a
        },
        decode: function(a) {
            if (typeof(a) == "string") {
                var d = null;
                try {
                    if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                        d = window.JSON && window.JSON.parse ? window.JSON.parse(a) : (new Function("return " + a))();
                        return d
                    } else {
                        return null
                    }
                } catch (b) {}
            }
        }
    };
    try {
        stlib.json.rc = new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')
    } catch (z) {
        stlib.json.rc = /^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/
    }
    stlib.logger = {
        loggerUrl: (("https:" == document.location.protocol) ? "https://" : "http://") + "l.sharethis.com/",
        productArray: new Array(),
        version: "",
        lang: "en",
        isFpEvent: false,
        constructParamString: function() {
            var a = stlib.data.pageInfo;
            var d = "";
            var b;
            for (b in a) {
                if (!stlib.logger.isFpEvent && (b == "ufa" || b == "ufb" || b == "ufc" || b == "ufd")) {
                    continue
                }
                d += b + "=" + a[b] + "&"
            }
            a = stlib.data.shareInfo;
            for (b in a) {
                d += b + "=" + a[b] + "&"
            }
            return d.substring(0, d.length - 1)
        },
        log: function(f, h) {
            if (typeof(f) == "undefined") {
                _$de("event does not exist \nFor help, contact support@sharethis.com");
                return
            }
            if (stlib.data.pageInfo == null || stlib.data.shareInfo == null) {
                _$de("stlib.logger does not have enough info to log \nFor help, contact support@sharethis.com");
                return
            }
            if (!stlib.data.get("url", "shareInfo")) {
                _$de("shareThisInfo.url do not exist \nFor help, contact support@sharethis.com");
                return
            }
            if (!stlib.data.get("sessionID", "pageInfo")) {
                _$de("sharePageInfo.sessionID do not exist \nFor help, contact support@sharethis.com");
                return
            }
            if (!stlib.data.get("destination", "shareInfo")) {
                if (f != "pview") {
                    _$de("shareThisInfo.destination do not exist \nFor help, contact support@sharethis.com");
                    return
                }
            }
            if (!stlib.data.get("buttonType", "shareInfo")) {
                if (f != "pview") {
                    _$de("shareThisInfo.type do not exist \nFor help, contact support@sharethis.com");
                    return
                }
            }
            if (!stlib.data.get("source", "shareInfo")) {
                _$de("shareThisInfo.source do not exist \nFor help, contact support@sharethis.com");
                return
            }
            if (f == "pview") {
                stlib.data.unset("destination", "shareInfo");
                stlib.data.unset("buttonType", "shareInfo")
            } else {
                stlib.data.unset("refDomain", "pageInfo");
                stlib.data.unset("refQuery", "pageInfo")
            }
            if (f == "pview" || f == "share") {
                stlib.logger.isFpEvent = true;
                if (stlib.stfp.screenResolutionDepthHash != "ERROR") {
                    stlib.data.set("ufa", stlib.stfp.screenResolutionDepthHash, "pageInfo")
                }
                if (stlib.stfp.pluginsListHash != "ERROR") {
                    stlib.data.set("ufb", stlib.stfp.pluginsListHash, "pageInfo")
                }
                if (stlib.stfp.fontsListHash != "ERROR") {
                    stlib.data.set("ufc", stlib.stfp.fontsListHash, "pageInfo")
                }
                if (stlib.stfp.timezoneoffsetHash != "ERROR") {
                    stlib.data.set("ufd", stlib.stfp.timezoneoffsetHash, "pageInfo")
                }
            } else {
                stlib.logger.isFpEvent = false
            }
            if (typeof(stlib.data.get("counter", "shareInfo")) != "undefined") {
                var e = 0;
                if (stlib.data.get("counter", "shareInfo")) {
                    e = stlib.data.get("counter", "shareInfo")
                }
                stlib.data.set("ts" + new Date().getTime() + "." + e, "", "shareInfo");
                stlib.data.unset("counter", "shareInfo")
            } else {
                stlib.data.set("ts" + new Date().getTime(), "", "shareInfo")
            }
            if (f == "widget") {
                var b = "." + stlib.hash.hashDestination(stlib.data.shareInfo.destination);
                stlib.hash.updateDestination(b)
            }
            var a = (f == "pview") ? "pview" : ((f == "debug") ? "cns" : "log");
            if (f == "pview") {
                var g = stlib.logger.loggerUrl + a + "?event=" + f + "&version=" + stlib.logger.version + "&lang=" + stlib.logger.lang + "&" + stlib.logger.constructParamString()
            } else {
                var g = stlib.logger.loggerUrl + a + "?event=" + f + "&" + stlib.logger.constructParamString()
            }
            _$d1("Final Log Url:");
            _$d2(g);
            var d = new Image(1, 1);
            d.src = g;
            d.onload = function() {
                return
            };
            h ? h() : null
        }
    };
    stlib.scriptLoader = {
        loadJavascript: function(b, d) {
            _$d_();
            _$d1("Loading JS: " + b);
            var a = stlib.scriptLoader;
            a.head = document.getElementsByTagName("head")[0];
            a.scriptSrc = b;
            a.script = document.createElement("script");
            a.script.setAttribute("type", "text/javascript");
            a.script.setAttribute("src", a.scriptSrc);
            a.script.async = true;
            if (window.attachEvent && document.all) {
                a.script.onreadystatechange = function() {
                    if (this.readyState == "complete" || this.readyState == "loaded") {
                        d()
                    }
                }
            } else {
                a.script.onload = d
            }
            a.s = document.getElementsByTagName("script")[0];
            a.s.parentNode.insertBefore(a.script, a.s)
        },
        loadCSS: function(b, e) {
            _$d_();
            _$d1("Loading CSS: " + b);
            var a = stlib.scriptLoader;
            var d;
            a.head = document.getElementsByTagName("head")[0];
            a.cssSrc = b;
            a.css = document.createElement("link");
            a.css.setAttribute("rel", "stylesheet");
            a.css.setAttribute("type", "text/css");
            a.css.setAttribute("href", b);
            a.css.setAttribute("id", b);
            setTimeout(function() {
                e();
                if (!document.getElementById(b)) {
                    d = setInterval(function() {
                        if (document.getElementById(b)) {
                            clearInterval(d);
                            e()
                        }
                    }, 100)
                }
            }, 100);
            a.head.appendChild(a.css)
        }
    };
    stlib.nativeButtons = {
        supportedNativeButtons: {
            linkedinfollow: {
                log: true,
                config: true,
                dependencyLoaded: false,
                dependencyLoading: false,
                requiredFields: [
                    ["st_followId", "Profile Id", "Enter '207839' for profile id"]
                ]
            },
            twitterfollow: {
                log: false,
                config: true,
                requiredFields: [
                    ["st_username", "Username", "Enter 'sharethis' for username"]
                ]
            },
            pinterestfollow: {
                log: true,
                config: true,
                requiredFields: [
                    ["st_username", "Username", "Enter 'sharethis' for username"]
                ]
            },
            youtube: {
                log: true,
                config: true,
                requiredFields: [
                    ["st_username", "Username", "Enter 'sharethis' for username"]
                ]
            },
            foursquaresave: {
                log: false,
                config: true,
                dependencyLoaded: false,
                dependencyLoading: false
            },
            foursquarefollow: {
                log: false,
                config: true,
                requiredFields: [
                    ["st_username", "Username", "Enter 'sharethis' for username"],
                    ["st_followId", "Follow id", "Enter '1234567' for follow id"]
                ]
            },
            googleplusfollow: {
                log: true,
                config: true,
                requiredFields: [
                    ["st_followId", "Page Id", "Enter '110967630299632321627' for page id"]
                ]
            },
            googleplusadd: {
                log: true,
                config: true,
                requiredFields: [
                    ["st_followId", "Profile Id", "Enter '113842823840690472625' for profile id"]
                ]
            }
        },
        loadService: function(a) {
            if (a == "foursquaresave" || a == "foursquarefollow") {
                if (stlib.nativeButtons.supportedNativeButtons.foursquaresave.dependencyLoaded == false) {
                    if (stlib.nativeButtons.supportedNativeButtons.foursquaresave.dependencyLoading == false) {
                        stlib.nativeButtons.supportedNativeButtons.foursquaresave.dependencyLoading = true;
                        var d = "http://platform.foursquare.com/js/widgets.js";
                        var b = {
                            uid: "606"
                        };
                        if ("https:" == document.location.protocol) {
                            d = "http://platform-s.foursquare.com/js/widgets.js";
                            b.secure = true
                        }(function() {
                            window.___fourSq = b;
                            var e = document.createElement("script");
                            e.type = "text/javascript";
                            e.src = d;
                            e.async = true;
                            var f = document.getElementsByTagName("script")[0];
                            e.onload = function() {
                                fourSq.widget.Factory.go();
                                stlib.nativeButtons.supportedNativeButtons.foursquaresave.dependencyLoaded = true;
                                stlib.nativeButtons.supportedNativeButtons.foursquaresave.dependencyLoading = false
                            };
                            e.onreadystatechange = function() {
                                if (this.readyState == "complete" || this.readyState == "loaded") {
                                    fourSq.widget.Factory.go();
                                    stlib.nativeButtons.supportedNativeButtons.foursquaresave.dependencyLoaded = true;
                                    stlib.nativeButtons.supportedNativeButtons.foursquaresave.dependencyLoading = false
                                }
                            };
                            f.parentNode.insertBefore(e, f)
                        })()
                    }
                } else {
                    fourSq.widget.Factory.go()
                }
            } else {
                if (a == "pinterestfollow") {} else {
                    if (a == "twitterfollow") {} else {
                        if (a == "youtube") {} else {
                            if (a == "linkedinfollow") {
                                if (window.IN && typeof(window.IN.parse) === "function") {
                                    window.IN.parse()
                                } else {
                                    if (stlib.nativeButtons.supportedNativeButtons.linkedinfollow.dependencyLoading == false) {
                                        stlib.nativeButtons.supportedNativeButtons.linkedinfollow.dependencyLoading = true;
                                        var d = "//platform.linkedin.com/in.js";
                                        (function() {
                                            var e = document.createElement("script");
                                            e.type = "text/javascript";
                                            e.src = d;
                                            e.async = true;
                                            var f = document.getElementsByTagName("script")[0];
                                            e.onload = function() {
                                                stlib.nativeButtons.supportedNativeButtons.linkedinfollow.dependencyLoading = false
                                            };
                                            e.onreadystatechange = function() {
                                                if (this.readyState == "complete" || this.readyState == "loaded") {
                                                    stlib.nativeButtons.supportedNativeButtons.linkedinfollow.dependencyLoading = false
                                                }
                                            };
                                            f.parentNode.insertBefore(e, f)
                                        })()
                                    }
                                }
                            } else {}
                        }
                    }
                }
            }
        },
        logService: function(a, b) {
            stlib.data.resetShareData();
            stlib.data.set("url", b, "shareInfo");
            stlib.data.set("destination", a, "shareInfo");
            stlib.data.setSource("chicklet");
            stlib.data.set("buttonType", "chicklet", "shareInfo");
            stlib.sharer.share()
        },
        makeButton: function(w, e, d) {
            if (w == "foursquaresave") {
                try {
                    var k = document.createElement("<div></div>");
                    var i = document.createElement("<a></a>")
                } catch (h) {
                    k = document.createElement("div");
                    i = document.createElement("a")
                }
                k.className = "stNativeButton stFourSquare";
                i.setAttribute("href", "https://foursquare.com/intent/venue.html");
                i.setAttribute("class", "fourSq-widget");
                i.setAttribute("data-on-open", "foursquareCallback");
                k.appendChild(i);
                return k
            } else {
                if (w == "foursquarefollow") {
                    if (typeof(d.username) == "undefined" || d.username == "") {
                        return false
                    }
                    if (typeof(d.followId) == "undefined" || d.followId == "") {
                        return false
                    }
                    try {
                        var k = document.createElement("<div></div>");
                        var i = document.createElement("<a></a>")
                    } catch (h) {
                        k = document.createElement("div");
                        i = document.createElement("a")
                    }
                    k.className = "stNativeButton stFourSquare";
                    i.setAttribute("href", "https://foursquare.com/user/" + d.username);
                    i.setAttribute("class", "fourSq-widget");
                    i.setAttribute("data-type", "follow");
                    i.setAttribute("data-fuid", d.followId);
                    i.setAttribute("data-on-open", "foursquareCallback");
                    k.appendChild(i);
                    return k
                } else {
                    if (w == "googleplusfollow" || w == "googleplusadd") {
                        if (typeof(d.followId) == "undefined" || d.followId == "") {
                            return false
                        }
                        try {
                            var q = document.createElement("<span></span>")
                        } catch (h) {
                            q = document.createElement("span")
                        }
                        q.className = "stNativeButton stGoogleNative";
                        var o = document.createElement("g:plus");
                        o.setAttribute("href", "https://plus.google.com/" + d.followId);
                        o.setAttribute("width", "300");
                        o.setAttribute("height", "69");
                        q.appendChild(o);
                        return q
                    } else {
                        if (w == "pinterestfollow") {
                            if (typeof(d.username) == "undefined" || d.username == "") {
                                return false
                            }
                            try {
                                var b = document.createElement("<span></span>");
                                var p = document.createElement("<a></a>");
                                var n = document.createElement("<img></img>")
                            } catch (h) {
                                b = document.createElement("span");
                                p = document.createElement("a");
                                n = document.createElement("img")
                            }
                            b.className = "stNativeButton stPinterestfollow";
                            var g = d.username;
                            p.setAttribute("target", "_blank");
                            p.setAttribute("href", "//pinterest.com/" + g + "/");
                            n.setAttribute("src", "//passets-cdn.pinterest.com/images/follow-on-pinterest-button.png");
                            n.setAttribute("width", "156");
                            n.setAttribute("height", "26");
                            n.setAttribute("alt", "Follow " + g + " on Pinterest");
                            p.appendChild(n);
                            b.appendChild(p);
                            return b
                        } else {
                            if (w == "twitterfollow") {
                                if (typeof(d.username) == "undefined" || d.username == "") {
                                    return false
                                }
                                try {
                                    var j = document.createElement("<iframe></iframe>")
                                } catch (h) {
                                    j = document.createElement("iframe")
                                }
                                var l = "&screen_name=" + d.username;
                                var r = "&show_count=false";
                                iedocmode = stlib.browser.getIEVersion();
                                var v = "";
                                if (e == "vcount") {
                                    r = "&show_count=true"
                                } else {
                                    if (e == "hcount") {
                                        r = "&show_count=true"
                                    }
                                }
                                j.setAttribute("allowtransparency", "true");
                                j.setAttribute("frameborder", "0");
                                j.setAttribute("scrolling", "no");
                                j.className = "stTwitterFollowFrame";
                                j.setAttribute("src", "//platform.twitter.com/widgets/follow_button.html?lang=en&show_screen_name=false" + l + r);
                                var u = document.createElement("span");
                                u.className = "stNativeButton stTwitterFollowFrame stTwitterFollow";
                                u.appendChild(j);
                                return u
                            } else {
                                if (w == "youtube") {
                                    if (typeof(d.username) == "undefined" || d.username == "") {
                                        return false
                                    }
                                    try {
                                        var m = document.createElement("<span></span>");
                                        var f = document.createElement("<a></a>");
                                        var a = document.createElement("<img></img>")
                                    } catch (h) {
                                        m = document.createElement("span");
                                        f = document.createElement("a");
                                        a = document.createElement("img")
                                    }
                                    m.setAttribute("class", "stNativeButton stYoutube");
                                    var g = d.username;
                                    f.setAttribute("target", "_blank");
                                    f.setAttribute("href", "//youtube.com/subscription_center?add_user=" + g);
                                    a.setAttribute("src", "//s.ytimg.com/yt/img/creators_corner/Subscribe_to_my_videos/YT_Subscribe_130x36_red.png");
                                    a.setAttribute("alt", "Follow " + g + " on youtube");
                                    f.appendChild(a);
                                    m.appendChild(f);
                                    return m
                                } else {
                                    if (w == "linkedinfollow") {
                                        if (typeof(d.followId) == "undefined" || d.followId == "") {
                                            return false
                                        }
                                        var s = document.createElement("span");
                                        s.setAttribute("class", "stNativeButton stLinkedinfollow");
                                        var t = document.createElement("script");
                                        t.type = "text/javascript";
                                        t.setAttribute("type", "IN/FollowCompany");
                                        t.setAttribute("data-id", d.followId);
                                        t.setAttribute("data-counter", "none");
                                        if (e == "vcount") {
                                            t.setAttribute("data-counter", "top")
                                        } else {
                                            if (e == "hcount") {
                                                t.setAttribute("data-counter", "right")
                                            }
                                        }
                                        s.appendChild(t);
                                        return s
                                    } else {}
                                }
                            }
                        }
                    }
                }
            }
        },
        checkNativeButtonSupport: function(a) {
            if (stlib.nativeButtons.supportedNativeButtons[a]) {
                return true
            }
            return false
        },
        checkNativeButtonLogging: function(a) {
            if (stlib.nativeButtons.supportedNativeButtons[a]) {
                return stlib.nativeButtons.supportedNativeButtons[a].log
            }
            return false
        },
        checkNativeButtonConfig: function(a) {
            if (stlib.nativeButtons.supportedNativeButtons[a]) {
                return stlib.nativeButtons.supportedNativeButtons[a].config
            }
            return false
        }
    };
    foursquareCallback = function(d) {
        if (d) {
            var a = "foursquaresave";
            var b = "https://foursquare.com/intent/venue.html";
            if (d.config.type) {
                a = "foursquarefollow";
                b = "https://foursquare.com/user/" + d.config.fuid
            }
            stlib.nativeButtons.logService(a, b)
        }
    };
    stlib.nativeCounts = {
        nativeCountServices: {
            linkedin: true,
            facebook: true,
            stumbleupon: true
        },
        nativeFunc: [],
        addNativeFunc: function(b, a) {
            stlib.nativeCounts.nativeFunc[b] = a
        },
        getNativeCounts: function(e, d, b) {
            switch (e) {
                case "facebook":
                    var a = "select url, like_count, total_count, comment_count, share_count, click_count from link_stat where url='" + encodeURIComponent(d) + "'";
                    var f = (("https:" == document.location.protocol) ? "https://ws.sharethis.com/api/processFQLQuery.php?fqlQuery=" + a + "&callback=" + b + "" : "http://wd.sharethis.com/api/processFQLQuery.php?fqlQuery=" + a + "&callback=" + b + "");
                    stlib.scriptLoader.loadJavascript(f, function() {});
                    break;
                case "linkedin":
                    stlib.scriptLoader.loadJavascript((("https:" == document.location.protocol) ? "https://" : "http://") + "www.linkedin.com/countserv/count/share?format=jsonp&callback=" + b + "&url=" + encodeURIComponent(d), function() {});
                    break;
                case "stumbleupon":
                    stlib.scriptLoader.loadJavascript((("https:" == document.location.protocol) ? "https://" : "http://") + "www.stumbleupon.com/services/1.1/badge.getinfo?url=" + encodeURIComponent(d) + "&format=jsonp&callback=" + b, function() {});
                    break
            }
        },
        checkNativeCountServicesQueue: function(a) {
            if (stlib.nativeCounts.nativeCountServices[a]) {
                return true
            }
            return false
        }
    };
    var stWidgetVersion = false,
        showHoverbarReskinned = false,
        isEsiLoaded = false;
    if (typeof(switchTo5x) == "undefined") {
        stWidgetVersion = "4x"
    } else {
        if (switchTo5x == false) {
            stWidgetVersion = "4x"
        }
        if (switchTo5x == true) {
            stWidgetVersion = "5xa"
        }
    }
    var stShowNewMobileWidget = false;
    __stgetPubGA = function() {
        if (typeof(_gaq) !== "undefined" && typeof(__stPubGA) == "undefined") {
            if (typeof(_gat) !== "undefined") {
                __stPubGA = _gat._getTrackerByName("~0")._getAccount()
            }
            if (typeof(__stPubGA) !== "undefined" && __stPubGA == "UA-XXXXX-X") {
                _gaq.push(function() {
                    var a = _gat._getTrackerByName();
                    __stPubGA = a._getAccount()
                })
            }
        } else {
            if (typeof(ga) !== "undefined" && typeof(__stPubGA) == "undefined") {
                ga(function() {
                    var f = ga.getAll();
                    for (var b = 0; b < f.length; ++b) {
                        var d = f[b];
                        var a = d.get("trackingId");
                        var e = a.indexOf("UA");
                        if (e >= 0) {
                            __stPubGA = a
                        }
                    }
                })
            }
        }
        if (__stPubGA == "UA-XXXXX-X") {
            delete __stPubGA
        }
    };
    if (typeof(stLight) == "undefined" && typeof(SHARETHIS) == "undefined") {
        var isMobileButtonLoaded = false;
        var stRecentServices = false;
        var iswhatsappCustomButton = false;
        var isKikCustomButton = false;
        if (typeof(switchTo5x) == "undefined") {
            stWidgetVersion = "4x"
        } else {
            if (switchTo5x == false) {
                stWidgetVersion = "4x"
            }
            if (switchTo5x == true) {
                stWidgetVersion = "5xa"
            }
        }
        var esiLoaded = false,
            esiStatus = "",
            stIsLoggedIn = false,
            servicesLoggedIn = {};
        var stFastShareObj = {};
        stFastShareObj.shorten = true;
        if (typeof(useEdgeSideInclude) == "undefined") {
            var useEdgeSideInclude = true
        }
        if ("https:" == document.location.protocol) {
            var useFastShare = false
        }
        if (typeof(useFastShare) == "undefined") {
            var useFastShare = true
        }
        stLight = new function() {
            this.version = false;
            this.publisher = null;
            this.sessionID_time = (new Date()).getTime().toString();
            this.sessionID_rand = Number(Math.random().toPrecision(5).toString().substr(2)).toString();
            this.sessionID = this.sessionID_time + "." + this.sessionID_rand;
            this.fpc = null;
            this.counter = 0;
            this.readyRun = false;
            this.meta = {
                hostname: document.location.host,
                location: document.location.pathname
            };
            this.loadedFromBar = false;
            this.clickCallBack = false
        };
        stLight.onReady = function() {
            if (stLight.readyRun == true) {
                return false
            }
            stLight.readyRun = true;
            stlib.stfp.init();
            stLight.getAllAppDefault(function() {
                stlib.data.init();
                stLight.fpc = stlib.data.get("fpc", "pageInfo");
                if (stButtons.messageQueueInstance == null) {
                    stButtons.messageQueueInstance = new stlib.messageQueue()
                }
                stLight.processSTQ();
                if (stLight.publisher == null) {
                    if (typeof(window.console) !== "undefined") {
                        try {
                            console.debug("Please specify a ShareThis Publisher Key \nFor help, contact support@sharethis.com")
                        } catch (a) {}
                    }
                }
                var b = stLight.getSource();
                if (stLight.hasButtonOnPage()) {
                    if (b == "share4x" || b == "bar_share4x") {
                        stlib.logger.productArray.push("Chicklet4x")
                    } else {
                        if (b == "share5x" || b == "bar_share5x") {
                            stlib.logger.productArray.push("Chicklet5x")
                        }
                    }
                }
                if (typeof st_hover_widget != "undefined") {
                    stlib.logger.productArray.push("HoverBar")
                }
                if (typeof st_pulldown_widget != "undefined") {
                    stlib.logger.productArray.push("PullDownBar")
                }
                if (typeof st_bar_widget != "undefined") {
                    stlib.logger.productArray.push("ShareBar")
                }
                if (typeof st_service_widget != "undefined") {
                    stlib.logger.productArray.push("ShareNow")
                }
                if (typeof stlib.shareEgg != "undefined") {
                    stlib.logger.productArray.push("ShareEgg")
                }
                if (typeof st_disc_widget != "undefined") {
                    stlib.logger.productArray.push("TrendingWidget")
                }
                stlib.logger.version = "buttons.js";
                if ((stWidget.options.lang !== "undefined") && (stWidget.options.lang !== "")) {
                    stlib.logger.lang = stWidget.options.lang
                } else {
                    stlib.logger.lang = "en"
                }
                if (stlib.logger.productArray.length > 0) {
                    stlib.data.set("product", stlib.logger.productArray.toString(), "pageInfo")
                }
                stLight.log("pview", b);
                stWidget.options.sessionID = stLight.sessionID;
                stWidget.options.fpc = stLight.fpc;
                stLight.loadServicesLoggedIn(function() {
                    stButtons.onReady()
                })
            })
        };
        stLight.getSource = function() {
            var a = "share4x";
            if (stWidgetVersion == "5xa") {
                a = "share5x"
            }
            if (stLight.hasButtonOnPage()) {
                if (stLight.loadedFromBar) {
                    if (stWidgetVersion == "5xa") {
                        a = "bar_share5x"
                    } else {
                        a = "bar_share4x"
                    }
                }
            } else {
                if (stLight.loadedFromBar) {
                    a = "bar"
                }
            }
            return a
        };
        stLight.getSource2 = function(a) {
            var d = "share4x";
            if (stWidgetVersion == "5xa") {
                d = "share5x";
                try {
                    if (stLight.clickCallBack != false) {
                        stLight.clickCallBack(a.service)
                    }
                } catch (b) {}
            }
            if (a.type == "stbar" || a.type == "stsmbar") {
                d = "bar"
            }
            return d
        };
        stLight.log = function(d, e, a, b) {
            stlib.data.resetShareData();
            stlib.data.set("url", document.location.href, "shareInfo");
            stlib.data.set("title", document.title, "shareInfo");
            stlib.data.set("counter", stLight.counter++, "shareInfo");
            stlib.data.setSource(e);
            if (typeof(a) != "undefined") {
                stlib.data.set("destination", a, "shareInfo")
            }
            if (typeof(b) != "undefined") {
                stlib.data.set("buttonType", b, "shareInfo")
            }
            stlib.logger.log(d);
            if (d == "pview") {
                stLight.createSegmentFrame()
            }
        };
        stLight._stFpc = function() {
            if (!document.domain || document.domain.search(/\.gov/) > 0) {
                return false
            }
            var h = stLight._stGetFpc("__unam");
            if (h == false) {
                var d = Math.round(Math.random() * 2147483647);
                d = d.toString(16);
                var i = (new Date()).getTime();
                i = i.toString(16);
                var f = "";
                var a = stLight._stGetD();
                a = a.split(/\./)[1];
                if (!a) {
                    return false
                }
                f = stLight._stdHash(a) + "-" + i + "-" + d + "-1";
                h = f;
                stLight._stSetFpc(h)
            } else {
                var b = h;
                var g = b.split(/\-/);
                if (g.length == 4) {
                    var e = Number(g[3]);
                    e++;
                    b = g[0] + "-" + g[1] + "-" + g[2] + "-" + e;
                    h = b;
                    stLight._stSetFpc(h)
                }
            }
            return h
        };
        stLight._stSetFpc = function(h) {
            var a = "__unam";
            var d = new Date;
            var j = d.getFullYear();
            var g = d.getMonth() + 9;
            var i = d.getDate();
            var e = a + "=" + escape(h);
            if (j) {
                var b = new Date(j, g, i);
                e += "; expires=" + b.toGMTString()
            }
            var f = stLight._stGetD();
            e += "; domain=" + escape(f) + ";path=/";
            document.cookie = e
        };
        stLight._stGetD = function() {
            var b = document.domain.split(/\./);
            var a = "";
            if (b.length > 1) {
                a = "." + b[b.length - 2] + "." + b[b.length - 1]
            }
            return a
        };
        stLight._stGetFpc = function(b) {
            var a = document.cookie.match("(^|;) ?" + b + "=([^;]*)(;|$)");
            if (a) {
                return (unescape(a[2]))
            } else {
                return false
            }
        };
        stLight._stdHash = function(a) {
            var f = 0,
                e = 0;
            for (var d = a.length - 1; d >= 0; d--) {
                var b = parseInt(a.charCodeAt(d));
                f = ((f << 8) & 268435455) + b + (b << 12);
                if ((e = f & 161119850) != 0) {
                    f = (f ^ (e >> 20))
                }
            }
            return f.toString(16)
        };
        stLight._thisScript = null;
        stLight.getShareThisLightScript = function() {
            var e = document.getElementsByTagName("script");
            var d = null;
            for (var b = 0; b < e.length; b++) {
                var a = e[b].src;
                if (a.search(/.*sharethis.*\/button\/light.*/) >= 0) {
                    d = e[b]
                }
            }
            return d
        };
        stLight.dbrInfo = function() {
            var j = document.referrer;
            if (j && j.length > 0) {
                var h = /\/\/.*?\//;
                var e = j.match(h);
                if (typeof(e) !== "undefined" && typeof(e[0]) !== "undefined") {
                    var b = new RegExp(document.domain, "gi");
                    if (b.test(e[0]) == true) {
                        return false
                    }
                }
                var g = /(http:\/\/)(.*?)\/.*/i;
                var f = /(^.*\?)(.*)/ig;
                var a = "";
                var d = j.replace(g, "$2");
                var b = new RegExp(d, "gi");
                if (d.length > 0) {
                    a += "&refDomain=" + d
                } else {
                    return false
                }
                var i = j.replace(f, "$2");
                if (i.length > 0) {
                    a += "&refQuery=" + encodeURIComponent(i)
                }
                return a
            } else {
                return false
            }
        };
        stLight.odjs = function(a, b) {
            this.head = document.getElementsByTagName("head")[0];
            this.scriptSrc = a;
            this.script = document.createElement("script");
            this.script.setAttribute("type", "text/javascript");
            this.script.setAttribute("src", this.scriptSrc);
            if (window.attachEvent && document.all) {
                this.script.onreadystatechange = function() {
                    if (this.readyState == "complete" || ((a.indexOf("getAllAppDefault.esi") != -1 || a.indexOf("checkOAuth.esi") != -1) && this.readyState == "loaded")) {
                        b()
                    }
                }
            } else {
                this.script.onload = b
            }
            this.head.appendChild(this.script)
        };
        stLight.getAllAppDefault = function(e) {
            if (useEdgeSideInclude) {
                if (esiStatus == "loading") {
                    if (e != null) {
                        stButtons.cbAppQueue.push(e)
                    }
                    return
                } else {
                    if (esiStatus == "loaded") {
                        if (e != null) {
                            e()
                        }
                        return
                    }
                }
                esiStatus = "loading";
                var a = "cb=stLight.allDefault";
                var f = "&app=all";
                var b = "&publisher=" + ((stLight.publisher != null) ? stLight.publisher : "ur.00000000-0000-0000-0000-000000000000");
                var d = "&domain=" + document.location.hostname.replace(/^www\./, "");
                stLight.odjs((("https:" == document.location.protocol) ? "https://wd-edge.sharethis.com/button/getAllAppDefault.esi?" + a + f + b + d : "http://wd-edge.sharethis.com/button/getAllAppDefault.esi?" + a + f + b + d), function() {
                    esiStatus = "loaded";
                    isEsiLoaded = true;
                    for (var g = 0; g < stButtons.cbAppQueue.length; g++) {
                        stButtons.cbAppQueue[g]()
                    }
                    stButtons.cbAppQueue = [];
                    if (e != null) {
                        e()
                    }
                })
            } else {
                if (name == "cns") {
                    if (stWidget.options.doNotHash == null) {
                        stlib.hash.doNotHash = stWidget.options.doNotHash = true
                    }
                    if (stWidget.options.hashAddressBar == null) {
                        stlib.hash.hashAddressBar = stWidget.options.hashAddressBar = false
                    }
                    if (stWidget.options.doNotCopy == null) {
                        stlib.hash.doNotCopy = stWidget.options.doNotCopy = true
                    }
                } else {
                    if (name == "snapsets") {
                        if (stWidget.options.snapsets == null) {
                            stWidget.options.snapsets = false
                        }
                    }
                }
                if (e != null) {
                    e()
                }
            }
        };
        stLight.allDefault = function(a) {
            if (a) {
                if (a.cns) {
                    stLight.cnsDefault(a.cns)
                }
                if (a.snapsets) {
                    stLight.snapSetsDefault(a.snapsets)
                }
                if (a.migration) {
                    stLight.migrationDefault(a.migration)
                } else {
                    stLight.usePublisherDefaultSettings()
                }
                if (a.mobileWidget) {
                    stLight.mobileWidgetSetsDefault(a.mobileWidget)
                } else {
                    if (typeof(stLight.mobileWidget) != "undefined") {
                        stLight.setUserDefinedMobileParameter()
                    }
                }
            } else {
                stLight.usePublisherDefaultSettings()
            }
        };
        stLight.mobileWidgetSetsDefault = function(a) {
            if (typeof(a) != "undefined" && typeof(a.mobileWidget) != "undefined") {
                showHoverbarReskinned = a.mobileWidget
            }
            if (typeof(stLight.mobileWidget) != "undefined") {
                stLight.setUserDefinedMobileParameter()
            } else {
                if (a) {
                    stShowNewMobileWidget = a.mobileWidget
                }
            }
        };
        stLight.setUserDefinedMobileParameter = function() {
            if (stLight.mobileWidget === true || stLight.mobileWidget === "true") {
                stShowNewMobileWidget = true
            } else {
                if (stLight.mobileWidget === false || stLight.mobileWidget === "false") {
                    stShowNewMobileWidget = false
                } else {
                    stShowNewMobileWidget = false
                }
            }
        };
        stLight.usePublisherDefaultSettings = function() {
            if (typeof(switchTo5x) == "undefined") {
                stWidgetVersion = "4x"
            } else {
                if (switchTo5x == false) {
                    stWidgetVersion = "4x"
                }
                if (switchTo5x == true) {
                    stWidgetVersion = "5xa"
                }
            }
            if (typeof(stLight.mobileWidget) != "undefined") {
                stLight.setUserDefinedMobileParameter()
            }
        };
        stLight.migrationDefault = function(a) {
            if (stWidget.skipESIValue == false) {
                if (stLight.version) {
                    stWidgetVersion = stLight.version
                } else {
                    if ((stWidget.options.lang == "") || (stWidget.options.lang == "en")) {
                        if ((typeof(a) !== "undefined") && (a.version !== "")) {
                            if (a.version == "5x") {
                                stWidgetVersion = "5xa"
                            } else {
                                stWidgetVersion = a.version
                            }
                        }
                    }
                    if (stWidgetVersion == false) {
                        stLight.usePublisherDefaultSettings()
                    } else {
                        stWidget.options.publisherMigration = true
                    }
                }
            }
            if (stWidgetVersion == "5x" || stLight.version == "5x") {
                stWidgetVersion = "5xa"
            }
        };
        stLight.snapSetsDefault = function(a) {
            if (a) {
                if (a.override) {
                    stWidget.options.snapsets = a.snapsets
                } else {
                    if (stWidget.options.snapsets == null) {
                        stWidget.options.snapsets = a.snapsets
                    }
                }
            }
        };
        stLight.cnsDefault = function(a) {
            if (a) {
                if (a.override) {
                    stWidget.options.doNotHash = a.doNotHash;
                    stWidget.options.hashAddressBar = a.hashAddressBar;
                    stWidget.options.doNotCopy = a.doNotCopy
                } else {
                    if (stWidget.options.doNotHash == null) {
                        stWidget.options.doNotHash = a.doNotHash
                    }
                    if (stWidget.options.hashAddressBar == null) {
                        stWidget.options.hashAddressBar = a.hashAddressBar
                    }
                    if (stWidget.options.doNotCopy == null) {
                        stWidget.options.doNotCopy = a.doNotCopy
                    }
                }
                stlib.hash.doNotHash = stWidget.options.doNotHash = (/true/i).test(stWidget.options.doNotHash) ? true : false;
                stlib.hash.hashAddressBar = stWidget.options.hashAddressBar = (/true/i).test(stWidget.options.hashAddressBar) ? true : false;
                stlib.hash.doNotCopy = stWidget.options.doNotCopy = (/true/i).test(stWidget.options.doNotCopy) ? true : false
            }
        };
        stLight.loadServicesLoggedIn = function(b) {
            if (useFastShare && esiLoaded == false) {
                try {
                    stLight.odjs((("https:" == document.location.protocol) ? "https://wd-edge.sharethis.com/button/checkOAuth.esi" : "http://wd-edge.sharethis.com/button/checkOAuth.esi"), function() {
                        if (typeof(userDetails) !== "undefined") {
                            stIsLoggedIn = true;
                            if (userDetails !== "null") {
                                servicesLoggedIn = userDetails
                            }
                        }
                        esiLoaded = true;
                        if (b != null) {
                            b()
                        }
                    })
                } catch (a) {}
            } else {
                if (b != null) {
                    b()
                }
            }
        };
        if (window.document.readyState == "completed") {
            stLight.onReady()
        } else {
            if (typeof(window.addEventListener) != "undefined") {
                window.addEventListener("load", stLight.onReady, false)
            } else {
                if (typeof(document.addEventListener) != "undefined") {
                    document.addEventListener("load", stLight.onReady, false)
                } else {
                    if (typeof window.attachEvent != "undefined") {
                        window.attachEvent("onload", stLight.onReady)
                    }
                }
            }
        }
        stLight.createSegmentFrame = function() {
            try {
                stLight.segmentframe = document.createElement('<iframe name="stframe" allowTransparency="true" style="body{background:transparent;}" ></iframe>')
            } catch (b) {
                stLight.segmentframe = document.createElement("iframe")
            }
            stLight.segmentframe.id = "stSegmentFrame";
            stLight.segmentframe.name = "stSegmentFrame";
            var d = document.body;
            var a = (("https:" == document.location.protocol) ? "https://seg." : "http://seg.") + "sharethis.com/getSegment.php?purl=" + encodeURIComponent(document.location.href) + "&jsref=" + encodeURIComponent(document.referrer) + "&rnd=" + (new Date()).getTime();
            stLight.segmentframe.src = a;
            stLight.segmentframe.frameBorder = "0";
            stLight.segmentframe.scrolling = "no";
            stLight.segmentframe.width = "0px";
            stLight.segmentframe.height = "0px";
            stLight.segmentframe.setAttribute("style", "display:none;");
            d.appendChild(stLight.segmentframe)
        };
        stLight.options = function(a) {
            if (a && a.version) {
                stLight.version = a.version
            }
            if (a && typeof(a.mobileWidget) != "undefined") {
                stLight.mobileWidget = a.mobileWidget
            }
            if (a && a.publisher) {
                stlib.data.setPublisher(a.publisher);
                stLight.publisher = a.publisher
            }
            if (a && a.loadedFromBar) {
                stLight.loadedFromBar = a.loadedFromBar
            }
            if (a && a.clickCallBack && typeof(a.clickCallBack) == "function") {
                stLight.clickCallBack = a.clickCallBack
            }
            if (a && typeof(a.hashAddressBar) != "undefined") {
                stlib.hash.hashAddressBar = a.hashAddressBar
            }
            if (a && typeof(a.doNotHash) != "undefined") {
                stlib.hash.doNotHash = a.doNotHash
            }
            if (a && typeof(a.doNotCopy) != "undefined") {
                stlib.hash.doNotCopy = a.doNotCopy
            }
            for (var b in a) {
                if (b == "shorten") {
                    stFastShareObj.shorten = a[b]
                }
                if (stWidget.options.hasOwnProperty(b) && a[b] !== null) {
                    stWidget.options[b] = a[b]
                }
            }
        };
        stLight.hasButtonOnPage = function() {
            var g = document.getElementsByTagName("*");
            var e = new RegExp(/^st_(.*?)$/);
            var d = new RegExp(/st_(.*?)_custom$/);
            var a = g.length;
            for (var b = 0; b < a; b++) {
                if (typeof(g[b].className) == "string" && g[b].className != "") {
                    if ((g[b].className.match(/st_whatsapp_custom/g) || g[b].className.match(/st_kik_custom/g)) && !(stlib.browser.mobile.isIOs() || stlib.browser.mobile.isAndroid()) && !(iswhatsappCustomButton || isKikCustomButton)) {
                        if (typeof(window.console) !== "undefined") {
                            try {
                                if (g[b].className.match(/st_whatsapp_custom/g)) {
                                    console.debug("WhatsApp custom button has support for iOS (iPhone) and android only and it will not work on any other platform.");
                                    iswhatsappCustomButton = true
                                } else {
                                    if (g[b].className.match(/st_kik_custom/g)) {
                                        console.debug("Kik custom button has support for iOS (iPhone) and android only and it will not work on any other platform.");
                                        isKikCustomButton = true
                                    }
                                }
                            } catch (f) {}
                        }
                    }
                    if (g[b].className.match(d) && g[b].className.match(d).length >= 2 && g[b].className.match(d)[1]) {
                        return true
                    } else {
                        if (g[b].className.match(e) && g[b].className.match(e).length >= 2 && g[b].className.match(e)[1]) {
                            return true
                        }
                    }
                }
            }
            return false
        }
    }
    var stButtons = {};
    stButtons.smartifyButtons = function(a) {
        if (typeof(a) != "undefined" && a != "undefined") {
            stRecentServices = a;
            for (var b in stRecentServices) {
                stRecentServices[b].processed = false
            }
        }
        stButtons.completeInit()
    };
    stButtons.makeButton = function(w) {
        var g = w.service;
        var I = w.text;
        var Z = "";
        if (typeof(stWidget.options.shorten) != "undefined") {
            Z = stWidget.options.shorten
        }
        if (I == null && (w.type == "vcount" || w.type == "hcount")) {
            I = "Share";
            if (g == "email") {
                I = "Mail"
            }
        }
        if (g == "fb_like") {
            g = "fblike"
        } else {
            if (g == "fblike_fbLong") {
                g = "fblike";
                w.type = "fbLong"
            }
        }
        var h = stWidget.ogurl ? stWidget.ogurl : (stWidget.twitterurl ? stWidget.twitterurl : document.location.href);
        h = w.url ? w.url : h;
        var V = h;
        if (!stlib.hash.doNotHash) {
            V = stlib.hash.appendHash(h);
            h = V
        }
        stlib.data.set("url", V, "shareInfo");
        var O = (w.short_url != null) ? w.short_url : "";
        var L = stWidget.ogtitle ? stWidget.ogtitle : (stWidget.twittertitle ? stWidget.twittertitle : document.title);
        L = w.title ? w.title : L;
        if (typeof(w.pinterest_native) == "string") {
            w.pinterest_native = w.pinterest_native.replace(/^\s+|\s+$/g, "")
        }
        if ((g == "weheartit" || g == "pinterest" || g == "kik") && (w.pinterest_native == "false" || w.pinterest_native == null || w.pinterest_native == "")) {
            var f = stWidget.ogimg ? stWidget.ogimg : (stWidget.twitterimg ? stWidget.twitterimg : (w.thumbnail ? w.thumbnail : null));
            if (typeof(f) == "string") {
                f = f.replace(/^\s+|\s+$/g, "")
            }
            if (typeof(w.image) == "string") {
                w.image = w.image.replace(/^\s+|\s+$/g, "")
            }
            f = (w.image) ? w.image : f
        }
        var aa = stWidget.desc ? stWidget.desc : "";
        aa = stWidget.ogdesc ? stWidget.ogdesc : (stWidget.twitterdesc ? stWidget.twitterdesc : stWidget.desc);
        aa = (w.summary && w.summary != null) ? w.summary : aa;
        var s = (w.message && w.message != null) ? w.message : "";
        if (/(http|https):\/\//.test(h) == false) {
            h = decodeURIComponent(h);
            L = decodeURIComponent(L)
        }
        if (/(http|https):\/\//.test(O) == false) {
            O = decodeURIComponent(O)
        }
        var ag = document.createElement("span");
        ag.setAttribute("style", "text-decoration:none;color:#000000;display:inline-block;cursor:pointer;");
        ag.className = "stButton";
        if (w.type == "custom" && g != "email" && g != "sharethis" && g != "wordpress") {
            w.element.onclick = function() {
                _$d_();
                _$d1("Clicked on a custom button to share");
                stLight.callSubscribers("click", g, h);
                stlib.data.resetShareData();
                stlib.data.set("url", h, "shareInfo");
                stlib.data.set("short_url", O, "shareInfo");
                stlib.data.set("shorten", Z, "shareInfo");
                stlib.data.set("title", L, "shareInfo");
                stlib.data.set("destination", g, "shareInfo");
                stlib.data.setSource("chicklet");
                stlib.data.set("buttonType", w.type, "shareInfo");
                if (typeof(pinterest_native) != "undefined" && pinterest_native != null && pinterest_native != " ") {
                    stlib.data.set("pinterest_native", pinterest_native, "shareInfo")
                }
                if (typeof(f) != "undefined" && f != null && f != " ") {
                    stlib.data.set("image", f, "shareInfo")
                }
                if (typeof(aa) != "undefined" && aa != null) {
                    stlib.data.set("description", aa, "shareInfo")
                }
                if (s != "") {
                    stlib.data.set("message", s, "shareInfo")
                }
                if (w.element.getAttribute("st_username") != null) {
                    stlib.data.set("refUsername", w.element.getAttribute("st_username"), "shareInfo")
                }
                if (g == "twitter" && w.element.getAttribute("st_via") != null) {
                    stlib.data.set("via", w.element.getAttribute("st_via").replace(/^\s+|\s+$/g, ""), "shareInfo")
                }
                stlib.sharer.share(null, stWidget.options.servicePopup);
                if (g == "pinterest") {
                    stlib.sharer.sharePinterest()
                }
                if (g == "print") {
                    stlib.sharer.stPrint()
                }
            };
            return false
        }
        if (!((g == "email" || g == "sharethis" || g == "wordpress") || (stIsLoggedIn && servicesLoggedIn && typeof(servicesLoggedIn[g]) != "undefined" && ((useFastShare || (!useFastShare && switchTo5x)) && (g == "facebook" || g == "twitter" || g == "yahoo" || g == "linkedin"))))) {
            ag.onclick = function() {
                if (!(stlib.browser.mobile.isIOs() || stlib.browser.mobile.isAndroid()) && ((g == "whatsapp" || g == "kik") && window.location.pathname.indexOf("get-sharing-tools") != -1)) {} else {
                    _$d_();
                    _$d1("Clicked on a regular button to share");
                    stLight.callSubscribers("click", g, h);
                    var b = this.getElementsByTagName("*");
                    for (var a = 0; a < b.length; a++) {
                        if (b[a].className == "stBubble_hcount" || b[a].className == "stBubble_count") {
                            if (!stWidget.options.nativeCount || !stlib.nativeCounts.checkNativeCountServicesQueue(g)) {
                                if (!isNaN(b[a].innerHTML)) {
                                    b[a].innerHTML = Number(b[a].innerHTML) + 1
                                }
                            }
                        }
                    }
                    if (stWidget.options.tracking) {
                        shareLog(g, h)
                    }
                    stlib.data.resetShareData();
                    var ai = "";
                    var ah = stLight.getSource();
                    if (ah == "share5x") {
                        ai = "5x"
                    } else {
                        if (ah == "share4x") {
                            ai = "4x"
                        }
                    }
                    stlib.data.set("url", h, "shareInfo");
                    stlib.data.set("short_url", O, "shareInfo");
                    stlib.data.set("shorten", Z, "shareInfo");
                    stlib.data.set("title", L, "shareInfo");
                    stlib.data.set("destination", g, "shareInfo");
                    stlib.data.setSource("chicklet" + ai);
                    stlib.data.set("buttonType", w.type, "shareInfo");
                    if (typeof(pinterest_native) != "undefined" && pinterest_native != null && pinterest_native != " ") {
                        stlib.data.set("pinterest_native", pinterest_native, "shareInfo")
                    }
                    if (typeof(f) != "undefined" && f != null) {
                        stlib.data.set("image", f, "shareInfo")
                    }
                    if (typeof(aa) != "undefined" && aa != null) {
                        stlib.data.set("description", aa, "shareInfo")
                    }
                    if (s != "") {
                        stlib.data.set("message", s, "shareInfo")
                    }
                    if (w.element.getAttribute("st_username") != null) {
                        stlib.data.set("refUsername", w.element.getAttribute("st_username"), "shareInfo")
                    }
                    if (g == "twitter" && w.element.getAttribute("st_via") != null) {
                        stlib.data.set("via", w.element.getAttribute("st_via").replace(/^\s+|\s+$/g, ""), "shareInfo")
                    }
                    stlib.sharer.share(null, stWidget.options.servicePopup);
                    if (g == "pinterest" && (stlib.data.get("image", "shareInfo") == false || stlib.data.get("image", "shareInfo") == null)) {
                        stlib.sharer.sharePinterest()
                    }
                    if (g == "print") {
                        stlib.sharer.stPrint()
                    }
                }
            }
        }
        if (g == "gbuzz") {
            return ag
        }
        if (g == "fblike" || g == "fbsend" || g == "fbrec" || g == "fbLong" || g == "fbsub") {
            if (g == "fbsub") {
                if (w.element.getAttribute("st_username") != null) {
                    h = "http://facebook.com/" + w.element.getAttribute("st_username")
                } else {
                    h = ""
                }
            }
            return stButtons.makeFBButton(g, w.type, h)
        }
        if (stlib.nativeButtons.checkNativeButtonSupport(g)) {
            var W = {};
            if (w.element.getAttribute("st_username") != null) {
                W.username = w.element.getAttribute("st_username")
            }
            if (w.element.getAttribute("st_followId") != null) {
                W.followId = w.element.getAttribute("st_followId")
            }
            retObj = stlib.nativeButtons.makeButton(g, w.type, W);
            if (retObj) {
                if (stlib.nativeButtons.checkNativeButtonLogging(g)) {
                    retObj.onclick = function() {
                        stlib.nativeButtons.logService(g, h)
                    }
                }
                return retObj
            } else {
                if (typeof(window.console) !== "undefined") {
                    try {
                        console.debug("Looks like " + g + " is missing some required parameters. Please recheck " + g + " HTML \nFor help, contact support@sharethis.com")
                    } catch (ab) {}
                }
                return ag
            }
        }
        if (g == "plusone") {
            stButtons.loadPlusone = true;
            var G = document.createElement("div");
            G.innerHTML = "&nbsp;";
            iedocmode = stlib.browser.getIEVersion();
            var x = (navigator.userAgent.indexOf("MSIE 7.0") != -1);
            var i = (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1);
            var Q = "display:inline-block;overflow:hidden;line-height:0px;";
            var D = "overflow:hidden;zoom:1;display:inline;vertical-align:bottom;";
            var E = "overflow:hidden;zoom:1;display:inline;line-height:0px;position:relative;";
            var e = document.createElement("g:plusone");
            var l = h;
            if ((/#sthash/i).test(l)) {
                var n = l.split("#");
                if (n.length > 0) {
                    l = n[0]
                }
            }
            e.setAttribute("href", l);
            if (w.type == "vcount") {
                e.setAttribute("size", "tall");
                G.setAttribute("style", Q + "vertical-align:bottom;width:55px; height:61px;");
                x && G.style.setAttribute ? G.style.setAttribute("cssText", Q + "vertical-align:bottom;width:55px; height:61px;", 0) : null;
                (iedocmode && (iedocmode == 7) && G.style.setAttribute) ? G.style.setAttribute("cssText", E + "vertical-align:bottom;bottom:-8px;width:55px; height:80px;", 0): (null)
            } else {
                if (w.type == "hcount") {
                    e.setAttribute("size", "medium");
                    e.setAttribute("count", "true");
                    G.setAttribute("style", Q + "position:relative;vertical-align:middle;bottom:0px;width:75px; height:21px;");
                    x && G.style.setAttribute ? G.style.setAttribute("cssText", Q + "position:relative;vertical-align:middle;width:75px; height:21px;", 0) : null;
                    (iedocmode && (iedocmode == 7) && G.style.setAttribute) ? G.style.setAttribute("cssText", E + "vertical-align:middle;bottom:2px;width:75px; height:21px;", 0): (null)
                } else {
                    if (w.type == "button") {
                        e.setAttribute("size", "medium");
                        e.setAttribute("count", "false");
                        G.setAttribute("style", Q + "position:relative;vertical-align:middle;bottom:0px;width:36px; height:21px;");
                        x && G.style.setAttribute ? G.style.setAttribute("cssText", Q + "position:relative;vertical-align:middle;width:36px; height:21px;", 0) : null;
                        (iedocmode && (iedocmode == 7) && G.style.setAttribute) ? G.style.setAttribute("cssText", E + "vertical-align:middle;bottom:-8px;width:36px; height:39px;", 0): (null)
                    } else {
                        if (w.type == "large") {
                            e.setAttribute("size", "large");
                            e.setAttribute("count", "false");
                            G.setAttribute("style", Q + "position:relative;vertical-align:middle;bottom:12px;width:38px; height:27px;");
                            x && G.style.setAttribute ? G.style.setAttribute("cssText", Q + "position:relative;vertical-align:middle;bottom:0px;width:38px; height:30px;", 0) : null;
                            (iedocmode && ((iedocmode == 8) || (iedocmode == 9)) && G.style.setAttribute) ? G.style.setAttribute("cssText", E + "vertical-align:middle;bottom:7px;width:38px; height:39px;", 0): (null);
                            (iedocmode && (iedocmode == 7) && G.style.setAttribute) ? G.style.setAttribute("cssText", E + "vertical-align:middle;bottom:1px;width:38px; height:39px;", 0): (null)
                        } else {
                            e.setAttribute("size", "small");
                            e.setAttribute("count", "false");
                            G.setAttribute("style", Q + "position:relative;vertical-align:middle;bottom:0px;width:36px; height:16px;");
                            x && G.style.setAttribute ? G.style.setAttribute("cssText", Q + "position:relative;vertical-align:middle;width:36px; height:16px;", 0) : null;
                            (iedocmode && (iedocmode == 7) && G.style.setAttribute) ? G.style.setAttribute("cssText", E + "vertical-align:middle;bottom:-12px;width:36px; height:36px;", 0): (null)
                        }
                    }
                }
            }
            G.appendChild(e);
            e.setAttribute("callback", "plusoneCallback");
            return G
        }
        var j = ("https:" == document.location.protocol) ? "https://ws.sharethis.com/images/" : "http://w.sharethis.com/images/";
        var t = g;

        function o(a) {
            var ah = new Date();
            var b = null;
            var ai = 0;
            do {
                b = new Date();
                ai++;
                if (ai > a) {
                    break
                }
            } while (((b - ah) < a) || !esiLoaded)
        }
        if (!esiLoaded && (g == "facebook" || g == "twitter" || g == "linkedin" || g == "yahoo")) {
            o(500)
        }
        if (w.type == "chicklet") {
            var N = document.createElement("span");
            N.className = "chicklets " + g;
            if (I == null) {
                N.innerHTML = "&nbsp;";
                ag.style.paddingLeft = "0px";
                ag.style.paddingRight = "0px";
                ag.style.width = "16px"
            } else {
                N.appendChild(document.createTextNode(I))
            }
            ag.appendChild(N);
            return ag
        } else {
            if (w.type == "large") {
                var N = document.createElement("span");
                N.className = "stLarge";
                ag.appendChild(N);
                N.style.backgroundImage = "url('" + j + t + "_32.png')";
                return ag
            } else {
                if (w.type == "basic" || w.type == "circle" || w.type == "brushed" || w.type == "shiny") {
                    var N = document.createElement("span");
                    N.className = "stLarge";
                    N.className = w.size == "16" ? ((w.type == "brushed" || w.type == "shiny") ? "stSmall2" : "stSmall") : N.className;
                    N.className = w.size == "64" ? "stHuge" : N.className;
                    ag.appendChild(N);
                    N.style.backgroundImage = "url('" + j + w.type + "/" + w.size + "/" + t + (w.color ? "_" + w.color : "_" + w.type) + ".png')";
                    return ag
                } else {
                    if (w.type == "pcount" || w.type == "stbar" || w.type == "stsmbar") {
                        var C = document.createElement("span");
                        var N = document.createElement("span");
                        if (w.type == "stsmbar") {
                            N.className = "stSmBar";
                            var j = ("https:" == document.location.protocol) ? "https://ws.sharethis.com/images/" : "http://w.sharethis.com/images/";
                            N.style.backgroundImage = "url('" + j + t + "_16.png')"
                        } else {
                            N.className = "stLarge";
                            var j = ("https:" == document.location.protocol) ? "https://ws.sharethis.com/images/" : "http://w.sharethis.com/images/";
                            N.style.backgroundImage = "url('" + j + t + "_32.png')"
                        }
                        C.appendChild(N);
                        var u = document.createElement("span");
                        var af = document.createElement("div");
                        if (w.type == "stsmbar") {
                            af.className = "stBubbleSmHoriz"
                        } else {
                            af.className = "stBubbleSm"
                        }
                        af.setAttribute("id", "stBubble_" + w.count);
                        af.style.visibility = "hidden";
                        var X = document.createElement("div");
                        X.className = "stBubble_count_sm";
                        af.appendChild(X);
                        u.appendChild(af);
                        u.appendChild(C);
                        ag.appendChild(u);
                        stButtons.getCount2(h, g, X);
                        C.onmouseover = function() {
                            var a = document.getElementById("stBubble_" + w.count);
                            a.style.visibility = "visible"
                        };
                        C.onmouseout = function() {
                            var a = document.getElementById("stBubble_" + w.count);
                            a.style.visibility = "hidden"
                        };
                        return ag
                    } else {
                        if (w.type == "button" || w.type == "vcount" || w.type == "hcount") {
                            var C = document.createElement("span");
                            C.className = "stButton_gradient";
                            var J = document.createElement("span");
                            J.className = "chicklets " + g;
                            if (I == null) {
                                J.innerHTML = "&nbsp;"
                            } else {
                                J.appendChild(document.createTextNode(I))
                            }
                            C.appendChild(J);
                            if (g == "facebook" || g == "twitter" || g == "linkedin" || g == "yahoo" || g == "pinterest" || g == "sharethis" || g == "email") {
                                var v = document.createElement("span");
                                v.className = "stMainServices st-" + g + "-counter";
                                v.innerHTML = "&nbsp";
                                C = v;
                                v.style.backgroundImage = "url('" + j + t + "_counter.png')";
                                if (g == "sharethis" && I != null && I.length < 6) {
                                    v.className = "stMainServices st-" + g + "-counter2";
                                    v.style.backgroundImage = "url('" + j + t + "_counter2.png')"
                                }
                            }
                            if (w.type == "vcount") {
                                var u = document.createElement("div");
                                var af = document.createElement("div");
                                af.className = "stBubble";
                                var X = document.createElement("div");
                                X.className = "stBubble_count";
                                af.appendChild(X);
                                u.appendChild(af);
                                u.appendChild(C);
                                ag.appendChild(u);
                                stButtons.getCount2(h, g, X)
                            } else {
                                if (w.type == "hcount") {
                                    var u = document.createElement("span");
                                    var P = document.createElement("span");
                                    P.className = "stButton_gradient stHBubble";
                                    var r = document.createElement("span");
                                    r.className = "stButton_left";
                                    r.innerHTML = "&nbsp;";
                                    var y = document.createElement("span");
                                    y.className = "stButton_right";
                                    y.innerHTML = "&nbsp;";
                                    var X = document.createElement("span");
                                    X.className = "stBubble_hcount";
                                    P.appendChild(X);
                                    u.appendChild(C);
                                    var F = document.createElement("span");
                                    F.className = "stArrow";
                                    F.appendChild(P);
                                    u.appendChild(F);
                                    ag.appendChild(u);
                                    stButtons.getCount2(h, g, X)
                                } else {
                                    ag.appendChild(C)
                                }
                            }
                            if (w.type == "vcount" || w.type == "hcount") {
                                if (w.ctype == "native") {
                                    if (g == "twitter") {
                                        var Y = document.createElement("span");
                                        Y.className = "stButton";
                                        var H = 55;
                                        var ac = 20;
                                        var T = "";
                                        var k = "none";
                                        var K = 7;
                                        if (w.type == "vcount") {
                                            var q = document.createElement("div");
                                            H = 55;
                                            ac = 62;
                                            T = "top:42px;";
                                            k = "vertical"
                                        } else {
                                            if (w.type == "hcount") {
                                                var q = document.createElement("span");
                                                H = 110;
                                                ac = 20;
                                                k = "horizontal"
                                            }
                                        }
                                        iedocmode = stlib.browser.getIEVersion();
                                        var U = document.createElement("span");
                                        U.setAttribute("style", "vertical-align:bottom;line-height:0px;position:absolute;padding:0px !important;" + T + "width:55px;height:20px;");
                                        (iedocmode && (iedocmode == 7) && U.style.setAttribute) ? U.style.setAttribute("cssText", "vertical-align:bottom;line-height:0px;position:absolute;padding:0px !important;" + T + "width:55px;height:20px;", 0): null;
                                        try {
                                            var S = document.createElement('<iframe name="stframe" allowTransparency="true" scrolling="no" frameBorder="0"></iframe>')
                                        } catch (ab) {
                                            S = document.createElement("iframe");
                                            S.setAttribute("allowTransparency", "true");
                                            S.setAttribute("frameborder", "0");
                                            S.setAttribute("scrolling", "no")
                                        }
                                        var ae = encodeURIComponent(h);
                                        S.setAttribute("src", "http://platform.twitter.com/widgets/tweet_button.html?count=" + k + "&url=" + ae);
                                        S.setAttribute("style", "width:" + H + "px;height:" + ac + "px;");
                                        (iedocmode && (iedocmode == 7) && S.style.setAttribute) ? S.style.setAttribute("cssText", "width:" + H + "px;height:" + ac + "px;", 0): null;
                                        if ((useFastShare && servicesLoggedIn && typeof(servicesLoggedIn[g]) != "undefined")) {
                                            q.appendChild(U)
                                        }
                                        q.appendChild(S);
                                        C = q;
                                        Y.appendChild(C);
                                        Y.setAttribute("style", "text-decoration:none;color:#000000;display:inline-block;cursor:pointer;vertical-align:bottom;margin-top:6px;width:" + H + "px;height:" + ac + "px;");
                                        (iedocmode && (iedocmode == 7) && Y.style.setAttribute) ? Y.style.setAttribute("cssText", "text-decoration:none;color:#000000;display:inline-block;cursor:pointer;vertical-align:bottom;width:" + H + "px;height:" + ac + "px;", 0): null;
                                        ag = Y
                                    } else {
                                        if (g == "facebook") {
                                            stButtons.getXFBMLFromFB(w);
                                            return stButtons.makeFBButton("fblike", w.type, h)
                                        } else {
                                            if (g == "linkedin") {}
                                        }
                                    }
                                }
                            }
                        } else {
                            if (w.type == "css") {
                                var C = document.createElement("div");
                                C.className = "stCSSButton";
                                if (w.cssType == "cssV") {
                                    var B = document.createElement("div");
                                    B.className = "stCSSVBubble";
                                    var M = document.createElement("div");
                                    M.className = "stCSSVBubble_count";
                                    B.appendChild(M);
                                    var m = document.createElement("div");
                                    m.className = "stCSSVArrow";
                                    var R = document.createElement("div");
                                    R.className = "stCSSVArrowBorder";
                                    R.appendChild(m);
                                    ag.appendChild(B);
                                    ag.appendChild(R);
                                    stButtons.getCount2(h, g, M)
                                }
                                var d = document.createElement("div");
                                d.className = "stCSSSprite " + g;
                                d.innerHTML = "&nbsp;";
                                var N = document.createElement("span");
                                N.className = "stCSSText";
                                C.appendChild(d);
                                if (I == null || I == "") {} else {
                                    N.appendChild(document.createTextNode(I));
                                    C.appendChild(N)
                                }
                                ag.appendChild(C);
                                if (w.cssType == "cssH") {
                                    var A = document.createElement("div");
                                    A.className = "stCSSHBubble";
                                    var M = document.createElement("div");
                                    M.className = "stCSSHBubble_count";
                                    A.appendChild(M);
                                    var ad = document.createElement("div");
                                    ad.className = "stCSSHArrow";
                                    var p = document.createElement("div");
                                    p.className = "stCSSHArrowBorder";
                                    p.appendChild(ad);
                                    ag.appendChild(p);
                                    ag.appendChild(A);
                                    stButtons.getCount2(h, g, M)
                                }
                            }
                        }
                    }
                }
            }
        }
        return ag
    };
    stButtons.makeFBButton = function(j, l, b) {
        try {
            var i = document.createElement("<div></div>")
        } catch (e) {
            i = document.createElement("div")
        }
        if ((/#sthash/i).test(b)) {
            var m = b.split("#");
            if (m.length > 0) {
                b = m[0]
            }
        }
        var d = b;
        var h = "button_count";
        var k = "fb-send";
        var f = "";
        iedocmode = stlib.browser.getIEVersion();
        var g = "";
        if (l == "vcount") {
            h = "box_count"
        } else {
            if (l == "hcount") {} else {
                if (l == "large") {
                    g = (iedocmode && (iedocmode == 7)) ? "vertical-align:bottom;bottom:3px;" : "bottom:7px;margin-top:9px;"
                } else {
                    if (l == "button") {} else {
                        g = "top:1px;margin-top:0px;"
                    }
                }
            }
        }
        if (j == "fbLong") {
            k = "fb-like";
            h = "standard";
            i.setAttribute("data-layout", h);
            i.setAttribute("data-send", "false");
            i.setAttribute("data-show-faces", "false")
        } else {
            if (j == "fbsend") {
                k = "fb-send"
            } else {
                if (j == "fblike" || j == "fbrec") {
                    (j == "fbrec") ? f = "recommend": null;
                    k = "fb-like";
                    i.setAttribute("data-action", f);
                    i.setAttribute("data-send", "false");
                    i.setAttribute("data-layout", h);
                    i.setAttribute("data-show-faces", "false")
                } else {
                    if (j == "fbsub") {
                        k = "fb-subscribe";
                        i.setAttribute("data-layout", h);
                        i.setAttribute("data-show-faces", "false")
                    }
                }
            }
        }
        i.setAttribute("class", k);
        i.setAttribute("data-href", d);
        if (iedocmode && (iedocmode == 7)) {
            if (j != "fbsend") {
                i = document.createElement("<div class='" + k + "' data-action='" + f + "' data-send='false' data-layout='" + h + "' data-show-faces='false' data-href='" + d + "'></div>")
            } else {
                i = document.createElement("<div class='" + k + "' data-href='" + d + "'></div>")
            }
        }
        var a = document.createElement("span");
        a.setAttribute("style", "text-decoration:none;color:#000000;display:inline-block;cursor:pointer;position:relative;margin:3px 3px 0;padding:0px;font-size:11px;line-height:0px;vertical-align:bottom;overflow:visible;" + g);
        (iedocmode && (iedocmode == 7) && a.style.setAttribute) ? a.style.setAttribute("cssText", "text-decoration:none;color:#000000;display:inline-block;cursor:pointer;position:relative;margin:3px 3px 0;font-size:11px;line-height:0px;" + g, 0): (null);
        a.appendChild(i);
        return a
    };
    stButtons.getCount = function(d, a, e) {
        var b = false;
        if (e && e !== null) {
            while (e.childNodes.length >= 1) {
                try {
                    e.removeChild(e.firstChild)
                } catch (f) {}
            }
        }
        stButtons.cbQueue.push({
            url: d,
            service: a,
            element: e
        });
        stButtons.getCountsFromService(d, a, e)
    };
    stButtons.getCount2 = function(d, a, e) {
        var b = false;
        if (e && e !== null) {
            while (e.childNodes.length >= 1) {
                try {
                    e.removeChild(e.firstChild)
                } catch (f) {}
            }
        }
        if (stWidget.options.nativeCount && stlib.nativeCounts.checkNativeCountServicesQueue(a)) {
            if (a == "facebook") {
                if ((/#/).test(d)) {
                    d = d.split("#")[0]
                }
            }
            stButtons.cbNativeQueue.push({
                url: d,
                service: a,
                element: e
            });
            if (typeof(stButtons.countsNativeResp[d]) == "undefined") {
                stButtons.countsNativeResp[d] = []
            }
            if (typeof(stButtons.countsNativeResp[d][a]) == "undefined") {
                stlib.nativeCounts.getNativeCounts(a, d, "stButtons." + a + "CB");
                stButtons.countsNativeResp[d][a] = null
            } else {
                if (stButtons.countsNativeResp[d][a] != null) {
                    switch (a) {
                        case "facebook":
                            stButtons.facebookCB(stButtons.countsNativeResp[d][a]);
                            break;
                        case "linkedin":
                            stButtons.linkedinCB(stButtons.countsNativeResp[d][a]);
                            break;
                        case "stumbleupon":
                            stButtons.stumbleuponCB(stButtons.countsNativeResp[d][a]);
                            break
                    }
                }
            }
        } else {
            stButtons.cbQueue.push({
                url: d,
                service: a,
                element: e
            });
            stButtons.getCountsFromService(d, a, e)
        }
    };
    stButtons.processCB = function(a) {
        if (typeof(a) != "undefined" && typeof(a.ourl) != "undefined") {
            stButtons.countsResp[a.ourl] = a
        }
        stButtons.processCount(a)
    };
    stButtons.stumbleuponCB = function(a) {
        var b = {
            ourl: "",
            stumbleupon: null
        };
        if (typeof(a) != "undefined" && typeof(a.result) != "undefined") {
            if (typeof(stButtons.countsNativeResp[a.result.url]) != "undefined") {
                stButtons.countsNativeResp[a.result.url]["stumbleupon"] = a
            }
            b.ourl = a.result.url;
            if (typeof(a.result.views) != "undefined") {
                b.stumbleupon = a.result.views
            }
        }
        stButtons.processNativeCount(b, "stumbleupon")
    };
    stButtons.linkedinCB = function(a) {
        var b = {
            ourl: "",
            linkedin: null
        };
        if (typeof(a) != "undefined") {
            if (typeof(stButtons.countsNativeResp[a.url]) != "undefined") {
                stButtons.countsNativeResp[a.url]["linkedin"] = a
            }
            b.ourl = a.url;
            if (typeof(a.count) != "undefined") {
                b.linkedin = a.count
            }
        }
        stButtons.processNativeCount(b, "linkedin")
    };
    stButtons.facebookCB = function(a) {
        var b = {
            ourl: "",
            facebook: null
        };
        if (typeof(a) != "undefined") {
            if (typeof(stButtons.countsNativeResp[a.data[0].url]) != "undefined") {
                stButtons.countsNativeResp[a.data[0].url]["facebook"] = a.data
            }
            b.ourl = a.data[0].url;
            if (typeof(a.data[0].total_count) != "undefined") {
                b.facebook = a.data[0].total_count
            }
        }
        stButtons.processNativeCount(b, "facebook")
    };
    stButtons.processCount = function(b) {
        if (!(b)) {
            return
        }
        stButtons.storedCountResponse = b;
        var a = false;
        for (var d = 0; d < stButtons.cbQueue.length; d++) {
            var f = stButtons.cbQueue[d];
            if (b.ourl == f.url) {
                var h = "New";
                try {
                    if (f.service == "sharethis") {
                        if (stWidget.options.minShareCount == null || b.total >= stWidget.options.minShareCount) {
                            if (stWidget.options.newOrZero == "zero") {
                                h = (b.total > 0) ? stButtons.human(b.total) : "0"
                            } else {
                                h = (b.total > 0) ? stButtons.human(b.total) : "New"
                            }
                        }
                    } else {
                        if (f.service == "facebook" && typeof(b.facebook2) != "undefined") {
                            if (stWidget.options.minShareCount == null || b.facebook2 >= stWidget.options.minShareCount) {
                                h = stButtons.human(b.facebook2)
                            }
                        } else {
                            if (typeof(b[f.service]) != "undefined") {
                                if (stWidget.options.minShareCount == null || b[f.service] >= stWidget.options.minShareCount) {
                                    h = (b[f.service] > 0) ? stButtons.human(b[f.service]) : "0"
                                }
                            } else {
                                if (stWidget.options.minShareCount == null || stWidget.options.minShareCount <= 0) {
                                    h = "0"
                                }
                            }
                        }
                    }
                    if (/stHBubble/.test(f.element.parentNode.className) == true) {
                        f.element.parentNode.style.display = "inline-block"
                    } else {
                        if (/stBubble/.test(f.element.parentNode.className) == true) {
                            f.element.parentNode.style.display = "block"
                        }
                    }
                    f.element.innerHTML = h
                } catch (e) {
                    if (!f.element.hasChildNodes()) {
                        var g = document.createElement("div");
                        g.innerHTML = h;
                        f.element.appendChild(g)
                    }
                }
                a = true
            }
        }
    };
    stButtons.processNativeCount = function(b, a) {
        if (!(b)) {
            return
        }
        if (!(a)) {
            return
        }
        for (var d = 0; d < stButtons.cbNativeQueue.length; d++) {
            var f = stButtons.cbNativeQueue[d];
            if (b.ourl == f.url || (a == "stumbleupon" && b.ourl.replace(/http:\/\/www\.|http:\/\/|www\./i, "") == f.url.replace(/http:\/\/www\.|http:\/\/|www\./i, ""))) {
                var h = "New";
                try {
                    if (f.service == a) {
                        if (b[a] != null) {
                            if (stWidget.options.minShareCount == null || b[a] >= stWidget.options.minShareCount) {
                                h = stButtons.human(b[a])
                            }
                        }
                    } else {
                        continue
                    }
                    if (/stHBubble/.test(f.element.parentNode.className) == true) {
                        f.element.parentNode.style.display = "inline-block"
                    } else {
                        if (/stBubble/.test(f.element.parentNode.className) == true) {
                            f.element.parentNode.style.display = "block"
                        }
                    }
                    f.element.innerHTML = h
                } catch (e) {
                    if (!f.element.hasChildNodes()) {
                        var g = document.createElement("div");
                        g.innerHTML = h;
                        f.element.appendChild(g)
                    }
                }
            }
        }
    };
    stButtons.human = function(a) {
        if (a >= 100000) {
            a = a / 1000;
            a = Math.round(a);
            a = a + "K"
        } else {
            if (a >= 10000) {
                a = a / 100;
                a = Math.round(a);
                a = a / 10;
                a = a + "K"
            }
        }
        return a
    };
    stButtons.isValidService = function(a) {
        return (typeof(stlib.allServices) === "object" && stlib.allServices.hasOwnProperty(a)) ? true : (typeof(stlib.allOauthServices) === "object" && stlib.allOauthServices.hasOwnProperty(a)) ? true : (typeof(stlib.allNativeServices) === "object" && stlib.allNativeServices.hasOwnProperty(a)) ? true : (typeof(stlib.allOtherServices) === "object" && stlib.allOtherServices.hasOwnProperty(a)) ? true : false
    };
    stButtons.locateElements = function(f) {
        var F = document.getElementsByTagName("*");
        var u = [];
        var X = new RegExp(/st_(.*?)_custom/);
        var W = new RegExp(/st_(.*?)_vcount/);
        var H = new RegExp(/st_(.*?)_vcount_native/);
        var V = new RegExp(/st_(.*?)_hcount/);
        var t = new RegExp(/st_(.*?)_hcount_native/);
        var U = new RegExp(/st_(.*?)_button/);
        var T = new RegExp(/st_(.*?)_large/);
        var S = new RegExp(/st_(.*?)_pcount/);
        var Q = new RegExp(/st_(.*?)_stbar/);
        var N = new RegExp(/st_(.*?)_stsmbar/);
        var M = new RegExp(/st_(.*?)_css/);
        var E = new RegExp(/^st_(.*?)$/);
        var n = new RegExp(/st_(.*?)_basic/);
        var v = new RegExp(/st_(.*?)_circle/);
        var r = new RegExp(/(st_(.*?)_basic)|(st_(.*?)_circle)/);
        var h = new RegExp(/(st_(.*?)_brushed)|(st_(.*?)_shiny)/);
        var K = new RegExp(/(st_(.*?)_brushed)/);
        var Y = new RegExp(/(st_(.*?)_shiny)/);
        var l = F.length;
        var d = false;
        var w = {};
        var I = 0,
            J, s, p, a = [],
            D = false;
        if (typeof(stRecentServices) != "undefined" && stRecentServices != "undefined" && stRecentServices != "false" && stRecentServices) {
            D = true
        }
        for (var L = 0; L < l; L++) {
            J = "";
            s = false;
            p = false;
            if (typeof(F[L].className) == "string" && F[L].className != "") {
                if (!(stlib.browser.mobile.isIOs() || stlib.browser.mobile.isAndroid()) && ((F[L].className.indexOf("whatsapp") !== -1 || F[L].className.indexOf("kik") !== -1) && window.location.pathname.indexOf("get-sharing-tools") === -1)) {
                    continue
                }
                if (F[L].className.match(X) && F[L].className.match(X).length >= 2 && F[L].className.match(X)[1]) {
                    if (stButtons.testElem(F[L]) == false) {
                        p = true;
                        J = F[L].className.match(X)[1];
                        typeName = "custom";
                        if (J == "plusone" || J == "fblike" || J == "fbrec" || J == "fbsend" || J == "fbsub") {
                            typeName = "chicklet"
                        }
                        u.push({
                            service: J,
                            element: F[L],
                            url: F[L].getAttribute("st_url"),
                            short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                            title: F[L].getAttribute("st_title"),
                            image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                            pinterest_native: F[L].getAttribute("st_native"),
                            message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                            summary: F[L].getAttribute("st_summary"),
                            text: F[L].getAttribute("displayText"),
                            type: typeName
                        });
                        F[L].setAttribute("st_processed", "yes")
                    }
                } else {
                    if (F[L].className.match(r) && F[L].className.match(r).length >= 2) {
                        if (stButtons.testElem(F[L]) == false) {
                            p = true;
                            J = F[L].className.split("_")[1];
                            var Z = "basic";
                            if (F[L].className.match(v)) {
                                Z = "circle"
                            }
                            u.push({
                                service: J,
                                element: F[L],
                                url: F[L].getAttribute("st_url"),
                                short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                title: F[L].getAttribute("st_title"),
                                image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                pinterest_native: F[L].getAttribute("st_native"),
                                message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                summary: F[L].getAttribute("st_summary"),
                                text: F[L].getAttribute("displayText"),
                                type: Z,
                                size: F[L].className.split("$")[1],
                                color: F[L].className.split("$")[2]
                            });
                            F[L].setAttribute("st_processed", "yes")
                        }
                    } else {
                        if (F[L].className.match(h) && F[L].className.match(h).length >= 2) {
                            if (stButtons.testElem(F[L]) == false) {
                                p = true;
                                J = F[L].className.split("_")[1];
                                var Z = "brushed";
                                if (F[L].className.match(Y)) {
                                    Z = "shiny"
                                }
                                u.push({
                                    service: J,
                                    element: F[L],
                                    url: F[L].getAttribute("st_url"),
                                    short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                    title: F[L].getAttribute("st_title"),
                                    image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                    pinterest_native: F[L].getAttribute("st_native"),
                                    message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                    summary: F[L].getAttribute("st_summary"),
                                    text: F[L].getAttribute("displayText"),
                                    type: Z,
                                    size: F[L].className.split("$")[1]
                                });
                                F[L].setAttribute("st_processed", "yes")
                            }
                        } else {
                            if (F[L].className.match(W) && F[L].className.match(W).length >= 2 && F[L].className.match(W)[1]) {
                                if (stButtons.testElem(F[L]) == false) {
                                    p = true;
                                    J = F[L].className.match(W)[1];
                                    var O = "";
                                    if (F[L].className.match(H) && F[L].className.match(H).length >= 2 && F[L].className.match(H)[1]) {
                                        O = "native"
                                    }
                                    u.push({
                                        service: J,
                                        element: F[L],
                                        url: F[L].getAttribute("st_url"),
                                        short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                        title: F[L].getAttribute("st_title"),
                                        image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                        pinterest_native: F[L].getAttribute("st_native"),
                                        message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                        summary: F[L].getAttribute("st_summary"),
                                        text: F[L].getAttribute("displayText"),
                                        type: "vcount",
                                        ctype: O
                                    });
                                    F[L].setAttribute("st_processed", "yes")
                                }
                            } else {
                                if (F[L].className.match(V) && F[L].className.match(V).length >= 2 && F[L].className.match(V)[1]) {
                                    if (stButtons.testElem(F[L]) == false) {
                                        p = true;
                                        J = F[L].className.match(V)[1];
                                        var O = "";
                                        if (F[L].className.match(t) && F[L].className.match(t).length >= 2 && F[L].className.match(t)[1]) {
                                            O = "native"
                                        }
                                        u.push({
                                            service: J,
                                            element: F[L],
                                            url: F[L].getAttribute("st_url"),
                                            short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                            title: F[L].getAttribute("st_title"),
                                            image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                            pinterest_native: F[L].getAttribute("st_native"),
                                            message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                            summary: F[L].getAttribute("st_summary"),
                                            text: F[L].getAttribute("displayText"),
                                            type: "hcount",
                                            ctype: O
                                        });
                                        F[L].setAttribute("st_processed", "yes")
                                    }
                                } else {
                                    if (F[L].className.match(U) && F[L].className.match(U).length >= 2 && F[L].className.match(U)[1]) {
                                        if (stButtons.testElem(F[L]) == false) {
                                            p = true;
                                            J = F[L].className.match(U)[1];
                                            u.push({
                                                service: J,
                                                element: F[L],
                                                url: F[L].getAttribute("st_url"),
                                                short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                                title: F[L].getAttribute("st_title"),
                                                image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                                pinterest_native: F[L].getAttribute("st_native"),
                                                message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                                summary: F[L].getAttribute("st_summary"),
                                                text: F[L].getAttribute("displayText"),
                                                type: "button"
                                            });
                                            F[L].setAttribute("st_processed", "yes")
                                        }
                                    } else {
                                        if (F[L].className.match(T) && F[L].className.match(T).length >= 2 && F[L].className.match(T)[1]) {
                                            if (stButtons.testElem(F[L]) == false) {
                                                p = true;
                                                J = F[L].className.match(T)[1];
                                                u.push({
                                                    service: J,
                                                    element: F[L],
                                                    url: F[L].getAttribute("st_url"),
                                                    short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                                    title: F[L].getAttribute("st_title"),
                                                    image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                                    pinterest_native: F[L].getAttribute("st_native"),
                                                    message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                                    summary: F[L].getAttribute("st_summary"),
                                                    text: F[L].getAttribute("displayText"),
                                                    type: "large"
                                                });
                                                F[L].setAttribute("st_processed", "yes")
                                            }
                                        } else {
                                            if (F[L].className.match(S) && F[L].className.match(S).length >= 2 && F[L].className.match(S)[1]) {
                                                if (stButtons.testElem(F[L]) == false) {
                                                    p = true;
                                                    J = F[L].className.match(S)[1];
                                                    u.push({
                                                        service: J,
                                                        element: F[L],
                                                        url: F[L].getAttribute("st_url"),
                                                        short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                                        title: F[L].getAttribute("st_title"),
                                                        image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                                        pinterest_native: F[L].getAttribute("st_native"),
                                                        message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                                        summary: F[L].getAttribute("st_summary"),
                                                        text: F[L].getAttribute("displayText"),
                                                        type: "pcount",
                                                        count: L
                                                    });
                                                    F[L].setAttribute("st_processed", "yes")
                                                }
                                            } else {
                                                if (F[L].className.match(Q) && F[L].className.match(Q).length >= 2 && F[L].className.match(Q)[1]) {
                                                    if (stButtons.testElem(F[L]) == false) {
                                                        p = true;
                                                        J = F[L].className.match(Q)[1];
                                                        u.push({
                                                            service: J,
                                                            element: F[L],
                                                            url: F[L].getAttribute("st_url"),
                                                            short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                                            title: F[L].getAttribute("st_title"),
                                                            image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                                            pinterest_native: F[L].getAttribute("st_native"),
                                                            message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                                            summary: F[L].getAttribute("st_summary"),
                                                            text: F[L].getAttribute("displayText"),
                                                            type: "stbar",
                                                            count: L
                                                        });
                                                        F[L].setAttribute("st_processed", "yes")
                                                    }
                                                } else {
                                                    if (F[L].className.match(N) && F[L].className.match(N).length >= 2 && F[L].className.match(N)[1]) {
                                                        if (stButtons.testElem(F[L]) == false) {
                                                            p = true;
                                                            J = F[L].className.match(N)[1];
                                                            u.push({
                                                                service: J,
                                                                element: F[L],
                                                                url: F[L].getAttribute("st_url"),
                                                                short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                                                title: F[L].getAttribute("st_title"),
                                                                image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                                                pinterest_native: F[L].getAttribute("st_native"),
                                                                message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                                                summary: F[L].getAttribute("st_summary"),
                                                                text: F[L].getAttribute("displayText"),
                                                                type: "stsmbar",
                                                                count: L
                                                            });
                                                            F[L].setAttribute("st_processed", "yes")
                                                        }
                                                    } else {
                                                        if (F[L].className.match(M) && F[L].className.match(M).length >= 2 && F[L].className.match(M)[1]) {
                                                            if (stButtons.testElem(F[L]) == false) {
                                                                p = true;
                                                                J = F[L].className.match(M)[1];
                                                                var P = F[L].className.split("_");
                                                                u.push({
                                                                    service: J,
                                                                    element: F[L],
                                                                    url: F[L].getAttribute("st_url"),
                                                                    short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                                                    title: F[L].getAttribute("st_title"),
                                                                    image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                                                    pinterest_native: F[L].getAttribute("st_native"),
                                                                    message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                                                    summary: F[L].getAttribute("st_summary"),
                                                                    text: F[L].getAttribute("displayText"),
                                                                    type: "css",
                                                                    cssType: P[P.length - 1]
                                                                });
                                                                F[L].setAttribute("st_processed", "yes")
                                                            }
                                                        } else {
                                                            if (F[L].className.match(E) && F[L].className.match(E).length >= 2 && F[L].className.match(E)[1]) {
                                                                if (stButtons.testElem(F[L]) == false) {
                                                                    p = true;
                                                                    J = F[L].className.match(E)[1];
                                                                    u.push({
                                                                        service: J,
                                                                        element: F[L],
                                                                        url: F[L].getAttribute("st_url"),
                                                                        short_url: (F[L].getAttribute("st_short_url") != null) ? F[L].getAttribute("st_short_url") : "",
                                                                        title: F[L].getAttribute("st_title"),
                                                                        image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                                                        pinterest_native: F[L].getAttribute("st_native"),
                                                                        message: (F[L].getAttribute("st_msg") != null) ? F[L].getAttribute("st_msg") : F[L].getAttribute("st_message"),
                                                                        summary: F[L].getAttribute("st_summary"),
                                                                        text: F[L].getAttribute("displayText"),
                                                                        type: "chicklet"
                                                                    });
                                                                    F[L].setAttribute("st_processed", "yes")
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (D) {
                    if (p) {
                        for (I = 0; I < a.length; I++) {
                            if (a[I].service == J) {
                                a[I].count++;
                                s = true
                            }
                        }
                        if (!s) {
                            a.push({
                                service: J,
                                count: 1,
                                doNotReplace: false,
                                processed: false
                            })
                        }
                    }
                }
                if (J == "sharethis") {
                    if (stlib.browser.mobile.isMobile()) {
                        if (d) {
                            if (!stlib.browser.mobile.isExcerptImplementation) {
                                var e;
                                var g = document.getElementsByTagName("meta");
                                for (var C = 0, B = g.length; C < B; C++) {
                                    if (g[C].name.toLowerCase() == "description") {
                                        e = g[C]
                                    }
                                }
                                w.url = document.URL;
                                w.title = document.title;
                                w.image = null;
                                w.summary = e
                            }
                            stlib.browser.mobile.isExcerptImplementation = true
                        } else {
                            w = {
                                service: J,
                                url: F[L].getAttribute("st_url"),
                                title: F[L].getAttribute("st_title"),
                                image: (F[L].getAttribute("st_img") != null) ? F[L].getAttribute("st_img") : F[L].getAttribute("st_image"),
                                summary: F[L].getAttribute("st_summary"),
                                via: F[L].getAttribute("st_via"),
                                type: "button"
                            }
                        }
                    }
                    d = true
                }
            }
        }
        var q = stButtons.isBarsExist();
        if (stlib.browser.mobile.isMobile() && q && !d) {
            var e;
            var g = document.getElementsByTagName("meta");
            for (var C = 0, B = g.length; C < B; C++) {
                if (g[C].name.toLowerCase() == "description") {
                    e = g[C]
                }
            }
            w = {
                service: "sharethis",
                url: document.URL,
                title: document.title,
                image: null,
                summary: e,
                type: "button"
            };
            d = true
        }
        if (D) {
            var R = [];
            for (var C = a.length - 1; C >= 0; C--) {
                if (a[C].service == "sharethis" || a[C].doNotReplace) {
                    a[C].processed = true;
                    continue
                } else {
                    for (var B in stRecentServices) {
                        var j = false;
                        if (!stRecentServices[B].processed) {
                            for (var b = 0; b < a.length; b++) {
                                if (B == a[b].service && !a[b].processed) {
                                    j = true;
                                    a[b].doNotReplace = true;
                                    stRecentServices[B].processed = true;
                                    break
                                }
                            }
                            if (j) {
                                a[C].processed = true
                            } else {
                                R.push({
                                    oldService: a[C].service,
                                    newService: B
                                });
                                for (var A = 0; A < u.length; A++) {
                                    if (u[A].service == a[C].service) {
                                        u[A].service = B;
                                        u[A].text = stRecentServices[B].title;
                                        u[A].element.setAttribute("displayText", stRecentServices[B].title);
                                        u[A].element.className = u[A].element.className.replace(a[C].service, B)
                                    }
                                }
                                stRecentServices[B].processed = true;
                                a[C].processed = true;
                                break
                            }
                        }
                    }
                }
            }
        }
        if (u.length > 0 && d && stlib.browser.mobile.isMobile() && stShowNewMobileWidget && !isMobileButtonLoaded) {
            var G = document.querySelector && document.querySelector('div[id="stToolPop"]');
            if (G == null) {
                stButtons.createMobileShareButton();
                w.element = document.getElementById("stToolPop");
                u.push(w);
                if (stWidget.mobileWidgetLoaded == false) {
                    var o = ((("https:" == document.location.protocol) ? "https://ws" : "http://w") + ".sharethis.com/mobile/js/mobile.8b4348d6eadbd4c16d8729580cd53b50.js");
                    stlib.scriptLoader.loadJavascript(o, function() {
                        mobileWidget.init();
                        stWidget.mobileWidgetLoaded = true
                    })
                }
            }
        }
        var m = u.length;
        for (var L = 0; L < m; L++) {
            if (!stButtons.isValidService(u[L].service)) {
                continue
            }
            stWidget.addEntry(u[L])
        }
        if (m > 0 && stShowNewMobileWidget && d && stlib.browser.mobile.isMobile()) {
            stButtons.hideBarsAndButtons()
        }
    };
    stButtons.odcss = function(a, b) {
        this.head = document.getElementsByTagName("head")[0];
        this.scriptSrc = a;
        this.css = document.createElement("link");
        this.css.setAttribute("rel", "stylesheet");
        this.css.setAttribute("type", "text/css");
        this.css.setAttribute("href", this.scriptSrc);
        setTimeout(function() {
            b()
        }, 500);
        this.head.appendChild(this.css)
    };
    stButtons.makeButtons = function() {
        if (typeof(stButtons.button_css_called) == "undefined") {
            var a = (("https:" == document.location.protocol) ? "https://ws.sharethis.com/button/css/buttons-secure.css" : "http://w.sharethis.com/button/css/buttons.ab966a004186897711de4a5ed256c924.css");
            stButtons.odcss(a, function() {});
            stButtons.button_css_called = true
        }
        stButtons.locateElements()
    };
    stButtons.getPlusOneFromGoogle = function(a) {
        if (stButtons.plusOneLoaded == false) {
            if (stButtons.plusOneLoading == false) {
                var b = document.createElement("script");
                b.setAttribute("type", "text/javascript");
                b.setAttribute("src", "https://apis.google.com/js/plusone.js");
                b.async = stWidget.options.asyncPlusone;
                b.onload = function() {
                    stButtons.renderPlusOneFromGoogle(a);
                    stButtons.plusOneLoaded = true;
                    stButtons.plusOneLoading = false
                };
                b.onreadystatechange = function() {
                    if (this.readyState == "complete") {
                        stButtons.renderPlusOneFromGoogle(a);
                        stButtons.plusOneLoaded = true;
                        stButtons.plusOneLoading = false
                    }
                };
                stButtons.plusOneLoading = true;
                document.getElementsByTagName("head")[0].appendChild(b)
            }
        } else {
            stButtons.renderPlusOneFromGoogle(a)
        }
    };
    stButtons.renderPlusOneFromGoogle = function(a) {
        if (a == "plusone") {
            gapi.plusone.go()
        } else {
            if (a == "googleplusfollow" || a == "googleplusadd") {
                gapi.plus.go()
            }
        }
    };
    stButtons.getXFBMLFromFB = function(d) {
        if (typeof(stWidget.options.fbLoad) != "undefined" && stWidget.options.fbLoad != true) {
            return
        }
        if (stButtons.xfbmlLoaded == false) {
            if (stButtons.xfbmlLoading == false) {
                stButtons.xfbmlLoading = true;
                var e = document.createElement("div");
                e.setAttribute("id", "fb-root");
                document.body.appendChild(e);
                var b = "en_US";
                if (typeof(stWidget.options.fbLang) != "undefined" && stWidget.options.fbLang != "") {
                    b = stWidget.options.fbLang
                }
                var g, f = document.getElementsByTagName("script")[0];
                if (document.getElementById("facebook-jssdk")) {
                    if (typeof(FB) != "undefined" && typeof(FB.XFBML) != "undefined" && typeof(FB.XFBML.parse) == "function") {
                        if (!(/iframe/).test(d.innerHTML)) {
                            FB.XFBML.parse(d)
                        }
                        stButtons.trackFB();
                        stButtons.xfbmlLoaded = true;
                        stButtons.xfbmlLoading = false
                    }
                    return
                }
                g = document.createElement("script");
                g.id = "facebook-jssdk";
                g.src = "//connect.facebook.net/" + b + "/sdk.js";
                g.async = stWidget.options.async;
                if (window.fbAsyncInit) {
                    var a = window.fbAsyncInit;
                    window.fbAsyncInit = function() {
                        a();
                        stButtons.initFB()
                    }
                } else {
                    stButtons.setupFBAsynch(g)
                }
                f.parentNode.insertBefore(g, f)
            }
        } else {
            if (!(/iframe/).test(d.innerHTML)) {
                FB.XFBML.parse(d)
            }
            stButtons.trackFB()
        }
    };
    stButtons.initFB = function() {
        stButtons.trackFB();
        stButtons.xfbmlLoaded = true;
        stButtons.xfbmlLoading = false
    };
    stButtons.setupFBAsynch = function(a) {
        a.onload = function() {
            FB.init({
                appId: "",
                xfbml: true,
                version: "v2.0"
            });
            stButtons.initFB()
        };
        a.onreadystatechange = function() {
            if (this.readyState == "complete" || this.readyState == "loaded") {
                FB.init({
                    appId: "",
                    xfbml: true,
                    version: "v2.0"
                });
                stButtons.initFB()
            }
        }
    };
    stButtons.addCount = function(a) {
        stButtons.counts.push(a)
    };
    stButtons.getCountsFromService = function(a, h, f) {
        if (stButtons.checkQueue(a) == false) {
            var d = d + "-" + stButtons.cbVal;
            d = "stButtons.processCB";
            stButtons.cbVal++;
            var j = document.referrer;
            var e = j.replace("http://", "").replace("https://", "").split("/");
            var i = e.shift();
            var b = e.join("/");
            i = encodeURIComponent(i);
            b = encodeURIComponent(b);
            var g = stLight.publisher;
            var k = (("https:" == document.location.protocol) ? "https://ws.sharethis.com/api/getCount2.php?cb=" + d + "&refDomain=" + i + "&refQuery=" + b + "&pgurl=" + encodeURIComponent(document.location.href) + "&pubKey=" + g + "&url=" : "http://wd.sharethis.com/api/getCount2.php?cb=" + d + "&refDomain=" + i + "&refQuery=" + b + "&pgurl=" + encodeURIComponent(document.location.href) + "&pubKey=" + g + "&url=");
            stLight.odjs(k + encodeURIComponent(a), function() {});
            stButtons.queue.push(a)
        }
        if (stButtons.countsResp[a]) {
            stButtons.processCount(stButtons.countsResp[a])
        }
    };
    stButtons.checkQueue = function(a) {
        for (var b = 0; b < stButtons.queue.length; b++) {
            if (stButtons.queue[b] == a) {
                return true
            }
        }
        return false
    };
    stButtons.testElem = function(b) {
        var a = false;
        if (b.getAttribute("st_processed") != null) {
            return true
        } else {
            return false
        }
    };
    stButtons.createMobileShareButton = function() {
        if (document.getElementById("stToolPop") != null) {
            return
        }
        var b = document.createElement("div");
        var a = document.createElement("a");
        var e = document.createElement("img");
        var d = document.getElementsByTagName("body")[0];
        b.id = "stToolPop";
        b.className = "stToolPop-circular semiTrans gray";
        b.style.visibility = "hidden";
        a.className = "stToolPopLink";
        a.href = "javascript:void(0)";
        e.id = "stToolPop_logo";
        e.src = (("https:" == document.location.protocol) ? "https://ws" : "http://w") + ".sharethis.com/images/st-logo-m-widget.png";
        a.appendChild(e);
        b.appendChild(a);
        d.appendChild(b);
        isMobileButtonLoaded = true
    };
    stButtons.hideBarsAndButtons = function() {
        var d = document.getElementById("sharebar");
        if (d != null) {
            d.style.cssText = "display:none !important"
        }
        var b = document.getElementById("sthoverbuttons");
        if (b != null) {
            b.style.visibility = "hidden"
        }
        var a = document.getElementById("stpulldown");
        if (a != null) {
            a.style.visibility = "hidden"
        }
    };
    stButtons.isBarsExist = function() {
        var b = false;
        var e = document.getElementById("sharebar");
        var d = document.getElementById("sthoverbuttons");
        var a = document.getElementById("stpulldown");
        if (e != null || d != null || a != null) {
            b = true
        }
        return b
    };

    function Shareable(d) {
        var a = {};
        a.facebook = "450";
        a.twitter = "684";
        a.yahoo = "500";
        a.linkedin = "600";
        var b = {};
        b.facebook = "300";
        b.twitter = "718";
        b.yahoo = "460";
        b.linkedin = "433";
        this.idx = -1;
        this.url = null;
        this.short_url = null;
        this.title = null;
        this.image = null;
        this.pinterest_native = null;
        this.element = null;
        this.service = null;
        this.message = null;
        this.screen = "home";
        this.summary = null;
        this.via = null;
        this.content = null;
        this.buttonText = null;
        this.frag = null;
        this.onhover = true;
        this.type = null;
        var e = this;
        var f = false;
        this.attachButton = function(g) {
            this.element = g;
            if ((this.onhover == true || this.onhover == "true") && !stlib.browser.mobile.isMobile() && ((stWidgetVersion == "4x") || ((stWidgetVersion == "5xa") && (d.service == "sharethis" || d.service == "email" || d.service == "wordpress")))) {
                g.onmouseover = this.mouseOn;
                g.onmouseout = this.mouseOut
            }
            g.onclick = function(h) {
                e.getSrcOfWidget(this);
                e.decideFastShare()
            }
        };
        this.getSrcOfWidget = function(i) {
            var h = new RegExp(/hoverbuttons/),
                j = null;
            if (i.className.match("buttonAnimate")) {
                j = "newhb"
            }
            if (null != j) {
                stlib.data.set("widSrc", j, "pageInfo")
            } else {
                var g = stlib.data.get("widSrc", "pageInfo");
                if (null != g || g) {
                    stlib.data.unset("widSrc", "pageInfo")
                }
            }
        };
        this.init = function() {
            stWidget.merge(this, d);
            stWidget.shareables.push(this);
            if (d.element !== null) {
                this.attachButton(d.element)
            }
        };
        return this
    }
    if (typeof(stWidget) == "undefined") {
        var stWidget = new function() {
            this.shareables = [];
            this.entries = 0;
            this.widgetOpen = false;
            this.mouseOnTimer = null;
            this.mouseTimer = null;
            this.mouseOutTimer = null;
            this.frameReady = false;
            this.stopClosing = false;
            this.buttonClicked = false;
            this.widgetLoadingComplete = false;
            this.skipESIValue = false;
            this.frameUrl5xa = this.frameUrl5x = (("https:" == document.location.protocol) ? "https://ws.sharethis.com/secure5x/index.html" : "http://edge.sharethis.com/share5x/index.1fa45b75ede343ffbb6f8bfc9d42ce31.html");
            this.frameUrl4x = (("https:" == document.location.protocol) ? "https://ws.sharethis.com/secure/index.html" : "http://edge.sharethis.com/share4x/index.e61d090b8217e54ceb007ffb37b787c9.html");
            this.secure = false;
            try {
                this.mainstframe = document.createElement('<iframe name="stLframe" allowTransparency="true" style="body{background:transparent;}" ></iframe>');
                this.mainstframe.onreadystatechange = function() {
                    if (stWidget.mainstframe.readyState === "complete") {
                        stWidget.frameReady = true;
                        stButtons.pumpInstance = new stlib.pump(stWidget.mainstframe, stWidget.mainstframe, function() {
                            stButtons.messageQueueInstance.process()
                        });
                        stButtons.messageQueueInstance.setPumpInstance(stButtons.pumpInstance);
                        try {
                            stButtons.pumpInstance.broadcastSendMessage("Buttons Ready")
                        } catch (d) {}
                    }
                }
            } catch (b) {
                this.mainstframe = document.createElement("iframe");
                this.mainstframe.allowTransparency = "true";
                this.mainstframe.setAttribute("allowTransparency", "true");
                this.mainstframe.onload = function() {
                    stWidget.frameReady = true;
                    stButtons.pumpInstance = new stlib.pump(stWidget.mainstframe, stWidget.mainstframe, function() {
                        stButtons.messageQueueInstance.process()
                    });
                    stButtons.messageQueueInstance.setPumpInstance(stButtons.pumpInstance);
                    try {
                        stButtons.pumpInstance.broadcastSendMessage("Buttons Ready")
                    } catch (d) {}
                }
            }
            this.mainstframe.id = "stLframe";
            this.mainstframe.className = "stLframe";
            this.mainstframe.name = "stLframe";
            this.mainstframe.frameBorder = "0";
            this.mainstframe.scrolling = "no";
            this.wrapper = document.createElement("div");
            this.wrapper.id = "stwrapper";
            this.wrapper.className = "stwrapper";
            this.wrapper.style.display = "none";
            var a = 0;
            this.widgetLoadInterval = self.setInterval(function() {
                stWidget.widgetLoad();
                a += 1;
                if (a > 90) {
                    stWidget.forceDefaultWidgetSetting();
                    window.clearInterval(stWidget.widgetLoadInterval)
                }
            }, 1000);
            this.ogtitle = null;
            this.ogdesc = null;
            this.ogurl = null;
            this.short_url = null;
            this.ogimg = null;
            this.ogtype = null;
            this.twittertitle = null;
            this.twitterdesc = null;
            this.twitterurl = null;
            this.twitterimg = null;
            this.twittercard = null;
            this.desc = null;
            this.initFire = false;
            this.merge = function(f, e) {
                for (var d in e) {
                    if (f.hasOwnProperty(d) && e[d] !== null) {
                        f[d] = e[d]
                    }
                }
            };
            this.oldScroll = 0;
            this.init = function() {
                if (stWidget.initFire == false) {
                    stWidget.initFire = true;
                    if (stButtons.messageQueueInstance == null) {
                        stButtons.messageQueueInstance = new stlib.messageQueue()
                    }
                    if (stlib.browser.ieFallback) {
                        setTimeout("stButtons.messageQueueInstance.send(stWidget.createFrag(stlib.data,'data'), 'data');", 1000)
                    } else {
                        stButtons.messageQueueInstance.send(stWidget.createFrag(stlib.data, "data"), "data")
                    }
                    if (stlib.browser.ieFallback) {
                        setTimeout("stButtons.messageQueueInstance.send(stWidget.createFrag(null,'init'), 'init');", 2000);
                        setTimeout("stWidget.initIE=true;", 2500)
                    } else {
                        stButtons.messageQueueInstance.send(stWidget.createFrag(null, "init"), "init")
                    }
                }
            }
        }
    }
    stWidget.createWidgetContainer = function() {
        window.clearInterval(stWidget.widgetLoadInterval);
        if (stWidgetVersion == "5xa") {
            stWidget.frameUrlChoice = stWidget.frameUrl5xa;
            stWidget.wrapper.className += " stwrapper5x"
        } else {
            if (stWidgetVersion == "4x") {
                stWidget.frameUrlChoice = stWidget.frameUrl4x;
                stWidget.wrapper.className += " stwrapper4x"
            }
        }
        stWidget.mainstframe.src = stWidget.frameUrlChoice;
        stWidget.overlay = document.createElement("div");
        if (document.all && navigator.appVersion.indexOf("MSIE 6.") != -1) {
            stWidget.overlay.style.position = "absolute"
        }
        stWidget.overlay.setAttribute("id", "stOverlay");
        stWidget.overlay.setAttribute("onclick", "javascript:stWidget.closeWidget();");
        stWidget.wrapper.appendChild(stWidget.mainstframe);
        stWidget.widgetLoadingComplete = true
    };
    stWidget.widgetLoad = function() {
        if (esiStatus == "loaded" || (useEdgeSideInclude == false)) {
            stWidget.createWidgetContainer()
        }
    };
    stWidget.forceDefaultWidgetSetting = function() {
        stWidget.skipESIValue = true;
        stLight.usePublisherDefaultSettings();
        stWidget.createWidgetContainer()
    };
    stWidget.mobileWidgetLoaded = false;
    stWidget.mobileWidget = function(e, a, d) {
        if (stlib.browser.mobile.isMobile()) {
            if (!stShowNewMobileWidget) {
                return stlib.browser.mobile.handleForMobileFriendly(e, a, d)
            }
            if (stWidget.mobileWidgetLoaded == false) {
                var b = ((("https:" == document.location.protocol) ? "https://ws" : "http://w") + ".sharethis.com/mobile/js/mobile.8b4348d6eadbd4c16d8729580cd53b50.js");
                stlib.scriptLoader.loadJavascript(b, function() {
                    mobileWidget.loadMobileWidget(e, a, d);
                    stWidget.mobileWidgetLoaded = true
                })
            } else {
                mobileWidget.loadMobileWidget(e, a, d)
            }
            return true
        }
        return false
    };
    stWidget.options = new function() {
        this.fpc = stLight.fpc;
        this.sessionID = null;
        this.publisher = null;
        this.tracking = true;
        this.send_services = null;
        this.exclusive_services = null;
        this.headerTitle = null;
        this.headerfg = null;
        this.headerbg = null;
        this.offsetLeft = null;
        this.offsetTop = null;
        this.onhover = true;
        this.async = false;
        this.asyncPlusone = false;
        this.autoclose = true;
        this.autoPosition = true;
        this.embeds = false;
        this.doneScreen = true;
        this.minorServices = true;
        this.excludeServices = null;
        this.theme = 1;
        this.serviceBarColor = null;
        this.shareButtonColor = null;
        this.footerColor = null;
        this.headerTextColor = null;
        this.helpTextColor = null;
        this.mainWidgetColor = null;
        this.textBoxFontColor = null;
        this.textRightToLeft = false;
        this.shorten = true;
        this.popup = false;
        this.newOrZero = "new";
        this.minShareCount = null;
        this.publisherGA = null;
        this.services = "";
        this.relatedDomain = null;
        this.hashAddressBar = null;
        this.doNotHash = null;
        this.doNotCopy = null;
        this.nativeCount = false;
        this.lang = "";
        this.fbLang = "";
        this.fbLoad = true;
        this.servicePopup = false;
        this.textcause = null;
        this.linkcause = null;
        this.snapsets = null;
        this.publisherMigration = false
    };
    stWidget.addEntry = function(a) {
        if (!a.element) {
            return false
        }
        if (a && a.service && ((a.service == "email" || a.service == "sharethis" || a.service == "wordpress") || ((stIsLoggedIn && servicesLoggedIn && typeof(servicesLoggedIn[a.service]) != "undefined" && ((useFastShare || (!useFastShare && (stWidgetVersion == "5xa"))) && (a.service == "facebook" || a.service == "twitter" || a.service == "yahoo" || a.service == "linkedin")))))) {
            openWidget = true
        } else {
            openWidget = false
        }
        if (!openWidget) {
            if (a.type !== "custom") {
                a.element.appendChild(stButtons.makeButton(a));
                if (a.service == "plusone" || a.service == "googleplusfollow" || a.service == "googleplusadd") {
                    stButtons.getPlusOneFromGoogle(a.service)
                }
                if (a.service == "fblike" || a.service == "fbsend" || a.service == "fbrec" || a.service == "fbLong" || a.service == "fbsub") {
                    stButtons.getXFBMLFromFB(a.element)
                }
                if (stlib.nativeButtons.checkNativeButtonSupport(a.service)) {
                    stlib.nativeButtons.loadService(a.service)
                }
            } else {
                stButtons.makeButton(a)
            }
            stlib.buttonInfo.addButton(a);
            return true
        } else {
            if (a.type != "custom") {
                a.element.appendChild(stButtons.makeButton(a));
                if (a.service == "plusone" || a.service == "googleplusfollow" || a.service == "googleplusadd") {
                    stButtons.getPlusOneFromGoogle(a.service)
                }
                if (a.service == "fblike" || a.service == "fbsend" || a.service == "fbrec" || a.service == "fbLong" || a.service == "fbsub") {
                    stButtons.getXFBMLFromFB(a.element)
                }
                if (stlib.nativeButtons.checkNativeButtonSupport(a.service)) {
                    stlib.nativeButtons.loadService(a.service)
                }
            } else {
                stButtons.makeButton(a)
            }
            var d = new Shareable(a);
            d.idx = stWidget.entries;
            stWidget.entries++;
            d.publisher = stLight.publisher;
            d.sessionID = stLight.sessionID;
            d.fpc = stLight.fpc;
            if (a.element.getAttribute("st_via") != null) {
                d.via = a.element.getAttribute("st_via").replace(/^\s+|\s+$/g, "")
            }
            d.url = stWidget.ogurl ? stWidget.ogurl : (stWidget.twitterurl ? stWidget.twitterurl : document.location.href);
            d.url = a.url ? a.url : d.url;
            if (!stlib.hash.doNotHash) {
                d.url = stlib.hash.appendHash(d.url);
                a.url = d.url
            }
            stlib.data.set("url", d.url, "shareInfo");
            stWidget.short_url = d.short_url;
            stlib.data.set("short_url", d.short_url, "shareInfo");
            d.title = stWidget.ogtitle ? stWidget.ogtitle : (stWidget.twittertitle ? stWidget.twittertitle : document.title);
            d.title = a.title ? a.title : d.title;
            var b = stWidget.ogimg ? stWidget.ogimg : (stWidget.twitterimg ? stWidget.twitterimg : (a.element.thumbnail ? a.element.thumbnail : null));
            d.image = (a.element.image) ? a.element.image : b;
            d.summary = stWidget.ogdesc ? stWidget.ogdesc : (stWidget.twitterdesc ? stWidget.twitterdesc : stWidget.desc);
            d.summary = a.element.summary ? a.element.summary : d.summary;
            stWidget.merge(d, stWidget.options);
            if (typeof(stWidget.options.textRightToLeft) != "undefined" && stWidget.options.textRightToLeft != "null" && stWidget.options.textRightToLeft == true) {
                document.getElementById("stwrapper").style.top = "auto";
                document.getElementById("stwrapper").style.left = "auto"
            }
            d.mouseOn = function() {
                stWidget.mouseOnTimer = setTimeout(function() {
                    d.getSrcOfWidget(a.element);
                    d.decideFastShare()
                }, 500)
            };
            d.mouseOut = function() {
                clearInterval(stWidget.mouseOnTimer)
            };
            d.decideFastShare = function() {
                if (stlib.browser.ieFallback) {
                    if (typeof(stWidget.initIE) == "undefined" || stWidget.initIE != true) {
                        return
                    }
                }
                if (!useFastShare || !stIsLoggedIn || a.service == "email" || a.service == "sharethis" || a.service == "wordpress" || (typeof(servicesLoggedIn[a.service]) == "undefined" && (a.service == "facebook" || a.service == "twitter" || a.service == "linkedin" || a.service == "yahoo"))) {
                    if (stWidget.mobileWidget(d, a, stWidget.options)) {
                        stLight.log("widget", "mobile", a.service, a.type)
                    } else {
                        d.popup()
                    }
                } else {
                    stLight.log("widget", "fastShare", a.service, a.type);
                    stFastShareObj.url = d.url;
                    stFastShareObj.short_url = d.short_url;
                    stFastShareObj.title = d.title;
                    stFastShareObj.image = d.image;
                    if (typeof(d.summary) != "undefined" && d.summary != null) {
                        stFastShareObj.summary = d.summary
                    }
                    stFastShareObj.via = null;
                    if (a.service == "twitter" && d.element.getAttribute("st_via") != null) {
                        stFastShareObj.via = d.element.getAttribute("st_via").replace(/^\s+|\s+$/g, "")
                    }
                    stFastShareObj.message = d.message;
                    stFastShareObj.element = a.element;
                    stFastShareObj.service = a.service;
                    stFastShareObj.type = a.type;
                    stFastShareObj.publisher = stlib.data.get("publisher", "pageInfo");
                    stFastShareObj.fpc = stlib.data.get("fpc", "pageInfo");
                    stFastShareObj.sessionID = stlib.data.get("sessionID", "pageInfo");
                    stFastShareObj.hostname = stlib.data.get("hostname", "pageInfo");
                    stFastShareObj.username = servicesLoggedIn[a.service];
                    if (typeof(fastShare) == "undefined") {
                        stLight.odjs((("https:" == document.location.protocol) ? "https://ws.sharethis.com/button/fastShare.js" : "http://w.sharethis.com/button/fastShare.js"), function() {
                            fastShare.showWidget()
                        })
                    } else {
                        fastShare.showWidget()
                    }
                }
            };
            d.popup = function() {
                if (stWidget.widgetOpen == false) {
                    if (stWidgetVersion == "4x") {
                        stWidget.stCancelClose()
                    }
                    var h = stLight.getSource2(a);
                    stLight.log("widget", h, a.service, a.type);
                    if (stWidget.options.popup && (stWidgetVersion == "4x")) {
                        var j = stWidget.createFrag(d);
                        _$d_();
                        _$d1("4x Popup Called");
                        _$d1(j);
                        _$d_();
                        window.open(stWidget.frameUrl4x + "#" + j, "newstframe", "status=1,toolbar=0,width=345,height=375")
                    } else {
                        if (stWidget.options.popup && (stWidgetVersion == "5xa")) {
                            var i = "http://sharethis.com/share?url=" + d.url;
                            if (d.title != null) {
                                i += "&title=" + d.title
                            }
                            if (d.image != null) {
                                i += "&img=" + d.image
                            }
                            if (d.summary != null) {
                                i += "&summary=" + d.summary
                            }
                            if (a.type != null) {
                                i += "&type=" + a.type
                            }
                            if (d.via != null) {
                                i += "&via=" + d.via
                            }
                            var g = "";
                            if (stlib.data) {
                                var f = stlib.json.encode(stlib.data.pageInfo);
                                var e = stlib.json.encode(stlib.data.shareInfo);
                                if (stlib.browser.isFirefox() && !stlib.browser.firefox8Version()) {
                                    f = encodeURIComponent(encodeURIComponent(f));
                                    e = encodeURIComponent(encodeURIComponent(e))
                                } else {
                                    f = encodeURIComponent(f);
                                    e = encodeURIComponent(e)
                                }
                                g = "&pageInfo=" + f + "&shareInfo=" + e
                            }
                            window.open(i + g, "newstframe", "status=1,toolbar=0,width=820,height=950")
                        } else {
                            stButtons.messageQueueInstance.send(stWidget.createFrag(d), "light");
                            stWidget.positionWidget(d);
                            if (stWidget.options.embeds == false) {
                                stWidget.hideEmbeds()
                            }
                            setTimeout(function() {
                                stWidget.widgetOpen = true;
                                st_showing = true
                            }, 200)
                        }
                    }
                } else {
                    if (stWidget.widgetOpen == true && stWidget.options.onhover == false) {}
                }
                return false
            };
            d.init();
            stlib.buttonInfo.addButton(d);
            return d
        }
    };
    stWidget.createFrag = function(a, j) {
        var i = "light";
        i = stWidget.options.popup ? "popup" : i;
        __stgetPubGA();
        if (j == "data") {
            i = "data";
            for (var b in a) {
                if (a.hasOwnProperty(b) == true && a[b] !== null && typeof(a[b]) != "function") {
                    if (typeof(a[b]) == "object") {
                        var e = stlib.json.encode(a[b])
                    } else {
                        var e = a[b]
                    }
                    if (stlib.browser.isFirefox() && !stlib.browser.firefox8Version()) {
                        i = i + "/" + b + "=" + encodeURIComponent(encodeURIComponent(e))
                    } else {
                        i = i + "/" + b + "=" + encodeURIComponent(e)
                    }
                }
            }
        } else {
            if (j == "init") {
                i = "init";
                if (stWidget.options.tracking && stWidget.options.publisherGA == null) {
                    if (typeof(pageTracker) != "undefined" && pageTracker !== null) {
                        if (typeof(pageTracker._getAccount) != "undefined") {
                            stWidget.options.publisherGA = pageTracker._getAccount()
                        }
                        if (typeof(ga) !== "undefined" && stWidget.options.publisherGA == null) {
                            ga(function() {
                                var p = ga.getAll();
                                for (var l = 0; l < p.length; ++l) {
                                    var m = p[l];
                                    var k = m.get("trackingId");
                                    var o = k.indexOf("UA");
                                    if (o >= 0) {
                                        stWidget.options.publisherGA = k
                                    }
                                }
                            })
                        }
                    } else {
                        if (stWidget.options.publisherGA == null && typeof(__stPubGA) !== "undefined") {
                            stWidget.options.publisherGA = __stPubGA
                        }
                    }
                }
                for (var b in stWidget.options) {
                    if (stWidget.options.hasOwnProperty(b) == true && stWidget.options[b] !== null && typeof(stWidget.options[b]) != "function" && typeof(stWidget.options[b]) != "object") {
                        var h = stWidget.options[b];
                        try {
                            h = decodeURIComponent(h);
                            h = decodeURIComponent(h)
                        } catch (d) {}
                        i = i + "/" + b + "=" + encodeURIComponent(h)
                    }
                }
                i = i + "/pUrl=" + encodeURIComponent(encodeURIComponent(document.location.href)) + ((document.title != "") ? "/title=" + encodeURIComponent(encodeURIComponent(document.title)) : "") + "/stLight=true"
            } else {
                for (var b in a) {
                    if (a.hasOwnProperty(b) == true && a[b] !== null && typeof(a[b]) != "function" && typeof(a[b]) != "object" && b !== "idx") {
                        i = i + "/" + b + "-=-" + encodeURIComponent(encodeURIComponent(a[b]))
                    }
                }
                if (a.service == "email") {
                    i = i + "/page-=-send"
                }
                if (stWidgetVersion == "5xa") {
                    if (a.service == "facebook") {
                        i = i + "/page-=-fbhome"
                    } else {
                        if (a.service == "twitter") {
                            i = i + "/page-=-twhome"
                        } else {
                            if (a.service == "yahoo") {
                                i = i + "/page-=-ybhome"
                            } else {
                                if (a.service == "linkedin") {
                                    i = i + "/page-=-lihome"
                                } else {
                                    if (a.service == "wordpress") {
                                        i = i + "/page-=-wphome"
                                    }
                                }
                            }
                        }
                    }
                }
                if (stlib.data) {
                    var g = stlib.json.encode(stlib.data.pageInfo);
                    var f = stlib.json.encode(stlib.data.shareInfo);
                    if (stlib.browser.isFirefox() && !stlib.browser.firefox8Version()) {
                        g = encodeURIComponent(encodeURIComponent(g));
                        f = encodeURIComponent(encodeURIComponent(f))
                    } else {
                        g = encodeURIComponent(g);
                        f = encodeURIComponent(f)
                    }
                    i += "/pageInfo-=-" + g;
                    i += "/shareInfo-=-" + f
                }
            }
        }
        return i
    };
    stWidget.positionWidget = function(a) {
        if (!a) {
            return false
        }
        stWidget.overlay.style.display = "block";
        stWidget.wrapper.style.display = "block"
    }, stWidget.hideWidget = function() {
        stWidget.wrapper.style.display = "none";
        stWidget.overlay.style.display = "none"
    };
    stWidget.pageSize = function() {
        var f = [0, 0, 0, 0];
        var b = 0;
        var a = 0;
        var e = 0;
        var d = 0;
        if (typeof(window.pageYOffset) == "number") {
            b = window.pageXOffset;
            a = window.pageYOffset
        } else {
            if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                b = document.body.scrollLeft;
                a = document.body.scrollTop
            } else {
                if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                    b = document.documentElement.scrollLeft;
                    a = document.documentElement.scrollTop
                }
            }
        }
        if (window.innerWidth) {
            e = window.innerWidth;
            d = window.innerHeight
        } else {
            if (document.documentElement.offsetWidth) {
                e = document.documentElement.offsetWidth;
                d = document.documentElement.offsetHeight
            }
        }
        f = {
            scrX: b,
            scrY: a,
            width: e,
            height: d
        };
        return f
    };
    stWidget.closetimeout = null;
    stWidget.stClose = function(a) {
        if (!a) {
            a = 1000
        }
        if ((stWidgetVersion == "4x") && stWidget.options.autoclose != null && (stWidget.options.autoclose == true || stWidget.options.autoclose == "true")) {
            if (stWidget.openDuration < 0.5 && stWidget.stopClosing == false) {
                stWidget.closetimeout = setTimeout("stWidget.closeWidget()", a)
            } else {
                stWidget.stopClosing = true
            }
        }
    };
    stWidget.stCancelClose = function() {
        clearTimeout(stWidget.closetimeout);
        stWidget.buttonClicked = true;
        setTimeout(function() {
            stWidget.buttonClicked = false
        }, 100)
    };
    stWidget.closeWidget = function() {
        if (st_showing == false) {
            return false
        }
        st_showing = false;
        stWidget.widgetOpen = false;
        stWidget.wrapper.style.display = "none";
        stWidget.showEmbeds();
        stWidget.sendEvent("screen", "home");
        stWidget.overlay.style.display = "none"
    };
    stWidget.hideEmbeds = function() {
        var b = document.getElementsByTagName("embed");
        for (var a = 0; a < b.length; a++) {
            b[a].style.visibility = "hidden"
        }
    };
    stWidget.showEmbeds = function() {
        if (stWidget.options.embeds == true) {
            return true
        }
        var b = document.getElementsByTagName("embed");
        for (var a = 0; a < b.length; a++) {
            b[a].style.visibility = "visible"
        }
    };
    stWidget.sendEvent = function(a, d) {
        var b = "widget/" + a + "=" + d;
        stButtons.messageQueueInstance.send(b, "widget")
    };
    stWidget.getMetaTags = function() {
        stWidget.getOGTags();
        stWidget.getTwitterTags()
    };
    stWidget.getOGTags = function() {
        var d = document.getElementsByTagName("meta");
        for (var a = 0; a < d.length; a++) {
            var b = d[a].getAttribute("property");
            if (b == null) {
                b = d[a].getAttribute("name")
            }
            if (b == "og:title") {
                stWidget.ogtitle = d[a].getAttribute("content")
            } else {
                if (b == "og:type") {
                    stWidget.ogtype = d[a].getAttribute("content")
                } else {
                    if (b == "og:url") {
                        stWidget.ogurl = d[a].getAttribute("content")
                    } else {
                        if (b == "og:image") {
                            stWidget.ogimg = d[a].getAttribute("content").replace(/^\s+|\s+$/g, "")
                        } else {
                            if (b == "og:description") {
                                stWidget.ogdesc = d[a].getAttribute("content")
                            } else {
                                if (b == "description" || b == "Description") {
                                    stWidget.desc = d[a].getAttribute("content")
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    stWidget.getTwitterTags = function() {
        var d = document.getElementsByTagName("meta");
        for (var a = 0; a < d.length; a++) {
            var b = d[a].getAttribute("name");
            if (b == null) {
                b = d[a].getAttribute("property")
            }
            if (b == "twitter:card") {
                stWidget.twittercard = d[a].getAttribute("content")
            } else {
                if (b == "twitter:url") {
                    stWidget.twitterurl = d[a].getAttribute("content")
                } else {
                    if (b == "twitter:title") {
                        stWidget.twittertitle = d[a].getAttribute("content")
                    } else {
                        if (b == "twitter:description") {
                            stWidget.twitterdesc = d[a].getAttribute("content")
                        } else {
                            if (b == "twitter:image") {
                                stWidget.twitterimg = d[a].getAttribute("content")
                            } else {
                                if (b == "description" || b == "Description") {
                                    stWidget.desc = d[a].getAttribute("content")
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    function shareLog(a, b) {
        if (typeof(ga) !== "undefined") {
            ga("send", "event", "ShareThis", a, b)
        } else {
            if (typeof(pageTracker) != "undefined" && pageTracker !== null && typeof(pageTracker._trackEvent) != "undefined") {
                pageTracker._trackEvent("ShareThis", a, b)
            } else {
                if (typeof(_gaq) != "undefined" && _gaq !== null) {
                    _gaq.push(["_trackEvent", "ShareThis", a, b])
                } else {
                    if (stButtons.publisherTracker !== null) {
                        stButtons.publisherTracker._trackEvent("ShareThis", a, b)
                    } else {
                        if (typeof(_gat) != "undefined" && _gat !== null) {
                            if (typeof(stWidget.options.publisherGA) != "undefined" && stWidget.options.publisherGA != null) {
                                stButtons.publisherTracker = _gat._createTracker(stWidget.options.publisherGA);
                                stButtons.publisherTracker._trackEvent("ShareThis", a, b)
                            }
                        }
                    }
                }
            }
        }
    }
    stButtons.completeInit = function() {
        if (!stButtons.goToInit) {
            stButtons.goToInit = true;
            var a = self.setInterval(function() {
                if (stWidget.widgetLoadingComplete) {
                    stWidget.getMetaTags();
                    document.body.appendChild(stWidget.wrapper);
                    document.body.appendChild(stWidget.overlay);
                    stButtons.makeButtons();
                    stWidget.init();
                    window.clearInterval(a)
                }
            }, 1000)
        }
    };
    plusoneCallback = function(a) {
        if (a.state == "on") {
            stlib.data.resetShareData();
            stlib.data.set("url", a.href, "shareInfo");
            stlib.data.set("short_url", stWidget.short_url, "shareInfo");
            stlib.data.set("destination", "plusone", "shareInfo");
            stlib.data.setSource("chicklet");
            stlib.data.set("buttonType", "chicklet", "shareInfo");
            stlib.sharer.share()
        }
    };
    stButtons.trackFB = function() {
        try {
            if (!stButtons.fbTracked && typeof(FB) != "undefined" && typeof(FB.Event) != "undefined" && typeof(FB.Event.subscribe) != "undefined") {
                stButtons.fbTracked = true;
                FB.Event.subscribe("edge.create", function(b) {
                    stButtons.trackShare("fblike_auto", b);
                    stLight.callSubscribers("click", "fblike", b)
                });
                FB.Event.subscribe("edge.remove", function(b) {
                    stButtons.trackShare("fbunlike_auto", b);
                    stLight.callSubscribers("click", "fbunlike", b)
                });
                FB.Event.subscribe("message.send", function(b) {
                    stButtons.trackShare("fbsend_auto", b);
                    stLight.callSubscribers("click", "fbsend", b)
                })
            }
        } catch (a) {}
    };
    stButtons.trackTwitter = function() {
        if (!stButtons.twitterTracked && typeof(twttr) != "undefined" && typeof(twttr.events) != "undefined" && typeof(twttr.events.bind) != "undefined") {
            stButtons.twitterTracked = true;
            twttr.events.bind("click", function(a) {
                stButtons.trackTwitterEvent("click");
                stLight.callSubscribers("click", "twitter")
            });
            twttr.events.bind("tweet", function() {
                stButtons.trackTwitterEvent("tweet")
            });
            twttr.events.bind("retweet", function() {
                stButtons.trackTwitterEvent("retweet");
                stLight.callSubscribers("click", "retweet")
            });
            twttr.events.bind("favorite", function() {
                stButtons.trackTwitterEvent("favorite");
                stLight.callSubscribers("click", "favorite")
            });
            twttr.events.bind("follow", function() {
                stButtons.trackTwitterEvent("follow");
                stLight.callSubscribers("click", "follow")
            })
        }
    };
    stButtons.trackTwitterEvent = function(a) {
        stButtons.trackShare("twitter_" + a + "_auto")
    };
    stButtons.trackShare = function(a, d) {
        if (typeof(d) !== "undefined" && d !== null) {
            var b = d
        } else {
            var b = document.location.href
        }
        stlib.data.resetShareData();
        stlib.data.set("url", b, "shareInfo");
        stlib.data.set("short_url", stWidget.short_url, "shareInfo");
        stlib.data.set("destination", a, "shareInfo");
        stlib.data.set("buttonType", "chicklet", "shareInfo");
        stlib.data.setSource("chicklet");
        stlib.sharer.share()
    };
    stLight.processSTQ = function() {
        if (typeof(_stq) != "undefined") {
            for (var a = 0; a < _stq.length; a++) {
                var b = _stq[a];
                stLight.options(b)
            }
        } else {
            return false
        }
    };
    stLight.onDomContentLoaded = function() {
        stLight.onReady();
        stButtons.trackTwitter()
    };
    stLight.onDomContentLoadedLazy = function() {
        stLight.loadServicesLoggedIn(function() {
            stLight.getAllAppDefault(function() {
                stlib.data.init();
                stButtons.locateElements();
                stButtons.makeButtons()
            })
        })
    };
    stLight.messageReceiver = function(b) {
        if (b && (b.origin == "http://edge.sharethis.com" || b.origin == "https://ws.sharethis.com")) {
            var d = b.data;
            d = d.split("|");
            if (d[0] == "ShareThis" && d.length > 2) {
                var a = (typeof(d[3]) == "undefined") ? document.location.href : d[3];
                stLight.callSubscribers(d[1], d[2], a)
            }
        }
    };
    stLight.subscribe = function(b, a) {
        if (b == "click") {
            stLight.clickSubscribers.push(a)
        } else {
            stLight.nonClickSubscribers.push(a)
        }
    };
    stLight.callSubscribers = function(e, a, b) {
        if (e == "click") {
            for (var d = 0; d < stLight.clickSubscribers.length; d++) {
                stLight.clickSubscribers[d]("click", a, b)
            }
        }
        if (a == "Email" && e == "close") {
            stWidget.closeWidget()
        }
        if (a == "Print" && e == "close") {
            stWidget.closeWidget()
        }
    };
    stLight.gaTS = function(d, a, b) {
        var e = "";
        var f = "";
        if (a == "fblike") {
            e = "ShareThis_facebook";
            f = "Like"
        } else {
            if (a == "fbunlike") {
                e = "ShareThis_facebook";
                f = "UnLike"
            } else {
                if (a == "fbsend") {
                    e = "ShareThis_facebook";
                    f = "Send"
                } else {
                    if (a == "twitter") {
                        e = "ShareThis_twitter";
                        f = "Share"
                    } else {
                        if (a == "retweet") {
                            e = "ShareThis_twitter";
                            f = "ReTweet"
                        } else {
                            if (a == "favorite") {
                                e = "ShareThis_twitter";
                                f = "Favorite"
                            } else {
                                if (a == "follow") {
                                    e = "ShareThis_twitter";
                                    f = "Follow"
                                } else {
                                    e = "ShareThis_" + a;
                                    f = "Share"
                                }
                            }
                        }
                    }
                }
            }
        }
        if (typeof(ga) !== "undefined") {
            ga("send", "social", e, f, b)
        } else {
            if (typeof(_gaq) != "undefined") {
                _gaq.push(["_trackSocial", e, f, b])
            }
        }
    };
    stButtons.onReady = function() {
        var h = document.getElementsByTagName("*");
        var b = [];
        var d = new RegExp(/sharethis_smartbuttons/);
        var a = false;
        for (var j = 0; j < h.length; j++) {
            if (typeof(h[j].className) == "string" && h[j].className != "") {
                if (h[j].className.match(d)) {
                    a = true;
                    break
                }
            }
        }
        if (a) {
            var g = document.getElementsByTagName("head")[0];
            var e = ["return=json", "cb=stButtons.smartifyButtons"];
            e = e.join("&");
            var f = (("https:" == document.location.protocol) ? "https://ws." : "http://wd.") + "sharethis.com/api/getRecentServices.php?" + e;
            var i = document.createElement("script");
            i.setAttribute("type", "text/javascript");
            i.setAttribute("src", f);
            g.appendChild(i);
            setTimeout("stButtons.completeInit()", 2000)
        } else {
            stButtons.completeInit()
        }
        stLight.subscribe("click", stLight.gaTS);
        if (stlib.browser.ieFallback && stlib.browser.getIEVersion() < 9) {
            return
        } else {
            stLight.getAllAppDefault(function() {
                if (stWidget.options.snapsets && typeof(stLight.snapSetsRun) == "undefined") {
                    stLight.snapSetsRun = true;
                    if (typeof(stlib.p6x) == "undefined") {
                        stLight.odjs("http://w.sharethis.com/button/clipboard.js", function() {
                            stlib.p6x.init()
                        })
                    }
                }
            })
        }
    };
    stLight.domReady = function() {
        stLight.onReady();
        stButtons.trackTwitter();
        __stgetPubGA();
        if (typeof(__stPubGA) !== "undefined" && stLight.readyRun == true && stWidget.frameReady == true) {
            stWidget.sendEvent("publisherGA", __stPubGA)
        }
    };
    stButtons.goToInit = false;
    stButtons.widget = false;
    stButtons.widgetArray = [];
    stButtons.cbAppQueue = [];
    stButtons.queue = [];
    stButtons.cbQueue = [];
    stButtons.cbNativeQueue = [];
    stButtons.cbVal = 0;
    stButtons.queuePos = 0;
    stButtons.counts = [];
    st_showing = false;
    stButtons.urlElements = [];
    stButtons.publisherTracker = null;
    stButtons.plusOneLoaded = false;
    stButtons.plusOneLoading = false;
    stButtons.xfbmlLoaded = false;
    stButtons.xfbmlLoading = false;
    stButtons.fbTracked = false;
    stButtons.twitterTracked = false;
    stButtons.pumpInstance = null;
    stButtons.messageQueueInstance = null;
    stButtons.countsResp = [];
    stButtons.countsNativeResp = [];
    stWidget.getMetaTags();
    stLight.clickSubscribers = [];
    stLight.nonClickSubscribers = [];
    var __stPubGA;
    if (window.document.readyState == "completed") {
        stLight.domReady()
    } else {
        if (typeof(window.addEventListener) != "undefined") {
            window.addEventListener("load", stLight.domReady, false)
        } else {
            if (typeof(document.addEventListener) != "undefined") {
                document.addEventListener("load", stLight.domReady, false)
            } else {
                if (typeof window.attachEvent != "undefined") {
                    window.attachEvent("onload", stLight.domReady)
                }
            }
        }
    }
    if (typeof(window.addEventListener) != "undefined") {
        window.addEventListener("click", function() {
            stWidget.closeWidget()
        }, false)
    } else {
        if (typeof(document.addEventListener) != "undefined") {
            document.addEventListener("click", function() {
                stWidget.closeWidget()
            }, false)
        } else {
            if (typeof window.attachEvent != "undefined") {
                window.attachEvent("onclick", function() {
                    stWidget.closeWidget()
                })
            }
        }
    }
    if (typeof(__st_loadLate) == "undefined") {
        if (typeof(window.addEventListener) != "undefined") {
            window.addEventListener("DOMContentLoaded", stLight.onDomContentLoaded, false)
        } else {
            if (typeof(document.addEventListener) != "undefined") {
                document.addEventListener("DOMContentLoaded", stLight.onDomContentLoaded, false)
            }
        }
    } else {
        if (typeof(window.addEventListener) != "undefined") {
            window.addEventListener("DOMContentLoaded", stLight.onDomContentLoadedLazy, false)
        } else {
            if (typeof(document.addEventListener) != "undefined") {
                document.addEventListener("DOMContentLoaded", stLight.onDomContentLoadedLazy, false)
            }
        }
    }
    if (typeof(window.addEventListener) != "undefined") {
        window.addEventListener("message", stLight.messageReceiver, false)
    } else {
        if (typeof(document.addEventListener) != "undefined") {
            document.addEventListener("message", stLight.messageReceiver, false)
        } else {
            if (typeof window.attachEvent != "undefined") {
                window.attachEvent("onmessage", stLight.messageReceiver)
            }
        }
    }
    if (document.readyState == "complete" && stLight.readyRun == false) {
        stLight.domReady()
    };

    (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })({
        1: [function(require, module, exports) {
            module.exports = require('./lib/extend');


        }, {
            "./lib/extend": 2
        }],
        2: [function(require, module, exports) {
            /*!
             * node.extend
             * Copyright 2011, John Resig
             * Dual licensed under the MIT or GPL Version 2 licenses.
             * http://jquery.org/license
             *
             * @fileoverview
             * Port of jQuery.extend that actually works on node.js
             */
            var is = require('is');

            function extend() {
                var target = arguments[0] || {};
                var i = 1;
                var length = arguments.length;
                var deep = false;
                var options, name, src, copy, copy_is_array, clone;

                // Handle a deep copy situation
                if (typeof target === 'boolean') {
                    deep = target;
                    target = arguments[1] || {};
                    // skip the boolean and the target
                    i = 2;
                }

                // Handle case when target is a string or something (possible in deep copy)
                if (typeof target !== 'object' && !is.fn(target)) {
                    target = {};
                }

                for (; i < length; i++) {
                    // Only deal with non-null/undefined values
                    options = arguments[i]
                    if (options != null) {
                        if (typeof options === 'string') {
                            options = options.split('');
                        }
                        // Extend the base object
                        for (name in options) {
                            src = target[name];
                            copy = options[name];

                            // Prevent never-ending loop
                            if (target === copy) {
                                continue;
                            }

                            // Recurse if we're merging plain objects or arrays
                            if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
                                if (copy_is_array) {
                                    copy_is_array = false;
                                    clone = src && is.array(src) ? src : [];
                                } else {
                                    clone = src && is.hash(src) ? src : {};
                                }

                                // Never move original objects, clone them
                                target[name] = extend(deep, clone, copy);

                                // Don't bring in undefined values
                            } else if (typeof copy !== 'undefined') {
                                target[name] = copy;
                            }
                        }
                    }
                }

                // Return the modified object
                return target;
            };

            /**
             * @public
             */
            extend.version = '1.1.3';

            /**
             * Exports module.
             */
            module.exports = extend;


        }, {
            "is": 3
        }],
        3: [function(require, module, exports) {

            /**!
             * is
             * the definitive JavaScript type testing library
             *
             * @copyright 2013-2014 Enrico Marino / Jordan Harband
             * @license MIT
             */

            var objProto = Object.prototype;
            var owns = objProto.hasOwnProperty;
            var toStr = objProto.toString;
            var symbolValueOf;
            if (typeof Symbol === 'function') {
                symbolValueOf = Symbol.prototype.valueOf;
            }
            var isActualNaN = function(value) {
                return value !== value;
            };
            var NON_HOST_TYPES = {
                boolean: 1,
                number: 1,
                string: 1,
                undefined: 1
            };

            var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
            var hexRegex = /^[A-Fa-f0-9]+$/;

            /**
             * Expose `is`
             */

            var is = module.exports = {};

            /**
             * Test general.
             */

            /**
             * is.type
             * Test if `value` is a type of `type`.
             *
             * @param {Mixed} value value to test
             * @param {String} type type
             * @return {Boolean} true if `value` is a type of `type`, false otherwise
             * @api public
             */

            is.a = is.type = function(value, type) {
                return typeof value === type;
            };

            /**
             * is.defined
             * Test if `value` is defined.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if 'value' is defined, false otherwise
             * @api public
             */

            is.defined = function(value) {
                return typeof value !== 'undefined';
            };

            /**
             * is.empty
             * Test if `value` is empty.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is empty, false otherwise
             * @api public
             */

            is.empty = function(value) {
                var type = toStr.call(value);
                var key;

                if ('[object Array]' === type || '[object Arguments]' === type || '[object String]' === type) {
                    return value.length === 0;
                }

                if ('[object Object]' === type) {
                    for (key in value) {
                        if (owns.call(value, key)) {
                            return false;
                        }
                    }
                    return true;
                }

                return !value;
            };

            /**
             * is.equal
             * Test if `value` is equal to `other`.
             *
             * @param {Mixed} value value to test
             * @param {Mixed} other value to compare with
             * @return {Boolean} true if `value` is equal to `other`, false otherwise
             */

            is.equal = function(value, other) {
                var strictlyEqual = value === other;
                if (strictlyEqual) {
                    return true;
                }

                var type = toStr.call(value);
                var key;

                if (type !== toStr.call(other)) {
                    return false;
                }

                if ('[object Object]' === type) {
                    for (key in value) {
                        if (!is.equal(value[key], other[key]) || !(key in other)) {
                            return false;
                        }
                    }
                    for (key in other) {
                        if (!is.equal(value[key], other[key]) || !(key in value)) {
                            return false;
                        }
                    }
                    return true;
                }

                if ('[object Array]' === type) {
                    key = value.length;
                    if (key !== other.length) {
                        return false;
                    }
                    while (--key) {
                        if (!is.equal(value[key], other[key])) {
                            return false;
                        }
                    }
                    return true;
                }

                if ('[object Function]' === type) {
                    return value.prototype === other.prototype;
                }

                if ('[object Date]' === type) {
                    return value.getTime() === other.getTime();
                }

                return strictlyEqual;
            };

            /**
             * is.hosted
             * Test if `value` is hosted by `host`.
             *
             * @param {Mixed} value to test
             * @param {Mixed} host host to test with
             * @return {Boolean} true if `value` is hosted by `host`, false otherwise
             * @api public
             */

            is.hosted = function(value, host) {
                var type = typeof host[value];
                return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
            };

            /**
             * is.instance
             * Test if `value` is an instance of `constructor`.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is an instance of `constructor`
             * @api public
             */

            is.instance = is['instanceof'] = function(value, constructor) {
                return value instanceof constructor;
            };

            /**
             * is.nil / is.null
             * Test if `value` is null.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is null, false otherwise
             * @api public
             */

            is.nil = is['null'] = function(value) {
                return value === null;
            };

            /**
             * is.undef / is.undefined
             * Test if `value` is undefined.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is undefined, false otherwise
             * @api public
             */

            is.undef = is.undefined = function(value) {
                return typeof value === 'undefined';
            };

            /**
             * Test arguments.
             */

            /**
             * is.args
             * Test if `value` is an arguments object.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is an arguments object, false otherwise
             * @api public
             */

            is.args = is.arguments = function(value) {
                var isStandardArguments = '[object Arguments]' === toStr.call(value);
                var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
                return isStandardArguments || isOldArguments;
            };

            /**
             * Test array.
             */

            /**
             * is.array
             * Test if 'value' is an array.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is an array, false otherwise
             * @api public
             */

            is.array = function(value) {
                return '[object Array]' === toStr.call(value);
            };

            /**
             * is.arguments.empty
             * Test if `value` is an empty arguments object.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is an empty arguments object, false otherwise
             * @api public
             */
            is.args.empty = function(value) {
                return is.args(value) && value.length === 0;
            };

            /**
             * is.array.empty
             * Test if `value` is an empty array.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is an empty array, false otherwise
             * @api public
             */
            is.array.empty = function(value) {
                return is.array(value) && value.length === 0;
            };

            /**
             * is.arraylike
             * Test if `value` is an arraylike object.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is an arguments object, false otherwise
             * @api public
             */

            is.arraylike = function(value) {
                return !!value && !is.boolean(value) && owns.call(value, 'length') && isFinite(value.length) && is.number(value.length) && value.length >= 0;
            };

            /**
             * Test boolean.
             */

            /**
             * is.boolean
             * Test if `value` is a boolean.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is a boolean, false otherwise
             * @api public
             */

            is.boolean = function(value) {
                return '[object Boolean]' === toStr.call(value);
            };

            /**
             * is.false
             * Test if `value` is false.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is false, false otherwise
             * @api public
             */

            is['false'] = function(value) {
                return is.boolean(value) && Boolean(Number(value)) === false;
            };

            /**
             * is.true
             * Test if `value` is true.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is true, false otherwise
             * @api public
             */

            is['true'] = function(value) {
                return is.boolean(value) && Boolean(Number(value)) === true;
            };

            /**
             * Test date.
             */

            /**
             * is.date
             * Test if `value` is a date.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is a date, false otherwise
             * @api public
             */

            is.date = function(value) {
                return '[object Date]' === toStr.call(value);
            };

            /**
             * Test element.
             */

            /**
             * is.element
             * Test if `value` is an html element.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is an HTML Element, false otherwise
             * @api public
             */

            is.element = function(value) {
                return value !== undefined && typeof HTMLElement !== 'undefined' && value instanceof HTMLElement && value.nodeType === 1;
            };

            /**
             * Test error.
             */

            /**
             * is.error
             * Test if `value` is an error object.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is an error object, false otherwise
             * @api public
             */

            is.error = function(value) {
                return '[object Error]' === toStr.call(value);
            };

            /**
             * Test function.
             */

            /**
             * is.fn / is.function (deprecated)
             * Test if `value` is a function.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is a function, false otherwise
             * @api public
             */

            is.fn = is['function'] = function(value) {
                var isAlert = typeof window !== 'undefined' && value === window.alert;
                return isAlert || '[object Function]' === toStr.call(value);
            };

            /**
             * Test number.
             */

            /**
             * is.number
             * Test if `value` is a number.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is a number, false otherwise
             * @api public
             */

            is.number = function(value) {
                return '[object Number]' === toStr.call(value);
            };

            /**
             * is.infinite
             * Test if `value` is positive or negative infinity.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
             * @api public
             */
            is.infinite = function(value) {
                return value === Infinity || value === -Infinity;
            };

            /**
             * is.decimal
             * Test if `value` is a decimal number.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is a decimal number, false otherwise
             * @api public
             */

            is.decimal = function(value) {
                return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
            };

            /**
             * is.divisibleBy
             * Test if `value` is divisible by `n`.
             *
             * @param {Number} value value to test
             * @param {Number} n dividend
             * @return {Boolean} true if `value` is divisible by `n`, false otherwise
             * @api public
             */

            is.divisibleBy = function(value, n) {
                var isDividendInfinite = is.infinite(value);
                var isDivisorInfinite = is.infinite(n);
                var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
                return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
            };

            /**
             * is.int
             * Test if `value` is an integer.
             *
             * @param value to test
             * @return {Boolean} true if `value` is an integer, false otherwise
             * @api public
             */

            is.int = function(value) {
                return is.number(value) && !isActualNaN(value) && value % 1 === 0;
            };

            /**
             * is.maximum
             * Test if `value` is greater than 'others' values.
             *
             * @param {Number} value value to test
             * @param {Array} others values to compare with
             * @return {Boolean} true if `value` is greater than `others` values
             * @api public
             */

            is.maximum = function(value, others) {
                if (isActualNaN(value)) {
                    throw new TypeError('NaN is not a valid value');
                } else if (!is.arraylike(others)) {
                    throw new TypeError('second argument must be array-like');
                }
                var len = others.length;

                while (--len >= 0) {
                    if (value < others[len]) {
                        return false;
                    }
                }

                return true;
            };

            /**
             * is.minimum
             * Test if `value` is less than `others` values.
             *
             * @param {Number} value value to test
             * @param {Array} others values to compare with
             * @return {Boolean} true if `value` is less than `others` values
             * @api public
             */

            is.minimum = function(value, others) {
                if (isActualNaN(value)) {
                    throw new TypeError('NaN is not a valid value');
                } else if (!is.arraylike(others)) {
                    throw new TypeError('second argument must be array-like');
                }
                var len = others.length;

                while (--len >= 0) {
                    if (value > others[len]) {
                        return false;
                    }
                }

                return true;
            };

            /**
             * is.nan
             * Test if `value` is not a number.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is not a number, false otherwise
             * @api public
             */

            is.nan = function(value) {
                return !is.number(value) || value !== value;
            };

            /**
             * is.even
             * Test if `value` is an even number.
             *
             * @param {Number} value value to test
             * @return {Boolean} true if `value` is an even number, false otherwise
             * @api public
             */

            is.even = function(value) {
                return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
            };

            /**
             * is.odd
             * Test if `value` is an odd number.
             *
             * @param {Number} value value to test
             * @return {Boolean} true if `value` is an odd number, false otherwise
             * @api public
             */

            is.odd = function(value) {
                return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
            };

            /**
             * is.ge
             * Test if `value` is greater than or equal to `other`.
             *
             * @param {Number} value value to test
             * @param {Number} other value to compare with
             * @return {Boolean}
             * @api public
             */

            is.ge = function(value, other) {
                if (isActualNaN(value) || isActualNaN(other)) {
                    throw new TypeError('NaN is not a valid value');
                }
                return !is.infinite(value) && !is.infinite(other) && value >= other;
            };

            /**
             * is.gt
             * Test if `value` is greater than `other`.
             *
             * @param {Number} value value to test
             * @param {Number} other value to compare with
             * @return {Boolean}
             * @api public
             */

            is.gt = function(value, other) {
                if (isActualNaN(value) || isActualNaN(other)) {
                    throw new TypeError('NaN is not a valid value');
                }
                return !is.infinite(value) && !is.infinite(other) && value > other;
            };

            /**
             * is.le
             * Test if `value` is less than or equal to `other`.
             *
             * @param {Number} value value to test
             * @param {Number} other value to compare with
             * @return {Boolean} if 'value' is less than or equal to 'other'
             * @api public
             */

            is.le = function(value, other) {
                if (isActualNaN(value) || isActualNaN(other)) {
                    throw new TypeError('NaN is not a valid value');
                }
                return !is.infinite(value) && !is.infinite(other) && value <= other;
            };

            /**
             * is.lt
             * Test if `value` is less than `other`.
             *
             * @param {Number} value value to test
             * @param {Number} other value to compare with
             * @return {Boolean} if `value` is less than `other`
             * @api public
             */

            is.lt = function(value, other) {
                if (isActualNaN(value) || isActualNaN(other)) {
                    throw new TypeError('NaN is not a valid value');
                }
                return !is.infinite(value) && !is.infinite(other) && value < other;
            };

            /**
             * is.within
             * Test if `value` is within `start` and `finish`.
             *
             * @param {Number} value value to test
             * @param {Number} start lower bound
             * @param {Number} finish upper bound
             * @return {Boolean} true if 'value' is is within 'start' and 'finish'
             * @api public
             */
            is.within = function(value, start, finish) {
                if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
                    throw new TypeError('NaN is not a valid value');
                } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
                    throw new TypeError('all arguments must be numbers');
                }
                var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
                return isAnyInfinite || (value >= start && value <= finish);
            };

            /**
             * Test object.
             */

            /**
             * is.object
             * Test if `value` is an object.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is an object, false otherwise
             * @api public
             */

            is.object = function(value) {
                return '[object Object]' === toStr.call(value);
            };

            /**
             * is.hash
             * Test if `value` is a hash - a plain object literal.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is a hash, false otherwise
             * @api public
             */

            is.hash = function(value) {
                return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
            };

            /**
             * Test regexp.
             */

            /**
             * is.regexp
             * Test if `value` is a regular expression.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is a regexp, false otherwise
             * @api public
             */

            is.regexp = function(value) {
                return '[object RegExp]' === toStr.call(value);
            };

            /**
             * Test string.
             */

            /**
             * is.string
             * Test if `value` is a string.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if 'value' is a string, false otherwise
             * @api public
             */

            is.string = function(value) {
                return '[object String]' === toStr.call(value);
            };

            /**
             * Test base64 string.
             */

            /**
             * is.base64
             * Test if `value` is a valid base64 encoded string.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
             * @api public
             */

            is.base64 = function(value) {
                return is.string(value) && (!value.length || base64Regex.test(value));
            };

            /**
             * Test base64 string.
             */

            /**
             * is.hex
             * Test if `value` is a valid hex encoded string.
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
             * @api public
             */

            is.hex = function(value) {
                return is.string(value) && (!value.length || hexRegex.test(value));
            };

            /**
             * is.symbol
             * Test if `value` is an ES6 Symbol
             *
             * @param {Mixed} value value to test
             * @return {Boolean} true if `value` is a Symbol, false otherise
             * @api public
             */

            is.symbol = function(value) {
                return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
            };

        }, {}],
        4: [function(require, module, exports) {
            (function(global) {
                ! function(e) {
                    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
                    else if ("function" == typeof define && define.amd) define([], e);
                    else {
                        var f;
                        "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), (f.qj || (f.qj = {})).js = e()
                    }
                }(function() {
                    var define, module, exports;
                    return (function e(t, n, r) {
                            function s(o, u) {
                                if (!n[o]) {
                                    if (!t[o]) {
                                        var a = typeof require == "function" && require;
                                        if (!u && a) return a(o, !0);
                                        if (i) return i(o, !0);
                                        throw new Error("Cannot find module '" + o + "'")
                                    }
                                    var f = n[o] = {
                                        exports: {}
                                    };
                                    t[o][0].call(f.exports, function(e) {
                                        var n = t[o][1][e];
                                        return s(n ? n : e)
                                    }, f, f.exports, e, t, n, r)
                                }
                                return n[o].exports
                            }
                            var i = typeof require == "function" && require;
                            for (var o = 0; o < r.length; o++) s(r[o]);
                            return s
                        })({
                            1: [function(_dereq_, module, exports) {
                                var QJ, rreturn, rtrim;

                                QJ = function(selector) {
                                    if (QJ.isDOMElement(selector)) {
                                        return selector;
                                    }
                                    return document.querySelectorAll(selector);
                                };

                                QJ.isDOMElement = function(el) {
                                    return el && (el.nodeName != null);
                                };

                                rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

                                QJ.trim = function(text) {
                                    if (text === null) {
                                        return "";
                                    } else {
                                        return (text + "").replace(rtrim, "");
                                    }
                                };

                                rreturn = /\r/g;

                                QJ.val = function(el, val) {
                                    var ret;
                                    if (arguments.length > 1) {
                                        return el.value = val;
                                    } else {
                                        ret = el.value;
                                        if (typeof ret === "string") {
                                            return ret.replace(rreturn, "");
                                        } else {
                                            if (ret === null) {
                                                return "";
                                            } else {
                                                return ret;
                                            }
                                        }
                                    }
                                };

                                QJ.preventDefault = function(eventObject) {
                                    if (typeof eventObject.preventDefault === "function") {
                                        eventObject.preventDefault();
                                        return;
                                    }
                                    eventObject.returnValue = false;
                                    return false;
                                };

                                QJ.normalizeEvent = function(e) {
                                    var original;
                                    original = e;
                                    e = {
                                        which: original.which != null ? original.which : void 0,
                                        target: original.target || original.srcElement,
                                        preventDefault: function() {
                                            return QJ.preventDefault(original);
                                        },
                                        originalEvent: original,
                                        data: original.data || original.detail
                                    };
                                    if (e.which == null) {
                                        e.which = original.charCode != null ? original.charCode : original.keyCode;
                                    }
                                    return e;
                                };

                                QJ.on = function(element, eventName, callback) {
                                    var el, multEventName, originalCallback, _i, _j, _len, _len1, _ref;
                                    if (element.length) {
                                        for (_i = 0, _len = element.length; _i < _len; _i++) {
                                            el = element[_i];
                                            QJ.on(el, eventName, callback);
                                        }
                                        return;
                                    }
                                    if (eventName.match(" ")) {
                                        _ref = eventName.split(" ");
                                        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                                            multEventName = _ref[_j];
                                            QJ.on(element, multEventName, callback);
                                        }
                                        return;
                                    }
                                    originalCallback = callback;
                                    callback = function(e) {
                                        e = QJ.normalizeEvent(e);
                                        return originalCallback(e);
                                    };
                                    if (element.addEventListener) {
                                        return element.addEventListener(eventName, callback, false);
                                    }
                                    if (element.attachEvent) {
                                        eventName = "on" + eventName;
                                        return element.attachEvent(eventName, callback);
                                    }
                                    element['on' + eventName] = callback;
                                };

                                QJ.addClass = function(el, className) {
                                    var e;
                                    if (el.length) {
                                        return (function() {
                                            var _i, _len, _results;
                                            _results = [];
                                            for (_i = 0, _len = el.length; _i < _len; _i++) {
                                                e = el[_i];
                                                _results.push(QJ.addClass(e, className));
                                            }
                                            return _results;
                                        })();
                                    }
                                    if (el.classList) {
                                        return el.classList.add(className);
                                    } else {
                                        return el.className += ' ' + className;
                                    }
                                };

                                QJ.hasClass = function(el, className) {
                                    var e, hasClass, _i, _len;
                                    if (el.length) {
                                        hasClass = true;
                                        for (_i = 0, _len = el.length; _i < _len; _i++) {
                                            e = el[_i];
                                            hasClass = hasClass && QJ.hasClass(e, className);
                                        }
                                        return hasClass;
                                    }
                                    if (el.classList) {
                                        return el.classList.contains(className);
                                    } else {
                                        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
                                    }
                                };

                                QJ.removeClass = function(el, className) {
                                    var cls, e, _i, _len, _ref, _results;
                                    if (el.length) {
                                        return (function() {
                                            var _i, _len, _results;
                                            _results = [];
                                            for (_i = 0, _len = el.length; _i < _len; _i++) {
                                                e = el[_i];
                                                _results.push(QJ.removeClass(e, className));
                                            }
                                            return _results;
                                        })();
                                    }
                                    if (el.classList) {
                                        _ref = className.split(' ');
                                        _results = [];
                                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                            cls = _ref[_i];
                                            _results.push(el.classList.remove(cls));
                                        }
                                        return _results;
                                    } else {
                                        return el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                                    }
                                };

                                QJ.toggleClass = function(el, className, bool) {
                                    var e;
                                    if (el.length) {
                                        return (function() {
                                            var _i, _len, _results;
                                            _results = [];
                                            for (_i = 0, _len = el.length; _i < _len; _i++) {
                                                e = el[_i];
                                                _results.push(QJ.toggleClass(e, className, bool));
                                            }
                                            return _results;
                                        })();
                                    }
                                    if (bool) {
                                        if (!QJ.hasClass(el, className)) {
                                            return QJ.addClass(el, className);
                                        }
                                    } else {
                                        return QJ.removeClass(el, className);
                                    }
                                };

                                QJ.append = function(el, toAppend) {
                                    var e;
                                    if (el.length) {
                                        return (function() {
                                            var _i, _len, _results;
                                            _results = [];
                                            for (_i = 0, _len = el.length; _i < _len; _i++) {
                                                e = el[_i];
                                                _results.push(QJ.append(e, toAppend));
                                            }
                                            return _results;
                                        })();
                                    }
                                    return el.insertAdjacentHTML('beforeend', toAppend);
                                };

                                QJ.find = function(el, selector) {
                                    if (el instanceof NodeList || el instanceof Array) {
                                        el = el[0];
                                    }
                                    return el.querySelectorAll(selector);
                                };

                                QJ.trigger = function(el, name, data) {
                                    var e, ev;
                                    try {
                                        ev = new CustomEvent(name, {
                                            detail: data
                                        });
                                    } catch (_error) {
                                        e = _error;
                                        ev = document.createEvent('CustomEvent');
                                        if (ev.initCustomEvent) {
                                            ev.initCustomEvent(name, true, true, data);
                                        } else {
                                            ev.initEvent(name, true, true, data);
                                        }
                                    }
                                    return el.dispatchEvent(ev);
                                };

                                module.exports = QJ;


                            }, {}]
                        }, {}, [1])
                        (1)
                });
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {}],
        5: [function(require, module, exports) {
            module.exports = require('cssify');
        }, {
            "cssify": 6
        }],
        6: [function(require, module, exports) {
            module.exports = function(css, customDocument) {
                var doc = customDocument || document;
                if (doc.createStyleSheet) {
                    var sheet = doc.createStyleSheet()
                    sheet.cssText = css;
                    return sheet.ownerNode;
                } else {
                    var head = doc.getElementsByTagName('head')[0],
                        style = doc.createElement('style');

                    style.type = 'text/css';

                    if (style.styleSheet) {
                        style.styleSheet.cssText = css;
                    } else {
                        style.appendChild(doc.createTextNode(css));
                    }

                    head.appendChild(style);
                    return style;
                }
            };

            module.exports.byUrl = function(url) {
                if (document.createStyleSheet) {
                    return document.createStyleSheet(url).ownerNode;
                } else {
                    var head = document.getElementsByTagName('head')[0],
                        link = document.createElement('link');

                    link.rel = 'stylesheet';
                    link.href = url;

                    head.appendChild(link);
                    return link;
                }
            };

        }, {}],
        7: [function(require, module, exports) {
            (function(global) {
                var Card, QJ, extend, payment;

                require('../scss/card.scss');

                QJ = require('qj');

                payment = require('./payment/src/payment.coffee');

                extend = require('node.extend');

                Card = (function() {
                    var bindVal;

                    Card.prototype.cardTemplate = '' + '<div class="jp-card-container">' + '<div class="jp-card">' + '<div class="jp-card-front">' + '<div class="jp-card-logo jp-card-visa">visa</div>' + '<div class="jp-card-logo jp-card-mastercard">MasterCard</div>' + '<div class="jp-card-logo jp-card-maestro">Maestro</div>' + '<div class="jp-card-logo jp-card-amex"></div>' + '<div class="jp-card-logo jp-card-discover">discover</div>' + '<div class="jp-card-logo jp-card-dankort"><div class="dk"><div class="d"></div><div class="k"></div></div></div>' + '<div class="jp-card-lower">' + '<div class="jp-card-shiny"></div>' + '<div class="jp-card-cvc jp-card-display">{{cvc}}</div>' + '<div class="jp-card-number jp-card-display">{{number}}</div>' + '<div class="jp-card-name jp-card-display">{{name}}</div>' + '<div class="jp-card-expiry jp-card-display" data-before="{{monthYear}}" data-after="{{validDate}}">{{expiry}}</div>' + '</div>' + '</div>' + '<div class="jp-card-back">' + '<div class="jp-card-bar"></div>' + '<div class="jp-card-cvc jp-card-display">{{cvc}}</div>' + '<div class="jp-card-shiny"></div>' + '</div>' + '</div>' + '</div>';

                    Card.prototype.template = function(tpl, data) {
                        return tpl.replace(/\{\{(.*?)\}\}/g, function(match, key, str) {
                            return data[key];
                        });
                    };

                    Card.prototype.cardTypes = ['jp-card-amex', 'jp-card-dankort', 'jp-card-dinersclub', 'jp-card-discover', 'jp-card-jcb', 'jp-card-laser', 'jp-card-maestro', 'jp-card-mastercard', 'jp-card-unionpay', 'jp-card-visa', 'jp-card-visaelectron'];

                    Card.prototype.defaults = {
                        formatting: true,
                        formSelectors: {
                            numberInput: 'input[name="number"]',
                            expiryInput: 'input[name="expiry"]',
                            cvcInput: 'input[name="cvc"]',
                            nameInput: 'input[name="name"]'
                        },
                        cardSelectors: {
                            cardContainer: '.jp-card-container',
                            card: '.jp-card',
                            numberDisplay: '.jp-card-number',
                            expiryDisplay: '.jp-card-expiry',
                            cvcDisplay: '.jp-card-cvc',
                            nameDisplay: '.jp-card-name'
                        },
                        messages: {
                            validDate: 'valid\nthru',
                            monthYear: 'month/year'
                        },
                        placeholders: {
                            number: '&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;',
                            cvc: '&bull;&bull;&bull;',
                            expiry: '&bull;&bull;/&bull;&bull;',
                            name: 'Full Name'
                        },
                        classes: {
                            valid: 'jp-card-valid',
                            invalid: 'jp-card-invalid'
                        },
                        debug: false
                    };

                    function Card(opts) {
                        this.options = extend(true, this.defaults, opts);
                        if (!this.options.form) {
                            console.log("Please provide a form");
                            return;
                        }
                        this.$el = QJ(this.options.form);
                        if (!this.options.container) {
                            console.log("Please provide a container");
                            return;
                        }
                        this.$container = QJ(this.options.container);
                        this.render();
                        this.attachHandlers();
                        this.handleInitialPlaceholders();
                    }

                    Card.prototype.render = function() {
                        var $cardContainer, baseWidth, name, obj, selector, ua, _ref, _ref1;
                        QJ.append(this.$container, this.template(this.cardTemplate, extend({}, this.options.messages, this.options.placeholders)));
                        _ref = this.options.cardSelectors;
                        for (name in _ref) {
                            selector = _ref[name];
                            this["$" + name] = QJ.find(this.$container, selector);
                        }
                        _ref1 = this.options.formSelectors;
                        for (name in _ref1) {
                            selector = _ref1[name];
                            selector = this.options[name] ? this.options[name] : selector;
                            obj = QJ.find(this.$el, selector);
                            if (!obj.length && this.options.debug) {
                                console.error("Card can't find a " + name + " in your form.");
                            }
                            this["$" + name] = obj;
                        }
                        if (this.options.formatting) {
                            Payment.formatCardNumber(this.$numberInput);
                            Payment.formatCardCVC(this.$cvcInput);
                            if (this.$expiryInput.length === 1) {
                                Payment.formatCardExpiry(this.$expiryInput);
                            }
                        }
                        if (this.options.width) {
                            $cardContainer = QJ(this.options.cardSelectors.cardContainer)[0];
                            baseWidth = parseInt($cardContainer.clientWidth);
                            $cardContainer.style.transform = "scale(" + (this.options.width / baseWidth) + ")";
                        }
                        if (typeof navigator !== "undefined" && navigator !== null ? navigator.userAgent : void 0) {
                            ua = navigator.userAgent.toLowerCase();
                            if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
                                QJ.addClass(this.$card, 'jp-card-safari');
                            }
                        }
                        if (/MSIE 10\./i.test(navigator.userAgent)) {
                            QJ.addClass(this.$card, 'jp-card-ie-10');
                        }
                        if (/rv:11.0/i.test(navigator.userAgent)) {
                            return QJ.addClass(this.$card, 'jp-card-ie-11');
                        }
                    };

                    Card.prototype.attachHandlers = function() {
                        var expiryFilters;
                        bindVal(this.$numberInput, this.$numberDisplay, {
                            fill: false,
                            filters: this.validToggler('cardNumber')
                        });
                        QJ.on(this.$numberInput, 'payment.cardType', this.handle('setCardType'));
                        expiryFilters = [
                            function(val) {
                                return val.replace(/(\s+)/g, '');
                            }
                        ];
                        if (this.$expiryInput.length === 1) {
                            expiryFilters.push(this.validToggler('cardExpiry'));
                        }
                        bindVal(this.$expiryInput, this.$expiryDisplay, {
                            join: function(text) {
                                console.log(text);
                                if (text[0].length === 2 || text[1]) {
                                    console.log(text[0])
                                    return "\/";
                                } else {
                                    console.log(text[1]);
                                    return "";
                                }
                            },
                            filters: expiryFilters
                        });
                        bindVal(this.$cvcInput, this.$cvcDisplay, {
                            filters: this.validToggler('cardCVC')
                        });
                        QJ.on(this.$cvcInput, 'focus', this.handle('flipCard'));
                        QJ.on(this.$cvcInput, 'blur', this.handle('unflipCard'));
                        return bindVal(this.$nameInput, this.$nameDisplay, {
                            fill: false,
                            filters: this.validToggler('cardHolderName'),
                            join: ' '
                        });
                    };

                    Card.prototype.handleInitialPlaceholders = function() {
                        var el, name, selector, _ref, _results;
                        _ref = this.options.formSelectors;
                        _results = [];
                        for (name in _ref) {
                            selector = _ref[name];
                            el = this["$" + name];
                            if (QJ.val(el)) {
                                QJ.trigger(el, 'paste');
                                _results.push(setTimeout(function() {
                                    return QJ.trigger(el, 'keyup');
                                }));
                            } else {
                                _results.push(void 0);
                            }
                        }
                        return _results;
                    };

                    Card.prototype.handle = function(fn) {
                        return (function(_this) {
                            return function(e) {
                                var args;
                                args = Array.prototype.slice.call(arguments);
                                args.unshift(e.target);
                                return _this.handlers[fn].apply(_this, args);
                            };
                        })(this);
                    };

                    Card.prototype.validToggler = function(validatorName) {
                        var isValid;
                        if (validatorName === "cardExpiry") {
                            isValid = function(val) {
                                var objVal;
                                objVal = Payment.fns.cardExpiryVal(val);
                                return Payment.fns.validateCardExpiry(objVal.month, objVal.year);
                            };
                        } else if (validatorName === "cardCVC") {
                            isValid = (function(_this) {
                                return function(val) {
                                    return Payment.fns.validateCardCVC(val, _this.cardType);
                                };
                            })(this);
                        } else if (validatorName === "cardNumber") {
                            isValid = function(val) {
                                return Payment.fns.validateCardNumber(val);
                            };
                        } else if (validatorName === "cardHolderName") {
                            isValid = function(val) {
                                return val !== "";
                            };
                        }
                        return (function(_this) {
                            return function(val, $in, $out) {
                                var result;
                                result = isValid(val);
                                _this.toggleValidClass($in, result);
                                _this.toggleValidClass($out, result);
                                return val;
                            };
                        })(this);
                    };

                    Card.prototype.toggleValidClass = function(el, test) {
                        QJ.toggleClass(el, this.options.classes.valid, test);
                        return QJ.toggleClass(el, this.options.classes.invalid, !test);
                    };

                    Card.prototype.handlers = {
                        setCardType: function($el, e) {
                            var cardType;
                            cardType = e.data;
                            if (!QJ.hasClass(this.$card, cardType)) {
                                QJ.removeClass(this.$card, 'jp-card-unknown');
                                QJ.removeClass(this.$card, this.cardTypes.join(' '));
                                QJ.addClass(this.$card, "jp-card-" + cardType);
                                QJ.toggleClass(this.$card, 'jp-card-identified', cardType !== 'unknown');
                                return this.cardType = cardType;
                            }
                        },
                        flipCard: function() {
                            return QJ.addClass(this.$card, 'jp-card-flipped');
                        },
                        unflipCard: function() {
                            return QJ.removeClass(this.$card, 'jp-card-flipped');
                        }
                    };

                    bindVal = function(el, out, opts) {
                        var joiner, o, outDefaults;
                        if (opts == null) {
                            opts = {};
                        }
                        opts.fill = opts.fill || false;
                        opts.filters = opts.filters || [];
                        if (!(opts.filters instanceof Array)) {
                            opts.filters = [opts.filters];
                        }
                        opts.join = opts.join || "";
                        if (!(typeof opts.join === "function")) {
                            joiner = opts.join;
                            opts.join = function() {
                                return joiner;
                            };
                        }
                        outDefaults = (function() {
                            var _i, _len, _results;
                            _results = [];
                            for (_i = 0, _len = out.length; _i < _len; _i++) {
                                o = out[_i];
                                _results.push(o.textContent);
                            }
                            return _results;
                        })();
                        QJ.on(el, 'focus', function() {
                            return QJ.addClass(out, 'jp-card-focused');
                        });
                        QJ.on(el, 'blur', function() {
                            return QJ.removeClass(out, 'jp-card-focused');
                        });
                        QJ.on(el, 'keyup change paste', function(e) {
                            var elem, filter, i, join, outEl, outVal, val, _i, _j, _len, _len1, _ref, _results;
                            val = (function() {
                                var _i, _len, _results;
                                _results = [];
                                for (_i = 0, _len = el.length; _i < _len; _i++) {
                                    elem = el[_i];
                                    _results.push(QJ.val(elem));
                                }
                                return _results;
                            })();
                            join = opts.join(val);
                            val = val.join(join);
                            if (val === join) {
                                val = "";
                            }
                            _ref = opts.filters;
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                filter = _ref[_i];
                                val = filter(val, el, out);
                            }
                            _results = [];
                            for (i = _j = 0, _len1 = out.length; _j < _len1; i = ++_j) {
                                outEl = out[i];
                                if (opts.fill) {
                                    outVal = val + outDefaults[i].substring(val.length);
                                } else {
                                    outVal = val || outDefaults[i];
                                }
                                _results.push(outEl.textContent = outVal);
                            }
                            return _results;
                        });
                        return el;
                    };

                    return Card;

                })();

                module.exports = Card;

                global.Card = Card;

            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {
            "../scss/card.scss": 10,
            "./payment/src/payment.coffee": 9,
            "node.extend": 1,
            "qj": 4
        }],
        8: [function(require, module, exports) {
            var $, Card,
                __slice = [].slice;
            Card = require('./card');
            $ = jQuery;
            $.card = {};
            $.card.fn = {};
            $.fn.card = function(opts) {
                return $.card.fn.construct.apply(this, opts);
            };
            $.fn.extend({
                card: function() {
                    var args, option;
                    option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                    return this.each(function() {
                        var $this, data;
                        $this = $(this);
                        data = $this.data('card');
                        if (!data) {
                            $.each(option, (function(_this) {
                                return function(key, value) {
                                    if (value instanceof jQuery) {
                                        return option[key] = value[0];
                                    }
                                };
                            })(this));
                            option['form'] = this;
                            $this.data('card', (data = new Card(option)));
                        }
                        if (typeof option === 'string') {
                            return data[option].apply(data, args);
                        }
                    });
                }
            });
        }, {
            "./card": 7
        }],
        9: [function(require, module, exports) {
            (function(global) {
                var Payment, QJ, cardFromNumber, cardFromType, cards, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardNumber, formatExpiry, formatForwardExpiry, formatForwardSlash, hasTextSelected, luhnCheck, reFormatCardNumber, restrictCVC, restrictCardNumber, restrictExpiry, restrictNumeric, setCardType,
                    __indexOf = [].indexOf || function(item) {
                        for (var i = 0, l = this.length; i < l; i++) {
                            if (i in this && this[i] === item) return i;
                        }
                        return -1;
                    };

                QJ = require('qj');

                defaultFormat = /(\d{1,4})/g;

                cards = [{
                    type: 'amex',
                    pattern: /^3[47]/,
                    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
                    length: [15],
                    cvcLength: [4],
                    luhn: true
                }, {
                    type: 'dankort',
                    pattern: /^5019/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'dinersclub',
                    pattern: /^(36|38|30[0-5])/,
                    format: defaultFormat,
                    length: [14],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'discover',
                    pattern: /^(6011|65|64[4-9]|622)/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'jcb',
                    pattern: /^35/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'laser',
                    pattern: /^(6706|6771|6709)/,
                    format: defaultFormat,
                    length: [16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'maestro',
                    pattern: /^(5018|5020|5038|6304|6703|6759|676[1-3])/,
                    format: defaultFormat,
                    length: [12, 13, 14, 15, 16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'mastercard',
                    pattern: /^5[1-5]/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'unionpay',
                    pattern: /^62/,
                    format: defaultFormat,
                    length: [16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: false
                }, {
                    type: 'visaelectron',
                    pattern: /^4(026|17500|405|508|844|91[37])/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'visa',
                    pattern: /^4/,
                    format: defaultFormat,
                    length: [13, 14, 15, 16],
                    cvcLength: [3],
                    luhn: true
                }];

                cardFromNumber = function(num) {
                    var card, _i, _len;
                    num = (num + '').replace(/\D/g, '');
                    for (_i = 0, _len = cards.length; _i < _len; _i++) {
                        card = cards[_i];
                        if (card.pattern.test(num)) {
                            return card;
                        }
                    }
                };

                cardFromType = function(type) {
                    var card, _i, _len;
                    for (_i = 0, _len = cards.length; _i < _len; _i++) {
                        card = cards[_i];
                        if (card.type === type) {
                            return card;
                        }
                    }
                };

                luhnCheck = function(num) {
                    var digit, digits, odd, sum, _i, _len;
                    odd = true;
                    sum = 0;
                    digits = (num + '').split('').reverse();
                    for (_i = 0, _len = digits.length; _i < _len; _i++) {
                        digit = digits[_i];
                        digit = parseInt(digit, 10);
                        if ((odd = !odd)) {
                            digit *= 2;
                        }
                        if (digit > 9) {
                            digit -= 9;
                        }
                        sum += digit;
                    }
                    return sum % 10 === 0;
                };

                hasTextSelected = function(target) {
                    var _ref;
                    if ((target.selectionStart != null) && target.selectionStart !== target.selectionEnd) {
                        return true;
                    }
                    if ((typeof document !== "undefined" && document !== null ? (_ref = document.selection) != null ? _ref.createRange : void 0 : void 0) != null) {
                        if (document.selection.createRange().text) {
                            return true;
                        }
                    }
                    return false;
                };

                reFormatCardNumber = function(e) {
                    return setTimeout((function(_this) {
                        return function() {
                            var target, value;
                            target = e.target;
                            value = QJ.val(target);
                            value = Payment.fns.formatCardNumber(value);
                            return QJ.val(target, value);
                        };
                    }, 150)(this));
                };

                formatCardNumber = function(e) {
                    var card, digit, length, re, target, upperLength, value;
                    digit = String.fromCharCode(e.which);
                    if (!/^\d+$/.test(digit)) {
                        return;
                    }
                    target = e.target;
                    value = QJ.val(target);
                    card = cardFromNumber(value + digit);
                    length = (value.replace(/\D/g, '') + digit).length;
                    upperLength = 16;
                    if (card) {
                        upperLength = card.length[card.length.length - 1];
                    }
                    if (length >= upperLength) {
                        return;
                    }
                    if ((target.selectionStart != null) && target.selectionStart !== value.length) {
                        return;
                    }
                    if (card && card.type === 'amex') {
                        re = /^(\d{4}|\d{4}\s\d{6})$/;
                    } else {
                        re = /(?:^|\s)(\d{4})$/;
                    }
                    if (re.test(value)) {
                        e.preventDefault();
                        return QJ.val(target, value + " " + digit);
                    } else if (re.test(value + digit)) {
                        e.preventDefault();
                        return QJ.val(target, value + digit + " ");
                    }
                };

                formatBackCardNumber = function(e) {
                    var target, value;
                    target = e.target;
                    value = QJ.val(target);
                    if (e.meta) {
                        return;
                    }
                    if (e.which !== 8) {
                        return;
                    }
                    if ((target.selectionStart != null) && target.selectionStart !== value.length) {
                        return;
                    }
                    if (/\d\s$/.test(value)) {
                        e.preventDefault();
                        return QJ.val(target, value.replace(/\d\s$/, ''));
                    } else if (/\s\d?$/.test(value)) {
                        e.preventDefault();
                        return QJ.val(target, value.replace(/\s\d?$/, ''));
                    }
                };

                formatExpiry = function(e) {
                    var digit, target, val;
                    digit = String.fromCharCode(e.which);
                    if (!/^\d+$/.test(digit)) {
                        return;
                    }
                    target = e.target;
                    val = QJ.val(target) + digit;
                    if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
                        e.preventDefault();
                        return QJ.val(target, "0" + val + " \/ ");
                    } else if (/^\d\d$/.test(val)) {
                        e.preventDefault();
                        return QJ.val(target, "" + val + " \/ ");
                    }
                };

                formatForwardExpiry = function(e) {
                    var digit, target, val;
                    digit = String.fromCharCode(e.which);
                    if (!/^\d+$/.test(digit)) {
                        return;
                    }
                    target = e.target;
                    val = QJ.val(target);
                    if (/^\d\d$/.test(val)) {
                        return QJ.val(target, "" + val + " \/ ");
                    }
                };

                formatForwardSlash = function(e) {
                    var slash, target, val;
                    slash = String.fromCharCode(e.which);
                    if (slash !== "\/") {
                        return;
                    }
                    target = e.target;
                    val = QJ.val(target);
                    if (/^\d$/.test(val) && val !== '0') {
                        return QJ.val(target, "0" + val + " \/ ");
                    }
                };

                formatBackExpiry = function(e) {
                    var target, value;
                    if (e.metaKey) {
                        return;
                    }
                    target = e.target;
                    value = QJ.val(target);
                    if (e.which !== 8) {
                        return;
                    }
                    if ((target.selectionStart != null) && target.selectionStart !== value.length) {
                        return;
                    }
                    if (/\d(\s|\/)+$/.test(value)) {
                        e.preventDefault();
                        return QJ.val(target, value.replace(/\d(\s|\/)*$/, ''));
                    } else if (/\s\/\s?\d?$/.test(value)) {
                        e.preventDefault();
                        return QJ.val(target, value.replace(/\s\/\s?\d?$/, ''));
                    }
                };

                restrictNumeric = function(e) {
                    var input;
                    if (e.metaKey || e.ctrlKey) {
                        return true;
                    }
                    if (e.which === 32) {
                        return e.preventDefault();
                    }
                    if (e.which === 0) {
                        return true;
                    }
                    if (e.which < 33) {
                        return true;
                    }
                    input = String.fromCharCode(e.which);
                    if (!/[\d\s]/.test(input)) {
                        return e.preventDefault();
                    }
                };

                restrictCardNumber = function(e) {
                    var card, digit, target, value;
                    target = e.target;
                    digit = String.fromCharCode(e.which);
                    if (!/^\d+$/.test(digit)) {
                        return;
                    }
                    if (hasTextSelected(target)) {
                        return;
                    }
                    value = (QJ.val(target) + digit).replace(/\D/g, '');
                    card = cardFromNumber(value);
                    if (card) {
                        if (!(value.length <= card.length[card.length.length - 1])) {
                            return e.preventDefault();
                        }
                    } else {
                        if (!(value.length <= 16)) {
                            return e.preventDefault();
                        }
                    }
                };

                restrictExpiry = function(e) {
                    var digit, target, value;
                    target = e.target;
                    digit = String.fromCharCode(e.which);
                    if (!/^\d+$/.test(digit)) {
                        return;
                    }
                    if (hasTextSelected(target)) {
                        return;
                    }
                    value = QJ.val(target) + digit;
                    value = value.replace(/\D/g, '');
                    if (value.length > 6) {
                        return e.preventDefault();
                    }
                };

                restrictCVC = function(e) {
                    var digit, target, val;
                    target = e.target;
                    digit = String.fromCharCode(e.which);
                    if (!/^\d+$/.test(digit)) {
                        return;
                    }
                    val = QJ.val(target) + digit;
                    if (!(val.length <= 4)) {
                        return e.preventDefault();
                    }
                };

                setCardType = function(e) {
                    var allTypes, card, cardType, target, val;
                    target = e.target;
                    val = QJ.val(target);
                    cardType = Payment.fns.cardType(val) || 'unknown';
                    if (!QJ.hasClass(target, cardType)) {
                        allTypes = (function() {
                            var _i, _len, _results;
                            _results = [];
                            for (_i = 0, _len = cards.length; _i < _len; _i++) {
                                card = cards[_i];
                                _results.push(card.type);
                            }
                            return _results;
                        })();
                        QJ.removeClass(target, 'unknown');
                        QJ.removeClass(target, allTypes.join(' '));
                        QJ.addClass(target, cardType);
                        QJ.toggleClass(target, 'identified', cardType !== 'unknown');
                        return QJ.trigger(target, 'payment.cardType', cardType);
                    }
                };

                Payment = (function() {
                    function Payment() {}

                    Payment.fns = {
                        cardExpiryVal: function(value) {
                            var month, prefix, year, _ref;
                            value = value.replace(/\s/g, '');
                            _ref = value.split('/', 2), month = _ref[0], year = _ref[1];
                            if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
                                prefix = (new Date).getFullYear();
                                prefix = prefix.toString().slice(0, 2);
                                year = prefix + year;
                            }
                            month = parseInt(month, 10);
                            year = parseInt(year, 10);
                            return {
                                month: month,
                                year: year
                            };
                        },
                        validateCardNumber: function(num) {
                            var card, _ref;
                            num = (num + '').replace(/\s+|-/g, '');
                            if (!/^\d+$/.test(num)) {
                                return false;
                            }
                            card = cardFromNumber(num);
                            if (!card) {
                                return false;
                            }
                            return (_ref = num.length, __indexOf.call(card.length, _ref) >= 0) && (card.luhn === false || luhnCheck(num));
                        },
                        validateCardExpiry: function(month, year) {
                            var currentTime, expiry, prefix, _ref;
                            if (typeof month === 'object' && 'month' in month) {
                                _ref = month, month = _ref.month, year = _ref.year;
                            }
                            if (!(month && year)) {
                                return false;
                            }
                            month = QJ.trim(month);
                            year = QJ.trim(year);
                            if (!/^\d+$/.test(month)) {
                                return false;
                            }
                            if (!/^\d+$/.test(year)) {
                                return false;
                            }
                            if (!(parseInt(month, 10) <= 12)) {
                                return false;
                            }
                            if (year.length === 2) {
                                prefix = (new Date).getFullYear();
                                prefix = prefix.toString().slice(0, 2);
                                year = prefix + year;
                            }
                            expiry = new Date(year, month);
                            currentTime = new Date;
                            expiry.setMonth(expiry.getMonth() - 1);
                            expiry.setMonth(expiry.getMonth() + 1, 1);
                            return expiry > currentTime;
                        },
                        validateCardCVC: function(cvc, type) {
                            var _ref, _ref1;
                            cvc = QJ.trim(cvc);
                            if (!/^\d+$/.test(cvc)) {
                                return false;
                            }
                            if (type && cardFromType(type)) {
                                return _ref = cvc.length, __indexOf.call((_ref1 = cardFromType(type)) != null ? _ref1.cvcLength : void 0, _ref) >= 0;
                            } else {
                                return cvc.length >= 3 && cvc.length <= 4;
                            }
                        },
                        cardType: function(num) {
                            var _ref;
                            if (!num) {
                                return null;
                            }
                            return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null;
                        },
                        formatCardNumber: function(num) {
                            var card, groups, upperLength, _ref;
                            card = cardFromNumber(num);
                            if (!card) {
                                return num;
                            }
                            upperLength = card.length[card.length.length - 1];
                            num = num.replace(/\D/g, '');
                            num = num.slice(0, +upperLength + 1 || 9e9);
                            if (card.format.global) {
                                return (_ref = num.match(card.format)) != null ? _ref.join(' ') : void 0;
                            } else {
                                groups = card.format.exec(num);
                                if (groups != null) {
                                    groups.shift();
                                }
                                return groups != null ? groups.join(' ') : void 0;
                            }
                        }
                    };

                    Payment.restrictNumeric = function(el) {
                        return QJ.on(el, 'keypress', restrictNumeric);
                    };

                    Payment.cardExpiryVal = function(el) {
                        return Payment.fns.cardExpiryVal(QJ.val(el));
                    };

                    Payment.formatCardCVC = function(el) {
                        Payment.restrictNumeric(el);
                        QJ.on(el, 'keypress', restrictCVC);
                        return el;
                    };

                    Payment.formatCardExpiry = function(el) {
                        Payment.restrictNumeric(el);
                        QJ.on(el, 'keypress', restrictExpiry);
                        QJ.on(el, 'keypress', formatExpiry);
                        QJ.on(el, 'keypress', formatForwardSlash);
                        QJ.on(el, 'keypress', formatForwardExpiry);
                        QJ.on(el, 'keydown', formatBackExpiry);
                        return el;
                    };

                    Payment.formatCardNumber = function(el) {
                        Payment.restrictNumeric(el);
                        QJ.on(el, 'keypress', restrictCardNumber);
                        QJ.on(el, 'keypress', formatCardNumber);
                        QJ.on(el, 'keydown', formatBackCardNumber);
                        QJ.on(el, 'keyup', setCardType);
                        QJ.on(el, 'paste', reFormatCardNumber);
                        return el;
                    };

                    Payment.getCardArray = function() {
                        return cards;
                    };

                    Payment.setCardArray = function(cardArray) {
                        cards = cardArray;
                        return true;
                    };

                    Payment.addToCardArray = function(cardObject) {
                        return cards.push(cardObject);
                    };

                    Payment.removeFromCardArray = function(type) {
                        var key, value;
                        for (key in cards) {
                            value = cards[key];
                            if (value.type === type) {
                                cards.splice(key, 1);
                            }
                        }
                        return true;
                    };

                    return Payment;

                })();

                module.exports = Payment;

                global.Payment = Payment;

            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {
            "qj": 4
        }],
        10: [function(require, module, exports) {
            module.exports = require('sassify')('.jp-card.jp-card-safari.jp-card-identified .jp-card-front:before, .jp-card.jp-card-safari.jp-card-identified .jp-card-back:before {   background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), -webkit-linear-gradient(-245deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%);   background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), linear-gradient(-25deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%); }  .jp-card.jp-card-ie-10.jp-card-flipped, .jp-card.jp-card-ie-11.jp-card-flipped {   -webkit-transform: 0deg;   -moz-transform: 0deg;   -ms-transform: 0deg;   -o-transform: 0deg;   transform: 0deg; }   .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-front, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-front {     -webkit-transform: rotateY(0deg);     -moz-transform: rotateY(0deg);     -ms-transform: rotateY(0deg);     -o-transform: rotateY(0deg);     transform: rotateY(0deg); }   .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-back, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-back {     -webkit-transform: rotateY(0deg);     -moz-transform: rotateY(0deg);     -ms-transform: rotateY(0deg);     -o-transform: rotateY(0deg);     transform: rotateY(0deg); }     .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-back:after, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-back:after {       left: 18%; }     .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-back .jp-card-cvc, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-back .jp-card-cvc {       -webkit-transform: rotateY(180deg);       -moz-transform: rotateY(180deg);       -ms-transform: rotateY(180deg);       -o-transform: rotateY(180deg);       transform: rotateY(180deg);       left: 5%; }     .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-back .jp-card-shiny, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-back .jp-card-shiny {       left: 84%; }       .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-back .jp-card-shiny:after, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-back .jp-card-shiny:after {         left: -480%;         -webkit-transform: rotateY(180deg);         -moz-transform: rotateY(180deg);         -ms-transform: rotateY(180deg);         -o-transform: rotateY(180deg);         transform: rotateY(180deg); }  .jp-card.jp-card-ie-10.jp-card-amex .jp-card-back, .jp-card.jp-card-ie-11.jp-card-amex .jp-card-back {   display: none; }  .jp-card-logo {   height: 36px;   width: 60px;   font-style: italic; }   .jp-card-logo, .jp-card-logo:before, .jp-card-logo:after {     box-sizing: border-box; }  .jp-card-logo.jp-card-amex {   text-transform: uppercase;   font-size: 4px;   font-weight: bold;   color: white;   background-image: repeating-radial-gradient(circle at center, #FFF 1px, #999 2px);   background-image: repeating-radial-gradient(circle at center, #FFF 1px, #999 2px);   border: 1px solid #EEE; }   .jp-card-logo.jp-card-amex:before, .jp-card-logo.jp-card-amex:after {     width: 28px;     display: block;     position: absolute;     left: 16px; }   .jp-card-logo.jp-card-amex:before {     height: 28px;     content: "american";     top: 3px;     text-align: left;     padding-left: 2px;     padding-top: 11px;     background: #267AC3; }   .jp-card-logo.jp-card-amex:after {     content: "express";     bottom: 11px;     text-align: right;     padding-right: 2px; }  .jp-card.jp-card-amex.jp-card-flipped {   -webkit-transform: none;   -moz-transform: none;   -ms-transform: none;   -o-transform: none;   transform: none; }  .jp-card.jp-card-amex.jp-card-identified .jp-card-front:before, .jp-card.jp-card-amex.jp-card-identified .jp-card-back:before {   background-color: #108168; }  .jp-card.jp-card-amex.jp-card-identified .jp-card-front .jp-card-logo.jp-card-amex {   opacity: 1; }  .jp-card.jp-card-amex.jp-card-identified .jp-card-front .jp-card-cvc {   visibility: visible; }  .jp-card.jp-card-amex.jp-card-identified .jp-card-front:after {   opacity: 1; }  .jp-card-logo.jp-card-discover {   background: #FF6600;   color: #111;   text-transform: uppercase;   font-style: normal;   font-weight: bold;   font-size: 10px;   text-align: center;   overflow: hidden;   z-index: 1;   padding-top: 9px;   letter-spacing: .03em;   border: 1px solid #EEE; }   .jp-card-logo.jp-card-discover:before, .jp-card-logo.jp-card-discover:after {     content: " ";     display: block;     position: absolute; }   .jp-card-logo.jp-card-discover:before {     background: white;     width: 200px;     height: 200px;     border-radius: 200px;     bottom: -5%;     right: -80%;     z-index: -1; }   .jp-card-logo.jp-card-discover:after {     width: 8px;     height: 8px;     border-radius: 4px;     top: 10px;     left: 27px;     background-color: #FF6600;     background-image: -webkit-radial-gradient(#FF6600, #fff, , , , , , , , );     background-image: radial-gradient(  #FF6600, #fff, , , , , , , , );     content: "network";     font-size: 4px;     line-height: 24px;     text-indent: -7px; }  .jp-card .jp-card-front .jp-card-logo.jp-card-discover {   right: 12%;   top: 18%; }  .jp-card.jp-card-discover.jp-card-identified .jp-card-front:before, .jp-card.jp-card-discover.jp-card-identified .jp-card-back:before {   background-color: #86B8CF; }  .jp-card.jp-card-discover.jp-card-identified .jp-card-logo.jp-card-discover {   opacity: 1; }  .jp-card.jp-card-discover.jp-card-identified .jp-card-front:after {   -webkit-transition: 400ms;   -moz-transition: 400ms;   transition: 400ms;   content: " ";   display: block;   background-color: #FF6600;   background-image: -webkit-linear-gradient(#FF6600, #ffa366, #FF6600);   background-image: linear-gradient(#FF6600, #ffa366, #FF6600, , , , , , , );   height: 50px;   width: 50px;   border-radius: 25px;   position: absolute;   left: 100%;   top: 15%;   margin-left: -25px;   box-shadow: inset 1px 1px 3px 1px rgba(0, 0, 0, 0.5); }  .jp-card-logo.jp-card-visa {   background: white;   text-transform: uppercase;   color: #1A1876;   text-align: center;   font-weight: bold;   font-size: 15px;   line-height: 18px; }   .jp-card-logo.jp-card-visa:before, .jp-card-logo.jp-card-visa:after {     content: " ";     display: block;     width: 100%;     height: 25%; }   .jp-card-logo.jp-card-visa:before {     background: #1A1876; }   .jp-card-logo.jp-card-visa:after {     background: #E79800; }  .jp-card.jp-card-visa.jp-card-identified .jp-card-front:before, .jp-card.jp-card-visa.jp-card-identified .jp-card-back:before {   background-color: #191278; }  .jp-card.jp-card-visa.jp-card-identified .jp-card-logo.jp-card-visa {   opacity: 1; }  .jp-card-logo.jp-card-mastercard {   color: white;   font-weight: bold;   text-align: center;   font-size: 9px;   line-height: 36px;   z-index: 1;   text-shadow: 1px 1px rgba(0, 0, 0, 0.6); }   .jp-card-logo.jp-card-mastercard:before, .jp-card-logo.jp-card-mastercard:after {     content: " ";     display: block;     width: 36px;     top: 0;     position: absolute;     height: 36px;     border-radius: 18px; }   .jp-card-logo.jp-card-mastercard:before {     left: 0;     background: #FF0000;     z-index: -1; }   .jp-card-logo.jp-card-mastercard:after {     right: 0;     background: #FFAB00;     z-index: -2; }  .jp-card.jp-card-mastercard.jp-card-identified .jp-card-front .jp-card-logo.jp-card-mastercard, .jp-card.jp-card-mastercard.jp-card-identified .jp-card-back .jp-card-logo.jp-card-mastercard {   box-shadow: none; }  .jp-card.jp-card-mastercard.jp-card-identified .jp-card-front:before, .jp-card.jp-card-mastercard.jp-card-identified .jp-card-back:before {   background-color: #0061A8; }  .jp-card.jp-card-mastercard.jp-card-identified .jp-card-logo.jp-card-mastercard {   opacity: 1; }  .jp-card-logo.jp-card-maestro {   color: white;   font-weight: bold;   text-align: center;   font-size: 14px;   line-height: 36px;   z-index: 1;   text-shadow: 1px 1px rgba(0, 0, 0, 0.6); }   .jp-card-logo.jp-card-maestro:before, .jp-card-logo.jp-card-maestro:after {     content: " ";     display: block;     width: 36px;     top: 0;     position: absolute;     height: 36px;     border-radius: 18px; }   .jp-card-logo.jp-card-maestro:before {     left: 0;     background: #0064CB;     z-index: -1; }   .jp-card-logo.jp-card-maestro:after {     right: 0;     background: #CC0000;     z-index: -2; }  .jp-card.jp-card-maestro.jp-card-identified .jp-card-front .jp-card-logo.jp-card-maestro, .jp-card.jp-card-maestro.jp-card-identified .jp-card-back .jp-card-logo.jp-card-maestro {   box-shadow: none; }  .jp-card.jp-card-maestro.jp-card-identified .jp-card-front:before, .jp-card.jp-card-maestro.jp-card-identified .jp-card-back:before {   background-color: #0B2C5F; }  .jp-card.jp-card-maestro.jp-card-identified .jp-card-logo.jp-card-maestro {   opacity: 1; }  .jp-card-logo.jp-card-dankort {   width: 60px;   height: 36px;   padding: 3px;   border-radius: 8px;   border: #000000 1px solid;   background-color: #FFFFFF; }   .jp-card-logo.jp-card-dankort .dk {     position: relative;     width: 100%;     height: 100%;     overflow: hidden; }     .jp-card-logo.jp-card-dankort .dk:before {       background-color: #ED1C24;       content: \'\';       position: absolute;       width: 100%;       height: 100%;       display: block;       border-radius: 6px; }     .jp-card-logo.jp-card-dankort .dk:after {       content: \'\';       position: absolute;       top: 50%;       margin-top: -7.7px;       right: 0;       width: 0;       height: 0;       border-style: solid;       border-width: 7px 7px 10px 0;       border-color: transparent #ED1C24 transparent transparent;       z-index: 1; }   .jp-card-logo.jp-card-dankort .d, .jp-card-logo.jp-card-dankort .k {     position: absolute;     top: 50%;     width: 50%;     display: block;     height: 15.4px;     margin-top: -7.7px;     background: white; }   .jp-card-logo.jp-card-dankort .d {     left: 0;     border-radius: 0 8px 10px 0; }     .jp-card-logo.jp-card-dankort .d:before {       content: \'\';       position: absolute;       top: 50%;       left: 50%;       display: block;       background: #ED1C24;       border-radius: 2px 4px 6px 0px;       height: 5px;       width: 7px;       margin: -3px 0 0 -4px; }   .jp-card-logo.jp-card-dankort .k {     right: 0; }     .jp-card-logo.jp-card-dankort .k:before, .jp-card-logo.jp-card-dankort .k:after {       content: \'\';       position: absolute;       right: 50%;       width: 0;       height: 0;       border-style: solid;       margin-right: -1px; }     .jp-card-logo.jp-card-dankort .k:before {       top: 0;       border-width: 8px 5px 0 0;       border-color: #ED1C24 transparent transparent transparent; }     .jp-card-logo.jp-card-dankort .k:after {       bottom: 0;       border-width: 0 5px 8px 0;       border-color: transparent transparent #ED1C24 transparent; }  .jp-card.jp-card-dankort.jp-card-identified .jp-card-front:before, .jp-card.jp-card-dankort.jp-card-identified .jp-card-back:before {   background-color: #0055C7; }  .jp-card.jp-card-dankort.jp-card-identified .jp-card-logo.jp-card-dankort {   opacity: 1; }  .jp-card-container {   -webkit-perspective: 1000px;   -moz-perspective: 1000px;   perspective: 1000px;   width: 350px;   max-width: 100%;   height: 200px;   margin: auto;   z-index: 1;   position: relative; }  .jp-card {   font-family: "Helvetica Neue";   line-height: 1;   position: relative;   width: 100%;   height: 100%;   min-width: 315px;   border-radius: 10px;   -webkit-transform-style: preserve-3d;   -moz-transform-style: preserve-3d;   -ms-transform-style: preserve-3d;   -o-transform-style: preserve-3d;   transform-style: preserve-3d;   -webkit-transition: all 400ms linear;   -moz-transition: all 400ms linear;   transition: all 400ms linear; }   .jp-card > *, .jp-card > *:before, .jp-card > *:after {     -moz-box-sizing: border-box;     -webkit-box-sizing: border-box;     box-sizing: border-box;     font-family: inherit; }   .jp-card.jp-card-flipped {     -webkit-transform: rotateY(180deg);     -moz-transform: rotateY(180deg);     -ms-transform: rotateY(180deg);     -o-transform: rotateY(180deg);     transform: rotateY(180deg); }   .jp-card .jp-card-front, .jp-card .jp-card-back {     -webkit-backface-visibility: hidden;     backface-visibility: hidden;     -webkit-transform-style: preserve-3d;     -moz-transform-style: preserve-3d;     -ms-transform-style: preserve-3d;     -o-transform-style: preserve-3d;     transform-style: preserve-3d;     -webkit-transition: all 400ms linear;     -moz-transition: all 400ms linear;     transition: all 400ms linear;     width: 100%;     height: 100%;     position: absolute;     top: 0;     left: 0;     overflow: hidden;     border-radius: 10px;     background: #DDD; }     .jp-card .jp-card-front:before, .jp-card .jp-card-back:before {       content: " ";       display: block;       position: absolute;       width: 100%;       height: 100%;       top: 0;       left: 0;       opacity: 0;       border-radius: 10px;       -webkit-transition: all 400ms ease;       -moz-transition: all 400ms ease;       transition: all 400ms ease; }     .jp-card .jp-card-front:after, .jp-card .jp-card-back:after {       content: " ";       display: block; }     .jp-card .jp-card-front .jp-card-display, .jp-card .jp-card-back .jp-card-display {       color: white;       font-weight: normal;       opacity: 0.5;       -webkit-transition: opacity 400ms linear;       -moz-transition: opacity 400ms linear;       transition: opacity 400ms linear; }       .jp-card .jp-card-front .jp-card-display.jp-card-focused, .jp-card .jp-card-back .jp-card-display.jp-card-focused {         opacity: 1;         font-weight: 700; }     .jp-card .jp-card-front .jp-card-cvc, .jp-card .jp-card-back .jp-card-cvc {       font-family: "Bitstream Vera Sans Mono", Consolas, Courier, monospace;       font-size: 14px; }     .jp-card .jp-card-front .jp-card-shiny, .jp-card .jp-card-back .jp-card-shiny {       width: 50px;       height: 35px;       border-radius: 5px;       background: #CCC;       position: relative; }       .jp-card .jp-card-front .jp-card-shiny:before, .jp-card .jp-card-back .jp-card-shiny:before {         content: " ";         display: block;         width: 70%;         height: 60%;         border-top-right-radius: 5px;         border-bottom-right-radius: 5px;         background: #d9d9d9;         position: absolute;         top: 20%; }   .jp-card .jp-card-front .jp-card-logo {     position: absolute;     opacity: 0;     right: 5%;     top: 8%;     -webkit-transition: 400ms;     -moz-transition: 400ms;     transition: 400ms; }   .jp-card .jp-card-front .jp-card-lower {     width: 80%;     position: absolute;     left: 10%;     bottom: 30px; }     @media only screen and (max-width: 480px) {       .jp-card .jp-card-front .jp-card-lower {         width: 90%;         left: 5%; } }     .jp-card .jp-card-front .jp-card-lower .jp-card-cvc {       visibility: hidden;       float: right;       position: relative;       bottom: 5px; }     .jp-card .jp-card-front .jp-card-lower .jp-card-number {       font-family: "Bitstream Vera Sans Mono", Consolas, Courier, monospace;       font-size: 24px;       clear: both;       margin-bottom: 30px; }     .jp-card .jp-card-front .jp-card-lower .jp-card-expiry {       font-family: "Bitstream Vera Sans Mono", Consolas, Courier, monospace;       letter-spacing: 0em;       position: relative;       float: right;       width: 25%; }       .jp-card .jp-card-front .jp-card-lower .jp-card-expiry:before, .jp-card .jp-card-front .jp-card-lower .jp-card-expiry:after {         font-family: "Helvetica Neue";         font-weight: bold;         font-size: 7px;         white-space: pre;         display: block;         opacity: .5; }       .jp-card .jp-card-front .jp-card-lower .jp-card-expiry:before {         content: attr(data-before);         margin-bottom: 2px;         font-size: 7px;         text-transform: uppercase; }       .jp-card .jp-card-front .jp-card-lower .jp-card-expiry:after {         position: absolute;         content: attr(data-after);         text-align: right;         right: 100%;         margin-right: 5px;         margin-top: 2px;         bottom: 0; }     .jp-card .jp-card-front .jp-card-lower .jp-card-name {       text-transform: uppercase;       font-family: "Bitstream Vera Sans Mono", Consolas, Courier, monospace;       font-size: 20px;       max-height: 45px;       position: absolute;       bottom: 0;       width: 190px;       display: -webkit-box;       -webkit-line-clamp: 2;       -webkit-box-orient: horizontal;       overflow: hidden;       text-overflow: ellipsis; }   .jp-card .jp-card-back {     -webkit-transform: rotateY(180deg);     -moz-transform: rotateY(180deg);     -ms-transform: rotateY(180deg);     -o-transform: rotateY(180deg);     transform: rotateY(180deg); }     .jp-card .jp-card-back .jp-card-bar {       background-color: #444;       background-image: -webkit-linear-gradient(#444, #333);       background-image: linear-gradient(#444, #333, , , , , , , , );       width: 100%;       height: 20%;       position: absolute;       top: 10%; }     .jp-card .jp-card-back:after {       content: " ";       display: block;       background-color: #FFF;       background-image: -webkit-linear-gradient(#FFF, #FFF);       background-image: linear-gradient(#FFF, #FFF, , , , , , , , );       width: 80%;       height: 16%;       position: absolute;       top: 40%;       left: 2%; }     .jp-card .jp-card-back .jp-card-cvc {       position: absolute;       top: 40%;       left: 85%;       -webkit-transition-delay: 600ms;       -moz-transition-delay: 600ms;       transition-delay: 600ms; }     .jp-card .jp-card-back .jp-card-shiny {       position: absolute;       top: 66%;       left: 2%; }       .jp-card .jp-card-back .jp-card-shiny:after {         content: "This card has been issued by Jesse Pollak and is licensed for anyone to use anywhere for free.\AIt comes with no warranty.\A For support issues, please visit: github.com/jessepollak/card.";         position: absolute;         left: 120%;         top: 5%;         color: white;         font-size: 7px;         width: 230px;         opacity: .5; }   .jp-card.jp-card-identified {     box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); }     .jp-card.jp-card-identified .jp-card-front, .jp-card.jp-card-identified .jp-card-back {       background-color: #000;       background-color: rgba(0, 0, 0, 0.5); }       .jp-card.jp-card-identified .jp-card-front:before, .jp-card.jp-card-identified .jp-card-back:before {         -webkit-transition: all 400ms ease;         -moz-transition: all 400ms ease;         transition: all 400ms ease;         background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 90% 20%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 15% 80%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), -webkit-linear-gradient(-245deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%);         background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 90% 20%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 15% 80%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), linear-gradient(-25deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%);         opacity: 1; }       .jp-card.jp-card-identified .jp-card-front .jp-card-logo, .jp-card.jp-card-identified .jp-card-back .jp-card-logo {         box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3); }     .jp-card.jp-card-identified.no-radial-gradient .jp-card-front:before, .jp-card.jp-card-identified.no-radial-gradient .jp-card-back:before {       background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), -webkit-linear-gradient(-245deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%);       background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), linear-gradient(-25deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%); } ');;
        }, {
            "sassify": 5
        }]
    }, {}, [8]);

}
