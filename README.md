# Bookmark Oasis

## 🎉 Features

- 🚀 [Next.js 15 (App router)](https://nextjs.org/) - Meta Framework for React
- ⚛️ [React 19](https://react.dev/) - A library for web and native user interfaces
- 📘 [Typescript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- 🎨 [TailwindCSS](https://tailwindcss.com/) - Class sorting, merging and linting
- 🛠️ [shadcn/ui](https://ui.shadcn.com/) - Customizable UI components
- 🔒 [Auth.js](https://authjs.dev/) - Authentication library (Google provider)
- 🛡️ [Prisma](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM
- 🔍 [Zod](https://zod.dev/) - Schema validation library
- 🧪 [Vitest](https://vitest.dev/) - Vite powered API and component test framework
- 💅 [Prettier](https://prettier.io/) - Code formatter
- 🧹 [Eslint](https://eslint.org/) - Code linting tool
- 🔹 [Lucide](https://lucide.dev/icons/) - Icons
- 🌑 [Next-Themes](https://github.com/pacocoursey/next-themes) - Dark Mode
- ⚙️ [T3 Env](https://env.t3.gg/) - Manage your environment variables
- 🪵 [Winston](https://github.com/winstonjs/winston) - Better development logging

## 🎯 Getting started

### 1. Clone this template

```bash
git clone https://github.com/Zac-Zajdel/bookmark-oasis.git
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

Create `.env` file and set env variables from `.env.example` file.

### 4. Run the dev server

Start the server using this command:

```bash
yarn dev
```

and open http://localhost:3000/ to see the landing page.

## 📁 Project structure

```bash
.
├── .github                         # GitHub folder
├── .next                           # Auto-generated build files from Next.js
├── app                             # Next JS App (App Router)
├── components                      # React components
├── hooks                           # Custom hooks
├── lib                             # Validation, functions, and utilities
├── prisma                          # Prisma schema and migrations
├── public                          # Public assets folder
├── styles                          # Styles folder
├── tests                           # Vitest API calls
├── types                           # Type definitions
├── app.log                         # Winston Log file
├── logger.ts                       # Winston Log Generation config
├── auth.ts                         # Auth.js configuration
├── components.json                 # shadcn/ui configuration
├── tailwind.config.ts              # Tailwind configuration
├── env.ts                          # T3-env build time ENV check
├── middleware.ts                   # Middleware for Next.js routes
```

## 💡 Analyzing Bundle Size

```bash
ANALYZE=true yarn build
```

## 🤝 Contribution

To contribute, please follow these steps:

1. Clone the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push your changes to a PR.
5. Create a pull request.

## ❤️ Support

If you like this project, feel free to leave a star. 🌟😊

Made by <a href="https://github.com/Zac-Zajdel">Zac Zajdel</a>
