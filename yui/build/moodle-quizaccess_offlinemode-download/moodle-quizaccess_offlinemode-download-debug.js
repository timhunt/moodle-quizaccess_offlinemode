YUI.add('moodle-quizaccess_offlinemode-download', function (Y, NAME) {

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
 * Provide a download link to save all the current responses to a file.
 *
 * @module moodle-quizaccess_offlinemode-download
 */

/**
 * Provide a download link to save all the current responses to a file.
 *
 * @class M.quizaccess_offlinemode.download
 */

M.quizaccess_offlinemode = M.quizaccess_offlinemode || {};
M.quizaccess_offlinemode.download = {
    /**
     * The selectors used throughout this class.
     *
     * @property SELECTORS
     * @private
     * @type Object
     * @static
     */
    SELECTORS: {
        QUIZ_FORM:      '#responseform',
        LINK_CONTAINER: '#mod_quiz_navblock .othernav'
    },

    /**
     * The filename to use for the download.
     *
     * @property filename
     * @type String
     * @default null
     */
    filename: null,

    /**
     * A Node reference to the form we are monitoring.
     *
     * @property form
     * @type Node
     * @default null
     */
    form: null,

    /**
     * A Node reference to the download link.
     *
     * @property link
     * @type Node
     * @default null
     */
    link: null,

    /**
     * Initialise the autosave code.
     *
     * @method init
     */
    init: function(filename) {
        this.filename = filename;

        this.form = Y.one(this.SELECTORS.QUIZ_FORM);
        if (!this.form) {
            Y.log('No response form found. Why did you try to set up download?', 'debug', 'moodle-quizaccess_offlinemode-download');
            return;
        }

        var navblock = Y.one(this.SELECTORS.LINK_CONTAINER);
        if (!navblock) {
            Y.log('Navigation block not found. Why did you try to set up download?', 'debug', 'moodle-quizaccess_offlinemode-download');
            return;
        }

        this.link = navblock.appendChild('<a download="' + filename +
                '" href="#">Emergency response export</a>');
        this.link.on('click', this.download_clicked, this);
    },

    /**
     * Handle the link click, and put the data in the URL so that it gets saved.
     *
     * @method download_clicked
     */
    download_clicked: function() {
        if (typeof tinyMCE !== 'undefined') {
            tinyMCE.triggerSave();
        }

        this.link.set('href', 'data:application/octet-stream,' +
                Y.LZString.compress(Y.IO.stringify(this.form)));
    }
};


}, '@VERSION@', {
    "requires": [
        "base",
        "node",
        "event",
        "node-event-delegate",
        "io-form",
        "moodle-quizaccess_offlinemode-lzstring"
    ]
});
