// lib/utils/transformResponse.ts

// ─────────────────────────────────────────────────────
// إيه اللي بيعمله؟
// بيشيل $id و $values من أي response جاي من الـ Backend
// بيشتغل recursively — يعني لو في nested objects
// بيعالجهم كمان (زي attendances و grades جوه الـ student)
// ─────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformResponse = (data: any): any => {
  // لو مش object أو null → رجّعه زي ما هو
  // مثال: string, number, boolean, null
  if (data === null || typeof data !== "object") {
    return data;
    }
    
    // أضف دي: لو الداتا Array صريح من البداية، عالج كل عنصر جواه
    if (Array.isArray(data)) {
    return data.map(transformResponse);
  }

  // لو فيه $values → ده array من الـ Backend
  // نعالج كل عنصر فيه recursively
  if ("$values" in data) {
    return data.$values.map(transformResponse);
  }

  // لو object عادي → نمشي على كل الـ keys
  // ونعالج كل value recursively
  // ونشيل الـ $id من الـ object
  const cleaned: Record<string, unknown> = {};

  for (const key in data) {
    // نشيل الـ $id — مش محتاجينه في الـ Frontend
    if (key === "$id") continue;

    cleaned[key] = transformResponse(data[key]);
  }

  return cleaned;
};