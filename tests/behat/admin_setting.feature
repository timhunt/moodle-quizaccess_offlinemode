@ou @ou_vle @quizaccess @quizaccess_offlinemode
Feature: Fault-tolerant mode admin setting
  In order to save teachers time
  As an admin
  I need to set a default for whether fault-tolerant mode is enabled for new quizzes.

  Background:
    Given the following "courses" exist:
      | fullname | shortname | category |
      | Course 1 | C1        | 0        |
    And I log in as "admin"
    And I am on site homepage

  @javascript
  Scenario: Fault-tolerant mode defaults to disabled.
    When I am on "Course 1" course homepage
    And I turn editing mode on
    And I add a "Quiz" to section "0"
    Then the field "Experimental fault-tolerant mode" matches value "No"

  @javascript
  Scenario: The default can be changed so that fault-tolerant mode is enabled by default.
    When I navigate to "Plugins > Activity modules > Quiz > Quiz fault-tolerant mode" in site administration
    And I set the field "Experimental fault-tolerant mode" to "1"
    And I press "Save changes"
    And I am on "Course 1" course homepage
    And I turn editing mode on
    And I add a "Quiz" to section "0"
    Then the field "Experimental fault-tolerant mode" matches value "Yes"
