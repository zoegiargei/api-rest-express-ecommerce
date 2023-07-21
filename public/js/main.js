const cartForm = document.getElementById('cartForm')

if (cartForm instanceof HTMLFormElement) {
    cartForm.addEventListener('submit', (e) => {
        e.preventDefault()

        fetch('/api/carts/cartById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            if (result.status === 201) {
                window.location.replace('/web/carts/cartById')
            } else {
                window.location.replace('/web/error/')
            }
            result.json()
        })
    })
}

// loader
window.addEventListener('load', () => {
    document.getElementById('loader').classList.toggle('loader2')
})
