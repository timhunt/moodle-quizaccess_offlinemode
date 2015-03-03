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
        DOWNLOAD_CONFIRM_MESSAGE: '#quiz-download-confirm-message',
        QUIZ_FORM:                '#responseform'
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
     * The pulic key to be used to encrypt the responses before download.
     *
     * @property publicKey
     * @type String
     * @default null
     */
    publicKey: null,

    /**
     * A Node reference to the form we are monitoring.
     *
     * @property form
     * @type Node
     * @default null
     */
    form: null,

    /**
     * Initialise the autosave code.
     *
     * @method init
     */
    init: function(filename, publicKey) {
        this.filename = filename;
        this.publicKey = publicKey;

        Y.Crypto.sjcl.random.startCollectors();
        Y.Crypto.sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."]();

        this.form = Y.one(this.SELECTORS.QUIZ_FORM);
        if (!this.form) {
            return;
        }

        Y.delegate('click', this.downloadClicked, 'body', '.response-download-link', this);
    },

    /**
     * Handle the link click, and put the data in the URL so that it gets saved.
     *
     * @method downloadClicked
     */
    downloadClicked: function(e) {
        var link = e.currentTarget;

        if (typeof tinyMCE !== 'undefined') {
            tinyMCE.triggerSave();
        }

        link.set('download', this.filename.replace(
                /-d\d+\.attemptdata/, '-d' + this.getCurrentDatestamp() + '.attemptdata'));

        var data = {responses: Y.IO.stringify(this.form)};

        if (this.publicKey) {
            data = this.encryptResponses(data);
        }

        link.set('href', 'data:application/octet-stream,' + Y.JSON.stringify(data));

        Y.later(500, this, this.showDownloadMessage, link.ancestor('p').ancestor());
    },

    /**
     * Get the current date/time in a format suitable for using in filenames.
     *
     * @method getCurrentDatestamp
     * @return String like '197001010000'.
     */
    getCurrentDatestamp: function() {
        var now = new Date();
        function pad(number) {
            return number < 10 ? '0' + number : number;
        }
        return '' + now.getUTCFullYear() + pad(now.getUTCMonth() + 1) +
                pad(now.getUTCDate()) + pad(now.getUTCHours()) + pad(now.getUTCMinutes());
    },

    /**
     * Display a message following the paragraph containing the link, to confirm
     * that the responses were saved locally.
     */
    showDownloadMessage: function(container) {
        if (Y.one(this.SELECTORS.DOWNLOAD_CONFIRM_MESSAGE)) {
            Y.one(this.SELECTORS.DOWNLOAD_CONFIRM_MESSAGE).remove(true);
        }
        function pad(number) {
            return number < 10 ? '0' + number : number;
        }
        now = new Date();
        container.append('<p id="quiz-download-confirm-message">' +
                M.util.get_string('lastsavedtothiscomputer', 'quizaccess_offlinemode',
                        pad(now.getHours()) + ':' + pad(now.getMinutes())) + '</p>');
    },

    /**
     * Encrypt the responses using our encryption protocol.
     *
     * @method getCurrentDatestamp
     * @return Object with three fields, the AES -ncrypted responses, and the
     *      RSA-encrypted AES key and initial values..
     */
    encryptResponses: function(data) {

        var aeskey = Y.Crypto.sjcl.random.randomWords(8);
        var rp = {};
        var encrypted = Y.Crypto.sjcl.encrypt(aeskey, data.responses, { ks: 256, mode: 'cbc' }, rp);

        var jsEncrypt = new Y.Crypto.JSEncrypt();
        jsEncrypt.setPublicKey(this.publicKey);

        return {
            "responses": Y.JSON.parse(encrypted).ct,
            "key":       jsEncrypt.encrypt(Y.Crypto.sjcl.codec.base64.fromBits(aeskey)),
            "iv":        jsEncrypt.encrypt(Y.Crypto.sjcl.codec.base64.fromBits(rp.iv))
        };
    }
};


}, '@VERSION@', {
    "requires": [
        "base",
        "node",
        "event",
        "node-event-delegate",
        "json",
        "io-form",
        "moodle-quizaccess_offlinemode-jsencrypt",
        "moodle-quizaccess_offlinemode-sjcl"
    ]
});
