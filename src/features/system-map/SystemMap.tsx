"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  GraduationCap,
  Layers3,
  Maximize,
  Pause,
  Play,
  Plus,
  Minus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  Waypoints,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import {
  permissions,
  roles,
  stages,
  story,
  type Language,
  type LocalText,
  type Role,
} from "./data";
import s from "./SystemMap.module.css";

type SceneStyle = CSSProperties & {
  "--role-color"?: string;
  "--x"?: string;
  "--y"?: string;
  "--zoom"?: number;
  "--delay"?: string;
};
const roleIcon = {
  Admin: ShieldCheck,
  Teacher: BookOpen,
  Student: GraduationCap,
};
const initialPositions: Record<Role, [number, number]> = {
  Admin: [37, 48],
  Teacher: [63, 54],
  Student: [43, 65],
};
const workspaceLinks: Record<string, Partial<Record<Role, string>>> = {
  access: { Admin: ROUTES.ADMIN.USERS },
  school: { Admin: ROUTES.CLASSES.LIST, Teacher: ROUTES.TEACHER.MY_CLASSES },
  schedule: { Admin: ROUTES.TIMETABLES.LIST },
  teaching: {
    Admin: ROUTES.ATTENDANCES.LIST,
    Teacher: ROUTES.TEACHER.ATTENDANCES,
  },
  student: { Student: ROUTES.STUDENT.MY_PROFILE },
  connect: {
    Admin: ROUTES.REPORTS,
    Teacher: ROUTES.NOTIFICATIONS,
    Student: ROUTES.NOTIFICATIONS,
  },
};

function Figurine({ role, small = false }: { role: Role; small?: boolean }) {
  return (
    <span
      className={`${s.figurine} ${s[role.toLowerCase()]} ${small ? s.smallFigurine : ""}`}
      aria-hidden="true"
    >
      <span className={s.figureShadow} />
      <span className={s.legLeft} />
      <span className={s.legRight} />
      <span className={s.figureBody} />
      <span className={s.armLeft} />
      <span className={s.armRight} />
      <span className={s.figureHead}>
        <span className={s.hair} />
        <span className={s.eyes} />
      </span>
      <span className={s.figureProp} />
      {role === "Student" && <span className={s.backpack} />}
    </span>
  );
}

function Building({ kind }: { kind: string }) {
  return (
    <span className={`${s.building} ${s[kind]}`} aria-hidden="true">
      <span className={s.island} />
      <span className={s.buildingShadow} />
      <span className={s.sideWall} />
      <span className={s.frontWall}>
        <span className={s.windowRow}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.windowRow}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.door} />
      </span>
      <span className={s.roof} />
      <span className={s.roofTop} />
      <span className={s.buildingSign}>
        {kind === "gate" ? (
          <ShieldCheck />
        ) : kind === "clock" ? (
          <span className={s.clockFace} />
        ) : kind === "tower" ? (
          <span className={s.signal}>
            <i />
            <i />
            <i />
          </span>
        ) : kind === "classroom" ? (
          <BookOpen />
        ) : kind === "library" ? (
          <GraduationCap />
        ) : (
          <span className={s.schoolMark}>E</span>
        )}
      </span>
      <span className={s.steps} />
      <span className={s.planter} />
      <span className={s.flag} />
    </span>
  );
}

