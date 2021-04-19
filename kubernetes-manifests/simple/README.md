## Setup

* ### Choose your Ingress

  * ### Application Gateway ingress controller

     Install addon in aks [tutorial](https://docs.microsoft.com/en-us/azure/application-gateway/tutorial-ingress-controller-add-on-existing)

     [Ingress file](/kubernetes-manifests/agic/frontend-ingress.yaml)

  * ### Nginx ingress controller
      ```bash
      kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.45.0/deploy/static/provider/cloud/deploy.yaml
      ```
      For more up to date instructions on how to install nginx ingress controller [check the official docs](https://kubernetes.github.io/ingress-nginx/deploy/#azure)

### Apply manifests

```bash
kubectl apply -f . 
```


