from fastapi import FastAPI
import requests
import random
import os

MOVIE_API_URL = os.getenv('MOVIE_API_URL') or f'http://localhost:8088'

app = FastAPI()


@app.get('/recommendations')
def get_recommendations():
    url = f'{MOVIE_API_URL}/movies'
    print(f'Calling: {url}', flush=True)
    response = requests.get(url).json()
    return random.sample(response, 5)


@app.get('/healthz')
def healthz():
    return "OK"


@app.get('/healthx')
def healthx():
    return "OK"
