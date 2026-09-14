## HTTP Request
  |
  |
  |
  *
  ### Express Middleware stack
   - Rate limiter (per tenant_id)
   - Auth Middleware (verify JWT)
    . Extracts: userId, tenantId, roles, permissions
   - RBAC Middleware (check role)
  |
  |
  *
  ### Route Handler
  - Call Repository (tenant-safe query)
  - Call Audit Service (fire & forget)
  - Return Response
                |
                |
Projects table ------ Audit Logs Table