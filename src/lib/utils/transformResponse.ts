// lib/utils/transformResponse.ts

// Strips $id, resolves $ref, and unwraps $values
// Handles ASP.NET circular reference JSON format

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformResponse = (data: any, refs: Map<string, any> = new Map()): any => {

  if (data === null || typeof data !== "object") {
    return data;
  }

  // Store object by its $id for later $ref resolution
  if ("$id" in data && !("$ref" in data)) {
    refs.set(data.$id, data);
  }

  // $ref → circular reference → return null to break the cycle
  // We don't want to render circular data in the UI
  if ("$ref" in data) {
    return null;
  }

  // $values → unwrap array and process each item
  if ("$values" in data) {
    return data.$values
      .map((item: any) => transformResponse(item, refs))
      .filter((item: any) => item !== null); // Remove circular refs
  }

  // Regular object → strip $id, process all values
  const cleaned: Record<string, unknown> = {};

  for (const key in data) {
    if (key === "$id") continue;
    cleaned[key] = transformResponse(data[key], refs);
  }

  return cleaned;
};