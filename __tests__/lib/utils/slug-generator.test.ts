import { generateSlug } from '@/lib/utils/slug-generator'

describe('Slug Generator', () => {
  it('generates slugs for Japanese text', () => {
    const slug = generateSlug('プログラミング学習')
    expect(slug).toMatch(/^プログラミング学習-[a-z0-9]{6}$/)
  })

  it('generates slugs for English text', () => {
    const slug = generateSlug('Programming Lessons')
    expect(slug).toMatch(/^programming-lessons-[a-z0-9]{6}$/)
  })

  it('handles mixed Japanese and English', () => {
    const slug = generateSlug('プログラミング Programming 学習')
    expect(slug).toMatch(/^プログラミング-programming-学習-[a-z0-9]{6}$/)
  })

  it('removes special characters', () => {
    const slug = generateSlug('プログラミング@#$%学習!!!')
    expect(slug).toMatch(/^プログラミング学習-[a-z0-9]{6}$/)
  })

  it('handles empty strings', () => {
    const slug = generateSlug('')
    expect(slug).toMatch(/^[a-z0-9]{6}$/)
  })

  it('truncates long titles', () => {
    const longTitle = 'This is a very long title that should be truncated because it exceeds the maximum length limit'
    const slug = generateSlug(longTitle)
    expect(slug.length).toBeLessThanOrEqual(57) // 50 chars + 1 dash + 6 random chars
  })

  it('handles only special characters', () => {
    const slug = generateSlug('@#$%^&*()')
    expect(slug).toMatch(/^[a-z0-9]{6}$/)
  })

  it('replaces multiple spaces with single dash', () => {
    const slug = generateSlug('multiple   spaces   here')
    expect(slug).toMatch(/^multiple-spaces-here-[a-z0-9]{6}$/)
  })

  it('removes leading and trailing dashes', () => {
    const slug = generateSlug('  プログラミング学習  ')
    expect(slug).toMatch(/^プログラミング学習-[a-z0-9]{6}$/)
    expect(slug).not.toMatch(/^-/)
    expect(slug).not.toMatch(/-[a-z0-9]{6}-$/)
  })

  it('generates unique slugs for same input', () => {
    const slug1 = generateSlug('プログラミング学習')
    const slug2 = generateSlug('プログラミング学習')
    expect(slug1).not.toBe(slug2)
  })
})