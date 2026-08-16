Source: emerion-load-service/.github/database-metadata/ESTPRO_PRODUCT_TABLE.md

Compact extract (product identity & key fields):
- Legacy PK: CODPRO → maps to product.externalId
- Main fields: DSCPRO (description), DSRPRO (short desc), REFPRO (internal ref), CODANT (old code), FLBPRO (discontinued flag).
- Classification: CODCLP/CODGRU/CODSUB/CODCAT/CODMRC → category/group/brand (use for product-mix and ABC)
- Prices/stock are per-company (DsIte) and may be separate tables (company-item records).

Reference: C:\storage\workspace\kotlin\emerion-load-service\.github\database-metadata\ESTPRO_PRODUCT_TABLE.md
