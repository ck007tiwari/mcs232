# PDF Upload System Testing Guide

## 🧪 **Complete Testing Instructions**

### **📁 Available Test Files:**
Your `public/pdf/` folder contains:

1. **Computer_800KB_148_page.pdf** - ❌ **INVALID** (148 pages > 100 limit)
2. **Web_development_1MB_PDF_84_page.pdf** - ✅ **VALID** (1MB, 84 pages)
3. **10.5MB_PDF_57_pages.pdf** - ❌ **INVALID** (10.5MB > 10MB limit)

### **🔐 Test Scenarios:**

#### **1. Student Upload Test (`ck@tiwari.com` / `ck12345`):**
```bash
1. Login as student
2. Click any "Upload PDF" button
3. Select a subject
4. Try uploading each test file:
   - 148-page PDF → Should show "PDF has 148 pages. Maximum allowed is 100 pages"
   - 10.5MB PDF → Should show "File size must be less than 10MB (current: 10.5MB)"
   - 1MB PDF → Should validate successfully ✅
5. Upload the valid PDF
6. Check it shows Lock icon (private access)
7. Verify file appears in subject view
```

#### **2. Admin Upload Test (`ck@tiwari.com` / `ck123456`):**
```bash
1. Login as admin
2. Upload valid PDF
3. Check it shows Globe icon (public access)
4. Go to Admin Dashboard
5. Verify you can see ALL PDFs (including student's private ones)
6. Test PDF deletion functionality
```

#### **3. Access Control Test:**
```bash
1. Login as student → Upload private PDF
2. Logout → Login as admin
3. Admin should see the student's PDF
4. Upload PDF as admin (public)
5. Logout → Login as student  
6. Student should see admin's public PDF
```

### **🎯 Validation Features to Test:**

#### **File Size Validation:**
- ✅ Files under 10MB should pass
- ❌ Files over 10MB should be rejected
- Real-time error message with actual file size

#### **Page Count Validation:**
- ✅ PDFs under 100 pages should pass
- ❌ PDFs over 100 pages should be rejected
- Simulated page extraction (in real app would use PDF.js)

#### **File Type Validation:**
- ✅ Only PDF files accepted
- ❌ Other file types rejected immediately

#### **Upload Process:**
- 📁 File selection (drag & drop or click)
- 🔍 Real-time validation with loading indicator
- ✅ Success confirmation with file details
- 💾 Simulated save to public folder
- 🔄 Auto-refresh of PDF lists

### **🎨 UI Features to Test:**

#### **Visual Indicators:**
- 🌐 Globe icon = Public access (admin uploads)
- 🔒 Lock icon = Private access (student uploads)
- ✅ Green checkmark = Valid file
- ❌ Red warning = Invalid file

#### **Upload Locations:**
- Sidebar: "Upload PDF" button
- Dashboard: Quick Actions section
- Subject view: Header + empty state buttons
- Admin panel: "Upload PDF (Public)" button

#### **Progress Feedback:**
- Validation loading spinner
- Upload progress bar
- Success/error messages
- File details display

### **🐛 Error Scenarios to Test:**

1. **No subject selected** → "Please select a valid file and subject"
2. **Large file** → "File size must be less than 10MB"
3. **Too many pages** → "PDF has X pages. Maximum allowed is 100 pages"
4. **Wrong file type** → "Only PDF files are allowed"
5. **Corrupted PDF** → "Failed to process PDF file"

### **💡 Expected Behaviors:**

#### **File Validation:**
- Immediate feedback on file selection
- Page count extraction (simulated)
- Size validation in real-time
- Clear error messages

#### **Access Control:**
- Student uploads → Private (Lock icon)
- Admin uploads → Public (Globe icon)
- Proper visibility rules enforced
- Visual indicators everywhere

#### **File Management:**
- Unique filename generation
- Simulated save to public folder
- Real-time UI updates
- Proper metadata storage

### **🔍 Console Logs to Watch:**
```javascript
// Check browser console for:
"File would be saved to: public/pdf/filename_userId_timestamp_random.pdf"
"Upload error: [error message]"
"PDF metadata: {pageCount, fileSize, fileName}"
```

### **✅ Success Criteria:**
- [ ] File size validation works correctly
- [ ] Page count validation works correctly  
- [ ] Access control icons display properly
- [ ] Upload progress shows correctly
- [ ] Files appear in correct subject
- [ ] Admin can delete any PDF
- [ ] Student sees only accessible PDFs
- [ ] Error messages are clear and helpful
- [ ] UI updates in real-time
- [ ] Upload locations all work

### **🚀 Next Steps:**
After testing, you can:
1. Connect to real backend API
2. Implement actual PDF.js for page extraction
3. Add real file upload to server
4. Enhance error handling
5. Add batch upload functionality

The system is designed to be production-ready with minimal backend integration!