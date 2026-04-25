# PrintNow

> A smart document printing platform that lets users upload PDFs online, choose print preferences, and collect printed documents from the store using a unique pickup code.

---

## Live Demo

Frontend: [your-vercel-link ](https://print-now.vercel.app/)
Backend API: [your-render-link](https://printnow-backend-nbe7.onrender.com/)

## Problem Statement

Traditional printing services require customers to physically visit the store, wait in queues, submit documents manually, and wait again for printing.

**Pain points:**

- Time wastage and long waiting lines
- Poor order management
- Confusion handling multiple customer print requests
- No proper tracking of submitted documents
- Delays in urgent printing needs

PrintNow shifts the entire printing request process online to solve these issues.

---

## Solution

The customer uploads a PDF, selects print preferences, chooses a pickup time, and receives a **unique pickup code**. The storekeeper receives the order in advance, prepares the print, and verifies the customer using the code during collection.

**Benefits:**

- Faster service & reduced waiting time
- Better queue management
- Improved customer experience
- Better file handling for storekeepers

---

## Project Workflow

```
Customer Registration / Login
        ↓
    Upload PDF File
        ↓
  Select Print Type (Color / B&W)
        ↓
    Choose Pickup Time
        ↓
  Automatic Page Detection
        ↓
  Automatic Price Calculation
        ↓
  Unique Pickup Code Generation
        ↓
  Storekeeper Views Pending Orders
        ↓
   Storekeeper Opens PDF & Prints
        ↓
    Customer Visits Store
        ↓
  Customer Provides Pickup Code
        ↓
   Storekeeper Verifies Code
        ↓
      Order Completed
        ↓
  File Automatically Deleted
```

---

## System Architecture

### Frontend

| Technology   | Purpose                                        |
| ------------ | ---------------------------------------------- |
| React.js     | UI rendering and page navigation               |
| Tailwind CSS | Modern responsive styling                      |
| Axios        | API communication between frontend and backend |
| React Router | Page navigation                                |
| LocalStorage | Stores JWT token and user info after login     |

### Backend

| Technology | Purpose                                        |
| ---------- | ---------------------------------------------- |
| Node.js    | Server-side operations                         |
| Express.js | Routes and API management                      |
| JWT        | Secure authentication                          |
| Multer     | PDF file upload handling                       |
| Bcrypt     | Password encryption before storing in DB       |
| pdf-parse  | Automatic PDF page count detection for pricing |

### Database & Storage

| Technology       | Purpose                                     |
| ---------------- | ------------------------------------------- |
| PostgreSQL       | Stores users, orders, and file metadata     |
| Supabase         | Cloud PostgreSQL database provider          |
| Supabase Storage | Secure cloud storage for uploaded PDF files |

---

## Database Schema

### `users`

| Column   | Description                 |
| -------- | --------------------------- |
| id       | User ID (primary key)       |
| name     | Full name                   |
| email    | Email address               |
| password | Bcrypt-encrypted password   |
| role     | `customer` or `storekeeper` |

### `orders`

| Column      | Description                        |
| ----------- | ---------------------------------- |
| id          | Order ID (primary key)             |
| user_id     | Foreign key → users                |
| pickup_time | Scheduled pickup datetime          |
| pickup_code | Unique verification code           |
| status      | Order status (pending / completed) |
| total_price | Calculated price (₹)               |
| created_at  | Timestamp of order creation        |

### `order_files`

| Column     | Description                     |
| ---------- | ------------------------------- |
| id         | File ID (primary key)           |
| order_id   | Foreign key → orders            |
| file_url   | Supabase Storage URL            |
| file_name  | Original file name              |
| pages      | Number of pages (auto-detected) |
| print_type | `color` or `bw`                 |

---

## Features

### Customer

- User registration & login
- JWT secure authentication
- Upload PDF documents (with file type & size validation)
- Automatic PDF page detection
- Select print type (Color / B&W)
- Select pickup time (validated within next 3 days)
- Automatic price calculation
- Unique pickup code generation
- View order history & single order details
- Cancel pending orders

### Storekeeper

- Storekeeper login
- View all pending orders
- Open uploaded PDF files
- Real-time auto refresh for new orders
- Manual pickup code verification
- Mark orders as completed
- Auto-delete files after completion

### Security

- JWT protected routes
- Role-based access control
- Password encryption (Bcrypt)
- Duplicate pickup code prevention
- File type & size validation
- Pickup time validation
- Unauthorized access prevention

---

## Business Logic

### Price Calculation

```
Black & White = ₹2 per page
Color Print   = ₹5 per page

Total Price = Pages × Price Per Page
```

### Pickup Code Generation

```
1. Generate random code
2. Check database for duplicates
3. If duplicate → regenerate
4. If unique → save to order
```

### Pickup Time Validation

- Must be a **future** time
- Must be **within the next 3 days**

### Order Verification Flow

```
Customer visits store
       ↓
Customer provides pickup code
       ↓
Storekeeper enters code manually
       ↓
Backend verifies code
       ↓
If valid → status = completed
       ↓
File deleted from cloud storage
```

---

## Tech Stack

```
Frontend  →  React.js + Tailwind CSS + Axios + React Router DOM
Backend   →  Node.js + Express.js + JWT + Multer + Bcrypt + pdf-parse
Database  →  PostgreSQL (via Supabase)
Storage   →  Supabase Storage
```

---

## Deployment

| Layer    | Platform |
| -------- | -------- |
| Frontend | Vercel   |
| Backend  | Render   |
| Database | Supabase |

---

## Why Supabase?

- Provides cloud PostgreSQL + secure file storage out of the box
- Easy scalability and reliable backend infrastructure
- Speeds up MVP development without managing manual cloud server setup

---

## Why Payment Gateway Was Skipped

Razorpay integration is intentionally postponed for this MVP.

**Focus areas for this version:**

- Core workflow implementation
- Backend architecture
- Real-world problem solving
- Verification system

Payment gateway will be added in a future production release.

---

## Future Scope

- [ ] Razorpay Payment Gateway Integration
- [ ] Email Confirmation on Order
- [ ] SMS / WhatsApp Notifications
- [ ] Multi-store Support
- [ ] Admin Dashboard
- [ ] Real-Time Notifications (WebSockets)
- [ ] Mobile Application
- [ ] Push Notifications
- [ ] Order Analytics Dashboard
- [ ] Customer Reviews System

---

## Project Status

✅ **MVP Completed**

- Customer order flow — done
- Storekeeper verification flow — done
- File upload & cloud storage — done
- Order management system — done
- Secure authentication — done
- Real-time order handling — done
- Frontend + Backend integration — done
- Ready for deployment

---

## Author

**Developed by Sumanth**

Built as a full-stack real-world problem-solving project using modern web technologies — covering backend development, database design, authentication systems, cloud storage handling, and business workflow automation.
