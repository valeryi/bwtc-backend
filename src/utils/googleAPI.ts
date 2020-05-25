import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import path from "path";
import { sysLog } from "./winston";

class GoogleAPI {
  private SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/gmail.send",
  ];

  private readonly token_path = path.join(process.cwd(), "token.json");
  private readonly credential_path = path.join(
    process.cwd(),
    "credentials.json"
  );
  auth: any = null;

  constructor() {}

  connect(): void {
    // Load client secrets from a local file.
    fs.readFile(this.credential_path, (err: any, content: any) => {
      if (err) throw new Error("Error loading client secret file: Google API");
      // Authorize a client with credentials, then call the Gmail API.
      this.authorize(JSON.parse(content), this.done.bind(this));
    });
  }

  private authorize(credentials: any, callback: Function) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(this.token_path, (err: any, token: any) => {
      if (err) return this.getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
      sysLog.info(`Connected to Google API successfully`);
    });
  }

  private getNewToken(oAuth2Client: any, callback: Function) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.SCOPES,
    });
    sysLog.warn(`Authorize this app by visiting this url: ${authUrl}`);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err: any, token: any) => {
        if (err) throw new Error("Error retrieving access token: Google API");
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(this.token_path, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          sysLog.info("Google API Token stored to", this.token_path);
        });
        callback(oAuth2Client);
      });
    });
  }

  private async done(auth: any) {
    this.auth = auth;
  }
}

export const googleAPI = new GoogleAPI();
