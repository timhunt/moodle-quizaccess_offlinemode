@quizaccess @quizaccess_offlinemode
Feature: Offline mode quiz setting
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
    And the following "activities" exist:
      | activity   | name         | course | idnumber | questionsperpage | offlinemode_enabled |
      | quiz       | Quiz offline | C1     | quiz1    | 1                | 1                   |
    And I log in as "admin"
    And I follow "Course 1"
    And I add a "True/False" question to the "Quiz offline" quiz with:
      | Question name | Question A  |
      | Question text | Answer me A |
    And I add a "True/False" question to the "Quiz offline" quiz with:
      | Question name | Question B  |
      | Question text | Answer me B |
    And I add a "True/False" question to the "Quiz offline" quiz with:
      | Question name | Question C  |
      | Question text | Answer me C |
    And I press "Repaginate"
    And I set the field "menuquestionsperpage" to "1"
    And I press "Go"
    And I log out
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
    And I mark the page to detect reloads
    And I click on "Question 2" "link" in the "Quiz navigation" "block"
    Then I should not see "Answer me A"
    And I should see "Answer me B"
    And I should not see "Answer me C"
    And "#quiznavbutton1" "css_element" should exist
    And "#quiznavbutton1.thispage" "css_element" should not exist
    And "#quiznavbutton2.thispage" "css_element" should exist
    And "#quiznavbutton3" "css_element" should exist
    And "#quiznavbutton3.thispage" "css_element" should not exist
    And the page should not have reloaded since it was marked
