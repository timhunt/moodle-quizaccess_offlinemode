<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Simplest possible test of encryption in JS, and decryption in PHP.
 *
 * @package   quizaccess_offlinemode
 * @copyright 2014 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../../../config.php');

$json = optional_param('json', '', PARAM_RAW);

$context = context_system::instance();
require_login();
require_capability('moodle/site:config', $context);

// The test data we will use.
$message = "This is a rather longer test message, because, if the message was short, " .
        "there would not be any problem, we could just encrypt it with RSA. However, " .
        "the real data we have to encrypt are all the responses to a quiz, including " .
        "essay questions, which could be rather long. It will also get tricky if we " .
        "go to a café, or even further afield to 日本 or ราชอาณาจักรไทย. If all that works, " .
        "then we are really in the 💰.";

$CFG->additionalhtmlhead .= '
<style type="text/css">
textarea,
iframe {
    width: 100%;
}
iframe {
    height: 1000px;
    border: 0px none;
}
</style>';

// If we have JSON, then this is the contents of the iframe, so decrypt
// what we got from JavaScript, and show it.
if ($json) {
    decrypt_json($json, $context);
    die;
}

// Create a public/private key pair to use for this test.
$privkey = openssl_pkey_new(array('digest_alg' => 'sha512', 'private_key_bits' => 1024,
        'private_key_type' => OPENSSL_KEYTYPE_RSA));
$pubkeydata = openssl_pkey_get_details($privkey);
$pubkeystr = $pubkeydata["key"];
$pubkey = openssl_pkey_get_public($pubkeystr);

// Start the output.
$PAGE->set_context($context);
$PAGE->set_url('/mod/quiz/accessrule/offlinemode/cryptotest.php');
$PAGE->set_title('JavaScript to PHP crypto test');

echo $OUTPUT->header();

echo $OUTPUT->heading('Values initially set up in PHP');
echo $OUTPUT->heading('Private key', 3);
openssl_pkey_export($privkey, $privkeystr);
echo html_writer::tag('textarea', $privkeystr, array('id' => 'privatekey', 'rows' => 6));

echo $OUTPUT->heading('Public key', 3);
echo html_writer::tag('textarea', $pubkeystr, array('id' => 'publickey', 'rows' => 6));

echo $OUTPUT->heading('Test message', 3);
echo html_writer::tag('textarea', $message, array('id' => 'testmessage', 'rows' => 1));

echo $OUTPUT->heading('Values computed by the JS');
echo html_writer::div('', 'result');

?>
<script type="text/javascript">
//<![CDATA[

Y.use('node', 'json', 'moodle-quizaccess_offlinemode-jsencrypt',
        'moodle-quizaccess_offlinemode-sjcl', function(Y) {

    Y.Crypto.sjcl.random.startCollectors();
    Y.Crypto.sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."]();

    var message = Y.one('#testmessage').get('value');
    var aeskey = Y.Crypto.sjcl.random.randomWords(8);
    var rp = {};
    var encrypted = Y.Crypto.sjcl.encrypt(aeskey, message, { ks: 256, mode: 'cbc' }, rp);

    var publicKeyStr = Y.one('#publickey').get('value');
    var encrypt = new Y.Crypto.JSEncrypt();
    encrypt.setPublicKey(publicKeyStr);

    var data = {
            "message":    Y.JSON.parse(encrypted).ct,
            "key":        encrypt.encrypt(Y.Crypto.sjcl.codec.base64.fromBits(aeskey)),
            "iv":         encrypt.encrypt(Y.Crypto.sjcl.codec.base64.fromBits(rp.iv)),
            "privatekey": Y.one('#privatekey').get('value')
    };

    Y.one('div.result').append('<h3>Cyphertext</h3><textarea>' + data.message + '</textarea>');
    Y.one('div.result').append('<h3>AES key</h3><textarea>' + Y.Crypto.sjcl.codec.base64.fromBits(aeskey) + '</textarea>');
    Y.one('div.result').append('<h3>IV</h3><textarea>' + Y.Crypto.sjcl.codec.base64.fromBits(rp.iv) + '</textarea>');
    Y.one('div.result').append('<h3>Encrypted AES key</h3><textarea>' + data.key + '</textarea>');
    Y.one('div.result').append('<h3>Encrypted IV</h3><textarea>' + data.iv + '</textarea>');

    Y.one('div.result').append('<h2>Decryption of the data passed back to PHP</h2>' +
            '<iframe src="' + M.cfg.wwwroot +
            '/mod/quiz/accessrule/offlinemode/cryptotest.php?json=' +
            encodeURIComponent(Y.JSON.stringify(data)) + '"></iframe>');

});
</script>
<?php

echo $OUTPUT->footer();

/**
 * Decrypt the submitted data.
 * @param string $json the submitted data.
 * @param context $context the page context.
 */
function decrypt_json($json, $context) {
    global $PAGE, $OUTPUT;

    $data = json_decode($json);
    if (!$data) {
        throw new coding_exception('Corrupt JSON.');
    }

    $privkey = openssl_pkey_get_private($data->privatekey);
    $pubkeydata = openssl_pkey_get_details($privkey);
    $pubkeystr = $pubkeydata["key"];
    $pubkey = openssl_pkey_get_public($pubkeystr);

    $PAGE->set_context($context);
    $PAGE->set_url('/mod/quiz/accessrule/offlinemode/cryptotest.php', array('json' => $json));
    $PAGE->set_pagelayout('embedded');
    echo $OUTPUT->header();

    echo $OUTPUT->heading('Private key', 3);
    echo html_writer::tag('textarea', $data->privatekey, array('id' => 'privatekey', 'rows' => 6));

    echo $OUTPUT->heading('Public key', 3);
    echo html_writer::tag('textarea', $pubkeystr, array('id' => 'publickey', 'rows' => 6));

    $aeskey = '';
    openssl_private_decrypt(base64_decode($data->key), $aeskey, $privkey);
    echo $OUTPUT->heading('AES key', 3);
    echo html_writer::tag('textarea', $aeskey, array('rows' => 1));

    $iv = '';
    openssl_private_decrypt(base64_decode($data->iv), $iv, $privkey);
    echo $OUTPUT->heading('IV', 3);
    echo html_writer::tag('textarea', $iv, array('rows' => 1));

    echo $OUTPUT->heading('Cypher text', 3);
    echo html_writer::tag('textarea', $data->message, array('rows' => 1));

    $message = openssl_decrypt($data->message, 'AES-256-CBC',
            base64_decode($aeskey), 0, base64_decode($iv));
    echo $OUTPUT->heading('Decrypted message', 3);
    echo html_writer::tag('textarea', $message, array('rows' => 1));

    echo $OUTPUT->footer();
}
