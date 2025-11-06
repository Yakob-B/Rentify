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
    // Update document title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
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
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('author', 'Rentify')

    // Open Graph tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image.startsWith('http') ? image : `${siteUrl}${image}`, true)
    updateMetaTag('og:url', currentUrl, true)
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:site_name', 'Rentify', true)

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image.startsWith('http') ? image : `${siteUrl}${image}`)

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
  }, [title, description, image, type, keywords, currentUrl, siteUrl])

  return null
}

export default SEO

