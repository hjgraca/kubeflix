from flask import Flask
import requests
import json
import random
import os
import time

MOVIE_API_URL = os.getenv('MOVIE_API_URL') or f'http://localhost:8080'

api = Flask(__name__)


@api.route('/recommendations', methods=['GET'])
def get_recommendations():
    url = f'{MOVIE_API_URL}/movies'
    print(f'Calling: {url}', flush=True)
    response = requests.get(url).json()
    return json.dumps(random.sample(response, 5))


@api.route('/healthz')
def healthz():
    return "OK"


@api.route('/healthx')
def healthx():
    time.sleep(1)
    return "OK"


if __name__ == '__main__':
    api.run()
