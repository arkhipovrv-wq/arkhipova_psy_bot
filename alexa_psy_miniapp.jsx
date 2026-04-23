import { useEffect, useState } from "react";

/* ─── STYLES ─── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0C0C10; --s1:#16151C; --s2:#1E1D27; --bd:rgba(255,255,255,0.07);
  --pink:#FF3D6E; --pu:#9B5DE5; --lime:#C3F53C;
  --w:#F4F0FF; --mu:rgba(244,240,255,0.45); --mu2:rgba(244,240,255,0.18);
}
body{background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--w);-webkit-font-smoothing:antialiased}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);overflow:hidden}
.page{min-height:calc(100vh - 68px);overflow-y:auto;padding-bottom:88px}

/* NAV */
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:rgba(12,12,16,.94);backdrop-filter:blur(20px);border-top:1px solid var(--bd);display:flex;padding:10px 0 20px;z-index:100}
.nb{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;background:none;border:none;padding:0}
.np{width:44px;height:28px;border-radius:14px;display:flex;align-items:center;justify-content:center;transition:background .2s}
.nb.on .np{background:var(--pink)}
.nl{font-size:10px;font-weight:500;letter-spacing:.3px}
.nb.on .nl{color:var(--w)} .nb:not(.on) .nl{color:var(--mu)}

/* HERO */
.hero{position:relative;overflow:hidden;min-height:340px}
.hbg{position:absolute;inset:0;background:linear-gradient(135deg,#1A0830 0%,#0C0C10 50%,#0A1A18 100%)}
.bl1{position:absolute;top:-60px;right:-60px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(155,93,229,.35) 0%,transparent 70%)}
.bl2{position:absolute;bottom:-40px;left:-40px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(255,61,110,.25) 0%,transparent 70%)}
.hi{position:relative;z-index:2;padding:48px 20px 28px}
.ey{display:inline-flex;align-items:center;gap:6px;background:rgba(255,61,110,.15);border:1px solid rgba(255,61,110,.3);border-radius:20px;padding:4px 12px 4px 8px;font-size:11px;font-weight:600;color:var(--pink);letter-spacing:.5px;margin-bottom:16px;text-transform:uppercase}
.dot{width:6px;height:6px;border-radius:50%;background:var(--pink);animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
.hn{font-family:'Syne',sans-serif;font-size:38px;font-weight:800;line-height:1;letter-spacing:-1px;margin-bottom:6px}
.hn .pk{color:var(--pink)}
.htag{font-size:15px;font-weight:400;color:var(--mu);line-height:1.5;margin-bottom:24px;font-style:italic;max-width:280px}
.hrow{display:flex;align-items:flex-end;gap:16px}
.hphoto{width:88px;height:100px;border-radius:20px;overflow:hidden;border:2px solid rgba(255,61,110,.4);flex-shrink:0;background:linear-gradient(135deg,#9B5DE5,#FF3D6E)}
.hphoto img{width:100%;height:100%;object-fit:cover}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.ch{background:var(--s2);border:1px solid var(--bd);color:var(--mu);font-size:11px;font-weight:500;padding:5px 10px;border-radius:10px}
.ch.g{background:rgba(195,245,60,.1);border-color:rgba(195,245,60,.25);color:var(--lime)}

/* STATS */
.stats{display:flex;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);background:var(--s1)}
.sta{flex:1;text-align:center;padding:18px 8px;border-right:1px solid var(--bd)}
.sta:last-child{border-right:none}
.sn{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;background:linear-gradient(90deg,var(--pink),var(--pu));-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.sl{font-size:10px;color:var(--mu);margin-top:3px;font-weight:500}

/* SEC HEADER */
.sh{display:flex;align-items:baseline;gap:10px;padding:28px 20px 14px}
.st{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;letter-spacing:-.3px;white-space:nowrap}
.sline{flex:1;height:1px;background:linear-gradient(90deg,var(--bd),transparent)}

/* QUOTE */
.qb{margin:0 16px 6px;background:linear-gradient(135deg,rgba(155,93,229,.15),rgba(255,61,110,.1));border:1px solid rgba(155,93,229,.25);border-radius:20px;padding:22px 20px;position:relative;overflow:hidden}
.qb::before{content:'"';position:absolute;top:-10px;left:10px;font-family:'Syne',sans-serif;font-size:100px;font-weight:800;color:rgba(155,93,229,.15);line-height:1}
.qt{font-size:15px;line-height:1.65;color:var(--w);font-style:italic;position:relative;z-index:1}
.qa{margin-top:12px;font-size:12px;color:var(--pu);font-weight:600;position:relative;z-index:1}

/* WORKS GRID */
.wg{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:0 16px}
.wi{position:relative;height:90px;border-radius:14px;overflow:hidden;cursor:pointer;border:1px solid var(--bd);transition:border-color .2s,transform .15s}
.wi:active{transform:scale(.98);border-color:rgba(255,61,110,.4)}
.wi-bg{position:absolute;inset:0}
.wi-ov{position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.3) 100%)}
.wi-n{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:10px 12px;font-size:12px;font-weight:700;color:var(--w);line-height:1.35;text-align:center;z-index:1;font-family:'Syne',sans-serif;text-shadow:0 1px 6px rgba(0,0,0,.7)}

/* FORMAT */
.fs{display:flex;gap:10px;padding:0 16px 8px}
.fc{flex:1;position:relative;height:110px;border-radius:16px;overflow:hidden;border:1px solid var(--bd)}
.fc-bg{position:absolute;inset:0}
.fc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.4) 60%,rgba(0,0,0,.1) 100%)}
.fc-b{position:absolute;bottom:0;left:0;right:0;padding:10px 12px 12px;z-index:1}
.fc-n{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:3px}
.fc-d{font-size:10px;color:rgba(244,240,255,.65);line-height:1.4}

