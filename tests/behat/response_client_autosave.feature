@quizaccess @quizaccess_offlinemode
Feature: Fault-tolerant mode responses are saved in client storage to guard againse browser crashes.
  To make it even less likely that I will lose my work
  As a student
  I need my responses saved in the browser, so they are not lost if it crashes when the sever is offline.

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
      | activity   | name                | course | idnumber | offlinemode_enabled |
      | quiz       | Quiz fault-tolerant | C1     | quiz1    | 1                   |
    And quiz "Quiz fault-tolerant" contains the following questions:
      | Question A | 1 |
    And I log in as "student"
    And I follow "Course 1"
    And I follow "Quiz fault-tolerant"
    And I press "Attempt quiz now"
    And I click on "True" "radio" in the "#q1" "css_element"

  @javascript
  Scenario: If I leave the quiz when responses are unsaved, when I go back, I can use the unsaved responses.
    When I click on "Quiz fault-tolerant" "link" confirming the dialogue
    And I press "Continue the last attempt"
    Then I should see "There are responses stored on this computer from " in the "Possible unsaved responses" "dialogue"
    And I click "Save these responses and continue" "button" in the "Possible unsaved responses" "dialogue"
    And the state of "Answer me A" question is shown as "Answer saved"

  @javascript
  Scenario: If I leave the quiz when responses are unsaved, when I go back, I can ignore the unsaved responses.
    When I click on "Quiz fault-tolerant" "link" confirming the dialogue
    And I press "Continue the last attempt"
    Then I should see "" in the "Possible unsaved responses" "dialogue"
    And I click "Discard these responses and continue" "button" in the "Possible unsaved responses" "dialogue"
    And the state of "Answer me A" question is shown as "Not yet answered"
    And I reload the page
    And I should not see "Possible unsaved responses"
