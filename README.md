# deadbeat_jacques
 https://lmoore154.github.io/deadbeat_jacques/

Requirements

Explorer Mode
- If your Notemeister API (from the Jacques assignment) isn't complete through Explorer Mode, you'll need to finish it up
- On load, your app should display all the notes and a form to add a new note. The primary heading on the page should be "Notemeister 5000"
- Tag names should be links that when clicked, load the notes with that tag and change the primary heading to "Notemeister 5000: {{tag name}}"
- Posting a new note should add it to the top of the list and clear out the form so you can post another
- If I append the id of a note to the url (as: #:id), a Bootstrap modal should display with just that specific note.

Adventure Mode
- If your Jacques API is not complete up through Adventure Mode (minus tests unless you're feeling froggy), do so
- Add sign up functionality through a modal window
- Add login functionality through a modal window
- Once signed up/logged in, notes are posted as a specific user and the only notes displayed are that user's
- Notes now have an edit link/button that pops open a modal window with a form to edit the note

Epic Mode
- Support one image attachment per note - using refile and refile-postgres on the Rails end and jQuery File Upload (or similar, like using a formData object) on the front.
- Have a sidebar with all the user's image uploads that display in a modal-based photo gallery

Note: You'll need to have your Notemeister API deployed to Heroku and CORS-capable to complete this assignment as well
