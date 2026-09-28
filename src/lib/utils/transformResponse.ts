// lib/utils/transformResponse.ts

// Strips $id, resolves $ref, and unwraps $values
// Handles ASP.NET circular reference JSON format

export const transformResponse = (
  data: unknown,
  refs: Map<string, unknown> = new Map()
): unknown => {

  if (data === null || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformResponse(item, refs));
  }

  const objectData = data as Record<string, unknown>;

  // Store object by its $id for later $ref resolution
  if (typeof objectData.$id === "string" && !("$ref" in objectData)) {
    refs.set(objectData.$id, objectData);
  }

  // $ref → circular reference → return null to break the cycle
  // We don't want to render circular data in the UI
  if ("$ref" in objectData) {
    return null;
  }

  // $values → unwrap array and process each item
  if (Array.isArray(objectData.$values)) {
    return objectData.$values
      .map((item) => transformResponse(item, refs))
      .filter((item) => item !== null); // Remove circular refs
  }

  // Regular object → strip $id, process all values
  const cleaned: Record<string, unknown> = {};

  for (const key in objectData) {
    if (key === "$id") continue;
    cleaned[key] = transformResponse(objectData[key], refs);
  }

  return cleaned;
};
