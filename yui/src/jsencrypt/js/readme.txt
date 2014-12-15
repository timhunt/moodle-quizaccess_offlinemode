This code mainly comes from https://github.com/travist/jsencrypt. That is,
the files jsencrypt.js and license.txt.

There are two lines added near the end of jsencrypt.js to allow access to the
SecureRandom class. The added lines are marked // Added for quizaccess_offlinemode.

package.js was created here, to integrate with the YUI module system. This
also adds an implementation of RC4 (public domain licence) from
https://gist.github.com/farhadi/2185197
