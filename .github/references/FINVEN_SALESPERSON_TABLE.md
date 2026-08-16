Source: emerion-load-service/.github/database-metadata/FINVEN_SALESPERSON_TABLE.md

Compact extract (salesperson/vendedor):
- Legacy PK: CODVEN → maps to vendedor.externalId
- Key fields: NOMVEN (name), CGCVEN (tax id), FLGATI (active flag), contact/address fields (ENDVEN, FONVEN), classification: CODGVE/CODCVE/CODTVE.
- Relationship: fincli.CODVEN references this table for customer's assigned seller.

Reference: C:\storage\workspace\kotlin\emerion-load-service\.github\database-metadata\FINVEN_SALESPERSON_TABLE.md