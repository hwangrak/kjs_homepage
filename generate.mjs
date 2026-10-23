import {mkdir, writeFile, readFile} from 'node:fs/promises';
const root = new URL('./dist/',import.meta.url);
const company={name:'(주)케이제이에스',en:'KJS Electric',phone:'051-544-3201',mobile:'010-5096-3410',fax:'051-544-3203',email:'info@kjs-elec.kr',address:'부산광역시 동래구 우장춘로 130',suite:'현대빌리지 201호',registration:'제 부산-00540호'};
const paths={arrow:'M3 12h17m-6-6 6 6-6 6',check:'m4 12 5 5L21 5'};
const referenceIcons=JSON.parse(await readFile(new URL('./reference-icons.json',import.meta.url),'utf8'));
const icon=(name,cls='')=>{
 const reference=referenceIcons[name];
 if(!reference&&!paths[name])throw new Error('Unknown icon: '+name);
 return reference
  ?`<svg class="icon reference-icon ${cls}" data-icon="${name}" viewBox="0 0 100 100" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="${reference}"/></svg>`
  :`<svg class="icon ${cls}" data-icon="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${paths[name]}"/></svg>`;
};
const arrow=()=>icon('arrow');
const nav=[['회사소개','/about/'],['사업분야','/business/'],['시공실적','/projects/'],['안전·품질관리','/safety/'],['인증 및 면허','/certifications/'],['고객문의','/contact/']];
const imageAssets=JSON.parse(await readFile(new URL('./image-assets.json',import.meta.url),'utf8'));
const cardSizes='(max-width:700px) calc((100vw - 51px)/2), (max-width:1280px) calc((100vw - 116px)/3), 382px';
const img=(src,alt,cls='',eager=false,sizeHint='')=>{
 const a=imageAssets[src];
 if(!a)return `<img class="${cls}" src="/assets/${src}" alt="${alt}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
 const fallback=a.variants.find(v=>v.width>=(eager?1920:1280))||a.variants.at(-1);
 const sizes=sizeHint||(cls==='home-hero-photo'?'(max-width:700px) 100vw, 75vw':cls==='hero-photo'?'(max-width:700px) 85vw, 70vw':'(max-width:700px) calc(100vw - 36px), (max-width:1280px) 50vw, 600px');
 return `<img class="${cls}" src="/assets/${fallback.file}" srcset="${a.variants.map(v=>'/assets/'+v.file+' '+v.width+'w').join(', ')}" sizes="${sizes}" width="${a.width}" height="${a.height}" alt="${alt}" loading="${eager?'eager':'lazy'}" ${eager?'fetchpriority="high"':''} decoding="async">`;
};
const brand=()=>`<a class="brand" href="/" aria-label="케이제이에스 홈">${img('logo.webp?v=20261019-restored','케이제이에스 심벌','brand-mark',true)}<span><strong>(주) 케이제이에스</strong><small>KJS Electric</small></span></a>`;
function header(path){return `<a class="skip" href="#main">본문 바로가기</a><header class="site-header"><div class="header-inner">${brand()}<nav class="desktop-nav" aria-label="주 메뉴">${nav.map(([t,h])=>`<a href="${h}" ${path.startsWith(h)?'aria-current="page"':''}>${t}</a>`).join('')}</nav><button class="menu-toggle" aria-label="전체 메뉴 열기" aria-expanded="false" aria-controls="all-menu"><span></span><span></span><span></span></button></div><nav id="all-menu" class="all-menu" aria-label="전체 메뉴" hidden>${nav.map(([t,h],i)=>`<a href="${h}"><small>0${i+1}</small>${t}${arrow()}</a>`).join('')}<a href="/brand/"><small>07</small>브랜드 이야기${arrow()}</a></nav></header>`;}
function footer(){return `<footer class="site-footer"><div class="container footer-top">${brand()}<p>전기와 사람,<br><strong>더 안전한 세상을 연결합니다.</strong></p><a class="footer-call" href="tel:01050963410">공사 상담 ${arrow()}<b>${company.mobile}</b></a></div><div class="container footer-bottom"><div><b>${company.name}</b><p>${company.address} ${company.suite}<br>대표 정은귀 · 사업자등록번호 607-81-84095 · 전기공사업 ${company.registration}</p><p>전화 <a href="tel:0515443201">${company.phone}</a> &nbsp; 팩스 ${company.fax} &nbsp; 이메일 <a href="mailto:${company.email}">${company.email}</a></p><small>© ${new Date().getFullYear()} KJS Electric. All rights reserved.</small></div><div class="footer-links"><a href="/brand/">브랜드 이야기</a><a href="/privacy/">개인정보처리방침</a><a href="/contact/">오시는 길 ${arrow()}</a></div></div></footer><a href="/contact/" class="floating-contact" aria-label="공사 상담 문의">${icon('phone')}<span>공사문의</span></a>`;}
const heroSizes='(max-width:839px) 854px, (max-width:1000px) 676px, (max-width:1600px) 68vw, 1102px';
const heroAmbient=image=>`<div class="photo-hero__ambient" aria-hidden="true">${img(image,'','photo-hero__ambient-image',false,'(max-width:839px) 640px, (max-width:1600px) 100vw, 1600px')}</div>`;
function pageHero(title,desc,image,light=false,label=''){
 return `<section class="photo-hero${light?' photo-hero--light':''}" data-hero="${image.replace('.webp','')}">${heroAmbient(image)}<div class="photo-hero__layout"><div class="photo-hero__copy"><div class="title-rule"><div>${label?`<p class="eyebrow">${label}</p>`:''}<h1>${title}</h1><p>${desc}</p></div></div></div><figure class="photo-hero__media">${img(image,'','photo-hero__image',true,heroSizes)}</figure></div></section>`;
}
const sectionHead=(label,title,desc='')=>`<div class="section-heading"><div><p class="eyebrow">${label}</p><h2>${title}</h2></div>${desc?`<p>${desc}</p>`:''}</div>`;
const cta=()=>`<section class="contact-band"><div class="container"><div><p class="eyebrow">LET’S CONNECT</p><h2>전기가 필요한 곳에,<br class="mobile-only"> KJS가 함께합니다.</h2></div><a class="button dark" href="/contact/">프로젝트 상담하기 ${arrow()}</a></div></section>`;
const services=[
  {
    "slug": "residential",
    "title": "가정·주택 전기공사",
    "image": "business-residential-hd.webp",
    "desc": "콘센트·스위치·차단기 교체,<br>조명 설치와 누전 점검",
    "lead": "우리 집의 전기,<br>작은 불편부터 안전하게 해결합니다.",
    "detail": "아파트, 주택, 빌라의 전기 사용 환경을 살피고 콘센트·스위치·차단기·조명 교체부터 필요한 회로 추가와 배선 정리까지 시공합니다.",
    "items": [
      [
        "facility",
        "주택·아파트 전기공사",
        "생활 공간과 사용 목적에 맞는 전기설비 개선"
      ],
      [
        "bolt",
        "콘센트·스위치 교체 및 추가",
        "위치 변경과 추가 설치, 사용 부하에 맞는 회로 검토"
      ],
      [
        "shield",
        "누전·차단기 점검",
        "차단기 동작과 누전 원인 점검 및 필요한 보수"
      ],
      [
        "general",
        "조명 설치·교체",
        "다운라이트, 평판등, 실내 조명 교체와 배선 정리"
      ]
    ]
  },
  {
    "slug": "systems",
    "title": "전기 신설·증설",
    "image": "business-power-hd.webp",
    "desc": "신규 전기 사용·계약전력 증설,<br>한전 신청과 전기설비 공사",
    "lead": "새로 시작하는 공간,<br>늘어나는 전력에 맞춰 준비합니다.",
    "detail": "신규 영업장, 장비 추가, 시설 확장에 필요한 전기 신설·증설을 상담합니다. 현장 전력과 인입 조건을 확인하고 한전 관련 신청 및 서류 업무와 필요한 전기공사 범위를 함께 안내합니다.",
    "items": [
      [
        "bolt",
        "전기 신설",
        "신규 전기 사용을 위한 신청과 현장 설비 공사"
      ],
      [
        "chart",
        "계약전력 증설",
        "기존 계약전력·장비 용량을 확인하고 증설 범위 검토"
      ],
      [
        "trust",
        "한전 신청·서류 업무",
        "전기 사용 신청과 관련 서류 업무 대행"
      ],
      [
        "control",
        "인입·분전반·전용회로",
        "현장 조건에 따른 인입 배선, 차단기, 단독회로 시공"
      ]
    ]
  },
  {
    "slug": "remodeling",
    "title": "상가·주택 리모델링",
    "image": "business-remodeling-hd.webp",
    "desc": "인테리어 전기·조명 설계 협의,<br>배선 정리와 회로 재구성",
    "lead": "공간이 바뀌면,<br>전기도 새롭게 정리합니다.",
    "detail": "상가·매장·주택의 신축과 리모델링 일정에 맞춰 조명, 콘센트, 전열 및 동력 배선을 시공합니다. 가구·장비 배치와 사용 동선을 확인해 필요한 위치에 전기를 연결합니다.",
    "items": [
      [
        "building",
        "상가·매장 전기공사",
        "카페, 식당, 학원, 사무실 등 용도별 전기설비 시공"
      ],
      [
        "tools",
        "인테리어 배선 정리",
        "천장·벽체 공정에 맞춘 배관·배선과 노후 배선 교체"
      ],
      [
        "general",
        "조명·콘센트 재배치",
        "공간 구성과 가구 배치에 맞는 조명·콘센트 설치"
      ],
      [
        "control",
        "장비 전용회로",
        "에어컨, 냉장·냉동기, 주방 장비 등 전원 분리"
      ]
    ]
  },
  {
    "slug": "maintenance",
    "title": "전기 점검·유지보수",
    "image": "business-maintenance-hd.webp",
    "desc": "누전·차단 원인 점검,<br>노후 배선·차단기·조명 교체",
    "lead": "일상의 안정적인 운영,<br>꾸준한 점검에서 시작됩니다.",
    "detail": "가정과 영업장, 공공시설의 전기설비 상태를 살피고 누전·정전·차단 원인 확인과 노후설비 교체 등 필요한 보수 공사를 진행합니다.",
    "items": [
      [
        "shield",
        "누전·차단 원인 점검",
        "회로와 사용 장비를 확인해 문제 원인 점검"
      ],
      [
        "tools",
        "노후 전기설비 교체",
        "조명, 콘센트, 차단기, 배선 등 노후 부품 교체"
      ],
      [
        "control",
        "분전반·배선 점검",
        "분전반과 회로의 상태 확인 및 필요한 개선"
      ],
      [
        "gear",
        "시설 유지보수",
        "학교, 영업장, 시설 운영 일정에 맞춘 보수 공사"
      ]
    ]
  },
  {
    "slug": "electrical",
    "title": "공공·산업시설 전기공사",
    "image": "business-industrial-hd.webp",
    "desc": "학교·공공기관·공장 전기공사,<br>수배전반·동력설비 시공",
    "lead": "현장의 규모와 용도에 맞춰,<br>안정적인 전력 환경을 구축합니다.",
    "detail": "공공기관, 학교, 의료시설, 공장 및 산업시설의 전기공사를 수행합니다. 건축 공정과 운영 환경을 고려해 수배전반, 동력 및 조명 설비를 시공하고 현장을 관리합니다.",
    "items": [
      [
        "building",
        "공공시설 전기공사",
        "학교, 공공기관, 문화시설 등의 전기설비 신설·개선"
      ],
      [
        "gear",
        "공장·산업설비",
        "생산 장비의 동력 배선과 전용회로 시공"
      ],
      [
        "control",
        "수배전반 및 제어설비",
        "수전·배전 계통, 분전반 및 제어반 설치·교체"
      ],
      [
        "shield",
        "현장 관리 및 인계",
        "공사 일정·품질·안전 관리와 시공 후 점검"
      ]
    ]
  },
  {
    "slug": "renewable",
    "title": "신재생에너지 연계",
    "image": "business-solar-hd.webp",
    "desc": "태양광 등 신재생 설비의<br>전력 계통 연계 공사",
    "lead": "더 나은 에너지의 흐름,<br>안전한 계통 연결로 시작합니다.",
    "detail": "태양광 등 신재생에너지 설비와 기존 배전 계통의 연계, 보호협조를 고려한 시공을 지원합니다.",
    "items": [
      [
        "leaf",
        "신재생 설비 연계",
        "태양광 발전설비 등 전기 계통 연계"
      ],
      [
        "bolt",
        "배전 계통 검토",
        "기존 전력 계통과의 연계 조건 확인"
      ],
      [
        "shield",
        "보호설비 구성",
        "안전한 운영을 위한 보호 계통 시공"
      ],
      [
        "tools",
        "유지보수",
        "설비 상태에 따른 보수 및 개선 상담"
      ]
    ]
  }
];
const companyHistory=JSON.parse(await readFile(new URL('./company-history.json',import.meta.url),'utf8'));
const projects=JSON.parse(await readFile(new URL('./projects.json',import.meta.url),'utf8'));
const moneyFormatter=new Intl.NumberFormat('ko-KR');
const dateValue=p=>p.contractDate?p.contractDate.replaceAll('.','-'):p.year+'-01-01';
projects.sort((a,b)=>Number(b.year)-Number(a.year)||dateValue(b).localeCompare(dateValue(a)));
for(const p of projects){
 p.amount=(p.amountApproximate?'약 ':'')+moneyFormatter.format(p.amountKrw)+'원';
 const a=imageAssets[p.image];
 if(a){p.imageSrcset=a.variants.map(v=>'/assets/'+v.file+' '+v.width+'w').join(', ');p.imageWidth=a.width;p.imageHeight=a.height;const v=a.variants.find(v=>v.width>=1280)||a.variants.at(-1);p.imageFallback=v.file;}
}
function serviceGrid(){return `<div class="service-grid">${services.map(s=>`<a class="service-card" href="/business/${s.slug}/">${img(s.image,s.title+' 참고 이미지','',false,cardSizes)}<div><h3>${s.title}</h3><p>${s.desc}</p><span class="card-arrow">${arrow()}</span></div></a>`).join('')}</div>`;}
function projectCard(p,i){return `<article class="project-card" data-category="${p.category}"><button class="project-open" data-project="${i}" aria-haspopup="dialog">${p.image?`<div class="project-image">${img(p.image,p.photoCaption||p.title+' 관련 사진','',false,cardSizes)}${p.imageKind==='illustrative'?'<span class="reference-photo-badge">분야 참고 사진</span>':''}</div>`:`<div class="project-cover">${icon(p.category==='산업시설'?'gear':'building')}<span>${p.category}</span><strong>KJS ELECTRIC</strong><small>공사 기록</small></div>`}<span class="project-meta">${p.category}<small>${p.year}${p.status?' · '+p.status:''}</small></span><h3>${p.title}</h3><p>${p.client}</p><div class="project-amount"><span>공사금액</span><strong>${p.amount}</strong></div><p class="amount-basis">${p.amountBasis||'기존 공개 실적 기준'}</p><span class="project-more">상세 보기 ${arrow()}</span></button></article>`;}
function projectTable(){return `<div class="project-table-wrap" hidden><table class="project-table"><caption>공사명·발주처·연도·시공금액 목록</caption><thead><tr><th scope="col">연도</th><th scope="col">공사명</th><th scope="col">발주처</th><th scope="col">공사금액</th></tr></thead><tbody>${projects.map((p,i)=>`<tr data-category="${p.category}"><td>${p.year}${p.status?`<small>${p.status}</small>`:''}</td><th scope="row"><button data-project="${i}" class="table-project-open">${p.title}</button></th><td>${p.client}</td><td><strong>${p.amount}</strong><small>${p.amountBasis||'기존 공개 실적 기준'}</small></td></tr>`).join('')}</tbody></table></div>`;}
const projectModal=()=>`<dialog id="project-dialog"><button class="dialog-close" aria-label="닫기">×</button><div id="project-detail"></div></dialog>`;
function home(){return `<section class="photo-hero photo-hero--home" data-hero="hero-home">${heroAmbient('hero-home.webp')}<div class="photo-hero__layout"><div class="photo-hero__copy"><p class="eyebrow">KJS ELECTRIC · SINCE 1997</p><h1>전기와 사람,<br><em>더 안전한 세상</em>을<br>연결합니다.</h1><p>신뢰와 기술로 완성하는<br>전기공사 전문기업 ${company.name}</p><a class="hero-link" href="/projects/">시공실적 살펴보기 ${arrow()}</a></div><figure class="photo-hero__media">${img('hero-home.webp','부산 도심의 고층 건물과 교량 전경','photo-hero__image',true,'(max-width:839px) 841px, (max-width:1155px) 781px, (max-width:1600px) 68vw, 1081px')}</figure></div></section><section class="quick-services container" aria-label="핵심 역량">${[['facility','가정·리모델링','/business/residential/'],['bolt','전기 신설·증설','/business/systems/'],['shield','안전·품질관리','/safety/'],['people','전문 기술인력','/about/']].map(([i,t,h])=>`<a href="${h}">${icon(i)}<strong>${t}</strong></a>`).join('')}</section><section class="original-about" aria-labelledby="original-about-title"><div class="original-about__art"><img src="/assets/home-about-original-20261020.png" width="2048" height="713" alt="노란 안전모와 케이제이에스 작업복을 착용한 전기설비 작업자. 기본을 지키는 기술, 현장에서 쌓아온 신뢰." loading="lazy" decoding="async"></div><div class="original-about__copy"><p class="eyebrow">ABOUT KJS</p><h2 id="original-about-title">전문성과 신뢰로<br>미래를 밝히는 기업</h2><p class="left-rule">(주)케이제이에스는<br>전기공사 및 전기설비 분야의 전문 기술력으로<br>안전하고 효율적인 환경을 만들어갑니다.</p></div><a class="original-about__link" href="/about/"><span>회사소개 바로가기</span><span class="original-about__arrow" aria-hidden="true">→</span></a></section><section class="section container">${sectionHead('OUR BUSINESS','현장을 이해하는 기술,<br>공간에 맞는 전기 솔루션','가정·상가 전기공사, 신설·증설과 리모델링까지.<br>고객이 필요한 공사를 쉽게 찾을 수 있도록 안내합니다.')}${serviceGrid()}</section><section class="section soft"><div class="container">${sectionHead('SELECTED PROJECTS','신뢰로 쌓아온 시공실적','공공기관과 산업시설, 일상의 공간까지.<br>축적된 경험을 다음 현장의 기준으로 이어갑니다.')}<div class="project-grid">${['가야역사문화센터','부산민주공원','부민병원'].map(name=>projects.find(p=>p.title.includes(name))).filter(Boolean).map(p=>projectCard(p,projects.indexOf(p))).join('')}</div><p class="image-note">공사금액과 발주처를 확인하고, 각 실적을 눌러 상세 내용을 살펴보세요.</p><div class="center"><a class="button outline" href="/projects/">전체 시공실적 보기 ${arrow()}</a></div></div></section><section class="section container assurance"><div><p class="eyebrow">SAFETY & QUALITY</p><h2>사람이 우선인 현장,<br>안전과 품질이 곧<br>우리의 경쟁력입니다.</h2><a class="text-link" href="/safety/">안전·품질관리 알아보기 ${arrow()}</a></div><div class="assurance-grid">${[['shield','전기공사업 등록',company.registration],['gear','ISO 9001','품질경영시스템'],['leaf','ISO 45001','안전보건경영시스템'],['women','여성기업 확인','2026년 10월 갱신']].map(([i,t,d])=>`<a href="/certifications/">${icon(i)}<h3>${t}</h3><p>${d}</p></a>`).join('')}</div></section>${cta()}${projectModal()}`;}
function about(){return `${pageHero('회사소개','기술과 신뢰로<br>더 나은 내일을 만드는<br><strong>(주) 케이제이에스입니다.</strong>','hero-about.webp',true)}<section class="section container"><div class="center value-title"><p class="eyebrow">KJS ELECTRIC</p><h2>신뢰를 바탕으로,<br class="mobile-only"> 더 큰 가치를 창출합니다.</h2><p>전기공사 전문기업으로서<br>안전한 전력 환경과 편안한 생활을 위해 최선을 다하고 있습니다.</p></div><div class="value-grid">${[['trust','신뢰','고객의 신뢰와 만족을<br>최우선으로 합니다.'],['expertise','전문성','축적된 기술력과 경험으로<br>최고의 품질을 제공합니다.'],['chart','지속적인 성장','사람과 기술이 함께 성장하는<br>기업이 되겠습니다.']].map(([i,t,d])=>`<article class="value-card">${icon(i)}<h3>${t}</h3><p>${d}</p></article>`).join('')}</div><div class="about-overview">${img('about-building.webp','현대식 건축물 외벽 참고 이미지')}<div><h2>회사개요</h2><dl class="info-table">${[['회사명',company.name],['대표자','정은귀'],['사업분야','전기공사업'],['주소',company.address+'<br>'+company.suite],['등록번호',company.registration],['기업현황','여성기업(2026.10 갱신)<br>ISO 9001 · ISO 45001']].map(([t,d])=>`<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></div></div></section><section class="section soft"><div class="container history">${sectionHead('OUR HISTORY','현장에서 이어온 발자취','1997년 설립부터 현재까지.<br>주요 공사와 등록·인증 이력을 소개합니다.')}<div class="timeline">${companyHistory.map(({date,label,items})=>`<div><b><time datetime="${date}">${label}</time></b><div class="timeline-content">${items.map(t=>`<p>${t}</p>`).join('')}</div></div>`).join('')}</div></div></section>${cta()}`;}
function business(){return `${pageHero('사업분야','가정·상가의 전기공사부터 신설·증설,<br>리모델링과 공공·산업시설까지 함께합니다.','hero-business.webp')}<section class="section container tight">${serviceGrid()}</section>${cta()}`;}
function service(s){return `${pageHero(s.title,s.lead,s.slug==='electrical'?'hero-about.webp':s.image)}<section class="section container service-detail"><div><p class="eyebrow">KJS ELECTRIC · ${s.title}</p><h2>풍부한 경험과 전문 기술력으로<br>안정적인 전기설비 환경을 구축합니다.</h2><p class="description">${s.detail}</p><div class="service-list">${s.items.map(([i,t,d])=>`<article>${icon(i)}<div><h3>${t}</h3><p>${d}</p></div></article>`).join('')}</div></div><div class="service-detail-photos">${s.slug==='electrical'?img('electrical-facility.webp','실내 전기 배관과 조명 설비 참고 이미지')+img('electrical-wiring.webp','분전반 배선 참고 이미지'):img(s.image,s.title+' 분야 참고 이미지')}${s.slug==='systems'?img('electrical-trays.webp','전기 배관과 케이블 트레이 참고 이미지'):''}<p class="image-note">사업 분야 참고 이미지</p></div></section><section class="process-strip soft"><div class="container">${['상담 및 현장 확인','범위 협의 및 견적','공사 및 현장 관리','점검 및 인계'].map((x,i)=>`<div><span>0${i+1}</span><h3>${x}</h3></div>`).join('')}</div></section><section class="container section-small"><a class="text-link" href="/business/">${arrow()} 전체 사업분야 보기</a></section>${cta()}`;}
function portfolio(){return `${pageHero('시공실적','현장에서 쌓아온 기록,<br>공사 내용과 시공금액을 확인하세요.','hero-projects.webp')}<section class="section container tight"><div class="project-filters" role="group" aria-label="시공실적 분야 필터">${['전체','상업시설','산업시설','공공시설','주거시설','기타'].map((t,i)=>`<button class="${i===0?'active':''}" data-filter="${t}" aria-pressed="${i===0}">${t}</button>`).join('')}</div><div class="project-toolbar"><p class="filter-count" aria-live="polite">연도별 실적 <b>${projects.length}</b>건 <span class="sort-note">최신순</span></p><div class="view-switch" role="group" aria-label="실적 표시 방식"><button data-view="cards" aria-pressed="true">사진형</button><button data-view="table" aria-pressed="false">목록형</button></div></div><div class="project-grid">${projects.map(projectCard).join('')}</div>${projectTable()}<div class="empty-projects" hidden>${icon('building')}<h2>등록된 해당 분야 실적이 없습니다.</h2><p>관련 공사 상담은 고객문의로 연락해 주세요.</p><a class="button outline" href="/contact/">공사 문의 ${arrow()}</a></div><p class="image-note">계약자료와 공개 기록에서 확인된 실적을 수록했습니다. 금액은 원 단위로 통일했으며 ‘약’은 기존 공개 자료의 근사 금액입니다. 이미지는 공사 분야의 이해를 돕는 참고 이미지이며 해당 공사의 실제 현장 사진이 아닙니다.</p></section>${projectModal()}${cta()}`;}
function safety(){return `<section class="original-safety" aria-labelledby="original-safety-title"><div class="original-safety__art"><img src="/assets/safety-original-20261021.jpeg" width="1536" height="583" alt="케이제이에스 로고가 새겨진 노란 작업복과 안전모를 착용한 작업자" fetchpriority="high" decoding="async"></div><div class="original-safety__copy"><h1 id="original-safety-title">안전·품질관리</h1><p>사람이 우선인 현장,<br>안전과 품질이 곧 우리의 경쟁력입니다.</p></div></section><section class="section container tight"><div class="value-grid">${[['helmet','안전한 작업환경','철저한 안전관리로<br>사고를 예방합니다.'],['gear','체계적인 품질관리','표준화된 시공관리로<br>현장의 품질을 지킵니다.'],['education','지속적인 교육','정기적인 안전교육으로<br>전문 역량을 키워갑니다.']].map(([i,t,d])=>`<article class="value-card">${icon(i)}<h2>${t}</h2><p>${d}</p></article>`).join('')}</div><div class="safety-system">${img('safety-check.webp','노란 작업복과 장갑을 착용하고 점검표를 확인하는 작업자')}<div><p class="eyebrow">OUR STANDARD</p><h2>안전·품질관리 체계</h2><ol>${[['안전관리 계획 수립','현장별 위험요소 분석 및 예방대책 수립'],['품질관리 기준 적용','시공 전 과정의 품질 검수 및 관리'],['정기 점검 및 교육','지속적인 안전점검과 기술 교육 실시'],['개선 활동','현장 피드백을 통한 지속적인 품질 개선']].map(([t,d],i)=>`<li><span>0${i+1}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('')}</ol></div></div></section><section class="section-small soft"><div class="container certification-band"><div><h2>기준을 세우고, 현장에서 지킵니다.</h2><p>ISO 9001 품질경영 · ISO 45001 안전보건경영</p></div><a class="button outline" href="/certifications/">등록 및 인증 보기 ${arrow()}</a></div></section>${cta()}`;}
function certifications(){return `${pageHero('인증 및 면허','공식 인증이 증명하는<br>(주) 케이제이에스의 기술력과 신뢰입니다.','hero-certifications.webp',true)}<section class="section container tight"><div class="documents-grid"><article class="document-block"><h2>전기공사업 등록증</h2><p>전기공사업 ${company.registration}</p><div class="document-art"><div class="document-border">${icon('shield')}<p>전기공사업</p><h3>등록 안내</h3><dl><div><dt>상호</dt><dd>${company.name}</dd></div><div><dt>등록번호</dt><dd>${company.registration}</dd></div><div><dt>최초 등록</dt><dd>1997년</dd></div></dl><span>KJS ELECTRIC</span></div></div></article><article class="document-block"><h2>품질·안전 인증</h2><p>ISO 9001 · ISO 45001</p><div class="iso-documents">${[['9001','품질경영시스템','gear'],['45001','안전보건경영시스템','shield']].map(([n,t,i])=>`<div class="iso-document">${icon(i)}<small>MANAGEMENT SYSTEM</small><h3>ISO<br><b>${n}</b></h3><span>${t}</span><p>KJS ELECTRIC</p></div>`).join('')}</div></article></div><p class="document-note">등록·인증 현황 안내입니다. 인증서 및 증빙서류는 문의 시 안내해 드립니다.</p><div class="certification-cards">${[['shield','전기공사업 등록',company.registration],['gear','ISO 9001','품질경영시스템'],['leaf','ISO 45001','안전보건경영시스템'],['women','여성기업 확인','2026년 10월 갱신']].map(([i,t,d])=>`<article>${icon(i)}<h3>${t}</h3><p>${d}</p></article>`).join('')}</div></section>${cta()}`;}
function contact(){return `${pageHero('고객문의','언제든지 문의주시면<br>친절하고 신속하게 상담해 드리겠습니다.','hero-contact.webp',true)}<section class="section container tight contact-layout"><div class="contact-information">${[['pin','주소',`${company.address}<br>${company.suite}`,`https://map.naver.com/p/search/${encodeURIComponent(company.address)}`],['phone','핸드폰',company.mobile,'tel:01050963410'],['phone','사무실',company.phone,'tel:0515443201'],['print','팩스',company.fax,''],['mail','이메일',company.email,'mailto:'+company.email],['link','홈페이지','www.kjs-elec.kr','https://www.kjs-elec.kr']].map(([i,t,d,h])=>`<div class="contact-item">${icon(i)}<div><h2>${t}</h2>${h?`<a href="${h}" ${h.startsWith('https://map')?'target="_blank" rel="noopener noreferrer"':''}>${d}</a>`:`<p>${d}</p>`}</div></div>`).join('')}<p class="contact-license">전기공사업 ${company.registration}<br>ISO 9001 · ISO 45001 | 여성기업</p><a class="button outline" href="https://map.naver.com/p/search/${encodeURIComponent(company.address)}" target="_blank" rel="noopener noreferrer">네이버 지도에서 길찾기 ${arrow()}</a></div><form id="contact-form" class="contact-form" method="post"><h2>온라인 문의</h2><p>현장과 요청사항을 남겨주시면 상담에 도움이 됩니다.</p><label for="name">이름 <span>*</span></label><input id="name" name="name" autocomplete="name" maxlength="80" placeholder="이름을 입력해 주세요" required><label for="phone">연락처 <span>*</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="30" placeholder="연락 가능한 전화번호" required><label for="email">이메일</label><input id="email" name="email" type="email" autocomplete="email" maxlength="160" placeholder="답변받을 이메일"><label for="type">문의 분야</label><select id="type" name="type"><option>가정·주택 전기공사</option><option>전기 신설·증설</option><option>상가·주택 리모델링</option><option>전기 점검·유지보수</option><option>공공·산업시설 전기공사</option><option>신재생에너지 연계</option><option>기타 문의</option></select><label for="message">문의내용 <span>*</span></label><textarea id="message" name="message" rows="6" maxlength="5000" placeholder="현장 위치, 공사 내용, 희망 일정 등을 알려주세요." required></textarea><label class="consent"><input name="consent" type="checkbox" required><span><a href="/privacy/" target="_blank" rel="noopener">개인정보 수집 및 이용</a>에 동의합니다. <b>(필수)</b></span></label><button class="button yellow" type="submit" disabled>이메일로 문의하기 ${arrow()}</button><p class="form-hint">작성한 내용으로 메일 앱이 열립니다. 메일 앱에서 전송을 완료해 주세요.</p><button class="copy-inquiry" type="button">문의내용 복사</button><p id="form-status" role="status" aria-live="polite"></p><noscript><p>문의 양식을 사용하려면 JavaScript를 켜주세요. 이메일 <a href="mailto:info@kjs-elec.kr">info@kjs-elec.kr</a> 또는 전화 010-5096-3410으로 문의할 수 있습니다.</p></noscript></form></section><section class="location-panel"><div class="container"><div><p class="eyebrow">VISIT US</p><h2>부산 동래구에서,<br>더 넓은 현장으로.</h2><p>${company.address}<br>${company.suite}</p></div><a class="map-card" href="https://map.naver.com/p/search/${encodeURIComponent(company.address)}" target="_blank" rel="noopener noreferrer">${icon('pin')}<strong>(주)케이제이에스</strong><span>지도에서 위치 확인 ${arrow()}</span></a></div></section>`;}
function brandPage(){return `${pageHero('브랜드 이야기','전기를 연결하고,<br>신뢰를 쌓습니다.','hero-certifications.webp',true)}<section class="section container brand-story"><div class="brand-display">${img('logo.webp?v=20261019-restored','케이제이에스 공식 심벌')}<h2>(주)케이제이에스</h2><p>KJS Electric</p></div><div><p class="eyebrow">CONNECTED BY TRUST</p><h2>하나의 선에서 시작해,<br>함께 만드는 더 나은 내일.</h2><p>수직으로 뻗은 선은 전력의 흐름과 견고한 시공 기준을, 서로 다른 높이가 모인 모습은 다양한 현장과 전문 기술의 연결을 표현합니다.</p><p>따뜻하고 선명한 노란색은 에너지와 빛, 사람을 향한 기술의 가치를 담습니다. KJS는 기본을 지키는 기술과 신뢰로 공간의 내일을 밝힙니다.</p><div class="brand-colors"><div><i style="background:#ffc543"></i><b>KJS Yellow</b><small>#FFC543</small></div><div><i style="background:#272727"></i><b>Charcoal</b><small>#272727</small></div><div><i style="background:#f4f4f2"></i><b>Warm White</b><small>#F4F4F2</small></div></div></div></section>${cta()}`;}
function privacy(){return `<section class="section container legal"><p class="eyebrow">PRIVACY</p><h1>개인정보 수집·이용 안내</h1><p>문의 상담을 위해 아래와 같이 개인정보를 이용합니다.</p><h2>수집 항목 및 목적</h2><p>필수: 이름, 연락처, 문의내용<br>선택: 이메일<br>이용 목적: 공사 상담, 견적 협의 및 문의 답변</p><h2>문의 접수 방식</h2><p>홈페이지 문의 양식은 입력한 내용으로 사용자의 메일 앱을 엽니다. 메일 앱에서 직접 전송을 완료하면 회사 이메일로 접수됩니다. 전송 전에는 회사에 접수되지 않습니다. 전화 상담 또는 이메일 직접 발송도 가능합니다.</p><h2>보유 기간</h2><p>문의 처리 및 상담 목적이 달성되면 지체 없이 파기합니다. 관계 법령에 따라 보관이 필요한 경우 해당 법정 기간 동안 보관합니다.</p><h2>동의 거부 권리</h2><p>개인정보 이용 동의를 거부할 수 있습니다. 이 경우 해당 양식을 통한 상담이 제한되며, 전화로 문의할 수 있습니다.</p><h2>문의처</h2><p>${company.name}<br>이메일: <a href="mailto:${company.email}">${company.email}</a><br>전화: <a href="tel:0515443201">${company.phone}</a></p><p>시행일: 2026년 10월 18일</p></section>`;}
const pages=[['/','홈',home],['/about/','회사소개',about],['/business/','사업분야',business],...services.map(s=>['/business/'+s.slug+'/',s.title,()=>service(s)]),['/projects/','시공실적',portfolio],['/safety/','안전·품질관리',safety],['/certifications/','인증 및 면허',certifications],['/contact/','고객문의',contact],['/brand/','브랜드 이야기',brandPage],['/privacy/','개인정보처리방침',privacy]];
const origin='https://kjs-electric.onjong1.chatgpt.site';
for(const [path,title,content] of pages){const folder=new URL('.'+path,root);await mkdir(folder,{recursive:true});const html=`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title==='홈'?'전기와 사람, 더 안전한 세상을 연결합니다':title} | (주)케이제이에스</title><meta name="description" content="부산 전기공사 전문기업 (주)케이제이에스. 전기공사, 전기설비 유지보수, 산업설비, 전기 신설·증설 상담. ${company.mobile}"><meta name="theme-color" content="#ffc543"><meta property="og:title" content="${title} | KJS Electric"><meta property="og:description" content="전기와 사람, 더 안전한 세상을 연결합니다."><meta property="og:type" content="website"><meta property="og:url" content="${origin+path}"><meta property="og:image" content="${origin}/assets/logo.webp?v=20261019-restored"><link rel="canonical" href="${origin+path}"><link rel="icon" type="image/webp" href="/assets/logo.webp"><link rel="preload" href="/assets/fonts/noto-sans-kr-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css?v=20261020-banner-edge-fix"><script src="/app.js" defer></script></head><body>${header(path)}<main id="main">${content()}</main>${footer()}${(path==='/'||path==='/projects/')?`<script type="application/json" id="project-data">${JSON.stringify(projects).replaceAll('<','\\u003c')}</script>`:''}<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Electrician',name:company.name,url:origin,telephone:company.phone,email:company.email,address:{'@type':'PostalAddress',streetAddress:company.address+' '+company.suite,addressLocality:'부산광역시',addressCountry:'KR'}})}</script></body></html>`;await writeFile(new URL('index.html',folder),html);}
await writeFile(new URL('sitemap.xml',root),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(([p])=>`<url><loc>${origin+p}</loc></url>`).join('')}</urlset>`);
await writeFile(new URL('robots.txt',root),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(new URL('404.html',root),`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>페이지를 찾을 수 없습니다 | KJS</title><link rel="preload" href="/assets/fonts/noto-sans-kr-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css?v=20261020-banner-edge-fix"><body>${header('')}<main id="main" class="section container center"><p class="eyebrow">404</p><h1>페이지를 찾을 수 없습니다.</h1><p>주소를 확인하거나 홈페이지로 이동해 주세요.</p><a class="button yellow" href="/">홈으로 이동 ${arrow()}</a></main>${footer()}<script src="/app.js" defer></script></body></html>`);
const faviconLinks='<link rel="icon" href="/favicon.ico?v=20261019-restored" sizes="16x16 32x32 48x48"><link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png?v=20261019-restored"><link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192.png?v=20261019-restored"><link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png?v=20261019-restored">';
for(const file of [...pages.map(([path])=>'.'+path+'index.html'),'./404.html']){
  const url=new URL(file,root);
  const html=(await readFile(url,'utf8')).replace('<link rel="icon" type="image/webp" href="/assets/logo.webp">','').replace('</title>','</title>'+faviconLinks);
  await writeFile(url,html);
}
console.log(`Generated ${pages.length} pages.`);
