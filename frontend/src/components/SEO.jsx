import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SEO = ({ 
  title = 'Rentify - Universal Rent Service Platform',
  description = 'Rentify is a universal rent service platform where you can rent or list any kind of item - homes, vehicles, tools, electronics, and more.',
  image = '/og-image.jpg',
  type = 'website',
  keywords = 'rent, rental, marketplace, items, property, vehicle, tools, electronics',
  canonical = null
}) => {
  const location = useLocation()
  const siteUrl = window.location.origin
  const currentUrl = canonical || `${siteUrl}${location.pathname}`

  useEffect(() => {
    // Ensure all values are strings and safe to use
    const safeTitle = title && typeof title === 'string' ? title : 'Rentify - Universal Rent Service Platform'
    const safeDescription = description && typeof description === 'string' ? description : 'Rentify is a universal rent service platform where you can rent or list any kind of item - homes, vehicles, tools, electronics, and more.'
    const safeKeywords = keywords && typeof keywords === 'string' ? keywords : 'rent, rental, marketplace, items, property, vehicle, tools, electronics'
    const safeImage = image && typeof image === 'string' ? image : '/og-image.jpg'
    
    // Update document title
    document.title = safeTitle

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      // Skip if content is not a string
      if (!content || typeof content !== 'string') return
      
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    // Basic meta tags
    updateMetaTag('description', safeDescription)
    updateMetaTag('keywords', safeKeywords)
    updateMetaTag('author', 'Rentify')

    // Open Graph tags
    updateMetaTag('og:title', safeTitle, true)
    updateMetaTag('og:description', safeDescription, true)
    const imageUrl = safeImage && typeof safeImage === 'string' 
      ? (safeImage.startsWith('http') || safeImage.startsWith('//') ? safeImage : `${siteUrl}${safeImage.startsWith('/') ? safeImage : '/' + safeImage}`)
      : `${siteUrl}/og-image.jpg`
    updateMetaTag('og:image', imageUrl, true)
    updateMetaTag('og:url', currentUrl, true)
    updateMetaTag('og:type', type && typeof type === 'string' ? type : 'website', true)
    updateMetaTag('og:site_name', 'Rentify', true)

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', safeTitle)
    updateMetaTag('twitter:description', safeDescription)
    updateMetaTag('twitter:image', imageUrl)

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', currentUrl)

    // Robots meta
    updateMetaTag('robots', 'index, follow')
  }, [title, description, image, type, keywords, canonical, location.pathname])

  return null
}

export default SEO

