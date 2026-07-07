---
title: Queue Management
slug: queue-management
summary: A queue and scheduling management system.
role: Backend Lead
company: Enterprise Platforms Inc.
startDate: "2017-04"
endDate: "2019-02"
status: completed
technologies: [Node.js, Redis, PostgreSQL, WebSockets]
businessImpact: Cut average wait-time visibility lag from minutes to seconds and improved staff scheduling accuracy, reducing overtime costs.
images: ["/assets/images/hero/garden.webp|Live queue dashboard"]
links: []
---

## Overview

A multi-location service business needed real-time visibility into queue
length and staff scheduling across sites. I led the backend team building a
queue and scheduling platform with live dashboards.

## Architecture

### Real-Time Queue State

Queue state lived in Redis for low-latency reads and writes, with PostgreSQL
as the durable system of record synced on a write-behind basis.

```javascript
async function enqueue(locationId, ticket) {
  await redis.rpush(`queue:${locationId}`, JSON.stringify(ticket));
  await redis.publish(`queue:${locationId}:updates`, "enqueued");
  await db.tickets.insert(ticket); // durable write, async
}
```

### Live Dashboards

A WebSocket layer pushed queue and staffing changes to dashboards instantly,
replacing a 60-second polling loop that staff had been complaining about for
years.

## Challenges

- Redis and Postgres could drift under high load or partial failures
- Staff scheduling needed to account for real historical demand patterns, not guesses
- Dozens of locations meant the dashboard fan-out had to scale without a rewrite

## Solutions

- Built a reconciliation job that periodically diffed Redis and Postgres and healed drift automatically
- Fed historical queue data into a simple demand-forecasting model to suggest staffing levels
- Used a pub/sub fan-out layer so adding locations meant configuration, not new infrastructure

## Lessons Learned

- Treat the fast cache as a view, not the source of truth — reconciliation is not optional at scale
- Real-time dashboards change staff behavior; design the UI for that from day one
- Simple forecasting beats no forecasting, and is far easier to ship than a "perfect" model
