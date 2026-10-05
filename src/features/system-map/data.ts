export type Language = "en" | "ar";
export type Role = "Admin" | "Teacher" | "Student";
export type LocalText = { en: string; ar: string };
export const copy = (en: string, ar: string): LocalText => ({ en, ar });

export const roles: {
  id: Role;
  name: LocalText;
  verb: LocalText;
  description: LocalText;
  color: string;
}[] = [
  {
    id: "Admin",
    name: copy("Admin", "الإدارة"),
    verb: copy("Build the foundation", "تجهز الأساس"),
    description: copy(
      "Connect the people, places and lessons that make a school work.",
      "تربط الأشخاص والفصول والمواد لتبدأ المدرسة العمل.",
    ),
    color: "#91e6c4",
  },
  {
    id: "Teacher",
    name: copy("Teacher", "المدرس"),
    verb: copy("Bring learning to life", "يبدأ رحلة التعلم"),
    description: copy(
      "Work with assigned classes and help students see their progress.",
      "يتابع الفصول المسندة إليه ويساعد الطالب على معرفة تقدمه.",
    ),
    color: "#c6b0f4",
  },
  {
    id: "Student",
    name: copy("Student", "الطالب"),
    verb: copy("Follow your own journey", "يتابع رحلته"),
    description: copy(
      "Discover your profile, attendance, grades and messages in one place.",
      "يتابع ملفه وحضوره ودرجاته ورسائله من مكان واحد.",
    ),
    color: "#f6b27b",
  },
];

