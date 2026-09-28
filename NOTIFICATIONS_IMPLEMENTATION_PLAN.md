# Notifications Frontend Implementation Plan

## الهدف

استبدال نظام الإشعارات المحلي الحالي بالكامل بنظام الـ backend، مع جعل REST Inbox مصدر الحقيقة، وإضافة الإرسال، الجدولة، وSignalR على مراحل مستقلة. لا تُدمج أي مرحلة إلا بعد نجاح اختبارات الكود والـ UI، ثم commit مستقل.

## قواعد التنفيذ

- العمل على branch مخصص، وليس `main` مباشرة.
- قبل كل مرحلة: مراجعة contract الحي مع backend.
- بعد كل مرحلة: tests ثم `pnpm lint` ثم `pnpm build` ثم فحص UI على desktop/mobile وlight/dark.
- لا commit عند وجود test فاشل.
- كل commit يحتوي ملفات مرحلته فقط.
- ملفا Postman والشرح الحاليان يظلان خارج commits إلا لو طُلب ضمهما.
- REST Inbox مصدر الحقيقة؛ SignalR تحسين لحظي فقط.

## المرحلة 0: تثبيت العقد وتجهيز الاختبارات

### التنفيذ

- اختبار endpoints الحية بحساب Admin وTeacher وStudent.
- تأكيد casing، query parameters، response bodies، status codes، الأخطاء، enum values، وJWT.
- تأكيد عنوان SignalR، CORS، ونجاح negotiate بالـ token.
- إضافة Vitest وReact Testing Library وMSW لاختبارات الوحدات والتكامل.
- إضافة Playwright لاختبارات المتصفح الأساسية إن كانت البيئة مناسبة.
- إنشاء fixtures مطابقة لعقد الإشعارات.

### نقاط يلزم حسمها

- Postman يسجل responses عامة `200` بينما الدليل يحدد `204` و`201` في عدة عمليات؛ نعتمد نتيجة backend الحية.
- Postman يستخدم `Authorization` كـ API key، بينما الدليل يطلب JWT Bearer؛ نتحقق عمليًا.
- `/api/Notifications` في Postman مقابل `/api/notifications` في الدليل.
- هل يوجد endpoint يعرض الإشعارات المجدولة للمرسل؟ بدونه لا يمكن بناء شاشة إدارة وجدولة كاملة.

### التحقق

- Contract tests لكل endpoint وحالات 400/401/403/404.
- `pnpm test`, `pnpm lint`, `pnpm build`.

### Commit

`Test: add notification contract test foundation`

## المرحلة 1: Inbox الأساسي وجرس الإشعارات

### التنفيذ

- حذف اشتقاق الإشعارات من grades/attendance وحذف `localStorage` seen IDs.
- تعريف types كاملة: item، page، filters، unread count، type، priority.
- إضافة RTK Query endpoints:
  - list
  - unread count
  - read one
  - read all
  - delete
- إضافة `Notification` tags وتحديث optimistic مع rollback.
- إعادة بناء الجرس:
  - badge رقمي و`99+`.
  - loading، empty، error، retry.
  - قراءة عنصر واحد عند فتحه.
  - زر Read all مستقل.
  - حذف من inbox.
  - وقت محلي من UTC.
  - ألوان وأيقونات حسب type وpriority.
  - keyboard، focus، وARIA.
- استخدام load more داخل القائمة بدل تحميل كل الصفحات.

### الملفات الأساسية

- `src/features/notifications/types.ts`
- `src/features/notifications/api.ts`
- `src/features/notifications/hooks/useNotifications.ts`
- `src/features/notifications/components/NotificationBell.tsx`
- مكونات item/skeleton الجديدة
- `src/constants/api-endpoints.ts`
- `src/store/baseApi.ts`

### التحقق

- اختبارات query mapping، badge، read، read-all، delete، optimistic rollback.
- فحص Admin/Teacher/Student.
- فحص mobile/desktop وlight/dark.
- lint، tests، build.

### Commit

`Feat: connect notification inbox to backend`

## المرحلة 2: صفحة Inbox كاملة

### التنفيذ

- إضافة `/notifications` لكل الأدوار.
- pagination وfilters: `isRead`, `type`, `priority`.
- حفظ الفلاتر والصفحة في URL search params.
- loading، empty، error، retry، read، read-all، delete.
- ربط “View all” من الجرس.
- navigation حسب `relatedEntityType` و`relatedEntityId` فقط، مع fallback آمن.
- `UserPendingRole` يفتح إدارة المستخدمين للـ Admin.
- `RoleChanged` يعرض تنبيه لإعادة login عند الحاجة.

### التحقق

