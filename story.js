// Created with Squiffy 5.1.2
// https://github.com/textadventures/squiffy

(function(){
/* jshint quotmark: single */
/* jshint evil: true */

var squiffy = {};

(function () {
    'use strict';

    squiffy.story = {};

    var initLinkHandler = function () {
        var handleLink = function (link) {
            if (link.hasClass('disabled')) return;
            var passage = link.data('passage');
            var section = link.data('section');
            var rotateAttr = link.attr('data-rotate');
            var sequenceAttr = link.attr('data-sequence');
            if (passage) {
                disableLink(link);
                squiffy.set('_turncount', squiffy.get('_turncount') + 1);
                passage = processLink(passage);
                if (passage) {
                    currentSection.append('<hr/>');
                    squiffy.story.passage(passage);
                }
                var turnPassage = '@' + squiffy.get('_turncount');
                if (turnPassage in squiffy.story.section.passages) {
                    squiffy.story.passage(turnPassage);
                }
                if ('@last' in squiffy.story.section.passages && squiffy.get('_turncount')>= squiffy.story.section.passageCount) {
                    squiffy.story.passage('@last');
                }
            }
            else if (section) {
                currentSection.append('<hr/>');
                disableLink(link);
                section = processLink(section);
                squiffy.story.go(section);
            }
            else if (rotateAttr || sequenceAttr) {
                var result = rotate(rotateAttr || sequenceAttr, rotateAttr ? link.text() : '');
                link.html(result[0].replace(/&quot;/g, '"').replace(/&#39;/g, '\''));
                var dataAttribute = rotateAttr ? 'data-rotate' : 'data-sequence';
                link.attr(dataAttribute, result[1]);
                if (!result[1]) {
                    disableLink(link);
                }
                if (link.attr('data-attribute')) {
                    squiffy.set(link.attr('data-attribute'), result[0]);
                }
                squiffy.story.save();
            }
        };

        squiffy.ui.output.on('click', 'a.squiffy-link', function () {
            handleLink(jQuery(this));
        });

        squiffy.ui.output.on('keypress', 'a.squiffy-link', function (e) {
            if (e.which !== 13) return;
            handleLink(jQuery(this));
        });

        squiffy.ui.output.on('mousedown', 'a.squiffy-link', function (event) {
            event.preventDefault();
        });
    };

    var disableLink = function (link) {
        link.addClass('disabled');
        link.attr('tabindex', -1);
    }
    
    squiffy.story.begin = function () {
        if (!squiffy.story.load()) {
            squiffy.story.go(squiffy.story.start);
        }
    };

    var processLink = function(link) {
		link = String(link);
        var sections = link.split(',');
        var first = true;
        var target = null;
        sections.forEach(function (section) {
            section = section.trim();
            if (startsWith(section, '@replace ')) {
                replaceLabel(section.substring(9));
            }
            else {
                if (first) {
                    target = section;
                }
                else {
                    setAttribute(section);
                }
            }
            first = false;
        });
        return target;
    };

    var setAttribute = function(expr) {
        var lhs, rhs, op, value;
        var setRegex = /^([\w]*)\s*=\s*(.*)$/;
        var setMatch = setRegex.exec(expr);
        if (setMatch) {
            lhs = setMatch[1];
            rhs = setMatch[2];
            if (isNaN(rhs)) {
				if(startsWith(rhs,"@")) rhs=squiffy.get(rhs.substring(1));
                squiffy.set(lhs, rhs);
            }
            else {
                squiffy.set(lhs, parseFloat(rhs));
            }
        }
        else {
			var incDecRegex = /^([\w]*)\s*([\+\-\*\/])=\s*(.*)$/;
            var incDecMatch = incDecRegex.exec(expr);
            if (incDecMatch) {
                lhs = incDecMatch[1];
                op = incDecMatch[2];
				rhs = incDecMatch[3];
				if(startsWith(rhs,"@")) rhs=squiffy.get(rhs.substring(1));
				rhs = parseFloat(rhs);
                value = squiffy.get(lhs);
                if (value === null) value = 0;
                if (op == '+') {
                    value += rhs;
                }
                if (op == '-') {
                    value -= rhs;
                }
				if (op == '*') {
					value *= rhs;
				}
				if (op == '/') {
					value /= rhs;
				}
                squiffy.set(lhs, value);
            }
            else {
                value = true;
                if (startsWith(expr, 'not ')) {
                    expr = expr.substring(4);
                    value = false;
                }
                squiffy.set(expr, value);
            }
        }
    };

    var replaceLabel = function(expr) {
        var regex = /^([\w]*)\s*=\s*(.*)$/;
        var match = regex.exec(expr);
        if (!match) return;
        var label = match[1];
        var text = match[2];
        if (text in squiffy.story.section.passages) {
            text = squiffy.story.section.passages[text].text;
        }
        else if (text in squiffy.story.sections) {
            text = squiffy.story.sections[text].text;
        }
        var stripParags = /^<p>(.*)<\/p>$/;
        var stripParagsMatch = stripParags.exec(text);
        if (stripParagsMatch) {
            text = stripParagsMatch[1];
        }
        var $labels = squiffy.ui.output.find('.squiffy-label-' + label);
        $labels.fadeOut(1000, function() {
            $labels.html(squiffy.ui.processText(text));
            $labels.fadeIn(1000, function() {
                squiffy.story.save();
            });
        });
    };

    squiffy.story.go = function(section) {
        squiffy.set('_transition', null);
        newSection();
        squiffy.story.section = squiffy.story.sections[section];
        if (!squiffy.story.section) return;
        squiffy.set('_section', section);
        setSeen(section);
        var master = squiffy.story.sections[''];
        if (master) {
            squiffy.story.run(master);
            squiffy.ui.write(master.text);
        }
        squiffy.story.run(squiffy.story.section);
        // The JS might have changed which section we're in
        if (squiffy.get('_section') == section) {
            squiffy.set('_turncount', 0);
            squiffy.ui.write(squiffy.story.section.text);
            squiffy.story.save();
        }
    };

    squiffy.story.run = function(section) {
        if (section.clear) {
            squiffy.ui.clearScreen();
        }
        if (section.attributes) {
            processAttributes(section.attributes);
        }
        if (section.js) {
            section.js();
        }
    };

    squiffy.story.passage = function(passageName) {
        var passage = squiffy.story.section.passages[passageName];
        if (!passage) return;
        setSeen(passageName);
        var masterSection = squiffy.story.sections[''];
        if (masterSection) {
            var masterPassage = masterSection.passages[''];
            if (masterPassage) {
                squiffy.story.run(masterPassage);
                squiffy.ui.write(masterPassage.text);
            }
        }
        var master = squiffy.story.section.passages[''];
        if (master) {
            squiffy.story.run(master);
            squiffy.ui.write(master.text);
        }
        squiffy.story.run(passage);
        squiffy.ui.write(passage.text);
        squiffy.story.save();
    };

    var processAttributes = function(attributes) {
        attributes.forEach(function (attribute) {
            if (startsWith(attribute, '@replace ')) {
                replaceLabel(attribute.substring(9));
            }
            else {
                setAttribute(attribute);
            }
        });
    };

    squiffy.story.restart = function() {
        if (squiffy.ui.settings.persist && window.localStorage) {
            var keys = Object.keys(localStorage);
            jQuery.each(keys, function (idx, key) {
                if (startsWith(key, squiffy.story.id)) {
                    localStorage.removeItem(key);
                }
            });
        }
        else {
            squiffy.storageFallback = {};
        }
        if (squiffy.ui.settings.scroll === 'element') {
            squiffy.ui.output.html('');
            squiffy.story.begin();
        }
        else {
            location.reload();
        }
    };

    squiffy.story.save = function() {
        squiffy.set('_output', squiffy.ui.output.html());
    };

    squiffy.story.load = function() {
        var output = squiffy.get('_output');
        if (!output) return false;
        squiffy.ui.output.html(output);
        currentSection = jQuery('#' + squiffy.get('_output-section'));
        squiffy.story.section = squiffy.story.sections[squiffy.get('_section')];
        var transition = squiffy.get('_transition');
        if (transition) {
            eval('(' + transition + ')()');
        }
        return true;
    };

    var setSeen = function(sectionName) {
        var seenSections = squiffy.get('_seen_sections');
        if (!seenSections) seenSections = [];
        if (seenSections.indexOf(sectionName) == -1) {
            seenSections.push(sectionName);
            squiffy.set('_seen_sections', seenSections);
        }
    };

    squiffy.story.seen = function(sectionName) {
        var seenSections = squiffy.get('_seen_sections');
        if (!seenSections) return false;
        return (seenSections.indexOf(sectionName) > -1);
    };
    
    squiffy.ui = {};

    var currentSection = null;
    var screenIsClear = true;
    var scrollPosition = 0;

    var newSection = function() {
        if (currentSection) {
            disableLink(jQuery('.squiffy-link', currentSection));
        }
        var sectionCount = squiffy.get('_section-count') + 1;
        squiffy.set('_section-count', sectionCount);
        var id = 'squiffy-section-' + sectionCount;
        currentSection = jQuery('<div/>', {
            id: id,
        }).appendTo(squiffy.ui.output);
        squiffy.set('_output-section', id);
    };

    squiffy.ui.write = function(text) {
        screenIsClear = false;
        scrollPosition = squiffy.ui.output.height();
        currentSection.append(jQuery('<div/>').html(squiffy.ui.processText(text)));
        squiffy.ui.scrollToEnd();
    };

    squiffy.ui.clearScreen = function() {
        squiffy.ui.output.html('');
        screenIsClear = true;
        newSection();
    };

    squiffy.ui.scrollToEnd = function() {
        var scrollTo, currentScrollTop, distance, duration;
        if (squiffy.ui.settings.scroll === 'element') {
            scrollTo = squiffy.ui.output[0].scrollHeight - squiffy.ui.output.height();
            currentScrollTop = squiffy.ui.output.scrollTop();
            if (scrollTo > currentScrollTop) {
                distance = scrollTo - currentScrollTop;
                duration = distance / 0.4;
                squiffy.ui.output.stop().animate({ scrollTop: scrollTo }, duration);
            }
        }
        else {
            scrollTo = scrollPosition;
            currentScrollTop = Math.max(jQuery('body').scrollTop(), jQuery('html').scrollTop());
            if (scrollTo > currentScrollTop) {
                var maxScrollTop = jQuery(document).height() - jQuery(window).height();
                if (scrollTo > maxScrollTop) scrollTo = maxScrollTop;
                distance = scrollTo - currentScrollTop;
                duration = distance / 0.5;
                jQuery('body,html').stop().animate({ scrollTop: scrollTo }, duration);
            }
        }
    };

    squiffy.ui.processText = function(text) {
        function process(text, data) {
            var containsUnprocessedSection = false;
            var open = text.indexOf('{');
            var close;
            
            if (open > -1) {
                var nestCount = 1;
                var searchStart = open + 1;
                var finished = false;
             
                while (!finished) {
                    var nextOpen = text.indexOf('{', searchStart);
                    var nextClose = text.indexOf('}', searchStart);
         
                    if (nextClose > -1) {
                        if (nextOpen > -1 && nextOpen < nextClose) {
                            nestCount++;
                            searchStart = nextOpen + 1;
                        }
                        else {
                            nestCount--;
                            searchStart = nextClose + 1;
                            if (nestCount === 0) {
                                close = nextClose;
                                containsUnprocessedSection = true;
                                finished = true;
                            }
                        }
                    }
                    else {
                        finished = true;
                    }
                }
            }
            
            if (containsUnprocessedSection) {
                var section = text.substring(open + 1, close);
                var value = processTextCommand(section, data);
                text = text.substring(0, open) + value + process(text.substring(close + 1), data);
            }
            
            return (text);
        }

        function processTextCommand(text, data) {
            if (startsWith(text, 'if ')) {
                return processTextCommand_If(text, data);
            }
            else if (startsWith(text, 'else:')) {
                return processTextCommand_Else(text, data);
            }
            else if (startsWith(text, 'label:')) {
                return processTextCommand_Label(text, data);
            }
            else if (/^rotate[: ]/.test(text)) {
                return processTextCommand_Rotate('rotate', text, data);
            }
            else if (/^sequence[: ]/.test(text)) {
                return processTextCommand_Rotate('sequence', text, data);   
            }
            else if (text in squiffy.story.section.passages) {
                return process(squiffy.story.section.passages[text].text, data);
            }
            else if (text in squiffy.story.sections) {
                return process(squiffy.story.sections[text].text, data);
            }
			else if (startsWith(text,'@') && !startsWith(text,'@replace')) {
				processAttributes(text.substring(1).split(","));
				return "";
			}
            return squiffy.get(text);
        }

        function processTextCommand_If(section, data) {
            var command = section.substring(3);
            var colon = command.indexOf(':');
            if (colon == -1) {
                return ('{if ' + command + '}');
            }

            var text = command.substring(colon + 1);
            var condition = command.substring(0, colon);
			condition = condition.replace("<", "&lt;");
            var operatorRegex = /([\w ]*)(=|&lt;=|&gt;=|&lt;&gt;|&lt;|&gt;)(.*)/;
            var match = operatorRegex.exec(condition);

            var result = false;

            if (match) {
                var lhs = squiffy.get(match[1]);
                var op = match[2];
                var rhs = match[3];

				if(startsWith(rhs,'@')) rhs=squiffy.get(rhs.substring(1));
				
                if (op == '=' && lhs == rhs) result = true;
                if (op == '&lt;&gt;' && lhs != rhs) result = true;
                if (op == '&gt;' && lhs > rhs) result = true;
                if (op == '&lt;' && lhs < rhs) result = true;
                if (op == '&gt;=' && lhs >= rhs) result = true;
                if (op == '&lt;=' && lhs <= rhs) result = true;
            }
            else {
                var checkValue = true;
                if (startsWith(condition, 'not ')) {
                    condition = condition.substring(4);
                    checkValue = false;
                }

                if (startsWith(condition, 'seen ')) {
                    result = (squiffy.story.seen(condition.substring(5)) == checkValue);
                }
                else {
                    var value = squiffy.get(condition);
                    if (value === null) value = false;
                    result = (value == checkValue);
                }
            }

            var textResult = result ? process(text, data) : '';

            data.lastIf = result;
            return textResult;
        }

        function processTextCommand_Else(section, data) {
            if (!('lastIf' in data) || data.lastIf) return '';
            var text = section.substring(5);
            return process(text, data);
        }

        function processTextCommand_Label(section, data) {
            var command = section.substring(6);
            var eq = command.indexOf('=');
            if (eq == -1) {
                return ('{label:' + command + '}');
            }

            var text = command.substring(eq + 1);
            var label = command.substring(0, eq);

            return '<span class="squiffy-label-' + label + '">' + process(text, data) + '</span>';
        }

        function processTextCommand_Rotate(type, section, data) {
            var options;
            var attribute = '';
            if (section.substring(type.length, type.length + 1) == ' ') {
                var colon = section.indexOf(':');
                if (colon == -1) {
                    return '{' + section + '}';
                }
                options = section.substring(colon + 1);
                attribute = section.substring(type.length + 1, colon);
            }
            else {
                options = section.substring(type.length + 1);
            }
            var rotation = rotate(options.replace(/"/g, '&quot;').replace(/'/g, '&#39;'));
            if (attribute) {
                squiffy.set(attribute, rotation[0]);
            }
            return '<a class="squiffy-link" data-' + type + '="' + rotation[1] + '" data-attribute="' + attribute + '" role="link">' + rotation[0] + '</a>';
        }

        var data = {
            fulltext: text
        };
        return process(text, data);
    };

    squiffy.ui.transition = function(f) {
        squiffy.set('_transition', f.toString());
        f();
    };

    squiffy.storageFallback = {};

    squiffy.set = function(attribute, value) {
        if (typeof value === 'undefined') value = true;
        if (squiffy.ui.settings.persist && window.localStorage) {
            localStorage[squiffy.story.id + '-' + attribute] = JSON.stringify(value);
        }
        else {
            squiffy.storageFallback[attribute] = JSON.stringify(value);
        }
        squiffy.ui.settings.onSet(attribute, value);
    };

    squiffy.get = function(attribute) {
        var result;
        if (squiffy.ui.settings.persist && window.localStorage) {
            result = localStorage[squiffy.story.id + '-' + attribute];
        }
        else {
            result = squiffy.storageFallback[attribute];
        }
        if (!result) return null;
        return JSON.parse(result);
    };

    var startsWith = function(string, prefix) {
        return string.substring(0, prefix.length) === prefix;
    };

    var rotate = function(options, current) {
        var colon = options.indexOf(':');
        if (colon == -1) {
            return [options, current];
        }
        var next = options.substring(0, colon);
        var remaining = options.substring(colon + 1);
        if (current) remaining += ':' + current;
        return [next, remaining];
    };

    var methods = {
        init: function (options) {
            var settings = jQuery.extend({
                scroll: 'body',
                persist: true,
                restartPrompt: true,
                onSet: function (attribute, value) {}
            }, options);

            squiffy.ui.output = this;
            squiffy.ui.restart = jQuery(settings.restart);
            squiffy.ui.settings = settings;

            if (settings.scroll === 'element') {
                squiffy.ui.output.css('overflow-y', 'auto');
            }

            initLinkHandler();
            squiffy.story.begin();
            
            return this;
        },
        get: function (attribute) {
            return squiffy.get(attribute);
        },
        set: function (attribute, value) {
            squiffy.set(attribute, value);
        },
        restart: function () {
            if (!squiffy.ui.settings.restartPrompt || confirm('Are you sure you want to restart?')) {
                squiffy.story.restart();
            }
        }
    };

    jQuery.fn.squiffy = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions]
                .apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof methodOrOptions === 'object' || ! methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            jQuery.error('Method ' +  methodOrOptions + ' does not exist');
        }
    };
})();

var get = squiffy.get;
var set = squiffy.set;


squiffy.story.start = '_default';
squiffy.story.id = 'b932956332';
squiffy.story.sections = {
	'_default': {
		'text': "<!-- California (c) 2018 Baltasar MIT License baltasarq@gmail.com -->\n<div id=\"dvDataHint\" style=\"display:none\">\n<a href=\"#\" onclick=\"javascript:document.getElementById( 'dvData' ).style.display='block';document.getElementById( 'dvDataHint' ).style.display='none'\">\n    <svg width=\"16\" height=\"16\">\n            <line x1=\"8\" y1=\"0\" x2=\"8\" y2=\"3\" stroke=\"blue\" stroke-width=\"4\" fill=\"blue\" />\n            <line x1=\"8\" y1=\"6\" x2=\"8\" y2=\"16\" stroke=\"blue\" stroke-width=\"4\" fill=\"blue\" />\n            i\n        </svg>\n    </a></div>\n\n<div id=\"dvData\">\n    <table width=\"100%\">\n    <tr>\n    <b><a target=\"_blank\"\n            href=\"http://caad.es/baltasarq/if/california\">California</a></b></tr>\n    <tr><td width=\"90%\">\n        <a target=\"_blank\"\n            href=\"http://caad.es/baltasarq/\">baltasarq at caad.es</a>\n        </td>\n    <td>\n        <b><a href=\"#\" onclick=\"javascript:document.getElementById( 'dvData' ).style.display='none';document.getElementById( 'dvDataHint' ).style.display='block'\">\n        <svg width=\"16\" height=\"16\">\n            <line x1=\"0\" y1=\"0\" x2=\"16\" y2=\"16\" stroke=\"blue\" stroke-width=\"4\" fill=\"blue\" />\n            <line x1=\"16\" y1=\"0\" x2=\"0\" y2=\"16\" stroke=\"blue\" stroke-width=\"4\" fill=\"blue\" />\n            X\n        </svg>\n        </a></b>\n    </td>\n    </tr>\n    <tr><td>\n        (c) 2018 Baltasar MIT License baltasarq@gmail.com\n    </td></tr>\n    <tr><td>\n        <a target=\"_blank\" href=\"http://textadventures.co.uk/squiffy\">made with Squiffy</a>\n    </td></tr>\n    </table>\n</div>\n\n\n<!--------------------------------------------------- Start --------->\n<h1 id=\"california\">California</h1>\n<!-- <p align=\"center\"><img src=\"Res/road.jpg\"></p> -->\n<p align=\"center\"><img src=\"data:image/jpeg;base64,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\"></p>\n\n<p>Enciendes <a class=\"squiffy-link link-passage\" data-passage=\"CarRadio\" role=\"link\" tabindex=\"0\">la radio del coche</a>, conduciendo por una carretera serpenteante. Cansado, <a class=\"squiffy-link link-section\" data-section=\"PL4\" role=\"link\" tabindex=\"0\">debes parar por esta noche</a>, y ves en la distancia el cartel de un <a class=\"squiffy-link link-passage\" data-passage=\"ViewOfMotel\" role=\"link\" tabindex=\"0\">motel</a>, cimbreante.</p>",
		'passages': {
			'CarRadio': {
				'text': "<p>&quot;<em>On a dark desert highway, cool wind in my hair.\nWarm smell of colitas, rising up through the air.\nUp ahead in the distance, I saw a shimmering light.\nMy head grew heavy and my sight grew dim,\nI had to stop for the night.</em>&quot;</p>\n<!------------------------------------------ View of motel --------->",
			},
			'ViewOfMotel': {
				'text': "<p align=\"center\"><img src=\"Res/motel.jpg\"></p>\n\n<p>Un motel con un cartel con la luz encendida destaca ahora mismo en la distancia.</p>\n<!-------------------------------------- Back to the road --------->",
			},
		},
	},
	'Road': {
		'text': "<p>Yo! escaped.</p>\n<!--------------------------------------------------- PL4 --------->",
		'passages': {
		},
	},
	'PL4': {
		'text': "<h2 id=\"aparcamiento-frente-a-la-recepci-n\">Aparcamiento frente a la recepción</h2>\n<p><a class=\"squiffy-link link-section\" data-section=\"Reception\" role=\"link\" tabindex=\"0\">Reception</a>.\n<a class=\"squiffy-link link-section\" data-section=\"PL3\" role=\"link\" tabindex=\"0\">PL3</a>.\n<a class=\"squiffy-link link-section\" data-section=\"Road\" role=\"link\" tabindex=\"0\">Road</a>.</p>\n<!--------------------------------------------------- PL3 --------->",
		'passages': {
		},
	},
	'PL3': {
		'text': "<h2 id=\"aparcamiento-frente-a-la-habitaci-n-11-\">Aparcamiento frente a la habitación 11.</h2>\n<p><a class=\"squiffy-link link-section\" data-section=\"PL2\" role=\"link\" tabindex=\"0\">PL2</a>.\n<a class=\"squiffy-link link-section\" data-section=\"PL4\" role=\"link\" tabindex=\"0\">PL4</a>.</p>\n<!--------------------------------------------------- PL2 --------->",
		'passages': {
		},
	},
	'PL2': {
		'text': "<h2 id=\"aparcamiento-frente-a-la-habitaci-n-12-\">Aparcamiento frente a la habitación 12.</h2>\n<p><a class=\"squiffy-link link-section\" data-section=\"PL3\" role=\"link\" tabindex=\"0\">PL3</a>.\n<a class=\"squiffy-link link-section\" data-section=\"PL1\" role=\"link\" tabindex=\"0\">PL1</a>.</p>\n<!--------------------------------------------------- PL1 --------->",
		'passages': {
		},
	},
	'PL1': {
		'text': "<h2 id=\"aparcamiento-frente-a-la-habitaci-n-13-\">Aparcamiento frente a la habitación 13.</h2>\n<p><a class=\"squiffy-link link-section\" data-section=\"PL2\" role=\"link\" tabindex=\"0\">PL2</a>.\n<a class=\"squiffy-link link-section\" data-section=\"PL0\" role=\"link\" tabindex=\"0\">PL0</a>.</p>\n<!--------------------------------------------------- PL0 --------->",
		'passages': {
		},
	},
	'PL0': {
		'text': "<h2 id=\"aparcamiento-frente-a-la-habitaci-n-14-\">Aparcamiento frente a la habitación 14.</h2>\n<p><a class=\"squiffy-link link-section\" data-section=\"PL1\" role=\"link\" tabindex=\"0\">PL1</a>.\n<a class=\"squiffy-link link-section\" data-section=\"SouthCorner\" role=\"link\" tabindex=\"0\">SouthCorner</a>.</p>\n<!------------------------------------------ South corner --------->",
		'passages': {
		},
	},
	'SouthCorner': {
		'text': "<h2 id=\"esquina\">Esquina</h2>\n<p><a class=\"squiffy-link link-section\" data-section=\"PL0\" role=\"link\" tabindex=\"0\">PL0</a>.\n<a class=\"squiffy-link link-section\" data-section=\"IceMachine\" role=\"link\" tabindex=\"0\">IceMachine</a>.</p>\n<!----------------------------------------- Ice machine ----------->",
		'passages': {
		},
	},
	'IceMachine': {
		'text': "<p><a class=\"squiffy-link link-section\" data-section=\"SouthCorner\" role=\"link\" tabindex=\"0\">SouthCorner</a>.\n<a class=\"squiffy-link link-section\" data-section=\"NorthCorner\" role=\"link\" tabindex=\"0\">NorthCorner</a>.</p>\n<!------------------------------------------ North corner --------->",
		'passages': {
		},
	},
	'NorthCorner': {
		'text': "<p><a class=\"squiffy-link link-section\" data-section=\"Garbage\" role=\"link\" tabindex=\"0\">Garbage</a>.\n<a class=\"squiffy-link link-section\" data-section=\"IceMachine\" role=\"link\" tabindex=\"0\">IceMachine</a>.</p>\n<!------------------------------------------------ Garbage --------->",
		'passages': {
		},
	},
	'Garbage': {
		'text': "<p><a class=\"squiffy-link link-section\" data-section=\"NorthCorner\" role=\"link\" tabindex=\"0\">NorthCorner</a>.</p>\n<!---------------------------------------------- Reception --------->",
		'passages': {
		},
	},
	'Reception': {
		'text': "<p>La <a class=\"squiffy-link link-passage\" data-passage=\"WomanDesc\" role=\"link\" tabindex=\"0\">mujer</a> que lleva el hotel, alerta, espera desde el dintel de la puerta. <a class=\"squiffy-link link-section\" data-section=\"PL4\" role=\"link\" tabindex=\"0\">PL4</a>. <a class=\"squiffy-link link-section\" data-section=\"Hall\" role=\"link\" tabindex=\"0\">Hall</a>.</p>\n<p>Un equipo de música reproducía una agradable <a class=\"squiffy-link link-passage\" data-passage=\"RadioEntrance\" role=\"link\" tabindex=\"0\">melodía</a>.</p>",
		'passages': {
			'WomanDesc': {
				'text': "<p>Su belleza hostiga tu mente, es ciertamente una mujer hermosa. Confuso por su presencia, apenas puedes pensar en otra cosa.</p>",
			},
			'RadioEntrance': {
				'text': "<p>&quot;<em>There she stood in the doorway;\nI heard the mission bell.\nAnd I was thinking to myself:\n&#39;This could be heaven or this could be Hell.&#39;</em>&quot;</p>\n<!--------------------------------------------------- Hall --------->",
			},
		},
	},
	'Hall': {
		'text': "<p><a class=\"squiffy-link link-section\" data-section=\"Corridor4\" role=\"link\" tabindex=\"0\">Corridor4</a>. <a class=\"squiffy-link link-section\" data-section=\"Reception\" role=\"link\" tabindex=\"0\">Reception</a>. <a class=\"squiffy-link link-section\" data-section=\"Dinner\" role=\"link\" tabindex=\"0\">Dinner</a>.</p>\n<!--------------------------------------------------- Dinner ------->",
		'passages': {
		},
	},
	'Dinner': {
		'text': "<p><a class=\"squiffy-link link-section\" data-section=\"Hall\" role=\"link\" tabindex=\"0\">Hall</a>.</p>\n<!--------------------------------------------- Corridor 4 --------->",
		'passages': {
		},
	},
	'Corridor4': {
		'text': "<p>In front of room 11. <a class=\"squiffy-link link-section\" data-section=\"Hall\" role=\"link\" tabindex=\"0\">Hall</a>. <a class=\"squiffy-link link-section\" data-section=\"Corridor3\" role=\"link\" tabindex=\"0\">Corridor3</a>.</p>\n<!--------------------------------------------- Corridor 3 --------->",
		'passages': {
		},
	},
	'Corridor3': {
		'text': "<p>In front of room 12. <a class=\"squiffy-link link-section\" data-section=\"Corridor4\" role=\"link\" tabindex=\"0\">Corridor4</a>. <a class=\"squiffy-link link-section\" data-section=\"Corridor2\" role=\"link\" tabindex=\"0\">Corridor2</a>.</p>\n<!--------------------------------------------- Corridor 2 --------->",
		'passages': {
		},
	},
	'Corridor2': {
		'text': "<p>In front of room 13. <a class=\"squiffy-link link-section\" data-section=\"Corridor3\" role=\"link\" tabindex=\"0\">Corridor3</a>. <a class=\"squiffy-link link-section\" data-section=\"Corridor1\" role=\"link\" tabindex=\"0\">Corridor1</a>.</p>\n<!--------------------------------------------- Corridor 1 --------->",
		'passages': {
		},
	},
	'Corridor1': {
		'text': "<p>In front of room 14. <a class=\"squiffy-link link-section\" data-section=\"Corridor2\" role=\"link\" tabindex=\"0\">Corridor2</a>.</p>",
		'passages': {
		},
	},
}
})();