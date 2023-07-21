/* eslint-disable no-undef */
const logoutForm = document.getElementById('logoutForm')
if (logoutForm instanceof HTMLFormElement) {
    logoutForm.addEventListener('submit', (e) => {
        e.preventDefault()

        fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            result => {
                if (result.status === 200) {
                    window.location.replace('/web/auth/login/')
                } else {
                    window.location.replace('/web/error/')
                }
            }
        )
    })
}

const formResetPassword = document.getElementById('formResetPassword')
formResetPassword.addEventListener('submit', (e) => {
    e.preventDefault()

    fetch('/api/users/updatePassword/firstStep/true', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'We sent you the email to reset your password'
            })
        }
    })
})
