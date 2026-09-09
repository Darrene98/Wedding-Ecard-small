/**
 * Google Apps Script backend for the wedding RSVP form.
 *
 * SETUP
 * 1) Create a Google Sheet. Name the first sheet "RSVP".
 * 2) Add these headers in row 1:
 *    Timestamp | Guest / Family | Attendance | Number Attending | Contact Number | Message | Source
 * 3) Extensions > Apps Script. Paste this entire file into Code.gs.
 * 4) Replace YOUR_GOOGLE_SHEET_ID below. The ID is the long text between /d/ and /edit in the Sheet URL.
 * 5) Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 6) Copy the Web App URL into RSVP_ENDPOINT in script.js.
 */

const SHEET_ID = '1wpS2YJrB6EjVqF38qkmkTzXt-2T3Du-Fx2qsioPtpSA';
const SHEET_NAME = 'RSVP';

function doPost(e) {
  const p = e.parameter || {};

  // Honeypot: silently ignore obvious bot submissions.
  if (p.website) {
    return HtmlService.createHtmlOutput('OK');
  }

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet named RSVP was not found.');

  sheet.appendRow([
    new Date(),
    clean_(p.guestName),
    clean_(p.attendance),
    clean_(p.partySize),
    clean_(p.phone),
    clean_(p.message),
    clean_(p.source)
  ]);

  return HtmlService.createHtmlOutput('Thank you. Your RSVP has been recorded.');
}

function clean_(value) {
  value = String(value || '').trim();
  // Prevent spreadsheet-formula injection while keeping normal guest text intact.
  if (/^[=+\-@]/.test(value)) value = "'" + value;
  return value.slice(0, 1000);
}
