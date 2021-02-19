// 0-1. 符號圖檔
const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://www.flaticon.com/svg/vstatic/svg/2107/2107845.svg?token=exp=1613744394~hmac=57d0bcbe13b3a4dcf62f88e40a3bf8d3', // 愛心
  'https://www.flaticon.com/svg/vstatic/svg/138/138534.svg?token=exp=1613744416~hmac=4ba34829fc9d00f7d0705644856cb04c', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

// 0-2. 定義狀態
const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardMatchFailed: ' CardMatchFailed',
  CardMatched: 'CardMatched',
  GameFinished: 'GameFinished',
}

// 1. view layer
const view = {
  // 顯示單張卡片正面 -> 拆成兩部分 innerHTML 內容另設 function
  // (1-1). 增加卡片DOM(背面)
  getCardElement(index) {
    return `
      <div class="card-box">
        <div class="card back" data-index="${index}"></div>
      </div>
    `
  },
  // (1-2). 取得卡片內容
  getCardContent(index) {
    // 卡片數字花色用 0-51 去求 
    const cardNumber = this.transformNumber((index % 13) + 1)
    const cardSymbol = Symbols[Math.floor(index / 13)]
    return `
        <p>${cardNumber}</p>
        <img src="${cardSymbol}" alt="">
        <p>${cardNumber}</p>
    `
  },
  // (1-3). A J Q K 數字變換
  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  // (1-4). heart diamond cards -> red
  transformColor() {
    const cardList = document.querySelectorAll('.card')
    cardList.forEach(card => {
      const remainder = Math.floor(card.dataset.index / 13)
      if (remainder === 1 || remainder === 2) {
        card.classList.add('red')
      }
    })
  },
  // (2). 產生52張卡片
  displayCards(randomIndexes) {
    const cardPanel = document.querySelector('#cards')
    // 產生 0-51 arr -> 呼叫 getCardElement 52次 -> 合成內容放進#cards
    // array先洗牌
    cardPanel.innerHTML = randomIndexes.map(index => this.getCardElement(index)).join('')
    this.transformColor()
  },
  // (3). 翻牌
  flipCards(...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }
      card.classList.add('back')
      card.innerHTML = null
    })
  },

  // (4). 配對成功加效果
  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
  }
}

// 2. utility 已知工具
const utility = {
  // 洗牌 Fisher-Yates Shuffle(Knuth-Shuffle) algor, 最後一項跟前面的換 
  // count 放 arr length 這邊是指一組牌數量52
  getRandomNumberArray(count) {
    const numberArray = Array.from(Array(count).keys())
    // 長度52 最後一項是arr[51] 所以-1
    for (let theLastIndex = numberArray.length - 1; theLastIndex > 0; theLastIndex--) {
      // random [0,1) 目標是0-51 Math.floor([0,1*52)) 所以+1
      let randomIndex = Math.floor(Math.random() * (theLastIndex + 1))
        // ;不能省略
        ;[numberArray[theLastIndex], numberArray[randomIndex]] = [numberArray[randomIndex], numberArray[theLastIndex]]
    }
    return numberArray
  },
}

// 3. controller layer 控制遊戲狀態 不要讓 controller 以外的內部函式暴露在 global 其他 layer 不要互相接觸ㄔ
const controller = {
  // (1). 遊戲狀態
  currentState: GAME_STATE.FirstCardAwaits,
  // (2). 產生卡片呼叫controller
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  // (3). 根據遊戲state 決定下一步
  dispatchCardAction(card) {
    // 如果卡片是正面 那沒事
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        // 翻開第一張牌 暫存 更改state
        view.flipCards(card)
        model.revealCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:
        // 翻開第二張牌 暫存 更改state
        view.flipCards(card)
        model.revealCards.push(card)
        // 判斷配對是否成功
        if (model.isCardsMatched()) {
          // 成功 更改state 加效果
          this.currentState = GAME_STATE.CardMatched
          view.pairCards(...model.revealCards)
          model.clearRevealCards()
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          // 失敗 翻回背面 更改state
          this.currentState = GAME_STATE.CardMatchFailed
          // 沒有setTimeout 會直接翻回背面 看不出有翻過 最後state回FirstCardAwaits
          // 不能加(), 因為是呼叫整個函式內容 不是結果
          setTimeout(this.resetCards, 1000)
        }
        break
    }

  },
  // (4). reset card
  resetCards() {
    view.flipCards(...model.revealCards)
    model.clearRevealCards()
    // 要用controller 不能用this 因為setTimeout是瀏覽器提供的
    controller.currentState = GAME_STATE.FirstCardAwaits
  }


}
// 4. model layer 管理資料
const model = {
  // (1). 翻開的卡片暫存arr 檢查完是否matched 清空
  revealCards: [],
  // (2). 判斷配對是否成功
  isCardsMatched() {
    return this.revealCards[0].dataset.index % 13 === this.revealCards[1].dataset.index % 13
  },
  // (3). 清空暫存
  clearRevealCards() {
    this.revealCards = []
  }

}

// 初始render
controller.generateCards()

// event flip card 每張牌都加監聽器 要在初始render後面
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
  })
})

