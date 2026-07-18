/* ============================================================
   UNIVERSITIES — filter sidebar + grid + sort + save + load more
   ============================================================ */
const { useState, useEffect } = React;

// Parse URL params at script-load time (before React renders)
const _Q  = new URLSearchParams(window.location.search);
const _INIT_COUNTRY = _Q.get("country") || "";
const _INIT_LEVEL   = _Q.get("level")   || "";
const _INIT_FIELD   = _Q.get("field")   || "";
const _INIT_SEARCH  = _Q.get("search")  || "";

/* ---------- Raw university data ---------- */
const UNIS_RAW = [
  /* ========== ИТАЛИЯ ========== */
  /* qs = мировой рейтинг по таблице; itRank = место среди итальянских вузов; appFee = взнос за подачу (EUR) */
  { name: "Politecnico di Milano",             short: "PoliMi",   loc: "Милан",       country: "Италия", flag: "🇮🇹", qs: 301,  itRank: 16, appFee: 50,  price: 4290,  type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр" },
  { name: "Università Bocconi",                short: "Bocconi",  loc: "Милан",       country: "Италия", flag: "🇮🇹", qs: 400,  itRank: 3,  appFee: 100, price: 15400, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "University of Bologna",             short: "UniBo",    loc: "Болонья",     country: "Италия", flag: "🇮🇹", qs: 167,  itRank: 1,  appFee: 0,   price: 2750,  type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "Sapienza University of Rome",       short: "Sapienza", loc: "Рим",         country: "Италия", flag: "🇮🇹", qs: 114,  itRank: 2,  appFee: 30,  price: 2200,  type: "Государственный", field: "Law",      levels: "Бакалавр · Магистр · Foundation" },
  { name: "University of Padua",               short: "UniPD",    loc: "Падуя",       country: "Италия", flag: "🇮🇹", qs: 114,  itRank: 4,  appFee: 60,  price: 2640,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · Foundation" },
  { name: "Ca'Foscari University",             short: "CaFosc",   loc: "Венеция",     country: "Италия", flag: "🇮🇹", qs: 320,  itRank: 15, appFee: 30,  price: 2420,  type: "Государственный", field: "Economics",  levels: "Бакалавр · Магистр · Foundation" },
  { name: "LUISS",                             short: "LUISS",    loc: "Рим",         country: "Италия", flag: "🇮🇹", qs: 500,  itRank: 4,  appFee: 30,  price: 18700, type: "Частный",         field: "Law",      levels: "Бакалавр · Магистр · Foundation" },
  { name: "Polytechnic University of Turin",   short: "PoliTO",   loc: "Турин",       country: "Италия", flag: "🇮🇹", qs: 527,  itRank: 28, appFee: 30,  price: 3850,  type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр" },
  { name: "University of Milan",               short: "UniMi",    loc: "Милан",       country: "Италия", flag: "🇮🇹", qs: 164,  itRank: 5,  appFee: 30,  price: 2860,  type: "Государственный", field: "Law",      levels: "Бакалавр · Магистр" },
  { name: "University of Turin",               short: "UniTO",    loc: "Турин",       country: "Италия", flag: "🇮🇹", qs: 217,  itRank: 8,  appFee: 60,  price: 2530,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр" },
  { name: "University of Pisa",                short: "UniPI",    loc: "Пиза",        country: "Италия", flag: "🇮🇹", qs: 189,  itRank: 16, appFee: 0,   price: 2310,  type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр · Foundation" },
  { name: "Tor Vergata University of Rome",    short: "TorVerg",  loc: "Рим",         country: "Италия", flag: "🇮🇹", qs: 243,  itRank: 12, appFee: 30,  price: 2090,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · Foundation" },
  { name: "University of Florence",            short: "UniFI",    loc: "Флоренция",   country: "Италия", flag: "🇮🇹", qs: 235,  itRank: 11, appFee: 20,  price: 2640,  type: "Государственный", field: "Design",     levels: "Бакалавр · Магистр", exams: [] },
  { name: "University of Siena",               short: "UniSI",    loc: "Сиена",       country: "Италия", flag: "🇮🇹", qs: 367,  itRank: 21, appFee: 40,  price: 2200,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · Foundation" },
  { name: "University of Pavia",               short: "UniPV",    loc: "Павия",       country: "Италия", flag: "🇮🇹", qs: 258,  itRank: 13, appFee: 60,  price: 2420,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · Foundation" },
  { name: "Trento University",                 short: "UniTN",    loc: "Тренто",      country: "Италия", flag: "🇮🇹", qs: 485,  itRank: 15, appFee: 30,  price: 2090,  type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр" },
  { name: "University of Trieste",             short: "UniTS",    loc: "Триест",      country: "Италия", flag: "🇮🇹", qs: 332,  itRank: 18, appFee: 40,  price: 2200,  type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр" },
  { name: "University of Brescia",             short: "UniBS",    loc: "Брешиа",      country: "Италия", flag: "🇮🇹", qs: 666,  itRank: 38, appFee: 75,  price: 2310,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · Foundation" },
  { name: "University of Parma",               short: "UniPR",    loc: "Парма",       country: "Италия", flag: "🇮🇹", qs: 401,  itRank: 14, appFee: 0,   price: 2090,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · Foundation" },
  { name: "LUMSA University",                  short: "LUMSA",    loc: "Рим",         country: "Италия", flag: "🇮🇹", qs: null, itRank: null,appFee: 100, price: 7700,  type: "Частный",         field: "Education", levels: "Бакалавр · Магистр" },
  { name: "Istituto Marangoni Milan",          short: "Marang",   loc: "Милан",       country: "Италия", flag: "🇮🇹", qs: null, itRank: 17, appFee: 0,   price: 19800, type: "Частный",         field: "Design",     levels: "Бакалавр · Магистр" },
  { name: "IULM Universita",                   short: "IULM",     loc: "Милан",       country: "Италия", flag: "🇮🇹", qs: null, itRank: null,appFee: 110, price: 9900,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "University of Milan Bicocca",       short: "UniMiB",   loc: "Милан",       country: "Италия", flag: "🇮🇹", qs: 351,  itRank: null,appFee: 0,   price: 2530,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр" },
  { name: "University of Genoa",               short: "UniGE",    loc: "Генуя",       country: "Италия", flag: "🇮🇹", qs: 551,  itRank: null,appFee: 0,   price: 2090,  type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр" },
  { name: "Roma Tre University",               short: "Roma3",    loc: "Рим",         country: "Италия", flag: "🇮🇹", qs: 701,  itRank: null,appFee: 0,   price: 1980,  type: "Государственный", field: "Law",      levels: "Бакалавр · Магистр" },
  { name: "University of Palermo",             short: "UniPA",    loc: "Палермо",     country: "Италия", flag: "🇮🇹", qs: 801,  itRank: null,appFee: 0,   price: 1760,  type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр" },
  { name: "University of Messina",             short: "UniME",    loc: "Мессина",     country: "Италия", flag: "🇮🇹", qs: 741,  itRank: 39, appFee: 30,  price: 1650,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр", exams: ["IMAT"], elite: true },
  { name: "University of Catania",             short: "UniCT",    loc: "Катания",     country: "Италия", flag: "🇮🇹", qs: 801,  itRank: null,appFee: 0,   price: 1760,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр" },
  { name: "University of Salerno",             short: "UniSA",    loc: "Салерно",     country: "Италия", flag: "🇮🇹", qs: 851,  itRank: null,appFee: 0,   price: 1980,  type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр" },
  { name: "University of Cassino",             short: "UniCAS",   loc: "Кассино",     country: "Италия", flag: "🇮🇹", qs: 1450, itRank: 58, appFee: 15,  price: 1650,  type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр", exams: [], elite: true },
  { name: "University of Udine",               short: "UniUD",    loc: "Удине",       country: "Италия", flag: "🇮🇹", qs: 801,  itRank: null,appFee: 0,   price: 1980,  type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "University of Campania",            short: "UniCamp",  loc: "Неаполь",     country: "Италия", flag: "🇮🇹", qs: 851,  itRank: null,appFee: 0,   price: 1760,  type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр" },
  { name: "University of Bari Aldo-Moro",      short: "UniBa",    loc: "Бари",        country: "Италия", flag: "🇮🇹", qs: 801,  itRank: null,appFee: 0,   price: 1870,  type: "Государственный", field: "Law",      levels: "Бакалавр · Магистр" },
  { name: "Politecnica delle Marche",          short: "UNIVPM",   loc: "Анкона",      country: "Италия", flag: "🇮🇹", qs: 751,  itRank: null,appFee: 0,   price: 2090,  type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр", elite: true },
  /* Foundation */
  { name: "Link Campus University",            short: "LinkCU",   loc: "Рим",         country: "Италия", flag: "🇮🇹", qs: null, itRank: 79, appFee: 85,  price: 4000,  type: "Частный",         field: "Business",     levels: "Foundation · Бакалавр", exams: [] },
  { name: "RUFA – Rome University of Fine Art",short: "RUFA",     loc: "Рим",         country: "Италия", flag: "🇮🇹", qs: null, itRank: null,appFee: 0,   price: 9900,  type: "Частный",         field: "Design",     levels: "Foundation · Бакалавр" },
  { name: "LUM University",                    short: "LUM",      loc: "Бари",        country: "Италия", flag: "🇮🇹", qs: null, itRank: null,appFee: 0,   price: 5000,  type: "Частный",         field: "Business",     levels: "Foundation · Бакалавр · Магистр", exams: [] },

  /* ========== США ========== */
  { name: "Roosevelt University",              short: "Roosevelt",loc: "Чикаго",      country: "США",           flag: "🇺🇸", qs: 390,  price: 25000, discount: 11000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", elite: true,  meritBased: true, needBased: true },
  { name: "Bellevue College",                  short: "Bellevue", loc: "Сиэтл",       country: "США",           flag: "🇺🇸", qs: 480,  price: 11000, type: "Государственный", field: "IT",         levels: "Колледж · Бакалавр", meritBased: true },
  { name: "La Salle University",               short: "LaSalle",  loc: "Филадельфия", country: "США",           flag: "🇺🇸", qs: 510,  price: 36000, discount: 20000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр", meritBased: true, needBased: true },
  { name: "Kalamazoo College",                 short: "K-Zoo",    loc: "Каламазу",    country: "США",           flag: "🇺🇸", qs: 460,  price: 65265, discount: 65265, type: "Частный",         field: "Design",     levels: "Бакалавр",           meritBased: true, needBased: true },
  { name: "Westcliff University",              short: "Westcliff",loc: "Ирвайн",      country: "США",           flag: "🇺🇸", qs: 501,  price: 18000, discount: 5000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", elite: true,  meritBased: true },
  { name: "SUNY at Buffalo",                   short: "UB",       loc: "Буффало",     country: "США",           flag: "🇺🇸", qs: 326,  price: 35700, discount: 15000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true, needBased: true },
  { name: "University of Evansville",          short: "UE",       loc: "Эвансвилл",   country: "США",           flag: "🇺🇸", qs: 601,  price: 40000, discount: 30000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "DePaul University",                 short: "DePaul",   loc: "Чикаго",      country: "США",           flag: "🇺🇸", qs: 601,  price: 46000, discount: 32000, type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр", meritBased: true, needBased: true },
  { name: "Rowan University",                  short: "Rowan",    loc: "Глассборо",   country: "США",           flag: "🇺🇸", qs: 701,  price: 28800, discount: 19000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true, elite: true },
  { name: "Harrisburg University",             short: "HarrisU",  loc: "Харрисберг",  country: "США",           flag: "🇺🇸", qs: null,  price: 26000, type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Saint Thomas",        short: "UST",      loc: "Хьюстон",     country: "США",           flag: "🇺🇸", qs: 801,  price: 35000, discount: 18000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true, needBased: true },
  { name: "Arizona State University",          short: "ASU",      loc: "Темпе",       country: "США",           flag: "🇺🇸", qs: 290,  price: 39062, discount: 20000, type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр · PhD", meritBased: true, needBased: true },
  { name: "California State University",       short: "CalState", loc: "Калифорния",  country: "США",           flag: "🇺🇸", qs: 601,  price: 18000, discount: 1000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "San Jose State University",         short: "SJSU",     loc: "Сан-Хосе",    country: "США",           flag: "🇺🇸", qs: 651,  price: 18000, discount: 1000, type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Golden Gate University",            short: "GGU",      loc: "Сан-Франциско",country: "США",          flag: "🇺🇸", qs: null,  price: 12000, discount: 1000, type: "Частный",         field: "Law",      levels: "Бакалавр · Магистр" },
  { name: "Marymount University",              short: "MU",       loc: "Арлингтон",   country: "США",           flag: "🇺🇸", qs: 801,  price: 43000, discount: 27000, type: "Частный",         field: "Design",     levels: "Бакалавр · Магистр", meritBased: true, needBased: true },
  { name: "Adelphi University",                short: "Adelphi",  loc: "Гарден-Сити", country: "США",           flag: "🇺🇸", qs: 701,  price: 53000, discount: 40000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Cincinnati",          short: "UC",       loc: "Цинциннати",  country: "США",           flag: "🇺🇸", qs: 601,  price: 30000, discount: 15000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Temple University",                 short: "Temple",   loc: "Филадельфия", country: "США",           flag: "🇺🇸", qs: 503,  price: 40000, discount: 20000, type: "Государственный", field: "Law",      levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Drexel University",                 short: "Drexel",   loc: "Филадельфия", country: "США",           flag: "🇺🇸", qs: 603,  price: 62000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true, needBased: true },
  { name: "Suffolk University",                short: "Suffolk",  loc: "Бостон",      country: "США",           flag: "🇺🇸", qs: 801,  price: 49000, type: "Частный",         field: "Law",      levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Pace University",                   short: "Pace",     loc: "Нью-Йорк",    country: "США",           flag: "🇺🇸", qs: 751,  price: 58000, discount: 20000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true, needBased: true },
  { name: "University of Arizona",             short: "UArizona", loc: "Тусон",       country: "США",           flag: "🇺🇸", qs: 376,  price: 42000, type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Florida International University",  short: "FIU",      loc: "Майами",      country: "США",           flag: "🇺🇸", qs: 701,  price: 16000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Connecticut",         short: "UConn",    loc: "Сторрс",      country: "США",           flag: "🇺🇸", qs: 490,  price: 39678, discount: 15000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Clarkson University",               short: "Clarkson", loc: "Потсдам",     country: "США",           flag: "🇺🇸", qs: 801,  price: 61594, discount: 45000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Columbia College Chicago",          short: "ColChic",  loc: "Чикаго",      country: "США",           flag: "🇺🇸", qs: null,  price: 36000, discount: 16000, type: "Частный",         field: "Design",     levels: "Бакалавр · Магистр" },
  { name: "New York Film Academy",             short: "NYFA",     loc: "Нью-Йорк",    country: "США",           flag: "🇺🇸", qs: null,  price: 39000, discount: 10000, type: "Частный",         field: "Design",     levels: "Бакалавр · Магистр" },
  { name: "Webster University",                short: "Webster",  loc: "Сент-Луис",   country: "США",           flag: "🇺🇸", qs: 801,  price: 31800, discount: 18000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Simmons University",                short: "Simmons",  loc: "Бостон",      country: "США",           flag: "🇺🇸", qs: 851,  price: 50000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Florida Institute of Technology",   short: "FloridaTech",loc:"Мельбурн",   country: "США",           flag: "🇺🇸", qs: 801,  price: 45960, discount: 15000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "North American University",         short: "NAU",      loc: "Хьюстон",     country: "США",           flag: "🇺🇸", qs: null,  price: 26000, discount: 22000, type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр" },
  { name: "Radford University",                short: "Radford",  loc: "Рэдфорд",     country: "США",           flag: "🇺🇸", qs: 901,  price: 28000, discount: 8000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Concord University",                short: "Concord",  loc: "Атенс",       country: "США",           flag: "🇺🇸", qs: 901,  price: 22000, discount: 6000, type: "Государственный", field: "Business",     levels: "Бакалавр" },
  { name: "SUNY at Albany",                    short: "UAlbany",  loc: "Олбани",      country: "США",           flag: "🇺🇸", qs: 551,  price: 29814, discount: 20500, type: "Государственный", field: "Law",      levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Central Washington University",     short: "CWU",      loc: "Элленсберг",  country: "США",           flag: "🇺🇸", qs: null,  price: 28000, discount: 8000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "Connecticut College",               short: "ConnColl", loc: "Нью-Лондон",  country: "США",           flag: "🇺🇸", qs: null,  price: 67000, type: "Частный",         field: "Law",      levels: "Бакалавр", meritBased: true, needBased: true },
  { name: "San Francisco Bay University",      short: "SFBU",     loc: "Сан-Франциско",country: "США",          flag: "🇺🇸", qs: null,  price: 13000, discount: 10000, type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр" },
  { name: "Southern California State University",short:"SCSS",    loc: "Лос-Анджелес",country: "США",           flag: "🇺🇸", qs: null,  price: 7500, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "Lynn University",                    short: "Lynn",     loc: "Бока-Ратон",  country: "США",           flag: "🇺🇸", qs: 1001, price: 10000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true, needBased: true },
  { name: "University of Tulsa",                short: "UTulsa",   loc: "Талса",       country: "США",           flag: "🇺🇸", qs: 801,  price: 52000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of San Francisco",        short: "USF",      loc: "Сан-Франциско",country: "США",          flag: "🇺🇸", qs: 801,  price: 63000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "Gannon University",                  short: "Gannon",   loc: "Эри",         country: "США",           flag: "🇺🇸", qs: null,  price: 45000, discount: 37000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Florida National University",        short: "FNU",      loc: "Майами",      country: "США",           flag: "🇺🇸", qs: null,  price: 16800, discount: 3000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "San Francisco State University",     short: "SFSU",     loc: "Сан-Франциско",country: "США",          flag: "🇺🇸", qs: 1001,  price: 17500, discount: 7000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },

  /* ========== США — Shorelight/ApplyWave партнёры ========== */
  { name: "Rutgers University",              short: "Rutgers",   loc: "Нью-Брансуик", country: "США",           flag: "🇺🇸", qs: 401,  price: 34000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Stony Brook University",          short: "SBU",       loc: "Стоуни-Брук",  country: "США",           flag: "🇺🇸", qs: 351,  price: 29000, type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Tulane University",               short: "Tulane",    loc: "Новый Орлеан", country: "США",           flag: "🇺🇸", qs: 501,  price: 60000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true, needBased: true },
  { name: "Villanova University",            short: "Villanova", loc: "Виллануэва",   country: "США",           flag: "🇺🇸", qs: 451,  price: 54000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Illinois Chicago",  short: "UIC",       loc: "Чикаго",       country: "США",           flag: "🇺🇸", qs: 401,  price: 29000, type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Auburn University",               short: "Auburn",    loc: "Оберн",        country: "США",           flag: "🇺🇸", qs: 601,  price: 31000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Gonzaga University",              short: "Gonzaga",   loc: "Спокан",       country: "США",           flag: "🇺🇸", qs: 801,  price: 50000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Central Florida",   short: "UCF",       loc: "Орландо",      country: "США",           flag: "🇺🇸", qs: 601,  price: 22000, type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of South Carolina",    short: "UofSC",     loc: "Колумбия",     country: "США",           flag: "🇺🇸", qs: 701,  price: 33000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Louisiana State University",      short: "LSU",       loc: "Батон-Руж",    country: "США",           flag: "🇺🇸", qs: 701,  price: 26000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Kansas",            short: "KU",        loc: "Лоуренс",      country: "США",           flag: "🇺🇸", qs: 651,  price: 27000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Seattle University",              short: "SeattleU",  loc: "Сиэтл",        country: "США",           flag: "🇺🇸", qs: 1001, price: 49000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Montana State University",        short: "MontanaSt", loc: "Бозман",       country: "США",           flag: "🇺🇸", qs: null, price: 23000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "The New School",                  short: "NewSchool", loc: "Нью-Йорк",     country: "США",           flag: "🇺🇸", qs: null, price: 55000, type: "Частный",         field: "Design",     levels: "Бакалавр · Магистр" },
  { name: "University of New Haven",         short: "NewHaven",  loc: "Нью-Хейвен",   country: "США",           flag: "🇺🇸", qs: null, price: 41000, type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр", meritBased: true },

  /* ========== США — Shorelight партнёры (расширенный список) ========== */
  { name: "American University",              short: "AU",         loc: "Вашингтон",     country: "США", flag: "🇺🇸", qs: 801,  price: 57000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Johns Hopkins University",         short: "JHU",        loc: "Балтимор",      country: "США", flag: "🇺🇸", qs: 16,   price: 61000, type: "Частный",         field: "IT",        levels: "Магистр · PhD", meritBased: true },
  { name: "University of Virginia",           short: "UVA",        loc: "Шарлотсвилл",   country: "США", flag: "🇺🇸", qs: 201,  price: 54000, type: "Государственный", field: "Business",    levels: "Магистр", meritBased: true },
  { name: "Pepperdine University",            short: "Pepperdine", loc: "Малибу",         country: "США", flag: "🇺🇸", qs: 501,  price: 59000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Utah",              short: "UUtah",      loc: "Солт-Лейк-Сити",country: "США", flag: "🇺🇸", qs: 651,  price: 30000, type: "Государственный", field: "IT",        levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Univ. of Texas San Antonio",      short: "UTSA",       loc: "Сан-Антонио",   country: "США", flag: "🇺🇸", qs: 801,  price: 22000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Dayton",            short: "UDayton",    loc: "Дейтон",         country: "США", flag: "🇺🇸", qs: null, price: 47000, type: "Частный",         field: "Engineering", levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of the Pacific",       short: "Pacific",    loc: "Стоктон",        country: "США", flag: "🇺🇸", qs: null, price: 54000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Nevada Reno",       short: "UNR",        loc: "Рино",           country: "США", flag: "🇺🇸", qs: 1001, price: 25000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "UMass Boston",                    short: "UMassB",     loc: "Бостон",         country: "США", flag: "🇺🇸", qs: 801,  price: 31000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Missouri S&T",                    short: "MissouriST", loc: "Ролла",           country: "США", flag: "🇺🇸", qs: 1001, price: 30000, type: "Государственный", field: "Engineering", levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Cleveland State University",      short: "ClevSt",     loc: "Кливленд",       country: "США", flag: "🇺🇸", qs: null, price: 23000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Robert Morris University",        short: "RMU",        loc: "Питтсбург",      country: "США", flag: "🇺🇸", qs: null, price: 39000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Belmont University",              short: "Belmont",    loc: "Нэшвилл",        country: "США", flag: "🇺🇸", qs: null, price: 40000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Oklahoma City University",        short: "OCU",        loc: "Оклахома-Сити",  country: "США", flag: "🇺🇸", qs: null, price: 40000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Wyoming",           short: "UWyo",       loc: "Ларами",          country: "США", flag: "🇺🇸", qs: 1001, price: 23000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Portland",          short: "UPortland",  loc: "Портленд",       country: "США", flag: "🇺🇸", qs: null, price: 50000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Rutgers University Camden",       short: "RuCamden",   loc: "Камден",         country: "США", flag: "🇺🇸", qs: null, price: 28000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Utah Tech University",            short: "UtahTech",   loc: "Сент-Джордж",   country: "США", flag: "🇺🇸", qs: null, price: 18000, type: "Государственный", field: "IT",        levels: "Бакалавр · Магистр", meritBased: true },
  { name: "UW–Eau Claire",                   short: "UWEC",       loc: "Ого-Клер",       country: "США", flag: "🇺🇸", qs: null, price: 19000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "UW–Green Bay",                    short: "UWGB",       loc: "Грин-Бей",       country: "США", flag: "🇺🇸", qs: null, price: 18000, type: "Государственный", field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "UW–Whitewater",                   short: "UWWW",       loc: "Уайтуотер",      country: "США", flag: "🇺🇸", qs: null, price: 16000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "UW–River Falls",                  short: "UWRF",       loc: "Ривер-Фолс",     country: "США", flag: "🇺🇸", qs: null, price: 16000, type: "Государственный", field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "UW–Superior",                     short: "UWSup",      loc: "Супириор",       country: "США", flag: "🇺🇸", qs: null, price: 14000, type: "Государственный", field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "UW–Stevens Point",                short: "UWSP",       loc: "Стивенс-Пойнт",  country: "США", flag: "🇺🇸", qs: null, price: 17000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Univ. of Illinois Springfield",   short: "UISG",       loc: "Спрингфилд",     country: "США", flag: "🇺🇸", qs: null, price: 19000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Univ. of Alaska Fairbanks",       short: "UAF",        loc: "Фэрбанкс",       country: "США", flag: "🇺🇸", qs: null, price: 24000, type: "Государственный", field: "Engineering", levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Bellarmine University",           short: "Bellarmine", loc: "Луисвилл",        country: "США", flag: "🇺🇸", qs: null, price: 43000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Carroll University",              short: "CarrollU",   loc: "Уокеша",          country: "США", flag: "🇺🇸", qs: null, price: 37000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Dean College",                    short: "DeanC",      loc: "Франклин",        country: "США", flag: "🇺🇸", qs: null, price: 48000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Eureka College",                  short: "Eureka",     loc: "Юрика",           country: "США", flag: "🇺🇸", qs: null, price: 28000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Felician University",             short: "Felician",   loc: "Лоди",            country: "США", flag: "🇺🇸", qs: null, price: 38000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Hanover College",                 short: "Hanover",    loc: "Хановер",         country: "США", flag: "🇺🇸", qs: null, price: 45000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Hartwick College",                short: "Hartwick",   loc: "Уонта",           country: "США", flag: "🇺🇸", qs: null, price: 49000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Hiram College",                   short: "Hiram",      loc: "Хайрам",          country: "США", flag: "🇺🇸", qs: null, price: 47000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Holy Cross College",              short: "HolyCross",  loc: "Нотр-Дам",        country: "США", flag: "🇺🇸", qs: null, price: 37000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Illinois Wesleyan University",    short: "IllinoisWes",loc: "Блумингтон",      country: "США", flag: "🇺🇸", qs: null, price: 55000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Lakeland University",             short: "Lakeland",   loc: "Шебойган",        country: "США", flag: "🇺🇸", qs: null, price: 34000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Lewis University",               short: "LewisU",     loc: "Ромеовилл",       country: "США", flag: "🇺🇸", qs: null, price: 38000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "McMurry University",              short: "McMurry",    loc: "Абилин",          country: "США", flag: "🇺🇸", qs: null, price: 29000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "MGH Institute of Health",        short: "MGHIHP",     loc: "Бостон",           country: "США", flag: "🇺🇸", qs: null, price: 37000, type: "Частный",         field: "Medicine",  levels: "Магистр · PhD", meritBased: true },
  { name: "Moravian University",             short: "Moravian",   loc: "Вифлеем",         country: "США", flag: "🇺🇸", qs: null, price: 48000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Mount St. Mary's University",    short: "MtStMary",   loc: "Эммитсбург",      country: "США", flag: "🇺🇸", qs: null, price: 46000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Ohio Wesleyan University",        short: "OhioWes",    loc: "Делавер",         country: "США", flag: "🇺🇸", qs: null, price: 53000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Palm Beach Atlantic University",  short: "PalmBeach",  loc: "Уэст-Палм-Бич",  country: "США", flag: "🇺🇸", qs: null, price: 36000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Randolph College",                short: "RandolphC",  loc: "Линчберг",        country: "США", flag: "🇺🇸", qs: null, price: 45000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Saint Mary's Univ. of MN",       short: "SaintMaryMN",loc: "Уинона",          country: "США", flag: "🇺🇸", qs: null, price: 42000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Salve Regina University",         short: "SalveRegina",loc: "Ньюпорт",         country: "США", flag: "🇺🇸", qs: null, price: 45000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Schreiner University",            short: "Schreiner",  loc: "Кервилл",         country: "США", flag: "🇺🇸", qs: null, price: 33000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "St. Bonaventure University",      short: "StBon",      loc: "Сент-Бонавентур", country: "США", flag: "🇺🇸", qs: null, price: 43000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "St. Catherine University",        short: "StCatherine",loc: "Сент-Пол",        country: "США", flag: "🇺🇸", qs: null, price: 43000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "St. Mary's College of CA",        short: "StMaryCA",   loc: "Морага",          country: "США", flag: "🇺🇸", qs: null, price: 52000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "St. Thomas Aquinas College",      short: "StThomasAQ", loc: "Спаркилл",        country: "США", flag: "🇺🇸", qs: null, price: 38000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Trinity Christian College",       short: "TrinityCC",  loc: "Пэлос-Хайтс",    country: "США", flag: "🇺🇸", qs: null, price: 36000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "University of Charleston",        short: "UCharleston",loc: "Чарлстон",        country: "США", flag: "🇺🇸", qs: null, price: 32000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Dubuque",           short: "UDubuque",   loc: "Дубьюк",          country: "США", flag: "🇺🇸", qs: null, price: 36000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Mount Union",       short: "UMountUnion",loc: "Альянс",          country: "США", flag: "🇺🇸", qs: null, price: 37000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "University of New England",       short: "UNE",        loc: "Бидефорд",        country: "США", flag: "🇺🇸", qs: null, price: 43000, type: "Частный",         field: "Medicine",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Redlands",          short: "URedlands",  loc: "Редлендс",        country: "США", flag: "🇺🇸", qs: null, price: 55000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Saint Mary KS",     short: "USaintMary", loc: "Ливенуорт",       country: "США", flag: "🇺🇸", qs: null, price: 33000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Virginia Wesleyan University",    short: "VirginiaWes",loc: "Норфолк",         country: "США", flag: "🇺🇸", qs: null, price: 39000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Washington & Jefferson College",  short: "WashJeff",   loc: "Вашингтон",       country: "США", flag: "🇺🇸", qs: null, price: 51000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Western Oregon University",       short: "WesternOR",  loc: "Монмут",          country: "США", flag: "🇺🇸", qs: null, price: 26000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Whittier College",                short: "Whittier",   loc: "Уиттиер",         country: "США", flag: "🇺🇸", qs: null, price: 53000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Widener University",              short: "Widener",    loc: "Честер",           country: "США", flag: "🇺🇸", qs: null, price: 54000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Wilson College",                  short: "Wilson",     loc: "Чемберсбург",     country: "США", flag: "🇺🇸", qs: null, price: 32000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Colby Sawyer College",            short: "ColbySawyer",loc: "Нью-Лондон",      country: "США", flag: "🇺🇸", qs: null, price: 47000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Bridgewater College",             short: "BridgewaterC",loc: "Бриджуотер",     country: "США", flag: "🇺🇸", qs: null, price: 41000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Dakota Wesleyan University",      short: "DakotaWes",  loc: "Митчелл",         country: "США", flag: "🇺🇸", qs: null, price: 33000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Central Methodist University",    short: "CentralMeth",loc: "Фэйет",           country: "США", flag: "🇺🇸", qs: null, price: 28000, type: "Частный",         field: "Business",    levels: "Бакалавр", meritBased: true },
  { name: "Auburn Univ. at Montgomery",      short: "AuburnMont", loc: "Монтгомери",      country: "США", flag: "🇺🇸", qs: null, price: 23000, type: "Государственный", field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Brescia University",              short: "Brescia",    loc: "Оуэнсборо",       country: "США", flag: "🇺🇸", qs: null, price: 27000, type: "Частный",         field: "Business",    levels: "Бакалавр · Магистр", meritBased: true },
  /* США — College */
  { name: "De Anza College",                   short: "DeAnza",   loc: "Купертино",   country: "США",           flag: "🇺🇸", qs: null, price: 9500,  type: "Государственный", field: "IT",         levels: "Колледж" },
  { name: "Green River College",               short: "GreenRiver",loc:"Оберн",        country: "США",           flag: "🇺🇸", qs: null, price: 10000, type: "Государственный", field: "Business",     levels: "Колледж" },
  { name: "Seattle Central College",           short: "SCC",      loc: "Сиэтл",       country: "США",           flag: "🇺🇸", qs: null, price: 10500, type: "Государственный", field: "IT",         levels: "Колледж" },
  { name: "Santa Monica College",              short: "SMC",      loc: "Санта-Моника", country: "США",           flag: "🇺🇸", qs: null, price: 9000,  type: "Государственный", field: "Design",     levels: "Колледж" },
  { name: "Los Angeles City College",          short: "LACC",     loc: "Лос-Анджелес", country: "США",          flag: "🇺🇸", qs: null, price: 9000,  type: "Государственный", field: "Design",     levels: "Колледж" },
  { name: "City Colleges of Chicago",          short: "CCC",      loc: "Чикаго",      country: "США",           flag: "🇺🇸", qs: null, price: 9500,  type: "Государственный", field: "Business",     levels: "Колледж" },
  { name: "Lake Washington Institute of Technology",short:"LWIT", loc: "Кёркленд",    country: "США",           flag: "🇺🇸", qs: null, price: 10000, type: "Государственный", field: "IT",         levels: "Колледж" },
  { name: "San Francisco City College",        short: "CCSF",     loc: "Сан-Франциско",country: "США",          flag: "🇺🇸", qs: null, price: 9000,  type: "Государственный", field: "IT",         levels: "Колледж" },
  { name: "Computer System Institute",         short: "CSI",      loc: "Чикаго",      country: "США",           flag: "🇺🇸", qs: null, price: 8500,  type: "Частный",         field: "IT",         levels: "Колледж" },

  /* ========== США (ApplyWave add) ========== */
  { name: "Berkeley College",                  short: "BerkeleyC", loc: "Нью-Йорк",    country: "США", flag: "🇺🇸", qs: null, price: 29700, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Black Hills State University",      short: "BHSU",      loc: "Спирфиш",      country: "США", flag: "🇺🇸", qs: null, price: 14500, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Brenau University",                 short: "Brenau",    loc: "Гейнсвилл",    country: "США", flag: "🇺🇸", qs: null, price: 32000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Caldwell University",                short: "Caldwell",  loc: "Колдуэлл",     country: "США", flag: "🇺🇸", qs: null, price: 36000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "California Lutheran University",    short: "CalLutheran",loc: "Таузенд-Оукс", country: "США", flag: "🇺🇸", qs: null, price: 50000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "College of Mount Saint Vincent",    short: "MountSV",   loc: "Нью-Йорк",     country: "США", flag: "🇺🇸", qs: null, price: 40000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Colorado Mesa University",          short: "ColoMesa",  loc: "Гранд-Джанкшен",country: "США", flag: "🇺🇸", qs: null, price: 20000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Colorado State University",         short: "ColoState", loc: "Форт-Коллинз", country: "США", flag: "🇺🇸", qs: 1201, price: 32000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Dallas Baptist University",         short: "DBU",       loc: "Даллас",       country: "США", flag: "🇺🇸", qs: null, price: 29000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Doane University",                  short: "Doane",     loc: "Крит",         country: "США", flag: "🇺🇸", qs: null, price: 35000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Drew University",                    short: "DrewU",     loc: "Мэдисон",      country: "США", flag: "🇺🇸", qs: null, price: 54000, type: "Частный",         field: "Law",      levels: "Бакалавр · Магистр", meritBased: true, needBased: true },
  { name: "Duquesne University",                short: "Duquesne",  loc: "Питтсбург",    country: "США", flag: "🇺🇸", qs: null, price: 45000, type: "Частный",         field: "Law",      levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Eastern Michigan University",       short: "EasternMI", loc: "Ипсиланти",    country: "США", flag: "🇺🇸", qs: null, price: 21000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Elizabethtown College",              short: "ElizabethC",loc: "Элизабеттаун", country: "США", flag: "🇺🇸", qs: null, price: 50000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Fisher College",                     short: "FisherC",   loc: "Бостон",       country: "США", flag: "🇺🇸", qs: null, price: 34000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Full Sail University",              short: "FullSail",  loc: "Уинтер-Парк",  country: "США", flag: "🇺🇸", qs: null, price: 28000, type: "Частный",         field: "Design",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "George Mason University",           short: "GMU",       loc: "Фэрфакс",      country: "США", flag: "🇺🇸", qs: 1001, price: 38688, type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "High Point University",             short: "HighPoint", loc: "Хай-Пойнт",    country: "США", flag: "🇺🇸", qs: null, price: 46812, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Hofstra University",                short: "Hofstra",   loc: "Хемпстед",     country: "США", flag: "🇺🇸", qs: null, price: 59960, type: "Частный",         field: "Law",      levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Hope College",                       short: "HopeC",     loc: "Холланд",      country: "США", flag: "🇺🇸", qs: null, price: 46980, type: "Частный",         field: "Medicine",   levels: "Бакалавр",  meritBased: true, needBased: true },
  { name: "Illinois State University",         short: "ISU",       loc: "Нормал",       country: "США", flag: "🇺🇸", qs: null, price: 26058, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Illinois Tech University",          short: "IllinoisTech",loc: "Чикаго",     country: "США", flag: "🇺🇸", qs: 605,  price: 52202, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "James Madison University",          short: "JMU",       loc: "Харрисонбург", country: "США", flag: "🇺🇸", qs: null, price: 31312, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Kent State University",             short: "KentState", loc: "Кент",         country: "США", flag: "🇺🇸", qs: null, price: 24300, type: "Государственный", field: "Design",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "LIM College",                        short: "LIM",       loc: "Нью-Йорк",     country: "США", flag: "🇺🇸", qs: null, price: 40000, type: "Частный",         field: "Design",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Lawrence Technological University", short: "LTU",       loc: "Саутфилд",     country: "США", flag: "🇺🇸", qs: null, price: 36000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Lees-McRae College",                 short: "LeesMcRae", loc: "Баннер-Элк",   country: "США", flag: "🇺🇸", qs: null, price: 34000, type: "Частный",         field: "Business",     levels: "Бакалавр",  meritBased: true },
  { name: "Lipscomb University",                short: "Lipscomb",  loc: "Нашвилл",      country: "США", flag: "🇺🇸", qs: null, price: 34000, type: "Частный",         field: "Law",      levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Long Island University",             short: "LIU",       loc: "Брентвуд",     country: "США", flag: "🇺🇸", qs: null, price: 40000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Lycoming College",                   short: "Lycoming",  loc: "Уильямспорт",  country: "США", flag: "🇺🇸", qs: null, price: 50000, type: "Частный",         field: "Business",     levels: "Бакалавр",  meritBased: true },
  { name: "Marist College",                     short: "Marist",    loc: "Покипси",      country: "США", flag: "🇺🇸", qs: null, price: 45000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Marshall University",                short: "MarshallU", loc: "Хантингтон",   country: "США", flag: "🇺🇸", qs: null, price: 20000, type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Marywood University",                short: "Marywood",  loc: "Данмор",       country: "США", flag: "🇺🇸", qs: null, price: 36000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Mercy University",                   short: "MercyU",    loc: "Доббс-Ферри",  country: "США", flag: "🇺🇸", qs: null, price: 30000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Middle Tennessee State University", short: "MTSU",      loc: "Мерфрисборо",  country: "США", flag: "🇺🇸", qs: null, price: 20000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Midway University",                  short: "MidwayU",   loc: "Мидвей",       country: "США", flag: "🇺🇸", qs: null, price: 28000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Milwaukee School of Engineering",   short: "MSOE",      loc: "Милуоки",      country: "США", flag: "🇺🇸", qs: null, price: 44000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Minnesota State University, Mankato",short: "MinnState",loc: "Манкато",      country: "США", flag: "🇺🇸", qs: null, price: 19000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Missouri Southern State University",short: "MSSU",      loc: "Джоплин",      country: "США", flag: "🇺🇸", qs: null, price: 16000, type: "Государственный", field: "Business",     levels: "Бакалавр",  meritBased: true },
  { name: "Monroe University",                  short: "MonroeU",   loc: "Нью-Рошель",   country: "США", flag: "🇺🇸", qs: null, price: 25000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Nebraska Wesleyan University",      short: "NebrWes",   loc: "Линкольн",     country: "США", flag: "🇺🇸", qs: null, price: 40000, type: "Частный",         field: "Business",     levels: "Бакалавр",  meritBased: true },
  { name: "North Central College",              short: "NCC",       loc: "Нейпервилл",   country: "США", flag: "🇺🇸", qs: null, price: 47000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Norwich University",                 short: "Norwich",   loc: "Нортфилд",     country: "США", flag: "🇺🇸", qs: null, price: 44000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Nova Southeastern University",      short: "NSU",       loc: "Форт-Лодердейл",country: "США", flag: "🇺🇸", qs: null, price: 32000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Ohio Dominican University",         short: "OhioDom",   loc: "Колумбус",     country: "США", flag: "🇺🇸", qs: null, price: 32000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Oregon State University",           short: "OSU",       loc: "Корваллис",    country: "США", flag: "🇺🇸", qs: 1000, price: 34000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Purdue University Northwest",       short: "PurdueNW",  loc: "Хаммонд",      country: "США", flag: "🇺🇸", qs: null, price: 24000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Queens College",                     short: "QueensC",   loc: "Флашинг",      country: "США", flag: "🇺🇸", qs: null, price: 19000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Rensselaer Polytechnic Institute",  short: "RPI",       loc: "Трой",         country: "США", flag: "🇺🇸", qs: 801,  price: 62000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Rochester Institute of Technology", short: "RIT",       loc: "Рочестер",     country: "США", flag: "🇺🇸", qs: 801,  price: 50000, type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Rose-Hulman Institute of Technology",short: "RoseHulman",loc: "Терре-Хот",   country: "США", flag: "🇺🇸", qs: null, price: 54000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Saint Leo University",               short: "StLeo",     loc: "Сент-Лео",     country: "США", flag: "🇺🇸", qs: null, price: 24000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Saint Louis University",             short: "SLU",       loc: "Сент-Луис",    country: "США", flag: "🇺🇸", qs: 1001, price: 50000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "San Diego State University",        short: "SDSU",      loc: "Сан-Диего",    country: "США", flag: "🇺🇸", qs: null, price: 21000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Sonoma State University",           short: "SonomaSt",  loc: "Роэнерт-Парк", country: "США", flag: "🇺🇸", qs: null, price: 18000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Southeast Missouri State University",short: "SEMO",     loc: "Кейп-Жирардо", country: "США", flag: "🇺🇸", qs: null, price: 16000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Southern Oregon University",        short: "SOU",       loc: "Эшленд",       country: "США", flag: "🇺🇸", qs: null, price: 21000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Southwest Minnesota State University",short: "SMSU",    loc: "Маршалл",      country: "США", flag: "🇺🇸", qs: null, price: 16000, type: "Государственный", field: "Business",     levels: "Бакалавр",  meritBased: true },
  { name: "St. Francis College",                short: "StFrancisC",loc: "Бруклин",     country: "США", flag: "🇺🇸", qs: null, price: 30000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "St. John's University",              short: "StJohns",   loc: "Куинс",        country: "США", flag: "🇺🇸", qs: null, price: 46000, type: "Частный",         field: "Law",      levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Tennessee Tech University",         short: "TTU",       loc: "Куквилл",      country: "США", flag: "🇺🇸", qs: null, price: 21000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Texas A&M University - Corpus Christi",short: "TAMUCC", loc: "Корпус-Кристи",country: "США", flag: "🇺🇸", qs: null, price: 20000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Texas Wesleyan University",         short: "TexasWes",  loc: "Форт-Уэрт",    country: "США", flag: "🇺🇸", qs: null, price: 29000, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "The Ohio State University",          short: "OhioState", loc: "Колумбус",     country: "США", flag: "🇺🇸", qs: 145,  price: 37000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "The University of Toledo",           short: "Toledo",    loc: "Толедо",       country: "США", flag: "🇺🇸", qs: null, price: 21000, type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Thomas Jefferson University",       short: "ThomasJeff",loc: "Филадельфия",  country: "США", flag: "🇺🇸", qs: null, price: 40000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Touro University",                   short: "Touro",     loc: "Нью-Йорк",     country: "США", flag: "🇺🇸", qs: null, price: 30000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Trine University",                   short: "TrineU",    loc: "Ангола",       country: "США", flag: "🇺🇸", qs: null, price: 34000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Alabama at Birmingham",short: "UAB",      loc: "Бирмингем",    country: "США", flag: "🇺🇸", qs: 801,  price: 21000, type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Bridgeport",           short: "UBridgeport",loc: "Бриджпорт",  country: "США", flag: "🇺🇸", qs: null, price: 27000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Colorado Denver",     short: "UCDenver",  loc: "Денвер",       country: "США", flag: "🇺🇸", qs: null, price: 26000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Delaware",             short: "UDel",      loc: "Ньюарк",       country: "США", flag: "🇺🇸", qs: 601,  price: 36000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Hartford",             short: "UHartford", loc: "Уэст-Хартфорд",country: "США", flag: "🇺🇸", qs: null, price: 40000, type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Indianapolis",        short: "UIndy",     loc: "Индианаполис", country: "США", flag: "🇺🇸", qs: null, price: 32000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Louisville",           short: "ULouisville",loc: "Луисвилл",   country: "США", flag: "🇺🇸", qs: 1201, price: 28000, type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Missouri St. Louis",  short: "UMSL",      loc: "Сент-Луис",    country: "США", flag: "🇺🇸", qs: null, price: 22000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Nebraska at Kearney", short: "UNK",       loc: "Кирни",        country: "США", flag: "🇺🇸", qs: null, price: 16000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Nebraska at Omaha",   short: "UNO",       loc: "Омаха",        country: "США", flag: "🇺🇸", qs: null, price: 20000, type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Nevada, Las Vegas",   short: "UNLV",      loc: "Лас-Вегас",    country: "США", flag: "🇺🇸", qs: 1201, price: 25000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of North Carolina at Wilmington",short: "UNCW",loc: "Уилмингтон", country: "США", flag: "🇺🇸", qs: null, price: 23000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of St. Thomas - Minnesota",short: "USTMN",   loc: "Сент-Пол",     country: "США", flag: "🇺🇸", qs: null, price: 46000, type: "Частный",         field: "Law",      levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Tennessee, Knoxville",short: "UTK",       loc: "Ноксвилл",     country: "США", flag: "🇺🇸", qs: 1001, price: 32000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of The Incarnate Word",  short: "UIW",       loc: "Сан-Антонио",  country: "США", flag: "🇺🇸", qs: null, price: 34000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Wisconsin La Crosse", short: "UWLaCrosse",loc: "Ла-Кросс",     country: "США", flag: "🇺🇸", qs: null, price: 18000, type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Wisconsin Oshkosh",   short: "UWOshkosh", loc: "Ошкош",        country: "США", flag: "🇺🇸", qs: null, price: 17500, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Wisconsin Stout",     short: "UWStout",   loc: "Менумони",     country: "США", flag: "🇺🇸", qs: null, price: 20000, type: "Государственный", field: "Design",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Weber State University",             short: "WeberState",loc: "Огден",       country: "США", flag: "🇺🇸", qs: null, price: 18000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Western Michigan University",       short: "WMU",       loc: "Каламазу",     country: "США", flag: "🇺🇸", qs: 1300, price: 20000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Western Washington University",     short: "WWU",       loc: "Беллингем",    country: "США", flag: "🇺🇸", qs: null, price: 29000, type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Wichita State University",           short: "WichitaSt", loc: "Уичито",       country: "США", flag: "🇺🇸", qs: 1889, price: 19000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "Wilmington University",              short: "WilmingtonU",loc: "Нью-Касл",   country: "США", flag: "🇺🇸", qs: null, price: 12500, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },

  /* ========== СЕВЕРНЫЙ КИПР ========== */
  { name: "Eastern Mediterranean University",  short: "EMU",      loc: "Фамагуста",   country: "Северный Кипр", flag: "🇨🇾", qs: 691,  price: 14000, discount: 10000, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "European University of Lefke",      short: "EUL",      loc: "Лефке",       country: "Северный Кипр", flag: "🇨🇾", qs: 901,  price: 5500, discount: 3800, type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "Cyprus International University",   short: "CIU",      loc: "Никосия",     country: "Северный Кипр", flag: "🇨🇾", qs: 525,  price: 7400, discount: 4400,  type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр", meritBased: true },

  /* ========== МАЛАЙЗИЯ ========== */
  { name: "Monash University Malaysia",        short: "Monash",   loc: "Субанг-Джая", country: "Малайзия",      flag: "🇲🇾", qs: 57,   price: 9900,  type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр · PhD", meritBased: true },
  { name: "University of Nottingham Malaysia", short: "UNM",      loc: "Селангор",    country: "Малайзия",      flag: "🇲🇾", qs: 103,  price: 9700,  type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Southampton Malaysia",short: "USMalaysia",loc:"Джохор",      country: "Малайзия",      flag: "🇲🇾", qs: 81,   price: 9500,  type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Heriot-Watt University Malaysia",   short: "HWU",      loc: "Путраджая",   country: "Малайзия",      flag: "🇲🇾", qs: 351,  price: 8000,  type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Sunway University",                 short: "Sunway",   loc: "Субанг-Джая", country: "Малайзия",      flag: "🇲🇾", qs: 451,  price: 6500,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Taylor's University",               short: "Taylor's", loc: "Субанг-Джая", country: "Малайзия",      flag: "🇲🇾", qs: 401,  price: 8000,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Asia Pacific University (APU)",     short: "APU",      loc: "Куала-Лумпур",country: "Малайзия",      flag: "🇲🇾", qs: 501,  price: 7100,  type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр", meritBased: true },
  { name: "HELP University",                   short: "HELP",     loc: "Куала-Лумпур",country: "Малайзия",      flag: "🇲🇾", qs: 601,  price: 5500,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "INTI International University",     short: "INTI",     loc: "Путра-Нилай", country: "Малайзия",      flag: "🇲🇾", qs: 601,  price: 4200,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "IIUM – International Islamic University Malaysia",short:"IIUM",loc:"Куала-Лумпур",country:"Малайзия",flag:"🇲🇾",qs:401,price:4400,type:"Государственный",field:"Law",levels:"Бакалавр · Магистр · PhD"},
  { name: "International Medical University (IMU)",short:"IMU",   loc: "Куала-Лумпур",country: "Малайзия",      flag: "🇲🇾", qs: null, price: 12000, type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр" },
  { name: "Multimedia University (MMU)",        short: "MMU",     loc: "Путраджая",   country: "Малайзия",      flag: "🇲🇾", qs: 501,  price: 5200,  type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University Teknologi Petronas",      short: "UTP",     loc: "Бандар-Сери-Искандар", country:"Малайзия", flag: "🇲🇾", qs: 251, price: 5550, type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD" },
  { name: "Universiti Tunku Abdul Rahman (UTAR)",short:"UTAR",    loc: "Камpar",      country: "Малайзия",      flag: "🇲🇾", qs: 401,  price: 4800,  type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр" },
  { name: "SEGi University",                   short: "SEGi",     loc: "Куала-Лумпур",country: "Малайзия",      flag: "🇲🇾", qs: 701,  price: 4600,  type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр" },
  { name: "Management & Science University (MSU)",short:"MSU",    loc: "Шах-Алам",    country: "Малайзия",      flag: "🇲🇾", qs: 601,  price: 5000,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "MAHSA University",                  short: "MAHSA",    loc: "Куала-Лумпур",country: "Малайзия",      flag: "🇲🇾", qs: null, price: 6000,  type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр" },
  { name: "University of Reading Malaysia",    short: "UoRM",     loc: "Джохор",      country: "Малайзия",      flag: "🇲🇾", qs: 201,  price: 9000,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },
  { name: "Swinburne University Sarawak",      short: "Swinburne",loc: "Кучинг",      country: "Малайзия",      flag: "🇲🇾", qs: 351,  price: 6200,  type: "Частный",         field: "Engineering",  levels: "Бакалавр · Магистр", meritBased: true },
  { name: "University of Cyberjaya (UOC)",     short: "UOC",      loc: "Cyberjaya",   country: "Малайзия",      flag: "🇲🇾", qs: null, price: 5500,  type: "Частный",         field: "Medicine",   levels: "Бакалавр · Магистр" },
  { name: "Le Cordon Bleu Malaysia",           short: "CordonBleu",loc:"Куала-Лумпур",country: "Малайзия",      flag: "🇲🇾", qs: null, price: 11000, type: "Частный",         field: "Design",     levels: "Бакалавр" },
  { name: "UOW Malaysia KDU",                  short: "UOW",      loc: "Шах-Алам",    country: "Малайзия",      flag: "🇲🇾", qs: 501,  price: 6000,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "The One Academy",                   short: "TOA",      loc: "Куала-Лумпур",country: "Малайзия",      flag: "🇲🇾", qs: null, price: 6500,  type: "Частный",         field: "Design",     levels: "Бакалавр" },
  { name: "University Kuala Lumpur (UniKL)",   short: "UniKL",    loc: "Куала-Лумпур",country: "Малайзия",      flag: "🇲🇾", qs: 651,  price: 4400,  type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр" },
  { name: "University Tenaga Nasional (UNITEN)",short:"UNITEN",   loc: "Путраджая",   country: "Малайзия",      flag: "🇲🇾", qs: 601,  price: 4600,  type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр" },
  { name: "Tunku Abdul Rahman University College",short:"TARUC",  loc: "Куала-Лумпур",country: "Малайзия",      flag: "🇲🇾", qs: 501,  price: 3800,  type: "Государственный", field: "IT",         levels: "Колледж · Бакалавр" },
  { name: "UNITAR International University",      short:"UNITAR", loc: "Петалинг-Джая", country: "Малайзия",     flag: "🇲🇾", qs: null, price: 5000,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр", meritBased: true },

  /* ========== ГЕРМАНИЯ ========== */
  { name: "University of Europe for Applied Sciences",short:"UE of Europe",loc:"Берлин",country:"Германия",     flag: "🇩🇪", qs: null, price: 9900,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "Gisma University of Applied Sciences",short:"Gisma",   loc: "Берлин",      country: "Германия",      flag: "🇩🇪", qs: null, price: 8800,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "Constructor University",              short: "CU",      loc: "Бремен",      country: "Германия",      flag: "🇩🇪", qs: null, price: 20000, type: "Частный",         field: "IT",         levels: "Foundation · Бакалавр · Магистр · PhD", meritBased: true },

  /* ========== ПОЛЬША ========== */
  { name: "Vistula University",                short: "Vistula",  loc: "Варшава",     country: "Польша",        flag: "🇵🇱", qs: null, price: 3300,  type: "Частный",         field: "Business",     levels: "Бакалавр · Магистр" },
  { name: "UTA – University of Technologies and Arts",short:"UTA",loc:"Варшава",      country: "Польша",        flag: "🇵🇱", qs: null, price: 2750,  type: "Частный",         field: "Design",     levels: "Бакалавр · Магистр" },
  { name: "VIZJA University",                  short: "VIZJA",    loc: "Варшава",     country: "Польша",        flag: "🇵🇱", qs: null, price: 2200,  type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр" },
  { name: "PJATK – Polish-Japanese Academy",   short: "PJATK",    loc: "Варшава",     country: "Польша",        flag: "🇵🇱", qs: null, price: 3000,  type: "Частный",         field: "IT",         levels: "Бакалавр · Магистр" },

  /* ========== АВСТРИЯ ========== */
  { name: "University of Vienna",              short: "UniWien",  loc: "Вена",        country: "Австрия",       flag: "🇦🇹", qs: 137,  price: 880,   type: "Государственный", field: "Law",      levels: "Бакалавр · Магистр · PhD" },
  { name: "Vienna University of Economics and Business",short:"WU",loc:"Вена",        country: "Австрия",       flag: "🇦🇹", qs: 201,  price: 880,   type: "Государственный", field: "Business",     levels: "Бакалавр · Магистр · PhD" },
  { name: "Vienna University of Technology",   short: "TU Wien",  loc: "Вена",        country: "Австрия",       flag: "🇦🇹", qs: 176,  price: 880,   type: "Государственный", field: "Engineering",  levels: "Бакалавр · Магистр · PhD" },
  { name: "Medical University of Vienna",      short: "MedUni Wien",loc:"Вена",       country: "Австрия",       flag: "🇦🇹", qs: 251,  price: 880,   type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · PhD" },
  { name: "Medical University of Graz",        short: "MedUni Graz",loc:"Грац",       country: "Австрия",       flag: "🇦🇹", qs: 301,  price: 880,   type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · PhD" },
  { name: "Medical University of Innsbruck",   short: "MedUni Innsbruck",loc:"Инсбрук",country:"Австрия",       flag: "🇦🇹", qs: 301,  price: 880,   type: "Государственный", field: "Medicine",   levels: "Бакалавр · Магистр · PhD" },
  { name: "Johannes Kepler University Linz",   short: "JKU Linz", loc: "Линц",        country: "Австрия",       flag: "🇦🇹", qs: 601,  price: 880,   type: "Государственный", field: "IT",         levels: "Бакалавр · Магистр · PhD" },
  { name: "Vienna University of Applied Arts", short: "Angewandte",loc:"Вена",        country: "Австрия",       flag: "🇦🇹", qs: 351,  price: 880,   type: "Государственный", field: "Design",     levels: "Бакалавр · Магистр" },
  { name: "University of Music and Performing Arts Vienna",short:"MDW",loc:"Вена",    country: "Австрия",       flag: "🇦🇹", qs: null, price: 880,   type: "Государственный", field: "Design",     levels: "Бакалавр · Магистр" },
];

/* ISO country codes for flag images (flagcdn.com) */
const COUNTRY_ISO = {
  "Италия": "it", "США": "us", "Австрия": "at",
  "Германия": "de", "Польша": "pl", "Северный Кипр": "trnc", "Малайзия": "my",
};

/* Флага ТРСК нет на flagcdn (там "cy" — Республика Кипр),
   поэтому для него лежат локальные PNG тех же размеров */
const FLAG_URL = (iso, size) =>
  iso === "trnc" ? `images/flags/trnc/${size}.png` : `https://flagcdn.com/${size}/${iso}.png`;

/* Generated logo map: short → path */
const LOGO_MAP = {
  // Италия
  "PoliMi":"images/logos/catalog/polimi.png",   "Bocconi":"images/logos/catalog/bocconi.png",
  "UniBo":"images/logos/catalog/unibo.png",      "Sapienza":"images/logos/catalog/sapienza.png",
  "UniPD":"images/logos/catalog/unipd.png",      "CaFosc":"images/logos/catalog/cafoscari.png",
  "LUISS":"images/logos/catalog/luiss.png",      "PoliTO":"images/logos/catalog/polito.png",
  "UniMi":"images/logos/catalog/unimi.png",      "UniTO":"images/logos/catalog/unito.png",
  "TorVerg":"images/logos/catalog/tverga.png",   "UniFI":"images/logos/catalog/unifi.png",
  "LUMSA":"images/logos/catalog/lumsa.png",      "IULM":"images/logos/catalog/iulm.png",
  "Marang":"images/logos/catalog/marang.png",    "Roma3":"images/logos/catalog/roma3.png",
  "UNIVPM":"images/logos/catalog/univpm.png",    "RUFA":"images/logos/catalog/rufa.png",
  "LUM":"images/logos/catalog/lum.png",
  "UniPI":"images/logos/catalog/unipi.svg",      "UniSI":"images/logos/catalog/unisi.png",
  "UniPV":"images/logos/catalog/unipv.svg",      "UniTN":"images/logos/catalog/unitn.svg",
  "UniTS":"images/logos/catalog/units.svg",      "UniBS":"images/logos/catalog/unibs.svg",
  "UniPR":"images/logos/catalog/unipr.svg",      "UniMiB":"images/logos/catalog/unimib.png",
  "UniGE":"images/logos/catalog/unige.svg",      "UniPA":"images/logos/catalog/unipa.png",
  "UniME":"images/logos/catalog/unime.gif",      "UniCT":"images/logos/catalog/unict.svg",
  "UniSA":"images/logos/catalog/unisa.png",      "UniCAS":"images/logos/catalog/unicas.svg",
  "UniUD":"images/logos/catalog/uniud.webp",     "UniCamp":"images/logos/catalog/unicamp.png",
  "UniBa":"images/logos/catalog/uniba.png",      "LinkCU":"images/logos/catalog/linkcu.png",
  // США
  "Roosevelt":"images/logos/catalog/roosevelt.png",   "Bellevue":"images/logos/catalog/bellevue.png",
  "LaSalle":"images/logos/catalog/lasalle.png",       "K-Zoo":"images/logos/catalog/kzoo.png",
  "Westcliff":"images/logos/catalog/westcliff.png",   "UB":"images/logos/catalog/ub.png",
  "UE":"images/logos/catalog/ue.png",                 "DePaul":"images/logos/catalog/depaul.png",
  "Rowan":"images/logos/catalog/rowan.png",           "HarrisU":"images/logos/catalog/harrisu.png",
  "UST":"images/logos/catalog/ust.png",               "ASU":"images/logos/catalog/asu.png",
  "CalState":"images/logos/catalog/calstate.png",     "SJSU":"images/logos/catalog/sjsu.png",
  "GGU":"images/logos/catalog/ggu.png",               "MU":"images/logos/catalog/mu.png",
  "Adelphi":"images/logos/catalog/adelphi.png",       "UC":"images/logos/catalog/uc.png",
  "Temple":"images/logos/catalog/temple.png",         "Drexel":"images/logos/catalog/drexel.png",
  "Suffolk":"images/logos/catalog/suffolk.png",       "Pace":"images/logos/catalog/pace.png",
  "UArizona":"images/logos/catalog/uarizona.png",     "FIU":"images/logos/catalog/fiu.png",
  "UConn":"images/logos/catalog/uconn.png",           "Clarkson":"images/logos/catalog/clarkson.png",
  "ColChic":"images/logos/catalog/colchic.png",       "NYFA":"images/logos/catalog/nyfa.png",
  "Webster":"images/logos/catalog/webster.png",       "Simmons":"images/logos/catalog/simmons.png",
  "FloridaTech":"images/logos/catalog/floridatech.png","NAU":"images/logos/catalog/nau.png",
  "Radford":"images/logos/catalog/radford.png",       "Concord":"images/logos/catalog/concord.png",
  "UAlbany":"images/logos/catalog/ualb.png",
  "CWU":"images/logos/catalog/cwu.png",               "ConnColl":"images/logos/catalog/conncoll.png",
  "SFBU":"images/logos/catalog/sfbu.png",
  "Lynn":"images/logos/catalog/lynn.png",         "UTulsa":"images/logos/catalog/utulsa.png",
  "USF":"images/logos/catalog/usf.png",           "Gannon":"images/logos/catalog/gannon.png",
  "FNU":"images/logos/catalog/fnu.jpg",           "SFSU":"images/logos/catalog/sfsu.png",
  // США — Колледжи
  "DeAnza":"images/logos/catalog/deanza.svg",   "GreenRiver":"images/logos/catalog/greenriver.png",
  "SCC":"images/logos/catalog/scc.png",         "SMC":"images/logos/catalog/smc.svg",
  "LACC":"images/logos/catalog/lacc.svg",       "CCC":"images/logos/catalog/ccc.png",
  "LWIT":"images/logos/catalog/lwit.svg",       "CCSF":"images/logos/catalog/ccsf.png",
  "CSI":"images/logos/catalog/csi.png",
  // Австрия
  "UniWien":"images/logos/catalog/uniwien.png",  "WU":"images/logos/catalog/wu.png",
  "TU Wien":"images/logos/catalog/tuwien.png",   "MedUni Wien":"images/logos/catalog/muw.png",
  "MedUni Graz":"images/logos/catalog/mug.png",  "MedUni Innsbruck":"images/logos/catalog/mui.png",
  "JKU Linz":"images/logos/catalog/jku.png",
  // Германия
  "UE of Europe":"images/logos/catalog/ueeurope.png", "Gisma":"images/logos/catalog/gisma.png",
  "CU":"images/logos/catalog/cu.png",
  /* --- Shorelight/ApplyWave USA partners logos --- */
  "Rutgers":"images/logos/catalog/rutgers.png",
  "SBU":"images/logos/catalog/sbu.png",
  "Tulane":"images/logos/catalog/tulane.png",
  "UIC":"images/logos/catalog/uic.png",
  "Auburn":"images/logos/catalog/auburn.png",
  "Gonzaga":"images/logos/catalog/gonzaga.png",
  "UCF":"images/logos/catalog/ucf.png",
  "UofSC":"images/logos/catalog/uofsc.png",
  "SeattleU":"images/logos/catalog/seattleu.png",
  "MontanaSt":"images/logos/catalog/montanast.png",
  "NewHaven":"images/logos/catalog/newhaven.png",
  "AU":"images/logos/catalog/au.png",
  "JHU":"images/logos/catalog/jhu.png",
  "UVA":"images/logos/catalog/uva.png",
  "Pepperdine":"images/logos/catalog/pepperdine.png",
  "UTSA":"images/logos/catalog/utsa.png",
  "UDayton":"images/logos/catalog/udayton.png",
  "UNR":"images/logos/catalog/unr.png",
  "UMassB":"images/logos/catalog/umassb.png",
  "MissouriST":"images/logos/catalog/missourist.png",
  "ClevSt":"images/logos/catalog/clevst.png",
  "RMU":"images/logos/catalog/rmu.png",
  "Belmont":"images/logos/catalog/belmont.png",
  "OCU":"images/logos/catalog/ocu.png",
  "UWyo":"images/logos/catalog/uwyo.png",
  "RuCamden":"images/logos/catalog/rucamden.png",
  "UtahTech":"images/logos/catalog/utahtech.png",
  "UWEC":"images/logos/catalog/uwec.png",
  "UWGB":"images/logos/catalog/uwgb.png",
  "UWWW":"images/logos/catalog/uwww.png",
  "UWRF":"images/logos/catalog/uwrf.png",
  "UWSup":"images/logos/catalog/uwsup.png",
  "UWSP":"images/logos/catalog/uwsp.png",
  "UISG":"images/logos/catalog/uisg.png",
  "Bellarmine":"images/logos/catalog/bellarmine.png",
  "DeanC":"images/logos/catalog/deanc.png",
  "Eureka":"images/logos/catalog/eureka.png",
  "Felician":"images/logos/catalog/felician.png",
  "Hanover":"images/logos/catalog/hanover.png",
  "Hartwick":"images/logos/catalog/hartwick.png",
  "Hiram":"images/logos/catalog/hiram.png",
  "HolyCross":"images/logos/catalog/holycross.png",
  "Lakeland":"images/logos/catalog/lakeland.png",
  "LewisU":"images/logos/catalog/lewisu.png",
  "McMurry":"images/logos/catalog/mcmurry.png",
  "Moravian":"images/logos/catalog/moravian.png",
  "MtStMary":"images/logos/catalog/mtstmary.png",
  "OhioWes":"images/logos/catalog/ohiowes.png",
  "PalmBeach":"images/logos/catalog/palmbeach.png",
  "SaintMaryMN":"images/logos/catalog/saintmarymn.png",
  "SalveRegina":"images/logos/catalog/salveregina.png",
  "Schreiner":"images/logos/catalog/schreiner.png",
  "StCatherine":"images/logos/catalog/stcatherine.png",
  "StThomasAQ":"images/logos/catalog/stthomasaq.png",
  "TrinityCC":"images/logos/catalog/trinitycc.png",
  "UCharleston":"images/logos/catalog/ucharleston.png",
  "UMountUnion":"images/logos/catalog/umountunion.png",
  "UNE":"images/logos/catalog/une.png",
  "URedlands":"images/logos/catalog/uredlands.png",
  "USaintMary":"images/logos/catalog/usaintmary.png",
  "VirginiaWes":"images/logos/catalog/virginiawes.png",
  "WashJeff":"images/logos/catalog/washjeff.png",
  "WesternOR":"images/logos/catalog/westernor.png",
  "Whittier":"images/logos/catalog/whittier.png",
  "Widener":"images/logos/catalog/widener.png",
  "Wilson":"images/logos/catalog/wilson.png",
  "DakotaWes":"images/logos/catalog/dakotawes.png",
  "CentralMeth":"images/logos/catalog/centralmeth.png",
  "AuburnMont":"images/logos/catalog/auburnmont.png",
  "Brescia":"images/logos/catalog/brescia.png",
  // Польша
  "Vistula":"images/logos/catalog/vistula.png",  "UTA":"images/logos/catalog/uta.png",
  "VIZJA":"images/logos/catalog/vizja.png",      "PJATK":"images/logos/catalog/pjatk.png",
  // Малайзия
  "Monash":"images/logos/catalog/monash.png",       "UNM":"images/logos/catalog/unm.png",
  "USMalaysia":"images/logos/catalog/usoton.png",   "HWU":"images/logos/catalog/hwu.png",
  "Sunway":"images/logos/catalog/sunway.png",       "Taylor's":"images/logos/catalog/taylors.png",
  "APU":"images/logos/catalog/apu.png",             "HELP":"images/logos/catalog/help.png",
  "INTI":"images/logos/catalog/inti.png",           "IIUM":"images/logos/catalog/iium.png",
  "IMU":"images/logos/catalog/imu.png",             "MMU":"images/logos/catalog/mmu.png",
  "UTP":"images/logos/catalog/utp.png",             "UTAR":"images/logos/catalog/utar.png",
  "SEGi":"images/logos/catalog/segi.png",           "MSU":"images/logos/catalog/msu.png",
  "MAHSA":"images/logos/catalog/mahsa.png",         "UoRM":"images/logos/catalog/uorm.png",
  "Swinburne":"images/logos/catalog/swinburne.png", "UOC":"images/logos/catalog/uoc.png",
  "CordonBleu":"images/logos/catalog/lcb.png",      "UOW":"images/logos/catalog/uow.png",
  "TOA":"images/logos/catalog/toa.png",             "UniKL":"images/logos/catalog/unikl.png",
  "UNITEN":"images/logos/catalog/uniten.png",       "TARUC":"images/logos/catalog/taruc.png",
  // Северный Кипр
  "EMU":"images/logos/catalog/emu.png",  "EUL":"images/logos/catalog/eul.png",
  "CIU":"images/logos/catalog/ciu.png",
  // Италия — дополнительные
  "Bocconi":"images/logos/catalog/bocconi.svg",
  "Sapienza":"images/logos/catalog/sapienza.png",
  "CaFosc":"images/logos/catalog/cafoscari.svg",
  "PoliTO":"images/logos/catalog/polito.svg",
  "UniTO":"images/logos/catalog/unito.svg",
  "UniFI":"images/logos/catalog/unifi.png",
  "UniSI":"images/logos/catalog/unisi.svg",
  "UniTN":"images/logos/catalog/unitn.svg",
  "UniBS":"images/logos/catalog/unibs.svg",
  "IULM":"images/logos/catalog/iulm.png",
  "UniMiB":"images/logos/catalog/unimib.png",
  "Roma3":"images/logos/catalog/roma3.png",
  "UniPA":"images/logos/catalog/unipa.png",
  "UniCT":"images/logos/catalog/unict.svg",
  "UniCAS":"images/logos/catalog/unicas.svg",
  "UniCamp":"images/logos/catalog/unicamp.png",
  "LinkCU":"images/logos/catalog/linkcu.png",
  "RUFA":"images/logos/catalog/rufa.png",
  // США — дополнительные
  "Bellevue":"images/logos/catalog/bellevue.png",
  "K-Zoo":"images/logos/catalog/kzoo.svg",
  "UB":"images/logos/catalog/ub.svg",
  "DePaul":"images/logos/catalog/depaul.png",
  "HarrisU":"images/logos/catalog/harrisu.png",
  "ASU":"images/logos/catalog/asu.png",
  "SJSU":"images/logos/catalog/sjsu.png",
  "MU":"images/logos/catalog/mu.png",
  "UC":"images/logos/catalog/uc.png",
  "Drexel":"images/logos/catalog/drexel.png",
  "Pace":"images/logos/catalog/pace.png",
  "FIU":"images/logos/catalog/fiu.png",
  "Clarkson":"images/logos/catalog/clarkson.png",
  "NYFA":"images/logos/catalog/nyfa.png",
  "Simmons":"images/logos/catalog/simmons.svg",
  "NAU":"images/logos/catalog/nau.png",
  "Concord":"images/logos/catalog/concord.svg",
  "ConnColl":"images/logos/catalog/conncoll.svg",
  "GreenRiver":"images/logos/catalog/greenriver.svg",
  "SMC":"images/logos/catalog/smc.svg",
  "CCC":"images/logos/catalog/ccc.png",
  "CCSF":"images/logos/catalog/ccsf.png",
  // Малайзия — дополнительные
  "UNITAR":"images/logos/catalog/unitar.png",
  "UNM":"images/logos/catalog/unm.png",
  "HWU":"images/logos/catalog/hwu.png",
  "Taylor's":"images/logos/catalog/taylors.png",
  "HELP":"images/logos/catalog/help.png",
  "IIUM":"images/logos/catalog/iium.png",
  "MMU":"images/logos/catalog/mmu.png",
  "UTAR":"images/logos/catalog/utar.png",
  "MSU":"images/logos/catalog/msu.png",
  "UoRM":"images/logos/catalog/uorm.png",
  "UOC":"images/logos/catalog/uoc.png",
  "UOW":"images/logos/catalog/uow.png",
  "UniKL":"images/logos/catalog/unikl.png",
  "TARUC":"images/logos/catalog/taruc.svg",
  // Австрия
  "WU":"images/logos/catalog/wu.svg",
  "MedUni Innsbruck":"images/logos/catalog/meduniinnsbruck.svg",
  "Angewandte":"images/logos/catalog/angewandte.svg",
  "MDW":"images/logos/catalog/mdw.svg",
  // Польша
  "UTA":"images/logos/catalog/uta.png",
  "PJATK":"images/logos/catalog/pjatk.png",
  // Германия
  "Gisma":"images/logos/catalog/gisma.png",
  // США — колледжи/доп
  "SCSS":"images/logos/catalog/scss.png",
};

/* ---------- Campus photos (banner background) by short code ---------- */
const CAMPUS_MAP = {
  // Италия
  "PoliMi":"images/campus/polimi.jpg",       "Bocconi":"images/campus/bocconi.jpg",
  "UniBo":"images/campus/unibo.jpg",         "Sapienza":"images/campus/sapienza.jpg",
  "UniPD":"images/campus/unipd.jpg",
  "CaFosc":"images/campus/cafoscari.jpg",    "LUISS":"images/campus/luiss.jpg",
  "PoliTO":"images/campus/polito.jpg",       "UniMi":"images/campus/unimi.jpg",
  "UniTO":"images/campus/unito.jpg",         "UniPI":"images/campus/unipi.jpg",
  "TorVerg":"images/campus/torverg.webp",    "UniFI":"images/campus/unifi.jpg",
  "UniSI":"images/campus/unisi.jpg",         "UniPV":"images/campus/unipv.jpg",
  "UniTN":"images/campus/unitn.jpg",         "UniTS":"images/campus/units.jpg",
  "UniPR":"images/campus/unipr.jpg",         "IULM":"images/campus/iulm.avif",
  "UniMiB":"images/campus/unimib.jpg",       "UniGE":"images/campus/unige.jpg",
  "Roma3":"images/campus/roma3.jpg",         "UniPA":"images/campus/unipa.webp",
  "UniME":"images/campus/unime.jpg",         "UniCT":"images/campus/unict.jpg",
  "UniSA":"images/campus/unisa.jpg",         "UniCAS":"images/campus/unicas.jpg",
  "UniUD":"images/campus/uniud.webp",        "UniCamp":"images/campus/unicamp.jpg",
  "UniBa":"images/campus/uniba.jpg",         "UNIVPM":"images/campus/univpm.jpg",
  "LinkCU":"images/campus/linkcu.jpg",       "RUFA":"images/campus/rufa.jpg",
  "LUM":"images/campus/lum.jpg",
  "LUMSA":"images/campus/lumsa.jpg",     "Marang":"images/campus/marang.jpg",
  "UniBS":"images/campus/unibs.jpg",
  // США
  "Roosevelt":"images/campus/roosevelt.jpg", "Bellevue":"images/campus/bellevue.webp",
  "LaSalle":"images/campus/lasalle.avif",    "K-Zoo":"images/campus/kzoo.jpg",
  "Westcliff":"images/campus/westcliff.jpg", "UB":"images/campus/ub.jpg",
  "UE":"images/campus/ue.webp",              "DePaul":"images/campus/depaul.jpg",
  "Rowan":"images/campus/rowan.jpg",         "HarrisU":"images/campus/harrisu.jpg",
  "UST":"images/campus/ust.jpg",             "ASU":"images/campus/asu.jpg",
  "CalState":"images/campus/calstate.jpg",   "SJSU":"images/campus/sjsu.jpg",
  "GGU":"images/campus/ggu.webp",            "MU":"images/campus/mu.webp",
  "Adelphi":"images/campus/adelphi.jpg",     "UC":"images/campus/uc.jpg",
  "Temple":"images/campus/temple.jpg",       "Drexel":"images/campus/drexel.jpg",
  "Suffolk":"images/campus/suffolk.jpg",     "Pace":"images/campus/pace.webp",
  "UArizona":"images/campus/uarizona.jpg",   "FIU":"images/campus/fiu.webp",
  "UConn":"images/campus/uconn.jpg",         "Clarkson":"images/campus/clarkson.webp",
  "ColChic":"images/campus/colchic.jpg",     "NYFA":"images/campus/nyfa.jpg",
  "Webster":"images/campus/webster.jpg",     "Simmons":"images/campus/simmons.jpg",
  "FloridaTech":"images/campus/floridatech.jpg","NAU":"images/campus/nau.jpg",
  "Radford":"images/campus/radford.jpg",     "Concord":"images/campus/concord.jpg",
  "UAlbany":"images/campus/ualbany.jpg",     "CWU":"images/campus/cwu.jpg",
  "ConnColl":"images/campus/conncoll.jpg",   "SFBU":"images/campus/sfbu.jpg",
  "SCSS":"images/campus/scss.jpg",
  "Lynn":"images/campus/lynn.jpg",     "UTulsa":"images/campus/utulsa.jpg",
  "USF":"images/campus/usf.jpg",       "Gannon":"images/campus/gannon.jpg",
  "FNU":"images/campus/fnu.webp",      "SFSU":"images/campus/sfsu.png",
  // США — колледжи
  "DeAnza":"images/campus/deanza.webp",      "GreenRiver":"images/campus/greenriver.jpg",
  "SCC":"images/campus/scc.webp",            "SMC":"images/campus/smc.jpg",
  "LACC":"images/campus/lacc.jpg",           "CCC":"images/campus/ccc.jpg",
  "LWIT":"images/campus/lwit.jpg",           "CCSF":"images/campus/ccsf.jpg",
  "CSI":"images/campus/csi.jpg",
  // Австрия
  "UniWien":"images/campus/uniwien.jpg",     "WU":"images/campus/wu.jpg",
  "TU Wien":"images/campus/tuwien.jpg",      "MedUni Wien":"images/campus/meduniwien.jpg",
  "MedUni Graz":"images/campus/medunigraz.jpg","MedUni Innsbruck":"images/campus/meduniinnsbruck.webp",
  "JKU Linz":"images/campus/jkulinz.jpg",    "Angewandte":"images/campus/angewandte.jpg",
  "MDW":"images/campus/mdw.jpg",
  // Германия
  "Gisma":"images/campus/gisma.webp",
  // Польша
  "Vistula":"images/campus/vistula.jpg",     "UTA":"images/campus/uta.jpg",
  "VIZJA":"images/campus/vizja.avif",        "PJATK":"images/campus/pjatk.jpg",
  // Малайзия
  "Monash":"images/campus/monash.jpg",       "UNM":"images/campus/unm.jpg",
  "USMalaysia":"images/campus/usmalaysia.jpg","HWU":"images/campus/hwu.jpg",
  "Sunway":"images/campus/sunway.jpg",       "Taylor's":"images/campus/taylors.avif",
  "APU":"images/campus/apu.jpg",             "HELP":"images/campus/help.jpg",
  "INTI":"images/campus/inti.jpg",           "IIUM":"images/campus/iium.jpg",
  "IMU":"images/campus/imu.jpg",             "MMU":"images/campus/mmu.jpg",
  "UTP":"images/campus/utp.jpg",             "SEGi":"images/campus/segi.jpg",
  "MSU":"images/campus/msu.jpg",             "MAHSA":"images/campus/mahsa.png",
  "UoRM":"images/campus/uorm.jpg",           "Swinburne":"images/campus/swinburne.jpg",
  "UOC":"images/campus/uoc.jpg",             "CordonBleu":"images/campus/cordonbleu.jpg",
  "TOA":"images/campus/toa.webp",            "UniKL":"images/campus/unikl.avif",
  "UNITEN":"images/campus/uniten.jpg",       "TARUC":"images/campus/taruc.jpg",
  "UOW":"images/campus/uow.jpg",             "UTAR":"images/campus/utar.jpg",
  "UNITAR":"images/campus/unitar.jpg",
  // Северный Кипр
  "CIU":"images/campus/ciu.jpg",
  "EMU":"images/campus/emu.jpg",             "EUL":"images/campus/eul.png",
  // Германия
  "UE of Europe":"images/campus/ueeurope.png",
  "CU":"images/campus/cu.webp",
  /* --- Shorelight/ApplyWave USA partners campus photos (Wikimedia) --- */
  "Rutgers":"images/campus/rutgers.jpg",
  "SBU":"images/campus/sbu.jpg",
  "Tulane":"images/campus/tulane.jpg",
  "Villanova":"images/campus/villanova.jpg",
  "UIC":"images/campus/uic.jpg",
  "Auburn":"images/campus/auburn.jpg",
  "Gonzaga":"images/campus/gonzaga.jpg",
  "UCF":"images/campus/ucf.jpg",
  "UofSC":"images/campus/uofsc.jpg",
  "LSU":"images/campus/lsu.jpg",
  "KU":"images/campus/ku.jpg",
  "MontanaSt":"images/campus/montanast.jpg",
  "NewSchool":"images/campus/newschool.jpg",
  "AU":"images/campus/au.jpg",
  "JHU":"images/campus/jhu.jpg",
  "UVA":"images/campus/uva.jpg",
  "Pepperdine":"images/campus/pepperdine.jpg",
  "UUtah":"images/campus/uutah.jpg",
  "UTSA":"images/campus/utsa.jpg",
  "UDayton":"images/campus/udayton.jpg",
  "Pacific":"images/campus/pacific.jpg",
  "UNR":"images/campus/unr.jpg",
  "UMassB":"images/campus/umassb.jpg",
  "MissouriST":"images/campus/missourist.jpg",
  "ClevSt":"images/campus/clevst.jpg",
  "Belmont":"images/campus/belmont.jpg",
  "OCU":"images/campus/ocu.jpg",
  "UWyo":"images/campus/uwyo.jpg",
  "UPortland":"images/campus/uportland.jpg",
  "UtahTech":"images/campus/utahtech.jpg",
  "UISG":"images/campus/uisg.jpg",
  "UAF":"images/campus/uaf.jpg",
  "Bellarmine":"images/campus/bellarmine.jpg",
  "CarrollU":"images/campus/carrollu.jpg",
  "DeanC":"images/campus/deanc.jpg",
  "Eureka":"images/campus/eureka.jpg",
  "Felician":"images/campus/felician.jpg",
  "Hanover":"images/campus/hanover.jpg",
  "Hartwick":"images/campus/hartwick.jpg",
  "Hiram":"images/campus/hiram.jpg",
  "IllinoisWes":"images/campus/illinoiswes.jpg",
  "Lakeland":"images/campus/lakeland.jpg",
  "Moravian":"images/campus/moravian.jpg",
  "OhioWes":"images/campus/ohiowes.jpg",
  "PalmBeach":"images/campus/palmbeach.jpg",
  "RandolphC":"images/campus/randolphc.jpg",
  "SaintMaryMN":"images/campus/saintmarymn.jpg",
  "SalveRegina":"images/campus/salveregina.jpg",
  "Schreiner":"images/campus/schreiner.jpg",
  "StCatherine":"images/campus/stcatherine.jpg",
  "StMaryCA":"images/campus/stmaryca.jpg",
  "StThomasAQ":"images/campus/stthomasaq.jpg",
  "UCharleston":"images/campus/ucharleston.jpg",
  "UDubuque":"images/campus/udubuque.jpg",
  "UMountUnion":"images/campus/umountunion.jpg",
  "UNE":"images/campus/une.jpg",
  "URedlands":"images/campus/uredlands.jpg",
  "USaintMary":"images/campus/usaintmary.jpg",
  "WesternOR":"images/campus/westernor.jpg",
  "Whittier":"images/campus/whittier.jpg",
  "Widener":"images/campus/widener.jpg",
  "Wilson":"images/campus/wilson.jpg",
  "BridgewaterC":"images/campus/bridgewaterc.jpg",
  "DakotaWes":"images/campus/dakotawes.jpg",
  "CentralMeth":"images/campus/centralmeth.jpg",
  "AuburnMont":"images/campus/auburnmont.jpg",
  "Brescia":"images/campus/brescia.jpg",
};

/* ---------- Country visual palette for campus banner ---------- */
const COUNTRY_PALETTE = {
  "Италия":        "linear-gradient(135deg,#c1440e 0%,#8b2a00 100%)",
  "США":           "linear-gradient(135deg,#0a2463 0%,#1b4f9b 100%)",
  "Австрия":       "linear-gradient(135deg,#b01020 0%,#6a0812 100%)",
  "Германия":      "linear-gradient(135deg,#2a2a3e 0%,#14141e 100%)",
  "Польша":        "linear-gradient(135deg,#c0102e 0%,#780818 100%)",
  "Северный Кипр": "linear-gradient(135deg,#0d7070 0%,#054040 100%)",
  "Малайзия":      "linear-gradient(135deg,#005830 0%,#003018 100%)",
};

/* Ключевые факультеты по профилю вуза — дефолт, переопределяется полем `faculties` в данных */
const FIELD_FACULTIES = {
  "IT":         ["Computer Science", "Data Science", "Cybersecurity"],
  "Business":     ["Business Administration", "Management", "Marketing"],
  "Medicine":   ["Medicine", "Pharmacy", "Nursing"],
  "Law":      ["Law", "International Relations", "Political Science"],
  "Engineering":  ["Engineering", "Architecture", "Robotics"],
  "Design":     ["Design", "Fashion", "Media & Arts"],
  "Economics":  ["Economics", "Finance", "Banking"],
  "Education": ["Education", "Psychology", "Humanities"],
};

/* ---------- Enrich: compute derived / default fields ---------- */
function enrich(u) {
  const italy    = u.country === "Италия";
  const usa      = u.country === "США";
  const austria  = u.country === "Австрия";
  const germany  = u.country === "Германия";
  const malaysia = u.country === "Малайзия";
  const poland   = u.country === "Польша";
  const cyprus   = u.country === "Северный Кипр";

  const intake = u.intake ?? (
    italy   ? ["Осень"] :
    usa     ? ["Осень","Весна","Лето"] :
    (austria || germany) ? ["Осень","Зима"] :
    (malaysia || cyprus) ? ["Осень","Зима","Весна"] :
    ["Осень","Зима"]
  );

  const engTests = u.engTests ?? (
    italy && u.type === "Государственный"
              ? ["IELTS","TOEFL"] :
    italy     ? ["IELTS","TOEFL","DET"] :
    usa       ? ["TOEFL","IELTS","DET"] :
    (austria || germany)
              ? ["IELTS","TOEFL"] :
    malaysia  ? ["IELTS","TOEFL","DET"] :
    poland    ? ["IELTS","TOEFL","DET"] :
    cyprus    ? ["IELTS","DET"] :
    ["IELTS","TOEFL"]
  );

  const exams = u.exams ?? (
    italy && u.field === "Medicine" ? ["IMAT","Cent-s/Tolc"] :
    italy   ? ["Cent-s/Tolc"] :
    usa     ? ["SAT"] :
    []
  );

  const gpaMin = u.gpaMin ?? (
    (u.qs && u.qs <= 200) ? "3/4"   :
    (u.qs && u.qs <= 400) ? "2.5/4" :
    "2/4"
  );

  const faculties = u.faculties ?? (FIELD_FACULTIES[u.field] || [u.field]);

  return {
    dormitory:   true,
    exchange:    u.type === "Государственный",
    financialAid: !!(u.meritBased || u.needBased),
    needBased:   u.needBased  ?? false,
    meritBased:  u.meritBased ?? false,
    campus:      CAMPUS_MAP[u.short] ?? null,
    logo:        LOGO_MAP[u.short] ?? null,
    ...u,
    intake,
    engTests,
    exams,
    gpaMin,
    faculties,
  };
}

/* Admin-edited content (content.js) wins over the hardcoded list */
const UNIS_SRC = window.eaContent ? window.eaContent("unis", UNIS_RAW) : UNIS_RAW;
const UNIS = UNIS_SRC.map(enrich);
/* Программа = уровень обучения вуза (Бакалавр, Магистр…) — единица счёта в каталоге */
const uniLevels = u => u.levels.split("·").map(s => s.trim());
const TOTAL_PROGRAMS = UNIS.reduce((n, u) => n + uniLevels(u).length, 0);

/* ============================================================
   PROGRAM LIST PER UNI — authored cards from uni-data.js when
   present, otherwise auto-built from catalog data. Shared with
   university.html (uni-page.jsx) via window.eaUniPrograms.
   ============================================================ */
const PROG_FIELD_EN = {
  "IT": "Information Technology",
};
const PROG_SEASON_EN = { "Осень": "Fall", "Весна": "Spring", "Зима": "Winter", "Лето": "Summer" };

function eaAutoProgram(u, level) {
  const fieldEn = PROG_FIELD_EN[u.field] || u.field || "Degree";
  const tests = (u.engTests && u.engTests.length) ? u.engTests : ["IELTS", "TOEFL"];
  const langTest = tests.join(" / ");
  const exams = (u.exams && u.exams.length) ? u.exams.join(", ") : "Not required";
  const isB = level === "bachelor";
  const seasons = (u.intake || []).map((s) => PROG_SEASON_EN[s] || s);
  const funding = u.needBased ? "Need-based grant" : (u.meritBased ? "Merit scholarship" : "");
  return {
    level,
    title: fieldEn + (isB ? " — Bachelor" : " — Master"),
    tags: [fieldEn, isB ? "Bachelor's" : "Master's"],
    tuition: u.price ? "$" + u.price.toLocaleString("en-US") + " / year" : "",
    funding,
    language: "English",
    entrance: langTest,
    requirements: [
      "Minimum GPA: " + (u.gpaMin || "—"),
      "English test: " + langTest,
      "Prior education: " + (isB ? "High-school diploma (11 years)" : "Bachelor's degree"),
      "Entrance exams: " + exams,
    ],
    deadlines: seasons.length ? ["Intakes: " + seasons.join(" · ")] : [],
  };
}

function eaUniPrograms(u) {
  const det = (window.EA_UNI_DETAILS || {})[u.short];
  const authored = (det && Array.isArray(det.programs)) ? det.programs.filter(Boolean) : [];
  if (authored.length) return authored;
  const lv = u.levels || "";
  const out = [];
  if (lv.includes("Бакалавр") || lv.includes("Колледж") || lv.includes("Foundation")) out.push(eaAutoProgram(u, "bachelor"));
  if (lv.includes("Магистр")) out.push(eaAutoProgram(u, "master"));
  if (!out.length) out.push(eaAutoProgram(u, "bachelor"));
  return out;
}
window.eaUniPrograms = eaUniPrograms;

/* Program-level matching for catalog search / field filter */
const PROG_TAGS = v => Array.isArray(v) ? v : (v ? String(v).split(/[·,]/).map(s => s.trim()).filter(Boolean) : []);
const FIELD_KEYWORDS = {
  IT:          ["information technology", "computer", "data science", "software", "informatics", "artificial intelligence", "cyber"],
  Business:    ["business", "management", "marketing", "finance", "mba"],
  Medicine:    ["medicine", "medical", "nursing", "pharmacy", "dentistry", "health", "biomed"],
  Law:         ["law", "legal"],
  Engineering: ["engineering", "mechanical", "civil", "electrical", "construction", "aerospace"],
  Design:      ["design", "architecture", "fashion", "fine art"],
  Economics:   ["economics", "economic"],
  Education:   ["education", "teaching", "pedagog"],
};
function progMatchesField(p, u, field) {
  const tags = PROG_TAGS(p.tags);
  const hay = ((p.title || "") + " " + tags.join(" ")).toLowerCase();
  const kws = FIELD_KEYWORDS[field] || [field.toLowerCase()];
  if (kws.some(k => hay.includes(k))) return true;
  /* an untagged program inherits its uni's field */
  return tags.length === 0 && u.field === field;
}
const PROG_LEVEL_RU = { "Бакалавр": "bachelor", "Колледж": "bachelor", "Foundation": "foundation", "Магистр": "master", "PhD": "phd" };

/* ---------- Filter constants ---------- */
const ALL_COUNTRIES = ["Италия","США","Северный Кипр","Малайзия","Германия","Польша","Австрия"];
const FIELDS   = ["IT","Business","Medicine","Law","Engineering","Design","Economics","Education"];
const LEVELS   = ["Колледж","Foundation","Бакалавр","Магистр","PhD"];
const INTAKES  = ["Осень","Зима","Весна","Лето"];
const ENG_TESTS= ["TOEFL","IELTS","DET"];
const INT_EXAMS = [...new Set(UNIS.flatMap(u => u.exams || []))].filter(Boolean).sort();
const GPA_OPTS = ["4/4","3/4","2.5/4","2/4"];
const TYPES    = ["Государственный","Частный"];
const COUNTRY_FLAGS = { "Италия":"🇮🇹","США":"🇺🇸","Северный Кипр":"🇨🇾","Малайзия":"🇲🇾","Германия":"🇩🇪","Польша":"🇵🇱","Австрия":"🇦🇹" };
const GPA_ORDER= { "2/4": 2, "2.5/4": 2.5, "3/4": 3, "4/4": 4 };

/* Logo placeholder colors per country */
const LOGO_BG = {
  "Италия":        { bg: "#fceee8", color: "#8b3010" },
  "США":           { bg: "#e8eef8", color: "#0a2b6a" },
  "Австрия":       { bg: "#fce8e8", color: "#800818" },
  "Германия":      { bg: "#e8e8f0", color: "#1a1a30" },
  "Польша":        { bg: "#fce8ec", color: "#7a0820" },
  "Северный Кипр": { bg: "#e4f6f6", color: "#055050" },
  "Малайзия":      { bg: "#e4f8ee", color: "#004020" },
};

/* Sticker definitions (elite shown separately as blue star) */
const STICKERS = [
  { key: "meritBased", label: "Стипендия", cls: "sticker--merit", check: u => u.meritBased },
  { key: "needBased",  label: "Грант",     cls: "sticker--grant", check: u => u.needBased },
];

/* ---------- Reusable FilterSection ---------- */
function FilterSection({ label, children }) {
  return (
    <div className="filter">
      <label className="filter__label">{label}</label>
      {children}
    </div>
  );
}

/* ---------- Program result in the unified catalog list — looks like a uni
      card (banner photo, logo, uni name) but the bottom half describes the
      program. Click opens university.html?u=SHORT&p=INDEX with the program
      already expanded. ---------- */
function ProgramUniCard({ p, u, idx }) {
  const level = p.level === "master" ? "master" : "bachelor";
  const levelLabel = p.levelLabel ||
    (p.level === "master" ? "MASTER'S" : p.level === "phd" ? "PHD" : p.level === "foundation" ? "FOUNDATION" : "BACHELOR'S");
  const tuition = p.tuition || (u.price ? "$" + u.price.toLocaleString("en-US") + " / year" : "");
  const tags = PROG_TAGS(p.tags);
  const href = `university.html?u=${encodeURIComponent(u.short)}&p=${idx}`;

  const bannerBg = u.campus
    ? { backgroundImage: `url(${u.campus})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: COUNTRY_PALETTE[u.country] || "#1a2a4a" };
  const activeStickers = STICKERS.filter(s => s.check(u));
  const lp = LOGO_BG[u.country] || { bg: "#edf0f8", color: "#1a2a4a" };
  const initials = u.name.split(" ").filter(w => /[A-Za-z]/.test(w[0])).slice(0,2).map(w => w[0]).join("").toUpperCase();

  return (
    <article
      className={"uni card uni--prog uni--prog-" + level + (u.elite ? " uni--elite" : "")}
      onClick={e => { if (e.target.closest("a,button")) return; window.location.href = href; }}
    >
      {/* Campus banner — same as the uni card */}
      <div className="uni__banner" style={bannerBg}>
        <div className="uni__banner-overlay" />
        {activeStickers.length > 0 && (
          <div className="uni__stickers">
            {activeStickers.map(s => (
              <span key={s.key} className={`uni__sticker ${s.cls}`}>{s.label}</span>
            ))}
          </div>
        )}
        {u.elite && <span className="uni__elite-star" title="Elite выбор">★</span>}
        {COUNTRY_ISO[u.country] && (
          <span className="uni__country-chip">
            <img
              className="uni__country-flag"
              src={FLAG_URL(COUNTRY_ISO[u.country], "40x30")}
              srcSet={`${FLAG_URL(COUNTRY_ISO[u.country], "80x60")} 2x`}
              alt=""
            />
            {u.country}
          </span>
        )}
      </div>

      {/* Card body: uni identity on top, program info below */}
      <div className="uni__body">
        <div className="uni__head-row">
          {u.logo
            ? <img src={u.logo} className="uni__logo-img" alt={u.short} />
            : <div className="uni__logo-ph" title={u.name} style={{ background: lp.bg, color: lp.color }}>
                {initials || u.short.slice(0,2).toUpperCase()}
              </div>
          }
          <span className={"pcard__badge" + (level === "master" ? " pcard__badge--master" : "")}>{levelLabel}</span>
        </div>

        <h3 className="uni__name">{u.name}</h3>
        <div className="uni__loc">
          <svg className="uni__loc-ic" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {p.location || u.loc} · {u.country}
        </div>

        <div className="uni__prog">
          <h4 className="uni__prog-title">{p.title}</h4>
          {tags.length > 0 && (
            <div className="pcard__tags">{tags.slice(0, 3).map((t, i) => <span className="pcard__tag" key={i}>{t}</span>)}</div>
          )}
          <div className="uni__rows">
            <div className="uni__row"><span>Annual tuition</span><b>{tuition || "—"}</b></div>
            {p.funding && <div className="uni__row"><span>Funding</span><b>{p.funding}</b></div>}
            {p.language && <div className="uni__row"><span>Language</span><b>{p.language}</b></div>}
          </div>
        </div>

        <a href={href} className="btn btn--ghost btn--block uni__more">Подробнее →</a>
      </div>
    </article>
  );
}

/* Faculties that actually match at least one program — used to hide
   dead-end options from the "Направление" dropdown (computed once). */
const FACULTY_HAS_PROGRAMS = (() => {
  const set = new Set();
  const allFacs = [...new Set(Object.values(FIELD_FACULTIES).flat())];
  allFacs.forEach(fac => {
    const qf = fac.toLowerCase();
    const hit = UNIS.some(u => eaUniPrograms(u).some(p =>
      (p.title || "").toLowerCase().includes(qf) ||
      u.name.toLowerCase().includes(qf) ||
      PROG_TAGS(p.tags).some(t => t.toLowerCase().includes(qf))
    ));
    if (hit) set.add(fac);
  });
  return set;
})();

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function Universities() {
  const [q,           setQ]       = useState(_INIT_SEARCH);
  const [maxPrice,    setPrice]   = useState(70000);
  const [sliderVal,   setSlider]  = useState(70000); // visual only during drag
  const [selCountries,setCntrs]   = useState(_INIT_COUNTRY ? [_INIT_COUNTRY] : []);
  const [selLevel,    setLevel]   = useState(_INIT_LEVEL);
  const [selFields,   setFields]  = useState(_INIT_FIELD   ? [_INIT_FIELD]   : []);
  const [openField,   setOpenField] = useState(null); // направление с раскрытым списком факультетов
  const [selIntakes,  setIntakes] = useState([]);
  const [selEngTests, setEngTests]= useState([]);
  const [selExams,    setExams]   = useState([]);
  const [selGpa,      setGpa]     = useState(4);
  const [selType,     setType]    = useState("");
  const [bools,       setBools]   = useState({});
  const [sort,        setSort]    = useState("pop");
  const [shown,       setShown]   = useState(9);
  const [saved,       setSaved]   = useState({});

  // Auto-scroll when arriving from HomeSearch with pre-set filters
  useEffect(() => {
    if (_INIT_COUNTRY || _INIT_LEVEL || _INIT_FIELD || _INIT_SEARCH) {
      setTimeout(() => {
        const el = document.getElementById("universities");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, []);

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  const chips  = (arr, set, items) => (
    <div className="filter__chips">
      {items.map(v => (
        <button key={v}
          className={"filter__chip" + (arr.includes(v) ? " is-on" : "")}
          onClick={() => toggle(arr, set, v)}>{v}</button>
      ))}
    </div>
  );
  const chipsSingle = (cur, set, items) => (
    <div className="filter__chips">
      {items.map(v => (
        <button key={v}
          className={"filter__chip" + (cur === v ? " is-on" : "")}
          onClick={() => set(cur === v ? "" : v)}>{v}</button>
      ))}
    </div>
  );

  const reset = () => {
    setQ(""); setPrice(70000); setFields([]); setOpenField(null); setCntrs([]); setLevel("");
    setIntakes([]); setEngTests([]); setExams([]); setGpa(4); setType("");
    setBools({});
  };

  /* ---------- Filter logic ---------- */
  /* opts.forPrograms: skip search/field/level checks — they are re-applied
     per-program when building the program results below */
  const uniPasses = (u, forPrograms) => {
    if (!forPrograms) {
      if (q && ![u.name, u.loc, u.short].some(s => s.toLowerCase().includes(q.toLowerCase()))) return false;
      if (selFields.length  > 0 && !selFields.includes(u.field)) return false;
      if (selLevel && !u.levels.includes(selLevel)) return false;
    }
    if (maxPrice === 0 ? !u.needBased : u.price > maxPrice) return false;
    if (selCountries.length > 0 && !selCountries.includes(u.country)) return false;
    if (selIntakes.length   > 0 && !selIntakes.some(i  => u.intake.includes(i)))    return false;
    if (selEngTests.length  > 0 && !selEngTests.some(t  => u.engTests.includes(t))) return false;
    if (selExams.length     > 0 && !selExams.some(e    => u.exams.includes(e)))     return false;
    if (selGpa < 4 && GPA_ORDER[u.gpaMin] > selGpa) return false;
    if (selType && u.type !== selType) return false;
    if (bools.needBased    && !u.needBased)    return false;
    if (bools.meritBased   && !u.meritBased)   return false;
    if (bools.dormitory    && !u.dormitory)    return false;
    if (bools.financialAid && !u.financialAid) return false;
    if (bools.exchange     && !u.exchange)     return false;
    return true;
  };

  let list = UNIS.filter(u => uniPasses(u, false));

  const uniSort = (a, b) =>
    sort === "price"  ? a.price - b.price :
    sort === "rating" ? (a.qs||9999) - (b.qs||9999) :
    ((b.elite ? 1 : 0) - (a.elite ? 1 : 0)) || ((a.qs||9999) - (b.qs||9999));
  list = [...list].sort(uniSort);

  /* ---------- Program results (only when searching or a field is picked) ---------- */
  const showPrograms = !!(q || selFields.length > 0);
  let progList = [];
  if (showPrograms) {
    const qLc = q.toLowerCase();
    UNIS.filter(u => uniPasses(u, true)).forEach(u => {
      eaUniPrograms(u).forEach((p, idx) => {
        const pLevel = p.level || "bachelor";
        if (selLevel && pLevel !== PROG_LEVEL_RU[selLevel]) return;
        if (selFields.length > 0 && !selFields.some(f => progMatchesField(p, u, f))) return;
        if (q && !((p.title || "").toLowerCase().includes(qLc) || u.name.toLowerCase().includes(qLc) || PROG_TAGS(p.tags).some(t => t.toLowerCase().includes(qLc)))) return;
        progList.push({ p, u, idx });
      });
    });
    progList.sort((a, b) => uniSort(a.u, b.u));
  }

  /* Счёт программ в выдаче — с учётом выбранного уровня */
  const progCount = showPrograms ? progList.length : list.reduce(
    (n, u) => n + uniLevels(u).filter(l => !selLevel || l === selLevel).length, 0);

  const fmtPrice = p => "$" + p.toLocaleString("ru") + "/год";

  return (
    <section className="section unis" id="universities">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{window.eaText("catalog.eyebrow")}</span>
          <h2>{window.eaText("catalog.h2")}</h2>
          <p>В базе <b>{TOTAL_PROGRAMS}</b> программ в <b>{UNIS.length}</b> партнёрских вузах Elite Academy — отфильтруй под себя.</p>
        </div>

        <div className="unis__hot" data-reveal>
          Вузы, куда чаще всего поступают наши студенты — отмечены <span className="uni__star-inline">★</span>
        </div>

        <div className="unis__layout">

          {/* ====== FILTER SIDEBAR ====== */}
          <aside className="unis__filters card" data-reveal>

            <FilterSection label="Страна">
              <div className="filter__chips">
                {ALL_COUNTRIES.map(c => (
                  <button key={c} className={"filter__chip" + (selCountries.includes(c) ? " is-on" : "")} onClick={() => toggle(selCountries, setCntrs, c)}>
                    {COUNTRY_ISO[c]
                      ? <img src={FLAG_URL(COUNTRY_ISO[c], "20x15")} alt={c} className="filter__flag" />
                      : null
                    }
                    {c}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection label="Поиск по названию">
              <div className="filter__search">
                <svg width="16" height="16" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Bocconi, Малайзия, IT…" />
              </div>
            </FilterSection>

            <div className="filter__group">Сначала — программа</div>

            <FilterSection label="Уровень программы">
              {chipsSingle(selLevel, setLevel, LEVELS)}
            </FilterSection>

            <FilterSection label="Направление">
              {/* Клик по направлению открывает под ним выпадающий список
                  факультетов (как дропдаун в нав-баре) */}
              <div className="filter__chips">
                {FIELDS.map(f => {
                  const on = selFields.includes(f);
                  const open = openField === f;
                  const facs = (FIELD_FACULTIES[f] || []).filter(fac => FACULTY_HAS_PROGRAMS.has(fac));
                  return (
                    <React.Fragment key={f}>
                      <button
                        className={"filter__chip filter__chip--dd" + (on ? " is-on" : "") + (open ? " is-open" : "")}
                        onClick={() => {
                          if (on) { setFields(selFields.filter(x => x !== f)); setOpenField(null); }
                          else { setFields([...selFields, f]); setOpenField(f); }
                        }}
                      >
                        {f}
                        <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      {open && facs.length > 0 && (
                        <div className="filter__dd">
                          {facs.map((fac, i) => (
                            <button
                              type="button"
                              key={i}
                              className={"filter__dd-item" + (q.toLowerCase() === fac.toLowerCase() ? " is-on" : "")}
                              onClick={() => setQ(cur => cur.toLowerCase() === fac.toLowerCase() ? "" : fac)}
                            >{fac}</button>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </FilterSection>

            <FilterSection label="Учебный год / семестр">
              {chips(selIntakes, setIntakes, INTAKES)}
            </FilterSection>

            <FilterSection label="Языковой тест">
              {chips(selEngTests, setEngTests, ENG_TESTS)}
            </FilterSection>

            <FilterSection label="Внутренние экзамены">
              {chips(selExams, setExams, INT_EXAMS)}
            </FilterSection>

            <div className="filter__group">Затем — университет</div>

            <FilterSection label="Стоимость в год">
              <div className="filter__price-row">
                <span className="filter__price-pre">до $</span>
                <input
                  type="number" min="0" max="70000" step="500" value={sliderVal}
                  onChange={e => {
                    const raw = e.target.value;
                    if (raw === "") { setSlider(""); return; }      /* let the field be cleared while typing */
                    const v = Math.max(0, Math.min(70000, parseInt(raw, 10) || 0));
                    setPrice(v); setSlider(v);                       /* parseInt drops leading zeros (0200 -> 200) */
                  }}
                  onBlur={e => {
                    if (sliderVal === "") { setPrice(70000); setSlider(70000); return; }
                    /* normalize the visible text (React skips numerically-equal rewrites, so "0200" would stick) */
                    e.target.value = String(sliderVal);
                  }}
                  className="filter__price-input" aria-label="Максимальная стоимость в год, $"
                />
                <span className="filter__price-yr">/год</span>
              </div>
              <input type="range" min="0" max="70000" step="500" value={sliderVal === "" ? 70000 : sliderVal}
                onChange={e => setSlider(+e.target.value)}
                onMouseUp={e => { setPrice(+e.target.value); setSlider(+e.target.value); }}
                onTouchEnd={e => { const v = +e.target.value; setPrice(v); setSlider(v); }}
                className="filter__range" />
              <div className="filter__range-ends"><span>$0</span><span>$70k</span></div>
            </FilterSection>

            <FilterSection label="Тип вуза">
              {chipsSingle(selType, setType, TYPES)}
            </FilterSection>

            <FilterSection label="Минимальный GPA">
              <div className="filter__price-row">
                <span className="filter__price-pre">мой GPA</span>
                <span className="filter__price-input" style={{fontWeight:700,minWidth:36,textAlign:"center"}}>
                  {selGpa >= 4 ? "—" : selGpa.toFixed(1)}
                </span>
                <span className="filter__price-yr">/4</span>
              </div>
              <input type="range" min="2" max="4" step="0.5" value={selGpa}
                onChange={e => setGpa(+e.target.value)}
                className="filter__range" />
              <div className="filter__range-ends"><span>2.0</span><span>4.0 (все)</span></div>
            </FilterSection>

            <div className="filter filter--checks">
              <label className="filter__label">Доп. условия</label>
              {[
                ["needBased",    "Need-based стипендия"],
                ["meritBased",   "Merit-based стипендия"],
                ["dormitory",    "Общежитие"],
                ["financialAid", "Финансовая помощь"],
                ["exchange",     "Программы обмена"],
              ].map(([key, lbl]) => (
                <label key={key} className="filter__check">
                  <input type="checkbox" checked={!!bools[key]} onChange={e => setBools(b => ({...b, [key]: e.target.checked}))} />
                  <span>{lbl}</span>
                </label>
              ))}
            </div>

            <div className="filter__actions">
              <button className="btn btn--ghost" onClick={reset}>Сбросить</button>
              <span className="unis__count-sm">{progCount} прогр. · {list.length} вузов</span>
            </div>
          </aside>

          {/* ====== RESULTS ====== */}
          <div className="unis__results">
            <div className="unis__toolbar">
              <span className="unis__count">Найдено <b>{progCount}</b> программ и <b>{list.length}</b> вузов</span>
              <div className="unis__sort">
                <span>Сортировка:</span>
                {[["pop","Elite выбор"],["rating","по рейтингу"],["price","по цене"]].map(([k,l]) => (
                  <button key={k} className={sort === k ? "is-on" : ""} onClick={() => setSort(k)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="unis__grid">
              {/* Unified list: with a search/field filter active every result
                  is a program (uni-style card with the program at the bottom) */}
              {showPrograms && progList.slice(0, shown).map(({ p, u, idx }) => (
                <ProgramUniCard key={u.short + "-" + idx} p={p} u={u} idx={idx} />
              ))}
              {!showPrograms && list.slice(0, shown).map((u, i) => {
                const bannerBg = u.campus
                  ? { backgroundImage: `url(${u.campus})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { background: COUNTRY_PALETTE[u.country] || "#1a2a4a" };
                const activeStickers = STICKERS.filter(s => s.check(u));

                const lp = LOGO_BG[u.country] || { bg: "#edf0f8", color: "#1a2a4a" };
                const initials = u.name.split(" ").filter(w => /[A-Za-z]/.test(w[0])).slice(0,2).map(w => w[0]).join("").toUpperCase();

                return (
                  <article
                    className={"uni card" + (u.elite ? " uni--elite" : "")} key={i}
                    onClick={e => {
                      if (e.target.closest("a,button")) return;
                      window.location.href = `university.html?u=${encodeURIComponent(u.short)}`;
                    }}
                  >
                    {/* Campus banner */}
                    <div className="uni__banner" style={bannerBg}>
                      <div className="uni__banner-overlay" />
                      {/* Stickers: Стипендия / Грант */}
                      {activeStickers.length > 0 && (
                        <div className="uni__stickers">
                          {activeStickers.map(s => (
                            <span key={s.key} className={`uni__sticker ${s.cls}`}>{s.label}</span>
                          ))}
                        </div>
                      )}
                      {/* Blue star for Elite unis */}
                      {u.elite && <span className="uni__elite-star" title="Elite выбор">★</span>}
                      {/* Country chip — flag + name in a clean frosted pill */}
                      {COUNTRY_ISO[u.country] && (
                        <span className="uni__country-chip">
                          <img
                            className="uni__country-flag"
                            src={FLAG_URL(COUNTRY_ISO[u.country], "40x30")}
                            srcSet={`${FLAG_URL(COUNTRY_ISO[u.country], "80x60")} 2x`}
                            alt=""
                          />
                          {u.country}
                        </span>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="uni__body">
                      <div className="uni__head-row">
                        {u.logo
                          ? <img src={u.logo} className="uni__logo-img" alt={u.short}
                              onError={e => {
                                const ph = document.createElement("div");
                                ph.className = "uni__logo-ph";
                                ph.title = u.name;
                                ph.textContent = initials || u.short.slice(0,2).toUpperCase();
                                ph.style.cssText = `background:${lp.bg};color:${lp.color}`;
                                e.currentTarget.parentNode.replaceChild(ph, e.currentTarget);
                              }}
                            />
                          : <div className="uni__logo-ph" title={u.name}
                                 style={{ background: lp.bg, color: lp.color }}>
                              {initials || u.short.slice(0,2).toUpperCase()}
                            </div>
                        }
                        <button
                          className={"uni__save" + (saved[u.name] ? " is-on" : "")}
                          aria-label="Сохранить"
                          onClick={() => setSaved(s => ({...s, [u.name]: !s[u.name]}))}
                        >♡</button>
                      </div>

                      <h3 className="uni__name">{u.name}</h3>
                      <div className="uni__loc">
                        <svg className="uni__loc-ic" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {u.loc} · {u.country}
                      </div>

                      <div className="uni__rows">
                        {u.qs && (
                          <div className="uni__row"><span>QS рейтинг</span><b>#{u.qs}</b></div>
                        )}
                        {uniLevels(u).map(lv => (
                          <div className="uni__row" key={lv}>
                            <span>{lv}</span>
                            <div className="uni__price-cell">
                              <b>{fmtPrice(u.price)}</b>
                              {u.discount && <span className="uni__discount">скидка ${u.discount.toLocaleString("ru")}</span>}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="uni__tags">
                        <span className={"uni__type-tag uni__type-tag--" + (u.type === "Государственный" ? "gov" : "priv")}>
                          {u.type}
                        </span>
                        <span className="uni__field-tag">{u.field}</span>
                      </div>

                      {(u.elite || u.financialAid) && (
                        <div className="uni__badges">
                          {u.elite && <span className="uni__badge uni__badge--guar">✓ Гарантия поступления</span>}
                          {u.financialAid && <span className="uni__badge uni__badge--schol">$ Стипендия в программах</span>}
                        </div>
                      )}
                      <a href={`university.html?u=${encodeURIComponent(u.short)}`} className="btn btn--ghost btn--block uni__more">Подробнее →</a>
                    </div>
                  </article>
                );
              })}
            </div>

            {(() => {
              const total = showPrograms ? progList.length : list.length;
              const noun = showPrograms ? "программ" : "вузов";
              return shown < total ? (
                <button className="btn btn--dark unis__load" onClick={() => setShown(s => s + 6)}>
                  Загрузить ещё ({total - shown} {noun})
                </button>
              ) : total === 0 ? (
                <div className="unis__empty">Ничего не нашлось — попробуй смягчить фильтры.</div>
              ) : null;
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}

window.Universities = Universities;
/* Shared with university.html profile page (uni-page.jsx) */
window.EA_UNIS = UNIS;
window.EA_UNIS_RAW = UNIS_SRC;
window.EA_PALETTE = COUNTRY_PALETTE;
window.EA_COUNTRY_ISO = COUNTRY_ISO;
window.EA_FLAG_URL = FLAG_URL;