export type Stage = {
  id: string;
  name: LocalText;
  kicker: LocalText;
  description: LocalText;
  actor: Role;
  visibleTo: Role[];
  requires: string[];
  requirement: LocalText;
  output: LocalText;
  detail: LocalText;
  x: number;
  y: number;
  kind: string;
};
export const stages: Stage[] = [
  {
    id: "access",
    name: copy("A place for everyone", "لكل شخص مكان"),
    kicker: copy("Accounts & roles", "الحسابات والأدوار"),
    description: copy(
      "Every journey begins with an account. The admin assigns a role, opening the right workspace for each person.",
      "تبدأ الرحلة بحساب، ثم تعيّن الإدارة دوره ليدخل كل شخص إلى مساحة العمل المناسبة.",
    ),
    actor: "Admin",
    visibleTo: ["Admin", "Teacher", "Student"],
    requires: [],
    requirement: copy(
      "A registered account. Until a role is assigned, the account stays pending.",
      "حساب مسجل. يظل الحساب في الانتظار حتى تعيّن الإدارة دوره.",
    ),
    output: copy(
      "A clear identity and access to the right workspace.",
      "هوية واضحة ودخول إلى مساحة العمل المناسبة.",
    ),
    detail: copy(
      "Pending is an account state, not a fourth role. Today there are three roles: Admin, Teacher and Student.",
      "الانتظار حالة للحساب وليس دورًا رابعًا. الأدوار الحالية: إدارة ومدرس وطالب.",
    ),
    x: 18,
    y: 35,
    kind: "gate",
  },
  {
    id: "school",
    name: copy("The school takes shape", "المدرسة تأخذ شكلها"),
    kicker: copy("People & connections", "الأشخاص والعلاقات"),
    description: copy(
      "The admin creates classes, subjects, rooms and time slots. Students join classes; teachers connect to classes and subjects.",
      "تجهز الإدارة الفصول والمواد والقاعات والفترات، ثم تربط الطلاب بالفصول والمدرسين بالفصول والمواد.",
    ),
    actor: "Admin",
    visibleTo: ["Admin", "Teacher"],
    requires: ["access"],
    requirement: copy(
      "Accounts with assigned roles, plus the school’s classes and subjects.",
      "حسابات بأدوار محددة، مع الفصول والمواد الدراسية.",
    ),
    output: copy(
      "Connected classes, students, teachers and subjects.",
      "فصول مرتبطة بطلابها ومدرسيها وموادها.",
    ),
    detail: copy(
      "These connections matter: assigning a teacher to a class defines which class attendance they can view.",
      "هذه العلاقات مهمة: إسناد الفصل إلى المدرس يحدد سجلات الحضور التي يمكنه الاطلاع عليها.",
    ),
    x: 49,
    y: 23,
    kind: "school",
  },
  {
    id: "schedule",
    name: copy("Everything has its time", "لكل حصة وقت"),
    kicker: copy("The timetable", "الجدول الدراسي"),
    description: copy(
      "The admin brings a class, teacher, subject, room and time slot together in a scheduled lesson.",
      "تجمع الإدارة الفصل والمدرس والمادة والقاعة والفترة الزمنية في حصة منظمة.",
    ),
    actor: "Admin",
    visibleTo: ["Admin", "Teacher", "Student"],
    requires: ["school"],
    requirement: copy(
      "A connected class, teacher and subject; an available room and time slot.",
      "فصل ومدرس ومادة مرتبطون، وقاعة وفترة زمنية.",
    ),
    output: copy(
      "Lessons with a defined time, place and teacher.",
      "حصص بوقت ومكان ومدرس محددين.",
    ),
    detail: copy(
      "The timetable depends on the school structure. It describes when learning happens; it does not create attendance records.",
      "يعتمد الجدول على تجهيز المدرسة. يحدد موعد التعلم، ولا ينشئ سجلات حضور تلقائيًا.",
    ),
    x: 80,
    y: 35,
    kind: "clock",
  },
  {
    id: "teaching",
    name: copy("Learning leaves a trace", "التعلم يترك أثرًا"),
    kicker: copy("Attendance & grades", "الحضور والدرجات"),
    description: copy(
      "Teachers view attendance for their assigned classes and use grade tools subject to their assigned permissions.",
      "يعرض المدرس حضور فصوله ويستخدم أدوات الدرجات وفق الصلاحيات المسندة إليه.",
    ),
    actor: "Teacher",
    visibleTo: ["Admin", "Teacher"],
    requires: ["school"],
    requirement: copy(
      "The teacher’s class and subject assignments, and students linked to those classes.",
      "إسناد الفصول والمواد للمدرس، وربط الطلاب بهذه الفصول.",
    ),
    output: copy(
      "Academic records that students can follow in their personal views.",
      "سجلات دراسية يتابعها الطالب في صفحاته الشخصية.",
    ),
    detail: copy(
      "View assigned-class attendance today. A dedicated teacher recording screen is planned. Teachers cannot delete attendance records. Grade tools follow assigned permissions.",
      "عرض حضور الفصول المسندة متاح الآن. شاشة التسجيل المخصصة للمدرس مخططة. لا يحذف المدرس سجلات الحضور. أدوات الدرجات تتبع الصلاحيات المسندة.",
    ),
    x: 78,
    y: 72,
    kind: "classroom",
  },
  {
    id: "student",
    name: copy("Progress becomes personal", "رحلة تخص الطالب"),
    kicker: copy("The student workspace", "مساحة الطالب"),
    description: copy(
      "The student sees their own profile, attendance and grades. School records become a personal picture of progress.",
      "يرى الطالب ملفه وحضوره ودرجاته، فتتحول سجلات المدرسة إلى صورة واضحة عن تقدمه.",
    ),
    actor: "Student",
    visibleTo: ["Student"],
    requires: ["access", "school"],
    requirement: copy(
      "A student account linked to its profile. Attendance and grades appear as records are added; an empty history is normal at first.",
      "حساب طالب مرتبط بملفه. يظهر الحضور والدرجات عند إضافة السجلات؛ من الطبيعي أن يبدأ السجل فارغًا.",
    ),
    output: copy(
      "A private view of the student’s own learning journey.",
      "عرض شخصي لرحلة الطالب الدراسية.",
    ),
    detail: copy(
      "Students read their own records. They do not change grades, edit attendance or manage other students.",
      "يطلع الطالب على سجلاته فقط، ولا يغير الدرجات أو يعدل الحضور أو يدير طلابًا آخرين.",
    ),
    x: 47,
    y: 81,
    kind: "library",
  },
  {
    id: "connect",
    name: copy("The whole picture", "الصورة تكتمل"),
    kicker: copy("Reports & messages", "التقارير والتواصل"),
    description: copy(
      "Admins follow the school through reports. Authorized senders share targeted messages, and each recipient reads their own notifications.",
      "تتابع الإدارة المدرسة عبر التقارير. يرسل المخولون رسائل موجهة ويقرأ كل مستلم إشعاراته.",
    ),
    actor: "Admin",
    visibleTo: ["Admin", "Teacher", "Student"],
    requires: ["teaching", "student"],
    requirement: copy(
      "Academic records for reports; an allowed audience for a message.",
      "سجلات دراسية للتقارير، ونطاق مستلمين مسموح به للرسالة.",
    ),
    output: copy(
      "School-wide insight and communication that reaches the right people.",
      "رؤية شاملة للمدرسة وتواصل يصل إلى الأشخاص المعنيين.",
    ),
    detail: copy(
      "Sending notifications is a separate action. A new grade or attendance record does not automatically mean a notification is sent. Teachers send only within their allowed scope.",
      "إرسال الإشعارات عملية مستقلة؛ إضافة درجة أو حضور لا تعني إرسال إشعار تلقائيًا. يرسل المدرس ضمن نطاقه المسموح فقط.",
    ),
    x: 18,
    y: 71,
    kind: "tower",
  },
];

