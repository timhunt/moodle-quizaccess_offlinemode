# What needs to be done

1. DONE Clone quizaccess_honestycheck as a starting point.
2. DONE Do a bulk rename honestycheck -> offlinemode.
3. DONE Create git repo to hold the work.
4. Fix up version.php, lang strings, comments, etc.
4. Flesh out this TODO list with what really needs to be done.
5. Create the right DB table.
6. Callback to get the setting on the quiz form, disableIf not deferred feedback & save it.
7. settings.php
8. Behat tests of the forms.
9. Unit tests for the basic bit of the rule class.
10. Intercept attemp.php script (if setting && !DF) (setup attempt page? prevent_...?) and redirect to new script.
11. Our own attempt.php script, that displays all the quetsions in the quiz, in different divs.
12. Create skeleton YUI module and init it.
13. For testing (developer debug?) a button to toggle simulated network disconnection.
14. JavaScript to switch pages, showing and hiding questions.
15. ... then update the navigation appropriately.
16. Behat tests for the navigation.
17. ??? Adapt existing auto-save JS.
18. ??? Client-side auto-save JS (pretty sure this is not needed really). 
19. ??? Ajax calls to save one question and get new HTML.
20. ??? New style warning if ajax not working.
21. Behat tests for the autosaving and warning.
22. ??? Think about custom timing requirements.
23. ??? What happens at the end?
24. Behat tests for final submit.
25. When there are unsaved answers, a local download link.
26. Behat tests for that download (if possible).
27. Encryption of the download.
