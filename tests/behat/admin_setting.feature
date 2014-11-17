@quizaccess @quizaccess_offlinemode
Feature: Quiz offline mode admin setting
  In order to save teachers time
  As an admin
  I need to set a default for whether offline mode is enabled for new quizzes.

  Background:
    Given the following "courses" exist:
      | fullname | shortname | category |
      | Course 1 | C1        | 0        |
    And I log in as "admin"

  @javascript
  Scenario: Offline mode defaults to disabled.
    # Add a quiz to a course without the condition, and verify that they can start it as normal.
    When I follow "Course 1"
    And I turn editing mode on
    And I add a "Quiz" to section "0"
    Then the field "Experimental offline attempt mode" matches value "No"

  @javascript
  Scenario: Set the default so that offline mode to enabled (the default).
    # Add a quiz to a course without the condition, and verify that they can start it as normal.
    When I navigate to "Quiz offline attempt mode" node in "Site administration > Plugins > Activity modules > Quiz"
    And I set the field "Experimental offline attempt mode" to "1"
    And I press "Save changes"
    And I follow "Home"
    And I follow "Course 1"
    And I turn editing mode on
    And I add a "Quiz" to section "0"
    Then the field "Experimental offline attempt mode" matches value "Yes"
