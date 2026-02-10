# SkillBarter - A Skill swap Marketplace

## Project Idea

SkillBarter is a fullstack web application that allows users to swap their skills with each other using time as a medium instead of money. The application is allows users to offer skills they are good at and request skills they want to learn,creating peer learning skill exchange ecosystem. 
The system is focused on managing structured workflows such as skill matching,request handling,session scheduling and completion tracking.

---

## Problem Statement

Many students and professionals wants to learn but they not have the financial resources to pay the courses.At the same time they possess skills that could help others.Existing platforms mostly focused on paid learning and don't efficiently support time based skill exchange.
There is a need for a system that enables fair,organised and efficient skill exchange between users without involving money.

---

## Solution

SkillBarter provides centralized platform where users can:
- Create profiles listing skills they offer and skills they want to learn
- Discover users with matching skills
- Send and manage skill swap requests
- Schedule learning sessions
- Track the lifecycle of each skill swap

---

## Scope of the Project

### In Scope
- User registration and authentication
- Skill creation and management
- Skill swap request creation
- Acceptance or rejection of swap requests
- Skill swap lifecycle management
- Session scheduling
- Rating and feedback after completion

<!-- Thinking to implement if times allow -->
<!-- ### Out of Scope (Future Enhancements)
- Payments or monetary transactions
- Video conferencing
- AI-based recommendations
- Real-time chat -->

---

## Key Features

- Role-based user access (User, Admin)
- Time-based skill exchange instead of payments
- Structured swap request lifecycle
- Backend-driven business logic
- Scalable and modular system architecture
---

## Target Users
- College students
- Self-learners
- Peer-to-peer learning communities


## Planned Tech Stack

### Backend
- Language: TypeScript
- Runtime: Node.js
- Framework: Express.js
- Architecture: Controller–Service–Repository pattern
- ORM: Prisma
- Database: MySQL/Mongodb/postgress

### Frontend
- Framework: React.js
- Language: TypeScript
---

## Design Focus

The backend is the primary focus of this project and is designed using:
- Object-Oriented Programming principles
- Clean separation of concerns
- Well-defined workflows and state transitions
- Extensible system design for future enhancements