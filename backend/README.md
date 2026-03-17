# ArthaNova Backend API

Production-grade AI-native business news platform backend.

## Structure
- `app/api`: Route handlers for auth, news, and ai.
- `app/core`: Configuration and security utilities.
- `app/db`: Database connection and session management.
- `app/models`: SQLAlchemy data models.
- `app/schemas`: Pydantic validation schemas.
- `app/services`: Business logic and AI integrations.

## Setup
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python run.py
   ```

3. View API docs:
   Navigate to `http://localhost:8000/docs`
