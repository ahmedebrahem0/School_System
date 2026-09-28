# Notifications Frontend Guide

هذا الملف يتحدث بعد اكتمال كل مرحلة. أي endpoint غير مذكور كـ Completed لا يعتمد عليه frontend بعد.

## الحالة الحالية

- Phase 1: Completed — Domain وDatabase schema.
- Phase 2: Completed — Inbox APIs.
- Phase 3: Completed — Manual sending وtargeting.
- Phase 4: Completed — Automatic core events.
- Phase 5: Completed — Timetable وRole events.
- Phase 6: Completed — Outbox.
- Phase 7: Completed — SignalR.
- Phase 8: Completed — Scheduling وreminders.
- Phase 9: Optional — Email وPush.

## Phase 1 — Domain وDatabase

المرحلة أسست تخزين الإشعارات فقط. لا توجد Notifications API جاهزة للـ frontend حتى الآن.

### Notification

- `id`: GUID.
- `title`: نص مطلوب، بحد أقصى 150 حرفًا.
- `message`: نص مطلوب، بحد أقصى 1000 حرف.
- `type`: نوع الإشعار.
- `priority`: أولوية الإشعار.
- `status`: حالة النشر.
- `createdByUserId`: مرسل الإشعار، وقد يكون null للإشعارات الآلية.
- `createdAtUtc`: وقت الإنشاء UTC.
- `scheduledAtUtc`: وقت النشر المجدول UTC، اختياري.
- `expiresAtUtc`: انتهاء الصلاحية UTC، اختياري.
- `relatedEntityType` و`relatedEntityId`: رابط اختياري بالبيان الذي سبب الإشعار.

### حالة الإشعار لكل مستخدم

- كل مستخدم له `isRead` و`readAtUtc` مستقلان.
- الحذف من inbox هو soft delete خاص بالمستخدم ولا يحذف الإشعار عند الآخرين.
- قاعدة البيانات تمنع تكرار نفس المستلم داخل نفس الإشعار.

### القيم الثابتة

`type`:

```text
Announcement
GradeAdded
GradeUpdated
AttendanceRecorded
AbsenceWarning
ScheduleChanged
ClassAssigned
SubjectAssigned
LessonReminder
RoleChanged
UserPendingRole
System
```

`priority`:

```text
Low
Normal
High
Urgent
```

`status`:

```text
Draft
Scheduled
Published
Cancelled
Expired
```

### ملاحظات frontend

- التواريخ ستخرج بصيغة UTC، والواجهة تحولها لتوقيت المستخدم.
- استخدم قيم النصوص كما هي؛ لا تعتمد على أرقام enum.
- تصميم badge وnotification card ممكن يبدأ الآن، لكن الربط بالـ API يبدأ بعد Phase 2.

## سجل التحقق

- Phase 1 Release build: Passed، 0 warnings، 0 errors.
- Phase 1 migration: `AddNotifications` generated and reviewed.

## Phase 2 — Inbox API

كل endpoints تتطلب JWT صالح، ومتاحة لكل الأدوار. الـ backend يأخذ المستخدم من claim `UserId`؛ لا ترسل `userId`.

### جلب الإشعارات

```http
GET /api/notifications?page=1&pageSize=20&isRead=false&type=GradeAdded&priority=Normal
```

كل query parameters اختيارية. `pageSize` من 1 إلى 100.

Response:

```json
{
  "items": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "title": "Grade added",
      "message": "A grade was added.",
      "type": "GradeAdded",
      "priority": "Normal",
      "createdAtUtc": "2026-09-28T09:00:00Z",
      "expiresAtUtc": null,
      "relatedEntityType": "StudentGrade",
      "relatedEntityId": "15",
      "isRead": false,
      "readAtUtc": null
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 1,
  "totalPages": 1,
  "hasNext": false
}
```

النتيجة تعرض `Published` فقط، وتستبعد المحذوف والمنتهي.

### عدد غير المقروء

```http
GET /api/notifications/unread-count
```

```json
{ "count": 3 }
```

### تعليم إشعار كمقروء

```http
PATCH /api/notifications/{notificationId}/read
```

