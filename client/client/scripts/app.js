var app = {
  // variables and defaults
  testmessage: {username: 'shawndrost', text: 'adsf1234', roomname: '4chan'},
  //server: 'https://api.parse.com/1/classes/chatterbox',
  server:  "http://127.0.0.1:3000/classes/messages",
  username: 'anonymous',
  roomname: 'lobby',
  friends: {},


  init: function(){
    //$('#roomSelect').val(app.roomname);
    app.fetch();
    //setInterval(app.fetch, 5000);
    //get username from window
    app.username = window.location.search.substr(10);

    // Cached jQuery Selectors
    app.$roomSelect = $('#roomSelect');
    app.$chats = $('#chats');
    app.$message = $('#message');
    app.$send = $('#send');

    // Listeners
     //app.$send.on('.submit', app.handleSubmit);
     $('.submit').click(app.handleSubmit)
     app.$roomSelect.change(app.handleRoomSelect);

     app.$chats.on('click', '.username', app.addFriend);
     app.$message.keypress(function (e) {
         if (e.keyCode == 13) {
            alert('adsf')
             app.handleSubmit;
         }
     });
  },

  send: function(message){
    console.log("send method", message)
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent. ', data);
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send. Error: ', data);
      }
    });
  },

  fetch: function(){

    $.ajax({
      url: app.server,
      type: 'GET',
      // data: 'order=-createdAt',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: ', data);
        //send returned data to populateMessages
        app.clearMessages();
        app.populateMessages(data.results);
        app.populateRooms(data.results);
        $('#roomSelect').val(app.roomname);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch. Error: ', data);
      }
    });
  },

  clearMessages: function(){
    //remove children from #chat div
    $('#chats').children().remove();
  },

  populateMessages: function(data){
    _.each(data, function(item){
      var message = {};
      message.roomname = item.roomname;
      message.username = item.username;
      message.text = item.text;

      if (app.$roomSelect.val() === item.roomname) {
      app.addMessage(message);
      }
    })
    $('.username').click(app.addFriend)

  },

  populateRooms: function(data){
    // convert data to array
    var roomArray = [];
    _.each(data, function(item){
      if(item === "" || item === undefined || item === 'undefined' || item === null){
        roomArray.push('lobby')
      } else{
        roomArray.push(item.roomname);
      }
    })
    var uniqueArray = _.uniq(roomArray);


    // clear previous rooms from select element
    $('#roomSelect').children().remove();

    _.each(uniqueArray, function(item){
      app.addRoom(item);
      // $('#roomSelect').append('<option>' + item + '</option>');
    })
  },

  addMessage: function(obj){
    var $username = $('<span>').text(obj.username + ": ").attr('class','username').data('username', obj.username);
    var $message = $('<span>').text(obj.text);
    var $divwrap = $('<div>').append($username).append($message);
    $('#chats').append($divwrap);


  //  $('#chats').append("<div>" + "<span class='username'>" + obj.username + ": </span>" + "<span>" + obj.text + "</span></div>" )
  },

  addRoom: function(roomname){
    $('#roomSelect').append('<option>' + roomname + '</option>')
  },

  addFriend: function(evt){
    console.log("addFriend called");
    var username = $(evt.currentTarget).data('username')
    //var username = $(evt.currentTarget).html().substring(0, $(evt.currentTarget).html().length - 2);

    if (username !== undefined) {
      console.log('chatterbox: Adding %s as a friend', username);

      app.friends[username] = true;

      var selector = '[data-username="'+username.replace(/"/g, '\\\"')+'"]';
      $(selector).addClass('friend');

}


  },

  handleSubmit: function(){
    console.log('handleSubmit called')
    var message = {};
    message.username = app.username;
    message.roomname = $('#roomSelect').val();
    message.text = $('#message').val();
    app.send(message);
    //clear text
    $('#message').val('');
  },

  handleRoomSelect: function(){
    console.log('handleRoomSelect called');
    app.roomname = app.$roomSelect.val();
    app.fetch();
  },


//app.js end
};
