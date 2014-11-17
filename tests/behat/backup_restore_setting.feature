@quizaccess @quizaccess_offlinemode
Feature: Offline mode backup and restore of quiz settings
  In order to reuse quizzes using offline mode
  As an teacher
  I need be able to backup courses with and whithout that setting.

  Background:
    Given the following "courses" exist:
      | fullname | shortname | format |
      | Course 1 | C1        | topics |
    And the following "activities" exist:
      | activity   | name         | course | idnumber | offlinemode_enabled |
      | quiz       | Quiz offline | C1     | quiz1    | 1                   |
      | quiz       | Quiz online  | C1     | quiz2    | 0                   |
    And I log in as "admin"

  @javascript
  Scenario: Change the setting for a quiz from off to on.
    When I backup "Course 1" course using this options:
      | Confirmation | Filename | test_backup.mbz |
    And I restore "test_backup.mbz" backup into a new course using this options:
      | Schema | Course name | Course 2 |
    And I follow "Quiz offline"
    And I navigate to "Edit settings" node in "Quiz administration"
    Then the field "Experimental offline attempt mode" matches value "Yes"
    And I follow "Course 2"
    And I follow "Quiz online"
    And I navigate to "Edit settings" node in "Quiz administration"
    And the field "Experimental offline attempt mode" matches value "No"
