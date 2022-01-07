/*-------------- constantes do modal -----------------------------*/
const modal = document.getElementById('modal')
const closeModal = document.getElementById('closeModal')
const openBuildingsM = document.getElementById('openBuildingsModal')

const showBuildingModal = () => {
    modal.classList.toggle('is-active')
}
/*----------------------------------------------------------------*/



/*-------------- chamadas das funções -----------------------------*/
openBuildingsM.addEventListener('click', showBuildingModal)
closeModal.addEventListener('click', showBuildingModal)
/*----------------------------------------------------------------*/
