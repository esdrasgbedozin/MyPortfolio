# MONITORING.md

## 📊 Monitoring & Observability Stack

This project uses a comprehensive observability stack to track errors, performance, and logs.

---

## 🔍 Error Tracking: Sentry

### Setup (Epic 4.2 - EF-049b)

1. **Create Sentry Project**
   - Go to [sentry.io](https://sentry.io)
   - Create new project → Select **Astro** platform
   - Copy the DSN from project settings

2. **Configure Environment Variables**

   ```bash
   # In .env.local (local development)
   SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   ```

3. **Vercel Deployment**
   - Dashboard → Project → Settings → Environment Variables
   - Add `SENTRY_DSN` for Production, Preview, Development

### Alert Rules (EF-049f)

Configure alerts in Sentry dashboard:

1. **Navigate**: Alerts → Create Alert Rule
2. **Condition**: "When the issue is seen more than 5 times in 1 minute"
3. **Environment**: Production only
4. **Action**: Send email notification to team
5. **Additional Rules**:
   - Critical errors (5xx) → Immediate Slack notification
   - New error types → Daily digest email

### Features Enabled

- ✅ Automatic 5xx error capture
- ✅ Breadcrumb tracking (request lifecycle)
- ✅ Context enrichment (requestId, IP, userAgent)
- ✅ Performance monitoring (10% sample rate production)
- ✅ Tag filtering (endpoint, error_type, status_code)

---

## 📝 Structured Logging

### Current Implementation (Epic 3.3 - EF-042)

- **Format**: JSON structured logs
- **Library**: Custom logger (`src/utils/logger.ts`)
- **Levels**: DEBUG, INFO, WARN, ERROR
- **Fields**: timestamp, level, message, context, requestId, metadata

### Log Levels

```typescript
logger.info('Contact form submission received', {
  context: 'api/contact',
  requestId: 'uuid-v4',
  clientIp: '192.168.1.1',
});

logger.error('Unexpected error in POST /api/contact', error, {
  context: 'api/contact',
  requestId: 'uuid-v4',
});
```

---

## 🚀 Epic 4.3: Log Aggregation (EF-049g)

### Option 1: Vercel Log Drains (Recommended)

**Requirements**: Vercel Pro plan ($20/month minimum)

**Setup Steps**:

1. **Enable Log Drains in Vercel**
   - Dashboard → Project → Settings → Integrations → Log Drains
   - Select destination: Datadog, Logtail, Axiom, or custom endpoint

2. **Supported Destinations**
   - **Datadog**: Full observability platform (logs + APM)
   - **Logtail**: Lightweight log management
   - **Axiom**: Real-time log analytics
   - **Custom Webhook**: Send to your own endpoint

3. **Configuration Example (Datadog)**

   ```bash
   # In Vercel dashboard:
   Log Drain URL: https://http-intake.logs.datadoghq.com/v1/input/
   Headers:
     DD-API-KEY: <your-datadog-api-key>
     ddsource: vercel
     service: portfolio-pro
   ```

4. **Environment Setup**
   ```bash
   # .env.local (if using custom endpoint)
   LOG_DRAIN_ENDPOINT=https://your-log-aggregator.com/ingest
   LOG_DRAIN_API_KEY=your-secret-key
   ```

### Option 2: Datadog (Direct Integration)

**Requirements**: Datadog account (free tier available, limited retention)

**Setup Steps**:

1. **Install Datadog SDK** (optional for custom metrics)

   ```bash
   pnpm add dd-trace
   ```

2. **Configure Datadog Agent** (if self-hosted)
   - Not recommended for Vercel Edge Functions
   - Use Vercel Log Drains instead

3. **Dashboard Setup**
   - Navigate to Logs → Pipelines
   - Create pipeline for `source:vercel`
   - Filter by `service:portfolio-pro`

### Current Status (Development)

⚠️ **Log drains NOT configured** (requires Vercel Pro)

Logs are currently available in:

- **Local Development**: Terminal stdout (JSON format)
- **Vercel Deployment**: Vercel Dashboard → Deployments → Logs (24h retention)

---

## 📈 Epic 4.3: Monitoring Dashboard (EF-049h)

### Vercel Analytics (Built-in, Free)

**Metrics Available**:

- Page views
- Unique visitors
- Top pages
- Top referrers
- Devices & browsers

**Access**: Vercel Dashboard → Project → Analytics

**Limitations**:

- No custom API metrics
- No request-level data for `/api/contact`

### Sentry Performance Dashboard

**Access**: Sentry Dashboard → Performance

**Metrics Tracked**:

- Error rate over time
- Issues by endpoint
- Issues by environment
- New vs returning issues
- Release health

**Custom Queries**:

```sql
-- Errors by endpoint
SELECT count() BY tags[endpoint] WHERE environment = production

-- Errors by user impact
SELECT count() BY user.ip WHERE error.status >= 500
```

### Recommended Dashboard Setup

**For Production Monitoring**, combine:

1. **Sentry** (Primary):
   - Error rates and trends
   - Performance metrics (if enabled)
   - User impact analysis

2. **Vercel Logs** (24h retention):
   - Real-time request logs
   - Function execution logs
   - Build and deployment logs

3. **Datadog** (if Log Drains enabled):
   - Custom dashboards with:
     - Requests per minute (by endpoint)
     - P50, P95, P99 latency
     - Error rate (4xx vs 5xx)
     - Top IP addresses
     - Geographic distribution

### Dashboard Configuration Example (Datadog)

```yaml
# Hypothetical dashboard.json (Datadog format)
widgets:
  - title: 'API Requests per Minute'
    query: 'sum:vercel.requests{service:portfolio-pro,endpoint:/api/contact}.as_rate()'

  - title: 'Error Rate (%)'
    query: 'sum:vercel.errors{service:portfolio-pro}/sum:vercel.requests{service:portfolio-pro}*100'

  - title: 'P95 Latency'
    query: 'p95:vercel.latency{service:portfolio-pro,endpoint:/api/contact}'

  - title: 'Top Error Types'
    query: 'top:vercel.errors{service:portfolio-pro} by error_type'
```

---

## 🎯 KPIs & Alerting

### Critical Metrics to Monitor

| Metric             | Threshold     | Action                              |
| ------------------ | ------------- | ----------------------------------- |
| Error rate         | >5 errors/min | Immediate Slack notification        |
| API latency (P95)  | >2 seconds    | Warning email                       |
| Sentry quota       | >80%          | Increase plan or adjust sample rate |
| Failed email sends | >10%          | Check Resend service status         |
| Turnstile failures | >20%          | Check Cloudflare Turnstile status   |

### Health Check Monitoring

Use `/api/health` endpoint for external monitoring:

```bash
# Example: UptimeRobot, Pingdom, StatusCake
GET https://your-domain.com/api/health
Expected: 200 OK + { "status": "healthy", ... }
```

**Monitoring Tools** (pick one):

- [UptimeRobot](https://uptimerobot.com) - Free tier available
- [Pingdom](https://pingdom.com) - Paid
- [StatusCake](https://statuscake.com) - Free tier available

---

## 🔧 Troubleshooting

### Logs Not Appearing in Sentry

1. Check `SENTRY_DSN` is set in Vercel env vars
2. Verify DSN format: `https://<key>@<org>.ingest.sentry.io/<project-id>`
3. Check Sentry quota (free tier: 5K errors/month)
4. Review ignored errors in `src/utils/sentry.ts`

### Log Drains Not Working

1. Verify Vercel Pro plan active
2. Check Log Drain URL and headers
3. Test endpoint with `curl`:
   ```bash
   curl -X POST https://your-endpoint.com/ingest \
     -H "Authorization: Bearer your-token" \
     -d '{"message": "test log"}'
   ```

### Missing Metrics in Dashboard

1. Ensure logs are JSON formatted (already done in `src/utils/logger.ts`)
2. Verify `service` tag is set correctly
3. Check Datadog pipeline filters
4. Wait 5-10 minutes for data propagation

---

## 📚 Resources

- [Vercel Log Drains Documentation](https://vercel.com/docs/observability/log-drains)
- [Sentry Astro Integration](https://docs.sentry.io/platforms/javascript/guides/astro/)
- [Datadog Vercel Integration](https://docs.datadoghq.com/integrations/vercel/)
- [Structured Logging Best Practices](https://www.datadoghq.com/blog/structured-logging/)
