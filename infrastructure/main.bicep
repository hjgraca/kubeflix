param resourceGroupName string = 'my-demo-rg'

@description('Specifies the Azure location/region where aks will be created')
param location string = 'westeurope'

targetScope = 'subscription'

var tags = {
  environment: 'production'
  projectCode: 'xyz'
}

var subnetId = vn.outputs.subnetId

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

module identity 'identity.bicep' = {
  name: 'identity'
  scope: rg
}

module kv 'keyvault.bicep' = {
  name: 'kv'
  scope: rg
  params: {
    subnetId: subnetId
    kvIdentityObjectId: identity.outputs.kvIdentityObjectId
  }
}

module aks 'aks.bicep' = {
  name: 'aks'
  scope: rg
  params: {
    tags: tags
    subnetId: subnetId
    kvUAMIResourceId: identity.outputs.kvIdentityResourceId
    kvUAMIClientId: identity.outputs.kvIdentityClientId
    kvUAMIObjectId: identity.outputs.kvIdentityObjectId
    aksUAMIResourceId: identity.outputs.aksIdentityResourceId
  }
}

output id string = aks.outputs.id
output apiServerAddress string = aks.outputs.apiServerAddress
