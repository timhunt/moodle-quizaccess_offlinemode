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
 * The access rule class implementation for the quizaccess_offlinemode plugin.
 *
 * A rule that hijacks the standard attempt.php page, and replaces it with
 * different script which loads all the questions at once and then allows the
 * student to keep working, even if the network connection is lost. However,
 * if the network is working, responses are saved back to the server.
 *
 * @copyright  2014 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class quizaccess_offlinemode extends quiz_access_rule_base {

    /** @var string the URL path to our replacement attempt script. */
    const ATTEMPT_URL = '/mod/quiz/accessrule/offlinemode/attempt.php';

    public static function make(quiz $quizobj, $timenow, $canignoretimelimits) {

        if (empty($quizobj->get_quiz()->offlinemode_enabled) ||
                !self::is_compatible_behaviour($quizobj->get_quiz()->preferredbehaviour)) {
            return null;
        }

        return new self($quizobj, $timenow);
    }

    public static function add_settings_form_fields(
            mod_quiz_mod_form $quizform, MoodleQuickForm $mform) {
        $config = get_config('quizaccess_offlinemode');
        $mform->addElement('selectyesno', 'offlinemode_enabled',
                get_string('offlinemodeenabled', 'quizaccess_offlinemode'));
        $mform->addHelpButton('offlinemode_enabled',
                'offlinemodeenabled', 'quizaccess_offlinemode');
        $mform->setDefault('offlinemode_enabled', !empty($config->defaultenabled));
        $mform->setAdvanced('offlinemode_enabled', !empty($config->defaultenabled_adv));

        foreach (question_engine::get_behaviour_options(null) as $behaviour => $notused) {
            if (!self::is_compatible_behaviour($behaviour)) {
                $mform->disabledIf('offlinemode_enabled', 'preferredbehaviour',
                        'eq', $behaviour);
            }
        }
    }

    /**
     * Given the quiz "How questions behave" setting, can the fault-tolerant mode work
     * with that behaviour?
     * @param string $behaviour the internal name (e.g. 'interactive') of an archetypal behaviour.
     * @return boolean whether fault-tolerant mode can be used.
     */
    public static function is_compatible_behaviour($behaviour) {
        $unusedoptions = question_engine::get_behaviour_unused_display_options($behaviour);
        // Sorry, double negative here. The heuristic is that:
        // The behaviour is compatible if we don't need to show specific feedback during the attempt.
        return in_array('specificfeedback', $unusedoptions);
    }

    public static function save_settings($quiz) {
        global $DB;
        if (empty($quiz->offlinemode_enabled)) {
            $DB->delete_records('quizaccess_offlinemode', array('quizid' => $quiz->id));
        } else {
            if (!$DB->record_exists('quizaccess_offlinemode', array('quizid' => $quiz->id))) {
                $record = new stdClass();
                $record->quizid = $quiz->id;
                $record->enabled = 1;
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
            'COALESCE(offlinemode.enabled, 0) AS offlinemode_enabled',
            'LEFT JOIN {quizaccess_offlinemode} offlinemode ON offlinemode.quizid = quiz.id',
            array());
    }

    public function description() {
        if (!$this->quizobj->has_capability('quizaccess/offlinemode:uploadresponses')) {
            return '';
        }

        return get_string('description', 'quizaccess_offlinemode',
                html_writer::link(new moodle_url('/mod/quiz/accessrule/offlinemode/upload.php',
                        array('id' => $this->quizobj->get_cmid())),
                        get_string('descriptionlink', 'quizaccess_offlinemode')));
    }

    public function setup_attempt_page($page) {
        if ($page->pagetype == 'mod-quiz-attempt' || $page->pagetype == 'mod-quiz-summary') {
            redirect(new moodle_url(self::ATTEMPT_URL, $page->url->params()));
        }
    }
}
