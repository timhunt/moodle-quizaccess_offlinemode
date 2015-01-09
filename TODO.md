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
59. If the Moodle session is lost, some way to reestablish it without reloading.
60. Route all connections through a connection manager to monitor network sate.
61. Use network state to display a warning, and only show download link when there are problems.
62. The warning should make it clear what to do, including use of the download.
63. For testing (developer debug?) a button to toggle simulated network disconnection.
64. Behat tests for the warning.
65. Final submit should first send the data, and only redirect if successful.
66. Behat tests for final submit.
67. ??? Client-side auto-save JS.
68. ??? Ajax calls should try to synch the clock.
69. All the usual complexity around the end of time.
70. Sequential navigation mode.
71. DONE Logging.
72. DONE Flagging need to update the summary.
73. NO Should flagging Ajax go through the same ajax managers as everything else?
