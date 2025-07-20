import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://teachbid.com'

  // Static pages
  const staticPages = [
    '',
    '/categories',
    '/how-it-works',
    '/pricing',
    '/login',
    '/register',
    '/search',
    '/teachers',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Category pages
  const categories = [
    'programming',
    'language',
    'music',
    'art',
    'sports',
    'exam-prep',
    'business',
    'hobby',
  ].map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categories]
}