- النجاح: `204 No Content`.
- غير موجود أو غير مملوك للمستخدم: `404 Not Found`.

### تعليم الكل كمقروء

```http
PATCH /api/notifications/read-all
```

- النجاح: `204 No Content`.

### حذف من inbox

```http
DELETE /api/notifications/{notificationId}
```

- Soft delete للمستخدم الحالي فقط.
- تكرار نفس الطلب آمن ويرجع `204 No Content`.
- إشعار مستخدم آخر يرجع `404 Not Found`.

### سلوك الواجهة المقترح

- عند فتح القائمة: اجلب أول صفحة.
- badge يعتمد `/unread-count`.
- بعد فتح card: نفذ endpoint القراءة ثم حدّث card وbadge محليًا.
- بعد `read-all`: اجعل كل العناصر الحالية مقروءة وصفّر badge.
- التواريخ UTC؛ حولها محليًا عند العرض.

## سجل تحقق Phase 2

- Release build: Passed، 0 warnings، 0 errors.
- Response contract test أضيف لشكل pagination والإشعار.

## Phase 3 — الإرسال اليدوي

```http
POST /api/notifications/send
Authorization: Bearer {token}
Idempotency-Key: unique-key-from-client
Content-Type: application/json
```

Body:

```json
{
  "title": "Exam tomorrow",
  "message": "Math exam starts at 09:00.",
  "type": "Announcement",
  "priority": "High",
  "targetType": "Class",
  "targetId": "3",
  "expiresAtUtc": "2026-10-01T12:00:00Z",
  "relatedEntityType": null,
  "relatedEntityId": null
}
```

Response لأول إرسال: `201 Created`.

```json
{
  "notificationId": "11111111-1111-1111-1111-111111111111",
  "recipientCount": 25,
  "wasDuplicate": false
}
```

تكرار نفس `Idempotency-Key` لنفس المرسل يرجع `200 OK` ونفس الإشعار مع `wasDuplicate: true`.

### Target types

- `User`: `targetId` هو Application User ID.
- `Role`: `targetId` يساوي `Admin` أو `Teacher` أو `Student`؛ Admin فقط.
- `Class`: `targetId` هو Class ID.
- `SchoolGrade`: `targetId` هو SchoolGrade ID؛ Admin فقط.
- `Subject`: `targetId` هو Subject ID.
- `All`: Admin فقط، ويجب عدم إرسال `targetId`.

### الصلاحيات

- Admin يستهدف كل الأنواع.
- Teacher يستهدف `User`, `Class`, `Subject` فقط.
- Teacher لا يستطيع استهداف طالب خارج فصوله.
- Teacher لا يستطيع استهداف فصل غير مسند له.
- Teacher مع `Subject` يصل فقط لطلاب تقاطع المادة والفصول المسندة له.
- Student لا يستطيع الإرسال.
- المستلمون يُحددون داخل backend، وليس من قائمة يرسلها frontend.

### الأخطاء

- `400`: body غير صالح، target بلا مستخدمين، role غير صحيح، أو targetId غير رقمي عند الحاجة.
- `403`: Teacher يحاول target خارج صلاحياته.
- `404`: المستخدم أو الفصل أو المرحلة أو المادة غير موجودة.
- `401`: token مفقود أو غير صالح.

### ملاحظات frontend

- أنشئ `Idempotency-Key` جديدًا لكل ضغطة إرسال، واحتفظ به عند retry لنفس العملية.
- أرسل enum strings بنفس الكتابة الموضحة.
- لا تعرض `Role`, `SchoolGrade`, `All` داخل شاشة إرسال Teacher.

## سجل تحقق Phase 3

- Recipient resolution مربوط بعلاقات Student/Class/TeacherClass/TeacherSubject/ClassSubjects.
- إنشاء الإشعار والمستلمين داخل transaction واحدة.
- Validation tests أضيفت للـ target rules.
- Release API smoke test: Admin login، inbox، unread count، وauthorization route نجحوا.
- إجمالي automated tests بعد المرحلة: 10 passed، 0 failed.

## Phase 4 — الإشعارات التلقائية الأساسية

