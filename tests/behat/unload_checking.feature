@quizaccess @quizaccess_offlinemode
Feature: Offline mode navigation without page reloads
  In order to attempt quizzes with dodgy wifi
  As a student
  I need to be able to navigate between pages of the quiz without a page reload.

  Background:
    Given the following "courses" exist:
      | fullname | shortname | format |
      | Course 1 | C1        | topics |
    And the following "users" exist:
      | username | firstname |
      | student  | Study     |
    And the following "course enrolments" exist:
      | user    | course | role    |
      | student | C1     | student |
    And the following "question categories" exist:
      | contextlevel | reference | name           |
      | Course       | C1        | Test questions |
    And the following "questions" exist:
      | questioncategory | qtype     | name       | questiontext    |
      | Test questions   | truefalse | Question A | Answer me A |
    And the following "activities" exist:
      | activity   | name         | course | idnumber | questionsperpage | offlinemode_enabled |
      | quiz       | Quiz offline | C1     | quiz1    | 1                | 1                   |
    And quiz "Quiz offline" contains the following questions:
      | Question A | 1 |
    And I log in as "student"
    And I follow "Course 1"
    And I follow "Quiz offline"
    And I press "Attempt quiz now"

  @javascript
  Scenario: Can navigate away if you have not changed any responses.
    When I follow "Home"
    Then I should not see "You have made changes. Are you sure you want to navigate away and lose your changes?"

  @javascript @_alert
  Scenario: After changing a response, student is warned if they try to leave, and can cancel.
    When I click on "True" "radio" in the "#q1" "css_element"
    And I click on "Home" "link" dismissing the dialogue
    Then I should see "Answer me A"

  @javascript @_alert
  Scenario: After changing a response, student is warned if they try to leave, but can if they want.
    When I click on "True" "radio" in the "#q1" "css_element"
    And I click on "Home" "link" confirming the dialogue
    Then I should not see "Answer me A"
