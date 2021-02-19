// 符號圖檔
const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://www.flaticon.com/svg/vstatic/svg/2107/2107845.svg?token=exp=1613719251~hmac=981f1dbea6296477c4ebbde4ee221b8c', // 愛心
  'https://www.flaticon.com/svg/vstatic/svg/138/138534.svg?token=exp=1613719482~hmac=b6c127536298dd2c95cfb82623ca494c', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

// view layer
const view = {
  // 顯示單張卡片正面 -> 拆成兩部分 innerHTML 內容另設 function
  // 1-1. 單一卡片正面
  getCardElement(index) {
    // 卡片數字花色用 0-51 去求 
    const cardNumber = this.transformNumber((index % 13) + 1)
    const cardSymbol = Symbols[Math.floor(index / 13)]
    return `
      <div class="card-box">
        <div class="card" data-index="${index}">
          <p>${cardNumber}</p>
          <img src="${cardSymbol}" alt="">
          <p>${cardNumber}</p>
        </div>
      </div>
    `
  },
  // 1-2. A J Q K 數字變換
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
  // 1-3. heart diamond cards -> red
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
    cardPanel.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join('')
    this.transformColor()
  },

}


// 初始render
view.displayCards()

