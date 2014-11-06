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
 * Strings for the quizaccess_offlinemode plugin.
 *
 * @package   quizaccess_offlinemode
 * @copyright 2014 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['offlinemodeenabled'] = 'Experimental offline attempt mode';
$string['offlinemodeenabled_help'] = 'The goal of this experimental option is to let students attempt a quiz even if the network connection is not reliable. For example on a train going through tunnels, or just with bad wi-fi. The students can move between pages of the quiz even if the server is not avaialble, and all their answers are stored locally, and sent to the server when possible.';
$string['pluginname'] = 'Quiz offline attempt mode';