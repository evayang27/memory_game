// view layer
const view = {
  // 1.顯示單張卡片正面
  displayCards() {
    document.querySelector('#cards').innerHTML = `
    <div class="card-box">
      <div class="card">
        <p>A</p>
        <img src="https://image.flaticon.com/icons/svg/105/105220.svg" alt="">
        <p>A</p>
      </div>
    </div>
    `
  }
}


// 初始render
view.displayCards()