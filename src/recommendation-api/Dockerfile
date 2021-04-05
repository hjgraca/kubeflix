FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-alpine3.10
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
EXPOSE 80
