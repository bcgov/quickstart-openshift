# Python FastAPI Backend
### Features
- [x] FastAPI
- [x] SQLAlchemy
- [x] Poetry
- [x] Prospector
- [x] Flyway
- [x] Docker
- [x] Docker Compose
- [x] GitHub Actions

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Local Development
- Run the `docker-compose -f .\docker-compose.py.yml up` command to start the entire stack.
- The database changes are applied automatically by flyway
- The models are generated into `backend-python/src/v1/models/model.py` .
- Devs are encouraged to see the `backend-python/src/v1/models/model.py` file and update the models in entities.py. The reason of manual process behind is the sqlacodegen is still lacking support for  SQLAlchemy 2.x.
- The API is Documentation available at http://localhost:3003/docs

### Unit Testing
- Run `docker-compose up -d backend-py-test` command to run the unit tests from the root directory.
- The folder is volume mounted , so any changes to the code will be reflected in the container and run the unit tests again.

