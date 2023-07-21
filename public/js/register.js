/* eslint-disable no-undef */
/* eslint-disable camelcase */
class Register {
    constructor (firstName, lastName, email, age, password, confirmPassword) {
        // eslint-disable-next-line no-unused-expressions
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.age = age
        this.password = password
        this.confirmPassword = confirmPassword
    }

    toDto () {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            age: this.age,
            password: this.password,
            confirmPassword: this.confirmPassword
        }
    }
}

const registerForm = document.getElementById('registerForm')

registerForm.addEventListener('submit', e => {
    e.preventDefault()

    const dataForm = new FormData(e.target)
    const newRegister = new Register(dataForm.get('firstName'), dataForm.get('lastName'), dataForm.get('regEmail'), dataForm.get('age'), dataForm.get('regPassword'), dataForm.get('confirmPassword'))
    const registerToDto = newRegister.toDto()
    fetch('/api/users/register', {
        method: 'POST',
        body: JSON.stringify(registerToDto),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 201) {
            registerForm.reset()
            window.location.replace('/web/home/')
        } else {
            registerForm.reset()
            Swal.fire({
                icon: 'warning',
                title: 'One of the fields is wrong'
            })
        }
        result.json()
    }).then(json => {
        console.log(String(json))
    })
})