/* BTN */
.btn{display:flex;align-items:center;justify-content:center;gap:8px;width:calc(100% - 32px);margin:0 16px 10px;padding:18px;background:linear-gradient(135deg,var(--pink),var(--pu));color:white;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;letter-spacing:.3px;border-radius:18px;border:none;cursor:pointer;transition:transform .15s,box-shadow .15s;box-shadow:0 8px 32px rgba(255,61,110,.35)}
.btn:active{transform:scale(.97)}
.btn-o{width:100%;padding:16px;background:transparent;color:var(--pink);border:2px solid rgba(255,61,110,.4);border-radius:16px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:border-color .2s}
.btn-o:hover{border-color:var(--pink)}

/* SERVICES */
.sl-w{padding:0 16px}
.sc{background:var(--s1);border:1.5px solid var(--bd);border-radius:18px;margin-bottom:10px;cursor:pointer;transition:all .2s;display:flex;align-items:center;overflow:hidden}
.sc.sel{border-color:var(--pink);background:rgba(255,61,110,.07)}
.sc-art{width:64px;height:64px;flex-shrink:0}
.sc-b{flex:1;padding:12px 14px}
.sc-n{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:3px}
.sc-d{font-size:11px;color:var(--mu);line-height:1.4}
.sc-p{text-align:right;padding-right:14px;flex-shrink:0}
.sc-pn{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;color:var(--pink)}
.sc-pd{font-size:10px;color:var(--mu);margin-top:1px}

/* BOOKING FORM */
.bf{margin:0 16px 12px;background:var(--s1);border:1px solid var(--bd);border-radius:18px;padding:20px}
.fl{font-size:11px;font-weight:600;color:var(--mu);letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px;display:block}
.fbs{display:flex;gap:8px;margin-bottom:16px}
.fb{flex:1;padding:11px 8px;border-radius:12px;border:1.5px solid var(--bd);background:transparent;font-size:12px;font-weight:600;color:var(--mu);cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
.fb.on{background:linear-gradient(135deg,var(--pink),var(--pu));border-color:transparent;color:white}
.fi{width:100%;padding:13px 14px;background:var(--bg);border:1.5px solid var(--bd);border-radius:12px;font-size:14px;font-family:'DM Sans',sans-serif;color:var(--w);outline:none;margin-bottom:10px;transition:border-color .2s}
.fi::placeholder{color:var(--mu2)}
.fi:focus{border-color:var(--pink)}

/* CALENDAR */
.cal{margin:0 16px 12px;background:var(--s1);border:1px solid var(--bd);border-radius:18px;padding:16px;overflow:hidden}
.cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.cal-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700}
.cal-nav{width:32px;height:32px;border-radius:10px;background:var(--s2);border:1px solid var(--bd);color:var(--w);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:background .2s}
.cal-nav:hover{background:var(--bd)}
.cal-dow{display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:6px}
.cal-dow span{text-align:center;font-size:10px;font-weight:700;color:var(--mu);letter-spacing:.5px;padding:4px 0}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.cal-day{height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;position:relative}
.cal-day:hover:not(.empty):not(.past){background:var(--s2)}
.cal-day.today{color:var(--pink);font-weight:800}
.cal-day.today::after{content:'';position:absolute;bottom:4px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--pink)}
.cal-day.sel{background:linear-gradient(135deg,var(--pink),var(--pu));color:white;font-weight:700}
.cal-day.past{color:var(--mu2);cursor:default}
.cal-day.empty{cursor:default}

