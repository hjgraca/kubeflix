param subnetId string
param kvIdentityObjectId string

resource kv 'Microsoft.KeyVault/vaults@2019-09-01' = {
  name: 'keyvault-aks-1'
  location: resourceGroup().location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: kvIdentityObjectId
        permissions: {
          secrets: [
            'get'
          ]
        }
      }
    ]
    networkAcls: {
      virtualNetworkRules: [
        {
          id: subnetId
        }
      ]
    }
  }
}

// resource role 'Microsoft.Authorization/roleAssignments@2020-03-01-preview' = {
//   name: 'kv-role'
//   properties: {
//     principalId: UAMI.properties.principalId
//     roleDefinitionId: 'acdd72a7-3385-48ef-bd42-f606fba81ae7'
//   }
// }
