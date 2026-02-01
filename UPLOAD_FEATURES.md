# PDF Upload Features Documentation

## 📤 Upload Functionality

### **File Restrictions:**
- **Max File Size**: 10MB
- **Max Pages**: 100 pages
- **File Type**: PDF only
- **Validation**: Real-time file validation with error messages

### **Access Control:**
- **Student Uploads**: Private access (only user + admin can see)
- **Admin Uploads**: Public access (all users can see)
- **Visual Indicators**: Globe icon (public), Lock icon (private)

### **Upload Locations:**
1. **Sidebar**: "Upload PDF" button (always visible when sidebar is open)
2. **Dashboard**: Quick Actions section
3. **Subject View**: Header button + empty state button
4. **Admin Panel**: "Upload PDF (Public)" button

### **Upload Process:**
1. **Subject Selection**: Choose which subject to add PDF to
2. **File Selection**: Drag & drop or click to browse
3. **Validation**: Automatic file size, type, and page count checking
4. **Progress Tracking**: Visual upload progress bar
5. **Success Confirmation**: Auto-close modal with success message

### **Error Handling:**
- File size too large
- Wrong file type (non-PDF)
- Too many pages
- Missing subject selection

### **Features:**
- **Drag & Drop**: Intuitive file selection
- **Real-time Validation**: Immediate feedback on file issues
- **Progress Indication**: Visual upload progress
- **Subject Categorization**: Organize PDFs by subject
- **Access Control Info**: Clear explanation of who can access the PDF

## 🔐 Access Control System

### **User Roles:**
- **Student** (`ck@tiwari.com` / `ck12345`)
  - Can upload private PDFs
  - Can see their own PDFs + admin's public PDFs
  - Cannot delete PDFs

- **Admin** (`ck@tiwari.com` / `ck123456`)
  - Can upload public PDFs (accessible to all)
  - Can see ALL PDFs (public + private)
  - Can delete any PDF
  - Has admin dashboard access

### **PDF Visibility Rules:**
```
Admin uploads → Public (Globe icon) → Visible to ALL users
User uploads → Private (Lock icon) → Visible to uploader + admin only
```

### **Visual Indicators:**
- 🌐 **Globe Icon**: Public access
- 🔒 **Lock Icon**: Private access
- **Color coding**: Green (public), Orange (private)

## 🎯 Testing Instructions

### **Upload Test (Student):**
1. Login as student: `ck@tiwari.com` / `ck12345`
2. Click "Upload PDF" (sidebar, dashboard, or subject view)
3. Select a subject and PDF file
4. Verify upload restrictions work
5. Check PDF shows with Lock icon (private)

### **Upload Test (Admin):**
1. Login as admin: `ck@tiwari.com` / `ck123456`
2. Upload PDF - should show Globe icon (public)
3. View admin dashboard to see all PDFs
4. Test PDF deletion functionality

### **Access Control Test:**
1. Upload PDF as student (private)
2. Logout and login as admin
3. Admin should see the private PDF
4. Upload PDF as admin (public)
5. Logout and login as student
6. Student should see admin's public PDF

## 🚀 Implementation Details

### **Components Created:**
- `PdfUpload.js` - Main upload modal component
- Enhanced access control in context
- Upload buttons in multiple locations
- Visual access indicators

### **Key Features:**
- File validation with size/page limits
- Subject categorization
- Role-based access control
- Visual progress feedback
- Error handling and user feedback
- Responsive design