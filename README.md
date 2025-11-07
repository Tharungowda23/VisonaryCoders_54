<div align="center">
  <img src="logo3.png" alt="Pharma Tracker Logo" width="120">
  <h1>Pharma Tracker</h1>
  <p><b>AI-Assisted Smart Medicine Locator & Price Comparison Web App</b></p>
</div>

---

## 📝 Overview

**Pharma Tracker** is a smart web application that helps users **find medicines in nearby pharmacies** and **compare prices** instantly.  
Users can search by typing the medicine name or by **uploading a prescription image** (AI text extraction simulated for prototype).  
Using **GPS location + Price comparison**, the system ranks pharmacies to show the **cheapest and nearest** option.

---

## 🎯 Key Features

- 🔍 Search for medicines by name  
- 📷 Upload prescription image (simulated OCR detection)  
- 📍 Detect user’s current location using GPS  
- 🏪 Show nearby pharmacies on a **map** using Leaflet  
- 💸 Compare medicine **prices** across stores  
- 🌍 One-tap navigation via **Google Maps**  
- 👤 Login / Sign Up system using **localStorage**  
- 🔐 Sign Out updates navbar dynamically  

---

## 🏗 Tech Stack

| Component | Technology |
|----------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend API | Node.js + Express.js |
| File Upload | Multer |
| Mapping | Leaflet.js (OpenStreetMap) |
| User Session | LocalStorage |
| Data Storage | In-memory JSON (pharmacy list) |

---

## 🔄 System Workflow

1. User **searches** or uploads prescription.
2. App **checks pharmacy list** for availability & price.
3. **GPS detects** user location.
4. Pharmacies are **sorted by nearest + cheapest** and shown on **map + list**.

---

## 📂 Project Structure

