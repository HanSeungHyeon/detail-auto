export const sampleCategories = [
  { id: "beauty", label: "뷰티" },
  { id: "fashion", label: "패션" },
  { id: "living", label: "리빙/생활" },
  { id: "tech", label: "테크/가전" },
];

export const sampleProducts = [
  // --- BEAUTY (Avely/Olive Young Style) ---
  {
    id: "sample-beauty-01",
    categoryId: "beauty",
    title: "모공 청소기 어성초 딥 클렌징 오일",
    subtitle: "블랙헤드 99% 박멸! 예민한 피부를 위한 저자극 진정 세안",
    thumbnailUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
    audience: "블랙헤드와 넓은 모공이 고민인 1020 학생 및 사회초년생",
    sellingPoints: [
      "피부 진정에 탁월한 국산 어성초 추출물 고함량 함유",
      "피지와 유사한 오일 입자로 블랙헤드 녹여내는 유화 기술",
      "미세먼지 세정력 테스트 완료 및 논코메도제닉 인증"
    ],
    longForm: {
      heroImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1600",
      subtitle: "단 한 번의 세안으로 모공 속까지 맑게, 에이블리 1위 클렌징",
      problem: {
        title: "코 위에 박힌 까만 점들, 짜면 짤수록 모공만 더 넓어집니다.",
        desc: "무리하게 압출하지 마세요. 피부 장벽은 무너지고 모공은 돌이킬 수 없이 커집니다.\n이제 자극 없이 '녹여주는' 것이 정답입니다.",
        image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1600"
      },
      nanoBanana: {
        title: "AI가 분석한\n맑고 투명한 피부 장벽",
        desc: "어성초의 강력한 진정 효과가 선사하는 매끄러운 피부 결.\nAI 엔진으로 생성된 극강의 생얼 모델 컷을 확인해보세요.",
        cuts: [
          "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=800"
        ]
      },
      solution: {
        title: "오일은 끈적하다? 편견을 깨는 산뜻한 워터리 텍스처",
        desc: "무거운 오일감이 아닌, 물처럼 가볍게 롤링되는 제형입니다.\n유화 과정이 빨라 잔여물 없이 깔끔하게 씻겨 나갑니다.",
        stats: [
          { value: "99%", label: "블랙헤드 개선율" },
          { value: "0.00", label: "피부 자극 수치" },
          { value: "1위", label: "에이블리 클렌징 랭킹" }
        ],
        details: [
          {
            title: "🌿 당김 없는 강력한 세정력",
            desc: "메이크업은 물론 모공 속 노폐물까지 99.9% 완벽 제거. 세안 후에도 피부 수분을 지켜주어 땅김 없이 촉촉한 마무리감을 선사합니다.",
            image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=1200"
          },
          {
            title: "🔬 미세 유화 기술의 정점",
            desc: "물에 닿는 순간 밀크빛으로 변하는 퀵 유화 시스템. 모공 속 깊숙이 숨어있는 피지를 잘게 쪼개어 배출시키는 독자적인 메커니즘을 경험하세요.",
            image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200"
          }
        ]
      },
      socialProof: {
        title: "실제 구매자 5만 개의 극찬 리뷰",
        reviews: [
          { author: "이*연", rating: 5, content: "코 옆 화이트헤드 때문에 스트레스였는데 이거 쓰고 일주일 만에 매끈해졌어요! 인생템 등극입니다." },
          { author: "박*민", rating: 5, content: "오일 특유의 답답함이 없어서 너무 좋아요. 향도 은은한 허브향이라 세안할 때마다 힐링 됩니다." },
          { author: "김*아", rating: 5, content: "민감성이라 평소에 클렌징 오일 잘 못 쓰는데 이건 트러블 없이 순해요. 세정력도 최고!" }
        ]
      }
    }
  },
  // --- FASHION (Musinsa Style) ---
  {
    id: "sample-fashion-02",
    categoryId: "fashion",
    title: "빈티지 워시드 헤비웨이트 후드티",
    subtitle: "탄탄한 1,000g 중량감이 선사하는 압도적인 벌룬핏 실루엣",
    thumbnailUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    audience: "트렌디한 시티보이 룩과 오버핏을 즐기는 무신사 주 이용자",
    sellingPoints: [
      "중량감 있는 3단 쭈리 원단으로 세탁 후에도 변질 없는 각 잡힌 핏",
      "피그먼트 다잉 기법으로 구현한 자연스럽고 깊이 있는 빈티지 컬러웨이",
      "어깨선을 자연스럽게 타고 흐르는 드롭 숄더 벌룬 실루엣"
    ],
    longForm: {
      heroImage: "https://images.unsplash.com/photo-1542838639-cce2cb49539d?auto=format&fit=crop&q=80&w=1600",
      subtitle: "스테디셀러의 귀환, 어떤 코디에도 명확한 존재감을 드러내는 핏",
      problem: {
        title: "몇 번 입지도 않았는데 목이 늘어나고 각이 죽나요?",
        desc: "얇고 저렴한 후드티는 세탁 한 번에 형태를 잃습니다.\n옷장에 후드티는 많지만, 정작 손이 가는 건 '제대로 된' 하나뿐입니다.",
        image: "https://images.unsplash.com/photo-1489987707023-afc82478163a?auto=format&fit=crop&q=80&w=1600"
      },
      nanoBanana: {
        title: "AI 스트릿 룩북",
        desc: "단순한 후드티를 넘어선 하나의 오브제.\nAI가 스타일링한 힙한 무드의 시티보이 화보를 감상하세요.",
        cuts: [
          "https://images.unsplash.com/photo-1554563083-010e98033069?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1539109136881-3be0610cac48?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800"
        ]
      },
      solution: {
        title: "1,000g의 묵직함이 만드는 궁극의 황금 밸런스",
        desc: "원단을 아끼지 않았습니다. 고밀도 루프 백 소재를 사용하여\n후드 부분이 무너지지 않고 예쁘게 모양이 잡힙니다.",
        stats: [
          { value: "1,000g", label: "고중량 헤비 코튼" },
          { value: "Double", label: "특수 봉제 넥라인" },
          { value: "No.1", label: "2024 상반기 후드 부문" }
        ],
        details: [
          {
            title: "🎨 장인의 손길, 피그먼트 워싱",
            desc: "일반 염색으로는 낼 수 없는 오묘한 빈티지함. 고온 워싱 공정을 통해 세탁 시 줄어듦을 원천 차단했습니다. 입으면 입을수록 당신만의 멋이 깃듭니다.",
            image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=1200"
          },
          {
            title: "📐 체형 보정 벌룬 실루엣",
            desc: "어깨는 넓어 보이고 허리 라인은 탄탄하게 잡아주는 시보리 디테일. 남녀 공용으로 누구에게나 트렌디한 무드를 선사합니다.",
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200"
          }
        ]
      },
      socialProof: {
        title: "무신사 찐구매자들의 압도적 평점",
        reviews: [
          { author: "최*호", rating: 5, content: "후드티 각 잡히는 게 예술입니다. 다른 색도 다 사고 싶네요. 키 180인데 L사이즈 딱 좋습니다." },
          { author: "강*은", rating: 5, content: "피그먼트 색감이 정말 고급스러워요. 세탁기 막 돌려도 핏 변형 없어서 너무 만족합니다." },
          { author: "박*준", rating: 5, content: "여태껏 산 후드티 중에 제일 탄탄해요. 무게감은 좀 있지만 그만큼 따뜻하고 핏이 사기입니다." }
        ]
      }
    }
  },
  // --- LIVING (Naver/Coupang Style) ---
  {
    id: "sample-living-01",
    categoryId: "living",
    title: "기적의 숙면 기능성 경추 베개",
    subtitle: "정형외과 전문의가 설계한 인체공학적 C-커브, 뒷목 뻐근함 완벽 해소",
    thumbnailUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800",
    audience: "거북목이나 불면증으로 고생하는 직장인 및 부모님 효도 선물",
    sellingPoints: [
      "목의 C-커브를 가장 자연스럽게 유지해주는 고탄성 메모리폼 소재",
      "옆으로 누워 자도 편안한 귀 눌림 방지 이어 홀 디자인",
      "통기성이 뛰어난 텐셀 쿨링 커브로 사계절 내내 쾌적한 수면 환경"
    ],
    longForm: {
      heroImage: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=1600",
      subtitle: "당신이 잠든 사이, 당신의 목은 다시 태어납니다.",
      problem: {
        title: "자고 일어나도 개운하지 않고 목이 꺾인 듯 아픈가요?",
        desc: "잘못된 베개는 목뼈의 정렬을 무너뜨리고 어깨 통증까지 유발합니다.\n인생의 1/3을 차지하는 수면 시간, 이제는 제대로 투자해야 합니다.",
        image: "https://images.unsplash.com/photo-1511296265581-c24500444074?auto=format&fit=crop&q=80&w=1600"
      },
      nanoBanana: {
        title: "AI 숙면 가이드",
        desc: "구름 위에 누운 듯한 포근함과 탄탄한 지지력.\nAI가 연출한 아늑한 침실 무드와 평온한 휴식의 찰나를 경험하세요.",
        cuts: [
          "https://images.unsplash.com/photo-1520390159345-146430151df2?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800"
        ]
      },
      solution: {
        title: "대한민국 수면 전문가들이 선택한 단 하나의 설계",
        desc: "수만 명의 체형 데이터를 분석하여 찾아낸 최적의 높이와 경도.\n어떤 자세로 잠들어도 목의 정렬을 꼿꼿하게 지켜줍니다.",
        stats: [
          { value: "12cm", label: "최적의 뒷목 지지 높이" },
          { value: "Zero", label: "유해 물질 검출 제로" },
          { value: "4.8/5", label: "구매 만족도 평점" }
        ],
        details: [
          {
            title: "☁️ 쫀득한 99% 순수 고밀도 메모리폼",
            desc: "일반 폼보다 3배 이상 높은 밀도로 쉽게 꺼지지 않습니다. 머리의 하중을 고르게 분산시켜 무중력 상태와 같은 편안함을 선사합니다.",
            image: "https://images.unsplash.com/photo-1550254478-ead40cd82477?auto=format&fit=crop&q=80&w=1200"
          },
          {
            title: "🌬️ 구멍 송송, 에어 매쉬 시스템",
            desc: "자면서 흘리는 땀과 열기를 빠르게 배출합니다. 텐셀 소재의 겉커버는 세균 증식을 억제하여 위생적이고 뽀송뽀송한 잠자리를 유지해줍니다.",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
          }
        ]
      },
      socialProof: {
        title: "네이버 스토어 20만 리뷰가 증명합니다",
        reviews: [
          { author: "한*희", rating: 5, content: "부모님 선물로 드렸는데 너무 좋아하세요. 목 아파서 새벽에 자주 깨셨는데 이거 쓰고 꿀잠 주무신다네요." },
          { author: "김*철", rating: 5, content: "거북목 때문에 정말 고생했는데 효과 있습니다. 처음엔 좀 어색하지만 일주일만 적응하면 일반 베개 못 써요." },
          { author: "성*주", rating: 5, content: "쿠팡에서 베개 정말 많이 샀는데 이제야 정착하네요. 너무 푹신하지도 딱딱하지도 않은 딱 좋은 경도입니다." }
        ]
      }
    }
  },
  // --- TECH (Today's House Style) ---
  {
    id: "sample-tech-01",
    categoryId: "tech",
    title: "북유럽 감성 원목 무선 사운드바",
    subtitle: "거실을 영화관으로, 고급스러운 우드 디자인과 압도적 서라운드 사운드",
    thumbnailUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800",
    audience: "인테리어를 해치지 않는 프리미엄 음향 기기를 원하는 신혼부부 및 자취생",
    sellingPoints: [
      "실제 원목을 사용하여 공명감을 높이고 어떤 가구와도 어울리는 디자인",
      "블루투스 5.2 지원으로 끊김 없는 고음질 무선 스트리밍 서비스",
      "베이스 강조를 위한 듀얼 패시브 라디에이터 탑재로 생생한 현장감"
    ],
    longForm: {
      heroImage: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=1600",
      subtitle: "소리의 깊이가 공간의 품격을 결정합니다.",
      problem: {
        title: "TV 소리가 너무 작거나, 검은색 투박한 스피커가 거슬리나요?",
        desc: "최신 TV는 얇아지면서 사운드의 깊이가 줄어들었습니다.\n하지만 일반적인 사운드바는 거실 인테리어를 망치기 십상이죠.",
        image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=1600"
      },
      nanoBanana: {
        title: "AI 홈 시어터 비전",
        desc: "따뜻한 우드 톤의 거실과 완벽하게 조화되는 프리미엄 사운드 시스템.\nAI가 연출한 감각적인 거실 인테리어 화보를 확인해보세요.",
        cuts: [
          "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1583394838336-acd977730f8a?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800"
        ]
      },
      solution: {
        title: "예쁜데 소리까지 완벽한, 사기적인 밸런스",
        desc: "단순한 스피커가 아닙니다. 하나의 가구로서 공간을 완성하고,\n풀 레인지 스피커가 선사하는 맑은 고음과 웅장한 저음을 동시에 제공합니다.",
        stats: [
          { value: "40W", label: "고출력 루프 서라운드" },
          { value: "Wood", label: "리얼 원목 하우징" },
          { value: "Zero", label: "딜레이 없는 블루투스 5.2" }
        ],
        details: [
          {
            title: "🎸 소리의 울림이 다른 리얼 우드",
            desc: "플라스틱 스피커에서는 결코 낼 수 없는 따스하고 자연스러운 공명. 천연 목재가 소리를 부드럽게 감싸주어 장시간 음악을 들어도 귀가 피로하지 않습니다.",
            image: "https://images.unsplash.com/photo-1620888995574-8846c4f42eb0?auto=format&fit=crop&q=80&w=1200"
          },
          {
            title: "🌉 거실 전체를 채우는 서라운드 시스템",
            desc: "좌우 독립형 듀얼 스피커 유닛이 소리를 넓게 퍼뜨려 줍니다. 마치 영화관 한가운데 앉아있는 듯한 풍성한 공간감을 지금 거실에서 느껴보세요.",
            image: "https://images.unsplash.com/photo-1558002038-1e4282361cf6?auto=format&fit=crop&q=80&w=1200"
          }
        ]
      },
      socialProof: {
        title: "오늘의집에서 가장 많이 공유된 유저들의 리얼 리뷰",
        reviews: [
          { author: "신*혼", rating: 5, content: "인테리어를 하나도 안 해치고 오히려 소품처럼 예뻐요! 넷플릭스 볼 때 사운드 진짜 빵빵합니다." },
          { author: "이*진", rating: 5, content: "설치가 너무 간편하고 핸드폰 블루투스 연결도 빨라요. 자기 전에 라디오나 명상 음악 들을 때 최고입니다." },
          { author: "박*호", rating: 5, content: "가격 대비 소리 퀄리티가 훨씬 좋습니다. 우드 톤의 저희 집 거실장에 찰떡이네요 정말 ㅠㅠ" }
        ]
      }
    }
  }
];
