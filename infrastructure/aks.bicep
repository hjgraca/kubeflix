// params
@description('The DNS prefix to use with hosted Kubernetes API server FQDN.')
param dnsPrefix string = 'cl01'
@description('The name of the Managed Cluster resource.')
param clusterName string = 'aks101'
@minValue(1)
@maxValue(50)
@description('The number of nodes for the cluster. 1 Node is enough for Dev/Test and minimum 3 nodes, is recommended for Production')
param agentCount int = 1
@description('The size of the Virtual Machine.')
param agentVMSize string = 'Standard_DS3_v2'
param tags object
param subnetId string
param kvUAMIResourceId string
param kvUAMIClientId string
param kvUAMIObjectId string
param aksUAMIResourceId string

// vars
var kubernetesVersion = '1.20.2'
var nodeResourceGroup = 'rg-${dnsPrefix}-${clusterName}'
var agentPoolName = 'agentpool01'

// Azure kubernetes service
resource aks 'Microsoft.ContainerService/managedClusters@2021-02-01' = {
  name: clusterName
  location: resourceGroup().location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${aksUAMIResourceId}': {}
    }
  }
  properties: {
    kubernetesVersion: kubernetesVersion
    enableRBAC: true
    dnsPrefix: dnsPrefix
    agentPoolProfiles: [
      {
        name: agentPoolName
        count: agentCount
        minCount: 1
        maxCount: 5
        maxPods: 100
        mode: 'System'
        vmSize: agentVMSize
        type: 'VirtualMachineScaleSets'
        osType: 'Linux'
        osDiskType: 'Ephemeral'
        enableAutoScaling: true
        availabilityZones: [
          '1'
          '2'
          '3'
        ]
        vnetSubnetID: subnetId
      }
    ]
    servicePrincipalProfile: {
      clientId: 'msi'
    }
    podIdentityProfile: {
      enabled: true
      userAssignedIdentities: [
        {
          name: 'kv-identity'
          namespace: 'default'
          identity: {
            resourceId: kvUAMIResourceId
            clientId: kvUAMIClientId
            objectId: kvUAMIObjectId
          }
        }
      ]
    }
    nodeResourceGroup: nodeResourceGroup
    networkProfile: {
      networkPlugin: 'azure'
      loadBalancerSku: 'standard'
      networkPolicy: 'calico'
    }
  }
}

output id string = aks.id
output apiServerAddress string = aks.properties.fqdn
