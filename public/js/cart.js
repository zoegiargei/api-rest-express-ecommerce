function spinner () {
    document.getElementById('loader').classList.toggle('loader2')
}

const fields = document.querySelectorAll('.productAmount')
fields.forEach(field => {
    const price = field.getAttribute('price')
    const quantity = field.getAttribute('quantity')
    field.innerHTML = `$ ${price * quantity}`
})

const buttons = document.querySelectorAll('.btnDeleteProduct')
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault()
        const pid = button.getAttribute('pid')
        console.log(pid)

        const url = `/api/carts/products/${pid}`
        console.log(url)
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            if (result.status === 200) {
                location.reload()
            }
        })
    })
})

const btnContinueShopping = document.getElementById('btnContinueShopping')
btnContinueShopping.addEventListener('click', (e) => {
    e.preventDefault()

    spinner()
    fetch('/api/carts/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        spinner()
        if (result.status === 200) {
            // eslint-disable-next-line no-undef
            Swal.fire({
                icon: 'success',
                title: 'We send you the email with the details of the purchase! Thank you for choosing us!'
            })

            setTimeout(() => {
                location.reload()
            }, 4000)
        }
    })
})
