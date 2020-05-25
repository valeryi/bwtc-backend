import { google } from 'googleapis';
import { Base64 } from 'js-base64';
// import { logger } from './winston';

export type MessageParts = {
  from?: string,
  to: string | string[],
  cc?: string | string[],
  bcc?: string | string[],
  subject?: string,
  body?: string,
  attachments?: [string] // TODO: Add attachment support 
}

export type MessageOptions = {
  ContentType?: string,
  charset?: string,
  encoding?: string
}

export class GmailAPI {

  private gmail: any;
  private me: string = 'me';

  private headerFormat: string = '';
  private headerEnvelope: string = '';

  private email: string = '';
  private encodedEmail: string = '';

  constructor(private auth: any, private parts: MessageParts, private options?: MessageOptions) {

    this.gmail = google.gmail({ version: 'v1', auth: this.auth });

    const format = this.options ? this.prepareFormat(this.options) : this.prepareFormat({});
    const envelope = this.prepareEnvelope(this.parts);
    this.combineAndEncode(format, envelope)

  }

  private combineAndEncode(format: string, envelope: string): string {

    this.email = [
      format,
      envelope
    ].join('');

    this.encodedEmail = Base64.encodeURI(this.email);

    return this.encodedEmail;
  }

  private prepareFormat(options: MessageOptions): string {
    const ContentType = options.ContentType ? options.ContentType : 'text/html';
    const charset = options.charset ? options.charset : 'utf-8';
    const encoding = options.encoding ? options.encoding : 'base64';

    this.headerFormat = [
      `Content-Type: ${ContentType}; charset="${charset}"\r\n`,
      `MIME-Version: 1.0\r\n`,
      `Content-Transfer-Encoding: ${encoding}\r\n`
    ].join('');

    return this.headerFormat;
  }

  private prepareEnvelope(parts: MessageParts): string {
    const from = parts.from ? parts.from : this.me;
    const to = (typeof parts.to === 'string') ? parts.to : parts.to.join(',');
    let cc: string = '';
    let bcc: string = '';
    const subject = parts.subject;
    const body = parts.body;

    if (parts.cc) {
      cc = (typeof parts.cc === 'string') ? parts.cc : parts.cc.join(',');
    }
    if (parts.bcc) {
      bcc = (typeof parts.bcc === 'string') ? parts.bcc : parts.bcc.join(',');
    }

    this.headerEnvelope = [
      `From: ${from}\r\n`,
      `To: ${to}\r\n`,
      `Cc: ${cc}\r\n`,
      `Bcc: ${bcc}\r\n`,
      `Subject: ${subject}\r\n\r\n`,
      `${body}`
    ].join('');

    return this.headerEnvelope;
  }

  async sendEmail() {

    try {

      return await this.gmail.users.messages.send({
        userId: this.me,
        resource: {
          raw: this.encodedEmail
        }

      })
    } catch (err) {

      throw new Error(err.message); // TODO: Add Error Class in place of a default Error Class

    }

  }

  async saveDraft() {

    try {

      return await this.gmail.users.drafts.create({
        userId: this.me,
        resource: {
          message: {
            raw: this.encodedEmail
          }
        }
      })

    } catch (err) {

      throw new Error(err.message);

    }
  }

  async deleteDraft(id: string) {

    try {

      return await this.gmail.users.drafts.delete({
        id: id,
        userId: this.me
      });

    } catch (err) {

      throw new Error(err.message);

    }


  }

  async listAllDrafts() {

    try {

      return await this.gmail.users.drafts.list({
        userId: this.me
      });

    } catch (err) {

      throw new Error(err.message);

    }

  }

}