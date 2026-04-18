# SkillBarter - A Skill swap Marketplace

## Project Idea

SkillBarter is a fullstack web application that allows users to swap their skills with each other using time as a medium instead of money. The application allows users to offer skills they are good at and request skills they want to learn, creating a peer-to-peer learning ecosystem. 
The system manages the entire workflow of skill matching, request handling, time credit reservation, and session completion tracking.

---

## Problem Statement

Many students and professionals want to learn new skills but may not have the financial resources for expensive courses. At the same time, many possess valuable skills that could benefit others. Existing platforms mostly focus on paid learning and don't efficiently support non-monetary, time-based skill exchange.
There is a need for a platform that enables fair, organized, and efficient skill exchange without involving money.

---

## Solution

SkillBarter provides a centralized platform where users can:
- **Profile Management**: List skills offered and skills desired.
- **Skill Discovery**: Search and browse skills from the community.
- **Time-Based Currency**: Use "Time Credits" (1 hour = 1 credit) for fair exchange.
- **Request Workflow**: Send, accept, or reject swap requests with integrated credit reservation.
- **Session Tracking**: Manage learning sessions and mark them as completed.
- **Feedback System**: Rate peers and build a reputation.

---

## Scope of the Project

### In Scope
- User authentication and authorization (JWT).
- Skill CRUD (Create, Read, Update, Delete).
- Skill Marketplace (Browse available skills).
- Swap Request Lifecycle (Pending -> Accepted/Rejected -> Completed).
- Time Credit Management (Reservation on acceptance, Transfer on completion).
- Notification system for swap updates.
- User rating and review system.

### Out of Scope
- Real-time video conferencing (external links used).
- Complex AI recommendations.
- Monetary transactions.

---

## Key Features

- **Clean Architecture**: Controller-Service-Repository pattern for modularity.
- **OOP Domain Model**: Rich entities with encapsulated business logic.
- **Credit Safety**: Automatic credit reservation to prevent double-spending during active swaps.
- **Premium UI**: Modern, glassmorphic design with dark mode support.

---

## Tech Stack

### Backend
- **TypeScript / Node.js / Express.js**
- **Prisma ORM** with SQLite
- **OOP Principles** (BaseEntity, Specific Entities)
- **Clean Architecture**

### Frontend
- **React / Next.js / TypeScript**
- **Vanilla CSS** with modern UI patterns (Glassmorphism, HSL colors).

---

## Design Focus

The project demonstrates a high-quality backend focus (75%) with robust business logic, while maintaining a polished and functional frontend (25%).
- **Separation of Concerns**: Each layer (Route, Controller, Service, Repository) has a single responsibility.
- **State Management**: Well-defined state transitions for swap requests.
- **Scalability**: Decoupled components through dependency injection patterns.