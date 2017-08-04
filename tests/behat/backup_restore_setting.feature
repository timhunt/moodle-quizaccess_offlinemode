@ou @ou_vle @quizaccess @quizaccess_offlinemode
Feature: Fault-tolerant mode backup and restore of quiz settings
  In order to reuse quizzes using fault-tolerant mode
  As a teacher
  I need be able to backup courses with and without that setting.

  Background:
    Given the following "courses" exist:
      | fullname | shortname | format |
      | Course 1 | C1        | topics |
    And the following "activities" exist:
      | activity   | name                | course | idnumber | offlinemode_enabled |
      | quiz       | Quiz fault-tolerant | C1     | quiz1    | 1                   |
      | quiz       | Quiz normal         | C1     | quiz2    | 0                   |
    And I log in as "admin"

  @javascript
  Scenario: Test that backed up fault-tolerant settings are restored correctly
    When I backup "Course 1" course using this options:
      | Confirmation | Filename | test_backup.mbz |
    And I restore "test_backup.mbz" backup into a new course using this options:
      | Schema | Course name | Course 2 |
    And I follow "Quiz fault-tolerant"
    And I navigate to "Edit settings" node in "Quiz administration"
    Then the field "Experimental fault-tolerant mode" matches value "Yes"
    And I follow "Course 2"
    And I follow "Quiz normal"
    And I navigate to "Edit settings" node in "Quiz administration"
    And the field "Experimental fault-tolerant mode" matches value "No"
