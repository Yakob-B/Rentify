import { useEffect } from 'react'

const StructuredData = ({ data }) => {
  useEffect(() => {
    if (!data || typeof data !== 'object') return

    try {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(data)
      script.id = 'structured-data'
      
      // Remove existing structured data
      const existing = document.getElementById('structured-data')
      if (existing) {
        existing.remove()
      }
      
      document.head.appendChild(script)

      return () => {
        const scriptToRemove = document.getElementById('structured-data')
        if (scriptToRemove) {
          scriptToRemove.remove()
        }
      }
    } catch (error) {
      console.error('Error creating structured data:', error)
    }
  }, [data])

  return null
}

export default StructuredData

