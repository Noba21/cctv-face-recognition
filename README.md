# 🚨 CCTV Face Recognition System - Backend API

<div align="center">

![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Flask](https://img.shields.io/badge/Flask-2.3.3-red)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![OpenCV](https://img.shields.io/badge/OpenCV-4.8.1-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Powerful backend API for face recognition and security monitoring**

[Features](#features) •
[Tech Stack](#tech-stack) •
[Installation](#installation) •
[API Documentation](#api-documentation) •
[Docker](#docker-deployment)

</div>

---

## 📋 Overview

This is the backend API for the CCTV Face Recognition System. It provides robust face detection, recognition, and management capabilities for security applications. Built with Flask, OpenCV, and the face_recognition library, it offers high-performance face matching and database management.

---

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Session management
- Activity logging & audit trails

### 👤 **Person Management**
- CRUD operations for persons database
- Face encoding storage and retrieval
- Risk level classification
- Status tracking
- Advanced search and filtering

### 🎥 **Face Recognition**
- **Image Recognition**: Real-time face detection and matching
- **Video Processing**: Frame extraction and batch processing
- **Confidence Scoring**: Accurate match percentage
- **Multiple Face Detection**: Handle multiple faces per media

### 📊 **Analytics & Reporting**
- Recognition statistics
- Trend analysis
- PDF report generation
- System health monitoring

### 🛡️ **Database & Storage**
- MySQL database integration
- Face encoding storage
- File upload management
- Recognition history logging

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.9+ | Core programming language |
| Flask | 2.3.3 | Web framework |
| Flask-SQLAlchemy | 3.0.5 | ORM for database |
| Flask-JWT-Extended | 4.5.2 | JWT authentication |
| Flask-Bcrypt | 1.0.1 | Password hashing |
| OpenCV | 4.8.1 | Image/video processing |
| face_recognition | 1.3.0 | Face detection & recognition |
| MySQL | 8.0 | Database |
| Redis | 5.0+ | Caching & queues |
| Celery | 5.3.4 | Async task processing |
| ReportLab | 4.0.4 | PDF generation |
| Gunicorn | 21.2.0 | WSGI server |

---

## 📁 Project Structure
