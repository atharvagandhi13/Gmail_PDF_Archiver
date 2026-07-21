/**
 * Gmail DL Mail-to-PDF Exporter
 * -----------------------------
 * Searches Gmail using a fully configurable query (To / Cc / Bcc / Delivered-To /
 * Subject / date range, combined with AND / OR) and exports every matching
 * message as an individual PDF into a Google Drive folder.
 *
 * SETUP
 * 1. Go to https://script.google.com -> New project.
 * 2. Paste this entire file, replacing the default Code.gs contents.
 * 3. Edit the CONFIG section below.
 * 4. Click Run > exportDlMailsToPdf. Authorize the requested Gmail + Drive
 *    permissions on first run.
 * 5. PDFs will appear in a Drive folder named FOLDER_NAME.
 *
 * QUERY SYNTAX (this is native Gmail search syntax passed straight through
 * to GmailApp.search, so anything that works in the Gmail search bar works
 * here too):
 *
 *   to:someone@example.com          -> message sent to this address
 *   cc:someone@example.com          -> message has this address in Cc
 *   bcc:someone@example.com         -> ONLY matches mail YOU sent with this
 *                                      Bcc; Gmail never exposes Bcc on
 *                                      received mail (see README).
 *   deliveredto:list@example.com    -> message was delivered via this
 *                                      mailing list / distribution list -
 *                                      use this as the Bcc-DL workaround.
 *   subject:"exact phrase"          -> subject contains this phrase
 *   subject:word                    -> subject contains this word
 *   after:2026/01/01                -> on or after this date
 *   before:2026/07/01               -> strictly before this date
 *
 *   Combine with AND / OR and parentheses, e.g.:
 *
 *   '((to:dl-alpha@example.com OR cc:dl-alpha@example.com) OR
 *      (to:dl-beta@example.com OR cc:dl-beta@example.com))
 *      AND subject:"Weekly Report"
 *      after:2026/01/01 before:2026/07/01'
 *
 *   Gmail search treats a bare space between terms as AND, so explicit
 *   "AND" is optional but kept above for readability.
 */

// ======================= CONFIG - EDIT THIS ======================= //

const QUERY =
  '(' +
    '(to:dl-alpha@example.com OR cc:dl-alpha@example.com OR deliveredto:dl-alpha@example.com)' +
    ' OR ' +
    '(to:dl-beta@example.com OR cc:dl-beta@example.com OR deliveredto:dl-beta@example.com)' +
  ')' +
  ' AND subject:"Project Update"' +
  ' after:2026/01/01 before:2026/07/01';

const FOLDER_NAME = 'DL Mail PDFs';

// batch size per Gmail search page (max 500, 100 is a safe default)
const BATCH_SIZE = 100;

// ==================================================================== //

function exportDlMailsToPdf() {
  const folder = getOrCreateFolder_(FOLDER_NAME);
  let start = 0;
  let exported = 0;

  while (true) {
    const threads = GmailApp.search(QUERY, start, BATCH_SIZE);
    if (threads.length === 0) break;

    threads.forEach(thread => {
      thread.getMessages().forEach(msg => {
        exportMessageAsPdf_(msg, folder);
        exported++;
      });
    });

    start += BATCH_SIZE;
  }

  Logger.log('Done. Exported ' + exported + ' message(s) to Drive folder "' + FOLDER_NAME + '".');
}

function exportMessageAsPdf_(msg, folder) {
  const hdr =
    '<b>From:</b> ' + esc_(msg.getFrom()) + '<br>' +
    '<b>To:</b> ' + esc_(msg.getTo()) + '<br>' +
    '<b>Cc:</b> ' + esc_(msg.getCc()) + '<br>' +
    '<b>Date:</b> ' + msg.getDate() + '<br>' +
    '<b>Subject:</b> ' + esc_(msg.getSubject()) + '<hr>';

  const html = hdr + (msg.getBody() || '');
  const name = (
    Utilities.formatDate(msg.getDate(), Session.getScriptTimeZone(), 'yyyy-MM-dd') +
    ' - ' + msg.getSubject()
  ).slice(0, 120);

  const pdf = Utilities.newBlob(html, 'text/html')
    .getAs('application/pdf')
    .setName(sanitizeFileName_(name) + '.pdf');

  folder.createFile(pdf);
}

function getOrCreateFolder_(name) {
  const it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

function esc_(s) {
  return (s || '').replace(/</g, '&lt;');
}

function sanitizeFileName_(name) {
  return name.replace(/[\\/:*?"<>|]/g, '_');
}
