const circlePositions = []
const crossPositions = []

let clickingThrottle = false // 防止電腦尚未下棋，玩家又點其他格子
let gameoverFlag = false //判斷遊戲結束

// 取得目前棋盤上的空格
function getEmptyPositions() {  
  const allPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  // 取得被任何棋子佔領的位置陣列
  const allOccupiedPositions = circlePositions.concat(crossPositions)
  
  return allPositions.filter(position => !allOccupiedPositions.includes(position))
}

// 取得當前空格中，最有價值的位置(站在電腦的立場)
function getMostValuablePosition() {
  const emptyPositions = getEmptyPositions()
  const defendPositions = [] //電腦需防守的位置

  for (const hypothesisPosition of emptyPositions) {
    // JavaScript 是記錄陣列的記憶體位址，避免對陣列操作影響到函式外的資料，使用新變數複製資料
    // constant 的 block scope 特性，離開這個 for 迴圈之後，copiedCrossPositions 就會被記憶體回收
    const copiedCrossPositions = Array.from(crossPositions)
    const copiedCirclePositions = Array.from(circlePositions)
    
    copiedCrossPositions.push(hypothesisPosition)  
    copiedCirclePositions.push(hypothesisPosition)
    
    // 第一優先順序：判斷電腦下這個位置是否會獲勝？
    // 如果會的話，return 這個位置，結束函式
    if (isPlayerWin(copiedCrossPositions)) {
      return hypothesisPosition
    }
    
    // 第二優先順序：判斷玩家下這個位置是否會獲勝？
    // 如果會的話，先記下來
    if (isPlayerWin(copiedCirclePositions)) {
      defendPositions.push(hypothesisPosition)
    }
  }
  
  // 當程式進行到這邊，第一優先順序的狀況已經不可能出現
  // 檢查第二優先順序的「電腦不下這一步就輸」是否存在
  // 若有，就回傳其中一個位置
  if (defendPositions.length) {
    return defendPositions[0]
  }
  
  // 如果中間是空格，就下中間
  if (emptyPositions.includes(5)) {
    return 5
  }
  
  // 隨機下一個位置
  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
}

function computerMove() {
  const drawingPosition = getMostValuablePosition()
  draw(drawingPosition, 'cross')
  crossPositions.push(drawingPosition)
  checkWinningCondition('cross')
}

// 顯示 O 或 X
function draw(position, shape) {
  // 限定形狀只能傳入 "circle" 或 "cross"
  if (shape !== 'circle' && shape !== 'cross'){
    throw 'Error: Unknown drawing shape, must be one of: circle, cross'
  }

  const cell = document.querySelector(`#app table tr td[data-index='${position}']`)
  cell.innerHTML = `<div class='${shape}'></div>`
}

// 計算 row & column 位置
function row(number) {
  return [3 * (number - 1) + 1, 3 * (number - 1) + 2, 3 * (number - 1) + 3]
}

function column(number) {
  return [number, number + 3, number + 6]
}

// 獲勝的八條連線
const checkingLines = [
  row(1),
  row(2),
  row(3),
  column(1),
  column(2),
  column(3),
  [1, 5, 9],
  [3, 5, 7],
]

// 判斷此位置陣列是否包含勝利連線
// 使用 Array.every()
function isPlayerWin(checkingPositions) {
  for (const line of checkingLines) {
    if (line.every(position => checkingPositions.includes(position))) {
      return true
    }
  }

  return false
}

function onCellClicked(event) {
  if (clickingThrottle) return

  const position = Number(event.target.dataset.index)
  if (!position) return

  draw(position, 'circle')
  circlePositions.push(position)
  clickingThrottle = true

  // 設計 0.5 秒的等待時間
  setTimeout(() => {
    checkWinningCondition('circle')

    if (!gameoverFlag) {
      computerMove()
    }
  }, 500)
}

// 判斷結果
function checkWinningCondition(player) {
  // 取得要判斷的玩家的位置陣列
  let position = circlePositions
  if (player === 'cross') {
    position = crossPositions
  }

  if (isPlayerWin(position)) {
    gameoverFlag = true
    removeClickListeners()

    return alert(`${player} player won!`)
  }

  if (getEmptyPositions().length === 0){
    gameoverFlag = true

    return alert('Tied!')
  }

  // 等待電腦下完，玩家才能下棋
  clickingThrottle = false
}

// 將綁定在 td 上面的監聽器移除，取消點擊行為
function removeClickListeners() {
  document.querySelectorAll('#app table tr td').forEach(cell => cell.removeEventListener('click', onCellClicked))
}

document.querySelectorAll("#app table tr td").forEach(cell => cell.addEventListener('click', onCellClicked))
