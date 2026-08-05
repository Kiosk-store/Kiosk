<!-- @format -->

# Backend System Design & Infrastructure Specification — Kiosk

## Executive Overview

`Kiosk` backend is designed as an enterprise-grade, highly scalable, stateless microservice/serverless-hybrid system built to support high-throughput website provisioning, real-time client analytics, domain management, and subscriptions.

This document details the architectural topologies, load balancing, database strategies, security standards, caching layers, and idempotency guarantees.

---

## 1. System Topology & Infrastructure Layout

```
                                  [ Internet Clients / Mobile ]
                                                │
                                    (HTTPS / TLS 1.3 - SSL)
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │    Cloudflare CDN     │
                                    │  WAF / DDoS Shield    │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │   Layer 7 Load        │
                                    │   Balancer (ALB /     │
                                    │      NGINX)           │
                                    └───────────┬───────────┘
                                                │
                        ┌───────────────────────┴───────────────────────┐
                        │ Stateless Worker Pool (Node.js/Next.js/Go)     │
                        │ Auto-Scaled Horizontally across 3 Availability │
                        │ Zones (Multi-threaded & Event-Driven Workers) │
                        └───────┬───────────────┬───────────────┬───────┘
                                │               │               │
                                ▼               ▼               ▼
                       ┌────────────────┐ ┌───────────┐ ┌───────────────┐
                       │ Redis L2 Cache │ │ PostgreSQL│ │ Event Bus     │
                       │ Cluster (LRU)  │ │ Primary/  │ │ (Kafka /      │
                       │                │ │ Replicas  │ │ RabbitMQ)     │
                       └────────────────┘ └───────────┘ └───────────────┘
```

---

## 2. Load Balancing Strategy & High Availability

### Layer 4 vs Layer 7 Load Balancing
- **Layer 7 (Application Load Balancer)**:
  - Route-based traffic distribution based on path headers (`/api/v1/projects/*`, `/api/v1/auth/*`).
  - TLS 1.3 Termination at the edge balancer using RSA-4096 / ECC security certificates.
  - Round-robin algorithm with dynamic health checks (`GET /healthz` returning `200 OK` within `200ms`).
- **Stateless Architecture**:
  - Services store zero session state in local memory. All session state is stored in encrypted Redis clusters, allowing instant horizontal scaling.

---

## 3. Database Architecture & Persistence Layer

### Primary / Replica PostgreSQL Topology
- **Primary Node (Read-Write)**: Handles all mutating SQL operations (`INSERT`, `UPDATE`, `DELETE`) enclosed within ACID transactions.
- **Read Replicas (Read-Only)**: Distributed read replicas handle high-throughput query operations (`SELECT`) using connection pools managed by **PgBouncer**.
- **Schema & Migrations**: Managed via Prisma ORM / Drizzle ORM migration pipelines with strict Version Control locks.

### Database Indexing & Connection Pooling
```
┌─────────────────────────────────────────────────────────────┐
│                    Connection Manager                       │
│                        (PgBouncer)                          │
│   Max Pool Size: 100 Connections | Idle Timeout: 10,000ms   │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
    ┌────────────────────┐          ┌────────────────────┐
    │  PostgreSQL Primary│          │ Database Replicas  │
    └────────────────────┘          └────────────────────┘
```

---

## 4. Multi-Layer Caching Architecture

### Cache-Aside Strategy (L1 + L2)
1. **L1 In-Memory Cache (Process Level)**: Short-lived LRU (Least Recently Used) cache for high-frequency configuration tokens (TTL: 5 seconds).
2. **L2 Distributed Cache (Redis Cluster)**:
   - Redis Sentinel Cluster providing sub-5ms latency for user permissions, active sessions, and website template metadata.
   - **Cache Invalidation**: Event-driven cache eviction triggered by Kafka/RabbitMQ events on entity update.

```typescript
// Cache-Aside Pattern Blueprint
async function getProjectById(projectId: string): Promise<Project> {
  const cacheKey = `project:${projectId}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const project = await db.projects.findUnique({ where: { id: projectId } });
  if (project) {
    await redis.set(cacheKey, JSON.stringify(project), "EX", 300); // 5 min TTL
  }
  return project;
}
```

---

## 5. Security & Authentication Architecture

### 1. SSL/TLS & Transport Security
- TLS 1.3 strict enforcement across all endpoints.
- Strict HTTP Security Headers: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.

### 2. OAuth 2.0 & OpenID Connect (OIDC)
- Integrated authentication supporting Google OAuth 2.0 and GitHub OAuth.
- Authorization Code Flow with PKCE (Proof Key for Code Exchange) to eliminate interception vectors on mobile/SPA clients.

### 3. JWT Token Lifecycle & Rotation
- **Access Tokens**: Short-lived (15 minutes), signed via RS256 algorithm with private key stored in Cloud KMS / Vault.
- **Refresh Tokens**: Long-lived (7 days), stored in HTTP-Only, SameSite=Strict, Secure cookies.
- **Revocation & Blacklisting**: Token revocation enforced via Redis token blacklist lookup on sensitive API requests.

---

## 6. Idempotency Guarantees

To ensure financial and provisioning operations (e.g. `$499` plan setup charge or site provisioning) execute exactly once even under network retries:

### Idempotency Key Pipeline
1. Client sends `Idempotency-Key: <UUID-v4>` header with `POST /api/v1/projects`.
2. Middleware checks Redis lock: `SETNX idempotency:<key> PENDING EX 60`.
3. If key exists:
   - If status is `COMPLETED`: Return cached HTTP response payload immediately without re-processing.
   - If status is `PENDING`: Return `409 Conflict` (Request currently processing).
4. If key is new: Process transaction, update Redis key to `COMPLETED` with response payload, and commit SQL transaction.

---

## 7. Multithreading & Event-Driven Concurrency

- **Node.js Worker Threads / Worker Pool**: Offloads CPU-intensive tasks (PDF invoice generation, asset image optimization, SSL certificate creation) away from the main event loop thread.
- **Async Non-Blocking I/O**: Handles database queries and network HTTP requests asynchronously via Promises/Event Loop to prevent thread blocking.
