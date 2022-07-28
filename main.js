ZOHO.CREATOR.init().then(function (data) {
  //  console.log(data) ;
  // document.addEventListener("DOMContentLoaded", () => {
  var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
  // var wordle_id = queryParams["wordle_id"] ;
  // var user =queryParams["user"] ;
  // console.log(wordle_id ) ;

  createSquares();
  let appName = "wordle";
  let word;
  let wordle_id;
  let wordle_obj;

  getNewWord();
  get_wordle_id();  
  get_history();

  let guessedWords = [[]];

  let availableSpace = 1;

  let guessedWordCount = 0;
  let status = false;
  let gameOver = false;
  let gameWon = false;
  //
  const keys = document.querySelectorAll(".keyboard-row button");

  //=======================GETS THE WORD OF THE DAY
  function getNewWord() {
    console.log("func: getNewWord()");

    var getConfig = {
      appName: appName,
      reportName: "Word_Of_the_Day",
      page: "1",
      pageSize: "1",
    };

    ZOHO.CREATOR.API.getAllRecords(getConfig).then(function (response) {
      console.log(response.data);
      word = response.data[0].word;
      console.log("Word: " + word);
    });
  }

  //GET WORDLE RECORD FOR CURRENT USER IF USER REC NOT FOUND CREATE ONE ======================================================================================
  async function get_wordle_id() {
    console.log("func start: get_wordle_id()");
    

    //SET UP PARAMS TO GET RECORD FROM WORDLE REPORT
    // var getConfig = {
    //   appName:  appName,
    //   reportName : "Wordle_Report",
    // //  id: wordle_id ,
    //   //criteria : "date_field1 == today && Added_User == zoho.loginuser",
    //   criteria : "Added_User == zoho.loginuser",
    //   page: "1",
    //   pageSize: "1"
    // }

    //GET RECORD ========================
    var getConfig = {
      appName: appName,
      reportName: "Wordle_Report",
      criteria: "Added_User == zoho.loginuser",
      page: "1",
      pageSize: "1",
    };

  
      ZOHO.CREATOR.API.getAllRecords(getConfig).then(function (response) {

          console.log(JSON.stringify(response));
          wordle_obj = response.data[0];
          wordle_id = wordle_obj.ID;
        
      }).catch(function(err){
          console.log("ERROR GETTING WORDLE RECORD:" + JSON.stringify(err));
          set_Wordle();
      });
 

    //ADD RECORD======================

    // if(isUserWordle){
    //   var mydata = {
    //     "date_field1": "today",
    //     "Added_User" : "zoho.loginuser",
    //     "words": []

    //   } ;

    //   var addConfig = {
    //     appName : appName,
    //     formName : "Wordle",
    //     data :  { "data" : mydata }
    //   } ;

    //   ZOHO.CREATOR.API.addRecord(addConfig).then(function(response){
    //     console.log("adding wordle for user") ;
    //     console.log(JSON.stringify(response) );
    //     if(response.code == 3000){
    //     console.log("Record added successfully");
    //     }
    //   });
    // }

    // test for data with sub forms
    //getConfig.id = "4281076000000477045" ;
    // ZOHO.CREATOR.API.getRecordById(getConfig).then(function(response){
    //  console.log(response.data) ;
    // wordle_obj = response.data;
    // });
  }

  function getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "-" + dd + "-" + yyyy;    
    return today;
  }

  function set_Wordle() {
    console.log("set_worlde()");

    
      var mydata = {
        date_field1: getToday().toString(),
        Added_User: "zoho.loginuser",
        words: [],
      };

      var addConfig = {
        appName: appName,
        formName: "Wordle",
        data: { data: mydata },
      };

      ZOHO.CREATOR.API.addRecord(addConfig).then(function (response) {
        console.log("adding wordle for user");
        console.log(JSON.stringify(response));
        if (response.code == 3000) {
          console.log("Record added successfully");
        }
      });
    
  }

  function get_history() {
    console.log("func star: get_history()");
    var getConfig = {
      appName: appName,
      reportName: "My_Guesses_Today",
      criteria: "Added_User == zoho.loginuser",
      page: "1",
      pageSize: "6",
    };

    //CREATOR================================================================
    ZOHO.CREATOR.API.getAllRecords(getConfig).then(function (response) {
      if (response.data) {
        //console.log("response.data: "+response.data) ;

        response.data.forEach((item) => {
          const firstLetterId = guessedWordCount * 5 + 1;
          const g_word_arr = item.word.split("");
          guessedWords.push(g_word_arr);
          g_word_arr.forEach((letter, index) => {
            const tileColor = getTileColor(letter, index);
            const letterId = firstLetterId + index;
            //  console.log(letterId) ;
            const letterEl = document.getElementById(letterId);
            letterEl.textContent = letter;
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
          });
          guessedWordCount += 1;
        });
        availableSpace = response.data.length * 5 + 1;
        guessedWords.push([]);
      } else {
        console.log("No response.data");
      }
    });
  }

  function getCurrentWordArr() {
    console.log("func start: getCurrentWordArr()");
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  //========================GET TOTAL CHARACTER COUND
  function getTotalCharacterCount() {
    console.log("func star: getTotalCharacterCount()");
    if (guessedWords.length > 0) {
      wordCount = 0;
      currentCount = 0;
      totalCount = 0;
      for (let i = 0; i < guessedWords.length; i++) {
        currentCount = 0;
        for (let j = 0; j < guessedWords[i].length; j++) {
          ++currentCount;
        }
        wordCount++;
        totalCount += currentCount;
      }
      window.alert(
        "Total Word Count: " + wordCount + "\nTotal Char Count: " + totalCount
      );
      return totalCount;
    }
  }
  //========================ADD LETTER
  function updateGuessedWords(letter) {
    console.log("func star: updateGuessWords()");
    //Get Current Word
    const currentWordArr = getCurrentWordArr();

    //If current word exists and its less than 5 characters long
    if (currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter);
      // console.log(availableSpace) ;
      const availableSpaceEl = document.getElementById(String(availableSpace));

      availableSpace = availableSpace + 1;
      availableSpaceEl.textContent = letter;
    }
  }

  function getTileColor(letter, index) {
    console.log("func star: getTileColor()");
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58, 58, 60)";
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
  }

  function handleSubmitWord() {
    console.log("func star: handleSubitWord()");

    const currentWordArr = getCurrentWordArr();

    //If the word is too short Reject
    if (currentWordArr.length !== 5) {
      window.alert(
        "Word must be 5 letters. \nYou word " +
          currentWordArr +
          " is only " +
          currentWordArr.length
      );
    } else if (currentWordArr.length === 5) {
      //JOINTS CHARACTER OF CURRENT GUESS
      const currentWord = currentWordArr.join("");
      const firstLetterId = guessedWordCount * 5 + 1;
      const interval = 200;

      //COLOR THE LETTERS OF THE WORD
      console.log("Color Letters");
      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const tileColor = getTileColor(letter, index);

          const letterId = firstLetterId + index;
          const letterEl = document.getElementById(letterId);
          letterEl.classList.add("animate__flipInX");
          letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
        }, interval * index);
      });

      //INCREASE THE TOTAL GUESS WORDS AND ADDES NEW GUESS TO LIST OF GUESSES
      guessedWordCount += 1;

      //UPDATE WORDLE REPORT IF USER WORD IS CORRECT
      if (currentWord === word) {
        console.log("Current Word is Word fo the Day");
        status = true;
        let mydata = {};
        mydata.completed = "true";
        mydata.tries = guessedWordCount.toString();
        var config = {
          appName: appName,
          reportname: "Wordle_Report",
          id: wordle_id,
          data: { data: mydata },
        };
        console.log(config);

        //UPDATE WORDLE_REPORT
        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
          if (response.code == 3000) {
            console.log("Record updated successfully");
          }
          console.log(response);
        });
        // window.alert("Congratulations!");
        const statusEl = document.getElementById("status-h1");
        statusEl.textContent = "Congratulations!!!";
        gameWon = true;
        gameOver = true;
      }

      //IF THE GUESS LIMIT OF 6 IS REACHED UPDATE WORDLE REPORT AND LET PLAYER KNOW HE HAS NO MORE GUESS AVAILABLE
      if (guessedWords.length === 6) {
        // window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
        status = false;
        wordle_obj.failed = "true";
        wordle_obj.tries = guessedWordCount.toString();

        var config = {
          appName: appName,
          reportname: "Wordle_Report",
          id: wordle_id,
          data: { data: wordle_obj },
        };
        console.log(config);
        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
          if (response.code == 3000) {
            console.log("Record updated successfully");
          }
        });
        //LET PLAYER KNOW THEY HAVE NO MORE GUESSES
        const statusEl = document.getElementById("status-h1");
        statusEl.textContent = `Sorry, you have no more guesses! The word is ${word}.`;
        gameOver = true;
      } else {
        guessedWords.push([]);
      }

      //============CHANGE I MADE: Only push word if the All the character count is 5% = 0;

      // UPDATE USER_GUESS REPORT WITH NEW WORD
      var mydata = {
        wordle: wordle_id,
        word: currentWord,
        // "Added_User" : user,
        status: status.toString(),
      };
      var config = {
        appName: appName,
        formName: "User_Guess",
        data: { data: mydata },
      };

      ZOHO.CREATOR.API.addRecord(config).then(function (response) {
        if (response.code == 3000) {
          console.log("Record added successfully");
        }
      });
    }
  }

  function createSquares() {
    console.log("func star: get_history()");
    console.log("Creating Board");
    const gameBoard = document.getElementById("board");

    for (let index = 0; index < 30; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    const removedLetter = currentWordArr.pop();

    guessedWords[guessedWords.length - 1] = currentWordArr;

    const lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = "";
    availableSpace = availableSpace - 1;
  }

  /////////////////////////////////////////////////////////////////////
  if (gameOver == true) {
    if (gameWon) {
      const statusEl = document.getElementById("status-h1");
      statusEl.textContent = "Congratulations!!!";
    } else {
      const statusEl = document.getElementById("status-h1");
      statusEl.textContent = "You have used up all your guesses!!!";
    }
  }
  if (gameOver == false) {
    for (let i = 0; i < keys.length; i++) {
      keys[i].onclick = ({ target }) => {
        const letter = target.getAttribute("data-key");

        if (letter === "enter") {
          handleSubmitWord();
          return;
        }

        if (letter === "del") {
          handleDeleteLetter();
          return;
        }

        updateGuessedWords(letter);
      };
    }
  }
});
