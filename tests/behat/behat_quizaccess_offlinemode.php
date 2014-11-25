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
 * Steps definitions related to quizaccess_offlinemode.
 *
 * @package   quizaccess_offlinemode
 * @category  test
 * @copyright 2014 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// NOTE: no MOODLE_INTERNAL test here, this file may be required by behat before including /config.php.

require_once(__DIR__ . '/../../../../../../lib/behat/behat_base.php');

use Behat\Behat\Context\Step\Given as Given,
    Behat\Gherkin\Node\TableNode as TableNode;

/**
 * Steps definitions related to quizaccess_offlinemode.
 *
 * @copyright 2014 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class behat_quizaccess_offlinemode extends behat_question_base {
    /**
     * @var string when we want to check whether the page has reloaded, we first
     * write this unique string into the page, then later, if it is still there,
     * can be believe that the page has not been reloaded.
     */
    const RELOAD_DETECTION_STRING = 'page_has_not_reloaded_9qf8h3wth4ct84t64wy9';

    /**
     * Prepare to detact that the page has no reloaded some time in the future.
     * @Given /^I mark the page to detect reloads$/
     */
    public function i_mark_the_page_to_detect_reloads() {
        if (!$this->running_javascript()) {
            throw new DriverException('Page reload detection requires JavaScript.');
        }

        $this->getSession()->evaluateScript(
                'var span = document.createElement("span");
                span.innerHTML = "' . self::RELOAD_DETECTION_STRING . '";
                span.setAttribute("style", "display: none;");
                document.body.appendChild(span);');
    }

    /**
     * Verify that the page has not reloaded since the last call to i_mark_the_page_to_detect_reloads.
     * @Given /^the page should not have reloaded since it was marked$/
     */
    public function the_page_should_not_have_reloaded_since_it_was_marked() {
        $xpath = "//span[@style = 'display: none;'][. = '" . self::RELOAD_DETECTION_STRING . "']";
        return array(new Given("\"$xpath\" \"xpath_element\" should exist"));
    }
}
