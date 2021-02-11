## How to run in kubernetes

Add the load testing python file to the kubernetes cluster as a configmap.

Go to the /src/load-generator folder and run

```kubectl create configmap loadtest-locustfile --from-file loadtest.py```

By default the load testing will run as headless, if you want to show the locust UI, remove the ```LOCUST_HEADLESS``` environment variable from the leader yaml file. This will prevent the load test from running automatically.

To run the test, port forward the load test leader and go to the UI on the browser.

```kubectl port-forward svc/locust-leader 5557``` 

Open ```http://localhost:5557```


<img src="../../resources/locust.png"></img>


## Run locally

In the root folder, change locust-leader service scale to 1 in docker-compose.yaml file and run ```docker-compose up```, for UI version remove ````--headless```` command parameter