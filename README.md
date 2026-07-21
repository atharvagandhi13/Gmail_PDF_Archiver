# Gmail PDF Archiver

A single Google Apps Script that searches your Gmail for messages sent to,
cc'd, or bcc'd on one or more distribution lists (DLs) / mailing lists, and
exports each matching message as an individual PDF into a Google Drive
folder — no third-party tools, no server, no API keys.

Useful for compliance archiving, audit trails, client reporting threads, or
just backing up important DL correspondence outside Gmail.

## Features

- Filter by `to:`, `cc:`, `bcc:`, `deliveredto:`, `subject:`, and date range
  (`after:` / `before:`), combined with `AND` / `OR` and parentheses.
- One PDF per message (not per thread), so each email is its own file.
- Each PDF includes From / To / Cc / Date / Subject header plus the full
  message body.
- Auto-paginates through all matching messages (no manual re-running for
  large result sets).
- Runs entirely inside Google's infrastructure — nothing leaves your
  Google account.

## Requirements

- A Google account with Gmail and Google Drive.
- Access to [script.google.com](https://script.google.com) (Google Apps
  Script is free).

## Setup

1. Go to [script.google.com](https://script.google.com) and create a new
   project.
2. Delete the default boilerplate and paste in the full contents of
   [`gmail-dl-to-pdf-exporter.gs`](./gmail-dl-to-pdf-exporter.gs).
3. Edit the `CONFIG` section at the top of the file:
   - `QUERY` — your filter conditions (see [Query syntax](#query-syntax)
     below).
   - `FOLDER_NAME` — the Drive folder the PDFs will be saved into (created
     automatically if it doesn't exist).
4. Save the project (Ctrl/Cmd + S).
5. From the function dropdown, select `exportDlMailsToPdf` and click
   **Run**.
6. On first run, Google will prompt you to authorize Gmail read access and
   Drive file creation — review and accept.
7. Check **View > Logs** (or **Executions**) to see how many messages were
   exported. Your PDFs will be in the named Drive folder.

## Query syntax

The script passes `QUERY` directly to Gmail's native search
(`GmailApp.search`), so anything that works in the Gmail search bar works
here.

| Operator | Meaning |
|---|---|
| `to:address` | Message was sent directly to this address |
| `cc:address` | Address appears in Cc |
| `bcc:address` | Only matches mail **you sent** with this address in Bcc (see limitation below) |
| `deliveredto:address` | Message was delivered via this address/list — the reliable way to catch DL/Bcc mail you received |
| `subject:"exact phrase"` | Subject contains this phrase |
| `after:2026/01/01` | On or after this date |
| `before:2026/07/01` | Strictly before this date |

Example — mail to either of two DLs, with a specific subject, within a
date range:

```js
const QUERY =
  '(' +
    '(to:dl-alpha@example.com OR cc:dl-alpha@example.com OR deliveredto:dl-alpha@example.com)' +
    ' OR ' +
    '(to:dl-beta@example.com OR cc:dl-beta@example.com OR deliveredto:dl-beta@example.com)' +
  ')' +
  ' AND subject:"Project Update"' +
  ' after:2026/01/01 before:2026/07/01';
```

### A note on Bcc

Gmail never exposes Bcc recipients on mail you *received* — that
information simply isn't in the headers delivered to you, by design (email
protocol limitation, not a Gmail restriction). `bcc:` in Gmail search only
matches messages **you sent**. If you were Bcc'd via a distribution list,
use `deliveredto:` instead — it matches based on the list the message was
actually routed through, regardless of which header field it was in.

## Output

Each exported PDF is named:

```
YYYY-MM-DD - <subject>.pdf
```

and contains a short metadata header (From / To / Cc / Date / Subject)
followed by the message body, e.g.:

```
From: sender@example.com
To: dl-alpha@example.com
Cc: manager@example.com
Date: Tue Jul 21 2026 10:32:00 GMT+0000
Subject: Project Update - Week 29
------------------------------------
<original message body>
```

## Limitations

- Google Apps Script executions are capped at 6 minutes; very large
  mailboxes may need multiple runs (re-running skips nothing extra since
  each run starts a fresh search — for true resumability, add a
  checkpoint using `PropertiesService`, left as an extension).
- PDF rendering uses Gmail's HTML-to-PDF conversion, so complex email
  layouts (heavy CSS, embedded widgets) may render slightly differently
  than in the Gmail UI.
- Attachments are not currently extracted/embedded — only the message
  body is exported.

## License

MIT — see [LICENSE](./LICENSE).

