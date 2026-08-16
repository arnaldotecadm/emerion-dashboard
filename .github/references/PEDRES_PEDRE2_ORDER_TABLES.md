Source: emerion-load-service/.github/database-metadata/PEDRES_PEDRE2_ORDER_TABLES.md

Compact extract (order header & item essentials):
- Header identity: NUMRES / CODPED as external order id.
- Key fields: NUMRES (externalId), DTERES/DTOPED (order date), DTFRES/DTEENT (delivery date), TOTRES (order total), FLGEXC (active flag), CODCLI (customer FK), CODVEN (seller FK), SITRES (status).
- Item fields (PEDRE2): SEQITEM, CODPRO, QUANTIDADE, PRECOS, TOTITEM, FLGEXC.
- Status & workflow: many FLG*/DTE* pairs record workflow; use FATPED join to determine 'Faturado' (invoiced).

Query template and recommendations included in source.