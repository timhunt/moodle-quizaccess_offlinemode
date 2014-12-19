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
 * Offline mode for quiz attempts.
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
        QUIZ_FORM:  '#responseform',
        NAV_BLOCK:  '#mod_quiz_navblock',
        NAV_BUTTON: '.qnbutton',
        FINISH_LINK: '.endtestlink',
        PAGE_DIV_ROOT: '#quizaccess_offlinemode-attempt_page-',
        ALL_PAGE_DIVS: 'div[id|=quizaccess_offlinemode-attempt_page]'
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

        Y.all(this.SELECTORS.ALL_PAGE_DIVS).addClass('hidden');
        this.navigate_to_page(+currentpage);

        Y.delegate('click', this.nav_button_click, this.SELECTORS.NAV_BLOCK, this.SELECTORS.NAV_BUTTON, this);

        // We need to remove the standard 'Finish attempt...' click hander before we add our own.
        Y.one(this.SELECTORS.FINISH_LINK).detach('click');
        Y.one(this.SELECTORS.FINISH_LINK).on('click', this.finish_attempt_click, this);

        Y.log('Initialised offline quiz mode.', 'debug', 'moodle-quizaccess_offlinemode-navigation');
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

        this.navigate_to_page(this.page_number_from_link(e.currentTarget));
    },

    /**
     * Event handler for when the 'Finish attempt...' link is clicked.
     *
     * @method finish_attempt_click
     * @param {EventFacade} e
     */
    finish_attempt_click: function(e) {
        // Prevent the quiz's own event handler running.
        e.halt(true);

        this.navigate_to_page(-1);
    },

    /**
     * Get the page number from a navigation link.
     *
     * @method page_number_from_link
     * @param {Node} The <a> element of a navigation link.
     * @return Number the page number.
     */
    page_number_from_link: function(anchor) {
        var pageidmatch = anchor.get('href').match(/page=(\d+)/);
        if (pageidmatch) {
            return +pageidmatch[1];
        } else {
            return 0;
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

        if (this.currentpage !== null) {
            Y.one(this.SELECTORS.PAGE_DIV_ROOT + this.currentpage).addClass('hidden');
        }
        if (pageno === -1) {
            Y.one(this.SELECTORS.QUIZ_FORM).addClass('hidden');
        } else {
            Y.one(this.SELECTORS.QUIZ_FORM).removeClass('hidden');
        }
        Y.one(this.SELECTORS.PAGE_DIV_ROOT + pageno).removeClass('hidden');
        Y.one(this.SELECTORS.NAV_BLOCK).all(this.SELECTORS.NAV_BUTTON).each(function (node) {
                    if (this.page_number_from_link(node) === pageno) {
                        node.addClass('thispage');
                    } else {
                        node.removeClass('thispage');
                    }
                }, this);
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
    }
};
