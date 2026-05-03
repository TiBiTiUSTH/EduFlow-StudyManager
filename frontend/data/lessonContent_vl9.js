
export const VL9_P1 = {

  // 1. SỰ PHỤ THUỘC CỦA CƯỜNG ĐỘ DÒNG ĐIỆN VÀO HIỆU ĐIỆN THẾ
  vl9_I_U: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Nêu được mối quan hệ giữa <strong>cường độ dòng điện (I)</strong> và <strong>hiệu điện thế (U)</strong></li>
  <li>Vẽ và phân tích đồ thị I-U</li>
  <li>Vận dụng vào thí nghiệm thực tế</li>
</ul>

<h3>📖 1. Khái niệm cơ bản</h3>
<div class="grid grid-cols-2 gap-4 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-4">
    <p class="font-bold text-blue-800 mb-2">⚡ Cường độ dòng điện (I)</p>
    <p>Đại lượng đo <strong>mức độ mạnh yếu</strong> của dòng điện.</p>
    <p class="mt-1">Đơn vị: <strong>Ampe (A)</strong></p>
    <p class="text-xs text-slate-500 mt-1">Dụng cụ đo: Ampe kế (mắc nối tiếp)</p>
  </div>
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800 mb-2">🔋 Hiệu điện thế (U)</p>
    <p>Đại lượng đo <strong>sự chênh lệch điện thế</strong> giữa hai đầu dây dẫn.</p>
    <p class="mt-1">Đơn vị: <strong>Vôn (V)</strong></p>
    <p class="text-xs text-slate-500 mt-1">Dụng cụ đo: Vôn kế (mắc song song)</p>
  </div>
</div>

<h3>📖 2. Kết luận từ thí nghiệm</h3>
<div class="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-xl my-4">
  <p class="font-bold text-amber-800 text-lg">📌 Kết luận quan trọng:</p>
  <p class="mt-2 text-lg">Cường độ dòng điện chạy qua dây dẫn <strong>tỉ lệ thuận</strong> với hiệu điện thế đặt vào hai đầu dây dẫn đó.</p>
  <p class="mt-2 font-mono text-center text-xl bg-white p-3 rounded-lg">Khi U tăng 2 lần → I tăng 2 lần</p>
</div>

<h3>📖 3. Đồ thị I – U</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4">
  <p>Đồ thị biểu diễn sự phụ thuộc của I vào U có dạng <strong>đường thẳng đi qua gốc tọa độ O</strong>.</p>
  <p class="mt-1 text-sm text-green-700">→ Điều này chứng tỏ I và U có quan hệ <strong>tỉ lệ thuận</strong>.</p>
</div>

<h3>📖 4. Bảng số liệu mẫu</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100">
      <th class="border border-blue-200 p-2">Lần đo</th>
      <th class="border border-blue-200 p-2">U (V)</th>
      <th class="border border-blue-200 p-2">I (A)</th>
    </tr></thead>
    <tbody>
      <tr><td class="border p-2 text-center">1</td><td class="border p-2 text-center">1.5</td><td class="border p-2 text-center">0.3</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center">2</td><td class="border p-2 text-center">3.0</td><td class="border p-2 text-center">0.6</td></tr>
      <tr><td class="border p-2 text-center">3</td><td class="border p-2 text-center">4.5</td><td class="border p-2 text-center">0.9</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center">4</td><td class="border p-2 text-center">6.0</td><td class="border p-2 text-center">1.2</td></tr>
    </tbody>
  </table>
</div>
<p class="text-sm text-slate-600">Nhận xét: Khi U tăng gấp đôi (1.5→3.0), I cũng tăng gấp đôi (0.3→0.6). Tỉ số <span class="inline-flex flex-col items-center mx-1 align-middle"><span class="text-xs">U</span><span class="border-t border-slate-600 w-full"></span><span class="text-xs">I</span></span> = 5 (không đổi) → đây chính là <strong>điện trở R</strong>.</p>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Bài 1:</p>
  <p>Khi đặt hiệu điện thế U = 6V vào hai đầu dây dẫn, cường độ dòng điện qua nó là I = 0.5A. Nếu tăng hiệu điện thế lên 12V, hỏi I bằng bao nhiêu?</p>
  <div class="bg-white rounded-lg p-3 mt-3 text-sm">
    <p class="font-bold text-green-700">Giải:</p>
    <p>Vì I tỉ lệ thuận với U nên: <span class="inline-flex flex-col items-center mx-1 align-middle"><span class="text-xs">I₂</span><span class="border-t border-slate-600 w-full"></span><span class="text-xs">I₁</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span class="text-xs">U₂</span><span class="border-t border-slate-600 w-full"></span><span class="text-xs">U₁</span></span></p>
    <p class="mt-1">→ I₂ = I₁ × <span class="inline-flex flex-col items-center mx-1 align-middle"><span class="text-xs">U₂</span><span class="border-t border-slate-600 w-full"></span><span class="text-xs">U₁</span></span> = 0.5 × <span class="inline-flex flex-col items-center mx-1 align-middle"><span class="text-xs">12</span><span class="border-t border-slate-600 w-full"></span><span class="text-xs">6</span></span> = <strong>1A</strong></p>
  </div>
</div>`,

  // 2. ĐỊNH LUẬT ÔM
  vl9_dinh_luat_ohm: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Phát biểu và viết được <strong>biểu thức định luật Ôm</strong></li>
  <li>Vận dụng công thức để tính I, U, R</li>
  <li>Giải bài tập nâng cao</li>
</ul>

<h3>📖 1. Nội dung định luật Ôm</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 my-4 text-center">
  <p class="text-sm text-blue-600 font-bold uppercase tracking-wide mb-3">Định luật Ôm</p>
  <p class="text-lg">Cường độ dòng điện chạy qua dây dẫn <strong>tỉ lệ thuận</strong> với hiệu điện thế đặt vào hai đầu dây và <strong>tỉ lệ nghịch</strong> với điện trở của dây.</p>
  <div class="bg-white rounded-xl p-5 mt-4 inline-block shadow-sm">
    <p class="text-3xl font-black text-blue-700">I = <span class="inline-flex flex-col items-center mx-2 align-middle"><span class="text-2xl">U</span><span class="border-t-2 border-blue-700 w-full"></span><span class="text-2xl">R</span></span></p>
  </div>
</div>

<h3>📖 2. Các đại lượng trong công thức</h3>
<div class="grid grid-cols-3 gap-3 my-4 text-center text-sm">
  <div class="bg-rose-50 rounded-xl p-4">
    <p class="text-3xl font-black text-rose-600">I</p>
    <p class="font-bold mt-1">Cường độ dòng điện</p>
    <p class="text-xs text-slate-500">Đơn vị: Ampe (A)</p>
  </div>
  <div class="bg-green-50 rounded-xl p-4">
    <p class="text-3xl font-black text-green-600">U</p>
    <p class="font-bold mt-1">Hiệu điện thế</p>
    <p class="text-xs text-slate-500">Đơn vị: Vôn (V)</p>
  </div>
  <div class="bg-purple-50 rounded-xl p-4">
    <p class="text-3xl font-black text-purple-600">R</p>
    <p class="font-bold mt-1">Điện trở</p>
    <p class="text-xs text-slate-500">Đơn vị: Ôm (Ω)</p>
  </div>
</div>

<h3>📖 3. Biến đổi công thức</h3>
<div class="grid grid-cols-3 gap-3 my-4 text-center">
  <div class="bg-slate-100 rounded-xl p-4">
    <p class="font-bold text-lg">I = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>U</span><span class="border-t border-slate-600 w-full"></span><span>R</span></span></p>
    <p class="text-xs text-slate-500 mt-2">Tính I khi biết U, R</p>
  </div>
  <div class="bg-slate-100 rounded-xl p-4">
    <p class="font-bold text-lg">U = I × R</p>
    <p class="text-xs text-slate-500 mt-2">Tính U khi biết I, R</p>
  </div>
  <div class="bg-slate-100 rounded-xl p-4">
    <p class="font-bold text-lg">R = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>U</span><span class="border-t border-slate-600 w-full"></span><span>I</span></span></p>
    <p class="text-xs text-slate-500 mt-2">Tính R khi biết U, I</p>
  </div>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Bài 1:</p>
  <p>Một dây dẫn có điện trở R = 20Ω, đặt hiệu điện thế U = 12V. Tính cường độ dòng điện qua dây.</p>
  <div class="bg-white rounded-lg p-3 mt-3 text-sm">
    <p class="font-bold text-green-700">Giải:</p>
    <p>I = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>U</span><span class="border-t border-slate-600 w-full"></span><span>R</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>12</span><span class="border-t border-slate-600 w-full"></span><span>20</span></span> = <strong>0.6A</strong></p>
  </div>
</div>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Bài 2:</p>
  <p>Cường độ dòng điện qua bóng đèn là 0.4A, điện trở đèn là 15Ω. Tính hiệu điện thế.</p>
  <div class="bg-white rounded-lg p-3 mt-3 text-sm">
    <p class="font-bold text-green-700">Giải:</p>
    <p>U = I × R = 0.4 × 15 = <strong>6V</strong></p>
  </div>
</div>`,

  // 3. ĐIỆN TRỞ — DÂY DẪN
  vl9_dien_tro: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Hiểu khái niệm <strong>điện trở</strong> của dây dẫn</li>
  <li>Nêu được công thức tính điện trở theo chiều dài, tiết diện và điện trở suất</li>
  <li>Giải bài tập liên quan</li>
</ul>

<h3>📖 1. Điện trở là gì?</h3>
<p>Điện trở là đại lượng <strong>đặc trưng cho mức cản trở dòng điện</strong> của dây dẫn. Điện trở càng lớn, dòng điện đi qua càng yếu.</p>

<h3>📖 2. Công thức tính điện trở dây dẫn</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 my-4 text-center">
  <div class="bg-white rounded-xl p-5 inline-block shadow-sm">
    <p class="text-3xl font-black text-blue-700">R = ρ × <span class="inline-flex flex-col items-center mx-2 align-middle"><span class="text-2xl">l</span><span class="border-t-2 border-blue-700 w-full"></span><span class="text-2xl">S</span></span></p>
  </div>
</div>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-slate-100 rounded-xl p-3"><strong>ρ</strong> (rô): Điện trở suất (Ω.m)</div>
  <div class="bg-slate-100 rounded-xl p-3"><strong>l</strong>: Chiều dài dây dẫn (m)</div>
  <div class="bg-slate-100 rounded-xl p-3"><strong>S</strong>: Tiết diện dây dẫn (m²)</div>
  <div class="bg-slate-100 rounded-xl p-3"><strong>R</strong>: Điện trở (Ω)</div>
</div>

<h3>📖 3. Các yếu tố ảnh hưởng đến điện trở</h3>
<div class="space-y-3 my-4 text-sm">
  <div class="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-xl">📏 Dây dẫn <strong>càng dài</strong> → R <strong>càng lớn</strong> (tỉ lệ thuận)</div>
  <div class="bg-rose-50 border-l-4 border-rose-400 p-3 rounded-r-xl">⭕ Tiết diện <strong>càng lớn</strong> → R <strong>càng nhỏ</strong> (tỉ lệ nghịch)</div>
  <div class="bg-purple-50 border-l-4 border-purple-400 p-3 rounded-r-xl">🔩 Phụ thuộc vào <strong>chất liệu</strong> dây (đồng dẫn tốt hơn sắt)</div>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Bài 1:</p>
  <p>Dây dẫn bằng đồng (ρ = 1.7 × 10⁻⁸ Ω.m), chiều dài l = 100m, tiết diện S = 0.5mm² = 0.5 × 10⁻⁶ m². Tính R.</p>
  <div class="bg-white rounded-lg p-3 mt-3 text-sm">
    <p class="font-bold text-green-700">Giải:</p>
    <p>R = ρ × <span class="inline-flex flex-col items-center mx-1 align-middle"><span>l</span><span class="border-t border-slate-600 w-full"></span><span>S</span></span> = 1.7×10⁻⁸ × <span class="inline-flex flex-col items-center mx-1 align-middle"><span>100</span><span class="border-t border-slate-600 w-full"></span><span>0.5×10⁻⁶</span></span> = <strong>3.4Ω</strong></p>
  </div>
</div>`,

  // 4. ĐOẠN MẠCH NỐI TIẾP
  vl9_noi_tiep: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Nêu đặc điểm của đoạn mạch mắc <strong>nối tiếp</strong></li>
  <li>Vận dụng công thức để giải bài tập</li>
</ul>

<h3>📖 1. Đoạn mạch nối tiếp là gì?</h3>
<p>Là đoạn mạch mà các điện trở được mắc <strong>liên tiếp nhau</strong>, dòng điện chỉ có <strong>một đường đi duy nhất</strong>.</p>
<div class="bg-slate-100 rounded-xl p-4 my-4">
  <p class="text-center text-sm">Các điện trở R₁, R₂, R₃ được mắc <strong>liền nhau thành chuỗi</strong>, dòng điện đi lần lượt qua từng điện trở.</p>
</div>

<h3>📖 2. Các công thức quan trọng</h3>
<div class="space-y-3 my-4">
  <div class="bg-blue-50 rounded-xl p-4 text-center">
    <p class="text-sm font-bold text-blue-800 mb-2">Cường độ dòng điện bằng nhau tại mọi điểm</p>
    <p class="text-xl font-black text-blue-700">I = I₁ = I₂ = I₃</p>
  </div>
  <div class="bg-green-50 rounded-xl p-4 text-center">
    <p class="text-sm font-bold text-green-800 mb-2">Hiệu điện thế tổng bằng tổng từng phần</p>
    <p class="text-xl font-black text-green-700">U = U₁ + U₂ + U₃</p>
  </div>
  <div class="bg-purple-50 rounded-xl p-4 text-center">
    <p class="text-sm font-bold text-purple-800 mb-2">Điện trở tương đương</p>
    <p class="text-xl font-black text-purple-700">R<sub>tđ</sub> = R₁ + R₂ + R₃</p>
  </div>
</div>

<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 rounded-r-xl text-sm">
  <p class="font-bold">⚠️ Hệ quả quan trọng:</p>
  <p class="mt-1"><span class="inline-flex flex-col items-center mx-1 align-middle"><span>U₁</span><span class="border-t border-slate-600 w-full"></span><span>U₂</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>R₁</span><span class="border-t border-slate-600 w-full"></span><span>R₂</span></span> → Hiệu điện thế tỉ lệ thuận với điện trở</p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Bài 1:</p>
  <p>Hai điện trở R₁ = 10Ω, R₂ = 20Ω mắc nối tiếp, U = 12V. Tính I, U₁, U₂.</p>
  <div class="bg-white rounded-lg p-3 mt-3 text-sm">
    <p class="font-bold text-green-700">Giải:</p>
    <p>R<sub>tđ</sub> = R₁ + R₂ = 10 + 20 = 30Ω</p>
    <p>I = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>U</span><span class="border-t border-slate-600 w-full"></span><span>R<sub>tđ</sub></span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>12</span><span class="border-t border-slate-600 w-full"></span><span>30</span></span> = <strong>0.4A</strong></p>
    <p>U₁ = I × R₁ = 0.4 × 10 = <strong>4V</strong></p>
    <p>U₂ = I × R₂ = 0.4 × 20 = <strong>8V</strong></p>
  </div>
</div>`,

  // 5. ĐOẠN MẠCH SONG SONG
  vl9_song_song: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Nêu đặc điểm đoạn mạch mắc <strong>song song</strong></li>
  <li>Tính điện trở tương đương của mạch song song</li>
</ul>

<h3>📖 1. Sơ đồ mạch song song</h3>
<p>Các điện trở được mắc <strong>cùng hai điểm nút</strong>, dòng điện chia thành nhiều nhánh.</p>
<div class="bg-slate-100 rounded-xl p-4 my-4">
  <p class="text-center text-sm">Hai điện trở R₁ và R₂ được nối chung vào <strong>hai điểm A và B</strong>, tạo thành hai nhánh song song. Dòng điện chia thành hai nhánh tại A và hợp lại tại B.</p>
</div>

<h3>📖 2. Các công thức</h3>
<div class="space-y-3 my-4">
  <div class="bg-green-50 rounded-xl p-4 text-center">
    <p class="text-sm font-bold text-green-800 mb-2">Hiệu điện thế bằng nhau</p>
    <p class="text-xl font-black text-green-700">U = U₁ = U₂</p>
  </div>
  <div class="bg-blue-50 rounded-xl p-4 text-center">
    <p class="text-sm font-bold text-blue-800 mb-2">Cường độ tổng = tổng cường độ nhánh</p>
    <p class="text-xl font-black text-blue-700">I = I₁ + I₂</p>
  </div>
  <div class="bg-purple-50 rounded-xl p-4 text-center">
    <p class="text-sm font-bold text-purple-800 mb-2">Điện trở tương đương</p>
    <p class="text-xl font-black text-purple-700"><span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t-2 border-purple-700 w-full"></span><span>R<sub>tđ</sub></span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t-2 border-purple-700 w-full"></span><span>R₁</span></span> + <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t-2 border-purple-700 w-full"></span><span>R₂</span></span></p>
  </div>
</div>

<div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold">💡 Công thức nhanh (chỉ 2 điện trở):</p>
  <p class="mt-1 text-lg text-center font-bold">R<sub>tđ</sub> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>R₁ × R₂</span><span class="border-t border-slate-600 w-full"></span><span>R₁ + R₂</span></span></p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Bài 1:</p>
  <p>R₁ = 30Ω, R₂ = 20Ω mắc song song, U = 12V. Tìm R<sub>tđ</sub>, I, I₁, I₂.</p>
  <div class="bg-white rounded-lg p-3 mt-3 text-sm">
    <p class="font-bold text-green-700">Giải:</p>
    <p>R<sub>tđ</sub> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>30 × 20</span><span class="border-t border-slate-600 w-full"></span><span>30 + 20</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>600</span><span class="border-t border-slate-600 w-full"></span><span>50</span></span> = <strong>12Ω</strong></p>
    <p>I = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>U</span><span class="border-t border-slate-600 w-full"></span><span>R<sub>tđ</sub></span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>12</span><span class="border-t border-slate-600 w-full"></span><span>12</span></span> = <strong>1A</strong></p>
    <p>I₁ = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>U</span><span class="border-t border-slate-600 w-full"></span><span>R₁</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>12</span><span class="border-t border-slate-600 w-full"></span><span>30</span></span> = <strong>0.4A</strong> &nbsp;&nbsp; I₂ = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>12</span><span class="border-t border-slate-600 w-full"></span><span>20</span></span> = <strong>0.6A</strong></p>
  </div>
</div>`,

  // 6. CÔNG SUẤT ĐIỆN — ĐIỆN NĂNG
  vl9_cong_suat: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Hiểu khái niệm <strong>công suất điện</strong> và <strong>điện năng tiêu thụ</strong></li>
  <li>Tính tiền điện hàng tháng</li>
</ul>

<h3>📖 1. Công suất điện</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 my-4 text-center">
  <p class="text-sm font-bold text-blue-600 mb-2">Công suất = Năng lượng tiêu thụ trong 1 giây</p>
  <div class="bg-white rounded-xl p-4 inline-block shadow-sm">
    <p class="text-3xl font-black text-blue-700">P = U × I</p>
  </div>
  <p class="text-sm mt-3">Đơn vị: <strong>Oát (W)</strong> hoặc <strong>kW</strong> (1kW = 1000W)</p>
</div>

<h3>📖 2. Biến đổi công thức</h3>
<div class="grid grid-cols-3 gap-3 my-4 text-center text-sm">
  <div class="bg-slate-100 rounded-xl p-3"><p class="font-bold">P = U × I</p></div>
  <div class="bg-slate-100 rounded-xl p-3"><p class="font-bold">P = I² × R</p></div>
  <div class="bg-slate-100 rounded-xl p-3"><p class="font-bold">P = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>U²</span><span class="border-t border-slate-600 w-full"></span><span>R</span></span></p></div>
</div>

<h3>📖 3. Điện năng tiêu thụ</h3>
<div class="bg-green-50 rounded-xl p-5 my-4 text-center">
  <p class="text-2xl font-black text-green-700">A = P × t</p>
  <p class="text-sm mt-2">A: điện năng (J hoặc kWh) | P: công suất (W hoặc kW) | t: thời gian (s hoặc h)</p>
</div>

<h3>📖 4. Tính tiền điện</h3>
<div class="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-xl my-4">
  <p class="font-bold text-amber-800">Ví dụ thực tế:</p>
  <p class="mt-2">Bóng đèn 100W bật 5 giờ/ngày, trong 30 ngày. Giá điện 2.500đ/kWh.</p>
  <div class="bg-white rounded-lg p-3 mt-2 text-sm">
    <p>A = P × t = 0.1kW × 5h × 30 = <strong>15 kWh</strong></p>
    <p>Tiền = 15 × 2.500 = <strong>37.500đ</strong></p>
  </div>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Bài 1:</p>
  <p>Một bàn là có công suất P = 1000W, dùng ở hiệu điện thế 220V. Tính I và R.</p>
  <div class="bg-white rounded-lg p-3 mt-3 text-sm">
    <p class="font-bold text-green-700">Giải:</p>
    <p>I = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>P</span><span class="border-t border-slate-600 w-full"></span><span>U</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1000</span><span class="border-t border-slate-600 w-full"></span><span>220</span></span> ≈ <strong>4.55A</strong></p>
    <p>R = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>U</span><span class="border-t border-slate-600 w-full"></span><span>I</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>220</span><span class="border-t border-slate-600 w-full"></span><span>4.55</span></span> ≈ <strong>48.4Ω</strong></p>
  </div>
</div>`,

};
