/* eslint-disable no-undef */
class Quantity {
    constructor (quantity) {
        this.quantity = Number(quantity)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const incrementBtn = document.getElementById('incrementBtn')
    const decrementBtn = document.getElementById('decrementBtn')
    const quantityInput = document.getElementById('quantity')
    const stock = document.getElementById('productStock').value

    function updateQuantity (value) {
        if (value <= stock && value >= 1) {
            quantityInput.value = value
        }
    }

    incrementBtn.addEventListener('click', function () {
        const currentValue = parseInt(quantityInput.value)
        updateQuantity(quantityInput.value = currentValue + 1)
    })

    decrementBtn.addEventListener('click', function () {
        const currentValue = parseInt(quantityInput.value)
        if (currentValue > 1) {
            updateQuantity(quantityInput.value = currentValue - 1)
        }
    })

    quantityInput.addEventListener('change', function () {
        const enteredValue = parseInt(quantityInput.value)
        updateQuantity(enteredValue)
    })

    const btnAddToCart = document.getElementById('addToCart')
    btnAddToCart.addEventListener('click', (e) => {
        e.preventDefault()
        const quantity = new Quantity(quantityInput.value)
        const pid = btnAddToCart.getAttribute('pid')

        fetch(`/api/carts/products/${pid}`, {
            method: 'POST',
            body: JSON.stringify(quantity),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            if (result.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Product added to cart'
                })

                setTimeout(() => {
                    location.reload()
                }, 3000)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'You are not authenticated'
                })
            }
            return result.json()
        }).then(data => {
            console.log(data)
        }).catch(error => {
            console.error(error)
        })
    })
})
