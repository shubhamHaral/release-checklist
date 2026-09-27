# Release Checklist Tool

A simple single-page application for creating and managing software releases.

The idea is straightforward: before releasing a software version, there are several tasks that need to be checked. This application keeps those tasks in one place and shows the current progress of each release.

Users can create a release, set its due date, add additional information, and check off the release tasks. The release status is automatically calculated based on the completed checklist items.

## Features

- Create a new release
- Set release name
- Set release due date and time
- Add optional additional information
- View all releases
- Check and uncheck release checklist items
- See checklist progress
- Automatically calculate release status
- Edit additional release information
- Delete releases
- Responsive UI for desktop and mobile
- GraphQL API
- PostgreSQL database
- Automated backend tests
- Docker support

## Release Status

The status is calculated automatically from the checklist.

- **Planned** - no checklist items are completed
- **Ongoing** - some checklist items are completed
- **Done** - all checklist items are completed

There are 8 fixed checklist items for every release.

## Checklist

Each release contains these steps:

1. Code review completed
2. Tests passing
3. Build generated
4. Database migrations checked
5. Environment variables verified
6. Security checks completed
7. Documentation updated
8. Deployment completed

The checklist is fixed because all releases follow the same release process.

## Tech Stack

### Frontend

- React
- Vite
- Apollo Client
- GraphQL
- CSS

### Backend

- Node.js
- Express
- GraphQL
- express-graphql
- PostgreSQL
- Jest
- Supertest

### Database

- PostgreSQL
- Neon

### Development and Deployment

- Git
- GitHub
- Docker
- Docker Compose

## Project Structure

```text
release-checklist/
│
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js
│   │   │
│   │   ├── graphql/
│   │   │   ├── schema/
│   │   │   │   └── schema.js
│   │   │   │
│   │   │   └── resolvers/
│   │   │       ├── resolvers.js
│   │   │       └── status.js
│   │   │
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── status.test.js
│   │   └── schema.test.js
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yaml
├── README.md
└── .gitignore





