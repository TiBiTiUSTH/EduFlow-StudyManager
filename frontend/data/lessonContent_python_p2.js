export const PY_P2 = {

  // 9. TUPLE VÀ SET
  py_tuple_set: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Tuple (bộ) và Set (tập hợp)</li><li>Phân biệt List, Tuple, Set</li></ul>

<h3>📖 1. Tuple — không thay đổi được</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p>colors = (<span class="text-amber-300">"red"</span>, <span class="text-amber-300">"green"</span>, <span class="text-amber-300">"blue"</span>)</p>
  <p><span class="text-blue-300">print</span>(colors[<span class="text-purple-400">0</span>]) <span class="text-slate-500"># red</span></p>
  <p><span class="text-slate-500"># colors[0] = "yellow"  → LỖI!</span></p>
</div>

<h3>📖 2. Set — không trùng lặp</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p>nums = {<span class="text-purple-400">1</span>, <span class="text-purple-400">2</span>, <span class="text-purple-400">2</span>, <span class="text-purple-400">3</span>, <span class="text-purple-400">3</span>}</p>
  <p><span class="text-blue-300">print</span>(nums) <span class="text-slate-500"># {1, 2, 3}</span></p>
  <p>nums.add(<span class="text-purple-400">4</span>)</p>
  <p>nums.discard(<span class="text-purple-400">2</span>)</p>
</div>

<h3>📖 3. So sánh</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Đặc điểm</th><th class="border p-2">List</th><th class="border p-2">Tuple</th><th class="border p-2">Set</th></tr></thead>
    <tbody>
      <tr><td class="border p-2">Ký hiệu</td><td class="border p-2">[ ]</td><td class="border p-2">( )</td><td class="border p-2">{ }</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">Thay đổi</td><td class="border p-2">✅ Có</td><td class="border p-2">❌ Không</td><td class="border p-2">✅ Có</td></tr>
      <tr><td class="border p-2">Thứ tự</td><td class="border p-2">✅ Có</td><td class="border p-2">✅ Có</td><td class="border p-2">❌ Không</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">Trùng lặp</td><td class="border p-2">✅ Cho</td><td class="border p-2">✅ Cho</td><td class="border p-2">❌ Không</td></tr>
    </tbody>
  </table>
</div>`,

  // 10. ĐỌC/GHI FILE
  py_file: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Đọc và ghi file văn bản</li><li>Sử dụng with statement</li></ul>

<h3>📖 1. Ghi file</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-rose-400">with</span> <span class="text-blue-300">open</span>(<span class="text-amber-300">"data.txt"</span>, <span class="text-amber-300">"w"</span>) <span class="text-rose-400">as</span> f:</p>
  <p>&nbsp;&nbsp;f.write(<span class="text-amber-300">"Dòng 1\\n"</span>)</p>
  <p>&nbsp;&nbsp;f.write(<span class="text-amber-300">"Dòng 2\\n"</span>)</p>
</div>

<h3>📖 2. Đọc file</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-rose-400">with</span> <span class="text-blue-300">open</span>(<span class="text-amber-300">"data.txt"</span>, <span class="text-amber-300">"r"</span>) <span class="text-rose-400">as</span> f:</p>
  <p>&nbsp;&nbsp;content = f.read()  <span class="text-slate-500"># Đọc toàn bộ</span></p>
  <p>&nbsp;&nbsp;<span class="text-slate-500"># hoặc: lines = f.readlines()</span></p>
</div>

<h3>📖 3. Các mode mở file</h3>
<div class="grid grid-cols-3 gap-3 my-4 text-sm text-center">
  <div class="bg-blue-50 rounded-xl p-3"><p class="font-bold">"r"</p><p>Đọc (mặc định)</p></div>
  <div class="bg-green-50 rounded-xl p-3"><p class="font-bold">"w"</p><p>Ghi (ghi đè)</p></div>
  <div class="bg-amber-50 rounded-xl p-3"><p class="font-bold">"a"</p><p>Ghi thêm (append)</p></div>
</div>`,

  // 11. XỬ LÝ NGOẠI LỆ
  py_exception: `
<h3>🎯 Mục tiêu</h3>
<ul><li>try/except/finally</li><li>Xử lý lỗi chuyên nghiệp</li></ul>

<h3>📖 Cú pháp</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-rose-400">try</span>:</p>
  <p>&nbsp;&nbsp;x = <span class="text-blue-300">int</span>(<span class="text-blue-300">input</span>(<span class="text-amber-300">"Nhập số: "</span>))</p>
  <p>&nbsp;&nbsp;result = <span class="text-purple-400">10</span> / x</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(result)</p>
  <p><span class="text-rose-400">except</span> ValueError:</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(<span class="text-amber-300">"Không phải số!"</span>)</p>
  <p><span class="text-rose-400">except</span> ZeroDivisionError:</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(<span class="text-amber-300">"Không chia cho 0!"</span>)</p>
  <p><span class="text-rose-400">finally</span>:</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(<span class="text-amber-300">"Hoàn tất."</span>)</p>
</div>

<h3>📖 Các lỗi phổ biến</h3>
<div class="space-y-2 my-4 text-sm">
  <div class="bg-rose-50 rounded-xl p-3">🔴 <strong>ValueError:</strong> Sai kiểu giá trị (int("abc"))</div>
  <div class="bg-rose-50 rounded-xl p-3">🔴 <strong>ZeroDivisionError:</strong> Chia cho 0</div>
  <div class="bg-rose-50 rounded-xl p-3">🔴 <strong>IndexError:</strong> Truy cập index ngoài phạm vi</div>
  <div class="bg-rose-50 rounded-xl p-3">🔴 <strong>KeyError:</strong> Key không tồn tại trong dict</div>
</div>`,

  // 12. LẬP TRÌNH HƯỚNG ĐỐI TƯỢNG
  py_oop: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Class và Object</li><li>__init__, self, phương thức</li></ul>

<h3>📖 1. Tạo class</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-rose-400">class</span> <span class="text-blue-300">Student</span>:</p>
  <p>&nbsp;&nbsp;<span class="text-rose-400">def</span> <span class="text-blue-300">__init__</span>(self, name, age):</p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;self.name = name</p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;self.age = age</p>
  <p><br/>&nbsp;&nbsp;<span class="text-rose-400">def</span> <span class="text-blue-300">greet</span>(self):</p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-rose-400">return</span> f<span class="text-amber-300">"Hi, I'm {self.name}"</span></p>
  <p><br/><span class="text-slate-500"># Tạo object</span></p>
  <p>s = <span class="text-blue-300">Student</span>(<span class="text-amber-300">"EduFlow"</span>, <span class="text-purple-400">20</span>)</p>
  <p><span class="text-blue-300">print</span>(s.greet()) <span class="text-slate-500"># Hi, I'm EduFlow</span></p>
</div>

<h3>📖 2. Giải thích</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-4"><p class="font-bold">__init__</p><p>Hàm khởi tạo, chạy tự động khi tạo object</p></div>
  <div class="bg-green-50 rounded-xl p-4"><p class="font-bold">self</p><p>Tham chiếu đến chính object đang gọi</p></div>
</div>`,

  // 13. KẾ THỪA (INHERITANCE)
  py_inheritance: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Kế thừa class</li><li>Method overriding</li></ul>

<h3>📖 Ví dụ</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-rose-400">class</span> <span class="text-blue-300">Animal</span>:</p>
  <p>&nbsp;&nbsp;<span class="text-rose-400">def</span> <span class="text-blue-300">__init__</span>(self, name):</p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;self.name = name</p>
  <p>&nbsp;&nbsp;<span class="text-rose-400">def</span> <span class="text-blue-300">speak</span>(self):</p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-rose-400">return</span> <span class="text-amber-300">"..."</span></p>
  <p><br/><span class="text-rose-400">class</span> <span class="text-blue-300">Dog</span>(Animal):  <span class="text-slate-500"># Kế thừa Animal</span></p>
  <p>&nbsp;&nbsp;<span class="text-rose-400">def</span> <span class="text-blue-300">speak</span>(self):  <span class="text-slate-500"># Override</span></p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-rose-400">return</span> f<span class="text-amber-300">"{self.name}: Gâu gâu!"</span></p>
  <p><br/><span class="text-rose-400">class</span> <span class="text-blue-300">Cat</span>(Animal):</p>
  <p>&nbsp;&nbsp;<span class="text-rose-400">def</span> <span class="text-blue-300">speak</span>(self):</p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-rose-400">return</span> f<span class="text-amber-300">"{self.name}: Meo meo!"</span></p>
  <p><br/>dog = <span class="text-blue-300">Dog</span>(<span class="text-amber-300">"Buddy"</span>)</p>
  <p><span class="text-blue-300">print</span>(dog.speak()) <span class="text-slate-500"># Buddy: Gâu gâu!</span></p>
</div>`,

  // 14. MODULE VÀ PACKAGE
  py_module: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Import module</li><li>Tạo module riêng, pip install</li></ul>

<h3>📖 1. Import</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-rose-400">import</span> math</p>
  <p><span class="text-blue-300">print</span>(math.sqrt(<span class="text-purple-400">16</span>)) <span class="text-slate-500"># 4.0</span></p>
  <p><br/><span class="text-rose-400">from</span> random <span class="text-rose-400">import</span> randint</p>
  <p><span class="text-blue-300">print</span>(randint(<span class="text-purple-400">1</span>, <span class="text-purple-400">100</span>)) <span class="text-slate-500"># Số ngẫu nhiên</span></p>
</div>

<h3>📖 2. Các module phổ biến</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-3"><strong>math</strong> — Hàm toán học</div>
  <div class="bg-green-50 rounded-xl p-3"><strong>random</strong> — Số ngẫu nhiên</div>
  <div class="bg-purple-50 rounded-xl p-3"><strong>os</strong> — Tương tác hệ điều hành</div>
  <div class="bg-amber-50 rounded-xl p-3"><strong>json</strong> — Đọc/ghi JSON</div>
  <div class="bg-rose-50 rounded-xl p-3"><strong>datetime</strong> — Ngày giờ</div>
  <div class="bg-cyan-50 rounded-xl p-3"><strong>requests</strong> — HTTP (pip install)</div>
</div>`,

  // 15. TỔNG HỢP — DỰ ÁN MINI
  py_project: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng tất cả kiến thức vào bài tập tổng hợp</li></ul>

<h3>📖 1. Bài tập: Quản lý danh bạ</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p>contacts = []</p>
  <p><br/><span class="text-rose-400">def</span> <span class="text-blue-300">add</span>(name, phone):</p>
  <p>&nbsp;&nbsp;contacts.append({<span class="text-amber-300">"name"</span>: name, <span class="text-amber-300">"phone"</span>: phone})</p>
  <p><br/><span class="text-rose-400">def</span> <span class="text-blue-300">search</span>(keyword):</p>
  <p>&nbsp;&nbsp;<span class="text-rose-400">return</span> [c <span class="text-rose-400">for</span> c <span class="text-rose-400">in</span> contacts <span class="text-rose-400">if</span> keyword.lower() <span class="text-rose-400">in</span> c[<span class="text-amber-300">"name"</span>].lower()]</p>
  <p><br/><span class="text-rose-400">def</span> <span class="text-blue-300">display</span>():</p>
  <p>&nbsp;&nbsp;<span class="text-rose-400">for</span> i, c <span class="text-rose-400">in</span> <span class="text-blue-300">enumerate</span>(contacts, <span class="text-purple-400">1</span>):</p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-blue-300">print</span>(f<span class="text-amber-300">"{i}. {c['name']} - {c['phone']}"</span>)</p>
</div>

<h3>📖 2. Checklist kiến thức</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-3">✅ Biến & Kiểu dữ liệu</div>
  <div class="bg-green-50 rounded-xl p-3">✅ Toán tử & Biểu thức</div>
  <div class="bg-green-50 rounded-xl p-3">✅ if/elif/else</div>
  <div class="bg-green-50 rounded-xl p-3">✅ for, while</div>
  <div class="bg-green-50 rounded-xl p-3">✅ Hàm & return</div>
  <div class="bg-green-50 rounded-xl p-3">✅ List, Dict, Tuple, Set</div>
  <div class="bg-green-50 rounded-xl p-3">✅ File I/O</div>
  <div class="bg-green-50 rounded-xl p-3">✅ OOP & Kế thừa</div>
</div>`,

};
