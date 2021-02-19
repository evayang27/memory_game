// 符號圖檔
const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

// view layer
const view = {
  // 顯示單張卡片正面 -> 拆成兩部分 innerHTML 內容另設 function
  // 1. 單一卡片正面
  getCardElement(index) {
    // 卡片數字花色用 0-51 去求 
    const cardNumber = this.transformNumber((index % 13) + 1)
    const cardSymbol = Symbols[Math.floor(index / 13)]
    return `
      <div class="card-box">
        <div class="card">
          <p>${cardNumber}</p>
          <img src="${cardSymbol}" alt="">
          <p>${cardNumber}</p>
        </div>
      </div>
    `
  },
  // 2. A J Q K 數字變換
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
  // 3. 顯示一張卡片
  displayCards(index) {
    const cardPanel = document.querySelector('#cards')
    cardPanel.innerHTML = this.getCardElement(index)
  },
}


// 初始render
view.displayCards(39)