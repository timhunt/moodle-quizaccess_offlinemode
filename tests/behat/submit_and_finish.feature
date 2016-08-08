@ou @ou_vle @quizaccess @quizaccess_offlinemode
Feature: Fault-tolerant mode submit only leaves if the submit works
  In order to attempt quizzes with dodgy wifi
  As a student
  I need the submit and finish to be processed asynchronously.

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
    And I follow "Course 1"
    And I follow "Quiz fault-tolerant"
    And I press "Attempt quiz now"
    And I click on "True" "radio" in the "#q1" "css_element"
    And I click on "Finish attempt ..." "link" in the "Quiz navigation" "block"

  @javascript
  Scenario: Submit and finish an attempt - working.
    When I press "Submit all and finish"
    And I click on "Submit all and finish" "button" in the "Confirmation" "dialogue"
    Then I should see "Finished" in the "State" "table_row"
    And the state of "Answer me A" question is shown as "Correct"

  @javascript
  Scenario: Submit and finish an attempt - failure.
    When I simulate losing the network by changing the submit URL
    And I press "Submit all and finish"
    And I click on "Submit all and finish" "button" in the "Confirmation" "dialogue"
    Then I should see "Submit failed"
    And I should see "Your responses could not be submitted. You can either try again ..."
    And I should see "as a file which can be processed later"
    And "Submit all and finish" "button" should be visible
    And "save the responses" "link" should be visible
    # Now successfully navigate away, or the following test will fail.
    And I click on "Miscellaneous" "link" confirming the dialogue
