/* eslint-disable no-undef */
class DataToUpdateRole {
    constructor (uid, role) {
        this.uid = uid
        this.role = role
    }
}

const buttons = document.querySelectorAll('.btnDeleteUser')
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const uid = button.getAttribute('uid')
        const url = `/api/users/deleteUser/${uid}`

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

const forms = document.querySelectorAll('.formUpdateRole')
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const uid = form.getAttribute('uid')
        console.log(uid)
        const dataToSend = new DataToUpdateRole(uid, String(form.elements.role.value))

        fetch('/api/users/updateRole', {
            method: 'PUT',
            body: JSON.stringify(dataToSend),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            if (result.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'User Role updated successfully'
                })

                setTimeout(() => {
                    location.reload()
                }, 3000)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Internal Server Error'
                })
            }
        })
    })
})
