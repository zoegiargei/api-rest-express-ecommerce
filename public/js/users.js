/* eslint-disable no-undef */
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
        const url = `/api/users/updateRole/${uid}`
        const newRole = form.elements.role.value
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRole)
        }).then(result => {
            if (result.status === 200) {
                location.reload()
            }
        })
    })
})
