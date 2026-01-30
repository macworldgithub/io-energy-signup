# iO Energy Front‑End

React + Vite powered signup portal for **iO Energy**.

---

## Table of contents

- [iO Energy Front‑End](#ioenergy-frontend)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Tech Stack](#techstack)
  - [Architecture](#architecture)
    - [Routing](#routing)
  - [Environments \& Deployment](#environments--deployment)
  - [Getting Started](#gettingstarted)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Building for production](#building-for-production)
  - [Available NPM Scripts](#available-npmscripts)
  - [Branch Strategy](#branch-strategy)
  - [License](#license)

---

## Overview

This repository contains the React front‑end for the iO Energy signup experience. The app is built with **Vite** for easy local development, **Material UI (MUI)** for component styling, and is automatically deployed via **AWS Amplify** to three separate environments. The current build focuses solely on capturing WebsiteSignupIn payloads for the backend.

---

## Features

- **React 18 + Vite**: modern, fast tool‑chain with HMR.
- **Address autocomplete + MSATS NMI lookup** to pre‑fill connection details.
- **Plan selection** driven by the `/plans/signup` API.
- **WebsiteSignupIn payload** mapping, including contacts, life support, concessions and payment.
- **Consent capture** for contract terms and direct debit.
- **AWS Amplify Hosting** with CI builds triggered on branch pushes.

---

## Tech Stack

| Layer                | Choice                                   |
| -------------------- | ---------------------------------------- |
| Language             | [React 18](https://react.dev/) + JSX     |
| Build Tool           | [Vite](https://vitejs.dev/)              |
| UI Framework         | [Material UI](https://mui.com/)          |
| State / Context      | React Context API                        |
| Date/Time            | Luxon + MUI X Adapter                    |
| Routing              | `react‑router‑dom` v6                    |
| Hosting & CI/CD      | AWS Amplify (connected to Git repo)      |
| Auth / APIs (opt‑in) | AWS Amplify / Cognito (`aws‑exports.js`) |

---

## Architecture

```
.
├── public/          # Static assets served as‑is
├── src/
│   ├── pages/       # Top‑level pages (signup + thank-you)
│   ├── components/  # Re‑usable UI pieces (feature‑scoped sub‑folders)
│   ├── themes/      # Base, light & dark design tokens
│   ├── util/        # Helper functions & validators
│   └── main.jsx     # Vite entry point
└── vite.config.js   # Vite configuration
```

### Routing

Routes are defined explicitly in `src/App.jsx`:

| File              | Route        | Purpose              |
| ----------------- | ------------ | -------------------- |
| `pages/index.jsx` | `/`          | Signup flow          |
| `pages/thank-you` | `/thank-you` | Post‑submission page |

---

## Environments & Deployment

| Git Branch | Amplify App URL                                                                                | Purpose          |
| ---------- | ---------------------------------------------------------------------------------------------- | ---------------- |
| `main`     | [https://www.ioenergy.com.au/](https://www.ioenergy.com.au/)                                   | Production       |
| `staging`  | [https://staging.d25c72ccnpo5m6.amplifyapp.com](https://staging.d25c72ccnpo5m6.amplifyapp.com) | UAT / QA         |
| `dev`      | [https://develop.d25c72ccnpo5m6.amplifyapp.com](https://develop.d25c72ccnpo5m6.amplifyapp.com) | Internal testing |

- **Branch protection:** _currently disabled_ – **pushes to `main` immediately deploy to production**.
- **Auto‑builds:** Amplify watches the repository and triggers a full build + deploy on every push.
- **Amplify console** keeps build logs and previous deployments for quick rollbacks.

---

## Getting Started

### Prerequisites

- **Node ≥ 18 LTS**
- **npm ≥ 9** (comes with Node) or **pnpm / yarn** if preferred.

### Installation

```bash
# 1. Clone the repo
$ git clone git@github.com:io‑energy/frontend.git
$ cd frontend

# 2. Install dependencies
$ npm install

# 3. Run the dev server
$ npm run dev     # ➜ http://localhost:5173
```

The dev server features hot‑module replacement for rapid iteration.

### Building for production

```bash
$ npm run build   # outputs static assets to dist/
$ npm run preview # locally serve the production build
```

---

## Available NPM Scripts

| Script    | Description                               |
| --------- | ----------------------------------------- |
| `dev`     | Start Vite dev server + HMR               |
| `build`   | Create an optimised production bundle     |
| `preview` | Preview the build locally                 |
| `lint`    | Run ESLint (if configured)                |
| `format`  | Format code with Prettier (if configured) |

---

## Branch Strategy

While the current setup allows direct commits to all branches, the recommended flow is:

1. **Create a feature branch** off `dev`.
2. **Merge to `dev`** once happy with changes – Amplify pushes to the dev environment.
3. **Promote to `staging`** for final UAT.
4. **Fast‑forward merge to `main`** for production release.

This keeps the production website stable and audited.

---

Need help? Reach out to **eric@ioenergy.com.au**

---

## License

© 2025 iO Energy. All rights reserved.
Proprietary code — redistribution not permitted without prior written consent.
