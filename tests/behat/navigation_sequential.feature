@ou @ou_vle @quizaccess @quizaccess_offlinemode
Feature: Fault-tolerant mode navigation without page reloads for a quiz in sequential mode.
  In order to attempt quizzes with dodgy wifi
  As a student
  I need to be able to navigate between pages of the quiz even if the quiz uses sequential navigation.

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
      | activity   | name                | course | idnumber | offlinemode_enabled | navmethod  |
      | quiz       | Quiz fault-tolerant | C1     | quiz1    | 1                   | sequential |
    And quiz "Quiz fault-tolerant" contains the following questions:
      | Question A | 1 |
      | Question B | 2 |
      | Question C | 3 |
    And I log in as "student"
    And I am on "Course 1" course homepage
    And I follow "Quiz fault-tolerant"

  @javascript
  Scenario: Start a quiz attempt in sequential mode, and verify we see only page 1.
    When I press "Attempt quiz now"
    Then I should see "Answer me A"
    And I should not see "Answer me B"
    And I should not see "Answer me C"
    And I should not see "Summary of attempt"
    And "#quiznavbutton1.thispage" "css_element" should exist
    And "#quiznavbutton2" "css_element" should exist
    And "#quiznavbutton2.thispage" "css_element" should not exist
    And "#quiznavbutton3" "css_element" should exist
    And "#quiznavbutton3.thispage" "css_element" should not exist

  @javascript
  Scenario: Clicking on a nav button has no effect.
    When I press "Attempt quiz now"
    And I click on "#quiznavbutton2" "css_element"
    Then I should see "Answer me A"
    And I should not see "Answer me B"
    And I should not see "Answer me C"
    And I should not see "Summary of attempt"
    And "#quiznavbutton1.thispage" "css_element" should exist
    And "#quiznavbutton2" "css_element" should exist
    And "#quiznavbutton2.thispage" "css_element" should not exist
    And "#quiznavbutton3" "css_element" should exist
    And "#quiznavbutton3.thispage" "css_element" should not exist

  @javascript
  Scenario: Start a quiz attempt and verify that next works.
    When I press "Attempt quiz now"
    And I start watching to see if a new page loads
    And I press "Next"
    Then I should not see "Answer me A"
    And I should see "Answer me B"
    And I should not see "Answer me C"
    And I should not see "Summary of attempt"
    And "#quiznavbutton1" "css_element" should exist
    And "#quiznavbutton1.thispage" "css_element" should not exist
    And "#quiznavbutton2.thispage" "css_element" should exist
    And "#quiznavbutton3" "css_element" should exist
    And "#quiznavbutton3.thispage" "css_element" should not exist
    And a new page should not have loaded since I started watching
    # Now successfully navigate away, or the following test will fail.
    And I click on "C1" "link" confirming the dialogue

  @javascript
  Scenario: Start a quiz attempt in sequential mode and verify that switching to the summary works.
    When I press "Attempt quiz now"
    And I start watching to see if a new page loads
    And I click on "Finish attempt ..." "link" in the "Quiz navigation" "block"
    Then I should not see "Answer me A"
    And I should not see "Answer me B"
    And I should not see "Answer me C"
    And I should see "Summary of attempt"
    And "#quiznavbutton1" "css_element" should exist
    And "#quiznavbutton1.thispage" "css_element" should not exist
    And "#quiznavbutton2" "css_element" should exist
    And "#quiznavbutton2.thispage" "css_element" should not exist
    And "#quiznavbutton3" "css_element" should exist
    And "#quiznavbutton3.thispage" "css_element" should not exist
    And a new page should not have loaded since I started watching

  @javascript
  Scenario: Start a quiz attempt and verify that switching back from the summary works.
    When I press "Attempt quiz now"
    And I start watching to see if a new page loads
    And I click on "Finish attempt ..." "link" in the "Quiz navigation" "block"
    And I press "Return to attempt"
    Then I should see "Answer me A"
    And I should not see "Answer me B"
    And I should not see "Answer me C"
    And I should not see "Summary of attempt"
    And "#quiznavbutton1.thispage" "css_element" should exist
    And "#quiznavbutton2" "css_element" should exist
    And "#quiznavbutton2.thispage" "css_element" should not exist
    And "#quiznavbutton3" "css_element" should exist
    And "#quiznavbutton3.thispage" "css_element" should not exist
    And a new page should not have loaded since I started watching
