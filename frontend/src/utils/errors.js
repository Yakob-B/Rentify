// Centralized error message extractor for consistent toasts
export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (!error) return fallback
  const responseMessage = error.response?.data?.message
  const dataMessage = typeof error.response?.data === 'string' ? error.response.data : undefined
  const requestMessage = error.request && !error.response ? 'Network error. Please check your connection.' : undefined
  const message = responseMessage || dataMessage || error.message || requestMessage
  return message || fallback
}


