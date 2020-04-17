const readline = require('readline');
require('colors')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const USER_DETAILS = {
  name: null,
}

const GAME_DETAILS = {
  id: null,
  questions: null,
  time: 0,

}

const GAME_OPTIONS = [
  { type: 'Addition', id: 1 },
  { type: 'Subtraction', id: 2 }
]

function setUser(name){
  USER_DETAILS.name = name
}

function askDetails() {
  return new Promise((resolve, reject) => {
    try{
      rl.question("Enter your name: ", function(name) {
        setUser(name)
        resolve()
      });
    } catch(error) {
      reject(error)
    }
  })
}

function welcome() {
  return new Promise((resolve, reject) => {
    try{
      console.log('Welcome to Mental Math Proj Quarantine!'.red.bold)
      askDetails().then(() => {
        console.log('Hello'.green.bold, USER_DETAILS.name.green.bold)
        console.log('Let\'s play!'.yellow.bold)
        resolve()
      })
    } catch(error) {
      reject(error)
    }
  })
}

function clearGame() {
  GAME_DETAILS.id = null
}

function setGame(id) {
  GAME_DETAILS.id = id

}

function askGameChoice() {
  return new Promise((resolve, reject) => {
    try { 
      const questions = "Enter the " + "[id]".white.bgRed.bold + " of the game you want to play: "
      rl.question(questions, function(gameId) {
        resolve(gameId)
      });
    } catch (error) {
      reject(error)
    }
  })
}

function chooseGameType() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Choose a game type: ')
      GAME_OPTIONS.map((games) => {
        console.log(`[${games.id}]`.white.bgRed.bold, games.type)
      })

      clearGame()
      let answered = false
      while(!answered) {
        const chosenGame = await askGameChoice()
        if(GAME_OPTIONS.find((gameType) => gameType.id == chosenGame)){
          setGame(+chosenGame)
          console.log('You have chosen to train')
          console.log(GAME_OPTIONS.find((games) => games.id == GAME_DETAILS.id).type.white.bgRed.bold)
          resolve()
          answered = true
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

function getNumbersForAddition() {
  const MAX_NUMBER = 10;
  const MIN_NUMBER = 1
  const num1 =  Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
  const num2 =  Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
  const result = num1 + num2

  return { num1, num2, result, sign: '+' }
}

function getNumbersForSubtraction() {
  // This function will always make sure that the result will be a positive value
  const MAX_NUMBER = 10;
  const MIN_NUMBER = 1
  const random1 =  Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
  const random2 =  Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;

  if(random1 > random2){
    return { num1: random1, num2: random2, result: random1 - random2, sign: '-' }
  } else {
    return { num1: random2, num2: random1, result: random2 - random1, sign: '-' }
  }
}

function setQuestions(questions) {
  GAME_DETAILS.questions = questions
}

function generateQuestionsAndAnswers(gameId){
  const numberOfQuestions = 1

  const questions = Array(numberOfQuestions).fill(null).map(() => {
    let question = null

    switch(gameId){
      case 1:
        question = getNumbersForAddition()
        break;
      case 2:
        question = getNumbersForSubtraction()
        break;
    }

    return question
  })

  setQuestions(questions)
}

function askQuestion(question) {
  return new Promise((resolve, reject) => {
    try { 
      rl.question(`${question.num1} ${question.sign} ${question.num2} = `, function(answer) {
        resolve(answer == question.result)
      });
    } catch (error) {
      reject(error)
    }
  })
}

var gameTimerId;
function startTimer() {
  gameTimerId = setInterval(() => {
    GAME_DETAILS.time += 1
  }, 1000)
}

function clearTimer() {
  clearInterval(gameTimerId)
}

async function askQuestions() {
  const questions = GAME_DETAILS.questions
  startTimer()
  for(let i = 0; i < questions.length ; i++) {
    let correct = false;
    while(!correct) {
      const result = await askQuestion(questions[i])
      
      if(result) {
        correct = true
      }
    }
  }
  clearTimer()
  console.log(`You took ${GAME_DETAILS.time} seconds!!!`.green.bold)
}

function askPlayAgain() {
  return new Promise((resolve, reject) => {
    try {
      rl.question('play again? y/n', (value) => {
        const acceptedValues = ['y', 'n']
        if(acceptedValues.includes(value.toLowerCase())) {
          if(value == 'y'){
            resolve(true)
          } else if (value == 'n') {
            resolve(false)
          } else {
            resolve(null)
          }
        }
      })
    } catch (error) {
      reject(error)
    }
  })
 
}

function playAgain() {
  return new Promise(async (resolve, reject) => {
    try {
      let answered = null
      while(!answered) {
        const playAgainInput = await askPlayAgain()
        if(playAgainInput !== null){
          resolve(playAgainInput)
          answered = true
        }
      }
    } catch(error) {
      reject(error)
    } 
  })
}

async function startGame() {
  await chooseGameType()
  let play = true
  while(play){
    generateQuestionsAndAnswers(GAME_DETAILS.id)
    await askQuestions()
    play = await playAgain()
  }
 
  console.log('Game Ended')
}

async function start(){
  await welcome()
  await startGame()

}

start()