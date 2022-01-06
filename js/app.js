/*-------------- constantes do modal -----------------------------*/
const modal = document.getElementById('modal')
const closeModal = document.getElementById('closeModal')
const openBuildingsM = document.getElementById('openBuildingsModal')

const showBuildingModal = () => {
    modal.classList.toggle('is-active')
}

/*----------------------------------------------------------------*/

/*-------------- constantes dos Tabs -----------------------------*/
let activeTabDiv = null
const tabDivs = document.querySelectorAll('.list-tab')

const toggle = (tabDiv) => {
  if (activeTabDiv !== tabDiv) {
    activeTabDiv?.classList.remove('active')
    activeTabDiv = tabDiv
    activeTabDiv.classList.add('active')
  }
}

tabDivs.forEach((tabDiv) => {
  tabDiv.addEventListener('click', () => {
      toggle(tabDiv)
  })
})
/*----------------------------------------------------------------*/

/*-------------- chamadas das funções -----------------------------*/
openBuildingsM.addEventListener('click', showBuildingModal)
closeModal.addEventListener('click', showBuildingModal)
toggle(tabDivs[0])
/*----------------------------------------------------------------*/
