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
 * Script to upload responses saved from the emergency download link.
 *
 * @package   quizaccess_offlinemode
 * @copyright 2014 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../../../config.php');
require_once($CFG->libdir . '/formslib.php');

$cmid = optional_param('id', 0, PARAM_INT);
list($course, $cm) = get_course_and_cm_from_cmid($cmid, 'quiz');
$quiz = $DB->get_record('quiz', array('id' => $cm->instance), '*', MUST_EXIST);
$context = context_module::instance($cm->id);

$PAGE->set_url('/mod/quiz/accessrule/offlinemode/upload.php', array('id' => $cmid));
require_login($course, false, $cm);
require_capability('quizaccess/offlinemode:uploadresponses', $context);

$form = new \quizaccess_offlinemode\form\upload_responses($PAGE->url);
if ($form->is_cancelled()) {
    redirect(new moodle_url('/mod/quiz/view.php', array('id' => $cm->id)));
} else if ($fromform = $form->get_data()) {
    // TODO
    echo $OUTPUT->header();
    echo 'Form submitted. TODO.';
    echo $OUTPUT->footer();
}

// Initialise $PAGE some more.
$title = get_string('uploadresponsesfor', 'quizaccess_offlinemode',
        format_string($quiz->name, true, array('context' => $context)));
$PAGE->navbar->add($title);
$PAGE->set_pagelayout('admin');
$PAGE->set_title($title);
$PAGE->set_heading($course->fullname);

echo $OUTPUT->header();
echo $OUTPUT->heading($title);
$form->display();
echo $OUTPUT->footer();
