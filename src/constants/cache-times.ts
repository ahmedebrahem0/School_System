// constants/cache-times.ts

// Cache duration constants for RTK Query
// All values are in seconds
// Used in every feature api.ts for keepUnusedDataFor

export const CACHE_TIMES = {

  // Static data — rarely changes
  // Examples: subjects, classrooms
  // 10 minutes
  STATIC: 600,

  // Normal data — changes occasionally
  // Examples: students, teachers, classes
  // 5 minutes
  NORMAL: 300,

  // Dynamic data — changes frequently
  // Examples: grades, attendances
  // 1 minute
  DYNAMIC: 60,

  // Real-time data — always fresh
  // Examples: dashboard stats, notifications
  // No cache
  REALTIME: 0,

} as const;