const circlePositions = []
const crossPositions = []

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
