Source: emerion-load-service/.github/database-metadata/REACT_API_CONTRACTS.md

Compact extract (key points for React):
- Customers list/response envelope uses `content[]` + pagination fields: number, size, totalElements, totalPages.
- Customer object: id, nomeFantasia, razaoSocial, cpfCnpj, inscricaoEstadual, regimeTributario, bloqueado.
- Orders list uses `content[]` with order object: id, codCli, nomeCliente, dataOrdem (DTOPED), dataEntrega (DTEENT), valorTotal (TOTPED/TOTRES), status, diasAtrasado, itens[].
- Several order endpoints are noted as "NEEDED" (order APIs may be mocked in frontend). See original file for TypeScript examples.

Reference (authoritative): C:\storage\workspace\kotlin\emerion-load-service\.github\database-metadata\REACT_API_CONTRACTS.md
