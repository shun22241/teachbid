// Redis caching utilities for TeachBid
// This is a placeholder implementation - in production you'd use actual Redis

interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
}

class MemoryCache {
  private cache = new Map<string, { value: any; expires: number }>()
  private defaultTTL = 300 // 5 minutes

  set(key: string, value: any, ttl: number = this.defaultTTL): void {
    const expires = Date.now() + (ttl * 1000)
    this.cache.set(key, { value, expires })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.value as T
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Get all keys matching a pattern
  keys(pattern: string): string[] {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    return Array.from(this.cache.keys()).filter(key => regex.test(key))
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key)
      }
    }
  }
}

// Singleton cache instance
const cache = new MemoryCache()

// Cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => cache.cleanup(), 5 * 60 * 1000)
}

export class CacheManager {
  private prefix: string

  constructor(prefix: string = 'teachbid') {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    const cacheKey = this.getKey(key)
    const ttl = options.ttl || 300
    cache.set(cacheKey, value, ttl)
  }

  async get<T>(key: string): Promise<T | null> {
    const cacheKey = this.getKey(key)
    return cache.get<T>(cacheKey)
  }

  async delete(key: string): Promise<boolean> {
    const cacheKey = this.getKey(key)
    return cache.delete(cacheKey)
  }

  async clear(pattern?: string): Promise<void> {
    if (pattern) {
      const keys = cache.keys(this.getKey(pattern))
      keys.forEach(key => cache.delete(key))
    } else {
      // Clear all keys with this prefix
      const keys = cache.keys(this.getKey('*'))
      keys.forEach(key => cache.delete(key))
    }
  }

  // Cache with automatic JSON serialization
  async setJSON(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    await this.set(key, JSON.stringify(value), options)
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const cached = await this.get<string>(key)
    if (!cached) return null
    
    try {
      return JSON.parse(cached) as T
    } catch {
      return null
    }
  }

  // Cache function results
  async remember<T>(
    key: string,
    fn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const result = await fn()
    await this.set(key, result, options)
    return result
  }

  // Cache function results with JSON serialization
  async rememberJSON<T>(
    key: string,
    fn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.getJSON<T>(key)
    if (cached !== null) {
      return cached
    }

    const result = await fn()
    await this.setJSON(key, result, options)
    return result
  }
}

// Pre-configured cache instances for different use cases
export const requestsCache = new CacheManager('requests')
export const proposalsCache = new CacheManager('proposals')
export const usersCache = new CacheManager('users')
export const categoriesCache = new CacheManager('categories')
export const searchCache = new CacheManager('search')

// Cache configuration for different data types
export const CACHE_TTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 1800,       // 30 minutes
  VERY_LONG: 3600,  // 1 hour
  DAY: 86400,       // 24 hours
} as const