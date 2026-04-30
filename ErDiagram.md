# ER Diagram - SkillBarter

The ER Diagram defines the database structure for the SkillBarter system.

```mermaid
erDiagram
    USER ||--o{ SKILL : "offers"
    USER ||--o{ SWAP_REQUEST : "requester"
    USER ||--o{ SWAP_REQUEST : "receiver"
    USER ||--o{ REVIEW : "gives"
    USER ||--o{ REVIEW : "receives"
    USER ||--o| TIME_CREDIT_ACCOUNT : "manages"
    USER ||--o{ NOTIFICATION : "receives"

    SKILL ||--o{ SWAP_REQUEST : "offered"
    SKILL ||--o{ SWAP_REQUEST : "requested"

    SWAP_REQUEST ||--o| SESSION : "schedules"
    SWAP_REQUEST ||--o{ REVIEW : "for swap"

    USER {
        string id PK
        string name
        string email
        string password
        string bio
        float rating
        int reviewCount
        datetime createdAt
    }

    SKILL {
        string id PK
        string title
        string description
        string category
        string level
        string userId FK
    }

    SWAP_REQUEST {
        string id PK
        string status
        float hoursOffered
        string requesterId FK
        string receiverId FK
        string offeredSkillId FK
        string requestedSkillId FK
    }

    TIME_CREDIT_ACCOUNT {
        string id PK
        float balance
        float reservedBalance
        float totalEarned
        float totalSpent
        string userId FK
    }

    SESSION {
        string id PK
        datetime scheduledAt
        int duration
        string status
        string swapRequestId FK
    }

    NOTIFICATION {
        string id PK
        string type
        string title
        string message
        boolean isRead
        string userId FK
    }

    REVIEW {
        string id PK
        int rating
        string comment
        string reviewerId FK
        string revieweeId FK
        string swapRequestId FK
    }
```

## Description
- **One-to-One**: Users have a single `TimeCreditAccount`.
- **One-to-Many**: Users can have multiple `Skill` offers, `SwapRequest` logs, and `Notification` items.
- **Many-to-One**: `SwapRequest` links two users and two skills together.