const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // لمشاركة ملفات HTML من مجلد "public"

// دالة لحفظ البيانات في ملف Excel
function saveToExcel(data) {
    const filePath = './data.xlsx';
    let workbook;
    let worksheet;

    // إذا كان الملف موجودًا، قم بقراءته؛ وإذا لم يكن موجودًا، أنشئ ملفًا جديدًا
    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
        workbook = xlsx.utils.book_new();
        worksheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    }

    // إضافة البيانات الجديدة إلى الجدول
    const currentData = xlsx.utils.sheet_to_json(worksheet);
    currentData.push(data);
    const updatedWorksheet = xlsx.utils.json_to_sheet(currentData);

    workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;
    xlsx.writeFile(workbook, filePath);
}

// نقطة النهاية لاستقبال البيانات من HTML
app.post('/save', (req, res) => {
    const data = {
        note: req.body.note,
        totalValue: req.body.totalValue,
        price: req.body.price,
        quantity: req.body.quantity,
        itemName: req.body.itemName,
    };
    saveToExcel(data);
    res.json({ message: 'تم حفظ البيانات بنجاح في Excel' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// server.mjs
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

// run with `node server.mjs`
