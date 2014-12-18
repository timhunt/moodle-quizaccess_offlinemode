@quizaccess @quizaccess_offlinemode
Feature: Download responses, encrypted, on the client-side, and re-upload.
  In order to attempt quizzes with dodgy wifi that dies and never comes back
  As a student or invigilator
  I need to be able to download my responses on the client-side, and later upload them to the quiz.

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
      | Test questions   | truefalse | Question B | Answer me B |
      | Test questions   | truefalse | Question C | Answer me C |
    And the following "activities" exist:
      | activity   | name         | course | idnumber | questionsperpage | offlinemode_enabled |
      | quiz       | Quiz offline | C1     | quiz1    | 1                | 1                   |
    And quiz "Quiz offline" contains the following questions:
      | Question A | 1 |
      | Question B | 1 |
      | Question C | 1 |
    And I log in as "student"
    And I follow "Course 1"
    And I follow "Quiz offline"
    And I press "Attempt quiz now"
    And I click on "True" "radio" in the "#q1" "css_element"
    And I click on "False" "radio" in the "#q2" "css_element"
    And I click on "True" "radio" in the "#q3" "css_element"

  @javascript
  Scenario: Download the responses so far, then re-upload them.
    When I follow the emergency download link
    And I click on "Home" "link" confirming the dialogue
    And I log out
    And I log in as "admin"
    And I follow "Course 1"
    And I follow "Quiz offline"
    And I follow "upload exported responses"
    And I upload the saved responses file to "Response files" filemanager
    And I press "Upload responses"
    Then I should see "Processing file"
    And I should see "Data processed successfully"
    And I follow "Review this attempt"
    And the state of "Answer me A" question is shown as "Answer saved"
    And the state of "Answer me B" question is shown as "Answer saved"
    And the state of "Answer me C" question is shown as "Answer saved"
