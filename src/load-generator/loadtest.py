import random
from locust import HttpUser, TaskSet, task, between

movies = [
    475557,
    299534,
    299536,
    157336,
    106646,
    12445,
    11,
    424694,
    122,
    120]


class MovieTasks(TaskSet):
    @task
    def index(self):
        self.client.get("/")

    @task
    def movie(self):
        movie = random.choice(movies)
        self.client.get(f"/movie/{movie}")


class WebsiteUser(HttpUser):
    wait_time = between(2, 10)
    tasks = [MovieTasks]
