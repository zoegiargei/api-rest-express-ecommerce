class TemplatesForEmails {
    templateEmailResetPass (url, username) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="utf-8">
            <title>Password Reset</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                h1 {
                    color: #333333;
                    font-size: 24px;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                
                p {
                    color: #555555;
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                
                .button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 16px;
                    padding: 10px 20px;
                    border-radius: 5px;
                }
                
                .button:hover {
                    background-color: #0056b3;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <h1>Password Reset</h1>
                <p>Hello, ${username}</p>
                <p>You are receiving this email because you have requested to reset your password. Click the button below to proceed:</p>
                <a class="button" style="color: white;" href=${url}>Reset Password</a>
                <p>If you didn't request a password reset, you can ignore this message.</p>
                <p>Thank you,</p>
                <p>Support Team</p>
            </div>
            </body>
            </html>
        `
    }

    templateSendTicket (ticket) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Purchase Confirmation Email</title>
            </head>
            <body>
                <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="background-color: #ffffff; padding: 20px;">
                        <h2 style="color: #333333;">Purchase Confirmation</h2>
                        <p>Thank you for your purchase!</p>
                        <p>Below you will find the details of your purchase ticket:</p>
                        
                        <div style="border: 1px solid #dddddd; padding: 10px;">
                            <h3 style="color: #333333;">Purchase Ticket</h3>
                            <p>Ticket Value: <strong>${ticket}</strong></p>>
                        </div>
                        
                        <p>If you have any questions or need further information, feel free to contact us.</p>
                        <p>Thank you again, and we hope to see you soon!</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }
}

const templatesForEmails = new TemplatesForEmails()
export default templatesForEmails
