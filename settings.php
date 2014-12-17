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
 * Configuration settings for the quizaccess_offlinemode plugin.
 *
 * @package   quizaccess_offlinemode
 * @copyright 2013 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

if ($ADMIN->fulltree) {
    $settings->add(new admin_setting_configcheckbox_with_advanced('quizaccess_offlinemode/defaultenabled',
            get_string('offlinemodeenabled', 'quizaccess_offlinemode'),
            get_string('offlinemodeenabled_desc', 'quizaccess_offlinemode'),
            array('value' => 0, 'adv' => true)));

    $settings->add(new admin_setting_configtextarea('quizaccess_offlinemode/privatekey',
            get_string('privatekey', 'quizaccess_offlinemode'),
            get_string('privatekey_desc', 'quizaccess_offlinemode'), '', PARAM_RAW, 60, 14));

    $settings->add(new admin_setting_configtextarea('quizaccess_offlinemode/publickey',
            get_string('publickey', 'quizaccess_offlinemode'),
            get_string('publickey_desc', 'quizaccess_offlinemode'), '', PARAM_RAW, 60, 5));
}
