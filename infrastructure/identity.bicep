resource aksUAMI 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: 'aks-identity'
  location: resourceGroup().location
}

resource kvUAMI 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: 'keyvault-identity'
  location: resourceGroup().location
}

resource miRole 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid('Key Vault Secret User', 'aks')
  scope: kvUAMI
  properties: {
    principalId: aksUAMI.properties.clientId
    roleDefinitionId: 'f1a07417-d97a-45cb-824c-7a7467783830'
  }
}

output aksIdentityResourceId string = aksUAMI.id
output kvIdentityResourceId string = kvUAMI.id
output kvIdentityClientId string = kvUAMI.properties.clientId
output kvIdentityObjectId string = kvUAMI.properties.principalId
