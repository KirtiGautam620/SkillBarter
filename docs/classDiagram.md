# Class Diagram - SkillBarter

The Class Diagram illustrates the domain-driven design and layered architecture.

```mermaid
classDiagram
    %% Base Class
    class BaseEntity {
        +id: string
        +createdAt: Date
        +updatedAt: Date
        +updateTimestamp()
    }

    %% Domain Entities
    class UserEntity {
        +name: string
        +email: string
        +password: string
        +bio: string
        +avatar: string
        +rating: number
        +reviewCount: number
        +addReview(rating, comment)
    }

    class SkillEntity {
        +title: string
        +description: string
        +category: string
        +level: string
        +isActive: boolean
        +userId: string
    }

    class SwapRequestEntity {
        +message: string
        +status: string
        +hoursOffered: number
        +requesterId: string
        +receiverId: string
        +offeredSkillId: string
        +requestedSkillId: string
        +accept()
        +reject()
        +complete()
    }

    class TimeCreditAccountEntity {
        +userId: string
        +balance: number
        +reservedBalance: number
        +totalEarned: number
        +totalSpent: number
        +canAfford(amount)
        +reserve(amount)
        +release(amount)
        +spend(amount)
        +earn(amount)
    }

    class NotificationEntity {
        +userId: string
        +type: string
        +title: string
        +message: string
        +isRead: boolean
        +markAsRead()
    }

    class ReviewEntity {
        +rating: number
        +comment: string
        +reviewerId: string
        +revieweeId: string
        +swapRequestId: string
    }

    %% Relationships
    BaseEntity <|-- UserEntity
    BaseEntity <|-- SkillEntity
    BaseEntity <|-- SwapRequestEntity
    BaseEntity <|-- TimeCreditAccountEntity
    BaseEntity <|-- NotificationEntity
    BaseEntity <|-- ReviewEntity

    UserEntity "1" *-- "many" SkillEntity : owns
    UserEntity "1" o-- "1" TimeCreditAccountEntity : manages
    UserEntity "1" *-- "many" NotificationEntity : receives
    SwapRequestEntity "many" o-- "1" UserEntity : requester/receiver
    SwapRequestEntity "many" o-- "1" SkillEntity : offered/requested
    ReviewEntity "many" o-- "1" SwapRequestEntity : for swap
```

## Description
- **Domain Focus**: Each entity contains business-oriented logic (e.g., `reserveCredits`, `addReview`).
- **Clean Architecture**: Repositories interact with these entities to ensure decoupled data management.
- **Inheritance**: `BaseEntity` provides common metadata fields and update mechanisms.
