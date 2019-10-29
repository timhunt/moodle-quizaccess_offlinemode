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
 * Fault-tolerant quiz mode, replacement attempt.php page.
 *
 * @package   quizaccess_offlinemode
 * @copyright 2014 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../../../config.php');
require_once($CFG->dirroot . '/mod/quiz/locallib.php');

// Get submitted parameters.
$attemptid = required_param('attempt', PARAM_INT);
$page = optional_param('page', null, PARAM_INT);

// Create the attempt object.
$attemptobj = quiz_attempt::create($attemptid);

// Fix the page number if necessary.
if ($page === null) {
    $page = $attemptobj->get_attempt()->currentpage;
}
if ($attemptobj->get_navigation_method() == QUIZ_NAVMETHOD_SEQ && $page < $attemptobj->get_currentpage()) {
    $page = $attemptobj->get_currentpage();
}

// Initialise $PAGE.
$pageurl = $attemptobj->attempt_url(null, $page);
$PAGE->set_url(quizaccess_offlinemode::ATTEMPT_URL, $pageurl->params());

// Check login.
require_login($attemptobj->get_course(), false, $attemptobj->get_cm());

// Check that this attempt belongs to this user.
if ($attemptobj->get_userid() != $USER->id) {
    if ($attemptobj->has_capability('mod/quiz:viewreports')) {
        redirect($attemptobj->review_url(null, $page));
    } else {
        throw new moodle_quiz_exception($attemptobj->get_quizobj(), 'notyourattempt');
    }
}

// Check capabilities and block settings.
if (!$attemptobj->is_preview_user()) {
    $attemptobj->require_capability('mod/quiz:attempt');
    if (empty($attemptobj->get_quiz()->showblocks)) {
        $PAGE->blocks->show_only_fake_blocks();
    }

} else {
    navigation_node::override_active_url($attemptobj->start_attempt_url());
}

// If the attempt is already closed, send them to the review page.
if ($attemptobj->is_finished()) {
    redirect($attemptobj->review_url(null, $page));
} else if ($attemptobj->get_state() == quiz_attempt::OVERDUE) {
    redirect($attemptobj->summary_url());
}

// Check the access rules.
$accessmanager = $attemptobj->get_access_manager(time());
$accessmanager->setup_attempt_page($PAGE);

// Complete masquerading as the mod-quiz-attempt page. Must be done after setup_attempt_page.
$PAGE->set_pagetype('mod-quiz-attempt');

// Get the renderer.
$output = $PAGE->get_renderer('mod_quiz');
$messages = $accessmanager->prevent_access();
if (!$attemptobj->is_preview_user() && $messages) {
    print_error('attempterror', 'quiz', $attemptobj->view_url(),
    $output->access_messages($messages));
}
if ($accessmanager->is_preflight_check_required($attemptobj->get_attemptid())) {
    redirect($attemptobj->start_attempt_url(null, $page));
}

// Initialise the JavaScript.
question_engine::initialise_js();
$PAGE->requires->js_module(quiz_get_js_module());
$autosaveperiod = get_config('quiz', 'autosaveperiod');
if (!$autosaveperiod) {
    // Offline mode only works with autosave, so if it is off for normal quizzes,
    // use a sensible default.
    $autosaveperiod = 60;
}
$firstquestionouterdivid = $attemptobj->get_question_attempt(1)->get_outer_question_div_unique_id();
$PAGE->requires->yui_module('moodle-quizaccess_offlinemode-autosave',
        'M.quizaccess_offlinemode.autosave.init', array($autosaveperiod, '#' . substr($firstquestionouterdivid, 0, -1)));

$PAGE->requires->yui_module('moodle-quizaccess_offlinemode-navigation',
        'M.quizaccess_offlinemode.navigation.init', array($page));

if (!empty($USER->idnumber)) {
    $user = '-i' . $USER->idnumber;
} else {
    $user = '-u' . $USER->id;
}
$emergencysavefilename = clean_filename(format_string($attemptobj->get_quiz_name()) .
        $user . '-a' . $attemptid . '-d197001010000.attemptdata');
$PAGE->requires->yui_module('moodle-quizaccess_offlinemode-download',
        'M.quizaccess_offlinemode.download.init',
        array($emergencysavefilename, get_config('quizaccess_offlinemode', 'publickey')));
$PAGE->requires->strings_for_js(array('answerchanged', 'savetheresponses', 'submitting',
        'submitfailed', 'submitfailedmessage', 'submitfaileddownloadmessage',
        'lastsaved', 'lastsavedtotheserver', 'lastsavedtothiscomputer',
        'savingdots', 'savingtryagaindots', 'savefailed', 'logindialogueheader',
        'changesmadereallygoaway'), 'quizaccess_offlinemode');
