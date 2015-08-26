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
 * A script to show in a popup, to verify that the user is logged in.
 *
 * @package   quizaccess_offlinemode
 * @copyright 2015 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../../../config.php');

$currentuserid = required_param('userid', PARAM_INT);

$PAGE->set_url('/mod/quiz/accessrule/offlinemode/relogin.php', array('userid' => $currentuserid));
$PAGE->set_context(context_system::instance());
$PAGE->set_pagelayout('embedded');
$PAGE->set_title(get_string('logindialogueheader', 'quizaccess_offlinemode'));

// Check login.
require_login();

if ($USER->id != $currentuserid) {
    print_error('loggedinaswronguser', 'quizaccess_offlinemode',
            new moodle_url('/login/logout.php', array('sesskey' => sesskey(), 'loginpage' => 1)));
}

$PAGE->requires->js_init_code('
            if (window.parent.M && window.parent.M.quizaccess_offlinemode && window.parent.M.quizaccess_offlinemode.autosave) {
                window.parent.M.quizaccess_offlinemode.autosave.restore_session_complete(
                        document.getElementById("sesskey").value);
            }
        ');

echo $OUTPUT->header();
echo $OUTPUT->notification(get_string('loginokagain', 'quizaccess_offlinemode'), 'notifysuccess');
echo html_writer::empty_tag('input', array('type' => 'hidden', 'id' => 'sesskey', 'name' => 'sesskey', 'value' => sesskey()));
echo $OUTPUT->footer();