- اختبارات pagination، filters، URL state، entity routing، وكل UI states.
- اختبار back/forward، mobile overflow، keyboard، وscreen reader labels.
- lint، tests، build.

### Commit

`Feat: add searchable notifications inbox`

## المرحلة 3: الإرسال اليدوي حسب الدور

### التنفيذ

- صفحة/form إرسال بـ React Hook Form وZod.
- Admin: User، Role، Class، SchoolGrade، Subject، All.
- Teacher: User، Class، Subject فقط ضمن صلاحياته.
- Student: لا route ولا action للإرسال.
- تحميل خيارات targets من APIs الموجودة بدل إدخال IDs عشوائيًا.
- إنشاء `Idempotency-Key` واحد للعملية، وإعادة استخدامه في retry، وتغييره بعد النجاح أو بدء draft جديد.
- تعديل Next proxy لتمرير `Idempotency-Key` فقط ضمن headers مسموحة.
- عرض نتيجة recipient count وduplicate بوضوح.

### ملاحظة تقنية

الـ proxy الحالي لا يمرر `Idempotency-Key`؛ الإرسال لن يكون صحيحًا قبل إصلاحه.

### التحقق

- اختبارات role matrix، validation، payload، idempotency retry/reset، وأخطاء 400/403/404.
- اختبار proxy header.
- فحص UI بالحسابات الثلاثة.
- lint، tests، build.

### Commit

`Feat: add role-aware notification sending`

## المرحلة 4: الجدولة والإلغاء

### التنفيذ

- وضع immediate أو scheduled داخل form.
- تحويل local datetime إلى UTC ISO 8601 ينتهي بـ `Z`.
- validation للمستقبل، expiry، وترتيب scheduled/expiry.
- عرض status وscheduled time بعد الإرسال.
- إضافة cancel حسب صلاحيات Admin/Teacher.
- إذا لم يوجد endpoint لعرض scheduled notifications: لا نبني قائمة وهمية؛ نطلب endpoint أو نحصر الإلغاء في receipt الحالي مؤقتًا.

### التحقق

- اختبارات timezone وDST وvalidation وcancel و404 والصلاحيات.
- فحص schedule/cancel حيًا.
- lint، tests، build.

### Commit

`Feat: add notification scheduling controls`

## المرحلة 5: SignalR realtime

### التنفيذ

- تثبيت `@microsoft/signalr`.
- connection واحدة طوال الجلسة بعد login.
- اتصال مباشر بعنوان backend `/hubs/notifications`؛ Next Route Handler الحالي ليس WebSocket proxy.
- تمرير JWT عبر `accessTokenFactory`.
- تسجيل handlers قبل `start`.
- `NotificationCreated`: prepend/upsert بدون duplicate.
- `UnreadCountChanged`: تحديث badge من القيمة القادمة من backend.
- `onreconnected`: refetch أول صفحة وunread count.
- stop عند logout/unmount.
- REST يظل fallback؛ فشل realtime لا يكسر Inbox.
- تنظيف token المحلي عند logout و401، بدون تسجيله في logs.

### التحقق

- اختبارات mock للاتصال الواحد، events، reconnect، deduplication، وstop عند logout.
- اختبار متصفحين: مرسل ومستلم.
- اختبار offline ثم reconnect.
- lint، tests، build.

### Commit

`Feat: add realtime notification delivery`

## المرحلة 6: Hardening واختبارات الرحلات الكاملة

### التنفيذ

- معالجة races بين realtime وread/delete/pagination.
- منع stale count وrefetch loops.
- فحص token expiry وexpired notifications.
- تحسين accessibility وreduced motion.
- حذف كل legacy notification code/comments/storage keys.
- توثيق architecture، env، وتشغيل الاختبارات.

### التحقق

- Playwright journeys للأدوار الثلاثة.
- responsive screenshots ومراجعة light/dark.
- `pnpm test`, `pnpm lint`, `pnpm build`.
- مراجعة `git diff` النهائي وعدم ضم ملفات خارج النطاق.

### Commit

`Test: harden notification workflows`

## GitHub workflow

- إنشاء branch مثل `feat/backend-notifications`.
- commit بعد نجاح كل مرحلة فقط.
- push للـ branch بعد كل commit إذا كان المطلوب تحديث GitHub مباشرة.
- عدم الدمج إلى `main` إلا بعد اكتمال المراحل المطلوبة ومراجعتها.

## متطلبات بدء التنفيذ

- backend يعمل من `NEXT_PUBLIC_BACKEND_URL`.
- بيانات دخول صالحة لـ Admin وTeacher وStudent.
- تأكيد هل المطلوب push بعد كل commit، أم local commits ثم push واحد.
- قرار هل manual send وscheduling داخل نفس نطاق التنفيذ الأول، أم بعد Inbox وSignalR.
