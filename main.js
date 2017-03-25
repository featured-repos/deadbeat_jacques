$(document).ready(function() {

  // apiRoot = "https://dry-shore-32365.herokuapp.com/"
  apiRoot = "http://localhost:3000/"

  function getTagNames(tags) {
    tagsList = tags.map(function(tag) {
      return `
        <div class="row">
          <a href="${ tag.name }" class="tag-click"> ${ tag.name } </a>
        </div>
      `
    })
    return tagsList.join("")
  }

  function displayNote(note) {
    return `
      <div class="row">
        <div class="row">
          <p> ${ note.title } </p>
        </div>
        <div class="row">
          <p> ${ note.body } </p>
        </div>
        <div class="row">
          <p> Posted by ${ usernameFor(note) } at ${ note.created_at } </p>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <p> ${ getTagNames(note.tags) } </p>
          </div>
        </div>
      </div>
    `
  }

  function usernameFor(note) {
    if(note.user === null) {
      return "Anonymous"
    } else {
      return note.user.username
    }
  }

  function showNotesList() {
    $.getJSON(apiRoot + "api/notes")
     .done(function(response) {
       response.notes.forEach(function(note) {
         $("#notes-list").append(
           displayNote(note)
         )
       })
     })
  }

  showNotesList()

  $(document).on("click", ".tag-click", function(ev) {
    ev.preventDefault()
      tag = $(ev.target).attr("href")
      displayNotesByTag(tag)
  })

  function displayNotesByTag(tag) {
    $("#notes-list").empty()
    $.getJSON(apiRoot + "api/notes/tag/" + tag)
      .done(function(response) {
        response.tag.notes.forEach(function(note) {
          $("#notes-by-tag").append(
          displayNote(note)
          )
        })
      })
    }

  $(document).on("submit", "#post-note", function(ev) {
    ev.preventDefault()
    $.post(apiRoot + "api/notes", $(this).serialize())
      .done(function(response) {
        $("#notes-list").prepend(
          displayNote(response.note))
        })
    showNotesList()
  })


  function openNoteModal() {
    if(window.location.hash) {
      noteIdNum = window.location.hash.substring(1)
      $.getJSON(apiRoot + "api/notes/" + noteIdNum )
        .done(function(response) {
          $("#note-modal .modal-body").html(displayNote(response.note))
          $("#note-modal").modal("show")
      })
    }
  }

  openNoteModal()


})
