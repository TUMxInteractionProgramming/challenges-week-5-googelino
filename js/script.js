/* start the external action and say hello */
console.log("App is alive");


/** #7 Create global variable */
var currentChannel;

/** #7 We simply initialize it with the channel selected by default - sevencontinents */
currentChannel = sevencontinents;

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};

/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    // #7  Write the new channel to the right app bar using object property
    document.getElementById('channel-name').innerHTML = channelObject.name;

    //#7  change the channel location using object property
    document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';

    /* #7 remove either class */
    $('#chat h1 i').removeClass('far fas');

    /* #7 set class according to object property */
    $('#chat h1 i').addClass(channelObject.starred ? 'fas' : 'far');


    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 store selected channel in global variable */
    currentChannel = channelObject;
}

/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 replace image with icon
    $('#chat h1 i').toggleClass('fas');
    $('#chat h1 i').toggleClass('far');

    // #7 toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
}

/**
 * toggle (show/hide) the emojis menu
 */
function toggleEmojis() {
    $('#emojis').toggle(); // #toggle
    // hier soll die ganze emojis-list angezeigt werden, keine Ahnung wie; Idee:
    // $('#emojis').require('emojis-list');
    // var emojis = require('emojis-list');
    // console.log(emojis[0]);
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date() //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}

function sendMessage() {
    // #8 Create a new message to send and log it.
    //var message = new Message("Hello chatter");

    // #8 let's now use the real message #input
    var message = new Message($('#message').val());
    console.log("New message:", message);

    // #8 convenient message append with jQuery:
    $('#messages').append(createMessageElement(message));

    // #8 messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
    // it would also scroll to the bottom when using a very high number (e.g. 1000000000);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    // #8 clear the message input
    $('#message').val('');
}

/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 message properties
    var storedObjects = new Array();
    storedObjects.push(messageObject);
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 message element
    if (messageObject.text.length > 0){
        // push message element to message array of current channel
        // currentChannel.messages.push(messageObject);
        // currentChannel.messageCount++;
    return '<div style="box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);" class="message'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent">+5 min.</button>' +
        '</div>';
    }
    else {
        alert("Messages cannot be empty.");
        return;
    }
}


function listChannels(criterion) {
    // #8 channel onload
    //$('#channels ul').append("<li>New Channel</li>")

    // #8 five new channels
    // $('#channels ul').append(createChannelElement(yummy));
    // $('#channels ul').append(createChannelElement(sevencontinents));
    // $('#channels ul').append(createChannelElement(killerapp));
    // $('#channels ul').append(createChannelElement(firstpersononmars));
    // $('#channels ul').append(createChannelElement(octoberfest));

    // sort the channel array before displaying channels
    // sort according to the function parameter criterion

    //$("#cha").empty();
    
    switch (criterion){
        case 1: channels.sort(compareNew);
            break;
        case 2: channels.sort(compareTrending);
            break;
        case 3: channels.sort(compareFavorites);
            break;
        default: channels.sort(compareNew);
            break;
    }
    //$("#cha").empty();

    // appending is easier with for loop, using an array for the channels:
    for (var i=0; i<channels.length; i++){
        $('#channels ul').append(createChannelElement(channels[i]));
    }

    // $("#cha").html(<div class="dot"> + </div>);
}

/**
 * #8 This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {
    /* this HTML is build in jQuery below:
     <li>
     {{ name }}
        <span class="channel-meta">
            <i class="far fa-star"></i>
            <i class="fas fa-chevron-right"></i>
        </span>
     </li>
     */

    // create a channel
    var channel = $('<li>').text(channelObject.name);

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // #8 channel boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}



// functions for sorting the channels
// new above old: if a negative value is returned, the first argument is listed first while sorting
function compareNew(channel1, channel2){
    return (channel2.createdOn - channel1.createdOn);
}

// more above less: if a negative value is returned, the first argument is listed first while sorting
function compareTrending(channel1, channel2){
    return (channel2.messageCount - channel1.messageCount);
}

// starred above unstarred: if -1 is returned, the starred channel is listed above the unstarred
function compareFavorites(channel1, channel2){
    if ((channel1.starred == channel2.starred) || (channel1.starred && !channel2.starred)){
        return -1;
    }
    else {
        return 1;
    }
}

function createChannel(){
    $('#right-top').html('<h1 class="shadow--4dp"><input id="channelInput" type="text" placeholder="Type name of channel..." /><button id="abort" onclick="abort();">x abort</button><h1>');
    $("#messages").empty();
     // try to change arrow to create
    //$('#send-button').html(<button id="send-button" class="accent" onclick="sendMessage()"><i class="fas fa-arrow-right"></i></button>);
    //var sendbutton = $("send-button");
    //sendbutton.text(sendbutton.data("text-swap"));
    
}

function abort(){
    $('#right-top').html('<h1 class="shadow--4dp"><span id="channel-name">#SevenContinents</span><small id="channel-location">by <strong>cheeses.yard.applies</strong></small><i class="fas fa-star" onclick="star()"></i></h1>');
    // create message objects again -- error -- does not recognize the array 
    for (i=0; i<storedObjects.length; i++){
        alert(storedObjects[i]);
        createMessageElement(storedObjects[i]);
    }
}