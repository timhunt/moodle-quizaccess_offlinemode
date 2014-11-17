# What needs to be done

1. DONE Clone quizaccess_honestycheck as a starting point.
2. DONE Do a bulk rename honestycheck -> offlinemode.
3. DONE Create git repo to hold the work.
4. DONE Fix up version.php, lang strings, comments, etc.
4. DONE Flesh out this TODO list with what really needs to be done.
5. DONE Create the right DB table.
6. DONE Callback to get the setting on the quiz form, disableIf not deferred feedback & save it.
7. DONE settings.php
8. DONE Basic PHPunit tests of the rule.
9. Behat tests of the forms.
10. DONE Unit tests for the basic bit of the rule class.
11. Intercept attemp.php script (if setting && !DF) (setup attempt page? prevent_...?) and redirect to new script.
12. Our own attempt.php script, that displays all the quetsions in the quiz, in different divs.
13. Create skeleton YUI module and init it.
14. For testing (developer debug?) a button to toggle simulated network disconnection.
15. JavaScript to switch pages, showing and hiding questions.
16. ... then update the navigation appropriately.
17. Behat tests for the navigation.
18. ??? Adapt existing auto-save JS.
19. ??? Client-side auto-save JS (pretty sure this is not needed really). 
20. ??? Ajax calls to save one question and get new HTML.
21. ??? New style warning if ajax not working.
22. Behat tests for the autosaving and warning.
23. ??? Think about custom timing requirements.
24. ??? What happens at the end?
25. Behat tests for final submit.
26. When there are unsaved answers, a local download link.
27. Behat tests for that download (if possible).
28. Encryption of the download.
