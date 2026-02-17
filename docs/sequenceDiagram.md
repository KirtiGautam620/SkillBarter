# Sequence Diagrams

This document describes the sequence diagrams for the SkillBarter – Skill Swap Marketplace backend.

The diagrams illustrate how different domain objects and services interact to complete the main workflows of the system.
They are derived directly from the UML class diagram and reflect the actual business logic.

---

![UML Sequence Diagram](images/UML-Sequencediagram.png)

---

## 1️⃣ Create Swap Request

**Overview**

This sequence shows how a user creates a swap request to exchange a skill with another user.

**Flow**

1. The requester initiates `createSwapRequest()` on SwapService.
2. The service fetches:
   - offered skill
   - requested skill
3. The requester's TimeCreditAccount is validated.
4. A new SwapRequest is created with PENDING status.
5. NotificationService notifies the receiver.

**Diagram**

```mermaid
sequenceDiagram
    participant U as User (Requester)
    participant SS as SwapService
    participant SK as Skill
    participant TCA as TimeCreditAccount
    participant SR as SwapRequest
    participant NS as NotificationService
    participant U2 as User (Receiver)

    U->>SS: createSwapRequest(offeredSkillId, requestedSkillId)
    
    SS->>SK: fetch(offeredSkillId)
    SK-->>SS: OfferedSkill
    
    SS->>SK: fetch(requestedSkillId)
    SK-->>SS: RequestedSkill
    
    SS->>TCA: validateAccount(requesterId)
    TCA-->>SS: AccountValid
    
    SS->>SR: create(requester, receiver, offeredSkill, requestedSkill, PENDING)
    SR-->>SS: SwapRequest created
    
    SS->>NS: notify(receiver, "New Swap Request")
    NS-->>U2: Notification sent
    
    SS-->>U: SwapRequest created successfully
```

---

## 2️⃣ Accept Swap Request

**Overview**

This sequence shows how the receiver accepts a swap request.

**Flow**

1. The receiver calls `acceptSwap()` on SwapService.
2. The SwapRequest status is updated to ACCEPTED.
3. Time credits are reserved from the requester.
4. A notification is sent to the requester.

**Diagram**

```mermaid
sequenceDiagram
    participant U as User (Receiver)
    participant SS as SwapService
    participant SR as SwapRequest
    participant TCA as TimeCreditAccount
    participant NS as NotificationService
    participant U2 as User (Requester)

    U->>SS: acceptSwap(swapRequestId)
    
    SS->>SR: findById(swapRequestId)
    SR-->>SS: SwapRequest
    
    SS->>SR: updateStatus(ACCEPTED)
    SR-->>SS: StatusUpdated
    
    SS->>TCA: reserveCredits(requesterId, amount)
    TCA-->>SS: CreditsReserved
    
    SS->>NS: notify(requester, "Swap Accepted")
    NS-->>U2: Notification sent
    
    SS-->>U: Swap accepted successfully
```

---

## 3️⃣ Complete Swap & Add Review

**Overview**

This sequence represents the completion of a swap session and the exchange of time credits and reviews.

**Flow**

1. A user calls `completeSwap()` on SwapService.
2. The SwapRequest status becomes COMPLETED.
3. Time credits are transferred between both users.
4. Two Review objects are created:
   - requester → receiver
   - receiver → requester
5. Notifications are sent to both users.

**Diagram**

```mermaid
sequenceDiagram
    participant U as User (Requester/Receiver)
    participant SS as SwapService
    participant SR as SwapRequest
    participant TCA as TimeCreditAccount
    participant R as Review
    participant NS as NotificationService
    participant U2 as User (Receiver/Requester)

    U->>SS: completeSwap(swapRequestId)
    
    SS->>SR: findById(swapRequestId)
    SR-->>SS: SwapRequest
    
    SS->>SR: updateStatus(COMPLETED)
    SR-->>SS: StatusUpdated
    
    SS->>TCA: transferCredits(requesterId, receiverId, amount)
    TCA-->>SS: CreditsTransferred
    
    SS->>R: create(requesterId, receiverId, rating, comment)
    R-->>SS: Review created (requester->receiver)
    
    SS->>R: create(receiverId, requesterId, rating, comment)
    R-->>SS: Review created (receiver->requester)
    
    SS->>NS: notify(requester, "Swap Completed")
    NS-->>U: Notification sent
    
    SS->>NS: notify(receiver, "Swap Completed")
    NS-->>U2: Notification sent
    
    SS-->>U: Swap completed successfully
```

---

## Summary

| Workflow | Trigger | Key Actions | Result |
|----------|---------|-------------|--------|
| Create Swap Request | User initiates swap | Validate account, create request, notify receiver | PENDING SwapRequest |
| Accept Swap Request | Receiver accepts | Update status, reserve credits, notify requester | ACCEPTED SwapRequest |
| Complete Swap | User completes session | Transfer credits, create reviews, notify both | COMPLETED SwapRequest |

