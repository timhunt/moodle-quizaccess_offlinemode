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
 * Form for uploading responses saved from the emergency download link.
 *
 * @package   quizaccess_offlinemode
 * @copyright 2014 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace quizaccess_offlinemode\form;
defined('MOODLE_INTERNAL') || die();

use \moodleform;


/**
 * Form for uploading responses saved from the emergency download link.
 *
 * @copyright  2014 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class upload_responses extends moodleform {

    protected function definition() {
        $mform = $this->_form;

        $mform->addElement('filemanager', 'responsefiles', get_string('responsefiles', 'quizaccess_offlinemode'),
                null, array('subdirs' => 0, 'return_types' => FILE_INTERNAL));
        $mform->addRule('responsefiles', get_string('required'), 'required', null, 'client');
        $mform->addHelpButton('responsefiles', 'responsefiles', 'quizaccess_offlinemode');

        $mform->addElement('selectyesno', 'finishattempts',
                get_string('finishattemptsafterupload', 'quizaccess_offlinemode'));

        $this->add_action_buttons(true, get_string('uploadresponses', 'quizaccess_offlinemode'));
    }
}
