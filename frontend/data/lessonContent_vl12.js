
export const VL12_FULL = {

  // 1. DAO ĐỘNG ĐIỀU HÒA
  vl12_dddh: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Phương trình dao động điều hòa</li>
  <li>Tính chu kỳ T, tần số f, tần số góc ω</li>
</ul>
<h3>📖 1. Phương trình</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 my-4 text-center">
  <div class="bg-white rounded-xl p-4 inline-block shadow-sm">
    <p class="text-3xl font-black text-blue-700">x = A·cos(ωt + φ)</p>
  </div>
  <div class="grid grid-cols-2 gap-2 mt-3 text-sm text-left">
    <p><strong>A</strong>: biên độ (m)</p><p><strong>ω</strong>: tần số góc (rad/s)</p>
    <p><strong>φ</strong>: pha ban đầu (rad)</p><p><strong>T</strong> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>2π</span><span class="border-t border-slate-600 w-full"></span><span>ω</span></span> (s)</p>
  </div>
</div>
<h3>📖 2. Vận tốc & Gia tốc</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-center">
  <div class="bg-green-50 rounded-xl p-4"><p class="font-bold text-green-700">v = -Aω·sin(ωt + φ)</p><p class="text-xs mt-1">|v|<sub>max</sub> = Aω</p></div>
  <div class="bg-rose-50 rounded-xl p-4"><p class="font-bold text-rose-700">a = -ω²x</p><p class="text-xs mt-1">|a|<sub>max</sub> = Aω²</p></div>
</div>
<h3>📖 3. Hệ thức độc lập</h3>
<div class="bg-purple-50 rounded-xl p-4 my-4 text-center">
  <p class="font-bold text-purple-700 text-lg">A² = x² + <span class="inline-flex flex-col items-center mx-1 align-middle"><span>v²</span><span class="border-t border-purple-700 w-full"></span><span>ω²</span></span></p>
</div>
<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p>Vật dao động x = 5cos(2πt + π/3) cm. Tìm A, T, f, v<sub>max</sub>.</p>
  <p class="mt-3 text-sm text-amber-700"><strong>ĐA:</strong> A=5cm, ω=2π, T=1s, f=1Hz, v<sub>max</sub>=10π cm/s</p>
</div>`,

  // 2. CON LẮC LÒ XO
  vl12_cllx: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Công thức chu kỳ con lắc lò xo</li><li>Năng lượng dao động</li></ul>
<h3>📖 1. Chu kỳ</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 my-4 text-center">
  <p class="text-2xl font-black text-blue-700">T = 2π√(<span class="inline-flex flex-col items-center mx-1 align-middle"><span>m</span><span class="border-t-2 border-blue-700 w-full"></span><span>k</span></span>)</p>
  <p class="text-sm mt-2"><strong>m</strong>: khối lượng (kg) | <strong>k</strong>: độ cứng lò xo (N/m)</p>
</div>
<h3>📖 2. Năng lượng</h3>
<div class="grid grid-cols-3 gap-3 my-4 text-sm text-center">
  <div class="bg-green-50 rounded-xl p-3"><p class="font-bold">W<sub>đ</sub></p><p>= <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-slate-600 w-full"></span><span>2</span></span>mv²</p></div>
  <div class="bg-blue-50 rounded-xl p-3"><p class="font-bold">W<sub>t</sub></p><p>= <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-slate-600 w-full"></span><span>2</span></span>kx²</p></div>
  <div class="bg-purple-50 rounded-xl p-3"><p class="font-bold">W</p><p>= <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-slate-600 w-full"></span><span>2</span></span>kA²</p><p class="text-xs text-slate-500">Bảo toàn</p></div>
</div>`,

  // 3. CON LẮC ĐƠN
  vl12_cldon: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Chu kỳ con lắc đơn</li><li>Ứng dụng đo g</li></ul>
<h3>📖 1. Chu kỳ</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 my-4 text-center">
  <p class="text-2xl font-black text-blue-700">T = 2π√(<span class="inline-flex flex-col items-center mx-1 align-middle"><span>l</span><span class="border-t-2 border-blue-700 w-full"></span><span>g</span></span>)</p>
  <p class="text-sm mt-2"><strong>l</strong>: chiều dài dây (m) | <strong>g</strong> ≈ 9.8 m/s²</p>
</div>
<h3>📖 2. Nhận xét</h3>
<div class="space-y-2 my-4 text-sm">
  <div class="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-xl">T không phụ thuộc <strong>khối lượng</strong> vật nặng</div>
  <div class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-xl">Lên cao → g giảm → <strong>T tăng</strong> (đồng hồ chạy chậm)</div>
  <div class="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-xl">Nhiệt độ tăng → l tăng → <strong>T tăng</strong></div>
</div>`,

  // 4. TỔNG HỢP DAO ĐỘNG
  vl12_tong_hop: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Tổng hợp hai dao động cùng phương, cùng tần số</li></ul>
<h3>📖 Biên độ tổng hợp</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center">
  <p class="font-bold text-blue-700 text-lg">A² = A₁² + A₂² + 2A₁A₂cos(φ₂ - φ₁)</p>
</div>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4 text-center">
    <p class="font-bold text-green-800">Δφ = 0 (cùng pha)</p>
    <p class="text-lg font-black">A = A₁ + A₂</p>
    <p class="text-xs">(Biên độ lớn nhất)</p>
  </div>
  <div class="bg-rose-50 rounded-xl p-4 text-center">
    <p class="font-bold text-rose-800">Δφ = π (ngược pha)</p>
    <p class="text-lg font-black">A = |A₁ - A₂|</p>
    <p class="text-xs">(Biên độ nhỏ nhất)</p>
  </div>
</div>
<div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold">Luôn có: |A₁ - A₂| ≤ A ≤ A₁ + A₂</p>
</div>`,

  // 5. SÓNG CƠ
  vl12_song_co_new: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt sóng ngang, sóng dọc</li><li>Bước sóng, vận tốc truyền sóng</li></ul>
<h3>📖 1. Phân loại</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-4"><p class="font-bold text-blue-800">Sóng ngang</p><p>Phương dao động ⊥ phương truyền</p><p class="text-xs text-slate-500">VD: Sóng trên mặt nước</p></div>
  <div class="bg-green-50 rounded-xl p-4"><p class="font-bold text-green-800">Sóng dọc</p><p>Phương dao động // phương truyền</p><p class="text-xs text-slate-500">VD: Sóng âm</p></div>
</div>
<h3>📖 2. Công thức</h3>
<div class="bg-amber-50 rounded-xl p-5 my-4 text-center">
  <p class="text-xl font-black text-amber-700">v = λ × f = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>λ</span><span class="border-t border-amber-700 w-full"></span><span>T</span></span></p>
  <p class="text-sm mt-2"><strong>v</strong>: tốc độ (m/s) | <strong>λ</strong>: bước sóng (m) | <strong>f</strong>: tần số (Hz)</p>
</div>`,

  // 6. GIAO THOA SÓNG
  vl12_giao_thoa: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Điều kiện giao thoa</li><li>Vân cực đại, cực tiểu</li></ul>
<h3>📖 1. Điều kiện</h3>
<div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl my-4">
  <p>Hai nguồn <strong>cùng tần số</strong>, <strong>cùng phương</strong>, có <strong>hiệu pha không đổi</strong>.</p>
</div>
<h3>📖 2. Vân giao thoa</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4 text-center">
    <p class="font-bold text-green-800">Cực đại</p>
    <p>d₂ - d₁ = kλ</p>
    <p class="text-xs text-slate-500">(k = 0, ±1, ±2...)</p>
  </div>
  <div class="bg-rose-50 rounded-xl p-4 text-center">
    <p class="font-bold text-rose-800">Cực tiểu</p>
    <p>d₂ - d₁ = (k + <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-slate-600 w-full"></span><span>2</span></span>)λ</p>
  </div>
</div>`,

  // 7. SÓNG DỪNG
  vl12_song_dung: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Điều kiện sóng dừng trên dây</li></ul>
<h3>📖 Hai trường hợp</h3>
<div class="grid grid-cols-2 gap-4 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-5">
    <p class="font-bold text-blue-800 text-center mb-2">Hai đầu cố định</p>
    <p class="text-center text-lg font-bold">l = k × <span class="inline-flex flex-col items-center mx-1 align-middle"><span>λ</span><span class="border-t border-blue-700 w-full"></span><span>2</span></span></p>
    <p class="text-xs text-center mt-2">(k = 1, 2, 3...)</p>
  </div>
  <div class="bg-green-50 rounded-xl p-5">
    <p class="font-bold text-green-800 text-center mb-2">Một đầu cố định, một đầu tự do</p>
    <p class="text-center text-lg font-bold">l = (2k+1) × <span class="inline-flex flex-col items-center mx-1 align-middle"><span>λ</span><span class="border-t border-green-700 w-full"></span><span>4</span></span></p>
    <p class="text-xs text-center mt-2">(k = 0, 1, 2...)</p>
  </div>
</div>`,

  // 8. DÒNG ĐIỆN XOAY CHIỀU
  vl12_dien_xc: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Biểu thức u, i trong mạch xoay chiều</li><li>Giá trị hiệu dụng</li></ul>
<h3>📖 1. Biểu thức</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center">
  <p class="font-mono">u = U₀cos(ωt + φ<sub>u</sub>)</p>
  <p class="font-mono">i = I₀cos(ωt + φ<sub>i</sub>)</p>
</div>
<h3>📖 2. Giá trị hiệu dụng</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-center">
  <div class="bg-green-50 rounded-xl p-4"><p class="font-bold text-green-700">U = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>U₀</span><span class="border-t border-green-700 w-full"></span><span>√2</span></span></p></div>
  <div class="bg-blue-50 rounded-xl p-4"><p class="font-bold text-blue-700">I = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>I₀</span><span class="border-t border-blue-700 w-full"></span><span>√2</span></span></p></div>
</div>
<h3>📖 3. Mạch RLC nối tiếp</h3>
<div class="bg-purple-50 rounded-xl p-5 my-4 text-center">
  <p class="font-bold text-purple-700 text-lg">Z = √(R² + (Z<sub>L</sub> - Z<sub>C</sub>)²)</p>
  <p class="text-sm mt-2">Z<sub>L</sub> = ωL &nbsp;&nbsp; Z<sub>C</sub> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-purple-700 w-full"></span><span>ωC</span></span></p>
</div>`,

  // 9. SÓNG ĐIỆN TỪ
  vl12_song_dt: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Đặc điểm sóng điện từ</li><li>Thang sóng điện từ</li></ul>
<h3>📖 1. Đặc điểm</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm">
  <ul class="space-y-2">
    <li>🌊 Là sóng <strong>ngang</strong></li>
    <li>⚡ Truyền được trong <strong>chân không</strong> với v = c = 3×10⁸ m/s</li>
    <li>🧲 Gồm điện trường và từ trường vuông góc, biến thiên cùng tần số</li>
  </ul>
</div>
<h3>📖 2. Thang sóng điện từ</h3>
<div class="space-y-2 my-4 text-sm">
  <div class="bg-rose-50 rounded-xl p-3 text-center">📻 Sóng vô tuyến (λ > 0.1mm)</div>
  <div class="bg-amber-50 rounded-xl p-3 text-center">🔴 Tia hồng ngoại (0.76μm − 0.1mm)</div>
  <div class="bg-green-50 rounded-xl p-3 text-center">🌈 Ánh sáng nhìn thấy (0.38μm − 0.76μm)</div>
  <div class="bg-blue-50 rounded-xl p-3 text-center">🟣 Tia tử ngoại (1nm − 0.38μm)</div>
  <div class="bg-purple-50 rounded-xl p-3 text-center">☢️ Tia X, tia gamma (λ rất nhỏ)</div>
</div>`,

  // 10. VẬT LÝ HẠT NHÂN
  vl12_hat_nhan: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Cấu tạo hạt nhân, phóng xạ</li><li>Phản ứng hạt nhân</li></ul>
<h3>📖 1. Cấu tạo</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4">
  <p class="text-center text-lg font-bold">Hạt nhân <sup>A</sup><sub>Z</sub>X gồm Z proton và N = A - Z nơtron</p>
  <div class="grid grid-cols-2 gap-3 mt-3 text-sm">
    <div class="bg-white rounded-lg p-3"><strong>Z</strong>: số proton = số hiệu nguyên tử</div>
    <div class="bg-white rounded-lg p-3"><strong>A</strong>: số khối = Z + N</div>
  </div>
</div>
<h3>📖 2. Phóng xạ</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Loại</th><th class="border p-2">Ký hiệu</th><th class="border p-2">Bản chất</th></tr></thead>
    <tbody>
      <tr><td class="border p-2">Alpha</td><td class="border p-2 text-center">α = ⁴₂He</td><td class="border p-2">Hạt nhân Heli</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">Beta trừ</td><td class="border p-2 text-center">β⁻ = ⁰₋₁e</td><td class="border p-2">Electron</td></tr>
      <tr><td class="border p-2">Gamma</td><td class="border p-2 text-center">γ</td><td class="border p-2">Sóng điện từ (năng lượng cao)</td></tr>
    </tbody>
  </table>
</div>
<h3>📖 3. Định luật phóng xạ</h3>
<div class="bg-green-50 rounded-xl p-5 my-4 text-center">
  <p class="font-bold text-green-700 text-lg">N = N₀ × 2<sup>-t/T</sup></p>
  <p class="text-sm mt-2"><strong>T</strong>: chu kỳ bán rã (thời gian còn lại một nửa)</p>
</div>`,

};
