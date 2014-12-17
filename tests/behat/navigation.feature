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
      | Test questions   | truefalse | Question B | Answer me B |
      | Test questions   | truefalse | Question C | Answer me C |
    And the following "activities" exist:
      | activity   | name         | course | idnumber | questionsperpage | offlinemode_enabled |
      | quiz       | Quiz offline | C1     | quiz1    | 1                | 1                   |
    And quiz "Quiz offline" contains the following questions:
      | Question A | 1 |
      | Question B | 2 |
      | Question C | 3 |
    And I log in as "student"
    And I follow "Course 1"
    And I follow "Quiz offline"

  @javascript
  Scenario: Start a quiz attempt, and verify we see only page 1.
    When I press "Attempt quiz now"
    Then I should see "Answer me A"
    And I should not see "Answer me B"
    And I should not see "Answer me C"
    And "#quiznavbutton1.thispage" "css_element" should exist
    And "#quiznavbutton2" "css_element" should exist
    And "#quiznavbutton2.thispage" "css_element" should not exist
    And "#quiznavbutton3" "css_element" should exist
    And "#quiznavbutton3.thispage" "css_element" should not exist

  @javascript
  Scenario: Start a quiz attempt and veryify that switching to page 2 works.
    When I press "Attempt quiz now"
    And I start watching to see if a new page loads
    And I click on "Question 2" "link" in the "Quiz navigation" "block"
    Then I should not see "Answer me A"
    And I should see "Answer me B"
    And I should not see "Answer me C"
    And "#quiznavbutton1" "css_element" should exist
    And "#quiznavbutton1.thispage" "css_element" should not exist
    And "#quiznavbutton2.thispage" "css_element" should exist
    And "#quiznavbutton3" "css_element" should exist
    And "#quiznavbutton3.thispage" "css_element" should not exist
    And a new page should not have loaded since I started watching
