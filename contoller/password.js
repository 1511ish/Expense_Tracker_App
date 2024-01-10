const Sib = require('sib-api-v3-sdk')

require('dotenv').config();

const client = Sib.ApiClient.instance
// console.log(process.env.API_KEY);
const apiKey = client.authentications['api-key']

apiKey.apiKey = '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'

const tranEmailApi = new Sib.TransactionalEmailsApi();


const sender = {
    email: 'mrishantsre1511ish@gmail.com'
}


exports.resetPassword = async (req, res, next) => {
    try {
        const email = req.body.email
        console.log(email);
        const receiver = [{ email: email }]

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject: 'Password reset',
            htmlContent: `<p>Hello !!<br>
                        You are receiving this mail as per your request to change your password for your expense tracker pro account.
                        You can change your password from here:<br>`
        })
        res.status(202).json({message:'Email sent successfully!'});
    } catch (err) {
        console.log(err)
        return res.status(403).json({ message: 'Error sending email!' })
    }
}