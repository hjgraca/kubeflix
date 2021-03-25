param resourceGroupName string = 'my-demo-rg'

@description('Specifies the Azure location/region where aks will be created')
param location string = 'westeurope'

targetScope = 'subscription'

var tags = {
  environment: 'production'
  projectCode: 'xyz'
}

resource rg 'Microsoft.Resources/resourceGroups@2020-06-01' = {
  name: resourceGroupName
  location: location
}

module vn 'vnet.bicep' = {
  name: 'vn'
  params: {
    tags: tags
  }
  scope: rg
}

module aks 'aks.bicep' = {
  name: 'aks'
  scope: rg
  params: {
    tags: tags
    subnetId: vn.outputs.subnetId
  }
}

output id string = aks.outputs.id
output apiServerAddress string = aks.outputs.apiServerAddress