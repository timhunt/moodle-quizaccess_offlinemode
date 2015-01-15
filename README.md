# Experimental fault-tolerant mode for the quiz

This plugin is designed to allow, as far as possible, a student to continue working
on a deferred-feedback quiz attempt even if the network connection goes down.

For a fuller description, see
[the functionality document](https://github.com/timhunt/moodle-quizaccess_offlinemode/blob/master/internaldoc/functionality.txt).

For a record of development, see
[TODO.md](https://github.com/timhunt/moodle-quizaccess_offlinemode/blob/master/internaldoc/TODO.md)
and [MDL-47688](https://tracker.moodle.org/browse/MDL-47688).

This plugin will work in Moodle 2.7 or later. However, it requires various patches
that are only in 2.7.5 or 2.8.3 or later. To use it with earlier versions, you need
to cherry-pick selected fixes, as detailed in the functionality document.

This plugin uses the following third-party libraries:

* The Stanford Javascript Crypto Library from https://github.com/bitwiseshiftleft/sjcl
* JSEncrypt https://github.com/travist/jsencrypt
