# Mock MPI Patient Demographic Query (Azure Function)

This is a Node.js Azure Function app.  It contains a function called **mpi-pdq** which returns mock MPI results.

## Deployment 
To deploy the app you can use the Azure Functions cli tools (see below) or the VS Code Extensions

```bash
npm install -g azure-functions-core-tools@3 --unsafe-perm true
az login
func azure functionapp publish <app-name>
```


## Client Certificate for Mutual TLS

### Enabling mTLS in Azure Functions

The function expects a client certificate to be provided, to enabled client Certificates in the function app.

Use the Azure CLI command below or follow [these instructions](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-configure-tls-mutual-auth)

```bash
az functionapp update --set clientCertEnabled=true --name <app-name> --resource-group <group-name>
```

### Creating a client Certificate

> Note: currently the thumbprint, issue and subject are hardcoded, so you'll need to update  `/mpi-pdq/mTLS/index.js` with the correct details for your certificate.

You can use any client certificate you want, but here's a way to quickly generate one if you have openssl installed: 

```bash
# create the Certificate Authority (key + certificate)
openssl req -newkey rsa:4096 -keyform PEM -keyout ca.key -x509 -days 3650 -outform PEM -out ca.cer

# create a client key
openssl genrsa -out client.key 4096

# create a certificate request using the client key
openssl req -new -key client.key -out client.req

# create a client certificate by signing the certifcate request
openssl x509 -req -in client.req -CA ca.cer -CAkey ca.key -set_serial 101 -extensions client -days 365 -outform PEM -out client.cer

# export the client key and certicate into PKCS12 format
openssl pkcs12 -export -inkey client.key -in client.cer -out client.p12
```

For more detailed instructions [see here](https://www.makethenmakeinstall.com/2014/05/ssl-client-authentication-step-by-step/)

### Testing the client certificate

You can send client certificates with [SOAP UI][1] or [Postman][2]

[1]: https://www.soapui.org/docs/functional-testing/sending-https-requests/
[2]: https://learning.postman.com/docs/sending-requests/certificates/

> Note: if you have Zscaler or some other proxy runnning, you might need to turn it off to get client certificates to work

