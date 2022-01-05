const modal = document.getElementById('modal')
const closeModal = document.getElementById('closeModal')
const openBuildingsM = document.getElementById('openBuildingsModal')

const link = document.getElementById('ui');
const openTab = document.getElementById('tab');

const showBuildingModal = ()=>{
    modal.classList.toggle('is-active')
}

const activeTab = ()=>{
    link.classList.toggle('active');
}

openBuildingsM.addEventListener('click', showBuildingModal)
closeModal.addEventListener('click', showBuildingModal)
openTab.addEventListener('click', activeTab)

