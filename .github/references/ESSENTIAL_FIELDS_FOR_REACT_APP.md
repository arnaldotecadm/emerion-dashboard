Source: emerion-load-service/.github/database-metadata/ESSENTIAL_FIELDS_FOR_REACT_APP.md

Compact extract (minimum fields to enable dashboard):
- PEDRES (order header) essential fields: CODPED, CODCLI, DTOPED, DTEENT, TOTRES, FLGEXC
- PEDRE2 (order lines) essential fields: CODPED, SEQITEM, CODPRO, QUANTIDADE, PRECOS, TOTITEM, FLGEXC
- FATPED (invoices): CODPED, DTAFAT, TOTFAT, FLGEXC

Recommendation: migrate Phase1 (PEDRES + PEDRE2) first — enables most KPIs (total sales, avg ticket, top customers).