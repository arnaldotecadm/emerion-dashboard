# Customer (compact domain summary)

Identity
- Legacy identifier: codCli
- Frontend/API name: externalId
- Postgres internal id: id

Important fields
- nomeFantasia, razaoSocial, cpfCnpj, bloqueado, limiteCredito, vendedorExternalId

Business notes
- bloqueado means the customer is blocked in ERP; do not equate with delinquency without evidence.

API
- GET /customers
- GET /customers/{id}
- GET /customers/by-external-id/{externalId}

Legacy reference: emerion-load-service/.github database-metadata files.