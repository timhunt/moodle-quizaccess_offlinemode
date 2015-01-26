# What needs to be done

1.  DONE Clone quizaccess_honestycheck as a starting point.
2.  DONE Do a bulk rename honestycheck -> offlinemode.
3.  DONE Create git repo to hold the work.
4.  DONE Fix up version.php, lang strings, comments, etc.
5.  DONE Flesh out this TODO list with what really needs to be done.
6.  DONE Create the right DB table.
7.  DONE Callback to get the setting on the quiz form & save it.
8.  DONE Setting disableIf not deferred feedback.
9.  DONE settings.php
10. DONE Basic PHPunit tests of the rule.
11. DONE Behat tests of the forms.
12. DONE Unit tests for the basic bit of the rule class.
13. DONE Intercept attemp.php script (if setting && !DF) (setup attempt page? prevent_...?) and redirect to new script.
14. DONE Our own attempt.php script, that displays all the quetsions in the quiz, in different divs.
15. DONE Create skeleton YUI module and init it.
16. DONE JavaScript to switch pages, showing and hiding questions.
17. DONE ... then update the navigation appropriately.
18. DONE Behat tests for the navigation.
19. INTEGRATED (MDL-48373) Better Behat steps for creating questions.
20. INTEGRATED (MDL-48410) Better Behat steps for adding questions to a quiz.
21. INTEGRATED (MDL-48374) Move Behat steps for reload detection into core.
22. DONE Draw state/dataflow diagram, to help clarify what data needs to go where when.
23. DONE Copy quiz autosave locally, so we can edit it.
24. DONE navigation.js should update the pagenumber in the URL.
25. DONE navigation.js should send page number changes to Moodle to update quiz_attempts.currentpage.
26. DONE When there are unsaved answers, provide a local download link.
27. DONE Compress the download.
28. FAILED Encryption of the download.
29. DONE Admin settings for the encryption public/private key with key generation on install.
30. DONE Behat tests for the download.
31. DONE Script to upload the download - show an upload form
32. DONE Handle the form submission and show the raw file contents.
33. DONE Get that script to process the responses.
34. DONE Add a link to the upload script to the quiz infor page.
35. DONE AES instead of RC4.
36. DONE Simple(!) test script to round-trip encryption in JS -> decryption in PHP.
37. DONE Transfer working crypto from cryptotest to the real code.
38. INTEGRATED MDL-48639 fix Behat upload code.
39. DONE Behat tests for the upload.
40. DONE Add review attempt link to upload results.
41. DONE Fix hard-coded strings in download and upload.
42. DONE Autosave should update Q state to 'Answer changed' when it is.
43. DONE Autosave should get real Q state back from PHP, and update Q states.
44. INTEGRATED MDL-48653 Should have dismiss alert steps to match accept alert Behat steps.
45. DONE Autosave should be enough to reassure formchangechecker.
46. DONE Behat tests for the autosaving of states.
47. DONE Render the summary page into the HTML.
48. DONE Make navigating to & from the summary page work.
49. INTEGRATED MDL-48666 It's not possible to intentify the rows in the quiz summary table from JS.
50. DONE Update the summary page when we update question states.
51. DONE Make the question number links in the summary table work.
52. DONE Make Next & Return to attempts buttons work.
53. DONE Scroll sensibly when navigating between pages.
54. DONE Fix flag JS.
55. DONE Rename, in the UI and comments, to fault-tolerant mode.
56. DONE Update the navigation panel with question state changes.
57. DONE Behat tests for the summary page & nav panel button statuses.
58. DONE On the upload screen, add a 'Submit attempts after processing the upload' option.
59. DONE Logging.
60. DONE Flagging need to update the summary.
61. DONE Final submit should first send the data, and only redirect if successful.
62. DONE Behat tests for final submit.
63. DONE If final submit fails, show appropriate help, including the download link.
64. DONE Responses from HTML editors not saved properly on upload.
65. DONE Correctly track unsaved changes state through faile saves.
66. DONE Improved warning about the current state of the network connection.
67. INTEGRATED MDL-48829 class name on quiz nav buttons to indicate which page that question is on.
68. DONE Sequential navigation mode.
69. DONE If the Moodle session is lost, some way to re-establish it without reloading.
70. DONE Write the functionality document.
71. DONE Test in IE.
72. DONE Test in ouvle.
73. INTEGRATED MDL-48859 Back-port a useful step from MDL-43835
74. INTEGRATED MDL-48860 Behat tests checking the value of selects do not work properly in 2.7
75. DONE HTML validation of each page.
76. DONE Complete the handover checklist.
77. DONE Is there a reliable way to pre-load all required images? #17067
78. DONE After auto re-login, verify user id still matches before replacing sesskey!
79. DONE Customise lang strings for the OU. #17070
80. DONE Do we want to style the submit failure message more like the autosave message? #17068
81. Client-side auto-save JS - can we do it by forcing a submit of the saved data & reloading?
82. Client-side auto-save data should be encrypted.
83. Deal with the problem of initialising things on other pages. (Editor size #17049. Drag-drop.)
84. ??? Think about all the usual complexity around the end of time.
