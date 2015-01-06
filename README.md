# Experimental fault-tolerant mode for the quiz

This code is designed to allow, as far as possible, a student to continue working
on a quiz attempt even if the network connection goes down.

This is currently work-in progress.
See [TODO.md](https://github.com/timhunt/moodle-quizaccess_offlinemode/blob/master/TODO.md)
and [MDL-47688](https://tracker.moodle.org/browse/MDL-47688) for details.


This plugin uses the following third-party libraries:

* The Stanford Javascript Crypto Library from https://github.com/bitwiseshiftleft/sjcl
* JSEncrypt https://github.com/travist/jsencrypt
