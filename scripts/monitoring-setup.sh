#!/bin/bash

# Setup monitoring stack (Prometheus + Grafana)

set -e

echo "📊 Setting up monitoring stack..."

# Check if monitoring services are running
if docker-compose ps | grep -q "prometheus.*Up"; then
    echo "✅ Prometheus is running"
    PROMETHEUS_URL="http://localhost:9090"
else
    echo "❌ Prometheus is not running. Start with: docker-compose up -d prometheus"
    exit 1
fi

if docker-compose ps | grep -q "grafana.*Up"; then
    echo "✅ Grafana is running"
    GRAFANA_URL="http://localhost:3001"
else
    echo "❌ Grafana is not running. Start with: docker-compose up -d grafana"
    exit 1
fi

echo ""
echo "📊 Monitoring Stack Setup Complete!"
echo ""
echo "Access Points:"
echo "  - Prometheus: ${PROMETHEUS_URL}"
echo "  - Grafana: ${GRAFANA_URL}"
echo "  - Node Exporter: http://localhost:9100/metrics"
echo "  - cAdvisor: http://localhost:8080"
echo ""
echo "Grafana Login:"
echo "  Username: admin"
echo "  Password: admin (change on first login)"
echo ""
echo "Next steps:"
echo "  1. Access Grafana at ${GRAFANA_URL}"
echo "  2. Login with admin/admin"
echo "  3. Dashboard is pre-configured as 'SkillSphere Overview'"
echo "  4. Prometheus datasource is auto-configured"
echo ""
