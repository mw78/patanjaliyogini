import {Application} from 'express'
import {Request, Response,} from 'express'

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Recaptcha = require('express-recaptcha').RecaptchaV2
const formData = require('form-data')
const Mailgun = require('mailgun.js')
const mailgun = new Mailgun(formData)
const {check, validationResult} = require('express-validator')
require('dotenv').config()

const validation = [
    check('name','A valid name is required.').not().isEmpty().trim().escape(),
    check('email', 'Please provide valid email.').isEmail(),
    check('subject').optional().trim().escape(),
    check('message', 'A message of up to 2000 characters is required.').trim().escape().isLength({min: 1, max: 2000})
]

const app: Application = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY)
//mg = mailgun
const mailgunClient = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY})

const handleGetRequest = (request: Request, response: Response) => {
    return response.json('This thing is on!')
}

const handlePostRequest = (request: Request, response: Response) => {
    response.append('Content-Type', 'text/html')
    response.append('Access-Control-Allow-Origin', '*')

    //@ts-ignore
    if (request.recaptcha.error) {
        return response.send(
            `<div class='alert alert-danger' role='alert'><strong>Oh Snap!</strong>There was a Recaptcha error. Please try again.</div>`
        )
    }
    const errors = validationResult(request)

    if(errors.isEmpty() === false) {
        const currentError = errors.array()[0]
        return response.send(
            `<div class='alert alert-danger' role='alert'><strong>Oh Snaps!</strong> ${currentError.msg}</div>`
        )
    }

    const {name, email, subject, message} = request.body

    const mailgunData = {
        to: process.env.MAIL_RECIPIENT,
        from: `${name} <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        subject: `${email}: ${subject}`,
        text: message
    }

    mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, mailgunData)
        .then((msg: any) =>
        response.send(
            `<div class='alert alert-success' role='alert'>Email successfully sent.</div>`
        )
        )
        .catch((error: any) => {
            console.error(error)
            return response.send( `<div class='alert alert-danger' role='alert'><strong>Oh Snap-3!</strong> Email failed. Please try again.</div>`)
            }
        )


}

const indexRoute = express.Router()

indexRoute.route('/')
    .get(handleGetRequest)
    .post(recaptcha.middleware.verify, validation, handlePostRequest)

app.use('/apis', indexRoute)

app.listen(4200, () => {
    console.log('Express successfully built.')
})