الـ frontend لا يرسل هذه الإشعارات. الـ backend ينشئها تلقائيًا داخل نفس transaction الخاصة بتغيير البيانات.

### الدرجات

- إنشاء Grade يولد `GradeAdded` للطالب.
- تعديل Grade يولد `GradeUpdated` للطالب.
- `relatedEntityType`: `StudentGrade`.
- `relatedEntityId`: Grade ID.

### الحضور

- إنشاء أو تعديل Attendance يولد `AttendanceRecorded` للطالب.
- الحالة `Absent` ترفع الأولوية إلى `High`، وباقي الحالات `Normal`.
- `relatedEntityType`: `Attendance`.
- `relatedEntityId`: Attendance ID.

### نقل الطالب

- تغيير `ClassId` للطالب يولد `ClassAssigned` للطالب.
- عدم تغيير الفصل لا يولد إشعارًا.
- الطالب غير المرتبط بـ Application User لا يسبب فشل العملية ولا يملك inbox لإرسال الإشعار إليه.

### تعيينات المدرس

- إضافة `TeacherClass` تولد `ClassAssigned` للمدرس.
- إضافة `TeacherSubject` تولد `SubjectAssigned` للمدرس.
- المدرس غير المرتبط بـ Application User لا يسبب فشل عملية التعيين.

### ضمان الاتساق

- تغيير business data وإنشاء notification recipients داخل transaction واحدة.
- فشل حفظ الإشعار يرجع تغيير البيانات الأساسي أيضًا.
- `EventKey` يمنع تكرار نفس الحدث عند retry.
- publisher يزيل user IDs المكررة والفارغة قبل الإنشاء.

### تعامل frontend

- بعد تنفيذ عملية Grade/Attendance/Assignment بنجاح، المستلم يجد الإشعار من Inbox API.
- لا تعتمد على نص الرسالة لتحديد الشاشة؛ استخدم `type`, `relatedEntityType`, `relatedEntityId`.
- SignalR غير مضاف حتى Phase 7؛ حاليًا استخدم refresh أو polling للـ inbox/unread count.

## سجل تحقق Phase 4

- Release build: Passed، 0 warnings، 0 errors.
- Automated tests: 12 passed، 0 failed.
- Publisher tests تغطي deduplication، تجاهل recipients الفارغة، وعدم عمل commit داخلي، ومنع تكرار EventKey.
- Release smoke test: API startup، database migration check، Admin login، وInbox query نجحوا.

## Phase 5 — Timetable وRole Events

### تغييرات الجدول

- إنشاء Timetable يولد `ScheduleChanged` بعنوان إضافة حصة.
- تعديل Timetable يولد `ScheduleChanged` لكل المتأثرين قبل وبعد التعديل.
- حذف Timetable يولد `ScheduleChanged` قبل حذف الحصة.
- المستلمون هم طلاب الفصل والمدرسون المرتبطون بنفس الفصل والمادة معًا.
- الأولوية `High`.
- `relatedEntityType`: `Timetable`.
- `relatedEntityId`: Timetable ID.

عند نقل الحصة لفصل أو مادة أخرى، الطلاب والمدرسون في الجدول القديم والجديد يستقبلون إشعار التغيير.

### تغييرات الأدوار

- تعيين Role يولد `RoleChanged` للمستخدم.
- إزالة Role تولد `RoleChanged` للمستخدم.
- النص يوضح اسم Role الجديد أو المحذوف.
- `relatedEntityType`: `ApplicationUser`.
- `relatedEntityId`: Application User ID.

### المستخدم المنتظر Role

- نجاح `POST /api/Auth/Register` يولد `UserPendingRole` لكل Admin.
- الأولوية `High`.
- يمكن للواجهة فتح شاشة المستخدمين المنتظرين باستخدام `relatedEntityId`.

### الاتساق

- تغييرات Timetable والإشعارات داخل transaction واحدة.
- تغييرات Identity/Profile والإشعارات داخل transaction واحدة باستخدام نفس scoped DbContext.
- فشل notification write يعمل rollback للعملية المرتبطة.

### تعامل frontend

