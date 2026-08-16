Source: emerion-load-service/.github/database-metadata/COLUMN_NAMING_PATTERNS.md

Compact extract (naming patterns to decode columns):
- tot* = totals/amounts (TOTRES, TOTITEM, TOTFAT). Use TOTRES for order total in dashboard (not TOTGER).
- cod* = identifiers/foreign keys (CODPED, CODCLI, CODPRO).
- dt*/dte* = date/timestamp (DTOPED, DTEENT, DTAFAT).
- seq* = sequence (SEQITEM).
- flg* = boolean flags (FLGEXC = active filter).
- preco/val/qte prefixes indicate monetary/quantity fields with numeric precision.

Quick Phase-1 lookup: PEDRES: CODPED,CODCLI,DTOPED,DTEENT,TOTRES,FLGEXC; PEDRE2: CODPED,SEQITEM,CODPRO,QUANTIDADE,PRECOS,TOTITEM,FLGEXC.