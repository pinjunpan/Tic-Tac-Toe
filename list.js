//設常數以利後續維護
const BASE_URL = "https://user-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/users/"

const dataPanel = document.querySelector("#data-panel")
const users = []

function renderUserList(data) {
  let html = ""
  //迭代資料
  data.forEach((user) => {
    //圖片增加data-id，後續使用dataset找到點擊目標的id
    html += `
        <div class="card" style="width: 14rem;">
          <img src="${user.avatar}" class="card-img-top" alt="avatar" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${user.id}">
          <div class="card-body ">
            <p class="card-text">${user.name} ${user.surname}</p>
          </div>
        </div>`
    dataPanel.innerHTML = html
  })
}

function showUserModal(id) {
  //取得待修改的元素
  const modalName = document.querySelector("#user-modal-title")
  const modalImg = document.querySelector("#user-modal-img")
  const modalEmail = document.querySelector("#user-modal-email")
  const modalGender = document.querySelector("#user-modal-gender")
  const modalAge = document.querySelector("#user-modal-age")
  const modalBirthday = document.querySelector("#user-modal-birthday")

  axios
    .get(INDEX_URL + id)
    .then((res) => {
      const data = res.data
      modalName.innerText = `${data.name} ${data.surname}`
      modalImg.src = `${data.avatar}`
      modalEmail.innerText = `Email: ${data.email}`
      modalGender.innerText = `Gender: ${data.gender}`
      modalAge.innerText = `Age: ${data.age}`
      modalBirthday.innerText = `Birthday: ${data.birthday}`
    })
}

//加入監聽器，使用命名函式較容易除錯
dataPanel.addEventListener("click", function onPanelClicked(event) {
  //條件篩選，如果點擊圖片
  if (event.target.matches(".card-img-top")) {
    //使用dataset找到點擊目標的id
    showUserModal(event.target.dataset.id)
  }
})

axios
  .get(INDEX_URL) //get Index API
  .then((response) => {
    //取得資料加入users陣列
    users.push(...response.data.results) //...展開陣列資料
    renderUserList(users) //渲染畫面
  })
  .catch((err) => console.log(err))