- `ScheduleChanged`: أعد تحميل timetable المناسب باستخدام `relatedEntityId` أو شاشة الجدول العامة.
- `RoleChanged`: حدّث حالة الحساب والصلاحيات. قد يحتاج المستخدم login جديد للحصول على JWT بأحدث Role.
- `UserPendingRole`: يظهر للـ Admin ويربط بشاشة user management.

## سجل تحقق Phase 5

- Release build: Passed، 0 warnings، 0 errors.
- Automated contract test أضيف لقيم `ScheduleChanged`, `RoleChanged`, `UserPendingRole`.
- Automated tests: 13 passed، 0 failed.
- Release smoke test: Auth login، Timetable GET، وAdmin pending-users endpoint نجحوا.

## Phase 6 — Outbox Reliability

هذه المرحلة backend-only ولا تغير شكل Notification API المستخدم في frontend.

### ما تغير

- كل إشعار جديد يكتب `NotificationCreated` داخل `OutboxMessages` في نفس transaction.
- فشل حفظ Outbox يعمل rollback للإشعار وللعملية الأساسية المرتبطة.
- worker يفحص الرسائل المستحقة على batches من 20 رسالة كل 5 ثوانٍ.
- كل رسالة تحصل على lock لمدة دقيقة لمنع معالجتها بالتوازي من أكثر من API instance.
- النجاح يسجل `ProcessedAtUtc`.
- الفشل يستخدم exponential retry: 2، 4، 8، 16، 32 ثانية.
- بعد 5 محاولات تنتقل الرسالة إلى dead-letter ولا توقف باقي الرسائل.
- رسالة الخطأ تحفظ بحد أقصى 2000 حرف بدون بيانات حساسة إضافية.

### Startup safety

- migrations وrole/admin seeding أصبحت awaited قبل بدء HTTP traffic والـ background workers.
- أزيل fire-and-forget `Task.Run` الذي كان يسمح ببدء التطبيق قبل اكتمال تهيئة قاعدة البيانات.

### أثر المرحلة على frontend

- لا endpoints جديدة.
- Inbox يظل مصدر الحقيقة.
- المرحلة تجهز delivery موثوق لـ SignalR في Phase 7.
- فشل delivery الخارجي مستقبلًا لن يحذف الإشعار المحفوظ من Inbox.

## سجل تحقق Phase 6

- Migration `AddNotificationOutbox` generated, reviewed, and applied.
- Release build: Passed، 0 warnings، 0 errors.
- Automated tests: 19 passed، 0 failed.
- Tests تغطي outbox payload، الكتابة مع notification، وbounded exponential retry.
- Release smoke test: awaited migration، API startup، Admin login، وتشغيل worker لعدة دورات بدون أخطاء.

## Phase 7 — SignalR Realtime Notifications

### Hub

```text
/hubs/notifications
```

- الاتصال يتطلب JWT صالح.
- SignalR WebSocket يرسل token عبر `access_token` تلقائيًا باستخدام `accessTokenFactory`.
- هوية الاتصال مبنية على `ClaimTypes.NameIdentifier` الموجود في JWT؛ المستخدم يستقبل رسائله فقط.

### Events

`NotificationCreated` يرجع نفس شكل item داخل Inbox API:

```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "title": "Grade updated",
  "message": "Your grade was updated.",
  "type": "GradeUpdated",
  "priority": "Normal",
  "createdAtUtc": "2026-09-28T12:00:00Z",
  "expiresAtUtc": null,
  "relatedEntityType": "StudentGrade",
  "relatedEntityId": "15",
  "isRead": false,
  "readAtUtc": null
}
```

`UnreadCountChanged`:

```json
{ "count": 4 }
```

### React connection example

ثبت `@microsoft/signalr` ثم أنشئ connection واحدة بعد login:

```ts
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${apiBaseUrl}/hubs/notifications`, {
    accessTokenFactory: () => accessToken,
  })
  .withAutomaticReconnect()
  .build();

connection.on("NotificationCreated", notification => {
  // prepend notification to current inbox state
});

connection.on("UnreadCountChanged", ({ count }) => {
  // update notification badge
});

