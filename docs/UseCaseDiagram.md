# Use Case Diagram - SkillBarter

The Use Case Diagram illustrates the interactions between users and the SkillBarter system.

```mermaid
useCaseDiagram
    actor User
    actor "Other User" as Other
    actor Admin

    package "SkillBarter System" {
        usecase "Register & Login" as UC1
        usecase "Manage Profile" as UC2
        usecase "Manage Skills (CRUD)" as UC3
        usecase "Browse/Search Marketplace" as UC4
        usecase "Send Swap Request" as UC5
        usecase "Manage Swap Requests (Accept/Reject)" as UC6
        usecase "Complete Swap Session" as UC7
        usecase "Give Review & Rating" as UC8
        usecase "View Notifications" as UC9
        usecase "Check Credit Balance" as UC10
        usecase "Moderate Content" as UC11
    }

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10

    Other --> UC6
    Other --> UC7
    Other --> UC8

    Admin --> UC11

    UC5 ..> UC10 : <<include>> (Check Balance)
    UC6 ..> UC10 : <<include>> (Reserve Credits)
    UC7 ..> UC10 : <<include>> (Transfer Credits)
    UC8 ..> UC7 : <<extend>> (Review after Completion)
```

## Actor Descriptions
- **User**: A regular person looking to swap skills.
- **Other User**: The recipient of a swap request.
- **Admin**: Responsible for platform maintenance and moderation.

## Key Relationships
- **<<include>>**: Sending a request requires checking the credit balance first.
- **<<extend>>**: Giving a review is an optional action after a swap is completed.
