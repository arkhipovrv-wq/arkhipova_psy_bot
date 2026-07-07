import { useEffect, useState } from "react";

/* ─── STYLES · «Спокойная терапия» (светлая тема) ─── */
const css = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F5F1EA; --card:#FFFFFF; --card2:#FBF8F3;
  --sage:#5F7A67; --sage-l:#869B8A; --sage-t:rgba(95,122,103,.10);
  --blush:#D89B87; --blush-t:rgba(228,183,168,.18);
  --ink:#33352F; --mu:#7A7A72; --mu2:#A8A69C;
  --bd:rgba(51,53,47,.10);
  --sh:0 6px 24px rgba(51,53,47,.06);
}
html,body{background:var(--bg)}
body{font-family:'Manrope',-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
.app{width:100%;max-width:480px;margin:0 auto;min-height:100vh;min-height:100dvh;background:var(--bg);position:relative;overflow-x:hidden}
.page{min-height:100dvh;padding-bottom:calc(96px + env(safe-area-inset-bottom))}

/* NAV */
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:rgba(255,255,255,.9);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-top:1px solid var(--bd);display:flex;padding:8px 0 calc(10px + env(safe-area-inset-bottom));z-index:100}
.nb{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;background:none;border:none;padding:0}
.np{width:52px;height:30px;border-radius:15px;display:flex;align-items:center;justify-content:center;transition:background .2s}
.nb.on .np{background:var(--sage-t)}
.nl{font-size:11px;font-weight:600;letter-spacing:.2px}
.nb.on .nl{color:var(--sage)} .nb:not(.on) .nl{color:var(--mu)}

