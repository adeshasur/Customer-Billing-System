# 🚀 Premium Customer Billing System

A sophisticated, modern billing management solution featuring a **High-Performance C Core** and a **Stunning React Desktop GUI**. This project demonstrates the perfect blend of low-level efficiency and high-level user experience.

---

## ✨ Features

### 💎 Modern GUI (React + Electron)

*   **Premium Dashboard**: Glassmorphism design with real-time analytics.
*   **Interactive Management**: Seamlessly add, edit, and delete customer records.
*   **Instant Search**: Blazing fast search using account numbers or names.
*   **Data Visualization**: Beautifully animated cards and tables using Framer Motion.
*   **Cross-Platform**: Packaged as a standalone Windows executable (.exe).

### 🛠️ Legacy C Core

*   **Efficient File Handling**: Robust storage using binary files (`billing.txt`).
*   **Optimized Logic**: High-performance record management with direct file manipulation.
*   **Interactive CLI**: Enhanced console interface with ASCII art and clean formatting.

---

## 🎨 Aesthetics

The GUI is designed with a **State-of-the-Art** look:

*   **Dark Mode**: Radial gradients and deep slate backgrounds.
*   **Glassmorphism**: Translucent panels with backdrop filters.
*   **Micro-animations**: Smooth transitions and hover effects for a premium feel.

---

## 🚀 Getting Started

### 🖥️ Desktop App (GUI)

1.  Navigate to the `gui` folder:
    ```bash
    cd gui
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start in development mode:
    ```bash
    npm run electron:dev
    ```

4.  Build the standalone `.exe`:
    ```bash
    npm run electron:build
    ```

### 📟 Console Version (C)

1.  Compile using GCC:
    ```bash
    gcc customer.c -o customer.exe
    ```

2.  Run the executable:
    ```bash
    ./customer.exe
    ```

---

## 📂 Project Structure

*   `customer.c`: Original high-performance C source code.
*   `gui/`: Modern React + Electron frontend application.
*   `gui/src/App.jsx`: Main dashboard logic and UI components.
*   `gui/electron.js`: Desktop application wrapper.

---

Developed with ❤️ for a premium user experience.
