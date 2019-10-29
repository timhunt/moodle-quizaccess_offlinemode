@ou @ou_vle @quizaccess @quizaccess_offlinemode
Feature: Fault-tolerant mode warns if you try to leave with unsaved respones.
  In order that I don't lose my work
  As a student
  I should be warned if I try to leave quiz while there are unsaved responses.

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
      | activity   | name                | course | idnumber | questionsperpage | offlinemode_enabled |
      | quiz       | Quiz fault-tolerant | C1     | quiz1    | 1                | 1                   |
    And quiz "Quiz fault-tolerant" contains the following questions:
      | Question A | 1 |
    And I log in as "student"
    And I am on "Course 1" course homepage
    And I follow "Quiz fault-tolerant"
    And I press "Attempt quiz now"

  @javascript
  Scenario: Can navigate away if you have not changed any responses.
    When I follow "C1"
    Then I should not see "You have made changes. Are you sure you want to navigate away and lose your changes?"

  @javascript @_alert
  Scenario: After changing a response, student is warned if they try to leave, but can if they want.
    When I click on "True" "radio" in the "Answer me A" "question"
    And I click on "C1" "link" confirming the dialogue
    Then I should not see "Answer me A"

  @javascript @_alert
  Scenario: After changing a response, student is warned if they try to leave, and can cancel.
    When I click on "True" "radio" in the "Answer me A" "question"
    And I click on "C1" "link" dismissing the dialogue
    Then I should see "Answer me A"
    # Now successfully navigate away, or the following test will fail.
    And I click on "C1" "link" confirming the dialogue
