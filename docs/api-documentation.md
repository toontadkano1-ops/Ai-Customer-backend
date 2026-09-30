# CX Intelligence - REST API Documentation

Base URL: `/api`

All protected endpoints require an `Authorization: Bearer <token>` header.
Tenant isolation is enforced via business membership extracted from the authenticated user token.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Register a new customer or team profile.
- **Request Body**:
  ```json
  {
    "email": "agent@example.com",
    "password": "Password123!",
    "full_name": "Sarah Connor",
    "role": "agent", // "admin" | "agent" | "customer"
    "business_name": "Apex Cloud Tech" // required if creating a new business
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "token": "eyJhbG...",
    "user": {
      "id": "uuid",
      "email": "agent@example.com",
      "role": "agent",
      "business_id": "uuid"
    }
  }
  ```

### `POST /api/auth/login`
Authenticate existing user and obtain session token.
- **Request Body**:
  ```json
  {
    "email": "agent@example.com",
    "password": "Password123!"
  }
  ```

### `GET /api/auth/me`
Retrieve currently authenticated profile and organization details.

---

## 2. Customer Endpoints

### `GET /api/customers`
List customers for current business with optional search and pagination.
- **Query Params**: `page=1&limit=20&search=john`
- **Response**: List of customers with conversation summaries and open ticket counts.

### `GET /api/customers/:id`
Get full customer profile including preferences, interactions, and tickets.

### `POST /api/customers`
Create a customer record.

### `PUT /api/customers/:id`
Update customer preferences, notes, or contact info.

---

## 3. Chat & AI Assistant Endpoints

### `POST /api/chat/message`
Process a customer message through the conversational AI pipeline with knowledge-base grounding.
- **Request Body**:
  ```json
  {
    "conversation_id": "uuid-optional",
    "customer_id": "uuid",
    "message": "What is your refund policy regarding cloud subscriptions?"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "conversation_id": "uuid",
    "message": {
      "id": "uuid",
      "sender_type": "assistant",
      "content": "Our refund policy allows full refunds within 30 days of subscription start...",
      "sentiment": "neutral",
      "intent": "refund_request",
      "sources": [
        { "title": "Subscription & Refund Terms", "id": "kb-uuid" }
      ],
      "suggested_actions": ["View Refund Form", "Talk to Billing Agent"],
      "confidence": 0.94
    }
  }
  ```

### `GET /api/chat/conversations`
List all conversations for the business or specific customer.

### `GET /api/chat/conversations/:id`
Fetch complete message history for a conversation.

### `POST /api/chat/escalate`
Escalate an AI conversation into a high-priority support ticket.
- **Request Body**:
  ```json
  {
    "conversation_id": "uuid",
    "reason": "Customer dissatisfied with automated answer"
  }
  ```

---

## 4. Sentiment Analysis Endpoints

### `POST /api/ai/sentiment`
Analyze a raw text snippet or customer message.
- **Request Body**:
  ```json
  { "text": "I have been waiting 4 hours for my deployment and it crashed again!" }
  ```
- **Response `200 OK`**:
  ```json
  {
    "sentiment": "negative",
    "score": 0.89,
    "intent": "technical_issue",
    "keywords": ["waiting", "crashed", "deployment"],
    "escalation_recommended": true
  }
  ```

### `GET /api/ai/analysis/:messageId`
Fetch stored AI analysis record for a given message.

---

## 5. Smart Recommendations

### `GET /api/recommendations/:customerId`
Get personalized product/service recommendations based on customer history and preferences.
- **Response**:
  ```json
  {
    "recommendations": [
      {
        "product_id": "uuid",
        "name": "Enterprise Security Shield",
        "price": 249.00,
        "category": "Security",
        "reason": "Recommended because of your interest in high-availability security protocols"
      }
    ]
  }
  ```

---

## 6. Support Tickets

### `GET /api/tickets`
List tickets with filtering by status, priority, category, or assigned agent.

### `POST /api/tickets`
Create a new support ticket. Automatic AI priority suggestion is computed.

### `GET /api/tickets/:id`
Fetch ticket details, messages, and timeline.

### `PATCH /api/tickets/:id`
Update ticket status, priority, category, or assigned agent.

### `POST /api/tickets/:id/messages`
Add customer reply or agent internal note.
- **Request Body**:
  ```json
  {
    "content": "Investigating server logs now.",
    "is_internal": true
  }
  ```

---

## 7. Knowledge Base

### `GET /api/knowledge`
Fetch published articles or query via keyword search.

### `POST /api/knowledge`
Create new article (Admin & Agent only).

### `PUT /api/knowledge/:id`
Update article content or toggle published state.

### `DELETE /api/knowledge/:id`
Delete an article.

---

## 8. Customer Analytics

### `GET /api/analytics/overview`
Dashboard metrics: total customers, active conversations, open tickets, CSAT, avg response & resolution time. Filter by `range=7d|30d|90d|custom`.

### `GET /api/analytics/sentiment`
Sentiment distribution breakdown (positive, neutral, negative) and sentiment trend over time.

### `GET /api/analytics/engagement`
Interaction volume by channel/hour, active customers count, chatbot deflection rate.

### `GET /api/analytics/support`
Ticket categories breakdown, resolution times by priority, agent workload stats.