$PAGE->requires->strings_for_js(array('submitallandfinish', 'confirmclose'), 'quiz');
$PAGE->requires->string_for_js('flagged', 'question');
$PAGE->requires->string_for_js('confirmation', 'admin');

// Log this page view.
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

// Arrange for the navigation to be displayed in the first region on the page.
$navbc = $attemptobj->get_navigation_panel($output, 'quiz_attempt_nav_panel', -1);
$regions = $PAGE->blocks->get_regions();
$PAGE->blocks->add_fake_block($navbc, reset($regions));

// Initialise $PAGE some more.
$title = get_string('attempt', 'quiz', $attemptobj->get_attempt_number());
$PAGE->set_title($attemptobj->get_quiz_name());
$PAGE->set_heading($attemptobj->get_course()->fullname);

// A few final things.
if ($attemptobj->is_last_page($page)) {
    $nextpage = -1;
} else {
    $nextpage = $page + 1;
}

// Display the page.

// From mod_quiz_renderer::attempt_form.
$form = '';

// Start the form.
$form .= html_writer::start_tag('form',
        array('action' => $attemptobj->processattempt_url(), 'method' => 'post',
        'enctype' => 'multipart/form-data', 'accept-charset' => 'utf-8',
        'id' => 'responseform'));
$form .= html_writer::start_tag('div');

// Print all the questions on every page.
$numpages = $attemptobj->get_num_pages();
for ($i = 0; $i < $numpages; $i++) {
    $form .= html_writer::start_div('quiz-loading-hide',
            array('id' => 'quizaccess_offlinemode-attempt_page-' . $i));
    foreach ($attemptobj->get_slots($i) as $slot) {
        $form .= $attemptobj->render_question($slot, false, $output,
                $attemptobj->attempt_url($slot, $page));
    }
    $form .= html_writer::end_div('');
}

$form .= html_writer::start_tag('div', array('class' => 'submitbtns'));
$form .= html_writer::empty_tag('input', array('type' => 'submit', 'name' => 'next',
        'value' => get_string('next')));
$form .= html_writer::end_tag('div');

// Some hidden fields to trach what is going on.
$form .= html_writer::empty_tag('input', array('type' => 'hidden', 'name' => 'attempt',
        'value' => $attemptobj->get_attemptid()));
$form .= html_writer::empty_tag('input', array('type' => 'hidden', 'name' => 'thispage',
        'value' => $page, 'id' => 'followingpage'));
$form .= html_writer::empty_tag('input', array('type' => 'hidden', 'name' => 'nextpage',
        'value' => $nextpage));
$form .= html_writer::empty_tag('input', array('type' => 'hidden', 'name' => 'timeup',
        'value' => '0', 'id' => 'timeup'));
$form .= html_writer::empty_tag('input', array('type' => 'hidden', 'name' => 'sesskey',
        'value' => sesskey()));
$form .= html_writer::empty_tag('input', array('type' => 'hidden', 'name' => 'scrollpos',
        'value' => '', 'id' => 'scrollpos'));
$form .= html_writer::empty_tag('input', array('type' => 'hidden',
        'value' => $USER->id, 'id' => 'quiz-userid'));

// Add a hidden field with questionids. Do this at the end of the form, so
// if you navigate before the form has finished loading, it does not wipe all
// the student's answers.
$form .= html_writer::empty_tag('input', array('type' => 'hidden', 'name' => 'slots',
        'value' => implode(',', $attemptobj->get_slots())));

// Summary page. Code from mod_quiz_renderer::summary_page.
$summary = '';
$summary .= html_writer::start_div('', array('id' => 'quizaccess_offlinemode-attempt_page--1'));
$summary .= $output->heading(format_string($attemptobj->get_quiz_name()));
$summary .= $output->heading(get_string('summaryofattempt', 'quiz'), 3);
$summary .= $output->summary_table($attemptobj, $attemptobj->get_display_options(false));

$controls = $output->summary_page_controls($attemptobj);
$controls = preg_replace('~<div id="quiz-timer".*?</div>~', '', $controls);
$summary .= $controls;

$summary .= html_writer::end_div('');

// Finish the form.
$form .= html_writer::end_tag('div');
$form .= html_writer::end_tag('form');

// From mod_quiz_renderer::attempt_page.
$html = '';
$html .= $output->header();
$html .= $output->quiz_notices($messages);
$html .= $form;
$html .= $summary;
$html .= $output->footer();
echo $html;
