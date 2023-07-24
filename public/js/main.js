const cartForm = document.getElementById('cartForm')

if (cartForm instanceof HTMLFormElement) {
    cartForm.addEventListener('submit', (e) => {
        e.preventDefault()
        window.location.replace('/web/carts/userCart')
    })
}

// loader
window.addEventListener('load', () => {
    document.getElementById('loader').classList.toggle('loader2')
})
