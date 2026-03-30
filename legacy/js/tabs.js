let activeTabDiv = null
const tabDivs = document.querySelectorAll('.list-tab')

const climate = document.querySelector('.climate')
const sun = document.querySelector('.sun')
const rain = document.querySelector('.out')
const cloudy = document.querySelector('.prima')
const snow = document.querySelector('.inv')

const filter = document.querySelector('#filter-table')
const all = document.querySelector('.tab-all')
const social = document.querySelector('.tab-social')
const animals = document.querySelector('.tab-animals')
const production = document.querySelector('.tab-production')
const storage = document.querySelector('.tab-storage')
const machines = document.querySelector('.tab-machines')
const crops = document.querySelector('.tab-crops')
const others = document.querySelector('.tab-others')

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

all.addEventListener('click', () => {
    filter.classList.remove('social', 'animal', 'animals', 'production', 'productions', 'storage', 'storages', 'machine', 'machines', 'crop', 'crops', 'others')
})
social.addEventListener('click', () => {
    filter.classList.remove('social', 'animal', 'animals', 'production', 'productions', 'storage', 'storages', 'machine', 'machines', 'crop', 'crops', 'others')
    filter.classList.add('social')
})
animals.addEventListener('click', () => {
    filter.classList.remove('social', 'animal', 'animals', 'production', 'productions', 'storage', 'storages', 'machine', 'machines', 'crop', 'crops', 'others')
    filter.classList.add('animal','animals')
})
production.addEventListener('click', () => {
    filter.classList.remove('social', 'animal', 'animals', 'production', 'productions', 'storage', 'storages', 'machine', 'machines', 'crop', 'crops', 'others')
    filter.classList.add('production','productions')
})
storage.addEventListener('click', () => {
    filter.classList.remove('social', 'animal', 'animals', 'production', 'productions', 'storage', 'storages', 'machine', 'machines', 'crop', 'crops', 'others')
    filter.classList.add('storage','storages')
})
machines.addEventListener('click', () => {
    filter.classList.remove('social', 'animal', 'animals', 'production', 'productions', 'storage', 'storages', 'machine', 'machines', 'crop', 'crops', 'others')
    filter.classList.add('machine','machines')
})
crops.addEventListener('click', () => {
    filter.classList.remove('social', 'animal', 'animals', 'production', 'productions', 'storage', 'storages', 'machine', 'machines', 'crop', 'crops', 'others')
    filter.classList.add('crop','crops')
})
others.addEventListener('click', () => {
    filter.classList.remove('social', 'animal', 'animals', 'production', 'productions', 'storage', 'storages', 'machine', 'machines', 'crop', 'crops', 'others')
    filter.classList.add('others')
})
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------*/

sun.addEventListener('click', () => {
    climate.classList.remove('cloudy', 'rain')
    climate.removeAttribute('div')
    climate.removeAttribute('id','snow')
})
rain.addEventListener('click', () => {
    climate.removeAttribute('id','snow')
    climate.setAttribute('class','rain')
})
cloudy.addEventListener('click', () => {
    climate.removeAttribute('id','snow')
    climate.setAttribute('class','cloudy')
})
snow.addEventListener('click', () => {
    climate.setAttribute('id','snow')
})

toggle(tabDivs[0])