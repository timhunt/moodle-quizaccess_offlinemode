# Experimental fault-tolerant mode for the quiz
https://moodle.org/plugins/quizaccess_offlinemode

This plugin is designed to allow, as far as possible, a student to continue working
on a deferred-feedback quiz attempt even if the network connection goes down.

This plugin will work in Moodle 3.4 or later. However, we know it does not work
perfectly with all question types. (The project for which this was created only used essays.)

To install, either install from the Moodle plugins database, using the link above,
or install using git:
    git clone https://github.com/timhunt/moodle-quizaccess_offlinemode.git mod/quiz/accessrule/offlinemode
    echo '/mod/quiz/accessrule/offlinemode/' >> .git/info/exclude


For a fuller description, see
[the functionality document](https://github.com/timhunt/moodle-quizaccess_offlinemode/blob/master/internaldoc/functionality.txt).

For a record of development, see
[TODO.md](https://github.com/timhunt/moodle-quizaccess_offlinemode/blob/master/internaldoc/TODO.md)
and [MDL-47688](https://tracker.moodle.org/browse/MDL-47688).

This plugin uses the following third-party libraries:

* The Stanford Javascript Crypto Library from https://github.com/bitwiseshiftleft/sjcl
* JSEncrypt https://github.com/travist/jsencrypt