export type StoryBeat = {
  stage: string;
  actor: Role;
  title: LocalText;
  text: LocalText;
  handoff: LocalText;
  planned?: boolean;
};
export const story: StoryBeat[] = [
  {
    stage: "school",
    actor: "Admin",
    title: copy(
      "First, a class becomes a community.",
      "أولًا، الفصل يصبح مجتمعًا.",
    ),
    text: copy(
      "The admin connects a class, its students, a teacher and a subject. Now everyone has a place in the school.",
      "تربط الإدارة الفصل بطلابه ومدرسه ومادته، فيصبح لكل شخص مكان واضح في المدرسة.",
    ),
    handoff: copy("Admin → school foundation", "الإدارة ← تجهيز المدرسة"),
  },
  {
    stage: "schedule",
    actor: "Admin",
    title: copy("Give that community a rhythm.", "ثم يصبح لليوم إيقاع."),
    text: copy(
      "A lesson gets a time and a room. The teacher and students now share an organized school day.",
      "تحدد الإدارة وقت الحصة وقاعتها، ليصبح للمدرس والطلاب يوم دراسي منظم.",
    ),
    handoff: copy("School foundation → timetable", "تجهيز المدرسة ← الجدول"),
  },
  {
    stage: "student",
    actor: "Student",
    title: copy(
      "A student’s view starts with someone else’s work.",
      "ما يراه الطالب يبدأ بعمل شخص آخر.",
    ),
    text: copy(
      "The student can read a personal attendance record only after it has been created. This is a data dependency, not an approval queue.",
      "يستطيع الطالب قراءة حضوره بعد إنشاء السجل. هذا اعتماد على وجود البيانات، وليس انتظار موافقة داخل النظام.",
    ),
    handoff: copy(
      "Student → needs an attendance record",
      "الطالب ← يحتاج سجل حضور",
    ),
  },
  {
    stage: "teaching",
    actor: "Teacher",
    title: copy(
      "The teacher connects the next step.",
      "المدرس يكمل الخطوة التالية.",
    ),
    text: copy(
      "Teachers can already view their classes’ attendance. A dedicated recording screen is a next chapter; once a record exists, the student can see it.",
      "يستطيع المدرس الآن عرض حضور فصوله. شاشة التسجيل المخصصة مرحلة لاحقة؛ وعندما يوجد السجل يراه الطالب.",
    ),
    handoff: copy(
      "Teacher’s class records → student view",
      "سجلات فصل المدرس ← عرض الطالب",
    ),
    planned: true,
  },
  {
    stage: "teaching",
    actor: "Teacher",
    title: copy(
      "A result becomes visible progress.",
      "النتيجة تتحول إلى تقدم واضح.",
    ),
    text: copy(
      "The teacher uses grade tools within assigned permissions. Recorded results appear in the student’s personal grades view.",
      "يستخدم المدرس أدوات الدرجات ضمن صلاحياته، وتظهر النتائج المسجلة في صفحة درجات الطالب.",
    ),
    handoff: copy("Teacher → student’s grades", "المدرس ← درجات الطالب"),
  },
  {
    stage: "connect",
    actor: "Teacher",
    title: copy(
      "The right message finds the right people.",
      "الرسالة تصل إلى أصحابها.",
    ),
    text: copy(
      "An authorized teacher sends a message to an allowed audience. The student receives it in notifications. Sending is an independent action.",
      "يرسل المدرس المخول رسالة إلى نطاقه المسموح، ويستقبلها الطالب في الإشعارات. الإرسال عملية مستقلة.",
    ),
    handoff: copy(
      "Authorized sender → recipients",
      "المرسل المخول ← المستلمون",
    ),
  },
  {
    stage: "connect",
    actor: "Admin",
    title: copy(
      "And the whole school comes into focus.",
      "وأخيرًا، تظهر صورة المدرسة كاملة.",
    ),
    text: copy(
      "The admin follows the wider picture through reports. Teaching, progress and communication continue through the school year.",
      "تتابع الإدارة الصورة العامة عبر التقارير، وتتكرر رحلة التعليم والمتابعة والتواصل طوال العام.",
    ),
    handoff: copy(
      "Daily work → school-wide insight",
      "العمل اليومي ← رؤية المدرسة",
    ),
  },
];

