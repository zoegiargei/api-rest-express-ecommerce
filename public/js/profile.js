/* eslint-disable no-undef */
function spinner () {
    document.getElementById('loader').classList.toggle('loader2')
}

const logoutForm = document.getElementById('logoutForm')
if (logoutForm instanceof HTMLFormElement) {
    logoutForm.addEventListener('submit', (e) => {
        e.preventDefault()

        spinner()
        fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            spinner()
            if (result.status === 200) {
                window.location.replace('/web/auth/login/')
            } else {
                window.location.replace('/web/error/')
            }
        })
    })
}

const formResetPassword = document.getElementById('formResetPassword')
formResetPassword.addEventListener('submit', (e) => {
    e.preventDefault()

    spinner()
    fetch('/api/users/updatePassword/firstStep/true', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        spinner()
        if (result.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'We sent you the email to reset your password'
            })
        }
    }).catch(error => {
        spinner()
        console.log(error)
    })
})
