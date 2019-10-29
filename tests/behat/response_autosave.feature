@ou @ou_vle @quizaccess @quizaccess_offlinemode
Feature: Fault-tolerant mode updates the question statuses are responses are changed and saved
  In order to know what is going on during my attempt
  As a student
  I need to be able to see which responeses I have changed, and when they are saved.

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
    And the quiz auto-save period is set to "2"
    And I log in as "student"
    And I am on "Course 1" course homepage
    And I follow "Quiz fault-tolerant"

  @javascript
  Scenario: When a response is saved, the question state changes to "Answer changed".
    When I press "Attempt quiz now"
    And I click on "True" "radio" in the "Answer me A" "question"
    Then the state of "Answer me A" question is shown as "Answer changed"
    And "#quiznavbutton1.answersaved" "css_element" should exist
    And I click on "Finish attempt ..." "link" in the "Quiz navigation" "block"
    And I should see "Answer changed" in the "1" "table_row"
    # Now successfully navigate away, or the following test will fail.
    And I click on "C1" "link" confirming the dialogue

  @javascript
  Scenario: When a response is changed, it is auto-saved & the status changes to "Answer saved"
    When I press "Attempt quiz now"
    And I click on "True" "radio" in the "Answer me A" "question"
    And I wait "3" seconds
    Then the state of "Answer me A" question is shown as "Answer saved"
    And "#quiznavbutton1.answersaved" "css_element" should exist
    And I click on "Finish attempt ..." "link" in the "Quiz navigation" "block"
    And I should see "Answer saved" in the "1" "table_row"
