var addressPrefix = '20.0.0.0/16'
var subnetName = 'Subnet01'
var subnetPrefix = '20.0.0.0/24'
var virtualNetworkName = 'MyVNET01'
param tags object

// Azure virtual network
resource vn 'Microsoft.Network/virtualNetworks@2020-06-01' = {
  name: virtualNetworkName
  location: resourceGroup().location
  tags: tags
  properties: {
    addressSpace: {
      addressPrefixes: [
        addressPrefix
      ]
    }
    subnets: [
      {
        name: subnetName
        properties: {
          addressPrefix: subnetPrefix
          serviceEndpoints: [
            {
              service: 'Microsoft.KeyVault'
            }
          ]
        }
      }
    ]
  }
}

output subnetId string = '${vn.id}/subnets/${subnetName}'
