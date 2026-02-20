<div align="center">

# 🗡️ BLADER Stack

**B**un + e**L**ysia + **A**uth + **D**rizzle + **E**xpo + **R**eact

*A modern, type-safe, full-stack TypeScript monorepo for building scalable web and mobile applications*

[![Bun](https://img.shields.io/badge/Bun-1.0+-black?logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Scripts](#-available-scripts)

</div>

---

## 🎯 What is BLADER?

BLADER is a production-ready, full-stack TypeScript monorepo template combining the best modern tools for building recruitment platforms (or any SaaS application). It provides:

- ⚡ **Blazing Fast** - Powered by Bun, 20x faster than traditional runtimes
- 🔐 **Auth Built-in** - Better Auth with email/password, OAuth ready
- 🗄️ **Type-Safe Database** - Drizzle ORM with PostgreSQL
- 📱 **Mobile Ready** - Expo for iOS & Android
- 🎨 **Beautiful UI** - shadcn/ui components pre-configured
- 🏢 **Monorepo** - Shared code between apps and packages

---

## ✨ Features

### 🏗️ **Architecture**
- Turborepo/Bun workspaces monorepo
- Shared packages for types, database, and UI
- Independent deployment of apps
- Type-safe across the entire stack

### 🚀 **Backend**
- Elysia.js REST API with Bun runtime
- Better Auth for authentication & sessions
- Drizzle ORM with PostgreSQL
- Type-safe API endpoints
- Automatic migration generation

### 💻 **Frontend**
- Next.js 15 for web applications
- Expo for cross-platform mobile
- shadcn/ui component library
- Tailwind CSS v4 for styling
- Dark mode support

### 📦 **Shared Packages**
- `@blader/database` - Drizzle schemas & queries
- `@blader/types` - Shared TypeScript types
- `@blader/ui` - Web component library (shadcn/ui)
- `@blader/ui-native` - Mobile component library

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### Backend
- **Runtime:** [Bun](https://bun.sh)
- **Framework:** [Elysia.js](https://elysiajs.com)
- **Database:** [PostgreSQL](https://postgresql.org)
- **ORM:** [Drizzle](https://orm.drizzle.team)
- **Auth:** [Better Auth](https://better-auth.com)
- **Email:** [Resend](https://resend.com)

</td>
<td width="50%" valign="top">

### Frontend
- **Web Framework:** [Next.js 15](https://nextjs.org)
- **Mobile:** [Expo](https://expo.dev)
- **UI Library:** [React 18](https://react.dev)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Components:** [shadcn/ui](https://ui.shadcn.com)
- **Icons:** [Lucide React](https://lucide.dev)

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- **Bun** >= 1.0.0 ([Install Bun](https://bun.sh))
- **PostgreSQL** >= 14
- **Git**

### Installation

1. **Clone the repository**
```bash
