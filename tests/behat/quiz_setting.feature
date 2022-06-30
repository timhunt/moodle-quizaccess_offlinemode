@ou @ou_vle @quizaccess @quizaccess_offlinemode
Feature: Fault-tolerant mode quiz setting
  In order to run quizzes with dodgy wifi
  As a teacher
  I need to turn the fault-tolerant quiz mode on and off.

  Background:
    Given the following "courses" exist:
      | fullname | shortname | format |
      | Course 1 | C1        | topics |
    And the following "users" exist:
      | username | firstname |
      | teacher  | Teachy    |
    And the following "course enrolments" exist:
      | user    | course | role           |
      | teacher | C1     | editingteacher |
    And I am on the "C1" "Course" page logged in as "teacher"

  @javascript
  Scenario: Create a quiz with the setting on.
    When I turn editing mode on
    And I add a "Quiz" to section "0" and I fill the form with:
      | Name                             | Quiz with fault-tolerant mode |
      | Experimental fault-tolerant mode | Yes                           |
    And I am on the "Quiz with fault-tolerant mode" "quiz activity editing" page
    And I expand all fieldsets
    Then the field "Experimental fault-tolerant mode" matches value "Yes"

  @javascript
  Scenario: Create a quiz with the setting off.
    When I turn editing mode on
    And I add a "Quiz" to section "0" and I fill the form with:
      | Name                             | Quiz without fault-tolerant mode |
      | Experimental fault-tolerant mode | No                               |
    And I am on the "Quiz without fault-tolerant mode" "quiz activity editing" page
    And I expand all fieldsets
    Then the field "Experimental fault-tolerant mode" matches value "No"

  @javascript
  Scenario: Change the setting for a quiz from off to on.
    Given the following "activities" exist:
      | activity   | name   | course | idnumber | offlinemode_enabled |
      | quiz       | Quiz 1 | C1     | quiz1    | 0                   |
    When I am on the "Quiz 1" "quiz activity editing" page
    And I expand all fieldsets
    And I set the field "Experimental fault-tolerant mode" to "Yes"
    And I press "Save and display"
    And I am on the "Quiz 1" "quiz activity editing" page
    Then the field "Experimental fault-tolerant mode" matches value "Yes"

  @javascript
  Scenario: Change the setting for a quiz from on to off.
    Given the following "activities" exist:
      | activity   | name   | course | idnumber | offlinemode_enabled |
      | quiz       | Quiz 1 | C1     | quiz1    | 1                   |
    When I am on the "Quiz 1" "quiz activity editing" page
    And I expand all fieldsets
    And I set the field "Experimental fault-tolerant mode" to "No"
    And I press "Save and display"
    And I am on the "Quiz 1" "quiz activity editing" page
    Then the field "Experimental fault-tolerant mode" matches value "No"

  @javascript
  Scenario: The experimental setting is disabled if you select an interactive behaviour.
    When I turn editing mode on
    And I add a "Quiz" to section "0"
    And I expand all fieldsets
    And I set the field "How questions behave" to "Adaptive mode"
    Then the "Experimental fault-tolerant mode" "field" should be disabled
