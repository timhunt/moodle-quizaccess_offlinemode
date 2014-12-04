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
19. PR (MDL-48373) Better Behat steps for adding questions to a quiz.
20. INTEGRATED (MDL-48374) Move Behat steps for reload detection into core.
21. Draw state/dataflow diagram, to help clarify what data needs to go where when.
22. For testing (developer debug?) a button to toggle simulated network disconnection.
23. ??? Adapt existing auto-save JS.
24. Ajax should also send page number changes to update quiz_attempts.currentpage.
25. ??? Client-side auto-save JS.
26. ??? Ajax calls to save one question and get new HTML.
27. ??? New style warning if ajax not working.
28. Behat tests for the autosaving and warning.
29. ??? Think about custom timing requirements.
30. ??? What happens at the end? Summary page?
31. Behat tests for final submit.
32. When there are unsaved answers, a local download link.
33. Behat tests for that download (if possible).
34. Encryption of the download.
35. Sequential navigation mode.
