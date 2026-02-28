export function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('fr-FR')
}

export function mapKbisStatusFromPayment(status) {
  const normalized = (status || '').toLowerCase()
  if (normalized === 'succeeded') return 'Validée'
  if (normalized === 'processing' || normalized === 'requires_action') return 'En attente'
  if (normalized === 'failed' || normalized === 'canceled' || normalized === 'cancelled') return 'Refusée'
  return 'En attente'
}