/* TIME SLOTS */
.ts-wrap{padding:12px 0 0}
.ts-label{font-size:11px;font-weight:600;color:var(--mu);letter-spacing:.8px;text-transform:uppercase;margin-bottom:10px;display:block}
.ts-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.ts{padding:10px 4px;border-radius:10px;border:1.5px solid var(--bd);background:transparent;font-size:12px;font-weight:600;color:var(--mu);cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;text-align:center}
.ts.on{background:linear-gradient(135deg,var(--pink),var(--pu));border-color:transparent;color:white}
.ts:hover:not(.on){border-color:rgba(255,61,110,.4);color:var(--w)}

/* SUCCESS */
.succ{padding:60px 24px 40px;text-align:center}
.sr{width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,var(--pink),var(--pu));display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 24px;box-shadow:0 0 40px rgba(255,61,110,.4)}
.sh2{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;margin-bottom:10px}
.sp{font-size:14px;color:var(--mu);line-height:1.65;margin-bottom:28px}
.ss{background:var(--s1);border:1px solid var(--bd);border-radius:16px;padding:16px 18px;margin-bottom:20px;text-align:left}
.ss-l{font-size:11px;color:var(--mu);margin-bottom:4px;letter-spacing:.5px}
.ss-v{font-family:'Syne',sans-serif;font-size:15px;font-weight:700}
.ss-p{color:var(--pink);font-size:13px;margin-top:2px}

/* BLOG */
.bfs{display:flex;gap:8px;padding:0 16px 16px;overflow-x:auto}
.bfs::-webkit-scrollbar{display:none}
.bch{padding:8px 16px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap;cursor:pointer;border:1.5px solid var(--bd);background:transparent;color:var(--mu);transition:all .18s;font-family:'DM Sans',sans-serif}
.bch.on{background:var(--w);border-color:var(--w);color:var(--bg)}

/* FEATURED */
.feat{margin:0 16px 16px;border-radius:22px;overflow:hidden;position:relative;height:200px;cursor:pointer}
.feat-bg{position:absolute;inset:0}
.feat-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,4,18,.97) 0%,rgba(8,4,18,.6) 50%,rgba(8,4,18,.1) 100%)}
.feat-c{position:absolute;bottom:0;left:0;right:0;padding:18px 20px;z-index:1}
.fb2{display:inline-block;background:rgba(255,61,110,.2);border:1px solid rgba(255,61,110,.4);color:var(--pink);font-size:10px;font-weight:700;padding:3px 10px;border-radius:8px;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}
.ft{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;line-height:1.2;margin-bottom:8px;letter-spacing:-.3px}
.fm{font-size:11px;color:var(--mu);margin-bottom:12px}
.fbn{display:inline-flex;align-items:center;gap:6px;background:var(--pink);color:white;font-size:12px;font-weight:700;padding:7px 14px;border-radius:10px;border:none;cursor:pointer;font-family:'Syne',sans-serif}

