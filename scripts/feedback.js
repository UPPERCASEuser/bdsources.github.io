var previousData = null;

function logError(text) {
  console.log("%c[ERROR]: %c" + text, "color: red; font-weight: bold;font-family: monospace", "color: initial; font-family: monospace");
}


function processComments(data) {
  if(!previousData) {
    previousData = data;
    appendComments(previousData);
  } else if(previousData == data) {
    // do nothing
  } else if (previousData != data) {
    $("#comments").html(""); 
    previousData = data;
    appendComments(previousData);
  }
}

function appendComments(data) {
  var i;
  if (data.length == 0) {
    $("#comments").append("<h2>No one has left feedback yet! Be the first one.</h2>");
  } else {
    for(i = 0; i < data.length; i++) {
      var date = moment(data[i]["created_at"]).max(new Date()),
      type = data[i]["data"].type,
      sender = data[i]["data"].sender,
      message = data[i]["data"].message,
      relativeTime = date.fromNow(),
      printedTime;

        if(type == "feedback") {
      

        if(relativeTime.includes("day a")) {
          printedTime = "Yesterday "+date.format("LT");
        } else if (relativeTime.includes("second") || relativeTime.includes("minute") || relativeTime.includes("hour")) {
          printedTime = relativeTime;
        } else {
          printedTime = date.format("LLL");
        }
      


        $("<div>", {
          class: "commentContainer"
        }).appendTo("#comments");

        $("<div>", {
          class: "sender",
          html: `${sender == ""?"Anonymous":sender} <span>${printedTime}</span>`
        }).appendTo("#comments .commentContainer:last-child");

      $("<div>", {
        class: "message",
        html: message
      }).appendTo("#comments .commentContainer:last-child");
    }}
  }


  var formPos = $("form").offset(),
    scrollerPos = $("body").offset(),
    scrollInner = $("body").innerHeight();

    function scrollToFeedback(scroll) {
      $("body").animate({
        scrollTop: scroll
      }, 500, "swing");
    }

    if(formPos.top > scrollerPos.top+scrollInner) {
      $("#content").append($("<div>", {
        class: "toFeedback",
        html: "Give Feedback",
        click: function() {
          scrollToFeedback(formPos.top);
        }
      }));
    }

    $("body").scroll(function(){
      var btn = $("#content").find(".toFeedback").length;
      formPos = $("form").offset();
      if(formPos.top > scrollerPos.top+scrollInner) {
        if(btn == 0) {
          $("#content").append($("<div>", {
            class: "toFeedback",
            html: "Give Feedback",
            click: function() {
              scrollToFeedback(formPos.top);
            }
          }));
        } 
      } else {
        if(btn > 0) {
          $(".toFeedback").animate({
            "margin-bottom": "-10vh"
          }, 200, ()=>{
            $(".toFeedback").remove();
          });
        }
      }
    });
}

function fetchData() {
  fetch("https://getsimpleform.com/messages.json?api_token=43ebd0ce89c1697e73dc9b9b82b0e4d8")
  .then(res => {
    return res.json()
  })
  .then(data => {
    processComments(data);
    return data
  })
  .catch(err => {
    logError(err);
  });
};

fetchData();

$("button[type=send]").click(()=>{
  var sender = $("[name=sender]").val(),
  type = $("[name=type]").val(),
  message = $("[name=message]").val();

  if($("b.red.reply")) {
    $("b.red.reply").fadeOut(500);
    setTimeout(() => {
      $("b.red.reply").remove();
    }, 1500);
    $("[name=message]").removeAttr("style");
  }

  if(message == "" || message == null) {
    $("<b>", {
      class: "red reply",
      style: "text-align: center; color: #f04747; margin-left: 300px;",
      html: "Please enter feedback"
    }).insertBefore("#feedback form");

    $("[name=message]").css("box-shadow", "box-shadow: 0 0 1vh var(--red);");

    return false;
  }

  $.ajax({
    dataType: 'jsonp',
    url: "https://getsimpleform.com/messages/ajax?form_api_token=3e10c90683f8aa4cf35386f16316f866",
    data: {
      sender: sender,
      type: type,
      message: message
    }
  }).done(function() {
    $("<b>", {
      class: "green reply",
      style: "text-align: center; color: #43b581; margin-left: 300px",
      html: "Feedback sent!"
    }).insertBefore("#feedback form");

    setTimeout(() => {
      $("b.green.reply").fadeOut(500);
      setTimeout(() => {
        $("b.green.reply").remove();
      }, 500);
    }, 3000);
  });

  $("[name=sender], [name=email], [name=message]").val("");

  setTimeout(() => {
    fetchData();
  }, 500);

  return false;
});