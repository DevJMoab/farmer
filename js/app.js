const openModal =  document.getElementById('openRegisterModal')
const modal = document.getElementById('modal')

const showRegisterModal = ()=>{
    modal.classList.toggle('is-active')
}

openModal.addEventListener('click', showRegisterModal)