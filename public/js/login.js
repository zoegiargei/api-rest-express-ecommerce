/* eslint-disable no-undef */
class UserLogin {
    constructor (email, password) {
        this.email = email
        this.password = password
    }
}

const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', e => {
    e.preventDefault()

    const dataForm = new FormData(e.target)
    const userLogin = new UserLogin(dataForm.get('loginEmail'), dataForm.get('loginPassword'))

    fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(userLogin),
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(result => {
        if (result.status === 202) {
            loginForm.reset()
            window.location.replace('/web/home/')
        } else {
            loginForm.reset()
            Swal.fire({
                icon: 'warning',
                title: 'One of the credentials is wrong'
            })
        }
    })
})
