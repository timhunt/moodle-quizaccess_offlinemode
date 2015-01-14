<?php
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
 * Thisscript processes ajax auto-save requests during the quiz.
 *
 * @package   quizaccess_offlinemode
 * @copyright 2013 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('AJAX_SCRIPT', true);

require_once(__DIR__ . '/../../../../config.php');
require_once($CFG->dirroot . '/mod/quiz/locallib.php');

// Remember the current time as the time any responses were submitted
// (so as to make sure students don't get penalized for slow processing on this page).
$timenow = time();

// Get submitted parameters.
$attemptid = required_param('attempt',  PARAM_INT);
$thispage  = optional_param('thispage', 0, PARAM_INT);
$finishattempt = optional_param('finishattempt', false, PARAM_BOOL);

$transaction = $DB->start_delegated_transaction();
$attemptobj = quiz_attempt::create($attemptid);

// Check login.
if (!isloggedin() || !confirm_sesskey()) {
    echo json_encode(array('result' => 'lostsession'));
    die;
}
require_login($attemptobj->get_course(), false, $attemptobj->get_cm());
require_sesskey();

// Check that this attempt belongs to this user.
if ($attemptobj->get_userid() != $USER->id) {
    throw new moodle_quiz_exception($attemptobj->get_quizobj(), 'notyourattempt');
}

// Check capabilities.
if (!$attemptobj->is_preview_user()) {
    $attemptobj->require_capability('mod/quiz:attempt');
}
$options = $attemptobj->get_display_options(false);

// If the attempt is already closed, send them to the review page.
if ($attemptobj->is_finished()) {
    throw new moodle_quiz_exception($attemptobj->get_quizobj(),
            'attemptalreadyclosed', null, $attemptobj->review_url());
}

if ($finishattempt) {
    // Submit and finish. TODO all the using timing stuff.
    $attemptobj->process_finish($timenow, true);
    $result = array('result' => 'OK', 'reviewurl' => $attemptobj->review_url()->out(false));

} else {
    // Process the responses.
    $attemptobj->process_auto_save($timenow);

    // Update current page number.
    if ($thispage >= 0 && $attemptobj->get_currentpage() != $thispage) {
        $DB->set_field('quiz_attempts', 'currentpage', $thispage, array('id' => $attemptid));
    }

    // Get the question states, and put them in a response.
    $result = array('result' => 'OK', 'questionstates' => array(), 'questionstatestrs' => array());
    foreach ($attemptobj->get_slots() as $slot) {
        $result['questionstates'][$slot] = $attemptobj->get_question_state_class(
                $slot, $options->correctness);
        $result['questionstatestrs'][$slot] = $attemptobj->get_question_status(
                $slot, $options->correctness);
    }

    // Normally, during a quiz attempt, every time the student goes to a new page,
    // we log that they are continuing their attempt. We can't do that with
    // fault-tolerent mode, since everything happens on the client-side, so
    // instead we will log every auto-save, to give some indication that the
    // student is actively attempting the quiz.
    $params = array(
            'objectid' => $attemptid,
            'relateduserid' => $attemptobj->get_userid(),
            'courseid' => $attemptobj->get_courseid(),
            'context' => context_module::instance($attemptobj->get_cmid()),
            'other' => array(
                    'quizid' => $attemptobj->get_quizid()
            )
    );
    $event = \mod_quiz\event\attempt_viewed::create($params);
    $event->add_record_snapshot('quiz_attempts', $attemptobj->get_attempt());
    $event->trigger();
}

$transaction->allow_commit();

echo json_encode($result);
