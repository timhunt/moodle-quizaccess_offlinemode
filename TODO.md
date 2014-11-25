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
18. (MDL-48373) Better behat steps for creating questions and putting them in a quiz.
19. (MDL-48374) Propose moving behat steps for reload detection into core.
20. For testing (developer debug?) a button to toggle simulated network disconnection.
21. ??? Adapt existing auto-save JS.
22. Ajax should also send page number changes to update quiz_attempts.currentpage.
23. ??? Client-side auto-save JS.
24. ??? Ajax calls to save one question and get new HTML.
25. ??? New style warning if ajax not working.
26. Behat tests for the autosaving and warning.
27. ??? Think about custom timing requirements.
28. ??? What happens at the end? Summary page?
29. Behat tests for final submit.
30. When there are unsaved answers, a local download link.
31. Behat tests for that download (if possible).
32. Encryption of the download.
33. Sequential navigation mode.