export function SystemMap() {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>("en");
  const [role, setRole] = useState<Role | "all">("all");
  const [selectedId, setSelectedId] = useState("school");
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    x: number;
    y: number;
    originX: number;
    originY: number;
  } | null>(null);
  const atlasRef = useRef<HTMLElement>(null);
  const t = (text: LocalText) => text[language];
  const label = (en: string, ar: string) => (language === "en" ? en : ar);
  const stage = stages.find((item) => item.id === selectedId) ?? stages[1];
  const stageIndex = stages.indexOf(stage);
  const beat = storyIndex === null ? null : story[storyIndex];
  const actor = beat?.actor ?? stage.actor;
  const actorData = roles.find((item) => item.id === actor)!;
  const selectedRole = roles.find((item) => item.id === role);
  const workspaceLink = user?.role
    ? workspaceLinks[stage.id]?.[user.role]
    : undefined;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playing || storyIndex === null) return;
    const timer = window.setTimeout(() => {
      if (storyIndex >= story.length - 1) {
        setPlaying(false);
        return;
      }
      const next = storyIndex + 1;
      setStoryIndex(next);
      setSelectedId(story[next].stage);
    }, 8500);
    return () => window.clearTimeout(timer);
  }, [playing, storyIndex]);

  const selectStage = (id: string) => {
    setPlaying(false);
    setStoryIndex(null);
    setSelectedId(id);
  };
  const jumpStory = (index: number) => {
    setPlaying(false);
    setRole("all");
    setStoryIndex(index);
    setSelectedId(story[index].stage);
  };
  const startStory = () => {
    setRole("all");
    setStoryIndex(0);
    setSelectedId(story[0].stage);
    setPlaying(!reducedMotion);
    atlasRef.current?.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth",
      block: "start",
    });
  };
  const chooseRole = (next: Role | "all") => {
    setRole(next);
    setPlaying(false);
    setStoryIndex(null);
    if (next !== "all")
      setSelectedId(
        next === "Admin"
          ? "school"
          : next === "Teacher"
            ? "teaching"
            : "student",
      );
  };
  const positions = { ...initialPositions };
  if (storyIndex !== null) {
    for (let i = 0; i <= storyIndex; i++) {
      const current = story[i];
      const destination = stages.find((item) => item.id === current.stage)!;
      positions[current.actor] = [
        destination.x + (current.actor === "Admin" ? -9 : 9),
        destination.y + 5,
      ];
    }
  } else if (role !== "all") positions[role] = [stage.x + 10, stage.y + 5];

  return (
    <div
      className={s.page}
      dir={language === "ar" ? "rtl" : "ltr"}
      lang={language}
    >
      <a href="#atlas" className={s.skipLink}>
        {label("Skip to interactive map", "انتقل إلى الخريطة التفاعلية")}
      </a>
      <header className={s.header}>
        <Link
          href={user ? ROUTES.DASHBOARD : ROUTES.AUTH.LOGIN}
          className={s.brand}
          aria-label="EduSystem"
        >
          <span className={s.brandMark}>
            <GraduationCap size={24} strokeWidth={1.6} />
          </span>
          <span>
            Edu<span className={s.brandAccent}>System</span>
          </span>
        </Link>
        <div className={s.headerLabel}>
          <span />
          {label("THE SYSTEM ATLAS", "أطلس النظام")}
        </div>
        <nav
          className={s.headerNav}
          aria-label={label("Page navigation", "تنقل الصفحة")}
        >
          <button
            className={s.language}
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            aria-label={label("Switch to Arabic", "Switch to English")}
          >
            {language === "en" ? "العربية" : "English"}
          </button>
          <Link
            className={s.enterLink}
            href={user ? ROUTES.DASHBOARD : ROUTES.AUTH.LOGIN}
          >
            {user
              ? label("Your dashboard", "لوحة التحكم")
              : label("Enter EduSystem", "ادخل إلى النظام")}
            <ArrowRight size={15} />
          </Link>
        </nav>
      </header>

      <main className={s.main}>
        <section className={s.intro} aria-labelledby="atlas-title">
          <div className={s.introText}>
            <p className={s.eyebrow}>
              <span className={s.tinyLine} />
              {label(
                "A SMALL WORLD. A CONNECTED SCHOOL.",
                "عالم صغير. مدرسة مترابطة.",
              )}
            </p>
            <h1 id="atlas-title">
              {label("One school.", "مدرسة واحدة.")}
              <br />
              <span>
                {label("Every story, ", "كل رحلة، ")}
                <em>{label("connected.", "متصلة.")}</em>
              </span>
            </h1>
            <p className={s.introDescription}>
              {label(
                "Meet the people. Follow the handoffs. Discover how a school comes to life — one connected step at a time.",
                "تعرف على الأدوار، وتابع انتقال العمل بينها. اكتشف كيف تعمل المدرسة، خطوة مترابطة في كل مرة.",
              )}
            </p>
          </div>
          <div className={s.introAction}>
            <div className={s.introNumbers}>
              <div>
                <strong>03</strong>
                <span>{label("CONNECTED ROLES", "أدوار مترابطة")}</span>
              </div>
              <span className={s.numbersDivider} />
              <div>
                <strong>06</strong>
                <span>{label("SHARED STAGES", "مراحل متصلة")}</span>
              </div>
            </div>
            <button className={s.startButton} onClick={startStory}>
              <Play size={15} fill="currentColor" />
              {label("Watch a day unfold", "شاهد يومًا في المدرسة")}
              <span>↗</span>
            </button>
            <p>
              {label(
                "An interactive guide · No real data is changed",
                "دليل تفاعلي · لا يغيّر أي بيانات فعلية",
              )}
            </p>
          </div>
        </section>

        <section
          id="atlas"
          ref={atlasRef}
          className={s.atlas}
          aria-label={label(
            "Interactive school map",
            "خريطة المدرسة التفاعلية",
          )}
        >
          <div className={s.toolbar}>
            <div className={s.viewLabel}>
              <Compass size={17} />
              <span>
                {label("CHOOSE YOUR PERSPECTIVE", "اختر زاوية رؤيتك")}
              </span>
            </div>
            <div
              className={s.roleTabs}
              role="group"
              aria-label={label("Explore by role", "استكشف حسب الدور")}
            >
              <button
                aria-pressed={role === "all"}
                className={role === "all" ? s.activeRole : ""}
                onClick={() => chooseRole("all")}
              >
                <Users size={14} />
                {label("Everyone", "الجميع")}
              </button>
              {roles.map((item) => {
                const Icon = roleIcon[item.id];
                return (
                  <button
                    key={item.id}
                    style={{ "--role-color": item.color } as SceneStyle}
                    aria-pressed={role === item.id}
                    className={role === item.id ? s.activeRole : ""}
                    onClick={() => chooseRole(item.id)}
                  >
                    <Icon size={14} />
                    {t(item.name)}
                  </button>
                );
              })}
            </div>
            <span className={s.mapMode}>
              <span />
              {storyIndex === null
                ? label("EXPLORE MODE", "وضع الاستكشاف")
                : label("STORY MODE", "وضع القصة")}
            </span>
          </div>

          <div className={s.atlasBody}>
            <div className={s.worldColumn}>
              <div className={s.sceneHeading}>
                <div>
                  <span className={s.eyebrow}>
                    {label("THE LIVING CAMPUS", "المدرسة تنبض بالحياة")}
                  </span>
                  <p>
                    {selectedRole
                      ? t(selectedRole.verb)
                      : label(
                          "Every connection has a purpose.",
                          "وراء كل اتصال غاية.",
                        )}
                  </p>
                </div>
                <span className={s.sceneHint}>
                  {label("Select a station to explore", "اختر محطة لاستكشافها")}
                  <ArrowDown size={13} />
                </span>
              </div>
              <div
                className={s.scene}
                dir="ltr"
                onPointerDown={(event) => {
                  if (
                    zoom <= 1 ||
                    (event.target as HTMLElement).closest("button")
                  )
                    return;
                  drag.current = {
                    x: event.clientX,
                    y: event.clientY,
                    originX: pan.x,
                    originY: pan.y,
                  };
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (!drag.current) return;
                  setPan({
                    x: Math.max(
                      -130,
                      Math.min(
                        130,
                        drag.current.originX + event.clientX - drag.current.x,
                      ),
                    ),
                    y: Math.max(
                      -90,
                      Math.min(
                        90,
                        drag.current.originY + event.clientY - drag.current.y,
                      ),
                    ),
                  });
                }}
                onPointerUp={() => {
                  drag.current = null;
                }}
                onPointerCancel={() => {
                  drag.current = null;
                }}
              >
                <div className={s.sceneGrid} />
                <div
                  className={s.world}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  }}
                >
                  <svg
                    className={s.paths}
                    viewBox="0 0 1000 540"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="atlas-path"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#76d8b0" />
                        <stop offset="55%" stopColor="#ac9acf" />
                        <stop offset="100%" stopColor="#e4a46d" />
                      </linearGradient>
                    </defs>
                    <path
                      className={s.pathBase}
                      d="M180 189 Q310 189 490 124 Q665 124 800 189 L780 389 Q650 438 470 437 Q300 437 180 383 L180 189"
                    />
                    <path
                      className={s.pathLine}
                      d="M180 189 Q310 189 490 124 Q665 124 800 189 L780 389 Q650 438 470 437 Q300 437 180 383 L180 189"
                    />
                    <path
                      className={s.pathBranch}
                      d="M490 124 L490 270 L780 389 M490 270 L470 437 M490 270 L180 383"
                    />
                    <circle cx="490" cy="270" r="5" fill="#92e4c3" />
                  </svg>
                  <div className={s.centerSeal}>
                    <span className={s.sealOrbit} />
                    <span className={s.sealIcon}>
                      <GraduationCap size={34} strokeWidth={1.2} />
                    </span>
                    <span className={s.sealText}>
                      EDUSYSTEM
                      <span>
                        {label("BETTER, TOGETHER", "معًا، ننجز أكثر")}
                      </span>
                    </span>
                  </div>
                  {[
                    { x: 32, y: 27 },
                    { x: 66, y: 30 },
                    { x: 29, y: 77 },
                    { x: 64, y: 78 },
                    { x: 11, y: 54 },
                    { x: 89, y: 58 },
                  ].map((tree, index) => (
                    <span
                      key={index}
                      className={s.tree}
                      style={{ left: `${tree.x}%`, top: `${tree.y}%` }}
                      aria-hidden="true"
                    >
                      <i />
                      <b />
                    </span>
                  ))}
                  <span className={s.bench} aria-hidden="true" />
                  <span className={s.campusTag} aria-hidden="true">
                    EST. FOR EVERYONE
                  </span>
                  {stages.map((item, index) => (
                    <button
                      key={item.id}
                      className={`${s.station} ${selectedId === item.id ? s.stationSelected : ""} ${role !== "all" && !item.visibleTo.includes(role) ? s.stationDim : ""}`}
                      style={
                        {
                          "--x": `${item.x}%`,
                          "--y": `${item.y}%`,
                          "--role-color": roles.find(
                            (r) => r.id === item.actor,
                          )!.color,
                        } as SceneStyle
                      }
                      aria-pressed={selectedId === item.id}
                      aria-label={`${index + 1}. ${t(item.kicker)}`}
                      onClick={() => selectStage(item.id)}
                    >
                      <Building kind={item.kind} />
                      <span className={s.stationPin}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={s.stationLabel}
                        dir={language === "ar" ? "rtl" : "ltr"}
                      >
                        {t(item.kicker)}
                        <span>
                          {t(roles.find((r) => r.id === item.actor)!.name)}
                          <span className={s.stationDot} />
                        </span>
                      </span>
                    </button>
                  ))}
                  {roles.map((item) => (
                    <div
                      key={item.id}
                      className={`${s.characterPosition} ${actor === item.id ? s.characterActive : ""}`}
                      style={
                        {
                          left: `${positions[item.id][0]}%`,
                          top: `${positions[item.id][1]}%`,
                          "--role-color": item.color,
                        } as SceneStyle
                      }
                    >
                      <Figurine role={item.id} />
                      <span className={s.characterLabel}>
                        {t(item.name)}
                        {actor === item.id && <span />}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={s.sceneCompass} aria-hidden="true">
                  <span>N</span>
                  <Compass size={28} strokeWidth={1} />
                </div>
              </div>

              <div className={s.mobileVignette} dir="ltr" aria-hidden="true">
                <div className={s.vignetteGrid} />
                <div className={s.vignetteBuilding}>
                  <Building kind={stage.kind} />
                </div>
                <div className={s.vignetteCharacter}>
                  <Figurine role={actor} />
                </div>
                <div
                  className={s.vignetteCaption}
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  <span>{String(stageIndex + 1).padStart(2, "0")} / 06</span>
                  <strong>{t(stage.kicker)}</strong>
                  <small style={{ color: actorData.color }}>
                    {t(actorData.name)}
                  </small>
                </div>
              </div>
              <div
                className={s.mobileJourney}
                aria-label={label("Journey stages", "مراحل الرحلة")}
              >
                {stages.map((item, index) => (
                  <button
                    key={item.id}
                    aria-pressed={item.id === selectedId}
                    onClick={() => selectStage(item.id)}
                    className={`${s.mobileStation} ${item.id === selectedId ? s.mobileStationActive : ""} ${role !== "all" && !item.visibleTo.includes(role) ? s.mobileDim : ""}`}
                  >
                    <span className={s.mobileNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <strong>{t(item.kicker)}</strong>
                      <small>{t(item.name)}</small>
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>

              <div className={s.sceneFooter}>
                <div className={s.legend}>
                  <span />
                  <span>
                    {label(
                      "A handoff, not a hierarchy",
                      "انتقال للعمل، لا ترتيب للأهمية",
                    )}
                  </span>
                </div>
                <div className={s.zoomControls}>
                  <button
                    onClick={() => {
                      const next = Math.max(1, +(zoom - 0.15).toFixed(2));
                      setZoom(next);
                      if (next === 1) setPan({ x: 0, y: 0 });
                    }}
                    disabled={zoom <= 1}
                    aria-label={label("Zoom out", "تصغير")}
                  >
                    <Minus size={14} />
                  </button>
                  <span>{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={() =>
                      setZoom((value) =>
                        Math.min(1.45, +(value + 0.15).toFixed(2)),
                      )
                    }
                    disabled={zoom >= 1.45}
                    aria-label={label("Zoom in", "تكبير")}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                    }}
                    aria-label={label("Fit entire map", "عرض الخريطة كاملة")}
                  >
                    <Maximize size={14} />
                  </button>
                </div>
                <span className={s.mobileFooter}>
                  {label("06 connected stages", "٦ مراحل مترابطة")}
                </span>
              </div>
            </div>

            <aside
              className={s.inspector}
              aria-label={label(
                "Selected stage details",
                "تفاصيل المرحلة المحددة",
              )}
              style={{ "--role-color": actorData.color } as SceneStyle}
            >
              <div className={s.inspectorTop}>
                <span>{label("INSIDE THE JOURNEY", "داخل الرحلة")}</span>
                <span>{String(stageIndex + 1).padStart(2, "0")} / 06</span>
              </div>
              <div className={s.inspectorActor}>
                <div className={s.actorPortrait}>
                  <Figurine role={actor} />
                </div>
                <div>
                  <span>{label("IN THIS CHAPTER", "في هذه المحطة")}</span>
                  <strong>{t(actorData.name)}</strong>
                </div>
                <span className={s.actorBadge}>{label("ACTOR", "الدور")}</span>
              </div>
              <div
                className={s.inspectorContent}
                key={`${stage.id}-${language}`}
              >
                <p className={s.chapterLabel}>{t(stage.kicker)}</p>
                <h2>{t(stage.name)}</h2>
                <p className={s.stageDescription}>{t(stage.description)}</p>
                <div className={s.dependency}>
                  <span className={s.detailIcon}>
                    <Waypoints size={15} />
                  </span>
                  <div>
                    <h3>
                      {label(
                        "What needs to happen first?",
                        "ما الذي نحتاجه أولًا؟",
                      )}
                    </h3>
                    <p>{t(stage.requirement)}</p>
                    {stage.requires.length > 0 && (
                      <div className={s.dependencyLinks}>
                        {stage.requires.map((id) => {
                          const prerequisite = stages.find(
                            (item) => item.id === id,
                          )!;
                          return (
                            <button key={id} onClick={() => selectStage(id)}>
                              {t(prerequisite.kicker)}
                              <ArrowRight size={11} />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className={s.dependency}>
                  <span className={s.detailIcon}>
                    <Check size={15} />
                  </span>
                  <div>
                    <h3>
                      {label(
                        "What this makes possible",
                        "ما الذي تتيحه هذه الخطوة؟",
                      )}
                    </h3>
                    <p>{t(stage.output)}</p>
                  </div>
                </div>
                <details className={s.detailNote}>
                  <summary>
                    {label("A closer look", "تفاصيل مهمة")}
                    <Plus size={13} />
                  </summary>
                  <p>{t(stage.detail)}</p>
                </details>
                {workspaceLink && (
                  <Link className={s.workspaceLink} href={workspaceLink}>
                    {label("Open your workspace", "افتح مساحة عملك")}
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
              <div className={s.inspectorNav}>
                <button
                  onClick={() => selectStage(stages[(stageIndex + 5) % 6].id)}
                  aria-label={label("Previous stage", "المرحلة السابقة")}
                >
                  <ChevronLeft size={17} />
                </button>
                <span>
                  {label("Explore all six chapters", "استكشف المراحل الست")}
                </span>
                <button
                  onClick={() => selectStage(stages[(stageIndex + 1) % 6].id)}
                  aria-label={label("Next stage", "المرحلة التالية")}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </aside>
          </div>

          <div className={`${s.storyPlayer} ${playing ? s.storyPlaying : ""}`}>
            <div className={s.storyIdentity}>
              <span className={s.storyIcon}>
                <Play size={16} fill="currentColor" />
              </span>
              <div>
                <span>{label("THE GUIDED STORY", "القصة التفاعلية")}</span>
                <strong>{label("A day at school", "يوم في المدرسة")}</strong>
              </div>
            </div>
            <div
              className={s.storyNarration}
              aria-live="polite"
              aria-atomic="true"
            >
              <p>
                {beat
                  ? t(beat.title)
                  : label(
                      "Three people. One shared journey.",
                      "ثلاثة أدوار. رحلة واحدة.",
                    )}
              </p>
              <span>
                {beat
                  ? t(beat.handoff)
                  : label(
                      "Press play to follow the work from one role to the next.",
                      "اضغط تشغيل لتتابع انتقال العمل من دور إلى آخر.",
                    )}
              </span>
            </div>
            <div className={s.playerControls}>
              <button
                onClick={() => jumpStory(Math.max(0, (storyIndex ?? 0) - 1))}
                disabled={storyIndex === null || storyIndex === 0}
                aria-label={label(
                  "Previous story step",
                  "الخطوة السابقة في القصة",
                )}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className={s.playButton}
                onClick={() => {
                  if (
                    storyIndex === null ||
                    (!playing && storyIndex === story.length - 1)
                  )
                    startStory();
                  else setPlaying(!playing);
                }}
                aria-label={
                  playing
                    ? label("Pause story", "إيقاف القصة مؤقتًا")
                    : label("Play story", "تشغيل القصة")
                }
              >
                {playing ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
              </button>
              <button
                onClick={() =>
                  jumpStory(Math.min(story.length - 1, (storyIndex ?? -1) + 1))
                }
                disabled={storyIndex === story.length - 1}
                aria-label={label("Next story step", "الخطوة التالية في القصة")}
              >
                <ChevronRight size={18} />
              </button>
              <span className={s.storyCounter}>
                {String(storyIndex === null ? 0 : storyIndex + 1).padStart(
                  2,
                  "0",
                )}
                <span>/ 07</span>
              </span>
              <button
                onClick={() => jumpStory(0)}
                aria-label={label("Restart story", "إعادة القصة")}
              >
                <RotateCcw size={15} />
              </button>
            </div>
            <div className={s.storyProgress} aria-hidden="true">
              {story.map((_, index) => (
                <span
                  key={index}
                  className={
                    storyIndex !== null && index <= storyIndex
                      ? s.progressComplete
                      : ""
                  }
                />
              ))}
            </div>
          </div>
          {beat && (
            <div className={s.storyExpanded}>
              <span
                className={s.liveDot}
                style={{ background: actorData.color }}
              />
              <p>{t(beat.text)}</p>
              {beat.planned && (
                <span className={s.plannedBadge}>
                  {label("Recording UI: planned", "واجهة التسجيل: مخططة")}
                </span>
              )}
              {storyIndex === story.length - 1 && !playing && (
                <span className={s.completeBadge}>
                  <Check size={13} />
                  {label("Journey complete", "اكتملت الرحلة")}
                </span>
              )}
            </div>
          )}
        </section>

        <section className={s.belowMap} aria-labelledby="people-title">
          <div className={s.sectionHeading}>
            <div>
              <span className={s.eyebrow}>
                {label(
                  "DIFFERENT ROLES. SHARED PURPOSE.",
                  "أدوار مختلفة. هدف واحد.",
                )}
              </span>
              <h2 id="people-title">
                {label(
                  "A little clarity goes a long way.",
                  "كلما اتضحت الأدوار، اكتملت الصورة.",
                )}
              </h2>
            </div>
            <p>
              {label(
                "Setup happens first. Learning, progress and communication keep moving — all year long.",
                "يبدأ كل شيء بالإعداد، ثم تستمر رحلة التعلم والمتابعة والتواصل طوال العام.",
              )}
            </p>
          </div>
          <div className={s.roleSummaries}>
            {roles.map((item, index) => (
              <button
                key={item.id}
                className={s.roleSummary}
                style={{ "--role-color": item.color } as SceneStyle}
                onClick={() => {
                  chooseRole(item.id);
                  atlasRef.current?.scrollIntoView({
                    behavior: reducedMotion ? "instant" : "smooth",
                  });
                }}
              >
                <span className={s.summaryNumber}>0{index + 1}</span>
                <span className={s.summaryFigure}>
                  <Figurine role={item.id} small />
                </span>
                <div>
                  <span className={s.summaryRole}>{t(item.name)}</span>
                  <h3>{t(item.verb)}</h3>
                  <p>{t(item.description)}</p>
                </div>
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
        </section>

        <section className={s.referenceSection}>
          <details className={s.permissions}>
            <summary>
              <span className={s.permissionIcon}>
                <ShieldCheck size={22} />
              </span>
              <span>
                <strong>
                  {label("Who can do what?", "من يستطيع فعل ماذا؟")}
                </strong>
                <small>
                  {label(
                    "A clear view of access, responsibilities and boundaries.",
                    "نظرة واضحة على الوصول والمسؤوليات والحدود.",
                  )}
                </small>
              </span>
              <span className={s.permissionToggle}>
                {label("Explore permissions", "استكشف الصلاحيات")}
                <ChevronDown size={16} />
              </span>
            </summary>
            <div className={s.permissionTable}>
              <div className={s.permissionHeader} aria-hidden="true">
                <span>{label("Capability", "الوظيفة")}</span>
                {roles.map((item) => (
                  <span key={item.id} style={{ color: item.color }}>
                    {t(item.name)}
                  </span>
                ))}
              </div>
              {permissions.map((item) => (
                <details className={s.permissionRow} key={item.name.en}>
                  <summary>
                    <span>
                      {t(item.name)}
                      <Plus size={12} />
                    </span>
                    {item.values.map((value, index) => (
                      <span key={index}>
                        <span className={s.srOnly}>
                          {t(roles[index].name)}:{" "}
                        </span>
                        {t(value)}
                      </span>
                    ))}
                  </summary>
                  <p>{t(item.detail)}</p>
                </details>
              ))}
            </div>
            <p className={s.permissionFootnote}>
              {label(
                "This map explains access. Actual permissions are enforced by the server.",
                "تشرح الخريطة الصلاحيات، بينما يفرض الخادم صلاحيات الوصول الفعلية.",
              )}
            </p>
          </details>
          <div className={s.roadmap}>
            <div>
              <span className={s.availableLabel}>
                <span />
                {label("AVAILABLE TODAY", "متاح اليوم")}
              </span>
              <p>
                {label(
                  "Connected school setup, timetables, class attendance views, grade tools, personal student pages, reports and targeted notifications.",
                  "تجهيز المدرسة وربطها، الجداول، عرض حضور الفصول، أدوات الدرجات، صفحات الطالب، التقارير والإشعارات الموجهة.",
                )}
              </p>
            </div>
            <div>
              <span className={s.futureLabel}>
                <Sparkles size={13} />
                {label("NEXT CHAPTERS", "الفصول القادمة")}
              </span>
              <p>
                {label(
                  "A dedicated class-and-date attendance workspace. Batch recording. Per-lesson attendance remains a future design decision.",
                  "مساحة تسجيل حضور حسب الفصل واليوم. تسجيل جماعي. الحضور لكل حصة يظل قرارًا تصميميًا مستقبليًا.",
                )}
              </p>
            </div>
          </div>
        </section>
        <footer className={s.footer}>
          <span>
            <Layers3 size={15} />
            {label(
              "Built around people. Connected by design.",
              "صُمم حول الأشخاص، وبُني على الترابط.",
            )}
          </span>
          <span>
            EduSystem <span className={s.footerDot}>/</span>{" "}
            {label("The system atlas", "أطلس النظام")}
          </span>
        </footer>
      </main>
    </div>
  );
}
