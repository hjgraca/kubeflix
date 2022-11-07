<p align="center">
<img src="resources/main.png" width="300" alt="KUBEFLIX" />
</p>

## **KUBEFLIX** 
Built to demonstrate a microservices application running on Kubernetes. 
It is composed of 10 microservices written in different languages that talk to each other over http.

**Movie data powered by** <a href="https://www.themoviedb.org/"> <img src="src/frontend/public/tmdb.svg" width="140"></img></a>

## Application architecture

<img src="resources/Architecture.png"></img>

| Service                                              | Language      | Description                                                                                                                       |
| ---------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [Frontend](./src/frontend)                           | Next.js            | Exposes an HTTP server to serve the website.|
| [Movies Api](./src/movies-api)                     | C#            | Provides a list of movies.                                                           |                           |
| [Basket Api](./src/basket-api) | Go        | Saves basket in Redis.
| [Recommendation Api](./src/recommendation-api) | Python        | Recommends other movies 
| [Advertisement Api](./src/ad-api) | Go        | Api to display advertisement on the frontend 
| [Checkout Api](./src/checkout-api) | C#        | 1 click-checkout api. Grabs basket from Redis and puts orders message in a queue
| [Order Processor](./src/order-processor) | Go        | Processes orders. Stores orders in database and emits order processed event 
| [Notification Service](./src/notification-service) | Go        | Listens to Order processed and Shipped events and sends notifications
| [Shipping Service](./src/shipping-service) | C#        | Listens to order processed events, updates database and emits shipped events 
| [Load Testing](./src/load-generator) | Python        | [Locust](https://github.com/locustio/locust) load testing                         

## Platform architecture
<img src="resources/platform.png"></img>

## Workshop and Tutorials
Workshop and tutorials available [here](https://hjgraca.github.io/kubeflix/docs/) (TODO)

## Running the application

### Locally with docker-compose
On the root folder of the project you will find the [docker-compose.yaml](./docker-compose.yaml) file. 

To optionally build from source (you will need a newish version of Docker to do this) use Docker Compose. Optionally edit the `.env` file to specify an alternative image registry and version tag; see the official [documentation](https://docs.docker.com/compose/env-file/) for more information.

```shell
$ docker-compose build
```

If you modified the `.env` file and changed the image registry, you need to push the images to that registry

```shell
$ docker-compose push
```

### Kubernetes
To run the simple example on the [kubernetes-manifests/simple](./src/kubernetes-manifests/simple) folder.

On the root folder of the project run ```kubectl apply -f /src/kubernetes-manifests/simple```. Or on the [kubernetes-manifests/simple](./src/kubernetes-manifests/simple) folder run ```kubectl apply -f .```
