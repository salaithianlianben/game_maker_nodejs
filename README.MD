# Game Maker ( Testing )

A Node.js-based slot machine game engine built with TypeScript, Express, and Prisma.

## 🚀 Features

- Built with TypeScript for type safety and better developer experience
- RESTful API using Express.js
- Database management with Prisma ORM
- JWT-based authentication
- MySQL database integration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/slot-maker.git
cd slot-maker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following configuration:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
PORT=3000
JWT_SECRET=WDkZ3hqH/zTZSi8qufq7wgzrR7gNX12iEe+YF6bgY+Y=
```

4. Run database migrations:
```bash
npx prisam format
```

```bash
npx prisma migrate dev --create-only
```

Before you run migrations, please generate migration file first and review it

```bash
npx prisma migrate dev
```

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```

## 🗄️ Database Configuration

The project uses Prisma as an ORM with MySQL. Make sure to:
1. Create a MySQL database
2. Update the DATABASE_URL in your `.env` file
3. Run migrations before starting the application

## 🔒 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | MySQL connection string | mysql://username:password@localhost:3306/database_name |
| PORT | Application port | 3000 |
| JWT_SECRET | Secret key for JWT authentication | WDkZ3hqH/zTZSi8qufq7wgzrR7gNX12iEe+YF6bgY+Y= |

## 🛠️ Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [JWT](https://jwt.io/)

## 📝 API Documentation

[Add your API documentation here]

## 📄 License

[Add your license here]

## 👥 Authors

[Add author information here]
