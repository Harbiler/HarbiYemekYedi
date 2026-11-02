#!/usr/bin/env bash
# Telefondan Project komuta — yerel site sunucusu + bağlantı bilgisi
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PORT=8080

if lsof -iTCP:"$PORT" -sTCP:LISTEN -P >/dev/null 2>&1; then
  echo "✓ Port $PORT zaten dinleniyor (serve.py muhtemelen çalışıyor); atlanıyor."
else
  echo "→ serve.py arka planda :$PORT üzerinde başlatılıyor..."
  nohup python3 "$REPO_ROOT/serve.py" >>"$REPO_ROOT/scripts/serve.log" 2>&1 &
  sleep 1
  if lsof -iTCP:"$PORT" -sTCP:LISTEN -P >/dev/null 2>&1; then
    echo "✓ serve.py başlatıldı (log: scripts/serve.log)"
  else
    echo "⚠ serve.py hemen dinlemiyor; scripts/serve.log dosyasına bakın."
  fi
fi

echo ""
echo "── Worker (ayrı Terminal penceresinde) ──"
echo "  agent worker start"
echo "  (Worker etkileşimli olabilir; bu pencerede bırakın.)"
echo ""

LAN_IP=""
for iface in en0 en1; do
  ip="$(ipconfig getifaddr "$iface" 2>/dev/null || true)"
  if [[ -n "$ip" ]]; then
    LAN_IP="$ip"
    break
  fi
done

echo "── Telefon (aynı Wi‑Fi) ──"
if [[ -n "$LAN_IP" ]]; then
  echo "  Site:  http://${LAN_IP}:${PORT}"
else
  echo "  Yerel IP bulunamadı (en0/en1). Sistem Tercihleri → Ağ’dan IP’nizi kontrol edin."
fi
echo ""
echo "── Cursor iOS Project ──"
echo "  https://cursor.com/agents/bc-e179d3e9-4838-4f3d-8f88-4544b21ecf42"
