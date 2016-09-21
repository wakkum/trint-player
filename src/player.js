// libs
var hyperaudiolite = (function () {

    var hal = {},
      transcript,
      words,
      player,
      paraIndex,
      start,
      end,
      paras;

    function getParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
          results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ''));
    }

    function init(mediaElementId) {
      words = transcript.getElementsByTagName('span');
      paras = transcript.getElementsByTagName('p');
      player = document.getElementById(mediaElementId);
      paraIndex = 0;
      words[0].classList.add('active');
      paras[0].classList.add('active');
      transcript.addEventListener('click', setPlayHead, false);
      player.addEventListener('timeupdate', checkPlayHead, false);

      //check for queryString params
      start = getParameter('s');

      if (!isNaN(parseFloat(start))) {
        player.currentTime = start/10;
        player.play();
      }

      end = parseFloat(getParameter('d')) + parseFloat(start);
    }

    function setPlayHead(e) {
      var target = (e.target) ? e.target : e.srcElement;
      target.setAttribute('class', 'active');
      var timeSecs = parseInt(target.getAttribute('data-m'))/1000;

      if(!isNaN(parseFloat(timeSecs))) {
        end = null;
        player.currentTime = timeSecs;
        player.play();
      }
    }

    function checkPlayHead() {
      //check for end time of shared piece
      if (end && (end/10 < player.currentTime)) {
        player.pause();
        end = null;
      }

      var activeitems = transcript.getElementsByClassName('active');
      var activeitemsLength = activeitems.length;

      for (var a = 0; a < activeitemsLength; a++) {
        if (activeitems[a]) { // TODO: look into why we need this
          activeitems[a].classList.remove('active');
        }
      }

      // Establish current paragraph index
      var currentParaIndex;

      for (var i = 1; i < words.length; i++) {
        if (parseInt(words[i].getAttribute('data-m'))/1000 > player.currentTime) {

          // TODO: look for a better way of doing this
          var strayActive = transcript.getElementsByClassName('active')[0];
          strayActive.classList.remove('active');

          // word time is in the future - set the previous word as active.
          words[i-1].classList.add('active');
          words[i-1].parentNode.classList.add('active');

          paras = transcript.getElementsByTagName('p');

          for (a = 0; a < paras.length; a++) {

            if (paras[a].classList.contains('active')) {
              currentParaIndex = a;
              break;
            }
          }

          if (currentParaIndex != paraIndex) {

            Velocity(words[i].parentNode, 'scroll', {
              container: hypertranscript,
              duration: 800,
              delay: 0
            });

            paraIndex = currentParaIndex;
          }

          break;
        }
      }
    }

    hal.init = function(transcriptId, mediaElementId) {
      transcript = document.getElementById(transcriptId);
      init(mediaElementId);
    };

    hal.loadTranscript = function(url) {
      var xmlhttp;

      if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
      } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
      }

      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 ) {
          if (xmlhttp.status == 200){
            transcript = document.getElementById('hypertranscript');
            transcript.innerHTML = xmlhttp.responseText;
            init();
          } else if(xmlhttp.status == 400) {
            alert('There was an error 400');
          } else {
            alert('something else other than 200 was returned');
          }
        }
      };

      xmlhttp.open('GET', url, true);
      xmlhttp.send();
    };

    return hal;

})();

// modules
import Share from "./modules/share";

// styles
// import './themes/default/theme.css';


  // function msToTime(duration) {
  //   var milliseconds = parseInt((duration%1000)/100)
  //     , seconds = parseInt((duration/1000)%60)
  //     , minutes = parseInt((duration/(1000*60))%60)
  //     , hours = parseInt((duration/(1000*60*60))%24);
  //
  //   hours = (hours < 10) ? '0' + hours : hours;
  //   minutes = (minutes < 10) ? '0' + minutes : minutes;
  //   seconds = (seconds < 10) ? '0' + seconds : seconds;
  //
  //   return hours + ':' + minutes + ':' + seconds;
  // }

  // function escapeHtml(unsafe) {
  //   return unsafe
  //     .replace(/&/g, '&amp;')
  //     .replace(/</g, '&lt;')
  //     .replace(/>/g, '&gt;')
  //     .replace(/"/g, '&quot;')
  //     .replace(/'/g, '&#039;');
  //  }

  var searchForm = document.getElementById('searchForm');

  if (searchForm) {
    if(searchForm.addEventListener){ //Modern browsers
      searchForm.addEventListener('submit', function(event){
        searchPhrase(document.getElementById('search').value);
        event.preventDefault();
      }, false);
    }else if(searchForm.attachEvent){ //Old IE
      searchForm.attachEvent('onsubmit', function(event){
        searchPhrase(document.getElementById('search').value);
        event.preventDefault();
      });
    }
  }

  // var words, wordsLen; //JSON
  var htmlWords, htmlWordsLen; //HTML

  htmlWords = document.querySelectorAll('[data-m]');
  htmlWordsLen = htmlWords.length;

  // Replace htmlWords and htmlWordsLen with words and wordsLen below if you want
  // to take word data directly from JSON.
  //
  // When we export the player the transcript should probably be already inline
  // as HTML so as to search engine indexable, which is why the default
  // behaviour here is to use the HTML for the data as it will work in both cases.

  var searchPhrase = function (phrase) {

    var phraseWords = phrase.split(' ');
    var phraseWordsLen = phraseWords.length;
    var matchedTimes = [];

    // clear matched times

    var searchMatched = document.querySelectorAll('.search-match');
    var searchMatchedLen = searchMatched.length;

    for (var l=0; l < searchMatchedLen; l++) {
      searchMatched[l].classList.remove('search-match');
    }

    //for (var i = 0; i < wordsLen; i++) {
    for (var i = 0; i < htmlWordsLen; i++) {

      var numWordsMatched = 0;
      var potentiallyMatched = [];

      for (var j = 0; j < phraseWordsLen; j++) {

        var wordIndex = i+numWordsMatched;

        //if (wordIndex >= wordsLen) {
        if (wordIndex >= htmlWordsLen) {
          break;
        }

        // regex removes punctuation - NB for htmlWords case we also remove the space

        //if (phraseWords[j].toLowerCase() == Words[wordIndex].name.toLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")) {
        if (phraseWords[j].toLowerCase() == htmlWords[wordIndex].innerHTML.toLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~() ]/g,'')) {

          //potentiallyMatched.push(words[wordIndex].time);
          potentiallyMatched.push(htmlWords[wordIndex].getAttribute('data-m'));
          numWordsMatched++;
        } else {
          break;
        }

        // if the num of words matched equal the search phrase we have a winner!

        if (numWordsMatched >= phraseWordsLen) {
          matchedTimes = matchedTimes.concat(potentiallyMatched);
        }
      }
    }

    // display
    var matchedTimesLen = matchedTimes.length;

    // only match the first word with that time (assuming times are unique)
    for (var k=0; k < matchedTimesLen; k++) {
      document.querySelectorAll('[data-m="'+matchedTimes[k]+'"]')[0].classList.add('search-match');
    }
  };

  window.onload = function() {
    hyperaudiolite.init('hypertranscript', 'hyperplayer');

    // playbackRate listener
    var p = document.getElementById('pbr');
    var cp = document.getElementById('currentPbr');

    p.addEventListener('input',function(){
      cp.innerHTML = p.value;
      hyperplayer.playbackRate = p.value;
    },false);
  };
