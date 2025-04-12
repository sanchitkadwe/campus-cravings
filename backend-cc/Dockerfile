# Use the official Python image as a base
FROM python:3.13.2-slim

# # Set environment variables for production
# ENV PYTHONUNBUFFERED 1
# ENV DJANGO_SETTINGS_MODULE=myproject.settings.production

# Installing system deps
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files to the container
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose the port on which Django runs
EXPOSE 8000

# Start the application with Gunicorn
CMD ["gunicorn", "canteenapp.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
