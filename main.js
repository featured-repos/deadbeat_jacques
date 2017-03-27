$(document).ready(function() {

  apiRoot = "https://dry-shore-32365.herokuapp.com/"
  // apiRoot = "http://localhost:3000/"

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
    if(!signedIn()) {
      $.getJSON(apiRoot + "api/notes")
       .done(function(response) {
         response.notes.forEach(function(note) {
           $("#notes-list").append(
             displayNote(note)
           )
         })
       })
    } else {
      displayNotesByUser()
    }
  }

  showNotesList()

  // display notes by tag
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
          $("#notes-list").append(
          displayNote(note)
          )
        })
        $("#page-header").html(
          `
          Notemeister 5000: ${ response.tag.name }
          `
        )
      })
    }

  // post new note
  $(document).on("submit", "#post-note", function(ev) {
    ev.preventDefault()
    if(signedIn()) {
      $.post(apiRoot + "api/notes?api_token=" + getToken(), $(this).serialize())
        .done(function(response) {
          $("#notes-list").prepend(
            displayNote(response.note))
        })
    } else {
    $.post(apiRoot + "api/notes", $(this).serialize())
      .done(function(response) {
        $("#notes-list").prepend(
          displayNote(response.note))
        })
    }
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

  function setToken(token) {
    localStorage.setItem("token", token)
  }

  function getToken() {
    return localStorage.getItem("token")
  }

  function signedIn() {
    if(localStorage.getItem("token") === null ) {
      return false
    } else {
      return true
    }
  }

  function logOut() {
    localStorage.removeItem("token")
  }

  function toggleSignIn() {
    if(signedIn()) {
      $(".logged-in").show()
      $(".logged-out").hide()
    } else {
      $(".logged-in").hide()
      $(".logged-out").show()
    }
  }

  toggleSignIn()

  function displayNotesByUser() {
    if(signedIn()) {
      $("#notes-list").empty()
      $.getJSON(apiRoot + "api/users/notes?api_token=" + getToken())
        .done(function(response) {
          if(response.notes.length === 0) {
            $("#notes-list").html(
              `
              <h1> You don't have any notes </h1>
              `
            )
          } else {
          response.notes.forEach(function(note) {
            $("#notes-list").append(
              `
              ${ displayNote(note) }
              <button type="button" class="btn btn-primary edit-button" data-toggle="modal" data-note-id="${ note.id }">Edit note</button>
              `
            )
          })
        }
      })
    }
  }


  // create new account
  $(document).on("submit", "#signup", function(ev) {
    ev.preventDefault()
    $.post(apiRoot + "api/users", $(this).serialize())
      .done(function(response) {
        $("#signup-modal").modal("hide")
        setToken(response.user.api_token)
        toggleSignIn()
        displayNotesByUser()
      })
  })

  // sign in
  $(document).on("submit", "#log-in", function(ev) {
    ev.preventDefault()
    $.post(apiRoot + "api/login", $(this).serialize())
      .done(function(response) {
        setToken(response.user.api_token)
        toggleSignIn()
        resetForm("#log-in")
        displayNotesByUser()
    })
  })

  function resetForm(formId){
   $(formId)[0].reset()
  }

  // log out
  $(document).on("click", "#log-out", function(ev) {
    ev.preventDefault()
    logOut()
    $("#notes-list").empty()
    toggleSignIn()
    showNotesList()
  })

  // open edit-note-modal
  $(document).on("click", ".edit-button", function(ev) {
    ev.preventDefault()
    $.get(apiRoot + "api/notes/" + $(this).data("note-id"))
      .done(function(response) {
        $("#edit-note-title").val(response.note.title)
        $("#edit-note-body").val(response.note.body)
        // $("#edit-note-tags").val(getTagsString(response.note.tags))  tags are not part of note_params because they're a stupid array
        $("#edit-note-modal").modal("show")
      })
    $("#edit-note-id").val($(this).data("note-id"))
  })

  function getTagsString(tags) {
    tagsList = tags.map(function(tag) {
      return tag.name
    })
    return tagsList.join(", ")
  }

  // submit edit note
  $(document).on("submit", "#edit-note-form", function(ev) {
    ev.preventDefault()
    $.ajax({
      method: "PUT",
      url: apiRoot + "api/notes/" + $("#edit-note-id").val() + "?api_token=" + getToken(),
      data: $(this).serialize()
    })
    .done(function() {
      displayNotesByUser()
      $("#edit-note-modal").modal("hide")
    })
  })





})  // document.ready
