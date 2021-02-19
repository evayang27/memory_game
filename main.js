// 符號圖檔
const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://www.flaticon.com/svg/vstatic/svg/2107/2107845.svg?token=exp=1613744394~hmac=57d0bcbe13b3a4dcf62f88e40a3bf8d3', // 愛心
  'https://www.flaticon.com/svg/vstatic/svg/138/138534.svg?token=exp=1613744416~hmac=4ba34829fc9d00f7d0705644856cb04c', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

// view layer
const view = {
  // 顯示單張卡片正面 -> 拆成兩部分 innerHTML 內容另設 function
  // 1-1. 增加卡片DOM(背面)
  getCardElement(index) {
    return `
      <div class="card-box">
        <div class="card back" data-index="${index}"></div>
      </div>
    `
  },
  // 1-2. 取得卡片內容
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
  // 1-3. A J Q K 數字變換
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
  // 1-4. heart diamond cards -> red
  transformColor() {
    const cardList = document.querySelectorAll('.card')
    cardList.forEach(card => {
      const remainder = Math.floor(card.dataset.index / 13)
      if (remainder === 1 || remainder === 2) {
        card.classList.add('red')
      }
    })
  },
  // 2. 產生52張卡片
  displayCards() {
    const cardPanel = document.querySelector('#cards')
    // 產生 0-51 arr -> 呼叫 getCardElement 52次 -> 合成內容放進#cards
    // array先洗牌
    cardPanel.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join('')
    this.transformColor()
  },
  // 3. 翻牌
  flipCard(card) {
    console.log('flips')
    if (card.classList.contains('back')) {
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(Number(card.dataset.index))
      return
    }
    card.classList.add('back')
    card.innerHTML = null
  }
}

// utility 已知工具
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


// 初始render
view.displayCards()

// event flip card 每張牌都加監聽器 要在初始render後面
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    view.flipCard(card)
  })
})

