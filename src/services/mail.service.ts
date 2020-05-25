import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { GmailAPI, MessageParts } from "../utils/GmailAPI";
import { googleAPI } from "../utils/googleAPI";

class MailService {

    private pathToTemplates: string = '/src/assets/emailTemplates';

    constructor() { }

    getTemplate(template: any) {

        if (!template.name || template.name === '') {
            throw new Error(`Template name should be provided`) // TODO: Add Error Class for email Templates
        }

        const regEx = RegExp(`^(${template.name})(.html)$`, 'i');

        // Checking for a file in a template directory and assigning its full name to a variable
        var fileName = readdirSync(path.join(process.cwd(), this.pathToTemplates)).filter(file => regEx.test(file))[0];

        if (!fileName) {
            throw new Error(`Couldn't find email tempalte '${template.name}' in ${this.pathToTemplates} directory`);
        }

        // Reading a template and assigning it to a variable
        var html = readFileSync(path.join(process.cwd(), this.pathToTemplates, fileName), { encoding: 'utf8' });

        for (const key in template.data) {
            if (template.data.hasOwnProperty(key)) {
                const value = template.data[key]; // TODO: Check for type templateOptions and assign it

                const ex = RegExp(`\{ +${key} +\}`, 'i');
                html = html.replace(ex, value);

            }
        }

        return html;
    }

    sendEmail(emailParams: MessageParts, template: any) {

        if (!emailParams.to || emailParams.to.length < 0) {
            throw new Error(`Should be at least one recipient!`);
        };

        const html = this.getTemplate(template);

        new GmailAPI(googleAPI.auth, {
            to: emailParams.to,
            subject: emailParams.subject,
            body: html
        }).sendEmail()
    }

}

export const mailService = new MailService();