export const DSTT_FULL = {

  // 1. MA TRẬN
  dstt_matran: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Khái niệm ma trận, các phép toán</li></ul>
<h3>📖 1. Định nghĩa</h3>
<div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl my-4">
  <p>Ma trận cỡ <strong>m × n</strong> là bảng gồm m hàng, n cột.</p>
</div>
<h3>📖 2. Phép toán</h3>
<div class="space-y-2 my-4 text-sm">
  <div class="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-xl"><strong>Cộng:</strong> A + B → cùng cỡ, cộng từng phần tử tương ứng</div>
  <div class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-xl"><strong>Nhân vô hướng:</strong> kA → nhân mỗi phần tử với k</div>
  <div class="bg-purple-50 border-l-4 border-purple-400 p-3 rounded-r-xl"><strong>Nhân ma trận:</strong> A(m×n) × B(n×p) → C(m×p)</div>
</div>
<div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl my-4 text-sm">
  <p><strong>⚠️ Lưu ý:</strong> A × B ≠ B × A (phép nhân không giao hoán)</p>
</div>
<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4 text-sm">
  <p>Cho ma trận A và B. Tính A + B và A × B.</p>
  <div class="flex items-center gap-4 mt-3 flex-wrap">
    <span>A =</span>
    <span class="inline-flex items-stretch mx-1"><span class="border-l-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tl-sm rounded-bl-sm"></span><table><tr><td class="px-3 py-1 text-center">1</td><td class="px-3 py-1 text-center">2</td></tr><tr><td class="px-3 py-1 text-center">3</td><td class="px-3 py-1 text-center">4</td></tr></table><span class="border-r-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tr-sm rounded-br-sm"></span></span>
    <span>B =</span>
    <span class="inline-flex items-stretch mx-1"><span class="border-l-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tl-sm rounded-bl-sm"></span><table><tr><td class="px-3 py-1 text-center">5</td><td class="px-3 py-1 text-center">6</td></tr><tr><td class="px-3 py-1 text-center">7</td><td class="px-3 py-1 text-center">8</td></tr></table><span class="border-r-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tr-sm rounded-br-sm"></span></span>
  </div>
  <div class="flex items-center gap-4 mt-4 flex-wrap text-amber-700">
    <strong>ĐA:</strong>
    <span>A+B =</span>
    <span class="inline-flex items-stretch mx-1"><span class="border-l-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tl-sm rounded-bl-sm"></span><table><tr><td class="px-3 py-1 text-center">6</td><td class="px-3 py-1 text-center">8</td></tr><tr><td class="px-3 py-1 text-center">10</td><td class="px-3 py-1 text-center">12</td></tr></table><span class="border-r-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tr-sm rounded-br-sm"></span></span>
    <span>A×B =</span>
    <span class="inline-flex items-stretch mx-1"><span class="border-l-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tl-sm rounded-bl-sm"></span><table><tr><td class="px-3 py-1 text-center">19</td><td class="px-3 py-1 text-center">22</td></tr><tr><td class="px-3 py-1 text-center">43</td><td class="px-3 py-1 text-center">50</td></tr></table><span class="border-r-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tr-sm rounded-br-sm"></span></span>
  </div>
</div>`,

  // 2. ĐỊNH THỨC
  dstt_dinh_thuc: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính định thức cấp 2, 3</li><li>Tính chất định thức</li></ul>
<h3>📖 1. Định thức cấp 2</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center">
  <p class="text-xl font-black text-blue-700">det(A) = a₁₁a₂₂ - a₁₂a₂₁</p>
</div>
<h3>📖 2. Định thức cấp 3 (Sarrus)</h3>
<div class="bg-green-50 rounded-xl p-5 my-4 text-sm">
  <p>Viết thêm 2 cột đầu sang phải. Cộng 3 tích đường chéo chính, trừ 3 tích đường chéo phụ.</p>
</div>
<h3>📖 3. Tính chất</h3>
<div class="space-y-2 my-4 text-sm">
  <div class="bg-slate-100 rounded-xl p-3">• Đổi 2 hàng → đổi dấu det</div>
  <div class="bg-slate-100 rounded-xl p-3">• Nhân 1 hàng với k → det nhân k</div>
  <div class="bg-slate-100 rounded-xl p-3">• Hàng i = k × hàng j → det = 0</div>
</div>`,

  // 3. MA TRẬN NGHỊCH ĐẢO
  dstt_nghich_dao: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Điều kiện tồn tại ma trận nghịch đảo</li><li>Tính A⁻¹</li></ul>
<h3>📖 1. Điều kiện</h3>
<div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl my-4">
  <p>A khả nghịch ⟺ <strong>det(A) ≠ 0</strong></p>
</div>
<h3>📖 2. Công thức cấp 2</h3>
<div class="bg-green-50 rounded-xl p-5 my-4 text-center">
  <p class="font-bold text-green-700">A⁻¹ = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-green-700 w-full"></span><span>det(A)</span></span> × adj(A)</p>
</div>
<div class="bg-amber-50 rounded-xl p-4 my-4 text-sm">
  <div class="flex items-center gap-2 flex-wrap">
    <span>Với A 2×2: A =</span>
    <span class="inline-flex items-stretch mx-1"><span class="border-l-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tl-sm rounded-bl-sm"></span><table><tr><td class="px-3 py-1 text-center">a</td><td class="px-3 py-1 text-center">b</td></tr><tr><td class="px-3 py-1 text-center">c</td><td class="px-3 py-1 text-center">d</td></tr></table><span class="border-r-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tr-sm rounded-br-sm"></span></span>
    <span>→ A⁻¹ = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-slate-600 w-full"></span><span>ad-bc</span></span> ×</span>
    <span class="inline-flex items-stretch mx-1"><span class="border-l-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tl-sm rounded-bl-sm"></span><table><tr><td class="px-3 py-1 text-center">d</td><td class="px-3 py-1 text-center">-b</td></tr><tr><td class="px-3 py-1 text-center">-c</td><td class="px-3 py-1 text-center">a</td></tr></table><span class="border-r-2 border-t-2 border-b-2 border-slate-700 w-2 rounded-tr-sm rounded-br-sm"></span></span>
  </div>
</div>`,

  // 4. HẠNG CỦA MA TRẬN
  dstt_hang: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Biến đổi sơ cấp, tìm hạng</li></ul>
<h3>📖 Phương pháp</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm">
  <p><strong>Hạng = r(A)</strong> = số hàng khác 0 sau khi biến đổi về dạng bậc thang.</p>
</div>
<h3>📖 Các phép biến đổi sơ cấp</h3>
<div class="space-y-2 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-3">🔄 Đổi chỗ 2 hàng</div>
  <div class="bg-blue-50 rounded-xl p-3">✖️ Nhân 1 hàng với k ≠ 0</div>
  <div class="bg-purple-50 rounded-xl p-3">➕ Cộng bội của hàng này vào hàng kia</div>
</div>`,

  // 5. HỆ PHƯƠNG TRÌNH TUYẾN TÍNH
  dstt_he_pt: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải hệ bằng phương pháp Gauss</li><li>Biện luận số nghiệm</li></ul>
<h3>📖 1. Ma trận mở rộng</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4">
  <p class="text-sm">Viết hệ PT dạng [A | b], biến đổi về bậc thang, suy ra nghiệm.</p>
</div>
<h3>📖 2. Biện luận (Kronecker–Capelli)</h3>
<div class="grid grid-cols-3 gap-3 my-4 text-sm text-center">
  <div class="bg-green-50 rounded-xl p-3"><p class="font-bold">r(A) = r(A̅) = n</p><p>Nghiệm duy nhất</p></div>
  <div class="bg-amber-50 rounded-xl p-3"><p class="font-bold">r(A) = r(A̅) < n</p><p>Vô số nghiệm</p></div>
  <div class="bg-rose-50 rounded-xl p-3"><p class="font-bold">r(A) ≠ r(A̅)</p><p>Vô nghiệm</p></div>
</div>`,

  // 6. NGHIỆM CRAMER
  dstt_cramer: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Quy tắc Cramer giải hệ n PT n ẩn</li></ul>
<h3>📖 Quy tắc Cramer</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center">
  <p class="text-lg font-bold text-blue-700">xᵢ = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>Dᵢ</span><span class="border-t-2 border-blue-700 w-full"></span><span>D</span></span></p>
  <p class="text-sm mt-2">D = det(A), Dᵢ = det(A thay cột i bằng b)</p>
  <p class="text-sm">Điều kiện: <strong>D ≠ 0</strong></p>
</div>
<h3>✏️ Ví dụ</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4 text-sm">
  <p>2x + y = 5 &nbsp;&nbsp;&nbsp; x - y = 1</p>
  <p class="mt-1">D = 2×(-1) - 1×1 = -3</p>
  <p>D₁ = 5×(-1) - 1×1 = -6 → x = -6/-3 = 2</p>
  <p>D₂ = 2×1 - 5×1 = -3 → y = -3/-3 = 1</p>
</div>`,

  // 7. KHÔNG GIAN VECTƠ
  dstt_kgv: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Khái niệm không gian vectơ</li><li>Tổ hợp tuyến tính</li></ul>
<h3>📖 1. Không gian vectơ</h3>
<div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl my-4">
  <p>Tập hợp V có <strong>phép cộng</strong> và <strong>nhân vô hướng</strong> thỏa 8 tiên đề.</p>
  <p class="text-sm mt-1">VD: ℝⁿ, tập đa thức bậc ≤ n, tập ma trận m×n.</p>
</div>
<h3>📖 2. Tổ hợp tuyến tính</h3>
<div class="bg-green-50 rounded-xl p-4 my-4 text-sm">
  <p>v = k₁v₁ + k₂v₂ + ... + kₙvₙ (k ∈ ℝ)</p>
</div>`,

  // 8. ĐỘC LẬP TUYẾN TÍNH
  dstt_doc_lap: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt ĐLTT và PTTT</li><li>Kiểm tra bằng định thức</li></ul>
<h3>📖 Định nghĩa</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800">Độc lập TT</p>
    <p>k₁v₁ + ... + kₙvₙ = 0 ⟹ k₁ = ... = kₙ = 0</p>
    <p class="text-xs text-slate-500 mt-1">Chỉ có nghiệm tầm thường</p>
  </div>
  <div class="bg-rose-50 rounded-xl p-4">
    <p class="font-bold text-rose-800">Phụ thuộc TT</p>
    <p>Tồn tại kᵢ ≠ 0 sao cho tổ hợp = 0</p>
    <p class="text-xs text-slate-500 mt-1">1 vectơ là THTT của các vt còn lại</p>
  </div>
</div>
<div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl my-4 text-sm">
  <p><strong>Kiểm tra nhanh (n vectơ n chiều):</strong> det ≠ 0 → ĐLTT | det = 0 → PTTT</p>
</div>`,

  // 9. CƠ SỞ VÀ SỐ CHIỀU
  dstt_co_so: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Cơ sở của không gian vectơ</li><li>Tọa độ theo cơ sở</li></ul>
<h3>📖 Cơ sở</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4">
  <p class="text-center"><strong>Cơ sở</strong> = hệ vectơ ĐLTT và sinh ra toàn bộ không gian.</p>
  <p class="text-center mt-2">dim(V) = số vectơ trong cơ sở</p>
</div>
<h3>📖 Ví dụ</h3>
<div class="bg-green-50 rounded-xl p-4 my-4 text-sm">
  <p>Cơ sở chính tắc ℝ³: {e₁=(1,0,0), e₂=(0,1,0), e₃=(0,0,1)} → dim = 3</p>
</div>`,

  // 10. ÁNH XẠ TUYẾN TÍNH
  dstt_anh_xa: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa ánh xạ tuyến tính</li><li>Hạt nhân, ảnh</li></ul>
<h3>📖 1. Định nghĩa</h3>
<div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl my-4">
  <p>f: V → W là <strong>ánh xạ tuyến tính</strong> nếu:</p>
  <p class="mt-1">• f(u + v) = f(u) + f(v)</p>
  <p>• f(ku) = kf(u)</p>
</div>
<h3>📖 2. Hạt nhân và Ảnh</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4"><p class="font-bold text-green-800">Ker(f)</p><p>= {v ∈ V | f(v) = 0}</p><p class="text-xs text-slate-500 mt-1">Hạt nhân</p></div>
  <div class="bg-purple-50 rounded-xl p-4"><p class="font-bold text-purple-800">Im(f)</p><p>= {f(v) | v ∈ V}</p><p class="text-xs text-slate-500 mt-1">Ảnh</p></div>
</div>
<h3>📖 3. Đẳng thức chiều</h3>
<div class="bg-amber-50 rounded-xl p-4 my-4 text-center">
  <p class="font-bold text-amber-700">dim(Ker f) + dim(Im f) = dim(V)</p>
</div>`,

};