/* HERO */
.hero{position:relative;overflow:hidden}
.hbg{position:absolute;inset:0;background:linear-gradient(180deg,#EFE7D8 0%,var(--bg) 78%)}
.bl1{position:absolute;top:-70px;right:-70px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(134,155,138,.45) 0%,transparent 70%)}
.bl2{position:absolute;top:60px;left:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(216,155,135,.28) 0%,transparent 70%)}
.hi{position:relative;z-index:2;padding:calc(44px + env(safe-area-inset-top)) 22px 30px}
.ey{display:inline-flex;align-items:center;gap:7px;background:var(--sage-t);border:1px solid rgba(95,122,103,.22);border-radius:20px;padding:5px 13px 5px 9px;font-size:11px;font-weight:700;color:var(--sage);letter-spacing:.6px;margin-bottom:18px;text-transform:uppercase}
.dot{width:6px;height:6px;border-radius:50%;background:var(--sage);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.8)}}
.hn{font-family:'Fraunces','Georgia',serif;font-size:clamp(34px,10vw,46px);font-weight:600;line-height:1.03;letter-spacing:-.5px;margin-bottom:12px;color:var(--ink)}
.hn .pk{color:var(--sage)}
.htag{font-family:'Fraunces','Georgia',serif;font-style:italic;font-size:clamp(15px,4.4vw,18px);font-weight:400;color:var(--mu);line-height:1.5;margin-bottom:26px;max-width:300px}
.hrow{display:flex;align-items:flex-end;gap:16px}
.hphoto{width:96px;height:112px;border-radius:24px;overflow:hidden;border:3px solid #fff;box-shadow:var(--sh);flex-shrink:0;background:linear-gradient(135deg,var(--sage-l),var(--blush))}
.hphoto img{width:100%;height:100%;object-fit:cover}
.chips{display:flex;flex-wrap:wrap;gap:7px}
.ch{background:#fff;border:1px solid var(--bd);color:var(--mu);font-size:11.5px;font-weight:600;padding:6px 11px;border-radius:11px}
.ch.g{background:var(--sage-t);border-color:rgba(95,122,103,.2);color:var(--sage)}

/* STATS */
.stats{display:flex;background:#fff;border:1px solid var(--bd);border-radius:24px;box-shadow:var(--sh);margin:18px 16px 4px;padding:18px 6px}
.sta{flex:1;text-align:center;border-right:1px solid var(--bd)}
.sta:last-child{border-right:none}
.sn{font-family:'Fraunces','Georgia',serif;font-size:26px;font-weight:600;color:var(--sage);line-height:1}
.sl{font-size:10.5px;color:var(--mu);margin-top:5px;font-weight:500}

/* SEC HEADER */
.sh{display:flex;align-items:baseline;gap:12px;padding:32px 22px 16px}
.st{font-family:'Fraunces','Georgia',serif;font-size:22px;font-weight:600;letter-spacing:-.2px;white-space:nowrap;color:var(--ink)}
.sline{flex:1;height:1px;background:linear-gradient(90deg,var(--bd),transparent)}

/* QUOTE */
.qb{margin:0 16px;background:var(--blush-t);border:1px solid rgba(216,155,135,.28);border-radius:24px;padding:26px 22px 22px;position:relative;overflow:hidden}
.qb::before{content:'\\201C';position:absolute;top:2px;left:14px;font-family:'Fraunces','Georgia',serif;font-size:96px;font-weight:600;color:rgba(95,122,103,.18);line-height:1}
.qt{font-family:'Fraunces','Georgia',serif;font-style:italic;font-size:17px;line-height:1.62;color:var(--ink);position:relative;z-index:1}
.qa{margin-top:14px;font-size:12.5px;color:var(--sage);font-weight:700;position:relative;z-index:1}

/* WORKS GRID */
.wg{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:0 16px}
.wi{display:flex;align-items:center;gap:11px;min-height:78px;border-radius:18px;padding:14px 15px;border:1px solid var(--bd);cursor:default;transition:transform .15s}
.wi:active{transform:scale(.98)}
.wi-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.wi-n{font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.32}

/* FORMAT */
.fs{display:flex;gap:12px;padding:0 16px}
.fc{flex:1;background:#fff;border:1px solid var(--bd);border-radius:20px;box-shadow:var(--sh);padding:16px 16px 18px}
.fc-ic{font-size:22px;margin-bottom:10px}
.fc-n{font-family:'Fraunces','Georgia',serif;font-size:15px;font-weight:600;color:var(--ink);margin-bottom:5px}
.fc-d{font-size:11.5px;color:var(--mu);line-height:1.45}

/* BTN */
.btn{display:flex;align-items:center;justify-content:center;gap:8px;width:calc(100% - 32px);margin:0 16px;padding:17px;background:var(--sage);color:#fff;font-family:'Manrope',-apple-system,'Segoe UI',Roboto,sans-serif;font-size:15px;font-weight:700;letter-spacing:.2px;border-radius:18px;border:none;cursor:pointer;transition:transform .15s,box-shadow .2s;box-shadow:0 10px 26px rgba(95,122,103,.28)}
.btn:active{transform:scale(.98)}
.btn-o{width:100%;padding:16px;background:#fff;color:var(--sage);border:1.5px solid rgba(95,122,103,.4);border-radius:16px;font-family:'Manrope',-apple-system,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:border-color .2s}
.btn-o:hover{border-color:var(--sage)}

/* SERVICES */
.sl-w{padding:0 16px}
.sc{background:#fff;border:1.5px solid var(--bd);border-radius:20px;box-shadow:var(--sh);margin-bottom:12px;cursor:pointer;transition:border-color .2s,background .2s;display:flex;align-items:center;overflow:hidden}
.sc.sel{border-color:var(--sage);background:var(--sage-t)}
.sc-art{width:56px;height:56px;border-radius:16px;margin:12px 0 12px 12px;flex-shrink:0}
.sc-b{flex:1;padding:12px 14px}
.sc-n{font-family:'Fraunces','Georgia',serif;font-size:14.5px;font-weight:600;color:var(--ink);margin-bottom:3px}
.sc-d{font-size:11.5px;color:var(--mu);line-height:1.4}
.sc-p{text-align:right;padding-right:14px;flex-shrink:0}
.sc-pn{font-family:'Fraunces','Georgia',serif;font-size:16px;font-weight:600;color:var(--sage)}
.sc-pd{font-size:10px;color:var(--mu);margin-top:2px}

/* BOOKING FORM */
.bf{margin:0 16px 14px;background:#fff;border:1px solid var(--bd);border-radius:20px;box-shadow:var(--sh);padding:20px}
.fl{font-size:11px;font-weight:700;color:var(--mu);letter-spacing:.6px;text-transform:uppercase;margin-bottom:9px;display:block}
.fbs{display:flex;gap:8px;margin-bottom:16px}
.fb{flex:1;padding:12px 8px;border-radius:13px;border:1.5px solid var(--bd);background:#fff;font-size:12.5px;font-weight:600;color:var(--mu);cursor:pointer;transition:all .2s;font-family:'Manrope',-apple-system,'Segoe UI',Roboto,sans-serif}
.fb.on{background:var(--sage);border-color:transparent;color:#fff}
.fi{width:100%;padding:13px 14px;background:var(--card2);border:1.5px solid var(--bd);border-radius:13px;font-size:14.5px;font-family:'Manrope',-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);outline:none;margin-bottom:11px;transition:border-color .2s,background .2s}
.fi::placeholder{color:var(--mu2)}
.fi:focus{border-color:var(--sage);background:#fff}

/* CALENDAR */
.cal{margin:0 16px 14px;background:#fff;border:1px solid var(--bd);border-radius:20px;box-shadow:var(--sh);padding:16px;overflow:hidden}
.cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.cal-title{font-family:'Fraunces','Georgia',serif;font-size:17px;font-weight:600;color:var(--ink)}
.cal-nav{width:34px;height:34px;border-radius:11px;background:var(--card2);border:1px solid var(--bd);color:var(--ink);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:background .2s}
.cal-nav:hover{background:var(--sage-t)}
.cal-dow{display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:6px}
.cal-dow span{text-align:center;font-size:10px;font-weight:700;color:var(--mu2);letter-spacing:.5px;padding:4px 0}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
.cal-day{height:38px;display:flex;align-items:center;justify-content:center;border-radius:11px;font-size:13.5px;font-weight:600;color:var(--ink);cursor:pointer;transition:all .15s;position:relative}
.cal-day:hover:not(.empty):not(.past){background:var(--sage-t)}
.cal-day.today{color:var(--sage);font-weight:800}
.cal-day.today::after{content:'';position:absolute;bottom:5px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--sage)}
.cal-day.sel{background:var(--sage);color:#fff;font-weight:700}
.cal-day.sel.today{color:#fff}
.cal-day.sel.today::after{background:#fff}
.cal-day.past{color:var(--mu2);cursor:default}
.cal-day.empty{cursor:default}

/* TIME SLOTS */
.ts-wrap{padding:14px 0 0}
.ts-label{font-size:11px;font-weight:700;color:var(--mu);letter-spacing:.6px;text-transform:uppercase;margin-bottom:11px;display:block}
.ts-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
.ts{padding:11px 4px;border-radius:11px;border:1.5px solid var(--bd);background:#fff;font-size:12.5px;font-weight:600;color:var(--mu);cursor:pointer;transition:all .2s;font-family:'Manrope',-apple-system,'Segoe UI',Roboto,sans-serif;text-align:center}
.ts.on{background:var(--sage);border-color:transparent;color:#fff}
.ts:hover:not(.on){border-color:var(--sage);color:var(--ink)}

/* SUCCESS */
.succ{padding:64px 24px 40px;text-align:center}
.sr{width:88px;height:88px;border-radius:50%;background:var(--sage);display:flex;align-items:center;justify-content:center;color:#fff;font-size:40px;margin:0 auto 26px;box-shadow:0 0 0 10px var(--sage-t)}
.sh2{font-family:'Fraunces','Georgia',serif;font-size:26px;font-weight:600;color:var(--ink);margin-bottom:12px}
.sp{font-size:14.5px;color:var(--mu);line-height:1.6;margin-bottom:28px}
.ss{background:var(--card2);border:1px solid var(--bd);border-radius:16px;padding:16px 18px;margin-bottom:22px;text-align:left}
.ss-l{font-size:11px;color:var(--mu);margin-bottom:4px;letter-spacing:.5px}
.ss-v{font-family:'Fraunces','Georgia',serif;font-size:15px;font-weight:600;color:var(--ink)}
.ss-p{color:var(--sage);font-size:13px;margin-top:2px;font-weight:600}

.note{margin:0 16px;background:var(--sage-t);border:1px solid rgba(95,122,103,.2);border-radius:14px;padding:13px 15px;font-size:12.5px;color:var(--sage);line-height:1.55;font-weight:500}

.fin{animation:fadeUp .35s ease forwards}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`;

/* ─── PASTEL GRADIENTS (service art) ─── */
const G = {
  s1:"linear-gradient(135deg,#A7C1AC,#7C9A85)",
  s2:"linear-gradient(135deg,#EBCabc,#D89B87)",
  s3:"linear-gradient(135deg,#C8D3B8,#9FB58C)",
  s4:"linear-gradient(135deg,#E7D6B4,#CFB784)",
  s5:"linear-gradient(135deg,#BFCBD6,#9FB0C0)",
};

/* ─── DATA ─── */
const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const DAYS   = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
const TIMES  = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

const services = [
  {id:1,grad:G.s1,name:"Индивидуальная сессия",     desc:"Личный запрос · работа с телом и чувствами",price:"7 000 ₽", dur:"1 час"},
  {id:2,grad:G.s2,name:"Расширенная консультация",  desc:"Глубокая работа с темой · разовая встреча",  price:"10 000 ₽",dur:"1ч 20 мин"},
  {id:3,grad:G.s3,name:"Семейная / парная",          desc:"Работа с отношениями и коммуникацией",       price:"8 000 ₽", dur:"1ч 20 мин"},
  {id:4,grad:G.s4,name:"Детско-родительская",        desc:"Рекомендации и разбор запроса",              price:"10 000 ₽",dur:"1ч 20 мин"},
  {id:5,grad:G.s5,name:"Терапевтическая группа",     desc:"Групповой формат · 6–10 участников",         price:"4 000 ₽", dur:"3 часа"},
];

const works = [
  "Тревога и внутренний хаос",
  "Хочу большего, но стою на месте",
  "Отношения и границы",
  "Травма и телесные реакции",
  "Вспышки гнева и вина",
  "Потеря контакта с собой",
  "Детско-родительские",
  "Деньги и самооценка",
];

const formats = [
  {icon:"💻", name:"Онлайн",  desc:"Zoom, Telegram, FaceTime, Google Meet"},
  {icon:"🏡", name:"Очно",    desc:"Малая Покровская 18, Н. Новгород"},
];

const DEFAULT_API_BASE = "https://arkhipova-psy-bot.onrender.com";

function resolveApiBase() {
  const raw = import.meta.env.VITE_API_URL || DEFAULT_API_BASE;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function getTelegramProfile() {
  const webApp = window.Telegram?.WebApp;
  const user = webApp?.initDataUnsafe?.user;
  if (!user) return null;

  return {
    username: user.username ? `@${user.username}` : "",
    firstName: user.first_name || "",
  };
}

/* telegram-web-app.js грузится async — дожидаемся появления WebApp (до ~3с),
   но приложение при этом уже отрисовано и работает даже без Telegram. */
function whenTelegramReady(cb, tries = 30) {
  const webApp = window.Telegram?.WebApp;
  if (webApp) { cb(webApp); return; }
  if (tries <= 0) return;
  setTimeout(() => whenTelegramReady(cb, tries - 1), 100);
}

/* ─── CALENDAR COMPONENT ─── */
function Calendar({ onSelect }) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selDay, setSelDay] = useState(null);
  const [selTime, setSelTime] = useState(null);

  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const offset   = (firstDow + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isPast = (d) => {
    const cell = new Date(year, month, d);
    const t = new Date(); t.setHours(0,0,0,0);
    return cell < t;
  };
  const isToday = (d) => {
    return d===today.getDate() && month===today.getMonth() && year===today.getFullYear();
  };

  const prevMonth = () => { if(month===0){setYear(y=>y-1);setMonth(11)}else setMonth(m=>m-1); setSelDay(null); setSelTime(null); };
  const nextMonth = () => { if(month===11){setYear(y=>y+1);setMonth(0)}else setMonth(m=>m+1); setSelDay(null); setSelTime(null); };

  const pick = (d) => {
    if(!d || isPast(d)) return;
    setSelDay(d); setSelTime(null);
  };

  const pickTime = (t) => {
    setSelTime(t);
    if(selDay) onSelect({ day:selDay, month:month+1, year, time:t,
      label:`${selDay} ${MONTHS[month].toLowerCase()}, ${t}` });
  };

  return (
    <div>
      <div className="cal">
        <div className="cal-head">
          <button className="cal-nav" onClick={prevMonth}>‹</button>
          <span className="cal-title">{MONTHS[month]} {year}</span>
          <button className="cal-nav" onClick={nextMonth}>›</button>
        </div>
        <div className="cal-dow">{DAYS.map(d=><span key={d}>{d}</span>)}</div>
        <div className="cal-grid">
          {cells.map((d,i) => (
            <div key={i}
              className={`cal-day${!d?" empty":""}${d&&isPast(d)?" past":""}${d&&isToday(d)?" today":""}${d&&d===selDay?" sel":""}`}
              onClick={()=>pick(d)}>
              {d||""}
            </div>
          ))}
        </div>
        {selDay && (
          <div className="ts-wrap">
            <span className="ts-label">Выберите время</span>
            <div className="ts-grid">
              {TIMES.map(t=>(
                <button key={t} className={`ts${selTime===t?" on":""}`} onClick={()=>pickTime(t)}>{t}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PAGES ─── */
function HomePage({ onBook }) {
  return (
    <div className="page fin">
      <div className="hero">
        <div className="hbg"/><div className="bl1"/><div className="bl2"/>
        <div className="hi">
          <div className="ey"><span className="dot"/>Психолог · телесная терапия</div>
          <div className="hn">Александра<br/><span className="pk">Архипова</span></div>
          <div className="htag">«Ты разрешаешь себе быть яркой — и наслаждаешься этим»</div>
          <div className="hrow">
            <div className="hphoto">
              <img src="/alexandra.jpg" alt="Александра Архипова"
                style={{objectPosition:"50% 22%"}}
                onError={e=>{e.target.style.display="none"}}/>
            </div>
            <div className="chips">
              <span className="ch g">5000+ часов</span>
              <span className="ch">Семейный терапевт</span>
              <span className="ch">Групповая терапия</span>
              <span className="ch">Работа с телом</span>
              <span className="ch">Н. Новгород · Онлайн</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="sta"><div className="sn">5000+</div><div className="sl">часов практики</div></div>
        <div className="sta"><div className="sn">6 лет</div><div className="sl">личной терапии</div></div>
        <div className="sta"><div className="sn">2021</div><div className="sl">год практики</div></div>
      </div>

      <div className="sh"><span className="st">Философия</span><div className="sline"/></div>
      <div className="qb">
        <div className="qt">Помогаю, когда хочешь звучать и проявляться — но внутри зажато. Работаю с телом, чувствами, энергией. Психолог для смелых жизненных изменений.</div>
        <div className="qa">— Александра Архипова</div>
      </div>

      <div className="sh"><span className="st">С чем работаю</span><div className="sline"/></div>
      <div className="wg">
        {works.map((w,i)=>(
          <div className="wi" key={w}
            style={{background: i%2===0 ? "rgba(95,122,103,.09)" : "rgba(216,155,135,.14)"}}>
            <span className="wi-dot" style={{background: i%2===0 ? "var(--sage)" : "var(--blush)"}}/>
            <div className="wi-n">{w}</div>
          </div>
        ))}
      </div>

      <div className="sh"><span className="st">Формат</span><div className="sline"/></div>
      <div className="fs">
        {formats.map(f=>(
          <div className="fc" key={f.name}>
            <div className="fc-ic">{f.icon}</div>
            <div className="fc-n">{f.name}</div>
            <div className="fc-d">{f.desc}</div>
          </div>
        ))}
      </div>

      <div style={{height:18}}/>
      <button className="btn" onClick={onBook}>Записаться на сессию →</button>
    </div>
  );
}

function BookingPage() {
  const [sel,  setSel]  = useState(null);
  const [fmt,  setFmt]  = useState("online");
  const [name, setName] = useState("");
  const [tg,   setTg]   = useState("");
  const [note, setNote] = useState("");
  const [dt,   setDt]   = useState(null);   // {label, ...}
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const canSubmit = name && tg && dt;
  const service = services.find((x) => x.id === sel);

  useEffect(() => {
    whenTelegramReady(() => {
      const profile = getTelegramProfile();
      if (!profile) return;
      setName((prev) => prev || profile.firstName || "");
      setTg((prev) => prev || profile.username || "");
    });
  }, []);

  const submitBooking = async () => {
    if (!canSubmit || !service || isSubmitting) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`${resolveApiBase()}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: service.name,
          price: service.price,
          duration: service.dur,
          format: fmt,
          name,
          telegram: tg,
          datetime: dt.label,
          note,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.status !== "sent") {
        throw new Error(result.detail ? JSON.stringify(result.detail) : "send_failed");
      }

      setDone(true);
    } catch (error) {
      console.error("Booking submit failed:", error);
      setSubmitError("Не удалось отправить заявку. Проверьте интернет и попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    const s = services.find(x=>x.id===sel);
    return (
      <div className="page fin">
        <div className="succ">
          <div className="sr">✓</div>
          <div className="sh2">Заявка отправлена!</div>
          <div className="sp">Александра свяжется с вами в Telegram для подтверждения записи.</div>
          <div className="ss">
            <div className="ss-l">УСЛУГА</div>
            <div className="ss-v">{s?.name}</div>
            <div className="ss-p">{s?.price} · {s?.dur}</div>
            {dt && <><div className="ss-l" style={{marginTop:10}}>ДАТА И ВРЕМЯ</div><div className="ss-v">{dt.label}</div></>}
          </div>
          <button className="btn-o" onClick={()=>{setDone(false);setSel(null);setName("");setTg("");setNote("");setDt(null);}}>
            Новая запись
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page fin">
      <div className="sh" style={{paddingTop:"calc(36px + env(safe-area-inset-top))"}}><span className="st">Запись на сессию</span><div className="sline"/></div>

      {/* Services */}
      <div className="sl-w">
        {services.map(s=>(
          <div key={s.id} className={`sc ${sel===s.id?"sel":""}`} onClick={()=>setSel(s.id)}>
            <div className="sc-art" style={{background:s.grad}}/>
            <div className="sc-b">
              <div className="sc-n">{s.name}</div>
              <div className="sc-d">{s.desc}</div>
            </div>
            <div className="sc-p">
              <div className="sc-pn">{s.price}</div>
              <div className="sc-pd">{s.dur}</div>
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <div className="fin">
          {/* Format */}
          <div className="bf">
            <label className="fl">Формат встречи</label>
            <div className="fbs">
              <button className={`fb ${fmt==="online"?"on":""}`}  onClick={()=>setFmt("online")}>💻 Онлайн</button>
              <button className={`fb ${fmt==="offline"?"on":""}`} onClick={()=>setFmt("offline")}>🏡 Очно</button>
            </div>
            <label className="fl">Ваше имя</label>
            <input  className="fi" placeholder="Как вас зовут?" value={name} onChange={e=>setName(e.target.value)}/>
            <label className="fl">Telegram</label>
            <input  className="fi" placeholder="@username"       value={tg}   onChange={e=>setTg(e.target.value)}/>
            <label className="fl">Ваш запрос (необязательно)</label>
            <textarea className="fi" placeholder="Коротко о том, с чем хотите разобраться..." rows={3}
              style={{resize:"none"}} value={note} onChange={e=>setNote(e.target.value)}/>
          </div>

          {/* Calendar */}
          <div style={{padding:"0 16px 4px"}}>
            <div style={{fontFamily:"'Fraunces','Georgia',serif",fontSize:20,fontWeight:600,marginBottom:14,letterSpacing:"-.2px",color:"var(--ink)"}}>
              Выберите дату и время
            </div>
          </div>
          <Calendar onSelect={setDt}/>

          {dt && (
            <div style={{margin:"0 16px 14px",background:"var(--sage-t)",border:"1px solid rgba(95,122,103,.25)",borderRadius:14,padding:"12px 14px"}}>
              <div style={{fontSize:11,color:"var(--mu)",marginBottom:4,letterSpacing:.5,textTransform:"uppercase",fontWeight:700}}>Выбрано</div>
              <div style={{fontFamily:"'Fraunces','Georgia',serif",fontSize:15,fontWeight:600,color:"var(--sage)"}}>📅 {dt.label}</div>
            </div>
          )}
        </div>
      )}

      {sel && (
        <button className="btn" style={{opacity:canSubmit && !isSubmitting ? 1 : 0.4}} onClick={submitBooking}>
          {isSubmitting ? "Отправляем..." : "Отправить заявку →"}
        </button>
      )}
      {submitError && (
        <div style={{padding:"12px 16px 0",color:"#B4573F",fontSize:12.5,textAlign:"center"}}>
          {submitError}
        </div>
      )}
      {!sel && <div style={{padding:"0 16px 24px",color:"var(--mu)",fontSize:13,textAlign:"center"}}>Выберите тип консультации ↑</div>}
      <div style={{height:16}}/>
      <div className="note">🔒 Конфиденциальность — основа работы. Всё, что происходит на сессии, остаётся между нами.</div>
    </div>
  );
}

/* ─── ROOT ─── */
export default function App() {
  const [tab, setTab] = useState("home");
  useEffect(() => {
    whenTelegramReady((webApp) => {
      webApp.ready();
      webApp.expand();
      try { webApp.setHeaderColor?.("#F5F1EA"); } catch {}
      try { webApp.setBackgroundColor?.("#F5F1EA"); } catch {}
      try { webApp.disableVerticalSwipes?.(); } catch {}
    });
  }, []);

  const tabs = [
    {id:"home",    label:"Главная", icon:a=>(
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
          fill={a?"#5F7A67":"none"} stroke={a?"#5F7A67":"#A8A69C"} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    )},
    {id:"booking", label:"Запись", icon:a=>(
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="3" stroke={a?"#5F7A67":"#A8A69C"} strokeWidth="1.8"/>
        <line x1="16" y1="3" x2="16" y2="7" stroke={a?"#5F7A67":"#A8A69C"} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="8"  y1="3" x2="8"  y2="7" stroke={a?"#5F7A67":"#A8A69C"} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="3"  y1="11" x2="21" y2="11" stroke={a?"#5F7A67":"#A8A69C"} strokeWidth="1.8"/>
        <circle cx="12" cy="16" r="1.8" fill={a?"#5F7A67":"#A8A69C"}/>
      </svg>
    )},
  ];
  return (
    <>
      <style>{css}</style>
      <div className="app">
        {tab==="home"    && <HomePage    onBook={()=>setTab("booking")}/>}
        {tab==="booking" && <BookingPage/>}
        <nav className="nav">
          {tabs.map(({id,label,icon})=>{
            const a=tab===id;
            return (
              <button key={id} className={`nb ${a?"on":""}`} onClick={()=>setTab(id)}>
                <div className="np">{icon(a)}</div>
                <span className="nl">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