/* BLOG CARD */
.bc{margin:0 16px 10px;background:var(--s1);border:1px solid var(--bd);border-radius:18px;overflow:hidden;cursor:pointer;display:flex;height:104px;transition:border-color .2s}
.bc:active{border-color:rgba(255,61,110,.35)}
.bc-art{width:96px;flex-shrink:0;position:relative}
.bc-artbg{position:absolute;inset:0}
.bc-ov{position:absolute;inset:0;background:linear-gradient(to right,transparent 55%,var(--s1) 100%)}
.btype{position:absolute;bottom:6px;left:6px;font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:2px 7px;border-radius:6px;background:rgba(0,0,0,.7);color:var(--w);z-index:1}
.bc-b{flex:1;padding:12px 14px 12px 10px;display:flex;flex-direction:column;justify-content:center}
.btit{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;line-height:1.3;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.bmt{font-size:10px;color:var(--mu);display:flex;gap:8px;margin-bottom:3px}
.bpv{font-size:11px;color:var(--mu);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

/* MODAL */
.ov{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:200;display:flex;align-items:flex-end;backdrop-filter:blur(8px)}
.sheet{background:#18171F;border-radius:24px 24px 0 0;width:100%;max-height:90vh;overflow-y:auto;animation:up .3s cubic-bezier(.32,.72,0,1)}
@keyframes up{from{transform:translateY(100%)}to{transform:translateY(0)}}
.sh-hero{height:180px;position:relative}
.sh-inner{padding:20px 20px 48px}
.drag{width:36px;height:4px;border-radius:2px;background:var(--s2);margin:0 auto 20px}
.mtype{font-size:11px;font-weight:700;color:var(--pink);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px}
.mtit{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;line-height:1.2;margin-bottom:16px;letter-spacing:-.3px}
.mbody{font-size:15px;line-height:1.8;color:rgba(244,240,255,.75)}
.mbody p{margin-bottom:14px}

.note{margin:0 16px 16px;background:rgba(195,245,60,.08);border:1px solid rgba(195,245,60,.2);border-radius:14px;padding:12px 14px;font-size:12px;color:rgba(195,245,60,.85);line-height:1.55}

.fin{animation:fadeUp .35s ease forwards}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`;

/* ─── GRADIENT THEMES ─── */
// Each "photo" is a unique CSS gradient matching the theme
const G = {
  // Works
  anxiety:   "linear-gradient(135deg,#0D1B3E 0%,#1A3A6B 50%,#0F2A5C 100%)",
  growth:    "linear-gradient(135deg,#3D1800 0%,#8B3A00 50%,#C95A00 100%)",
  relations: "linear-gradient(135deg,#3D0020 0%,#7A0040 50%,#B00050 100%)",
  trauma:    "linear-gradient(135deg,#001A2C 0%,#003A5C 50%,#005080 100%)",
  anger:     "linear-gradient(135deg,#2A0000 0%,#660010 50%,#9B001A 100%)",
  self:      "linear-gradient(135deg,#1A0040 0%,#3D0090 50%,#5500CC 100%)",
  parent:    "linear-gradient(135deg,#1A2A00 0%,#3A5500 50%,#508000 100%)",
  money:     "linear-gradient(135deg,#2A1A00 0%,#664400 50%,#996600 100%)",
  // Format
  online:    "linear-gradient(135deg,#001A3D 0%,#003080 50%,#0044B0 100%)",
  offline:   "linear-gradient(135deg,#0A1A10 0%,#1A3D25 50%,#2A6040 100%)",
  // Services
  s1:"linear-gradient(135deg,#1A0830 0%,#3D1560 100%)",
  s2:"linear-gradient(135deg,#0A1A30 0%,#1A3D6B 100%)",
  s3:"linear-gradient(135deg,#2A0018 0%,#660040 100%)",
  s4:"linear-gradient(135deg,#0A1A0A 0%,#1A4A1A 100%)",
  s5:"linear-gradient(135deg,#1A0A00 0%,#4A2000 100%)",
  // Blog
  b1:"linear-gradient(135deg,#1A0830 0%,#4A1575 50%,#2A0855 100%)",
  b2:"linear-gradient(135deg,#0A1530 0%,#1A3060 50%,#0D2550 100%)",
  b3:"linear-gradient(135deg,#001A1A 0%,#003D3D 50%,#005050 100%)",
  b4:"linear-gradient(135deg,#200800 0%,#502000 50%,#803200 100%)",
  // Featured
  feat:"linear-gradient(135deg,#1A0830 0%,#3D1060 40%,#0C0C10 100%)",
  // Modal hero
  m1:"linear-gradient(160deg,#2A0845 0%,#5A1585 50%,#1A0535 100%)",
  m2:"linear-gradient(160deg,#0A1540 0%,#1A3570 50%,#081230 100%)",
  m3:"linear-gradient(160deg,#001A1A 0%,#004545 50%,#001515 100%)",
  m4:"linear-gradient(160deg,#200800 0%,#552500 50%,#180500 100%)",
};

/* ─── DATA ─── */
const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const DAYS   = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
const TIMES  = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

const services = [
  {id:1,grad:G.s1,name:"Индивидуальная сессия",     desc:"Личный запрос · работа с телом и чувствами",price:"5 000 ₽", dur:"50 мин"},
  {id:2,grad:G.s2,name:"Расширенная консультация",  desc:"Глубокая работа с темой · разовая встреча",  price:"10 000 ₽",dur:"1ч 20 мин"},
  {id:3,grad:G.s3,name:"Семейная / парная",          desc:"Работа с отношениями и коммуникацией",       price:"8 000 ₽", dur:"1ч 20 мин"},
  {id:4,grad:G.s4,name:"Детско-родительская",        desc:"Рекомендации и разбор запроса",              price:"10 000 ₽",dur:"1ч 20 мин"},
  {id:5,grad:G.s5,name:"Терапевтическая группа",     desc:"Групповой формат · 6–10 участников",         price:"4 000 ₽", dur:"3 часа"},
];

const works = [
  {grad:G.anxiety,  n:"Тревога и внутренний хаос"},
  {grad:G.growth,   n:"Хочу большего, но стою на месте"},
  {grad:G.relations,n:"Отношения и границы"},
  {grad:G.trauma,   n:"Травма и телесные реакции"},
  {grad:G.anger,    n:"Вспышки гнева и вина"},
  {grad:G.self,     n:"Потеря контакта с собой"},
  {grad:G.parent,   n:"Детско-родительские"},
  {grad:G.money,    n:"Деньги и самооценка"},
];

const formats = [
  {grad:G.online,  icon:"💻", name:"Онлайн",  desc:"Zoom, Telegram, FaceTime, Google Meet"},
  {grad:G.offline, icon:"🏡", name:"Очно",    desc:"Малая Покровская 18, Н. Новгород"},
];

const posts = [
  {id:1,type:"Лонгрид",grad:G.b1,mgrd:G.m1,
   title:"Ты способна на большее — но почему-то стоишь на месте",
   date:"18 апр",time:"8 мин",
   preview:"Вы видите экспертов с меньшим опытом, у них получается. А вы смотрите и злитесь. Сначала на них, потом на себя...",
   body:`Вы когда-нибудь ловили себя на мысли: я могу больше, но почему-то стою на месте?\n\nЭто боль номер один — причём у тех, у кого уже есть клиенты, кейсы, результаты. Но каждый раз, когда надо сделать следующий шаг, внутри будто щелчок: «нет, погоди, рано, не сейчас».\n\nНачинаешь вести блог и бросаешь. Поднимаешь цену, а через неделю опускаешь обратно. Готовишь проект, а сказать про него откладываешь на осень, потом на новый год.\n\nСамое противное чувство — не усталость. А ощущение, что ты сама выбрала быть меньше. Хотя внутри всё кипит, всё давно просится наружу.\n\nЗа этим стоит обычный человеческий страх. Страх того, что когда ты станешь видимой — придётся выдерживать чужую оценку, свой успех наконец. А этому нас никто не учил. Учили быть удобными и не высовываться.`},
  {id:2,type:"Статья",grad:G.b2,mgrd:G.m2,
   title:"Что страшного в успехе и в том, чтобы быть видимой",
   date:"15 апр",time:"6 мин",
   preview:"Иногда мы не растём, потому что боимся последствий этого роста. Боимся, что успех принесёт не только признание, но и одиночество...",
   body:`За годы работы я заметила важную, но не очевидную вещь. Иногда мы не растём, потому что боимся последствий этого роста.\n\nМы боимся, что успех принесёт не только признание, но и одиночество. Что от нас отвернутся подруги, что изменятся отношения с близкими.\n\nИ психика, которая заточена на выживание и принадлежность к группе, видит в этом угрозу. Не потому что вы слабая. А потому что вы живая.\n\nРабота с этим начинается не с мотивации. Она начинается с вопроса: а что именно я теряю, когда становлюсь собой?`},
  {id:3,type:"Подкаст",grad:G.b3,mgrd:G.m3,
   title:"Работа с телом: почему тревога живёт не в голове",
   date:"10 апр",time:"22 мин",
   preview:"Тело помнит всё, что разум пытается забыть. Разбираем, как телесные практики меняют отношение к тревоге...",
   body:`Когда мы говорим о тревоге, мы обычно думаем, что надо «поменять мысли». Но тело часто не слышит этих инструкций.\n\nЯ работаю с телом, чувствами и энергией — потому что устойчивые изменения происходят не через понимание, а через ощущение.\n\nВ этом подкасте говорим о том, почему соматические практики дают то, что не даёт разговорная терапия. И о том, как научиться замечать, что происходит внутри — до того, как оно взорвётся снаружи.`},
  {id:4,type:"Видео",grad:G.b4,mgrd:G.m4,
   title:"«Я не знаю, чего хочу» — как вернуть контакт с собой",
   date:"3 апр",time:"15 мин",
   preview:"54% опрошенных: «Чувствую, что способна на большее, но не могу раскрыться». Разбираемся почему...",
   body:`«Я не знаю, чего хочу» — эту фразу я слышу почти на каждой первой встрече.\n\nЭто не про лень и не про отсутствие мечты. Это про то, что стало небезопасно знать, чего хочешь. Потому что желания игнорировали, высмеивали, или говорили: «хотеть — это эгоизм».\n\nВ этом видео — о том, как начинается путь обратно к себе. Без форсированных «найди своё предназначение», а через маленькие, честные шаги.`},
];

const DEFAULT_API_BASE = "https://arkhipovapsybot-production.up.railway.app";

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
              className={`cal-day${!d?" empty":""}${d&&isPast(d)?" past":""}${d&&isToday(d)?" today":""}${d===selDay?" sel":""}`}
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
          <div className="ey"><span className="dot"/>А-моральный психолог</div>
          <div className="hn">Александра<br/><span className="pk">Архипова</span></div>
          <div className="htag">«Ты разрешаешь себе быть яркой — и наслаждаешься этим»</div>
          <div className="hrow">
            <div className="hphoto">
              <img src="https://thb.tildacdn.pub/tild3761-6365-4332-b430-643863626334/-/empty/IMG_7513.jpeg" alt=""
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
        {works.map(w=>(
          <div className="wi" key={w.n}>
            <div className="wi-bg" style={{background:w.grad}}/>
            <div className="wi-ov"/>
            <div className="wi-n">{w.n}</div>
          </div>
        ))}
      </div>

      <div className="sh"><span className="st">Формат</span><div className="sline"/></div>
      <div className="fs">
        {formats.map(f=>(
          <div className="fc" key={f.name}>
            <div className="fc-bg" style={{background:f.grad}}/>
            <div className="fc-ov"/>
            <div className="fc-b">
              <div className="fc-n">{f.icon} {f.name}</div>
              <div className="fc-d">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{height:12}}/>
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
    const profile = getTelegramProfile();
    if (!profile) return;

    setName((prev) => prev || profile.firstName || "");
    setTg((prev) => prev || profile.username || "");
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
      <div className="sh" style={{paddingTop:32}}><span className="st">Запись на сессию</span><div className="sline"/></div>

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
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,marginBottom:14,letterSpacing:"-.3px"}}>
              Выберите дату и время
            </div>
          </div>
          <Calendar onSelect={setDt}/>

          {dt && (
            <div style={{margin:"0 16px 12px",background:"rgba(255,61,110,0.08)",border:"1px solid rgba(255,61,110,0.25)",borderRadius:14,padding:"12px 14px"}}>
              <div style={{fontSize:11,color:"var(--mu)",marginBottom:4,letterSpacing:.5,textTransform:"uppercase"}}>Выбрано</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"var(--pink)"}}>📅 {dt.label}</div>
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
        <div style={{padding:"0 16px 12px",color:"#ff7d9d",fontSize:12,textAlign:"center"}}>
          {submitError}
        </div>
      )}
      {!sel && <div style={{padding:"0 16px 24px",color:"var(--mu)",fontSize:13,textAlign:"center"}}>Выберите тип консультации ↑</div>}
      <div className="note">🔒 Конфиденциальность — основа работы. Всё, что происходит на сессии, остаётся между нами.</div>
    </div>
  );
}

function BlogPage() {
  const [filter, setFilter] = useState("Все");
  const [open,   setOpen]   = useState(null);
  const filters = ["Все","Статья","Лонгрид","Подкаст","Видео"];
  const visible = filter==="Все" ? posts : posts.filter(p=>p.type===filter);

  return (
    <div className="page fin">
      <div className="sh" style={{paddingTop:32}}><span className="st">Блог</span><div className="sline"/></div>

      <div className="feat" onClick={()=>setOpen(posts[0])}>
        <div className="feat-bg" style={{background:G.feat}}/>
        <div className="feat-ov"/>
        <div className="feat-c">
          <div className="fb2">🔥 Топ материал</div>
          <div className="ft">{posts[0].title}</div>
          <div className="fm">📅 {posts[0].date} · ⏱ {posts[0].time}</div>
          <button className="fbn">Читать →</button>
        </div>
      </div>

      <div className="bfs">
        {filters.map(f=><button key={f} className={`bch ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>{f}</button>)}
      </div>

      {visible.map(p=>(
        <div className="bc" key={p.id} onClick={()=>setOpen(p)}>
          <div className="bc-art">
            <div className="bc-artbg" style={{background:p.grad}}/>
            <div className="bc-ov"/>
            <span className="btype">{p.type}</span>
          </div>
          <div className="bc-b">
            <div className="bmt"><span>📅 {p.date}</span><span>⏱ {p.time}</span></div>
            <div className="btit">{p.title}</div>
            <div className="bpv">{p.preview}</div>
          </div>
        </div>
      ))}

      {open && (
        <div className="ov" onClick={()=>setOpen(null)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sh-hero" style={{background:open.mgrd}}/>
            <div className="sh-inner">
              <div className="drag"/>
              <div className="mtype">{open.type}</div>
              <div className="mtit">{open.title}</div>
              <div className="mbody">
                {open.body.split("\n\n").map((p,i)=><p key={i}>{p}</p>)}
              </div>
              <div style={{marginTop:28}}>
                <button className="btn" style={{margin:0}} onClick={()=>setOpen(null)}>Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ROOT ─── */
export default function App() {
  const [tab, setTab] = useState("home");
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;
    webApp.ready();
    webApp.expand();
  }, []);

  const tabs = [
    {id:"home",    label:"Главная", icon:a=>(
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
          fill={a?"white":"none"} stroke={a?"white":"rgba(244,240,255,0.4)"} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    )},
    {id:"booking", label:"Запись", icon:a=>(
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="3" stroke={a?"white":"rgba(244,240,255,0.4)"} strokeWidth="1.8"/>
        <line x1="16" y1="3" x2="16" y2="7" stroke={a?"white":"rgba(244,240,255,0.4)"} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="8"  y1="3" x2="8"  y2="7" stroke={a?"white":"rgba(244,240,255,0.4)"} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="3"  y1="11" x2="21" y2="11" stroke={a?"white":"rgba(244,240,255,0.4)"} strokeWidth="1.8"/>
        <circle cx="12" cy="16" r="1.8" fill={a?"white":"rgba(244,240,255,0.4)"}/>
      </svg>
    )},
    {id:"blog",    label:"Блог", icon:a=>(
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4H14L20 10V20C20 20.55 19.55 21 19 21H5C4.45 21 4 20.55 4 20V4Z"
          stroke={a?"white":"rgba(244,240,255,0.4)"} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M14 4V10H20" stroke={a?"white":"rgba(244,240,255,0.4)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="14" x2="16" y2="14" stroke={a?"white":"rgba(244,240,255,0.4)"} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="8" y1="17.5" x2="13" y2="17.5" stroke={a?"white":"rgba(244,240,255,0.4)"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )},
  ];
  return (
    <>
      <style>{css}</style>
      <div className="app">
        {tab==="home"    && <HomePage    onBook={()=>setTab("booking")}/>}
        {tab==="booking" && <BookingPage/>}
        {tab==="blog"    && <BlogPage/>}
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
