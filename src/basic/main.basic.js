import {
  DISCOUNT_RATES,
  THRESHOLDS,
  POINT_BONUSES,
  TIMERS,
  DAYS,
} from './constant';

// ==========================================
// 🚀 Phase 2: 전역변수 → 상태 관리 패턴 (React 준비)
// ==========================================

/**
 * 애플리케이션 상태 (React useState 패턴 준비)
 * @typedef {Object} AppState
 * @property {Array} products - 상품 목록
 * @property {Object} cart - 장바구니 상태
 * @property {string|null} lastSelected - 마지막 선택 상품 ID
 */
const appState = {
  products: [], // prodList 대체
  cart: {
    totalAmount: 0, // totalAmt 대체
    itemCount: 0, // itemCnt 대체
    bonusPoints: 0, // bonusPts 대체
  },
  lastSelected: null, // lastSel 대체
};

/**
 * UI 요소 레퍼런스 (React useRef 패턴 준비)
 * @typedef {Object} UIElements
 * @property {HTMLElement|null} stockInfo - 재고 정보 표시 요소
 * @property {HTMLSelectElement|null} productSelect - 상품 선택 드롭다운
 * @property {HTMLButtonElement|null} addButton - 장바구니 추가 버튼
 * @property {HTMLElement|null} cartDisplay - 장바구니 표시 영역
 * @property {HTMLElement|null} orderSummary - 주문 요약 영역
 */
const uiElements = {
  stockInfo: null, // stockInfo 대체
  productSelect: null, // sel 대체
  addButton: null, // addBtn 대체
  cartDisplay: null, // cartDisp 대체
  orderSummary: null, // sum 대체 (새로 추가)
};

// 🏷️ 상품 ID 상수
const PRODUCT_ONE = 'p1';
const p2 = 'p2';
const product_3 = 'p3';
const p4 = 'p4';
const PRODUCT_5 = 'p5';

/**
 * 애플리케이션 상태 초기화
 *
 * @description 앱 시작시 필요한 상태 데이터를 설정
 * - 장바구니 상태 초기화 (총액, 수량, 포인트)
 * - 상품 목록 데이터 설정
 * - 마지막 선택 상품 초기화
 */
