export const DS8_P1 = {

  // 1. NHÂN ĐƠN THỨC VỚI ĐA THỨC
  ds8_nhan_don_da: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Nắm quy tắc nhân đơn thức với đa thức</li>
  <li>Nhân đa thức với đa thức</li>
  <li>Áp dụng vào bài tập</li>
</ul>

<h3>📖 1. Nhân đơn thức với đa thức</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 my-4 text-center">
  <p class="text-sm text-blue-600 font-bold mb-2">QUY TẮC</p>
  <p class="text-lg">Nhân đơn thức với <strong>từng hạng tử</strong> của đa thức rồi cộng kết quả lại.</p>
  <div class="bg-white rounded-xl p-4 mt-3 inline-block shadow-sm">
    <p class="text-xl font-black text-blue-700">A × (B + C) = A×B + A×C</p>
  </div>
</div>

<h3>📖 Ví dụ chi tiết</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4">
  <p class="font-bold text-green-800">VD1: 3x(2x² - 5x + 4)</p>
  <div class="mt-2 space-y-1">
    <p>= 3x × 2x² + 3x × (-5x) + 3x × 4</p>
    <p>= <strong>6x³ - 15x² + 12x</strong></p>
  </div>
</div>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4">
  <p class="font-bold text-green-800">VD2: -2x²(x³ + 3x - 1)</p>
  <div class="mt-2 space-y-1">
    <p>= -2x² × x³ + (-2x²) × 3x + (-2x²) × (-1)</p>
    <p>= <strong>-2x⁵ - 6x³ + 2x²</strong></p>
  </div>
</div>

<h3>📖 2. Nhân đa thức với đa thức</h3>
<div class="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 my-4 text-center">
  <p class="text-lg">(A + B)(C + D) = A×C + A×D + B×C + B×D</p>
</div>
<div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-xl my-4">
  <p class="font-bold text-purple-800">VD: (x + 3)(x - 2)</p>
  <div class="mt-2 space-y-1">
    <p>= x×x + x×(-2) + 3×x + 3×(-2)</p>
    <p>= x² - 2x + 3x - 6</p>
    <p>= <strong>x² + x - 6</strong></p>
  </div>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Thực hiện phép nhân:</p>
  <ol class="space-y-2">
    <li>1. 5x(x² - 3x + 2) = ?</li>
    <li>2. (2x - 1)(x + 4) = ?</li>
    <li>3. (x + 5)(x - 5) = ?</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> 5x³ - 15x² + 10x | 2x² + 7x - 4 | x² - 25</p>
</div>`,

  // 2. HẰNG ĐẲNG THỨC ĐÁNG NHỚ
  ds8_hang_dang_thuc: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Thuộc lòng <strong>7 hằng đẳng thức đáng nhớ</strong></li>
  <li>Vận dụng khai triển và thu gọn biểu thức</li>
</ul>

<h3>📖 Bảy hằng đẳng thức</h3>
<div class="space-y-3 my-4">
  <div class="bg-blue-50 rounded-xl p-4 text-center">
    <p class="text-xs font-bold text-blue-600 mb-1">HĐT 1: Bình phương của tổng</p>
    <p class="text-xl font-black text-blue-700">(A + B)² = A² + 2AB + B²</p>
  </div>
  <div class="bg-green-50 rounded-xl p-4 text-center">
    <p class="text-xs font-bold text-green-600 mb-1">HĐT 2: Bình phương của hiệu</p>
    <p class="text-xl font-black text-green-700">(A - B)² = A² - 2AB + B²</p>
  </div>
  <div class="bg-rose-50 rounded-xl p-4 text-center">
    <p class="text-xs font-bold text-rose-600 mb-1">HĐT 3: Hiệu hai bình phương</p>
    <p class="text-xl font-black text-rose-700">A² - B² = (A + B)(A - B)</p>
  </div>
  <div class="bg-purple-50 rounded-xl p-4 text-center">
    <p class="text-xs font-bold text-purple-600 mb-1">HĐT 4: Lập phương của tổng</p>
    <p class="text-xl font-black text-purple-700">(A + B)³ = A³ + 3A²B + 3AB² + B³</p>
  </div>
  <div class="bg-amber-50 rounded-xl p-4 text-center">
    <p class="text-xs font-bold text-amber-600 mb-1">HĐT 5: Lập phương của hiệu</p>
    <p class="text-xl font-black text-amber-700">(A - B)³ = A³ - 3A²B + 3AB² - B³</p>
  </div>
  <div class="bg-cyan-50 rounded-xl p-4 text-center">
    <p class="text-xs font-bold text-cyan-600 mb-1">HĐT 6: Tổng hai lập phương</p>
    <p class="text-xl font-black text-cyan-700">A³ + B³ = (A + B)(A² - AB + B²)</p>
  </div>
  <div class="bg-indigo-50 rounded-xl p-4 text-center">
    <p class="text-xs font-bold text-indigo-600 mb-1">HĐT 7: Hiệu hai lập phương</p>
    <p class="text-xl font-black text-indigo-700">A³ - B³ = (A - B)(A² + AB + B²)</p>
  </div>
</div>

<h3>📖 Ví dụ áp dụng</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4">
  <p class="font-bold text-green-800">VD1 (HĐT 1): Khai triển (2x + 3)²</p>
  <p class="mt-1">= (2x)² + 2×(2x)×3 + 3² = <strong>4x² + 12x + 9</strong></p>
</div>
<div class="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-xl my-4">
  <p class="font-bold text-rose-800">VD2 (HĐT 3): Tính nhanh 51² - 49²</p>
  <p class="mt-1">= (51+49)(51-49) = 100 × 2 = <strong>200</strong></p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Khai triển:</p>
  <ol class="space-y-2">
    <li>1. (x - 4)² = ?</li>
    <li>2. (3x + 1)(3x - 1) = ?</li>
    <li>3. Tính nhanh: 101² - 1 = ?</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> x²-8x+16 | 9x²-1 | (101-1)(101+1) = 100×102 = 10200</p>
</div>`,

  // 3. PHÂN TÍCH ĐA THỨC THÀNH NHÂN TỬ
  ds8_phan_tich: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Nắm 3 phương pháp phân tích đa thức thành nhân tử</li>
  <li>Kết hợp nhiều phương pháp</li>
</ul>

<h3>📖 Phương pháp 1: Đặt nhân tử chung</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4">
  <p class="text-center text-lg font-bold text-blue-700 mb-3">ab + ac = a(b + c)</p>
  <div class="bg-white rounded-lg p-3 text-sm">
    <p class="font-bold">VD: 6x³ - 9x²</p>
    <p>= 3x²(2x - 3)</p>
  </div>
</div>

<h3>📖 Phương pháp 2: Dùng hằng đẳng thức</h3>
<div class="bg-green-50 rounded-xl p-5 my-4">
  <div class="bg-white rounded-lg p-3 text-sm space-y-2">
    <p class="font-bold">VD1: x² - 16 = (x+4)(x-4)</p>
    <p class="font-bold">VD2: x² + 6x + 9 = (x+3)²</p>
    <p class="font-bold">VD3: 8x³ - 1 = (2x-1)(4x²+2x+1)</p>
  </div>
</div>

<h3>📖 Phương pháp 3: Nhóm hạng tử</h3>
<div class="bg-purple-50 rounded-xl p-5 my-4">
  <div class="bg-white rounded-lg p-3 text-sm">
    <p class="font-bold">VD: x² - 2x + xy - 2y</p>
    <p>= (x² - 2x) + (xy - 2y)</p>
    <p>= x(x - 2) + y(x - 2)</p>
    <p>= <strong>(x - 2)(x + y)</strong></p>
  </div>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Phân tích thành nhân tử:</p>
  <ol class="space-y-2">
    <li>1. 4x² - 25 = ?</li>
    <li>2. 2x³ + 6x² = ?</li>
    <li>3. x² - 4x + 4 = ?</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> (2x+5)(2x-5) | 2x²(x+3) | (x-2)²</p>
</div>`,

  // 4. PHÂN THỨC ĐẠI SỐ
  ds8_phan_thuc_new: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Định nghĩa phân thức đại số</li>
  <li>Tìm điều kiện xác định</li>
  <li>Rút gọn phân thức</li>
</ul>

<h3>📖 1. Phân thức đại số</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center">
  <p class="text-sm text-blue-600 mb-2">Phân thức đại số có dạng</p>
  <p class="text-3xl font-black text-blue-700"><span class="inline-flex flex-col items-center mx-2 align-middle"><span class="text-2xl">A</span><span class="border-t-2 border-blue-700 w-full"></span><span class="text-2xl">B</span></span></p>
  <p class="text-sm mt-2">Trong đó A, B là đa thức và <strong>B ≠ 0</strong></p>
</div>

<h3>📖 2. Điều kiện xác định (ĐKXĐ)</h3>
<div class="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-xl my-4">
  <p class="font-bold text-rose-800">Phân thức xác định khi mẫu ≠ 0</p>
  <div class="mt-2 space-y-2 text-sm">
    <p><span class="inline-flex flex-col items-center mx-1 align-middle"><span>x</span><span class="border-t border-slate-600 w-full"></span><span>x + 2</span></span> → ĐKXĐ: x ≠ -2</p>
    <p><span class="inline-flex flex-col items-center mx-1 align-middle"><span>3</span><span class="border-t border-slate-600 w-full"></span><span>x² - 4</span></span> → ĐKXĐ: x ≠ ±2</p>
  </div>
</div>

<h3>📖 3. Rút gọn phân thức</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4">
  <p class="font-bold text-green-800 mb-2">Quy tắc: Chia cả tử và mẫu cho nhân tử chung</p>
  <div class="text-sm space-y-2">
    <p><span class="inline-flex flex-col items-center mx-1 align-middle"><span>2x² + 4x</span><span class="border-t border-slate-600 w-full"></span><span>2x</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>2x(x + 2)</span><span class="border-t border-slate-600 w-full"></span><span>2x</span></span> = <strong>x + 2</strong></p>
    <p class="mt-2"><span class="inline-flex flex-col items-center mx-1 align-middle"><span>x² - 9</span><span class="border-t border-slate-600 w-full"></span><span>x + 3</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>(x-3)(x+3)</span><span class="border-t border-slate-600 w-full"></span><span>(x+3)</span></span> = <strong>x - 3</strong></p>
  </div>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Rút gọn phân thức:</p>
  <ol class="space-y-2">
    <li>1. <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x² - 4</span><span class="border-t border-slate-600 w-full"></span><span>x - 2</span></span> = ?</li>
    <li>2. <span class="inline-flex flex-col items-center mx-1 align-middle"><span>3x² - 6x</span><span class="border-t border-slate-600 w-full"></span><span>3x</span></span> = ?</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> x + 2 | x - 2</p>
</div>`,

  // 5. CỘNG TRỪ PHÂN THỨC
  ds8_cong_tru_pt: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Cộng trừ phân thức <strong>cùng mẫu</strong> và <strong>khác mẫu</strong></li>
  <li>Quy đồng mẫu thức</li>
</ul>

<h3>📖 1. Cùng mẫu</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center">
  <p class="text-xl font-black text-blue-700"><span class="inline-flex flex-col items-center mx-1 align-middle"><span>A</span><span class="border-t-2 border-blue-700 w-full"></span><span>B</span></span> + <span class="inline-flex flex-col items-center mx-1 align-middle"><span>C</span><span class="border-t-2 border-blue-700 w-full"></span><span>B</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>A + C</span><span class="border-t-2 border-blue-700 w-full"></span><span>B</span></span></p>
</div>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold">VD: <span class="inline-flex flex-col items-center mx-1 align-middle"><span>3x</span><span class="border-t border-slate-600 w-full"></span><span>x+1</span></span> + <span class="inline-flex flex-col items-center mx-1 align-middle"><span>2</span><span class="border-t border-slate-600 w-full"></span><span>x+1</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>3x + 2</span><span class="border-t border-slate-600 w-full"></span><span>x + 1</span></span></p>
</div>

<h3>📖 2. Khác mẫu — Quy đồng</h3>
<div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-purple-800 mb-2">Các bước:</p>
  <ol class="space-y-1 text-purple-700">
    <li>1. Phân tích mẫu thành nhân tử</li>
    <li>2. Tìm <strong>MTC</strong> (mẫu thức chung)</li>
    <li>3. Nhân tử và mẫu với nhân tử phụ</li>
    <li>4. Cộng/trừ các tử, giữ nguyên mẫu chung</li>
  </ol>
</div>

<div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-amber-800">VD: <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-slate-600 w-full"></span><span>x</span></span> + <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-slate-600 w-full"></span><span>x+1</span></span></p>
  <p class="mt-1">MTC = x(x+1)</p>
  <p>= <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x + 1</span><span class="border-t border-slate-600 w-full"></span><span>x(x+1)</span></span> + <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x</span><span class="border-t border-slate-600 w-full"></span><span>x(x+1)</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span><strong>2x + 1</strong></span><span class="border-t border-slate-600 w-full"></span><span><strong>x(x+1)</strong></span></span></p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Tính:</p>
  <ol class="space-y-2">
    <li>1. <span class="inline-flex flex-col items-center mx-1 align-middle"><span>2</span><span class="border-t border-slate-600 w-full"></span><span>x</span></span> - <span class="inline-flex flex-col items-center mx-1 align-middle"><span>1</span><span class="border-t border-slate-600 w-full"></span><span>x+2</span></span> = ?</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x + 4</span><span class="border-t border-slate-600 w-full"></span><span>x(x+2)</span></span></p>
</div>`,

  // 6. NHÂN CHIA PHÂN THỨC
  ds8_nhan_chia_pt: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Nhân hai phân thức đại số</li>
  <li>Chia hai phân thức đại số</li>
</ul>

<h3>📖 1. Nhân phân thức</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-center">
  <p class="text-xl font-black text-blue-700"><span class="inline-flex flex-col items-center mx-1 align-middle"><span>A</span><span class="border-t-2 border-blue-700 w-full"></span><span>B</span></span> × <span class="inline-flex flex-col items-center mx-1 align-middle"><span>C</span><span class="border-t-2 border-blue-700 w-full"></span><span>D</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>A × C</span><span class="border-t-2 border-blue-700 w-full"></span><span>B × D</span></span></p>
</div>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold">VD: <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x+1</span><span class="border-t border-slate-600 w-full"></span><span>x</span></span> × <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x²</span><span class="border-t border-slate-600 w-full"></span><span>x²-1</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x²(x+1)</span><span class="border-t border-slate-600 w-full"></span><span>x(x+1)(x-1)</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span><strong>x</strong></span><span class="border-t border-slate-600 w-full"></span><span><strong>x-1</strong></span></span></p>
</div>

<h3>📖 2. Chia phân thức</h3>
<div class="bg-rose-50 rounded-xl p-5 my-4 text-center">
  <p class="text-sm text-rose-600 font-bold mb-2">Chia = nhân với nghịch đảo</p>
  <p class="text-xl font-black text-rose-700"><span class="inline-flex flex-col items-center mx-1 align-middle"><span>A</span><span class="border-t-2 border-rose-700 w-full"></span><span>B</span></span> ÷ <span class="inline-flex flex-col items-center mx-1 align-middle"><span>C</span><span class="border-t-2 border-rose-700 w-full"></span><span>D</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>A</span><span class="border-t-2 border-rose-700 w-full"></span><span>B</span></span> × <span class="inline-flex flex-col items-center mx-1 align-middle"><span>D</span><span class="border-t-2 border-rose-700 w-full"></span><span>C</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>A × D</span><span class="border-t-2 border-rose-700 w-full"></span><span>B × C</span></span></p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Tính:</p>
  <p><span class="inline-flex flex-col items-center mx-1 align-middle"><span>x²-4</span><span class="border-t border-slate-600 w-full"></span><span>x</span></span> ÷ <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x+2</span><span class="border-t border-slate-600 w-full"></span><span>3x</span></span> = ?</p>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> <span class="inline-flex flex-col items-center mx-1 align-middle"><span>(x-2) × 3x</span><span class="border-t border-slate-600 w-full"></span><span>x</span></span> = 3(x - 2) = 3x - 6</p>
</div>`,

  // 7. PHƯƠNG TRÌNH BẬC NHẤT MỘT ẨN
  ds8_pt_bac_nhat: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Định nghĩa phương trình bậc nhất một ẩn</li>
  <li>Giải phương trình bậc nhất</li>
  <li>Phương trình tích</li>
</ul>

<h3>📖 1. Dạng tổng quát</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 my-4 text-center">
  <div class="bg-white rounded-xl p-4 inline-block shadow-sm">
    <p class="text-3xl font-black text-blue-700">ax + b = 0</p>
  </div>
  <p class="text-sm mt-3">Trong đó: a ≠ 0. Nghiệm: x = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>-b</span><span class="border-t border-blue-700 w-full"></span><span>a</span></span></p>
</div>

<h3>📖 2. Các bước giải</h3>
<div class="bg-slate-100 rounded-xl p-5 my-4 text-sm space-y-2">
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">1</span><p>Chuyển ẩn sang 1 vế, hằng số sang vế kia (đổi dấu)</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">2</span><p>Thu gọn mỗi vế</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">3</span><p>Chia cả hai vế cho hệ số của ẩn</p></div>
</div>

<h3>📖 3. Ví dụ chi tiết</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-green-800">Giải: 3x - 7 = 2x + 5</p>
  <p class="mt-1">3x - 2x = 5 + 7</p>
  <p>x = 12</p>
  <p class="font-bold mt-1 text-green-700">Vậy x = 12</p>
</div>
<div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold text-purple-800">Giải: <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x - 1</span><span class="border-t border-slate-600 w-full"></span><span>2</span></span> = <span class="inline-flex flex-col items-center mx-1 align-middle"><span>x + 3</span><span class="border-t border-slate-600 w-full"></span><span>4</span></span></p>
  <p class="mt-1">Nhân chéo: 4(x - 1) = 2(x + 3)</p>
  <p>4x - 4 = 2x + 6</p>
  <p>2x = 10</p>
  <p class="font-bold text-purple-700">x = 5</p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Giải phương trình:</p>
  <ol class="space-y-2">
    <li>1. 5x + 3 = 2x - 9</li>
    <li>2. 4(x - 1) = 2(x + 3)</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> x = -4 | x = 5</p>
</div>`,

};
