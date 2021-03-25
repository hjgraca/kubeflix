## Deploy infrastructure to Azure

### Bicep (https://github.com/Azure/bicep)

Run ```bicep build main.bicep```, this command will generate the ARM template
Run ```az deployment sub create -f .\main.json -l westeurope -c```

```-c``` is what-if mode