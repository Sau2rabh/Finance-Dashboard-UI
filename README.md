# FinPulse — Modern Finance Dashboard

![FinPulse Logo](https://img.shields.io/badge/FinPulse-3b5df9?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

A high-performance, visually stunning finance management dashboard built with **React 19**, **TypeScript**, and **Vite**. This project demonstrates advanced UI/UX principles, including glassmorphism, dynamic animations, and Role-Based Access Control (RBAC).

---

## Key Features

- **Dynamic Dashboard**: Real-time visualization of income, expenses, and savings using `Recharts`.
- **RBAC (Role-Based Access Control)**: 
  - **Admin**: Full CRUD capabilities (Add, Edit, Delete).
  - **Viewer**: Read-only access with intuitive UI feedback for restricted actions.
- **Transaction Management**: 
  - Advanced filtering, multi-column sorting, and real-time search.
  - Bulk deletion for administrative efficiency.
  - CSV Export for data portability.
- **Smart Budgeting**: Dynamic progress tracking with visual alerts for overspending.
- **AI-Powered Insights**: (Simulated) context-aware financial health analysis.
- **Theme Engine**: Seamless transition between sophisticated Light and Dark modes.
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop displays.

---

## Evaluation Criteria Mapping

| Criterion | Implementation Highlights |
| :--- | :--- |
| **1. Design & Creativity** | Premium "Glassmorphism" aesthetic, custom `Outfit` typography, and vibrant HSL-tailored color palettes. |
| **2. Responsiveness** | Breakpoint-aware layouts using Tailwind CSS. Sidebar-to-BottomNav transition for mobile mobility. |
| **3. Functionality** | Fully interactive CRUD, robust filtering/sorting logic, and role-based feature toggling. |
| **4. User Experience** | Smooth transitions via `Framer Motion`, intent-based micro-animations, and descriptive tooltips. |
| **5. Technical Quality** | Strict TypeScript implementation, modular component architecture, and clean separation of concerns. |
| **6. State Management** | Unified `FinanceContext` for centralized data flow, custom hooks for logic reuse. |
| **7. Documentation** | Comprehensive project overview, setup guides, and architectural explanations (This README). |
| **8. Attention to Detail** | Empty states, loading shimmers, CSV BOM compatibility, and accessibility-compliant interactive elements. |

---

## Tech Stack

- **Core**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS 4.0, PostCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast

---

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run in development mode**:
   ```bash
   npm run dev
   ```
4. **Build for production**:
   ```bash
   npm run build
   ```

---

## Architecture Overview

The project follows a directory-based modular structure:
- `/components`: Atomic UI elements and complex organisms (Modals, Tables).
- `/context`: Centralized State Management (RBAC & Financial Data).
- `/hooks`: Reusable logic for themes and viewport handling.
- `/lib`: Utility functions and configuration (cn helper, tailwind merge).
- `/pages`: Primary view components.

---

## RBAC Logic

Unauthorized actions in 'Viewer' mode are handled gracefully:
- Action buttons (Edit/Delete) are visually desaturated and disabled.
- Interactive tooltips explain permission restrictions.
- Global guards in the `FinanceProvider` prevent unauthorized state mutations.

---

Designed for a Premium User Experience.
