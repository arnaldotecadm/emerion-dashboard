Source: emerion-load-service/.github/database-metadata/FINCLI_CUSTOMER_TABLE.md

Compact extract (customer identity & important fields):
- Legacy PK: CODCLI → maps to customerExternalId/externalId in API
- Tax id: CGCCLI → maps to cpfCnpj
- Trade name: APECLI / Nome: NOMCLI → nomeFantasia / razaoSocial
- Block flag: FLBCLI (`'*'` = blocked) → map to API boolean `bloqueado` (normalize)
- Addresses: *F*/ *C*/ *A*/ *E* suffix patterns (billing/collection/purchase/delivery)

Reference file: C:\storage\workspace\kotlin\emerion-load-service\.github\database-metadata\FINCLI_CUSTOMER_TABLE.md
