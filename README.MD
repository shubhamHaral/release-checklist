# Release Checklist Tool

A single-page release checklist application built with React, GraphQL, Node.js, Express, and PostgreSQL.

## Features

- Create releases
- View all releases
- Delete releases
- Set release name and due date
- Add and edit additional information
- Check/uncheck release steps
- Automatic release status:
  - Planned
  - Ongoing
  - Done
- Responsive UI
- GraphQL API
- PostgreSQL database
- Automated tests
- Docker support

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
- PostgreSQL
- Jest
- Supertest

### Database
PostgreSQL hosted on Neon.

## Project Structure

```text
release-checklist/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   └── graphql/
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── docker-compose.yaml
└── README.md