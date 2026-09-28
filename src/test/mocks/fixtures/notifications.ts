export const notificationFixture = {
  id: "11111111-1111-1111-1111-111111111111",
  title: "Grade added",
  message: "A grade was added.",
  type: "GradeAdded",
  priority: "Normal",
  createdAtUtc: "2026-09-28T09:00:00Z",
  expiresAtUtc: null,
  relatedEntityType: "StudentGrade",
  relatedEntityId: "15",
  isRead: false,
  readAtUtc: null,
} as const;

export const notificationPageFixture = {
  items: [notificationFixture],
  page: 1,
  pageSize: 20,
  totalCount: 1,
  totalPages: 1,
  hasNext: false,
} as const;

export const unreadCountFixture = { count: 1 } as const;
