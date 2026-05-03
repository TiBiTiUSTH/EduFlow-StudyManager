export const DS8_P2 = {

  // 8. PHƯƠNG TRÌNH TÍCH
  ds8_pt_tich: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Hiểu dạng phương trình tích</li>
  <li>Vận dụng A × B = 0 ⟺ A = 0 hoặc B = 0</li>
</ul>

<h3>📖 1. Nguyên tắc</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 my-4 text-center">
  <p class="text-xl font-black text-blue-700">A × B = 0 ⟺ A = 0 hoặc B = 0</p>
</div>

<h3>📖 2. Ví dụ chi tiết</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-green-800">Giải: (x - 3)(2x + 5) = 0</p>
  <p class="mt-1">TH1: x - 3 = 0 → <strong>x = 3</strong></p>
  <p>TH2: 2x + 5 = 0 → 2x = -5 → <strong>x = -2.5</strong></p>
  <p class="mt-1 font-bold text-green-700">Vậy x = 3 hoặc x = -2.5</p>
</div>

<div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-purple-800">Giải: x² - 5x = 0</p>
  <p class="mt-1">x(x - 5) = 0 (Đặt nhân tử chung)</p>
  <p>TH1: x = 0</p>
  <p>TH2: x - 5 = 0 → x = 5</p>
  <p class="mt-1 font-bold text-purple-700">Vậy x = 0 hoặc x = 5</p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <ol class="space-y-2">
    <li>1. (x + 2)(x - 7) = 0</li>
    <li>2. x² - 9x = 0</li>
    <li>3. x² - 4 = 0</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> x=-2 hoặc x=7 | x=0 hoặc x=9 | x=2 hoặc x=-2</p>
</div>`,

  // 9. PT CHỨA ẨN Ở MẪU
  ds8_pt_chua_an_mau: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Tìm ĐKXĐ của phương trình</li>
  <li>Quy đồng và giải</li>
  <li>Kiểm tra nghiệm với ĐKXĐ</li>
</ul>

<h3>📖 Các bước giải</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm space-y-3">
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span><p>Tìm <strong>ĐKXĐ</strong> (mẫu ≠ 0)</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span><p><strong>Quy đồng</strong> mẫu thức → khử mẫu</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span><p>Giải phương trình thu được</p></div>
  <div class="flex items-start"><span class="bg-red-200 text-red-800 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">4</span><p><strong>Đối chiếu</strong> nghiệm với ĐKXĐ</p></div>
</div>

<h3>📖 Ví dụ chi tiết</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-5 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-green-800">Giải: <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-slate-600 w-full"></span><span>x - 2</span></span> + <span class="inline-flex flex-col items-center mx-1 align-middle"><span>3</span><span class="border-t border-slate-600 w-full"></span><span>x + 2</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>4</span><span class="border-t border-slate-600 w-full"></span><span>x² - 4</span></span></p>
  <div class="bg-white rounded-lg p-3 mt-2 space-y-1">
    <p><strong>ĐKXĐ:</strong> x ≠ ±2</p>
    <p>Lưu ý: x² - 4 = (x-2)(x+2) → MTC = (x-2)(x+2)</p>
    <p>Khử mẫu: (x+2) + 3(x-2) = 4</p>
    <p>x + 2 + 3x - 6 = 4</p>
    <p>4x - 4 = 4 → 4x = 8 → x = 2</p>
    <p class="text-red-600 font-bold">x = 2 không thỏa ĐKXĐ → Phương trình VÔ NGHIỆM</p>
  </div>
</div>`,

  // 10. BẤT PHƯƠNG TRÌNH BẬC NHẤT
  ds8_bpt_bac_nhat: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Hiểu khái niệm bất phương trình</li>
  <li>Giải bất phương trình bậc nhất một ẩn</li>
  <li>Biểu diễn nghiệm trên trục số</li>
</ul>

<h3>📖 1. Các tính chất</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800 mb-2">✅ Cộng/trừ hai vế</p>
    <p>Cộng hoặc trừ cùng một số vào hai vế → <strong>bất đẳng thức không đổi chiều</strong></p>
  </div>
  <div class="bg-rose-50 rounded-xl p-4">
    <p class="font-bold text-rose-800 mb-2">⚠️ Nhân/chia số âm</p>
    <p>Nhân hoặc chia hai vế với số <strong>ÂM</strong> → <strong>ĐỔI CHIỀU</strong> bất đẳng thức</p>
  </div>
</div>

<h3>📖 2. Ví dụ chi tiết</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-green-800">VD1: 2x > 6</p>
  <p class="mt-1">Chia 2 vế cho 2 (số dương, giữ chiều): x > 3</p>
</div>
<div class="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-rose-800">VD2: -3x ≥ -9</p>
  <p class="mt-1">Chia 2 vế cho -3 (<strong>đổi chiều</strong>): x ≤ 3</p>
</div>
<div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-purple-800">VD3: 5x - 3 < 2x + 9</p>
  <p class="mt-1">5x - 2x < 9 + 3</p>
  <p>3x < 12</p>
  <p class="font-bold text-purple-700">x < 4</p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <ol class="space-y-2">
    <li>1. 4x + 1 > 13</li>
    <li>2. -2x ≤ 10</li>
    <li>3. 3x - 7 < x + 5</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> x > 3 | x ≥ -5 | x < 6</p>
</div>`,

  // 11. PHƯƠNG TRÌNH ĐƯỜNG THẲNG
  ds8_pt_duong_thang: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Viết phương trình đường thẳng dạng y = ax + b</li>
  <li>Xác định hệ số a (góc), b (tung độ gốc)</li>
  <li>Xét vị trí tương đối hai đường thẳng</li>
</ul>

<h3>📖 1. Phương trình đường thẳng</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 my-4 text-center">
  <div class="bg-white rounded-xl p-4 inline-block shadow-sm">
    <p class="text-3xl font-black text-blue-700">y = ax + b</p>
  </div>
  <p class="text-sm mt-3"><strong>a</strong>: hệ số góc | <strong>b</strong>: tung độ gốc</p>
</div>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4 text-center">
    <p class="font-bold text-green-800">a > 0</p>
    <p>Hàm số <strong>đồng biến</strong></p>
    <p class="text-xs text-slate-500">Đường thẳng đi lên</p>
  </div>
  <div class="bg-rose-50 rounded-xl p-4 text-center">
    <p class="font-bold text-rose-800">a < 0</p>
    <p>Hàm số <strong>nghịch biến</strong></p>
    <p class="text-xs text-slate-500">Đường thẳng đi xuống</p>
  </div>
</div>

<h3>📖 2. Vị trí tương đối</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Điều kiện</th><th class="border p-2">Vị trí</th></tr></thead>
    <tbody>
      <tr><td class="border p-2 font-mono">a₁ ≠ a₂</td><td class="border p-2">Cắt nhau</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-mono">a₁ = a₂, b₁ ≠ b₂</td><td class="border p-2">Song song</td></tr>
      <tr><td class="border p-2 font-mono">a₁ = a₂, b₁ = b₂</td><td class="border p-2">Trùng nhau</td></tr>
    </tbody>
  </table>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Cho y = 2x + 1:</p>
  <ol class="space-y-2">
    <li>1. Hệ số góc a = ? Tung độ gốc b = ?</li>
    <li>2. Hàm số đồng biến hay nghịch biến?</li>
    <li>3. Tìm tọa độ giao điểm với trục Ox (y=0)</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> a=2, b=1 | Đồng biến (a>0) | x = -0.5</p>
</div>`,

  // 12. HỆ PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN
  ds8_he_pt: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Khái niệm hệ phương trình bậc nhất hai ẩn</li>
  <li>Giải bằng phương pháp <strong>thế</strong> và <strong>cộng đại số</strong></li>
</ul>

<h3>📖 1. Dạng tổng quát</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center text-lg font-mono">
  <p>a₁x + b₁y = c₁</p>
  <p>a₂x + b₂y = c₂</p>
</div>

<h3>📖 2. Phương pháp thế</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-5 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-green-800 mb-2">Giải hệ: x + y = 5 và 2x - y = 1</p>
  <div class="bg-white rounded-lg p-3 mt-2 space-y-1">
    <p>Từ PT1: y = 5 - x</p>
    <p>Thế vào PT2: 2x - (5 - x) = 1</p>
    <p>2x - 5 + x = 1</p>
    <p>3x = 6 → <strong>x = 2</strong></p>
    <p>y = 5 - 2 = <strong>3</strong></p>
    <p class="font-bold text-green-700">Nghiệm: (x; y) = (2; 3)</p>
  </div>
</div>

<h3>📖 3. Phương pháp cộng đại số</h3>
<div class="bg-purple-50 border-l-4 border-purple-400 p-5 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-purple-800 mb-2">Giải hệ: 3x + 2y = 12 và x - 2y = 4</p>
  <div class="bg-white rounded-lg p-3 mt-2 space-y-1">
    <p>Cộng 2 PT: (3x + 2y) + (x - 2y) = 12 + 4</p>
    <p>4x = 16 → <strong>x = 4</strong></p>
    <p>Thế x = 4 vào PT1: 12 + 2y = 12 → y = 0</p>
    <p class="font-bold text-purple-700">Nghiệm: (x; y) = (4; 0)</p>
  </div>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Giải hệ PT:</p>
  <p class="font-mono">2x + y = 7</p>
  <p class="font-mono">x - y = 2</p>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> x = 3, y = 1</p>
</div>`,

  // 13. GIẢI BÀI TOÁN BẰNG CÁCH LẬP PT
  ds8_lap_pt: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Lập phương trình từ bài toán có lời văn</li>
  <li>Giải và trả lời bài toán</li>
</ul>

<h3>📖 Các bước giải</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm space-y-3">
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span><p>Chọn ẩn, đặt điều kiện cho ẩn</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span><p>Biểu diễn các đại lượng theo ẩn</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span><p>Lập phương trình dựa vào mối quan hệ</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">4</span><p>Giải PT → đối chiếu ĐK → trả lời</p></div>
</div>

<h3>📖 Ví dụ mẫu</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-5 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-green-800">Bài toán: Một hình chữ nhật có chu vi 28cm, chiều dài hơn chiều rộng 4cm. Tính các cạnh.</p>
  <div class="bg-white rounded-lg p-3 mt-2 space-y-1">
    <p><strong>Gọi</strong> chiều rộng là x (cm), ĐK: x > 0</p>
    <p>→ Chiều dài: x + 4 (cm)</p>
    <p>Theo đề: 2(x + x + 4) = 28</p>
    <p>2(2x + 4) = 28</p>
    <p>4x + 8 = 28</p>
    <p>4x = 20 → x = 5 (thỏa ĐK)</p>
    <p class="font-bold text-green-700">Chiều rộng: 5cm, Chiều dài: 9cm</p>
  </div>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p>Tổng hai số là 50. Số lớn gấp 4 lần số nhỏ. Tìm hai số.</p>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> Gọi số nhỏ = x → x + 4x = 50 → x = 10. Hai số: 10 và 40</p>
</div>`,

  // 14. ÔN TẬP TỔNG HỢP
  ds8_on_tap: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Hệ thống hóa kiến thức đã học</li>
  <li>Giải bài tập tổng hợp</li>
</ul>

<h3>📖 Sơ đồ kiến thức</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-4">
    <p class="font-bold text-blue-800 mb-2">📌 Đa thức</p>
    <ul class="space-y-1 text-blue-700">
      <li>• Nhân đơn/đa thức</li>
      <li>• 7 HĐT đáng nhớ</li>
      <li>• Phân tích nhân tử</li>
    </ul>
  </div>
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800 mb-2">📌 Phân thức</p>
    <ul class="space-y-1 text-green-700">
      <li>• Rút gọn</li>
      <li>• Cộng, trừ, nhân, chia</li>
      <li>• ĐKXĐ</li>
    </ul>
  </div>
  <div class="bg-purple-50 rounded-xl p-4">
    <p class="font-bold text-purple-800 mb-2">📌 Phương trình</p>
    <ul class="space-y-1 text-purple-700">
      <li>• PT bậc nhất</li>
      <li>• PT tích</li>
      <li>• PT chứa ẩn ở mẫu</li>
      <li>• Hệ PT</li>
    </ul>
  </div>
  <div class="bg-rose-50 rounded-xl p-4">
    <p class="font-bold text-rose-800 mb-2">📌 Bất phương trình</p>
    <ul class="space-y-1 text-rose-700">
      <li>• BPT bậc nhất</li>
      <li>• Lưu ý đổi chiều</li>
    </ul>
  </div>
</div>

<h3>✏️ Bài tập tổng hợp</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Giải các bài sau:</p>
  <ol class="space-y-3 text-sm">
    <li>1. Khai triển: (3x - 2)²</li>
    <li>2. Phân tích nhân tử: x² - x - 6</li>
    <li>3. Rút gọn: <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x² - 1</span><span class="border-t border-slate-600 w-full"></span><span>x + 1</span></span></li>
    <li>4. Giải PT: (x - 1)(x + 4) = 0</li>
    <li>5. Giải BPT: 3x - 1 > 5</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> 9x²-12x+4 | (x-3)(x+2) | x-1 | x=1 hoặc x=-4 | x>2</p>
</div>`,

};
