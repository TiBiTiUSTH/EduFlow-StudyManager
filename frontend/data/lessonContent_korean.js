export const KOREAN_FULL = {

  // 1. HANGUL — NGUYÊN ÂM
  kr_nguyen_am: `
<h3>🎯 Mục tiêu bài học</h3>
<ul><li>Thuộc 10 nguyên âm cơ bản</li><li>Phát âm chính xác</li></ul>

<h3>📖 10 Nguyên âm cơ bản</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Hangul</th><th class="border p-2">Phát âm</th><th class="border p-2">Ví dụ</th></tr></thead>
    <tbody>
      <tr><td class="border p-2 text-center text-2xl">ㅏ</td><td class="border p-2">a</td><td class="border p-2">아 (a)</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center text-2xl">ㅓ</td><td class="border p-2">ơ</td><td class="border p-2">어 (ơ)</td></tr>
      <tr><td class="border p-2 text-center text-2xl">ㅗ</td><td class="border p-2">ô</td><td class="border p-2">오 (ô)</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center text-2xl">ㅜ</td><td class="border p-2">u</td><td class="border p-2">우 (u)</td></tr>
      <tr><td class="border p-2 text-center text-2xl">ㅡ</td><td class="border p-2">ư</td><td class="border p-2">으 (ư)</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center text-2xl">ㅣ</td><td class="border p-2">i</td><td class="border p-2">이 (i)</td></tr>
      <tr><td class="border p-2 text-center text-2xl">ㅐ</td><td class="border p-2">e</td><td class="border p-2">애 (e)</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center text-2xl">ㅔ</td><td class="border p-2">ê</td><td class="border p-2">에 (ê)</td></tr>
      <tr><td class="border p-2 text-center text-2xl">ㅑ</td><td class="border p-2">ya</td><td class="border p-2">야 (ya)</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center text-2xl">ㅛ</td><td class="border p-2">yô</td><td class="border p-2">요 (yô)</td></tr>
    </tbody>
  </table>
</div>`,

  // 2. HANGUL — PHỤ ÂM
  kr_phu_am: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Thuộc 14 phụ âm cơ bản</li></ul>

<h3>📖 14 Phụ âm cơ bản</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Hangul</th><th class="border p-2">Phát âm</th><th class="border p-2">Hangul</th><th class="border p-2">Phát âm</th></tr></thead>
    <tbody>
      <tr><td class="border p-2 text-center text-xl">ㄱ</td><td class="border p-2">g/k</td><td class="border p-2 text-center text-xl">ㄴ</td><td class="border p-2">n</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center text-xl">ㄷ</td><td class="border p-2">d/t</td><td class="border p-2 text-center text-xl">ㄹ</td><td class="border p-2">r/l</td></tr>
      <tr><td class="border p-2 text-center text-xl">ㅁ</td><td class="border p-2">m</td><td class="border p-2 text-center text-xl">ㅂ</td><td class="border p-2">b/p</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center text-xl">ㅅ</td><td class="border p-2">s</td><td class="border p-2 text-center text-xl">ㅇ</td><td class="border p-2">-/ng</td></tr>
      <tr><td class="border p-2 text-center text-xl">ㅈ</td><td class="border p-2">j/ch</td><td class="border p-2 text-center text-xl">ㅊ</td><td class="border p-2">ch</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center text-xl">ㅋ</td><td class="border p-2">kh</td><td class="border p-2 text-center text-xl">ㅌ</td><td class="border p-2">th</td></tr>
      <tr><td class="border p-2 text-center text-xl">ㅍ</td><td class="border p-2">ph</td><td class="border p-2 text-center text-xl">ㅎ</td><td class="border p-2">h</td></tr>
    </tbody>
  </table>
</div>
<div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl my-4 text-sm">
  <p>⚠️ <strong>ㅇ</strong> ở đầu âm tiết = im lặng (placeholder). Cuối âm tiết = "ng".</p>
</div>`,

  // 3. GHÉP ÂM TIẾT
  kr_ghep_am: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Quy tắc ghép phụ âm + nguyên âm</li><li>Đọc từ đơn giản</li></ul>

<h3>📖 Cấu trúc âm tiết</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-4 text-center">
    <p class="font-bold text-blue-800">Phụ âm + Nguyên âm</p>
    <p class="text-2xl mt-2">ㄱ + ㅏ = <strong>가</strong></p>
    <p class="text-xs">(ga)</p>
  </div>
  <div class="bg-green-50 rounded-xl p-4 text-center">
    <p class="font-bold text-green-800">PA + NA + Patchim</p>
    <p class="text-2xl mt-2">ㅎ + ㅏ + ㄴ = <strong>한</strong></p>
    <p class="text-xs">(han)</p>
  </div>
</div>

<h3>📖 Bảng ghép mẫu</h3>
<div class="bg-amber-50 rounded-xl p-5 my-4 text-center text-lg">
  <p>가 나 다 라 마 바 사 아 자 차 카 타 파 하</p>
  <p class="text-sm mt-2 text-slate-600">ga na da ra ma ba sa a ja cha ka ta pa ha</p>
</div>

<h3>✏️ Bài tập: Đọc các từ sau</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4 text-center text-xl space-y-2">
  <p>한국 (Han-guk = Hàn Quốc)</p>
  <p>사람 (sa-ram = người)</p>
  <p>나라 (na-ra = đất nước)</p>
</div>`,

  // 4. CHÀO HỎI & GIỚI THIỆU
  kr_chao: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Chào hỏi lịch sự</li><li>Giới thiệu bản thân</li></ul>

<h3>📖 Các câu chào hỏi</h3>
<div class="space-y-2 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-4"><span class="text-xl font-bold">안녕하세요</span> — Xin chào (lịch sự)</div>
  <div class="bg-green-50 rounded-xl p-4"><span class="text-xl font-bold">감사합니다</span> — Cảm ơn</div>
  <div class="bg-purple-50 rounded-xl p-4"><span class="text-xl font-bold">죄송합니다</span> — Xin lỗi</div>
  <div class="bg-amber-50 rounded-xl p-4"><span class="text-xl font-bold">안녕히 가세요</span> — Tạm biệt (người đi)</div>
  <div class="bg-rose-50 rounded-xl p-4"><span class="text-xl font-bold">네 / 아니요</span> — Vâng / Không</div>
</div>

<h3>📖 Giới thiệu bản thân</h3>
<div class="bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-xl my-4 text-sm">
  <p class="text-lg">안녕하세요. 저는 <strong>[Tên]</strong>입니다.</p>
  <p class="text-slate-600 mt-1">Xin chào. Tôi là [Tên].</p>
  <p class="text-lg mt-3">저는 베트남 사람입니다.</p>
  <p class="text-slate-600 mt-1">Tôi là người Việt Nam.</p>
  <p class="text-lg mt-3">만나서 반갑습니다.</p>
  <p class="text-slate-600 mt-1">Rất vui được gặp bạn.</p>
</div>`,

  // 5. SỐ ĐẾM
  kr_so_dem: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Hai hệ thống số đếm: Hán Hàn và Thuần Hàn</li></ul>

<h3>📖 1. Số Hán Hàn (sino-korean) — dùng cho ngày, tháng, tiền</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Số</th><th class="border p-2">Hangul</th><th class="border p-2">Số</th><th class="border p-2">Hangul</th></tr></thead>
    <tbody>
      <tr><td class="border p-2">1</td><td class="border p-2">일 (il)</td><td class="border p-2">6</td><td class="border p-2">육 (yuk)</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">2</td><td class="border p-2">이 (i)</td><td class="border p-2">7</td><td class="border p-2">칠 (chil)</td></tr>
      <tr><td class="border p-2">3</td><td class="border p-2">삼 (sam)</td><td class="border p-2">8</td><td class="border p-2">팔 (pal)</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">4</td><td class="border p-2">사 (sa)</td><td class="border p-2">9</td><td class="border p-2">구 (gu)</td></tr>
      <tr><td class="border p-2">5</td><td class="border p-2">오 (o)</td><td class="border p-2">10</td><td class="border p-2">십 (sip)</td></tr>
    </tbody>
  </table>
</div>

<h3>📖 2. Số Thuần Hàn — dùng cho đếm vật (1-99)</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-green-100"><th class="border p-2">Số</th><th class="border p-2">Hangul</th><th class="border p-2">Số</th><th class="border p-2">Hangul</th></tr></thead>
    <tbody>
      <tr><td class="border p-2">1</td><td class="border p-2">하나 (hana)</td><td class="border p-2">6</td><td class="border p-2">여섯 (yơ-sơt)</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">2</td><td class="border p-2">둘 (dul)</td><td class="border p-2">7</td><td class="border p-2">일곱 (il-gop)</td></tr>
      <tr><td class="border p-2">3</td><td class="border p-2">셋 (set)</td><td class="border p-2">8</td><td class="border p-2">여덟 (yơ-đơl)</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">4</td><td class="border p-2">넷 (net)</td><td class="border p-2">9</td><td class="border p-2">아홉 (a-hop)</td></tr>
      <tr><td class="border p-2">5</td><td class="border p-2">다섯 (da-sơt)</td><td class="border p-2">10</td><td class="border p-2">열 (yơl)</td></tr>
    </tbody>
  </table>
</div>`,

  // 6. NGỮ PHÁP CƠ BẢN
  kr_ngu_phap: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Cấu trúc câu S + O + V</li><li>Trợ từ 은/는, 이/가, 을/를</li></ul>

<h3>📖 1. Trật tự câu: S + O + V</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center">
  <p class="text-xl">저<strong class="text-blue-700">는</strong> 밥<strong class="text-green-700">을</strong> <strong class="text-rose-700">먹어요</strong></p>
  <p class="text-sm mt-2">Tôi + Cơm + Ăn → "Tôi ăn cơm"</p>
</div>

<h3>📖 2. Trợ từ</h3>
<div class="space-y-2 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-4">
    <p class="font-bold">은/는 — Chủ ngữ (topic marker)</p>
    <p>Sau phụ âm: 은 | Sau nguyên âm: 는</p>
    <p class="text-xs text-slate-500">저<strong>는</strong> 학생입니다 (Tôi là học sinh)</p>
  </div>
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold">이/가 — Chủ ngữ (subject marker)</p>
    <p>Sau phụ âm: 이 | Sau nguyên âm: 가</p>
  </div>
  <div class="bg-purple-50 rounded-xl p-4">
    <p class="font-bold">을/를 — Tân ngữ (object marker)</p>
    <p>Sau phụ âm: 을 | Sau nguyên âm: 를</p>
  </div>
</div>`,

  // 7. HỘI THOẠI HÀNG NGÀY
  kr_hoi_thoai: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Giao tiếp cơ bản khi ăn uống, mua sắm</li></ul>

<h3>📖 1. Tại nhà hàng</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm space-y-2">
  <p><strong>이거 주세요</strong> — Cho tôi cái này</p>
  <p><strong>메뉴 주세요</strong> — Cho tôi xem menu</p>
  <p><strong>물 주세요</strong> — Cho tôi nước</p>
  <p><strong>얼마예요?</strong> — Bao nhiêu tiền?</p>
  <p><strong>맛있어요!</strong> — Ngon lắm!</p>
</div>

<h3>📖 2. Mua sắm</h3>
<div class="bg-green-50 rounded-xl p-5 my-4 text-sm space-y-2">
  <p><strong>이거 있어요?</strong> — Có cái này không?</p>
  <p><strong>좀 싸게 해 주세요</strong> — Giảm giá chút đi</p>
  <p><strong>카드로 할게요</strong> — Tôi trả bằng thẻ</p>
  <p><strong>현금으로 할게요</strong> — Tôi trả tiền mặt</p>
</div>

<h3>📖 3. Di chuyển</h3>
<div class="bg-purple-50 rounded-xl p-5 my-4 text-sm space-y-2">
  <p><strong>어디예요?</strong> — Ở đâu?</p>
  <p><strong>화장실이 어디예요?</strong> — Nhà vệ sinh ở đâu?</p>
  <p><strong>택시 불러 주세요</strong> — Gọi taxi giúp tôi</p>
</div>`,

};
