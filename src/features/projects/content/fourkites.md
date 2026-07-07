---
title: FourKites
slug: fourkites
summary: Real-time supply-chain visibility at scale.
role: Lead Cloud Architect
company: FourKites
startDate: "2021-01"
endDate: Present
status: in-progress
technologies: [AWS, Kafka, Kubernetes, TypeScript, Terraform]
businessImpact: Scaled ingestion to millions of daily tracking events while improving cross-region reliability and cutting time-to-insight for customers.
images: ["/assets/images/hero/office.webp|FourKites platform dashboard"]
links: ["Case Study|#", "GitHub|#"]
---

## Overview

FourKites needed real-time visibility into shipments crossing dozens of carriers
and regions. I led the architecture for the platform's ingestion and processing
layer, turning a batch-oriented system into a real-time one.

## Architecture

### Data Ingestion Pipeline

Every carrier feed lands in a Kafka topic, partitioned by shipment ID for
ordered processing. A fleet of autoscaling consumers normalizes each event
before writing to the tracking store.

```typescript
const consumer = kafka.consumer({ groupId: "ingestion" });
await consumer.subscribe({ topic: "carrier-events" });
await consumer.run({
  eachMessage: async ({ message }) => {
    const event = normalize(message.value);
    await trackingStore.upsert(event);
  },
});
```

### Multi-Region Failover

Each region runs an independent processing stack; a health-checked router
directs traffic to the nearest healthy region and replicates state
asynchronously so a regional outage never drops a shipment update.

## Challenges

- Handling bursty carrier traffic without dropping or reordering events
- Coordinating deploys across multiple regions without downtime
- Keeping p99 latency low as event volume grew 10x

## Solutions

- Backpressure-aware consumer groups with per-partition autoscaling
- Blue/green regional deployments with automated health checks before cutover
- Moved hot-path aggregation into a dedicated in-memory layer, dropping p99 latency by 60%

## Lessons Learned

- Invest in observability before scaling ingestion, not after
- Regional failover needs regular chaos testing, or it quietly rots
- Ordering guarantees are expensive — only pay for them where the business needs them