export const permissions = [
  {
    name: copy("Accounts & roles", "الحسابات والأدوار"),
    values: [copy("Manage", "إدارة"), copy("—", "—"), copy("—", "—")],
    detail: copy(
      "Admin assigns roles. An account without a role remains pending.",
      "تعيّن الإدارة الأدوار. الحساب بلا دور يبقى في الانتظار.",
    ),
  },
  {
    name: copy("School structure", "هيكل المدرسة"),
    values: [
      copy("Manage", "إدارة"),
      copy("Assigned work", "العمل المسند"),
      copy("Personal view", "عرض شخصي"),
    ],
    detail: copy(
      "Admin manages classes, subjects, rooms and relationships. Other roles see the information available within their workspaces.",
      "تدير الإدارة الفصول والمواد والقاعات والعلاقات. تعرض الأدوار الأخرى المعلومات المتاحة في مساحاتها.",
    ),
  },
  {
    name: copy("Attendance", "الحضور"),
    values: [
      copy("Manage & delete", "إدارة وحذف"),
      copy("View class records", "عرض حضور الفصول"),
      copy("Own records", "سجلاته فقط"),
    ],
    detail: copy(
      "Teachers view attendance for assigned classes. A dedicated recording screen is planned. Teachers cannot delete attendance records.",
      "يعرض المدرس حضور فصوله المسندة. شاشة التسجيل المخصصة مخططة. لا يحذف المدرس سجلات الحضور.",
    ),
  },
  {
    name: copy("Grades", "الدرجات"),
    values: [
      copy("Manage", "إدارة"),
      copy("Assigned permissions", "حسب الصلاحيات"),
      copy("Own grades", "درجاته فقط"),
    ],
    detail: copy(
      "Teachers use grade tools according to their assigned permissions. Students see their own grades.",
      "يستخدم المدرس أدوات الدرجات وفق صلاحياته المسندة. يرى الطالب درجاته فقط.",
    ),
  },
  {
    name: copy("General reports", "التقارير العامة"),
    values: [copy("View", "عرض"), copy("—", "—"), copy("—", "—")],
    detail: copy(
      "School-wide reports belong to the admin workspace.",
      "التقارير الشاملة متاحة ضمن مساحة الإدارة.",
    ),
  },
  {
    name: copy("Notifications", "الإشعارات"),
    values: [
      copy("Send & receive", "إرسال واستقبال"),
      copy("Allowed audience", "النطاق المسموح"),
      copy("Receive & read", "استقبال وقراءة"),
    ],
    detail: copy(
      "Messages are targeted actions. Recording attendance or grades does not imply automatic notification delivery.",
      "الرسائل عمليات موجهة ومستقلة. تسجيل الحضور أو الدرجات لا يعني إرسال إشعار تلقائيًا.",
    ),
  },
];
