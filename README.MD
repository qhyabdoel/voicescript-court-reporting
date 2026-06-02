## Installation

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v10.22.0 or higher) - Install via npm: `npm install -g pnpm`
- **Docker** and **Docker Compose** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd court-reporting
```

#### 2. Install Dependencies

Install all workspace dependencies using pnpm:

```bash
pnpm install
```

#### 3. Start the Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL container on `localhost:5432` with:

- **Username**: admin
- **Password**: password
- **Database**: court-reporting

#### 4. Setup Database Schema

Generate and push the database schema using Drizzle ORM:

```bash
pnpm db:generate
pnpm db:push
```

#### 5. Seed the Database

To populate the database with initial data:

```bash
pnpm db:seed
```

#### 6. Start Development Servers

You can start the entire project or individual services:

**Start everything:**

```bash
pnpm dev
```

**Or start individually:**

Frontend (Next.js on `http://localhost:3000`):

```bash
pnpm frontend:dev
```

Backend (Fastify on `http://localhost:3001`):

```bash
pnpm backend:dev
```

### Useful Commands

- `pnpm build` - Build all packages
- `pnpm start` - Start production servers
- `pnpm db:seed` - Seed the database with initial data

### Troubleshooting

- If Docker is not running, start it before running `docker-compose up -d`
- If you encounter database connection errors, ensure PostgreSQL is running on port 5432
- Clear node_modules and reinstall with `pnpm install` if you experience dependency issues
