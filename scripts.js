
function generateLink() {
  var text = $("#text").val();
  var encodedText = encode(text);
  var url = "practice.html?=" + encodedText;
  $("#output").html("<a href='"+url+"'>Link</a>");
}


function encode(s) {
  return toBinary(JSON.stringify(
    s.match(/[^\.!\?]+[\.!\?]+/g).map(function (sentence) {
      return sentence.match(/[^,]+/g);
    })
  ));
}

function toBinary(string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}


PRACTICE = null;

function loadPractice() {
  var encodedText = window.location.search.substr(2);
  PRACTICE = decode(encodedText);
  var htmlPractice = buildHtmlPractice(PRACTICE);
  console.log(htmlPractice);
  $("#textarea").html(htmlPractice);
}

function decode(s) {
  return JSON.parse(fromBinary(s));
}

function fromBinary(encoded) {
  binary = atob(encoded)
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

function buildHtmlPractice(practice) {
  var build = new Array();
  for(var i=0;i<practice.length;i++) {
    var sentence = practice[i];
    console.log(sentence);
    var div = $("<span/>", {
      "contenteditable": true,
      "data-sentence-id": i,
      "class": "level"+sentence.length,
      "html": sentence.join("")
    })
    div.on('input', checkSentence);
    build.push(div);
  }
  return build;

}

function checkSentence() {
  var el = $(this);
  var id = el.data("sentence-id");
  var correctWords = PRACTICE[id].join(",").split(" ");

  var currentSentence = el.html();
  var currentWords = currentSentence.split(" ");

  var diff = currentWords.filter(x => !correctWords.includes(x));
  var classLevel = Math.min(diff.length+1, 5);
  console.log(diff, correctWords, currentWords);


  el.removeClass();
  el.addClass("level"+classLevel);
}
