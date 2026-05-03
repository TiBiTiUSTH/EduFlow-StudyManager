
export const TOAN10_FULL = {

  // 1. MỆNH ĐỀ TOÁN HỌC
  t10_menh_de: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Khái niệm mệnh đề, mệnh đề chứa biến</li>
  <li>Phủ định, mệnh đề kéo theo, mệnh đề tương đương</li>
  <li>Các ký hiệu ∀ (với mọi) và ∃ (tồn tại)</li>
</ul>

<h3>📖 1. Mệnh đề là gì?</h3>
<div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl my-4">
  <p>Mệnh đề là <strong>câu khẳng định</strong> đúng hoặc sai (không vừa đúng vừa sai).</p>
</div>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800 mb-2">✅ Là mệnh đề</p>
    <ul class="space-y-1 text-green-700">
      <li>• "3 là số nguyên tố" → Đúng</li>
      <li>• "4 > 7" → Sai</li>
      <li>• "Hà Nội là thủ đô VN" → Đúng</li>
    </ul>
  </div>
  <div class="bg-rose-50 rounded-xl p-4">
    <p class="font-bold text-rose-800 mb-2">❌ Không phải mệnh đề</p>
    <ul class="space-y-1 text-rose-700">
      <li>• "Hôm nay trời đẹp quá!" (cảm thán)</li>
      <li>• "Bạn đi đâu?" (câu hỏi)</li>
      <li>• "x + 2 > 5" (chứa biến)</li>
    </ul>
  </div>
</div>

<h3>📖 2. Phủ định mệnh đề</h3>
<div class="bg-amber-50 rounded-xl p-5 my-4">
  <p class="text-center font-bold text-lg">Phủ định <span class="overline">P</span> có tính chất ngược lại P</p>
  <div class="grid grid-cols-2 gap-3 mt-3 text-sm">
    <div class="bg-white rounded-lg p-3 text-center"><p><strong>P:</strong> "5 > 3" (Đ)</p><p class="mt-1"><strong>P̄:</strong> "5 ≤ 3" (S)</p></div>
    <div class="bg-white rounded-lg p-3 text-center"><p><strong>P:</strong> "2 là số lẻ" (S)</p><p class="mt-1"><strong>P̄:</strong> "2 không là số lẻ" (Đ)</p></div>
  </div>
</div>

<h3>📖 3. Mệnh đề kéo theo P ⇒ Q</h3>
<div class="bg-purple-50 rounded-xl p-4 my-4 text-sm">
  <p>"Nếu P thì Q" — chỉ <strong>sai</strong> khi P đúng mà Q sai.</p>
  <p class="mt-2"><strong>VD:</strong> "Nếu n chia hết cho 4 thì n chia hết cho 2" → <strong>Đúng</strong></p>
</div>

<h3>📖 4. Ký hiệu ∀ và ∃</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm text-center">
  <div class="bg-blue-50 rounded-xl p-4"><p class="text-3xl font-black text-blue-700">∀</p><p class="font-bold">Với mọi</p><p class="text-xs text-slate-500">"∀x ∈ ℝ: x² ≥ 0"</p></div>
  <div class="bg-green-50 rounded-xl p-4"><p class="text-3xl font-black text-green-700">∃</p><p class="font-bold">Tồn tại</p><p class="text-xs text-slate-500">"∃x ∈ ℤ: x² = 4"</p></div>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <ol class="space-y-2 text-sm">
    <li>1. Câu nào là mệnh đề? "π > 3", "Hãy ngồi xuống!", "x² = 9"</li>
    <li>2. Phủ định: "Mọi số nguyên tố đều lẻ"</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>ĐA:</strong> "π > 3" là mệnh đề (Đ). "x²=9" không phải mệnh đề (chứa biến) | "Tồn tại số nguyên tố chẵn" (số 2)</p>
</div>`,

  // 2. TẬP HỢP
  t10_tap_hop: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Các phép toán trên tập hợp</li>
  <li>Tập hợp số: ℕ, ℤ, ℚ, ℝ</li>
</ul>

<h3>📖 1. Cách cho tập hợp</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-4"><p class="font-bold text-blue-800">Liệt kê</p><p>A = {1, 2, 3, 4}</p></div>
  <div class="bg-green-50 rounded-xl p-4"><p class="font-bold text-green-800">Chỉ ra tính chất</p><p>A = {x ∈ ℕ | x < 5}</p></div>
</div>

<h3>📖 2. Các phép toán</h3>
<div class="space-y-3 my-4">
  <div class="bg-blue-50 rounded-xl p-4 text-center">
    <p class="font-bold text-blue-800">Giao: A ∩ B</p>
    <p class="text-sm">Phần tử thuộc <strong>cả A và B</strong></p>
    <p class="text-xs text-slate-500 mt-1">VD: {1,2,3} ∩ {2,3,4} = {2,3}</p>
  </div>
  <div class="bg-green-50 rounded-xl p-4 text-center">
    <p class="font-bold text-green-800">Hợp: A ∪ B</p>
    <p class="text-sm">Phần tử thuộc <strong>A hoặc B</strong></p>
    <p class="text-xs text-slate-500 mt-1">VD: {1,2,3} ∪ {2,3,4} = {1,2,3,4}</p>
  </div>
  <div class="bg-rose-50 rounded-xl p-4 text-center">
    <p class="font-bold text-rose-800">Hiệu: A \\ B</p>
    <p class="text-sm">Phần tử thuộc A nhưng <strong>không thuộc B</strong></p>
    <p class="text-xs text-slate-500 mt-1">VD: {1,2,3} \\ {2,3,4} = {1}</p>
  </div>
</div>

<h3>📖 3. Khoảng, đoạn, nửa khoảng</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Ký hiệu</th><th class="border p-2">Tập hợp</th><th class="border p-2">Đặc điểm</th></tr></thead>
    <tbody>
      <tr><td class="border p-2 text-center font-mono">(a; b)</td><td class="border p-2">a < x < b</td><td class="border p-2">Khoảng (không gồm 2 đầu)</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center font-mono">[a; b]</td><td class="border p-2">a ≤ x ≤ b</td><td class="border p-2">Đoạn (gồm 2 đầu)</td></tr>
      <tr><td class="border p-2 text-center font-mono">[a; b)</td><td class="border p-2">a ≤ x < b</td><td class="border p-2">Nửa khoảng</td></tr>
    </tbody>
  </table>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p>Cho A = {1,2,3,4,5}, B = {3,4,5,6,7}. Tìm A∩B, A∪B, A\\B.</p>
  <p class="mt-3 text-sm text-amber-700"><strong>ĐA:</strong> A∩B = {3,4,5} | A∪B = {1,2,3,4,5,6,7} | A\\B = {1,2}</p>
</div>`,

  // 3. HÀM SỐ BẬC NHẤT
  t10_ham_bac_nhat: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Khái niệm hàm số, tập xác định</li>
  <li>Tính đồng biến, nghịch biến của y = ax + b</li>
</ul>

<h3>📖 1. Hàm số là gì?</h3>
<div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl my-4">
  <p>Hàm số y = f(x) là quy tắc ứng mỗi giá trị x thuộc tập D với <strong>một và chỉ một</strong> giá trị y.</p>
</div>

<h3>📖 2. Hàm số bậc nhất y = ax + b</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4 text-center">
    <p class="font-bold text-green-800">a > 0</p>
    <p class="text-lg font-black text-green-600">↗ Đồng biến</p>
    <p class="text-xs mt-1">x tăng → y tăng</p>
  </div>
  <div class="bg-rose-50 rounded-xl p-4 text-center">
    <p class="font-bold text-rose-800">a < 0</p>
    <p class="text-lg font-black text-rose-600">↘ Nghịch biến</p>
    <p class="text-xs mt-1">x tăng → y giảm</p>
  </div>
</div>

<h3>📖 3. Tập xác định</h3>
<div class="bg-amber-50 rounded-xl p-5 my-4 text-sm space-y-2">
  <p>• y = 2x + 1 → <strong>D = ℝ</strong></p>
  <p>• y = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-slate-600 w-full"></span><span>x - 3</span></span> → <strong>D = ℝ \\ {3}</strong></p>
  <p>• y = √(x - 2) → <strong>D = [2; +∞)</strong></p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <ol class="space-y-2 text-sm">
    <li>1. y = -3x + 5 đồng biến hay nghịch biến?</li>
    <li>2. Tìm TXĐ: y = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x+1</span><span class="border-t border-slate-600 w-full"></span><span>x²-4</span></span></li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>ĐA:</strong> Nghịch biến (a=-3<0) | D = ℝ \\ {±2}</p>
</div>`,

  // 4. HÀM SỐ BẬC HAI
  t10_ham_bac_hai: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Xác định chiều biến thiên hàm bậc hai</li>
  <li>Tìm đỉnh, trục đối xứng</li>
</ul>

<h3>📖 1. Dạng tổng quát</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 my-4 text-center">
  <div class="bg-white rounded-xl p-4 inline-block shadow-sm">
    <p class="text-3xl font-black text-blue-700">y = ax² + bx + c (a ≠ 0)</p>
  </div>
</div>

<h3>📖 2. Đặc điểm</h3>
<div class="grid grid-cols-2 gap-4 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800 text-lg text-center mb-2">a > 0 — Parabol ngửa</p>
    <ul class="space-y-1 text-green-700">
      <li>• Hàm số có <strong>giá trị nhỏ nhất</strong> tại đỉnh</li>
      <li>• Nghịch biến trên (-∞; <span class="inline-flex flex-col items-center mx-1 align-middle"><span>-b</span><span class="border-t border-slate-600 w-full"></span><span>2a</span></span>)</li>
      <li>• Đồng biến trên (<span class="inline-flex flex-col items-center mx-1 align-middle"><span>-b</span><span class="border-t border-slate-600 w-full"></span><span>2a</span></span>; +∞)</li>
    </ul>
  </div>
  <div class="bg-rose-50 rounded-xl p-4">
    <p class="font-bold text-rose-800 text-lg text-center mb-2">a < 0 — Parabol úp</p>
    <ul class="space-y-1 text-rose-700">
      <li>• Hàm số có <strong>giá trị lớn nhất</strong> tại đỉnh</li>
      <li>• Đồng biến trên (-∞; <span class="inline-flex flex-col items-center mx-1 align-middle"><span>-b</span><span class="border-t border-slate-600 w-full"></span><span>2a</span></span>)</li>
      <li>• Nghịch biến trên (<span class="inline-flex flex-col items-center mx-1 align-middle"><span>-b</span><span class="border-t border-slate-600 w-full"></span><span>2a</span></span>; +∞)</li>
    </ul>
  </div>
</div>

<h3>📖 3. Đỉnh và trục đối xứng</h3>
<div class="bg-purple-50 rounded-xl p-5 my-4 text-center">
  <p>Đỉnh I(<span class="inline-flex flex-col items-center mx-1 align-middle"><span>-b</span><span class="border-t border-slate-600 w-full"></span><span>2a</span></span> ; <span class="inline-flex flex-col items-center mx-1 align-middle"><span>-Δ</span><span class="border-t border-slate-600 w-full"></span><span>4a</span></span>) &nbsp;&nbsp; Trục đối xứng: x = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>-b</span><span class="border-t border-slate-600 w-full"></span><span>2a</span></span></p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p>Cho y = x² - 4x + 3. Tìm đỉnh, trục đối xứng, khoảng đồng biến và nghịch biến.</p>
  <p class="mt-3 text-sm text-amber-700"><strong>ĐA:</strong> Đỉnh I(2; -1), trục x=2. NB: (-∞; 2), ĐB: (2; +∞)</p>
</div>`,

  // 5. PHƯƠNG TRÌNH BẬC HAI
  t10_pt_bac_hai: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Giải PT bậc hai bằng công thức nghiệm</li>
  <li>Định lý Vi-ét</li>
</ul>

<h3>📖 1. Công thức nghiệm</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 my-4 text-center">
  <p class="font-bold text-blue-600 mb-2">ax² + bx + c = 0 (a ≠ 0)</p>
  <p class="text-xl">Δ = b² - 4ac</p>
  <div class="grid grid-cols-3 gap-3 mt-4 text-sm">
    <div class="bg-green-50 rounded-lg p-3"><p class="font-bold text-green-700">Δ > 0</p><p>2 nghiệm phân biệt</p><p class="mt-1">x = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>-b ± √Δ</span><span class="border-t border-slate-600 w-full"></span><span>2a</span></span></p></div>
    <div class="bg-amber-50 rounded-lg p-3"><p class="font-bold text-amber-700">Δ = 0</p><p>Nghiệm kép</p><p class="mt-1">x = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>-b</span><span class="border-t border-slate-600 w-full"></span><span>2a</span></span></p></div>
    <div class="bg-rose-50 rounded-lg p-3"><p class="font-bold text-rose-700">Δ < 0</p><p>Vô nghiệm</p></div>
  </div>
</div>

<h3>📖 2. Ví dụ</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-green-800">Giải: x² - 5x + 6 = 0</p>
  <p class="mt-1">Δ = 25 - 24 = 1 > 0</p>
  <p>x₁ = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>5 + 1</span><span class="border-t border-slate-600 w-full"></span><span>2</span></span> = 3 &nbsp;&nbsp; x₂ = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>5 - 1</span><span class="border-t border-slate-600 w-full"></span><span>2</span></span> = 2</p>
</div>

<h3>📖 3. Định lý Vi-ét</h3>
<div class="bg-purple-50 rounded-xl p-5 my-4 text-center">
  <p class="font-bold text-purple-700 text-lg">x₁ + x₂ = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>-b</span><span class="border-t border-purple-700 w-full"></span><span>a</span></span> &nbsp;&nbsp;&nbsp; x₁ × x₂ = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>c</span><span class="border-t border-purple-700 w-full"></span><span>a</span></span></p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <ol class="space-y-2 text-sm">
    <li>1. Giải: 2x² + 3x - 5 = 0</li>
    <li>2. Không giải, tìm tổng và tích hai nghiệm PT: x² - 7x + 12 = 0</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>ĐA:</strong> x=1, x=-2.5 | S=7, P=12</p>
</div>`,

  // 6. BẤT PHƯƠNG TRÌNH BẬC HAI
  t10_bpt_bac_hai: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Giải BPT bậc hai một ẩn</li>
  <li>Xét dấu tam thức bậc hai</li>
</ul>

<h3>📖 1. Quy tắc xét dấu f(x) = ax² + bx + c</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm">
  <div class="space-y-2">
    <p><strong>Bước 1:</strong> Tính Δ = b² - 4ac</p>
    <p><strong>Bước 2:</strong> Nếu Δ > 0, f(x) có 2 nghiệm x₁ < x₂</p>
    <p class="ml-6">• f(x) cùng dấu <strong>a</strong> khi x < x₁ hoặc x > x₂</p>
    <p class="ml-6">• f(x) trái dấu <strong>a</strong> khi x₁ < x < x₂</p>
  </div>
</div>

<h3>📖 2. Ví dụ</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-green-800">Giải: x² - 5x + 4 < 0</p>
  <p class="mt-1">Δ = 25 - 16 = 9 > 0 → x₁ = 1, x₂ = 4</p>
  <p>a = 1 > 0 → f(x) < 0 khi x₁ < x < x₂</p>
  <p class="font-bold text-green-700">Nghiệm: 1 < x < 4 hay x ∈ (1; 4)</p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p>Giải: x² - 3x - 10 ≥ 0</p>
  <p class="mt-3 text-sm text-amber-700"><strong>ĐA:</strong> x₁=-2, x₂=5. Nghiệm: x ≤ -2 hoặc x ≥ 5</p>
</div>`,

  // 7. HỆ BPT BẬC NHẤT HAI ẨN
  t10_he_bpt: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Biểu diễn miền nghiệm của BPT bậc nhất hai ẩn</li>
  <li>Giải hệ BPT</li>
</ul>

<h3>📖 1. BPT bậc nhất hai ẩn</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center">
  <p class="text-xl font-black text-blue-700">ax + by + c ≥ 0 (hoặc ≤, >, <)</p>
  <p class="text-sm mt-2">Miền nghiệm là <strong>nửa mặt phẳng</strong> bị chia bởi đường thẳng ax + by + c = 0</p>
</div>

<h3>📖 2. Cách xác định miền nghiệm</h3>
<div class="bg-slate-100 rounded-xl p-5 my-4 text-sm space-y-2">
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">1</span><p>Vẽ đường thẳng ax + by + c = 0</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">2</span><p>Lấy 1 điểm thử (thường O(0;0))</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">3</span><p>Nếu thỏa BPT → miền chứa điểm đó là nghiệm</p></div>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p>Xác định miền nghiệm: 2x + y ≤ 4</p>
  <p class="mt-3 text-sm text-amber-700"><strong>ĐA:</strong> Vẽ đường 2x+y=4. Thử O(0,0): 0+0=0≤4 (đúng) → Miền chứa O</p>
</div>`,

  // 8. THỐNG KÊ
  t10_thong_ke: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Tính <strong>trung bình, trung vị, mốt</strong></li>
  <li>Tính <strong>phương sai, độ lệch chuẩn</strong></li>
</ul>

<h3>📖 1. Số trung bình</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center">
  <p class="text-xl font-black text-blue-700">x̄ = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x₁ + x₂ + ... + xₙ</span><span class="border-t-2 border-blue-700 w-full"></span><span>n</span></span></p>
</div>

<h3>📖 2. Trung vị (Me) và Mốt (Mo)</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800">Trung vị (Me)</p>
    <p>Giá trị ở <strong>giữa</strong> dãy số đã sắp xếp</p>
    <p class="text-xs text-slate-500 mt-1">VD: {1,3,5,7,9} → Me = 5</p>
  </div>
  <div class="bg-purple-50 rounded-xl p-4">
    <p class="font-bold text-purple-800">Mốt (Mo)</p>
    <p>Giá trị <strong>xuất hiện nhiều nhất</strong></p>
    <p class="text-xs text-slate-500 mt-1">VD: {1,2,2,3,5} → Mo = 2</p>
  </div>
</div>

<h3>📖 3. Phương sai và Độ lệch chuẩn</h3>
<div class="bg-amber-50 rounded-xl p-5 my-4 text-center">
  <p class="font-bold">Phương sai: S² = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>Σ(xᵢ - x̄)²</span><span class="border-t border-slate-600 w-full"></span><span>n</span></span></p>
  <p class="mt-2 font-bold">Độ lệch chuẩn: S = √S²</p>
  <p class="text-sm text-slate-500 mt-2">S càng nhỏ → dữ liệu càng tập trung quanh trung bình.</p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p>Cho mẫu số liệu: 4, 6, 8, 6, 10, 6. Tìm x̄, Me, Mo.</p>
  <p class="mt-3 text-sm text-amber-700"><strong>ĐA:</strong> x̄ = 40/6 ≈ 6.67 | Sắp xếp: 4,6,6,6,8,10 → Me = (6+6)/2 = 6 | Mo = 6</p>
</div>`,

};
