/**
 * Generate URL-friendly slug from title
 * Handles both English and Japanese text
 */
export function generateSlug(title: string): string {
  // Remove special characters and normalize
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '') // Keep alphanumeric, spaces, and Japanese
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

  // Limit length
  if (slug.length > 50) {
    slug = slug.substring(0, 50).replace(/-+$/, '')
  }

  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  return `${slug}-${randomSuffix}`
}

/**
 * Generate unique slug by appending number if needed
 */
export async function generateUniqueSlug(
  title: string,
  checkExistence: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = generateSlug(title)
  let slug = baseSlug
  let counter = 1

  while (await checkExistence(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

/**
 * Generate slug with category prefix
 */
export function generateCategorySlug(title: string, category: string): string {
  const titleSlug = generateSlug(title)
  const categorySlug = generateSlug(category)
  return `${categorySlug}-${titleSlug}`
}

/**
 * Extract readable title from slug
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  // Allow alphanumeric, hyphens, and Japanese characters
  const slugRegex = /^[a-z0-9\-ぁ-んァ-ヶー一-龠]+$/
  return slugRegex.test(slug) && slug.length <= 50 && !slug.startsWith('-') && !slug.endsWith('-')
}

/**
 * Generate SEO-friendly slug variations
 */
export function generateSlugVariations(title: string, category?: string): string[] {
  const baseSlug = generateSlug(title)
  const variations = [baseSlug]

  if (category) {
    const categorySlug = generateSlug(category)
    variations.push(`${categorySlug}-${baseSlug}`)
    variations.push(`${baseSlug}-${categorySlug}`)
  }

  // Add abbreviated version
  const words = title.split(/[　\s]+/)
  if (words.length > 3) {
    const shortTitle = words.slice(0, 3).join(' ')
    variations.push(generateSlug(shortTitle))
  }

  return [...new Set(variations)] // Remove duplicates
}

/**
 * Clean slug for display purposes
 */
export function cleanSlugForDisplay(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Generate breadcrumb from slug
 */
export function generateBreadcrumb(slug: string): Array<{ label: string; href: string }> {
  const parts = slug.split('-')
  const breadcrumb: Array<{ label: string; href: string }> = []

  let currentPath = ''
  parts.forEach((part, index) => {
    currentPath += (index > 0 ? '-' : '') + part
    breadcrumb.push({
      label: part.charAt(0).toUpperCase() + part.slice(1),
      href: `/${currentPath}`,
    })
  })

  return breadcrumb
}

/**
 * Generate referral code
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}