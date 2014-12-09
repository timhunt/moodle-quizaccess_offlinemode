# What needs to be done

1. DONE Clone quizaccess_honestycheck as a starting point.
2. DONE Do a bulk rename honestycheck -> offlinemode.
3. DONE Create git repo to hold the work.
4. DONE Fix up version.php, lang strings, comments, etc.
4. DONE Flesh out this TODO list with what really needs to be done.
5. DONE Create the right DB table.
6. DONE Callback to get the setting on the quiz form & save it.
7. DONE Setting disableIf not deferred feedback.
8. DONE settings.php
9. DONE Basic PHPunit tests of the rule.
10. DONE Behat tests of the forms.
11. DONE Unit tests for the basic bit of the rule class.
12. DONE Intercept attemp.php script (if setting && !DF) (setup attempt page? prevent_...?) and redirect to new script.
13. DONE Our own attempt.php script, that displays all the quetsions in the quiz, in different divs.
14. DONE Create skeleton YUI module and init it.
15. DONE JavaScript to switch pages, showing and hiding questions.
16. DONE ... then update the navigation appropriately.
17. DONE Behat tests for the navigation.
18. DONE (MDL-48373) Better Behat steps for creating questions.
19. DONE (MDL-48410) Better Behat steps for adding questions to a quiz.
20. INTEGRATED (MDL-48374) Move Behat steps for reload detection into core.
21. DONE Draw state/dataflow diagram, to help clarify what data needs to go where when.
22. DONE Copy quiz autosave locally, so we can edit it.
23. DONE navigation.js should update the pagenumber in the URL.
24. navigation.js should send page number changes to Moodle to update quiz_attempts.currentpage.
25. DONE When there are unsaved answers, provide a local download link.
26. DONE Compress the download.
27. NOT TESTED!!! Encryption of the download.
28. DONE Admin settings for the encryption public/private key with key generation on install.
29. Behat tests for the download.
30. DONE Script to upload the download - show an upload form
31. DONE Handle the form submission and show the raw file contents.
32. DONE Get that script to process the responses.
33. DONE Add a link to the upload script to the quiz infor page.
34. Behat tests for the upload.
35. For testing (developer debug?) a button to toggle simulated network disconnection.
36. ??? Ajax calls to save one question and get new HTML.
37. ??? New style warning if ajax not working.
38. Behat tests for the autosaving and warning.
39. ??? Client-side auto-save JS.
40. ??? Ajax calls should try to synch the clock.
41. ??? What happens at the end? Summary page?
42. Behat tests for final submit.
43. Sequential navigation mode.
