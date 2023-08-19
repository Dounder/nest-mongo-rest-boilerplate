<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS + MongoDB Boilerplate: Authentication & Authorization

🚀 A robust boilerplate for building scalable applications using **NestJS**, **MongoDB**, **Passport**, and **JWT**.

## Features

- **NestJS Core**: A progressive Node.js framework for building efficient server-side applications.
- **MongoDB Integration**: Seamless support for one of the most flexible and popular NoSQL databases.

- **Passport Authentication**: Streamlined authentication strategies using Passport, with support for various OAuth providers and local strategy.

- **JWT (JSON Web Tokens)**: Implementation of JWT for authentication and authorization.

- **Auth Module**: A pre-configured authentication module for quick user sign-up/sign-in processes.

- **Users Module**: Modules for user management, such as registration and profile management.

### Getting Started

1. **Clone the Repository**: [Repo](https://github.com/Dounder/nest-mongo-rest-boilerplate.git)

   ```bash
   git clone https://github.com/Dounder/nest-mongo-rest-boilerplate.git
   ```

2. **Install dependencies**:

   ```bash
   yarn
   # or
   npm install

   ```

3. **Rename `.template.env` to `.env` and set environment variables to use**
4. **Run only database container**

   ```bash
   docker compose up
   # or detached
   docker compose up -d
   ```

5. **Run api in dev mode**

   ```bash
   yarn start:dev
   # or
   npm run start:dev
   ```

6. **Open browser and navigate to `http://localhost:3000`**

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
