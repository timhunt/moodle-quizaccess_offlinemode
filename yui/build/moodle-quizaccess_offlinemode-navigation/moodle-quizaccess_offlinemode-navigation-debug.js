YUI.add('moodle-quizaccess_offlinemode-navigation', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.


/**
 * fault-tolerant mode for quiz attempts.
 *
 * @module moodle-quizaccess_offlinemode-navigation
 */

/**
 * Auto-save functionality for during quiz attempts.
 *
 * @class M.quizaccess_offlinemode.navigation
 */

M.quizaccess_offlinemode = M.quizaccess_offlinemode || {};
M.quizaccess_offlinemode.navigation = {
    /**
     * The selectors used throughout this class.
     *
     * @property SELECTORS
     * @private
     * @type Object
     * @static
     */
    SELECTORS: {
        QUIZ_FORM:            '#responseform',
        NAV_BLOCK:            '#mod_quiz_navblock',
        NAV_BUTTON:           '.qnbutton',
        FINISH_LINK:          '.endtestlink',
        NEXT_BUTTON:          'input[name=next]',
        SUMMARY_TABLE:        '.quizsummaryofattempt',
        SUMMARY_TABLE_LINK:   'tr > td.c0 > a',
        SUMMARY_ROW:          '.quizsummaryofattempt tr.quizsummary', // Must have slot appended.
        SUMMARY_LINK_IN_ROW:  ' > td.c0 > a',
        FLAG_ICON_IN_ROW:     ' .questionflag',
        SUMMARY_PAGE_BUTTON:  '#quizaccess_offlinemode-attempt_page--1 .submitbtns input[type=submit]',
        PAGE_DIV_ROOT:        '#quizaccess_offlinemode-attempt_page-',
        ALL_PAGE_DIVS:        'div[id|=quizaccess_offlinemode-attempt_page]',
        THIS_PAGE_INPUT:      'input#followingpage',
        NEXT_PAGE_INPUT:      'input[name=nextpage]',
        FINISH_ATTEMPT_INPUT: 'input[name=finishattempt]'
    },

    /**
     * A Node reference to the main quiz form.
     *
     * @property form
     * @type Node
     * @default null
     */
    form: null,

    /**
     * The page we are currently on.
     *
     * @property currentpage
     * @type Number
     */
    currentpage: null,

    /**
     * The number of the last page.
     *
     * @property lastpage
     * @type Number
     */
    lastpage: null,

    /**
     * Our best guess at the size of any floating top bar.
     *
     * @property extraspaceattop
     * @type Number
     */
    extraspaceattop: 0,

    /**
     * Initialise the navigation code.
     *
     * @method init
     * @param {Number} delay the delay, in seconds, between a change being detected, and
     * a save happening.
     */
    init: function(currentpage) {
        this.form = Y.one(this.SELECTORS.QUIZ_FORM);
        if (!this.form) {
            Y.log('Response form not found.', 'debug', 'moodle-quizaccess_offlinemode-navigation');
            return;
        }

        Y.on('load', this.preload_images, window, this);

        Y.all('textarea').each(function (textarea) {
            // This may appear to be a no-op, but in fact, it is required so
            // that the text-areas remember their size even if they are hiddens,
            // and hence so that TinyMCE initialises itself at the right size.
            textarea.setStyle('height', textarea.getStyle('height'));
        });
        Y.all(this.SELECTORS.ALL_PAGE_DIVS).each(function(element) {
                    var pageno;
                    var matches = element.get('id').match(/quizaccess_offlinemode-attempt_page-(\d+)/);
                    if (matches) {
                        pageno = +matches[1];
                        if (pageno > this.lastpage) {
                            this.lastpage = pageno;
                        }
                    }
                }, this);

        Y.all(this.SELECTORS.ALL_PAGE_DIVS).addClass('hidden');
        this.navigate_to_page(+currentpage);
        Y.all(this.SELECTORS.ALL_PAGE_DIVS).removeClass('quiz-loading-hide');

        Y.delegate('click', this.nav_button_click, this.SELECTORS.NAV_BLOCK, this.SELECTORS.NAV_BUTTON, this);
        Y.delegate('click', this.nav_button_click, this.SELECTORS.SUMMARY_TABLE, this.SELECTORS.SUMMARY_TABLE_LINK, this);

        // We need to remove the standard 'Finish attempt...' click hander before we add our own.
        Y.one(this.SELECTORS.FINISH_LINK).detach('click');
        Y.one(this.SELECTORS.FINISH_LINK).on('click', this.finish_attempt_click, this);

        Y.one(this.SELECTORS.NEXT_BUTTON).on('click', this.next_button_click, this);
        Y.one(this.SELECTORS.SUMMARY_PAGE_BUTTON).on('click', this.summary_button_click, this);

        var topbar = Y.one('.navbar-fixed-top');
        if (topbar) {
            this.extraspaceattop = topbar.get('offsetHeight');
        }

        if (M.core_question_flags) {
            M.core_question_flags.add_listener(Y.bind(this.update_flag_on_summary_page, this));
        }

        Y.log('Initialised fault-tolerant quiz mode.', 'debug', 'moodle-quizaccess_offlinemode-navigation');
    },

    /**
     * Pre-load all the images referred to on the page.
     */
    preload_images: function() {
        var alreadyLoaded = {};

        function preload_image(url) {
            alreadyLoaded[url] = true;
            document.createElement('img').src = url;
        }

        preload_image(M.util.image_url('i/flagged'));
        preload_image(M.util.image_url('i/unflagged'));
        preload_image(M.util.image_url('i/loading_small'));
        Y.all('img').each(function(image) {
            var url = image.get('src');
            if (alreadyLoaded[url]) {
                return;
            }
            preload_image(url);
        });
    },


    /**
     * Event handler for when a navigation button is clicked.
     *
     * @method nav_button_click
     * @param {EventFacade} e
     */
    nav_button_click: function(e) {
        // Prevent the quiz's own event handler running.
        e.halt();
        if (!e.currentTarget.hasAttribute('href')) {
            return;
        }

        this.navigate_to_page(this.page_number_from_link(e.currentTarget));
        this.scroll_to_fragment_from_link(e.currentTarget);
    },

    /**
     * Event handler for when the 'Finish attempt...' link is clicked.
     *
     * @method finish_attempt_click
     * @param {EventFacade} e
     */
    finish_attempt_click: function(e) {
        e.halt(true);
        this.navigate_to_page(-1);
    },

    /**
     * Event handler for when the next page button is clicked.
     *
     * @method next_button_click
     * @param {EventFacade} e
     */
    next_button_click: function(e) {
        e.halt();
        this.navigate_to_page(+Y.one(this.SELECTORS.NEXT_PAGE_INPUT).get('value'));
    },

    /**
     * Event handler for when a button on the summary page is clicked.
     *
     * @method summary_button_click
     * @param {EventFacade} e
     */
    summary_button_click: function(e) {
        if (e.currentTarget.siblings(this.SELECTORS.FINISH_ATTEMPT_INPUT).empty()) {
            // Return to attempt button pressed. (Submit and finished is handled in the autosave module.)
            e.halt();
            this.navigate_to_page(+Y.one(this.SELECTORS.THIS_PAGE_INPUT).get('value'));
        }
    },

    /**
     * Get the page number from a navigation link.
     *
     * @method page_number_from_link
     * @param {Node} The <a> element of a navigation link.
     * @return Number the page number.
     */
    page_number_from_link: function(anchor) {
        var dataValue = anchor.getData('quiz-page');
        if (dataValue !== undefined) {
            return +dataValue;
        }

        if (anchor.hasAttribute('href')) {
            var pageidmatch = anchor.get('href').match(/page=(\d+)/);
            if (pageidmatch) {
                return +pageidmatch[1];
            }
        }

        return 0;
    },

    scroll_to_fragment_from_link: function(anchor) {
        var fragmentidmatch = anchor.get('href').match(/#(?:q\d+)?$/);
        if (!fragmentidmatch) {
            return;
        }

        // Update the URL.
        if (window.history.replaceState) {
            var url = window.location.href;
            if (url.match(/#[^#]*$/)) {
                url = url.replace(/#[^#]*$/, fragmentidmatch[0]);
            } else {
                url += fragmentidmatch[0];
            }
            window.history.replaceState(null, '', url);
        }

        if (fragmentidmatch[0] === '#') {
            window.scrollTo(0, 0);
        }

        var target = Y.one(fragmentidmatch[0]);
        if (target) {
            window.scrollTo(0, target.getY() - this.extraspaceattop);
        }
    },

    /**
     * Change the display to show another page.
     *
     * @method nav_button_click
     * @param {Number} pageno the page to navigate to.
     */
    navigate_to_page: function(pageno) {
        if (pageno === this.currentpage) {
            return;
        }

        // Show or hide the right content.
        if (this.currentpage !== null) {
            Y.one(this.SELECTORS.PAGE_DIV_ROOT + this.currentpage).addClass('hidden');
        }
        if (pageno === -1) {
            Y.one(this.SELECTORS.QUIZ_FORM).addClass('hidden');
        } else {
            Y.one(this.SELECTORS.QUIZ_FORM).removeClass('hidden');
        }
        Y.one(this.SELECTORS.PAGE_DIV_ROOT + pageno).removeClass('hidden');

        // Update the navigation.
        Y.one(this.SELECTORS.NAV_BLOCK).all(this.SELECTORS.NAV_BUTTON).each(function (node) {
                    if (this.page_number_from_link(node) === pageno) {
                        node.addClass('thispage');
                    } else {
                        node.removeClass('thispage');
                    }
                }, this);

        // Update the hidden form fields.
        if (pageno >= 0) {
            Y.one(this.SELECTORS.THIS_PAGE_INPUT).set('value', pageno);
            if (pageno < this.lastpage) {
                Y.one(this.SELECTORS.NEXT_PAGE_INPUT).set('value', pageno + 1);
            } else {
                Y.one(this.SELECTORS.NEXT_PAGE_INPUT).set('value', -1);
            }
        }

        // Update the URL.
        if (window.history.replaceState) {
            var queryString = window.location.search;
            if (queryString.match(/\bpage=-?\d+/)) {
                queryString = queryString.replace(/\bpage=-?\d+/, 'page=' + pageno);
            } else {
                queryString += '&page=' + pageno;
            }
            window.history.replaceState(null, '', M.cfg.wwwroot + '/mod/quiz/accessrule/offlinemode/attempt.php' + queryString);
        }

        this.currentpage = pageno;

        window.scrollTo(0, 0);
    },

    update_flag_on_summary_page: function(notused, slot, newstate) {
        if (newstate === '1') {
            var icon = Y.Node.create('<img class="questionflag icon-post" />').setAttrs({
                'src':   M.util.image_url('i/flagged', 'core'),
                'title': M.util.get_string('flagged', 'question')
            });
            Y.one(this.SELECTORS.SUMMARY_ROW + slot + this.SELECTORS.SUMMARY_LINK_IN_ROW)
                    .append(icon);
        } else {
            Y.all(this.SELECTORS.SUMMARY_ROW + slot + this.SELECTORS.FLAG_ICON_IN_ROW).remove();
        }
    }
};


}, '@VERSION@', {
    "requires": [
        "base",
        "node",
        "event",
        "event-valuechange",
        "node-event-delegate",
        "io-form",
        "moodle-core-notification-confirm"
    ]
});
