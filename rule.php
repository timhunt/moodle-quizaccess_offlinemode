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
 * Implementaton of the quizaccess_offlinemode plugin.
 *
 * @package   quizaccess_offlinemode
 * @copyright 2011 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/mod/quiz/accessrule/accessrulebase.php');


/**
 * A rule requiring the student to promise not to cheat.
 *
 * @copyright  2011 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class quizaccess_offlinemode extends quiz_access_rule_base {

    public function is_preflight_check_required($attemptid) {
        return empty($attemptid);
    }

    public function add_preflight_check_form_fields(mod_quiz_preflight_check_form $quizform,
            MoodleQuickForm $mform, $attemptid) {

        $mform->addElement('header', 'offlinemodeheader',
                get_string('offlinemodeheader', 'quizaccess_offlinemode'));
        $mform->addElement('static', 'offlinemodemessage', '',
                get_string('offlinemodestatement', 'quizaccess_offlinemode'));
        $mform->addElement('checkbox', 'offlinemode', '',
                get_string('offlinemodelabel', 'quizaccess_offlinemode'));
    }

    public function validate_preflight_check($data, $files, $errors, $attemptid) {
        if (empty($data['offlinemode'])) {
            $errors['offlinemode'] = get_string('youmustagree', 'quizaccess_offlinemode');
        }

        return $errors;
    }

    public static function make(quiz $quizobj, $timenow, $canignoretimelimits) {

        if (empty($quizobj->get_quiz()->offlinemoderequired)) {
            return null;
        }

        return new self($quizobj, $timenow);
    }

    public static function add_settings_form_fields(
            mod_quiz_mod_form $quizform, MoodleQuickForm $mform) {
        $mform->addElement('select', 'offlinemoderequired',
                get_string('offlinemoderequired', 'quizaccess_offlinemode'),
                array(
                    0 => get_string('notrequired', 'quizaccess_offlinemode'),
                    1 => get_string('offlinemoderequiredoption', 'quizaccess_offlinemode'),
                ));
        $mform->addHelpButton('offlinemoderequired',
                'offlinemoderequired', 'quizaccess_offlinemode');
    }

    public static function save_settings($quiz) {
        global $DB;
        if (empty($quiz->offlinemoderequired)) {
            $DB->delete_records('quizaccess_offlinemode', array('quizid' => $quiz->id));
        } else {
            if (!$DB->record_exists('quizaccess_offlinemode', array('quizid' => $quiz->id))) {
                $record = new stdClass();
                $record->quizid = $quiz->id;
                $record->offlinemoderequired = 1;
                $DB->insert_record('quizaccess_offlinemode', $record);
            }
        }
    }

    public static function delete_settings($quiz) {
        global $DB;
        $DB->delete_records('quizaccess_offlinemode', array('quizid' => $quiz->id));
    }

    public static function get_settings_sql($quizid) {
        return array(
            'offlinemoderequired',
            'LEFT JOIN {quizaccess_offlinemode} offlinemode ON offlinemode.quizid = quiz.id',
            array());
    }
}
