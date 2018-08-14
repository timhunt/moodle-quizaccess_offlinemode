YUI.add('moodle-quizaccess_offlinemode-autosave', function (Y, NAME) {

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
 * Auto-save functionality for during quiz attempts.
 *
 * @module moodle-quizaccess_offlinemode-autosave
 */

/**
 * Auto-save functionality for during quiz attempts.
 *
 * @class M.quizaccess_offlinemode.autosave
 */

M.quizaccess_offlinemode = M.quizaccess_offlinemode || {};
M.quizaccess_offlinemode.autosave = {
    /**
     * The amount of time (in milliseconds) to wait between TinyMCE detections.
     *
     * @property TINYMCE_DETECTION_DELAY
     * @type Number
     * @default 500
     * @private
     */
    TINYMCE_DETECTION_DELAY: 500,

    /**
     * The number of times to try redetecting TinyMCE.
     *
     * @property TINYMCE_DETECTION_REPEATS
     * @type Number
     * @default 20
     * @private
     */
    TINYMCE_DETECTION_REPEATS: 20,

    /**
     * The delay (in milliseconds) between checking hidden input fields.
     *
     * @property WATCH_HIDDEN_DELAY
     * @type Number
     * @default 1000
     * @private
     */
    WATCH_HIDDEN_DELAY: 1000,

    /**
     * Time-out used whe ajax requests. Defaults to 30 seconds.
     *
     * @property SAVE_TIMEOUT
     * @static
     * @type Number
     * @default 30000
     * @private
     */
    SAVE_TIMEOUT: 30000,

    /**
     * The selectors used throughout this class.
     *
     * @property SELECTORS
     * @private
     * @type Object
     * @static
     */
    SELECTORS: {
        QUIZ_FORM:             '#responseform',
        VALUE_CHANGE_ELEMENTS: 'input, textarea, [contenteditable="true"]',
        CHANGE_ELEMENTS:       'input, select',
        HIDDEN_INPUTS:         'input[type=hidden]',
        NAV_BUTTON:            '#quiznavbutton',                       // Must have slot appended.
        QUESTION_CONTAINER:    '#q',                                   // Must have slot appended.
        STATE_HOLDER:          ' .state',
        SUMMARY_ROW:           '.quizsummaryofattempt tr.quizsummary', // Must have slot appended.
        STATE_COLUMN:          ' .c1',
        FINISH_ATTEMPT_INPUT:  'input[name=finishattempt]',
        SUBMIT_BUTTON:         '[type=submit]',
        FORM:                  'form',
        SAVING_NOTICE:         '#quiz-saving',
        LAST_SAVED_MESSAGE:    '#quiz-last-saved-message',
        LAST_SAVED_TIME:       '#quiz-last-saved',
        SAVE_FAILED_NOTICE:    '#mod_quiz_navblock .quiz-save-failed'
    },

    /**
     * The script which handles the autosaves.
     *
     * @property AUTOSAVE_HANDLER
     * @type String
     * @default M.cfg.wwwroot + '/mod/quiz/autosave.ajax.php'
     * @private
     */
    AUTOSAVE_HANDLER: M.cfg.wwwroot + '/mod/quiz/accessrule/offlinemode/autosave.ajax.php',

    /**
     * The script which handles the autosaves.
     *
     * @property AUTOSAVE_HANDLER
     * @type String
     * @default M.cfg.wwwroot + '/mod/quiz/autosave.ajax.php'
     * @private
     */
    RELOGIN_SCRIPT: M.cfg.wwwroot + '/mod/quiz/accessrule/offlinemode/relogin.php',

    /**
     * The delay (in milliseconds) between a change being made, and it being auto-saved.
     *
     * @property delay
     * @type Number
     * @default 120000
     * @private
     */
    delay: 120000,

    /**
     * A Node reference to the form we are monitoring.
     *
     * @property form
     * @type Node
     * @default null
     */
    form: null,

    /**
     * Whether the form has been modified since the last save started.
     *
     * @property dirty
     * @type boolean
     * @default false
     */
    dirty: false,

    /**
     * Timer object for the delay between form modifaction and the save starting.
     *
     * @property delay_timer
     * @type Object
     * @default null
     * @private
     */
    delay_timer: null,

    /**
     * Y.io transaction for the save ajax request.
     *
     * @property save_transaction
     * @type object
     * @default null
     * @private
     */
    save_transaction: null,

    /**
     * Failed saves count.
     *
     * @property lastSuccessfulSave
     * @type Date
     * @default null
     * @private
     */
    last_successful_save: null,

    /**
     * Properly bound key change handler.
     *
     * @property editor_change_handler
     * @type EventHandle
     * @default null
     * @private
     */
    editor_change_handler: null,

    /**
     * Record of the value of all the hidden fields, last time they were checked.
     *
     * @property hidden_field_values
     * @type Object
     * @default {}
     */
    hidden_field_values: {},

    /**
     * Initialise the autosave code.
     *
     * @method init
     * @param {Number} delay the delay, in seconds, between a change being detected, and
     * a save happening.
     */
    init: function(delay) {
        this.form = Y.one(this.SELECTORS.QUIZ_FORM);
        if (!this.form) {
            return;
        }

        M.core_question_engine.init_form(Y, this.SELECTORS.QUIZ_FORM);
        Y.on('submit', M.mod_quiz.timer.stop, this.SELECTORS.QUIZ_FORM);
        // I don't know why it is window.onbeforeunload, not Y.on(...). I copied
        // this from formchangechecker and am not brave enough to change it.
        window.onbeforeunload = Y.bind(this.warn_if_unsaved_data, this);

        this.delay = delay * 1000;

        this.form.delegate('valuechange', this.value_changed, this.SELECTORS.VALUE_CHANGE_ELEMENTS, this);
        this.form.delegate('change',      this.value_changed, this.SELECTORS.CHANGE_ELEMENTS,       this);

        // We need to remove the standard 'Finish attempt...' click hander before we add our own.
        var submitAndFinishButton = Y.one(this.SELECTORS.FINISH_ATTEMPT_INPUT).siblings(this.SELECTORS.SUBMIT_BUTTON).pop();
        submitAndFinishButton.detach('click');
        submitAndFinishButton.on('click', this.submit_and_finish_clicked, this);

        // Add status content to the navigation block.
        this.create_status_messages();

        // Start watching other things.
        this.init_tinymce(this.TINYMCE_DETECTION_REPEATS);

        this.save_hidden_field_values();
        this.watch_hidden_fields();
    },

    save_hidden_field_values: function() {
        this.form.all(this.SELECTORS.HIDDEN_INPUTS).each(function(hidden) {
            var name  = hidden.get('name');
            if (!name) {
                return;
            }
            this.hidden_field_values[name] = hidden.get('value');
        }, this);
    },

    watch_hidden_fields: function() {
        this.detect_hidden_field_changes();
        Y.later(this.WATCH_HIDDEN_DELAY, this, this.watch_hidden_fields);
    },

    detect_hidden_field_changes: function() {
        this.form.all(this.SELECTORS.HIDDEN_INPUTS).each(function(hidden) {
            var name  = hidden.get('name'),
                value = hidden.get('value');
            if (!name || name === 'sesskey') {
                return;
            }
            if (!(name in this.hidden_field_values) || value !== this.hidden_field_values[name]) {
                this.hidden_field_values[name] = value;
                this.value_changed({target: hidden});
            }
        }, this);
    },

    /**
     * Initialise watching of TinyMCE specifically.
     *
     * Because TinyMCE might load slowly, and after us, we need to keep
     * trying, until we detect TinyMCE is there, or enough time has passed.
     * This is based on the TINYMCE_DETECTION_DELAY and
     * TINYMCE_DETECTION_REPEATS properties.
     *
     *
     * @method init_tinymce
     * @param {Number} repeatcount The number of attempts made so far.
     */
    init_tinymce: function(repeatcount) {
        if (typeof tinyMCE === 'undefined') {
            if (repeatcount > 0) {
                Y.later(this.TINYMCE_DETECTION_DELAY, this, this.init_tinymce, [repeatcount - 1]);
            } else {
            }
            return;
        }

        this.editor_change_handler = Y.bind(this.editor_changed, this);
        tinyMCE.onAddEditor.add(Y.bind(this.init_tinymce_editor, this));
    },

    /**
     * Initialise watching of a specific TinyMCE editor.
     *
     * @method init_tinymce_editor
     * @param {EventFacade} e
     * @param {Object} editor The TinyMCE editor object
     */
    init_tinymce_editor: function(e, editor) {
        editor.onChange.add(this.editor_change_handler);
        editor.onRedo.add(this.editor_change_handler);
        editor.onUndo.add(this.editor_change_handler);
        editor.onKeyDown.add(this.editor_change_handler);
    },

    value_changed: function(e) {
        var name = e.target.getAttribute('name');
        if (name === 'thispage' || name === 'scrollpos' || (name && name.match(/_:flagged$/))) {
            return; // Not interesting.
        }

        // Fallback to the ID when the name is not present (in the case of content editable).
        name = name || '#' + e.target.getAttribute('id');
        this.start_save_timer_if_necessary();
        this.mark_question_changed_if_necessary(name);
    },

    editor_changed: function(editor) {
        this.start_save_timer_if_necessary();
        this.mark_question_changed_if_necessary(editor.id);
    },

    mark_question_changed_if_necessary: function(elementname) {
        var slot = this.get_slot_from_id(elementname);
        if (slot) {
            this.set_question_state_string(slot, M.util.get_string('answerchanged', 'quizaccess_offlinemode'));
            this.set_question_state_class(slot, 'answersaved');
        }
    },

    get_slot_from_id: function(elementname) {
        var matches = elementname.match(/^#?q\d+:(\d+)_.*$/);
        if (matches) {
            return matches[1];
        }
        return undefined;
    },

    set_question_state_string: function(slot, newstate) {
        Y.one(this.SELECTORS.QUESTION_CONTAINER + slot + this.SELECTORS.STATE_HOLDER)
                .setHTML(Y.Escape.html(newstate));
        var summaryRow = Y.one(this.SELECTORS.SUMMARY_ROW + slot + this.SELECTORS.STATE_COLUMN);
        if (summaryRow) {
            summaryRow.setHTML(Y.Escape.html(newstate));
        }
        Y.one(this.SELECTORS.NAV_BUTTON + slot).set('title', Y.Escape.html(newstate));
    },

    update_question_state_strings: function(statestrings) {
        Y.Object.each(statestrings, function(state, slot) {
            this.set_question_state_string(slot, state);
        }, this);
    },

    set_question_state_class: function(slot, newstate) {
        var navButton = Y.one(this.SELECTORS.NAV_BUTTON + slot);
        navButton.set('className', navButton.get('className').replace(
                /^qnbutton \w+\b/, 'qnbutton ' + Y.Escape.html(newstate)));
    },

    update_question_state_classes: function(stateclasses) {
        Y.Object.each(stateclasses, function(state, slot) {
            this.set_question_state_class(slot, state);
        }, this);
    },

    start_save_timer_if_necessary: function() {
        this.dirty = true;

        if (this.delay_timer || this.save_transaction) {
            // Already counting down or daving.
            return;
        }

        this.start_save_timer();
    },

    start_save_timer: function() {
        this.cancel_delay();
        this.delay_timer = Y.later(this.delay, this, this.save_changes);
    },

    cancel_delay: function() {
        if (this.delay_timer && this.delay_timer !== true) {
            this.delay_timer.cancel();
        }
        this.delay_timer = null;
    },

    save_changes: function() {
        this.cancel_delay();
        this.dirty = false;

        if (this.is_time_nearly_over()) {
            this.stop_autosaving();
            return;
        }

        if (typeof tinyMCE !== 'undefined') {
            tinyMCE.triggerSave();
        }
        this.save_transaction = Y.io(this.AUTOSAVE_HANDLER, {
            method:  'POST',
            form:    {id: this.form},
            on:      {
                success: this.save_done,
                failure: this.save_failed
            },
            context: this,
            timeout: this.SAVE_TIMEOUT
        });

        Y.one(this.SELECTORS.SAVING_NOTICE).setStyle('visibility', 'visible');
    },

    save_done: function(transactionid, response) {
        var result;
        try {
            result = Y.JSON.parse(response.responseText);
        } catch (e) {
            this.save_failed(transactionid, response);
            return;
        }

        if (result.result === 'lostsession') {
            this.save_transaction = null;
            this.dirty = true;
            this.try_to_restore_session();
            return;
        }

        if (result.result !== 'OK') {
            this.save_failed(transactionid, response);
            return;
        }

        this.save_transaction = null;
        this.update_status_for_successful_save();

        this.update_question_state_classes(result.questionstates);
        this.update_question_state_strings(result.questionstatestrs);

        if (this.dirty) {
            this.start_save_timer();
        }

    },

    save_failed: function() {
        this.save_transaction = null;
        this.update_status_for_failed_save();

        // We want to retry soon.
        this.dirty = true;
        this.start_save_timer();
    },

    is_time_nearly_over: function() {
        return M.mod_quiz.timer && M.mod_quiz.timer.endtime &&
                (new Date().getTime() + 2 * this.delay) > M.mod_quiz.timer.endtime;
    },

    stop_autosaving: function() {
        this.cancel_delay();
        this.delay_timer = true;
        if (this.save_transaction) {
            this.save_transaction.abort();
        }
    },

    /**
     * A beforeunload handler, to warn if the user tries to quit with unsaved data.
     *
     * @param {EventFacade} e The triggering event
     */
    warn_if_unsaved_data: function(e) {
        if (!this.dirty && !this.save_transaction) {
            return;
        }

        // Show a warning.
        e.returnValue = M.util.get_string('changesmadereallygoaway', 'quizaccess_offlinemode');
        return e.returnValue;
    },

    /**
     * Handle a click on the submit and finish button. That is, show a confirm dialogue.
     *
     * @param {EventFacade} e The triggering event, if there is one.
     */
    submit_and_finish_clicked: function(e) {
        e.halt(true);

        var confirmationDialogue = new M.core.confirm({
            id: 'submit-confirmation',
            width: '300px',
            center: true,
            modal: true,
            visible: false,
            draggable: false,
            title: M.util.get_string('confirmation', 'admin'),
            noLabel: M.util.get_string('cancel', 'moodle'),
            yesLabel: M.util.get_string('submitallandfinish', 'quiz'),
            question: M.util.get_string('confirmclose', 'quiz')
        });

        // The dialogue was submitted with a positive value indication.
        confirmationDialogue.on('complete-yes', this.submit_and_finish, this);
        confirmationDialogue.render().show();
    },

    /**
     * Handle the submit and finish button in the confirm dialogue being pressed.
     *
     * @param {EventFacade} e The triggering event, if there is one.
     */
    submit_and_finish: function(e) {
        e.halt();
        this.stop_autosaving();

        var submitButton = Y.one(this.SELECTORS.FINISH_ATTEMPT_INPUT).siblings(this.SELECTORS.SUBMIT_BUTTON).pop();
        this.get_submit_progress(submitButton.ancestor('.controls')).show();
        submitButton.ancestor('.singlebutton').hide();
        var failureMessage = this.get_submit_failed_message(submitButton.ancestor('.controls'));
        submitButton.ancestor('.controls').removeClass('quiz-save-failed');
        failureMessage.header.hide();
        failureMessage.message.hide();
        this.form.append('<input name="finishattempt" value="1">');

        if (typeof tinyMCE !== 'undefined') {
            tinyMCE.triggerSave();
        }
        this.save_transaction = Y.io(this.AUTOSAVE_HANDLER, {
            method:  'POST',
            form:    {id: this.form},
            on:      {
                success: this.submit_done,
                failure: this.submit_failed
            },
            context: this,
            timeout: this.SAVE_TIMEOUT
        });
    },

    submit_done: function(transactionid, response) {
        var result;
        try {
            result = Y.JSON.parse(response.responseText);
        } catch (e) {
            this.submit_failed(transactionid, response);
            return;
        }

        if (result.result !== 'OK') {
            this.submit_failed(transactionid, response);
            return;
        }

        this.save_transaction = null;
        this.dirty = false;
        window.location.replace(result.reviewurl);
    },

    submit_failed: function() {
        this.save_transaction = null;

        // Re-display the submit button.
        this.form.one(this.SELECTORS.FINISH_ATTEMPT_INPUT).remove();
        var submitButton = Y.one(this.SELECTORS.FINISH_ATTEMPT_INPUT).siblings(this.SELECTORS.SUBMIT_BUTTON).pop();
        var submitProgress = this.get_submit_progress(submitButton.ancestor('.controls'));
        submitButton.ancestor('.singlebutton').show();
        submitProgress.hide();

        // And show the failure message.
        var failureMessage = this.get_submit_failed_message(submitButton.ancestor('.controls'));
        submitButton.ancestor('.controls').addClass('quiz-save-failed');
        failureMessage.header.show();
        failureMessage.message.show();
        this.update_status_for_failed_save();
    },

    get_submit_progress: function(controlsDiv) {
        var submitProgress = controlsDiv.one('.submit-progress');
        if (submitProgress) {
            // Already created. Return it.
            return submitProgress;
        }

        // Needs to be created.
        submitProgress = controlsDiv.appendChild('<div class="submit-progress">');
        M.util.add_spinner(Y, submitProgress).show();
        submitProgress.append(M.util.get_string('submitting', 'quizaccess_offlinemode'));
        return submitProgress;
    },

    get_submit_failed_message: function(controlsDiv) {
        var failedHeader = controlsDiv.one('.submit-failed-header');
        if (failedHeader) {
            // Already created. Return it.
            return {header: failedHeader, message: controlsDiv.one('.submit-failed-message')};
        }

        // Needs to be created.
        controlsDiv.insert('<div class="submit-failed-header">', 0);
        failedHeader = controlsDiv.one('.submit-failed-header');
        failedHeader.append('<h4>' + M.util.get_string('submitfailed', 'quizaccess_offlinemode') + '</h4>');
        failedHeader.append('<p>' + M.util.get_string('submitfailedmessage', 'quizaccess_offlinemode') + '</p>');

        var downloadLink = '<a href="#" class="response-download-link">' +
                M.util.get_string('savetheresponses', 'quizaccess_offlinemode') + '</a>';
        var failedMessage = controlsDiv.appendChild('<div class="submit-failed-message">');
        failedMessage.append('<p>' + M.util.get_string('submitfaileddownloadmessage',
                'quizaccess_offlinemode', downloadLink) + '</p>');

        return {header: failedHeader, message: failedMessage};
    },

    create_status_messages: function() {
        var downloadLink = '<a href="#" class="response-download-link">' +
                M.util.get_string('savetheresponses', 'quizaccess_offlinemode') + '</a>';
        Y.one('#mod_quiz_navblock .content').append('<div id="quiz-save-status">' +
                '<div id="quiz-last-saved-message">' + M.util.get_string('lastsaved', 'quizaccess_offlinemode',
                        '<span id="quiz-last-saved"></span>') + '</div>' +
                '<div id="quiz-saving">' + M.util.get_string('savingdots', 'quizaccess_offlinemode') + '</div>' +
                '<div class="quiz-save-failed">' + M.util.get_string('savefailed',
                        'quizaccess_offlinemode', downloadLink) + '</div>' +
                '</div>');
        this.update_status_for_successful_save();
    },

    update_status_for_successful_save: function() {
        function pad(number) {
            return number < 10 ? '0' + number : number;
        }
        this.last_successful_save = new Date();
        Y.one(this.SELECTORS.LAST_SAVED_TIME).setHTML(pad(this.last_successful_save.getHours()) +
                ':' + pad(this.last_successful_save.getMinutes()));
        Y.one(this.SELECTORS.SAVING_NOTICE).setStyle('visibility', 'hidden');
        Y.one(this.SELECTORS.SAVING_NOTICE).setHTML(M.util.get_string('savingdots', 'quizaccess_offlinemode'));
        Y.one(this.SELECTORS.SAVE_FAILED_NOTICE).hide();
    },

    update_status_for_failed_save: function() {
        Y.one(this.SELECTORS.LAST_SAVED_MESSAGE).setHTML(
                M.util.get_string('lastsavedtotheserver', 'quizaccess_offlinemode',
                Y.one(this.SELECTORS.LAST_SAVED_TIME).get('outerHTML')));
        Y.one(this.SELECTORS.SAVING_NOTICE).setStyle('visibility', 'hidden');
        Y.one(this.SELECTORS.SAVING_NOTICE).setHTML(M.util.get_string('savingtryagaindots', 'quizaccess_offlinemode'));
        Y.one(this.SELECTORS.SAVE_FAILED_NOTICE).show();
    },

    try_to_restore_session: function() {
        this.loginDialogue = new M.core.notification.info({
            id:        'quiz-relogin-dialogue',
            width:     '70%',
            center:    true,
            modal:     true,
            visible:   false,
            draggable: false
        });

        this.loginDialogue.setStdModContent(Y.WidgetStdMod.HEADER,
                '<h1 id="moodle-quiz-relogin-dialogue-header-text">' +
                M.util.get_string('logindialogueheader', 'quizaccess_offlinemode') + '</h1>',
                Y.WidgetStdMod.REPLACE);
        this.loginDialogue.setStdModContent(Y.WidgetStdMod.BODY,
                '<iframe src="' + this.RELOGIN_SCRIPT + '?userid=' +
                Y.one('#quiz-userid').get('value') + '">', Y.WidgetStdMod.REPLACE);

        // The dialogue was submitted with a positive value indication.
        this.loginDialogue.render().show();
    },

    restore_session_complete: function(sesskey) {
        Y.all('input[name=sesskey]').set('value', sesskey);
        if (this.loginDialogue) {
            this.loginDialogue.hide().destroy();
            this.loginDialogue = null;
        }
        this.save_changes();
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
        "core_question_engine",
        "mod_quiz"
    ]
});
