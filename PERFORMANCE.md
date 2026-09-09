# Performance Optimizations — School System

A living document that tracks every performance decision made in this project.
Updated as each feature is implemented.

---

## 1. RTK Query — Cache Strategy

**Location:** `store/baseApi.ts` + `features/*/api.ts`

**What we did:**
Configured different cache durations per data type instead of using one global value.

```ts
// constants/cache-times.ts
STATIC:   600s  // subjects, classrooms — rarely change
NORMAL:   300s  // students, teachers   — change occasionally
DYNAMIC:   60s  // grades, attendance   — change frequently
REALTIME:   0s  // dashboard stats      — always fresh
```

**Why it matters:**
- Without cache → every page navigation triggers a new API request
- With cache → revisiting /students within 5 minutes = instant load, zero requests
- Saves unnecessary bandwidth and improves perceived performance

**Interview talking point:**
"I categorized data by how frequently it changes and assigned appropriate cache durations.
Static data like subjects stays cached for 10 minutes, while attendance records
refresh every minute since they're updated throughout the day."

---

## 2. RTK Query — Tag-Based Cache Invalidation

**Location:** `features/students/api.ts` (and all feature api files)

**What we did:**
Used granular cache tags instead of invalidating entire collections.

```ts
// Provides tags per item
providesTags: (result) => [
  ...result.map(({ studentId }) => ({ type: "Student", id: studentId })),
  { type: "Student", id: "LIST" },
]

// Invalidates only affected items
invalidatesTags: (result, error, { id }) => [
  { type: "Student", id },        // only this student's detail cache
  { type: "Student", id: "LIST" } // the list cache
]
```

**Why it matters:**
- Without granular tags → updating student #1 would refetch ALL students
- With granular tags → only student #1's cache is cleared
- Reduces unnecessary API calls significantly

**Interview talking point:**
"Instead of clearing the entire students cache on every update,
I tag each student by ID. Updating one student only invalidates
that specific student's cache plus the list cache —
not every student's detail page."

---

## 3. useMemo — Expensive Calculations

**Location:** `features/students/hooks/useStudent.ts`

**What we did:**
Wrapped grade and attendance calculations in useMemo.

```ts
const stats = useMemo((): StudentStats => {
  // Calculate averageGrade, attendanceRate, etc.
}, [student]); // Only recalculates when student data changes
```

**Why it matters:**
- Without useMemo → calculations run on EVERY render (even unrelated state changes)
- With useMemo → calculations only run when `student` data actually changes
- For a student with 50 grades + 200 attendance records, this saves real computation

**Interview talking point:**
"The student details page calculates average grades and attendance rates
from potentially hundreds of records. I wrapped these in useMemo so they
only recalculate when the underlying data changes, not on every render."

---

## 4. useMemo — Client-Side Search & Pagination

**Location:** `features/students/hooks/useStudents.ts`

**What we did:**
Memoized both the search filter and pagination calculations.

```ts
// Filter only recalculates when data or searchQuery changes
const filteredStudents = useMemo(() => {
  return students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [data, searchQuery]);

// Pagination only recalculates when filtered results or page changes
const result = useMemo(
  () => paginate(filteredStudents, { page, limit }),
  [filteredStudents, page, limit]
);
```

**Why it matters:**
- Search runs on every keystroke — without memoization, filters entire list every render
- Pagination slices arrays — without memoization, recalculates on unrelated state changes
- With 1000+ students, this is a meaningful optimization

**Interview talking point:**
"Since the backend returns all students at once, I handle search and pagination
client-side. I memoized both operations so filtering 1000 students doesn't
happen on every re-render — only when the search query or data actually changes."

---

## 5. transformResponse — Single Transform Point

**Location:** `store/baseApi.ts` → `lib/utils/transformResponse.ts`

**What we did:**
Applied data transformation once at the API layer, not in every component.

```ts
// In baseApi — runs once per response
if (result.data) {
  result.data = transformResponse(result.data);
}
```

**Why it matters:**
- Without central transform → every component manually handles $id/$values/$ref
- With central transform → clean data flows everywhere automatically
- Also handles circular $ref references from ASP.NET without breaking the app

**Interview talking point:**
"The ASP.NET backend returns data with $id, $values, and circular $ref references.
Instead of handling this in every component, I wrote a recursive transform function
that runs once in the RTK Query base layer — every feature receives clean data automatically."

---

## 6. HttpOnly Cookies — Security + Performance

**Location:** `app/api/auth/login/route.ts`

**What we did:**
Stored JWT in HttpOnly Cookie instead of localStorage.

**Why it matters:**
- Security: JavaScript cannot access the token — XSS attacks can't steal it
- Performance: Cookie is sent automatically with every request
  — no need to manually attach Authorization headers
- Middleware can read cookies server-side for instant route protection
  without client-side JavaScript

**Interview talking point:**
"I stored the JWT in an HttpOnly Cookie so JavaScript can't access it,
preventing XSS token theft. As a bonus, the cookie is automatically
included in every request — I don't need to manually inject
Authorization headers anywhere."

---

## 7. Page Reset on Search

**Location:** `features/students/hooks/useStudents.ts`

**What we did:**
Reset page to 1 whenever the search query changes.

```ts
const handleSearchChange = (query: string) => {
  setSearchQuery(query);
  setPage(1); // Prevents empty pages
};
```

**Why it matters:**
- Without reset → user on page 5 searches → gets 0 results on page 5
- With reset → always starts from page 1 on new search
- Prevents confusing empty states

**Interview talking point:**
"A subtle but important UX detail — when a user searches,
I reset the pagination to page 1. Without this,
a user on page 5 who searches for a student
could end up on an empty page."

---

## 8. RTK Query — isFetching vs isLoading

**Location:** All feature hooks

**What we did:**
Exposed both `isLoading` and `isFetching` separately.

```ts
return {
  isLoading,   // true only on first load — show skeleton
  isFetching,  // true on background refetch — show subtle indicator
}
```

**Why it matters:**
- isLoading = true → show full skeleton (no data yet)
- isFetching = true → data exists but refreshing in background
  → show subtle loading bar, not full skeleton
- Better UX — user sees data immediately while fresh data loads

**Interview talking point:**
"RTK Query distinguishes between the initial load and background refetches.
I expose both states separately — components show a skeleton only on first load,
and a subtle indicator during background refreshes,
so users always see content immediately."

---

## Summary Table

| Optimization | Location | Benefit |
|---|---|---|
| Cache Strategy | `store/baseApi.ts` | Reduces API calls |
| Tag Invalidation | `features/*/api.ts` | Granular cache clearing |
| useMemo (calculations) | `hooks/useStudent.ts` | Avoids expensive recalculation |
| useMemo (search/pagination) | `hooks/useStudents.ts` | Efficient client-side operations |
| Central Transform | `store/baseApi.ts` | Clean data everywhere |
| HttpOnly Cookies | `app/api/auth/login/route.ts` | Security + auto headers |
| Page Reset on Search | `hooks/useStudents.ts` | Better UX |
| isFetching vs isLoading | All feature hooks | Better loading UX |