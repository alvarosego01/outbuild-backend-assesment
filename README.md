# Outbuild Backend Assessment Project

This project was developed by Álvaro Segovia.

- **LinkedIn**: [LinkedIn Profile](https://www.linkedin.com/in/alvarosego01/)
- **Email**: alvarosego01@gmail.com

## Prerequisites

To run this project, you will need:

- Docker Desktop installed on your machine.
- Insomnia (or any other similar tool) to test the REST API.
    - Import the endpoints from the `./docs` folder into Insomnia.
- HeidiSQL, TablePlus, or any other database manager to visualize the database.
- A terminal console (Powershell, Linux, or Unix depending on your machine).
- A web browser to view the Swagger documentation at `http://localhost:{PORT}/docs`.

## Getting Started

1. Clone or download the repository.
2. Copy the `.env.template` file and rename it to `.env`.
3. Define the environment variables:

<b>If using PostgreSQL Alpine with Docker, define the following variables:</b>
```bash
# Configuration for PostgreSQL Alpine with Docker

DB_PASSWORD=y7nZdtb5IrnYxlM   # Can be any alphanumeric string
DB_NAME=outbuild_backend       # Can be any name
DB_HOST=localhost              # Default is localhost or 127.0.0.1
DB_PORT=5432                   # Can be any valid port number
DB_USERNAME=postgres           # Can be any valid username

# General configuration

PORT=3050                      # Can be any valid port number
JWT_SECRET=x4pmrepX03IEh|jvhr6bE$T/=d1gYp  # Can be any string of characters
NODE_ENV=development            # Can be one of the following:
                                 # development: For development with Docker
                                 # production: For production use with Docker
                                 # test: To run unit tests with Docker

```
<b>If using Neon Tech, use the following credentials (don't worry, they will be removed later 😉):</b>
```bash
# Configuration for Neon Tech

DB_PASSWORD=2UVH6qKrzcQP       # Test credentials
DB_NAME=outbuild_backend        # Test database name
DB_HOST=ep-bold-star-a5jh7tv8.us-east-2.aws.neon.tech  # Test host for Neon Tech
DB_PORT=5432                    # Database port
DB_USERNAME=outbuild_backend_owner  # Test database username

# General configuration

PORT=3050                      # Can be any valid port number
JWT_SECRET=x4pmrepX03IEh|jvhr6bE$T/=d1gYp  # Can be any string of characters
NODE_ENV=development            # Can be one of the following:
                                 # development: For development with Docker
                                 # production: For production use with Docker
                                 # test: To run unit tests with Docker

```
4. Start the project using Docker. You have two options:

- **If using PostgreSQL Alpine with Docker**, run:

```bash
docker compose up --build
```

- **If using Neon Tech**, run:

```bash
docker compose -f docker-compose-neon.yml up --build
```

- Depending on the defined `NODE_ENV`, the project will start in dev, test, or production mode.
- Once started, the Swagger documentation is available at `http://localhost:{PORT}/docs`.
- That's it! Happy coding 😎

## General Project Explanation

- The project uses **Express.js** with **TypeScript** and **Nodemon** to detect changes.
- **MikroORM** is used as the ORM for database management.
- **pnpm** is used for package management due to its speed and caching capabilities.
- The folder structure, since this is a short and simple project, is organized as follows inside `./src/`:
    - `./__tests__`: Contains all the test files. Each route and its controllers are tested.
    - `./controllers`: Contains all the controllers representing business logic, written in classes (`activities.controller.ts`, `auth.controller.ts`, `schedule.controller.ts`, `user.controller.ts`).
    - `./core`: Contains subfolders with functions, middlewares, interfaces, and tools for the system:
        - `./config`: Contains the general configuration for Swagger, environment variables, and Passport.js for security.
        - `./interceptors`: Contains an `ExceptionsHandler` class to manage and format error responses of type `_Response_I`, ensuring a consistent error structure.
        - `./interfaces`: Contains global interface declarations, such as `_Response_I`, commonly used for client responses.
        - `./middlewares`: Contains middlewares used in routes to handle security, pagination, DTO validation, etc. (`auth.middleware.ts`, `ownership.middleware.ts`, `paginator.middleware.ts`, `validate-dto.middleware.ts`).
        - `./utils`: Contains useful utilities like the `LoggerService` class using **Winston** to emit logs and display a route table in the console.
    - `./dto`: Contains all the validation DTOs used in the system (`Activities.dto.ts`, `Auth.dto.ts`, `Schedules.dto.ts`).
    - `./entities`: Contains all the entity declarations using MikroORM (`activity.entity.ts`, `schedule.entity.ts`, `user.entity.ts`).
    - `./orm_database`: Contains an `OrmContext` class to handle database calls within controllers and initialize MikroORM. It also contains database migration files.
    - `./routes`: Contains all the main routes, separated individually for each case. They are declared in `index.ts` (`activities.routes.ts`, `auth.routes.ts`, `schedule.routes.ts`, `user.routes.ts`). Additionally, `index.ts` has a method to display a console table with all detected endpoints.
    - `./services`: Contains an `AuthService` class to handle token generation and verification.
    - `./index.ts`: Calls `server.ts` to start the system.
    - `./server.ts`: Contains the server configuration, which is also used for running unit tests by reusing the code.

## Technology Justification

- **Express.js** was used with **TypeScript** for scalable and secure development. Interfaces and DTO validation were used, as well as **MikroORM** with decorators, to make the project scalable and secure.
- The project was inspired by the **NestJS** architecture due to its robustness and workflow. TypeScript interfaces ensure that data types are always correct, DTOs easily validate route inputs, and they also create a layer that prevents exposing crucial database entities. **MikroORM** simplifies database management, queries, and entity declaration using its decorators.
- The entities are related as follows:
  - A user can have many schedules, but a schedule can only have one user.
  - A schedule can have many activities, but an activity can only belong to one schedule.
- The project logs using **Winston** according to workflow and logs errors. It stores all caught errors and any non-error logs emitted by `LoggerService`, organized by day.
- **Joi** and **dotenv** were used to ensure reliable environment variable handling.
- Unit tests were written using **Jest** and **Supertest**. These technologies are well-known and easy to use. Around 60 tests were conducted covering critical routes (`./routes`) and controllers (`./controllers`). As the system grows, more tests will be added.
- The project is fully dockerized, making it portable and easy to run on any machine for further development.
- Swagger documentation is available at `http://localhost:{PORT}/docs`, and the endpoints for Insomnia can be found in the `./docs` folder.

## Security

- JWT authentication is used to validate the **Authorization Bearer Token** for accessing restricted endpoints.
- Additionally, in some endpoints, a `/:user_id` param is included, and the `verifyOwnership` middleware ensures that the ID belongs to the currently logged-in user.

## Performance and Large Data Management

- A basic paginator is established and can be expanded for other endpoints as needed. **MikroORM** is instrumental in handling large amounts of data and supports transactions. The system is capable of managing large datasets and is scalable.

## Scalability

- The use of DTOs, MikroORM, TypeScript interfaces, and services provides flexibility for scaling as the system grows. These resources are globally available throughout the system.
- **MikroORM** was chosen for its simple working scheme and transactional capacity. Its handling of entities and features provides a lot of flexibility.
- **pnpm** was selected over other package managers due to its caching ability when managing dependencies, as well as its impressive speed.

## Recommendations

- As the project grows, it may be necessary to switch to a modular file organization.
- To improve performance, **SWC** compilation can be enabled.
- The project can easily implement **sockets** for managing schedules, allowing real-time interaction between users.