await connection.start();
```

### Reconnect behavior

- SignalR تحسين لحظي، وليس مصدر الحقيقة.
- بعد `onreconnected` أعد طلب أول صفحة من `/api/notifications` و`/unread-count`.
- عند logout نفذ `connection.stop()`.
- لا تنشئ connection جديدة مع كل render.

### Delivery flow

```text
Business transaction -> Notification + Outbox -> commit -> Outbox worker -> SignalR user connection
```

فشل SignalR يعمل retry عبر Outbox، والإشعار يظل محفوظًا في Inbox لو المستخدم offline.

## سجل تحقق Phase 7

- Release build: Passed، 0 warnings، 0 errors.
- Automated tests: 21 passed، 0 failed.
- Contract tests تغطي `[Authorize]` وأسماء وأشكال client events.
- SignalR negotiation بدون token رجع 401.
- SignalR negotiation مع JWT query token رجع 200.
- transports المتاحة: WebSockets، ServerSentEvents، LongPolling.

## Phase 8 — Scheduling وReminders

### إنشاء إشعار مجدول

استخدم نفس endpoint الإرسال وأضف `scheduledAtUtc`:

```http
POST /api/notifications/send
Idempotency-Key: schedule-lesson-2026-10-01-class-3
```

```json
{
  "title": "Lesson reminder",
  "message": "Math lesson starts in 15 minutes.",
  "type": "LessonReminder",
  "priority": "High",
  "targetType": "Class",
  "targetId": "3",
  "scheduledAtUtc": "2026-10-01T08:45:00Z",
  "expiresAtUtc": "2026-10-01T09:30:00Z"
}
```

Response:

```json
{
  "notificationId": "11111111-1111-1111-1111-111111111111",
  "recipientCount": 25,
  "wasDuplicate": false,
  "status": "Scheduled",
  "scheduledAtUtc": "2026-10-01T08:45:00Z"
}
```

بدون `scheduledAtUtc` تكون `status` مساوية `Published` ويُرسل الإشعار فورًا.

### إلغاء إشعار مجدول

```http
DELETE /api/notifications/{notificationId}/cancel
```

- Admin يستطيع إلغاء أي إشعار مجدول.
- Teacher يستطيع إلغاء إشعار أنشأه بنفسه فقط.
- النجاح: `204 No Content`.
- غير موجود، منشور بالفعل، ملغي، أو غير مملوك للمدرس: `404 Not Found`.

### قواعد الوقت

- `scheduledAtUtc` يجب أن يكون في المستقبل.
- `expiresAtUtc` يجب أن يكون في المستقبل.
- موعد النشر لا يتجاوز موعد الانتهاء.
- جميع القيم UTC بصيغة ISO 8601 وتنتهي بـ `Z`.

### سلوك النشر

- المستلمون يتحددون ويحفظون وقت إنشاء الإشعار؛ تغيير الفصل أو Role لاحقًا لا يغير الجمهور المجدول.
- scheduler يفحص كل 15 ثانية وينشر 20 إشعارًا في الدفعة.
- update ذري من `Scheduled` إلى `Published` يمنع النشر المكرر عند تشغيل أكثر من API instance.
- بعد النشر ينشأ Outbox event، ثم يصل SignalR ويظهر الإشعار في Inbox.
- الإشعار المنتهي قبل النشر يتحول إلى `Expired` ولا يرسل.
- الإشعار الملغي يتحول إلى `Cancelled` ولا يرسل.

### Reminders

- `LessonReminder` مدعوم كنوع إشعار مجدول.
- لا يوجد Exam entity حاليًا؛ تذكير الامتحان يمكن إرساله كـ `Announcement` مجدول حتى إضافة Exam feature.

## سجل تحقق Phase 8

- Migration `AddScheduledNotificationIndex` generated, reviewed, and applied.
- Release build: Passed، 0 warnings، 0 errors.
- Automated tests: 23 passed، 0 failed.
- Tests تغطي موعدًا بعد expiry ونافذة scheduling صحيحة.
- Release smoke test: scheduler worker اشتغل، تاريخ سابق رجع 400، وإلغاء ID غير موجود رجع 404.
