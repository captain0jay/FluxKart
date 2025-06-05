# 🚀 FluxKart

FluxKart is an platform that lets some unidentified  people buy some undisclosed stuff (wink wink ;) for totally not for time travel purposes, this repo is a extension to a small use case of fluxkart for identity resolution, it is a microservice built to unify user profiles based on email and phone numbers. This project tackles the challenge of recognizing users who make purchases with different contact details.

> **Live URL:** 
[https://fluxkart-p95a.onrender.com/api/v1.0/user/identify](https://fluxkart-p95a.onrender.com/api/v1.0/user/identify)

> **Postman Collection:** 
`Contacts.postman_collection.json`

> **Deploy to Render:**
>[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/captain0jay/FluxKart)

---

## 🧠 Problem Context

Dr. Emmett Brown, stuck in 2023, frequently orders machine parts from FluxKart.com using varied emails and phone numbers to avoid suspicion. This creates a challenge for Bitespeed's identity resolution system, which aims to:

* Link multiple contacts belonging to the same user.
* Maintain a clean and unified user profile.
* Enhance personalization and reward programs.

---

## 📦 Features

* 🚀 Deployable on [Render](https://render.com)
* 📦 Dockerized Setup
* 🛠️ Makefile for Build & Installation
* 📜 PostgreSQL Schema Integration
* 🔄 Auto-deployment via GitHub Actions + Render YAML
* 🧪 Postman Collection for API Testing
* 🧩 Clear Flow Design (Excalidraw diagram)
* 🧾 Type Casting & Comprehensive Logging
* 🚫 Robust Error Handling

---

## 📁 Folder Structure

```bash
.github/
  └── workflows/
      └── nodejs-ci.yml        # GitHub Actions CI pipeline

API/
  ├── routes/
  └── v1.0/
      ├── handlers/            # API Logic
      ├── response/            # Structured API Responses
      ├── routes/
      ├── services/            # Business Logic
      └── validators/          # Input Validation

configs/
  └── postgres.ts              # DB Config

Constants/
  └── index.ts

models/
  ├── postgres/
  └── index.ts

Repo/
  ├── Contact.ts               # DB Operations
  └── index.ts

utils/
  ├── exception.ts
  ├── tryCatch.ts              # Error Handling Middleware
  └── validate.ts

Other Files:
- Dockerfile
- Makefile
- schema.sql
- .env.example
- render.yaml
- flow-design.excalidraw
```

---

## 🔧 Setup Instructions

### Prerequisites

* Node.js
* Docker
* PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/captain0jay/FluxKart.git
cd FluxKart
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit your DB credentials in .env
```


### 3. Install manually
```bash
npm install
npm run dev
```

### 4. or Build & Run with Docker

```bash
docker build -t fluxkart .
docker run -p 3000:3000 --env-file .env fluxkart
```

### 5. Or Run with Makefile (Linux and MacOS)

```bash
make install
make start
```

---

## 🔗 API Endpoint

> **URL:** `POST https://fluxkart-p95a.onrender.com/api/v1.0/user/identify`

### 📥 Request Body

```json
{
	"email"?: string,
	"phoneNumber"?: number
}
```

### 📤 Response Structure

```json

	{
		"contact":{
			"primaryContatctId": number,
			"emails": string[], // first element being email of primary contact 
			"phoneNumbers": string[], // first element being phoneNumber of primary contact
			"secondaryContactIds": number[] // Array of all Contact IDs that are "secondary" to the primary contact
		}
	}
```

---

## 🧬 Data Model

```ts
{
  id: Int,
  phoneNumber?: String,
  email?: String,
  linkedId?: Int, // ID of another Contact
  linkPrecedence: "primary" | "secondary",
  createdAt: DateTime,
  updatedAt: DateTime,
  deletedAt?: DateTime
}
```

---


### 🧠 Identity Resolution Logic

The system determines how to link contacts using the following rules:

* **No Match Found:**
  A new contact is created and marked as `primary`.

* **Exact Match Found (Both Email and Phone Number):**
  If an existing record matches **both** email and phone number, the system uses that contact and returns the linked data based on its `primary`/`secondary` relationship.

* **Partial Match Found (Either Email or Phone Number):**
  If **only one** of the fields (email or phone number) matches an existing record:

  * A new contact is created.
  * It is marked as `secondary`.
  * It is linked to the matched `primary` contact.

* **Split Match Found (Email and Phone Exist Separately in Different Records):**
  If the email and phone number both exist, but in **different records**, the system:

  * Fetches all related contacts.
  * Determines the **oldest contact** (based on `createdAt`) to be the `primary`.
  * Marks all other related contacts (including the new one) as `secondary`.
  * Links them to the chosen `primary`.


---

## 🧪 Testing

* Import `Contacts.postman_collection.json` into Postman.
* Hit the `/api/v1.0/user/identify` endpoint with various contact inputs.
* Observe contact linking and resolution in real-time.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍🔧 Author

Made with ⚡ by [captain0jay](https://github.com/captain0jay)

