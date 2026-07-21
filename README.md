# 📧 Gmail PDF Archiver

> A configurable **Google Apps Script** that automatically exports Gmail emails as individual PDF files into Google Drive using Gmail's native search operators.

No third-party tools • No servers • No API keys • 100% Google Workspace

---

## 🚀 Overview

**Gmail PDF Archiver** helps automate the process of exporting Gmail messages into searchable PDF documents stored in Google Drive.

Instead of manually opening emails and printing them as PDFs, this script automates the entire workflow.

Perfect for:

- 📂 Email Archiving
- 📊 Audit & Compliance
- 📑 Client Reporting
- 🏢 Distribution List (DL) Backups
- 🤖 Workflow Automation
- 📚 Knowledge Management

---

# ✨ Features

- ✅ Export Gmail emails directly as PDF
- ✅ Supports Gmail Search Operators
  - `to:`
  - `cc:`
  - `bcc:`
  - `deliveredto:`
  - `subject:`
  - `after:`
  - `before:`
- ✅ Supports complex `AND` / `OR` conditions
- ✅ One PDF generated per email
- ✅ Automatically creates Drive folder
- ✅ Processes emails in batches
- ✅ No external APIs
- ✅ Runs entirely within Google Workspace

---

# 🛠 Tech Stack

- Google Apps Script
- JavaScript
- Gmail Service
- Google Drive Service

---

# 📁 Repository Structure

```
Gmail_PDF_Archiver/
│
├── gmail_pdf_archiver.gs      # Main Google Apps Script
├── README.md                  # Documentation
├── LICENSE                    # MIT License
│
└── images/
    ├── appscript-editor.png
    ├── gmail-search.png
    ├── drive-output.png
    └── sample-pdf.png
```

---

# ⚙️ Requirements

- Google Account
- Gmail
- Google Drive
- Google Apps Script

---

# 🚀 Getting Started

## Step 1

Open

https://script.google.com

Create a new Apps Script project.

---

## Step 2

Copy the contents of

```
gmail_pdf_archiver.gs
```

into the Apps Script editor.

---

## Step 3

Update the configuration section.

```javascript
const CONFIG = {

  QUERY:
    '(to:example@gmail.com OR cc:example@gmail.com) ' +
    'AND subject:"Project Update" ' +
    'after:2026/01/01 before:2026/07/01',

  OUTPUT_FOLDER:
    'Exported PDFs'

};
```

---

## Step 4

Run

```
exportDlMailsToPdf()
```

Authorize Gmail and Drive permissions.

---

## Step 5

Done 🎉

Your PDFs will be available inside your Google Drive folder.

---

# 🔍 Gmail Query Examples

## Single Recipient

```
to:example@gmail.com
```

---

## CC

```
cc:team@example.com
```

---

## Distribution List

```
deliveredto:marketing@example.com
```

---

## Subject

```
subject:"Invoice"
```

---

## Date Range

```
after:2026/01/01 before:2026/07/01
```

---

## Multiple Conditions

```javascript
(
(to:teamA@example.com OR cc:teamA@example.com)
OR
(to:teamB@example.com OR cc:teamB@example.com)
)
AND subject:"Project Update"
after:2026/01/01
before:2026/07/01
```

---

# 📄 Output

Generated PDFs follow this format:

```
2026-05-17 - Weekly Client Report.pdf
```

Each PDF contains:

- From
- To
- CC
- Date
- Subject
- Original Email Body

---

# 📸 Screenshots

## Google Apps Script

![Apps Script](images/appscript-editor.png)

---

## Gmail Search Results

![Search](images/gmail-search.png)

---

## Generated PDFs

![Drive](images/drive-output.png)

---

## Sample PDF

![PDF](images/sample-pdf.png)

---

# ⚠️ Limitations

- Google Apps Script executions are limited to approximately **6 minutes**.
- Extremely large mailboxes may require multiple executions.
- Attachments are not exported.
- Complex HTML emails may render slightly differently in PDF format.
- `bcc:` searches only work for emails **you have sent**. Use `deliveredto:` to locate received distribution-list emails.

---

# 💡 Future Enhancements

- Export Attachments
- ZIP Download Support
- Export Entire Conversation Threads
- Resume from Last Export
- Progress Indicator
- Email Label Filtering
- HTML Export Option
- Google Sheets Export Log

---

# 🤝 Contributing

Contributions, feature requests, and suggestions are welcome.

Feel free to fork the repository and open a Pull Request.

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork it

💬 Share feedback

---

Built using ❤️ with Google Apps Script.
