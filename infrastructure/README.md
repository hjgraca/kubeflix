## Deploy infrastructure to Azure

### Bicep (https://github.com/Azure/bicep)

Azure cli > 2.20 required

Run ```az deployment sub create -f .\main.bicep -l westeurope -c```

Remove ```-c``` if you don't want the what-if mode