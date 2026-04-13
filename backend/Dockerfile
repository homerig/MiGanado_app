FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN pip install django djangorestframework django-cors-headers

# Copy project files
COPY . .

# Run migrations to create database
RUN python manage.py migrate

# Expose port
EXPOSE 8000

# Run server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]