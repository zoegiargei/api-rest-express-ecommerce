/* eslint-disable no-undef */
class DataNewPassword {
    constructor (currentPassword, newPassword, confirmPassword) {
        this.currentPassword = currentPassword
        this.newPassword = newPassword
        this.confirmNewPassword = confirmPassword
    }
}

const newPasswordForm = document.getElementById('newPasswordForm')

newPasswordForm.addEventListener('submit', e => {
    e.preventDefault()

    const dataForm = new FormData(e.target)
    const dataNewPassword = new DataNewPassword(dataForm.get('currentPassword'), dataForm.get('newPassword'), dataForm.get('confirmPassword'))

    console.log(dataNewPassword)
    fetch('/api/users/updatePassword', {
        method: 'PUT',
        body: JSON.stringify(dataNewPassword),
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(result => {
        if (result.status === 201) {
            newPasswordForm.reset()
            Swal.fire({
                icon: 'success',
                title: 'Password updated successfully'
            })
            setTimeout(() => {
                window.location.replace('/web/home/')
            }, 3000)
        } else {
            newPasswordForm.reset()
            Swal.fire({
                icon: 'warning',
                title: 'One of the credentials is wrong'
            })
        }
    })
})
