# Docker Setup Guide for EduFlow

Complete guide to running EduFlow with Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Git (to clone the repository)
- Text editor to configure `.env` file

## Quick Start

1. **Clone and navigate to project**
   ```bash
   cd EduFlow-StudyManager
   ```

2. **Configure environment variables**
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` and configure the database connection:
   ```env
   DATABASE_URL=postgresql://eduflow_user:eduflow_pass@postgres:5432/eduflow_db
   SECRET_KEY=your_secret_key_here
   ```

3. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database**
   ```bash
   docker-compose exec backend python backend/scripts/init_db.py
   ```

5. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Docker Compose Services

The `docker-compose.yml` defines three services:

### 1. PostgreSQL Database (`postgres`)
- **Image**: `postgres:15-alpine`
- **Port**: `5432`
- **Database**: `eduflow_db`
- **User**: `eduflow_user`
- **Password**: `eduflow_pass`
- **Volume**: `postgres_data` (persistent storage)

### 2. FastAPI Backend (`backend`)
- **Build**: `./backend/Dockerfile`
- **Port**: `8000`
- **Dependencies**: Waits for PostgreSQL to be healthy
- **Hot Reload**: Enabled via volume mount
- **Environment**:
  - `DATABASE_URL`: Connects to postgres service
  - `SECRET_KEY`: JWT secret

### 3. React Frontend (`frontend`)
- **Build**: `./frontend/Dockerfile`
- **Port**: `8080`
- **Dependencies**: Waits for backend
- **Hot Reload**: Enabled via volume mount
- **Dev Server**: Vite

## Common Commands

### Starting and Stopping

```bash
# Start all services in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database!)
docker-compose down -v
```

### Viewing Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs postgres
docker-compose logs frontend
```

### Rebuilding

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and restart
docker-compose up -d --build
```

### Accessing Containers

```bash
# Backend shell
docker-compose exec backend bash

# PostgreSQL CLI
docker-compose exec postgres psql -U eduflow_user -d eduflow_db

# Frontend shell
docker-compose exec frontend sh
```

## Database Management

### View Tables

```bash
docker-compose exec postgres psql -U eduflow_user -d eduflow_db -c "\dt"
```

### View Specific Table Data

```bash
# View users
docker-compose exec postgres psql -U eduflow_user -d eduflow_db -c "SELECT * FROM users;"

# View roles
docker-compose exec postgres psql -U eduflow_user -d eduflow_db -c "SELECT * FROM roles;"
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U eduflow_user eduflow_db > backup.sql
```

### Restore Database

```bash
cat backup.sql | docker-compose exec -T postgres psql -U eduflow_user -d eduflow_db
```

## Development Workflow

### Making Backend Changes

1. Edit code in `backend/` directory
2. Changes are automatically reflected (hot reload enabled)
3. Check logs: `docker-compose logs -f backend`

### Making Frontend Changes

1. Edit code in `frontend/` directory
2. Vite dev server automatically reloads
3. Check logs: `docker-compose logs -f frontend`

### Installing New Dependencies

**Backend:**
```bash
# Add to backend/requirements.txt
echo "new-package==1.0.0" >> backend/requirements.txt

# Rebuild backend
docker-compose build backend
docker-compose up -d backend
```

**Frontend:**
```bash
# Access frontend container
docker-compose exec frontend sh

# Inside container
npm install new-package

# Exit container and rebuild
docker-compose build frontend
docker-compose up -d frontend
```

## Troubleshooting

### Port Already in Use

If you see "port is already allocated":

```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # Mac/Linux

# Kill the process or change port in docker-compose.yml
```

### Database Connection Errors

```bash
# Check postgres health
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Backend Won't Start

```bash
# Check logs for errors
docker-compose logs backend

# Ensure database is ready
docker-compose exec postgres pg_isready -U eduflow_user

# Rebuild backend
docker-compose build backend
docker-compose up -d backend
```

### Frontend Build Errors

```bash
# Clear node_modules and rebuild
docker-compose down
docker volume rm eduflow-studymanager_node_modules
docker-compose build frontend
docker-compose up -d
```

## Environment Configuration

### Development (Local PostgreSQL)

```env
DATABASE_URL=postgresql://eduflow_user:eduflow_pass@localhost:5432/eduflow_db
```

### Docker

```env
DATABASE_URL=postgresql://eduflow_user:eduflow_pass@postgres:5432/eduflow_db
```

### Production

```env
DATABASE_URL=postgresql://user:password@production-host:5432/prod_db
SECRET_KEY=use_a_strong_random_key_here
```

## Health Checks

### Check All Services

```bash
docker-compose ps
```

Expected output:
```
Name                   Status           Ports
--------------------------------------------------------------
eduflow_postgres    Up (healthy)     0.0.0.0:5432->5432/tcp
eduflow_backend     Up               0.0.0.0:8000->8000/tcp
eduflow_frontend    Up               0.0.0.0:8080->8080/tcp
```

### Test API

```bash
curl http://localhost:8000/stms/health
```

Expected: `{"status": "healthy", "version": "1.0.0"}`

## Cleaning Up

### Remove All Containers and Images

```bash
docker-compose down
docker system prune -a
```

### Remove Only Project Resources

```bash
docker-compose down -v
docker volume rm eduflow-studymanager_postgres_data
```

## Next Steps

- Import Postman collection from `docs/EduFlow.postman_collection.json`
- Test API endpoints
- Read [API Documentation](API.md)
