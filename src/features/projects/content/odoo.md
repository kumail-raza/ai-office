---
title: Odoo
slug: odoo
summary: ERP customization and integrations.
role: Solutions Architect
company: Independent Consulting
startDate: "2019-06"
endDate: "2021-03"
status: completed
technologies: [Odoo, Python, PostgreSQL, XML-RPC]
businessImpact: Automated manual operations workflows, cutting order-processing time from days to hours and removing a full-time data-entry role.
images: ["/assets/images/hero/house.webp|Odoo operations workflow"]
links: []
---

## Overview

A mid-size distributor was running order management, inventory, and invoicing
across three disconnected tools. I designed and built custom Odoo modules to
unify these into a single system with automated workflows.

## Architecture

### Module Design

Custom Odoo modules extended the base sales and inventory apps rather than
replacing them, keeping upgrade paths open.

```python
class SalesOrderExtension(models.Model):
    _inherit = "sale.order"

    warehouse_sync_status = fields.Selection(
        [("pending", "Pending"), ("synced", "Synced")],
        default="pending",
    )

    def action_sync_warehouse(self):
        for order in self:
            warehouse_api.push(order)
            order.warehouse_sync_status = "synced"
```

### System Integrations

A thin integration layer connected Odoo to the existing warehouse system and
the accounting platform via scheduled XML-RPC jobs, avoiding a risky full
data migration.

## Challenges

- Legacy warehouse system had no modern API, only a nightly CSV export
- Staff needed to keep working during the transition — no big-bang cutover allowed
- Invoicing rules varied by customer contract, resisting a one-size-fits-all workflow

## Solutions

- Built a CSV-to-API bridge that polled and normalized the nightly exports until the warehouse system was retired
- Ran Odoo and the legacy tools in parallel for six weeks with a reconciliation job catching drift
- Modeled contract-specific invoicing rules as configurable module settings instead of hardcoded logic

## Lessons Learned

- Parallel running, however tedious, de-risks a migration far more than a hard cutover
- Extending a platform's data model beats replacing it, even when replacing feels cleaner