function initializeAppState() {
  // 장바구니 상태 초기화
  appState.cart.totalAmount = 0;
  appState.cart.itemCount = 0;
  appState.cart.bonusPoints = 0;
  appState.lastSelected = null;

  // 상품 목록 데이터 설정
  appState.products = [
    {
      id: PRODUCT_ONE,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: p2,
      name: '생산성 폭발 마우스',
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: product_3,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: p4,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_5,
      name: '코딩할 때 듣는 Lo-Fi 스피커',
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ];
}

/**
 * 앱 전체 초기화 및 UI 생성
 *
 * @description 쇼핑카트 애플리케이션의 전체 초기화를 담당
 * - 제품 목록 초기화
 * - DOM 요소들 생성 및 배치
 * - 이벤트 리스너 설정
 * - 번개세일 및 추천 상품 타이머 설정
 *
 * @sideEffects
 * - 전역변수 수정 (prodList, totalAmt, itemCnt 등)
 * - DOM 조작 (app 요소에 UI 추가)
 * - 타이머 설정 (번개세일, 추천상품)
 */
function main() {
  const root = document.getElementById('app');
  const header = document.createElement('div');
  const gridContainer = document.createElement('div');
  const leftColumn = document.createElement('div');
  const selectorContainer = document.createElement('div');
  const manualToggle = document.createElement('button');
  const manualOverlay = document.createElement('div');
  const manualColumn = document.createElement('div');
  const lightningDelay = Math.random() * 10000;

  // 1️⃣ 상태 초기화
  initializeAppState();

  // 2️⃣ DOM 구조 생성
  // 헤더 생성
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  // 상품 선택 영역 생성
  uiElements.productSelect = document.createElement('select');
  uiElements.productSelect.id = 'product-select';
  uiElements.productSelect.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  uiElements.addButton = document.createElement('button');
  uiElements.addButton.id = 'add-to-cart';
  uiElements.addButton.innerHTML = 'Add to Cart';
  uiElements.addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  uiElements.stockInfo = document.createElement('div');
  uiElements.stockInfo.id = 'stock-status';
  uiElements.stockInfo.className =
    'text-xs text-red-500 mt-3 whitespace-pre-line';

  // 레이아웃 구성
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  selectorContainer.appendChild(uiElements.productSelect);
  selectorContainer.appendChild(uiElements.addButton);
  selectorContainer.appendChild(uiElements.stockInfo);

  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  leftColumn.appendChild(selectorContainer);

  uiElements.cartDisplay = document.createElement('div');
  uiElements.cartDisplay.id = 'cart-items';
  leftColumn.appendChild(uiElements.cartDisplay);

  // 주문 요약 영역 생성
  uiElements.orderSummary = document.createElement('div');
  uiElements.orderSummary.className = 'bg-black text-white p-8 flex flex-col';
  uiElements.orderSummary.innerHTML = `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;

  // 메인 그리드 구성
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(uiElements.orderSummary);

  // 도움말 버튼 및 모달 생성
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">개별 상품</p>
          <p class="text-gray-700 text-xs pl-2">
            • 키보드 10개↑: 10%<br>
            • 마우스 10개↑: 15%<br>
            • 모니터암 10개↑: 20%<br>
            • 스피커 10개↑: 25%
          </p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">특별 할인</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: +10%<br>
            • ⚡번개세일: 20%<br>
            • 💝추천할인: 5%
          </p>
        </div>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: 2배<br>
            • 키보드+마우스: +50p<br>
            • 풀세트: +100p<br>
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `;

  // 이벤트 설정
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  // DOM에 연결
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // 3️⃣ 초기 계산 및 UI 업데이트
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // 4️⃣ 타이머 설정
  setTimeout(() => {
    setInterval(() => {
      const luckyIdx = Math.floor(Math.random() * appState.products.length);
      const luckyItem = appState.products[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round(
          luckyItem.originalVal * (1 - DISCOUNT_RATES.LIGHTNING_SALE),
        );
        luckyItem.onSale = true;
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE * 100}% 할인 중입니다!`,
        );
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMERS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  setTimeout(() => {
    setInterval(() => {
      if (uiElements.cartDisplay.children.length === 0) {
        return;
      }
      if (appState.lastSelected) {
        let suggest = null;
        for (let k = 0; k < appState.products.length; k++) {
          if (appState.products[k].id !== appState.lastSelected) {
            if (appState.products[k].q > 0) {
              if (!appState.products[k].suggestSale) {
                suggest = appState.products[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGEST_SALE * 100}% 추가 할인!`,
          );
          suggest.val = Math.round(
            suggest.val * (1 - DISCOUNT_RATES.SUGGEST_SALE),
          );
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMERS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * TIMERS.MAX_INITIAL_DELAY);
}

/**
 * 상품 선택 드롭다운 옵션 업데이트
 *
 * @description 제품 목록을 기반으로 선택 드롭다운의 옵션들을 동적으로 생성/업데이트
 * - 재고 상태에 따른 옵션 표시 (품절, 할인 등)
 * - 세일 및 추천 상품 표시 (⚡, 💝 아이콘)
 * - 재고 부족시 드롭다운 테두리 색상 변경 (주황색)
 *
 * @sideEffects
 * - sel 요소의 innerHTML 수정
 * - sel 요소의 style.borderColor 수정
 */
function onUpdateSelectOptions() {
  let totalStock;
  let opt;
  let discountText;
  uiElements.productSelect.innerHTML = '';
  totalStock = 0;
  for (let idx = 0; idx < appState.products.length; idx++) {
    const _p = appState.products[idx];
    totalStock = totalStock + _p.q;
  }
  for (let i = 0; i < appState.products.length; i++) {
    (function () {
      const item = appState.products[i];
      opt = document.createElement('option');
      opt.value = item.id;
      discountText = '';
      if (item.onSale) {
        discountText += ' ⚡SALE';
      }
      if (item.suggestSale) {
        discountText += ' 💝추천';
      }
      if (item.q === 0) {
        opt.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${
            item.val
          }원 (25% SUPER SALE!)`;
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent = `⚡${item.name} - ${item.originalVal}원 → ${
            item.val
          }원 (20% SALE!)`;
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent = `💝${item.name} - ${item.originalVal}원 → ${
            item.val
          }원 (5% 추천할인!)`;
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = `${item.name} - ${item.val}원${discountText}`;
        }
      }
      uiElements.productSelect.appendChild(opt);
    })();
  }
  if (totalStock < THRESHOLDS.STOCK_ALERT_THRESHOLD) {
    uiElements.productSelect.style.borderColor = 'orange';
  } else {
    uiElements.productSelect.style.borderColor = '';
  }
}

/**
 * 장바구니 소계 및 개별 할인 계산 (순수 함수)
 *
 * @description 장바구니 아이템들의 소계와 개별 상품 할인을 계산하는 순수 함수
 *
 * 🎯 AI 리팩토링 포인트:
 * - 중첩 반복문 제거 (O(n²) → O(n))
 * - 순수 함수로 테스트 가능
 * - 단일 책임: 계산만 담당
 *
 * @param {HTMLCollection} cartItems - 장바구니 DOM 요소들
 * @param {Array} productList - 상품 목록
 * @returns {Object} { subTotal, itemCount, totalAmount, itemDiscounts }
 */
function calculateCartSubtotal(cartItems, productList) {
  // ==========================================
  // 🚀 성능 개선: Map으로 O(1) 검색
  // ==========================================
  const productMap = new Map();
  for (const product of productList) {
    productMap.set(product.id, product);
  }

  // ==========================================
  // 🧮 계산 변수 초기화
  // ==========================================
  let subTotal = 0;
  let itemCount = 0;
  let totalAmount = 0;
  const itemDiscounts = [];

  // ==========================================
  // 📊 장바구니 아이템 순회 (O(n) 복잡도)
  // ==========================================
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = productMap.get(cartItem.id); // O(1) 검색!

    if (!product) {
      continue;
    }

    // 수량 및 소계 계산
    const qtyElem = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(qtyElem.textContent);
    const itemTotal = product.val * quantity;

    subTotal += itemTotal;
    itemCount += quantity;

    // ==========================================
    // 🎯 개별 상품 할인 계산
    // ==========================================
    let discountRate = 0;

    if (quantity >= THRESHOLDS.ITEM_DISCOUNT_MIN) {
      // 🔧 하드코딩 제거를 위한 임시 방안 (추후 개선 예정)
      const discountMap = {
        [PRODUCT_ONE]: DISCOUNT_RATES.KEYBOARD,
        [p2]: DISCOUNT_RATES.MOUSE,
        [product_3]: DISCOUNT_RATES.MONITOR_ARM,
        [p4]: DISCOUNT_RATES.POUCH,
        [PRODUCT_5]: DISCOUNT_RATES.SPEAKER,
      };

      discountRate = discountMap[product.id] || 0;

      if (discountRate > 0) {
        itemDiscounts.push({
          name: product.name,
          discount: discountRate * 100,
        });
      }
    }

    // 할인 적용된 총액 누적
    totalAmount += itemTotal * (1 - discountRate);

    // ==========================================
    // 🎨 UI 상태 업데이트 (임시 - 추후 분리 예정)
    // ==========================================
    const priceElems = cartItem.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(elem => {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight =
          quantity >= THRESHOLDS.ITEM_DISCOUNT_MIN ? 'bold' : 'normal';
      }
    });
  }

  return {
    subTotal,
    itemCount,
    totalAmount,
    itemDiscounts,
  };
}

/**
 * 장바구니 총 계산 및 UI 업데이트 (⚠️ 리팩토링 필요한 거대 함수)
 *
 * @description 장바구니의 모든 계산과 UI 업데이트를 담당하는 복합 함수
 *
 * 주요 기능:
 * - 소계 계산 (각 상품 가격 × 수량)
 * - 개별 상품 할인 계산 (10개 이상시 상품별 할인율 적용)
 * - 대량구매 할인 (30개 이상시 25% 할인)
 * - 화요일 특가 추가 할인 (10% 추가)
 * - 적립 포인트 계산
 * - 주문 요약 UI 업데이트
 * - 재고 부족 알림 업데이트
 *
 * @warning 이 함수는 SRP(단일 책임 원칙)을 위반하고 있음
 * - 계산 로직과 UI 로직이 섞여 있음
 * - 150줄 이상의 거대 함수
 * - 테스트 및 디버깅이 어려움
 *
 * @sideEffects
 * - 전역변수 수정 (totalAmt, itemCnt)
 * - DOM 요소들 대량 수정 (summary-details, cart-total, loyalty-points 등)
 * - 다른 함수 호출 (handleStockInfoUpdate, doRenderBonusPoints)
 */
function handleCalculateCartStuff() {
  // ==========================================
  // 🏷️ 1단계: 변수 선언부 (관심사별 분류)
  // ==========================================

  // 🧮 계산 관련 변수들 (나중에 할당되는 것들)
  let totalAmt; // 지역변수로 계산 후 상태에 할당
  let savedAmount;
  let points;
  let discRate = 0;

  // 🎨 UI 관련 변수들
  const summaryDetails = document.getElementById('summary-details');
  const totalDiv = uiElements.orderSummary.querySelector('.text-2xl');
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  const discountInfoDiv = document.getElementById('discount-info');
  const itemCountElement = document.getElementById('item-count');
  let previousCount;
  let stockMsg;

  // 📊 데이터 관련 변수들
  const cartItems = uiElements.cartDisplay.children;
  const lowStockItems = [];

  // ==========================================
  // 🚀 AI 리팩토링: 새 함수 사용
  // ==========================================

  // 소계 및 개별 할인 계산 (성능 개선된 순수 함수 사용)
  const { subTotal, itemCount, totalAmount, itemDiscounts } =
    calculateCartSubtotal(cartItems, appState.products);

  // 지역변수 초기화 (할인 계산에 사용)
  totalAmt = totalAmount;
  const subTot = subTotal;

  // ==========================================
  // 📊 3단계: 데이터 수집 및 전처리 (재고 부족 상품만)
  // ==========================================

  // 재고 부족 상품 수집
  for (let idx = 0; idx < appState.products.length; idx++) {
    if (
      appState.products[idx].q < THRESHOLDS.LOW_STOCK_WARNING &&
      appState.products[idx].q > 0
    ) {
      lowStockItems.push(appState.products[idx].name);
    }
  }

  // ==========================================
  // 🧮 4단계: 할인 계산 로직
  // ==========================================

  // 🔧 린터 수정: const 사용 (한 번만 할당되므로)
  const originalTotal = subTot;

  // 대량구매 할인 적용 (30개 이상시 25% 할인)
  if (itemCount >= THRESHOLDS.BULK_DISCOUNT_MIN) {
    totalAmt = subTot * (1 - DISCOUNT_RATES.BULK_DISCOUNT);
    discRate = DISCOUNT_RATES.BULK_DISCOUNT;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  // 화요일 추가 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === DAYS.TUESDAY;
  const tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = totalAmt * (1 - DISCOUNT_RATES.TUESDAY_DISCOUNT);
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // ==========================================
  // 🎨 5단계: UI 업데이트
  // ==========================================

  // 장바구니 아이템 개수 업데이트
  document.getElementById('item-count').textContent =
    `🛍️ ${itemCount} items in cart`;
  // summaryDetails.innerHTML = '';
  if (subTot > 0) {
    // 🚀 중복 제거: 성능 개선된 방식 사용 (O(n²) → O(n))
    const productMap = new Map();
    for (const product of appState.products) {
      productMap.set(product.id, product);
    }

    for (let i = 0; i < cartItems.length; i++) {
      // ✅ O(1) 검색으로 성능 향상 (중첩 반복문 제거)
      const curItem = productMap.get(cartItems[i].id);

      if (!curItem) {
        continue;
      }

      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;
    if (itemCount >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(item => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday) {
      if (totalAmt > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmt / THRESHOLDS.POINTS_PER_WON);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    savedAmount = originalTotal - totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
    if (previousCount !== itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  // 재고 부족 알림 메시지 생성
  stockMsg = '';
  for (let stockIdx = 0; stockIdx < appState.products.length; stockIdx++) {
    const item = appState.products[stockIdx];
    if (item.q < THRESHOLDS.LOW_STOCK_WARNING) {
      if (item.q > 0) {
        stockMsg = `${stockMsg + item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else {
        stockMsg = `${stockMsg + item.name}: 품절\n`;
      }
    }
  }
  uiElements.stockInfo.textContent = stockMsg;

  // ==========================================
  // 📞 6단계: 상태 업데이트 및 관련 함수 호출
  // ==========================================

  // 계산 완료 후 전역 상태 업데이트
  appState.cart.totalAmount = totalAmt;
  appState.cart.itemCount = itemCount;

  handleStockInfoUpdate(); // 재고 정보 추가 업데이트
  doRenderBonusPoints(); // 포인트 계산 및 렌더링
}

/**
 * 적립 포인트 계산 및 렌더링
 *
 * @description 구매 금액과 특별 조건에 따라 적립 포인트를 계산하고 UI에 표시
 *
 * 포인트 적립 규칙:
 * - 기본: 구매액의 0.1% (1000원당 1포인트)
 * - 화요일: 기본 포인트 2배
 * - 키보드+마우스 세트: +50포인트
 * - 풀세트 구매 (키보드+마우스+모니터암): +100포인트 추가
 * - 대량구매: 10개↑ +20p, 20개↑ +50p, 30개↑ +100p
 *
 * @sideEffects
 * - 전역변수 수정 (bonusPts)
 * - DOM 수정 (loyalty-points 요소의 innerHTML, style.display)
 */
const doRenderBonusPoints = function () {
  const basePoints = Math.floor(
    appState.cart.totalAmount / THRESHOLDS.POINTS_PER_WON,
  );
  let finalPoints;
  const pointsDetail = [];
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  const nodes = uiElements.cartDisplay.children;
  if (uiElements.cartDisplay.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  finalPoints = 0;
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }
  if (new Date().getDay() === DAYS.TUESDAY) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_BONUSES.TUESDAY_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < appState.products.length; pIdx++) {
      if (appState.products[pIdx].id === node.id) {
        product = appState.products[pIdx];
        break;
      }
    }
    if (!product) {
      continue;
    }
    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === p2) {
      hasMouse = true;
    } else if (product.id === product_3) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINT_BONUSES.KEYBOARD_MOUSE_SET;
    pointsDetail.push(
      `키보드+마우스 세트 +${POINT_BONUSES.KEYBOARD_MOUSE_SET}p`,
    );
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINT_BONUSES.FULL_SET;
    pointsDetail.push(`풀세트 구매 +${POINT_BONUSES.FULL_SET}p`);
  }
  if (appState.cart.itemCount >= THRESHOLDS.BULK_DISCOUNT_MIN) {
    finalPoints = finalPoints + POINT_BONUSES.BULK_30;
    pointsDetail.push(
      `대량구매(${THRESHOLDS.BULK_DISCOUNT_MIN}개+) +${POINT_BONUSES.BULK_30}p`,
    );
  } else if (appState.cart.itemCount >= 20) {
    finalPoints = finalPoints + POINT_BONUSES.BULK_20;
    pointsDetail.push(`대량구매(20개+) +${POINT_BONUSES.BULK_20}p`);
  } else if (appState.cart.itemCount >= THRESHOLDS.ITEM_DISCOUNT_MIN) {
    finalPoints = finalPoints + POINT_BONUSES.BULK_10;
    pointsDetail.push(
      `대량구매(${THRESHOLDS.ITEM_DISCOUNT_MIN}개+) +${POINT_BONUSES.BULK_10}p`,
    );
  }
  appState.cart.bonusPoints = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (appState.cart.bonusPoints > 0) {
      ptsTag.innerHTML =
        `<div>적립 포인트: <span class="font-bold">${appState.cart.bonusPoints}p</span></div>` +
        `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(
          ', ',
        )}</div>`;
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};

/**
 * 전체 재고 수량 계산
 *
 * @description 모든 제품의 재고 수량을 합산하여 반환
 *
 * @returns {number} 전체 재고 수량의 합계
 *
 * @example
 * const totalStock = onGetStockTotal();
 * console.log(`총 재고: ${totalStock}개`);
 */
function onGetStockTotal() {
  let sum;
  let i;
  let currentProduct;
  sum = 0;
  for (i = 0; i < appState.products.length; i++) {
    currentProduct = appState.products[i];
    sum += currentProduct.q;
  }
  return sum;
}

/**
 * 재고 부족/품절 알림 메시지 업데이트
 *
 * @description 각 제품의 재고 상태를 확인하여 부족/품절 알림 메시지를 생성하고 UI에 표시
 *
 * 알림 조건:
 * - 재고 5개 미만: "재고 부족 (N개 남음)" 메시지 표시
 * - 재고 0개: "품절" 메시지 표시
 * - 전체 재고 30개 미만: 추가 로직 실행 (현재 빈 구현)
 *
 * @sideEffects
 * - stockInfo 요소의 textContent 수정
 */
const handleStockInfoUpdate = function () {
  let infoMsg;
  // let messageOptimizer;
  infoMsg = '';
  const totalStock = onGetStockTotal();
  if (totalStock < 30) {
    return;
  }
  appState.products.forEach(item => {
    if (item.q < THRESHOLDS.LOW_STOCK_WARNING) {
      if (item.q > 0) {
        infoMsg = `${infoMsg + item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else {
        infoMsg = `${infoMsg + item.name}: 품절\n`;
      }
    }
  });
  uiElements.stockInfo.textContent = infoMsg;
};

/**
 * 세일/할인 적용시 장바구니 내 가격 업데이트
 *
 * @description 번개세일이나 추천할인이 적용된 상품들의 장바구니 내 가격과 이름을 업데이트
 *
 * 업데이트 내용:
 * - 상품명에 할인 아이콘 추가 (⚡번개세일, 💝추천할인, ⚡💝동시할인)
 * - 가격 표시를 원가 취소선 + 할인가로 변경
 * - 할인 상태에 따른 색상 변경 (빨강/파랑/보라)
 *
 * @sideEffects
 * - 장바구니 아이템들의 가격 표시 DOM 수정
 * - 상품명 텍스트 수정
 * - handleCalculateCartStuff() 함수 호출로 전체 계산 재실행
 */
function doUpdatePricesInCart() {
  const cartItems = uiElements.cartDisplay.children;
  // while (cartDisp.children[j]) {
  //   const qty = cartDisp.children[j].querySelector('.quantity-number');
  //   totalCount += qty ? parseInt(qty.textContent) : 0;
  //   j++;
  // }
  // for (let j = 0; j < cartDisp.children.length; j++) {
  //   totalCount += parseInt(
  //     cartDisp.children[j].querySelector('.quantity-number').textContent,
  //   );
  // }
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (
      let productIdx = 0;
      productIdx < appState.products.length;
      productIdx++
    ) {
      if (appState.products[productIdx].id === itemId) {
        product = appState.products[productIdx];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.val.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff();
}
main();
uiElements.addButton.addEventListener('click', () => {
  const selItem = uiElements.productSelect.value;
  let hasItem = false;
  for (let idx = 0; idx < appState.products.length; idx++) {
    if (appState.products[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < appState.products.length; j++) {
    if (appState.products[j].id === selItem) {
      itemToAdd = appState.products[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd['id']);
    if (item) {
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      uiElements.cartDisplay.appendChild(newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    appState.lastSelected = selItem;
  }
});
uiElements.cartDisplay.addEventListener('click', event => {
  const tgt = event.target;
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < appState.products.length; prdIdx++) {
      if (appState.products[prdIdx].id === prodId) {
        prod = appState.products[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        prod.q += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < THRESHOLDS.LOW_STOCK_WARNING) {
      // 재고 부족 알림 로직 (현재 없음)
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});
