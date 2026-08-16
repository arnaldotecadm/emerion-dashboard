# GET /api/v1/customer-orders — Detailed field mapping

Envelope: standard Page-style:
{
  "content": Order[],
  "totalElements": number,
  "totalPages": number,
  "number": number,
  "size": number
}

Order (Order DTO) — key fields:
- id: number (internal PK)
- externalId: string (legacy NUMRES / CODPED)
- codCli / customerExternalId: number|string (legacy CODCLI)
- nomeCliente: string (denormalized from FINCLI)
- dataOrdem: string (ISO timestamp) — DTOPED/ DTERES
- dataEntrega: string | null (ISO timestamp) — DTEENT/DTFRES
- valorTotal: number (TOTRES/TOTPED)
- status: string — computed (e.g., "Faturado", "Pendente", "Cancelado"); authoritative mapping in emerion-load-service references
- diasAtrasado: number | null — optional computed field (days overdue from delivery date)
- itens: OrderItem[]

OrderItem (in itens[]):
- sequencia / seqitem: number
- codProduto: string (CODPRO)
- quantidade: number (NUMERIC(15,4))
- precoUnitario: number (PRECOS, numeric)
- valorTotal: number (TOTITEM)

Supported filters:
- page (zero-based), size
- codCli / customerExternalId
- sitres / status
- cnpjEmpresa (tenant)

Caveats & guidance:
- Use PEDRES.TOTRES as the canonical order total (see COLUMN_NAMING_PATTERNS.md).
- Many status values come from legacy sitres; consult .github_react/references/PEDRES_PEDRE2_ORDER_TABLES.md and emerion-load-service mappings for exact values.
- Prefer backend aggregation for large analytics; avoid scanning many pages client-side.

Reference: .github_react/references/PEDRES_PEDRE2_ORDER_TABLES.md and emerion-load-service/.github database-metadata.