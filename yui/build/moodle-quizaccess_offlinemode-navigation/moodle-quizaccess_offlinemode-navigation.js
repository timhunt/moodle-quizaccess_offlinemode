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
        NAV_BUTTON: '.qnbutton'
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
     * Initialise the navigation code.
     *
     * @method init
     * @param {Number} delay the delay, in seconds, between a change being detected, and
     * a save happening.
     */
    init: function() {
        this.form = Y.one(this.SELECTORS.QUIZ_FORM);
        if (!this.form) {
            return;
        }

        Y.delegate('click', this.nav_button_click, this.SELECTORS.NAV_BLOCK, this.SELECTORS.NAV_BUTTON);

    },

    /**
     * Event handler for when a navigation button is clicked.
     *
     * @method nav_button_click
     * @param {EventFacade} e
     */
    nav_button_click: function(e) {
        // TODO. For now just prevent the quiz's own event handler running.
        e.halt();
    }
};


}, '@VERSION@', {"requires": ["base", "node", "event", "event-valuechange", "node-event-delegate", "io-form"]});
