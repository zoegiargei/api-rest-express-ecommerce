const buttons = document.querySelectorAll('.btnSeeProduct')
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault()

        const pid = button.getAttribute('pid')
        console.log(pid)
        const url = `/web/products/productDetails/${pid}`
        window.location.replace(url)
    })
})
