export const PY_P1 = {

  // 1. BIẾN VÀ KIỂU DỮ LIỆU
  py_bien: `
<h3>🎯 Mục tiêu bài học</h3>
<ul><li>Khai báo biến, quy tắc đặt tên</li><li>Các kiểu dữ liệu cơ bản</li></ul>

<h3>📖 1. Biến là gì?</h3>
<div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl my-4">
  <p>Biến là <strong>tên gọi</strong> tham chiếu đến một giá trị trong bộ nhớ. Python không cần khai báo kiểu — tự suy luận.</p>
</div>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p>name = <span class="text-amber-300">"EduFlow"</span></p>
  <p>age = <span class="text-purple-400">20</span></p>
  <p>gpa = <span class="text-purple-400">3.65</span></p>
  <p>is_student = <span class="text-purple-400">True</span></p>
</div>

<h3>📖 2. Các kiểu dữ liệu</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Kiểu</th><th class="border p-2">Ví dụ</th><th class="border p-2">Mô tả</th></tr></thead>
    <tbody>
      <tr><td class="border p-2 font-mono">int</td><td class="border p-2">42</td><td class="border p-2">Số nguyên</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-mono">float</td><td class="border p-2">3.14</td><td class="border p-2">Số thực</td></tr>
      <tr><td class="border p-2 font-mono">str</td><td class="border p-2">"hello"</td><td class="border p-2">Chuỗi ký tự</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-mono">bool</td><td class="border p-2">True/False</td><td class="border p-2">Logic</td></tr>
    </tbody>
  </table>
</div>

<h3>📖 3. Ép kiểu</h3>
<div class="bg-green-50 rounded-xl p-4 my-4 text-sm">
  <p><strong>int("42")</strong> → 42 &nbsp;&nbsp;|&nbsp;&nbsp; <strong>str(3.14)</strong> → "3.14" &nbsp;&nbsp;|&nbsp;&nbsp; <strong>float("2.5")</strong> → 2.5</p>
</div>

<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4 text-sm">
  <p>Tạo biến lưu họ tên, tuổi, điểm TB. In ra: "Tôi là EduFlow, 20 tuổi, GPA: 3.65"</p>
</div>`,

  // 2. TOÁN TỬ VÀ BIỂU THỨC
  py_toan_tu: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Toán tử số học, so sánh, logic</li><li>Thứ tự ưu tiên</li></ul>

<h3>📖 1. Toán tử số học</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Toán tử</th><th class="border p-2">Ý nghĩa</th><th class="border p-2">Ví dụ</th></tr></thead>
    <tbody>
      <tr><td class="border p-2 text-center font-mono">+</td><td class="border p-2">Cộng</td><td class="border p-2">7 + 3 = 10</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center font-mono">-</td><td class="border p-2">Trừ</td><td class="border p-2">7 - 3 = 4</td></tr>
      <tr><td class="border p-2 text-center font-mono">*</td><td class="border p-2">Nhân</td><td class="border p-2">7 * 3 = 21</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center font-mono">/</td><td class="border p-2">Chia</td><td class="border p-2">7 / 3 = 2.33</td></tr>
      <tr><td class="border p-2 text-center font-mono">//</td><td class="border p-2">Chia lấy phần nguyên</td><td class="border p-2">7 // 3 = 2</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 text-center font-mono">%</td><td class="border p-2">Chia lấy dư</td><td class="border p-2">7 % 3 = 1</td></tr>
      <tr><td class="border p-2 text-center font-mono">**</td><td class="border p-2">Lũy thừa</td><td class="border p-2">2 ** 3 = 8</td></tr>
    </tbody>
  </table>
</div>

<h3>📖 2. Toán tử so sánh & logic</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800 mb-2">So sánh</p>
    <p>==, !=, >, <, >=, <=</p>
    <p class="text-xs text-slate-500 mt-1">Trả về True/False</p>
  </div>
  <div class="bg-purple-50 rounded-xl p-4">
    <p class="font-bold text-purple-800 mb-2">Logic</p>
    <p>and, or, not</p>
    <p class="text-xs text-slate-500 mt-1">Kết hợp điều kiện</p>
  </div>
</div>`,

  // 3. CÂU LỆNH ĐIỀU KIỆN
  py_if: `
<h3>🎯 Mục tiêu</h3>
<ul><li>if, elif, else</li><li>Lồng điều kiện</li></ul>

<h3>📖 Cấu trúc</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p>score = <span class="text-purple-400">85</span></p>
  <p><br/><span class="text-rose-400">if</span> score >= <span class="text-purple-400">90</span>:</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(<span class="text-amber-300">"Xuất sắc"</span>)</p>
  <p><span class="text-rose-400">elif</span> score >= <span class="text-purple-400">70</span>:</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(<span class="text-amber-300">"Khá"</span>)</p>
  <p><span class="text-rose-400">elif</span> score >= <span class="text-purple-400">50</span>:</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(<span class="text-amber-300">"Trung bình"</span>)</p>
  <p><span class="text-rose-400">else</span>:</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(<span class="text-amber-300">"Yếu"</span>)</p>
</div>
<div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl my-4 text-sm">
  <p>⚠️ <strong>Lưu ý:</strong> Python dùng <strong>thụt lề (indentation)</strong> thay vì dấu ngoặc nhọn.</p>
</div>`,

  // 4. VÒNG LẶP
  py_loop: `
<h3>🎯 Mục tiêu</h3>
<ul><li>for và while</li><li>break, continue</li></ul>

<h3>📖 1. Vòng lặp for</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-slate-500"># In 0 đến 4</span></p>
  <p><span class="text-rose-400">for</span> i <span class="text-rose-400">in</span> <span class="text-blue-300">range</span>(<span class="text-purple-400">5</span>):</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(i)</p>
  <p><br/><span class="text-slate-500"># Duyệt list</span></p>
  <p>fruits = [<span class="text-amber-300">"Táo"</span>, <span class="text-amber-300">"Cam"</span>, <span class="text-amber-300">"Xoài"</span>]</p>
  <p><span class="text-rose-400">for</span> f <span class="text-rose-400">in</span> fruits:</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(f)</p>
</div>

<h3>📖 2. Vòng lặp while</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p>n = <span class="text-purple-400">1</span></p>
  <p><span class="text-rose-400">while</span> n <= <span class="text-purple-400">5</span>:</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(n)</p>
  <p>&nbsp;&nbsp;n += <span class="text-purple-400">1</span></p>
</div>

<h3>📖 3. break & continue</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-rose-50 rounded-xl p-4"><p class="font-bold text-rose-800">break</p><p>Dừng vòng lặp ngay lập tức</p></div>
  <div class="bg-blue-50 rounded-xl p-4"><p class="font-bold text-blue-800">continue</p><p>Bỏ qua lần lặp hiện tại, chuyển sang lần tiếp</p></div>
</div>`,

  // 5. HÀM
  py_ham: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa và gọi hàm</li><li>Tham số, giá trị trả về</li></ul>

<h3>📖 1. Cú pháp</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-rose-400">def</span> <span class="text-blue-300">chao</span>(ten):</p>
  <p>&nbsp;&nbsp;<span class="text-rose-400">return</span> f<span class="text-amber-300">"Xin chào, {ten}!"</span></p>
  <p><br/><span class="text-blue-300">print</span>(<span class="text-blue-300">chao</span>(<span class="text-amber-300">"EduFlow"</span>))  <span class="text-slate-500"># Xin chào, EduFlow!</span></p>
</div>

<h3>📖 2. Tham số mặc định</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-rose-400">def</span> <span class="text-blue-300">luy_thua</span>(x, n=<span class="text-purple-400">2</span>):</p>
  <p>&nbsp;&nbsp;<span class="text-rose-400">return</span> x ** n</p>
  <p><br/><span class="text-blue-300">print</span>(<span class="text-blue-300">luy_thua</span>(<span class="text-purple-400">3</span>))    <span class="text-slate-500"># 9 (n mặc định = 2)</span></p>
  <p><span class="text-blue-300">print</span>(<span class="text-blue-300">luy_thua</span>(<span class="text-purple-400">2</span>, <span class="text-purple-400">10</span>)) <span class="text-slate-500"># 1024</span></p>
</div>

<h3>📖 3. Nhiều giá trị trả về</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-rose-400">def</span> <span class="text-blue-300">chia</span>(a, b):</p>
  <p>&nbsp;&nbsp;<span class="text-rose-400">return</span> a // b, a % b</p>
  <p><br/>thuong, du = <span class="text-blue-300">chia</span>(<span class="text-purple-400">17</span>, <span class="text-purple-400">5</span>)</p>
  <p><span class="text-blue-300">print</span>(thuong, du) <span class="text-slate-500"># 3 2</span></p>
</div>`,

  // 6. CHUỖI (STRING)
  py_string: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Thao tác với chuỗi</li><li>f-string, slicing</li></ul>

<h3>📖 1. Các phương thức chuỗi</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Hàm</th><th class="border p-2">Kết quả</th></tr></thead>
    <tbody>
      <tr><td class="border p-2 font-mono">"hello".upper()</td><td class="border p-2">"HELLO"</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-mono">"HELLO".lower()</td><td class="border p-2">"hello"</td></tr>
      <tr><td class="border p-2 font-mono">"hello world".title()</td><td class="border p-2">"Hello World"</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-mono">"  hi  ".strip()</td><td class="border p-2">"hi"</td></tr>
      <tr><td class="border p-2 font-mono">"a,b,c".split(",")</td><td class="border p-2">["a", "b", "c"]</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-mono">"-".join(["a","b"])</td><td class="border p-2">"a-b"</td></tr>
    </tbody>
  </table>
</div>

<h3>📖 2. f-string (Python 3.6+)</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p>name = <span class="text-amber-300">"EduFlow"</span></p>
  <p>age = <span class="text-purple-400">20</span></p>
  <p><span class="text-blue-300">print</span>(f<span class="text-amber-300">"{name} năm nay {age} tuổi"</span>)</p>
</div>

<h3>📖 3. Slicing (cắt chuỗi)</h3>
<div class="bg-green-50 rounded-xl p-4 my-4 text-sm">
  <p>s = "Python" → s[0:3] = "Pyt" | s[-2:] = "on" | s[::2] = "Pto"</p>
</div>`,

  // 7. LIST (DANH SÁCH)
  py_list: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Tạo, truy cập, sửa đổi list</li><li>Các phương thức quan trọng</li></ul>

<h3>📖 1. Tạo list</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p>nums = [<span class="text-purple-400">1</span>, <span class="text-purple-400">2</span>, <span class="text-purple-400">3</span>, <span class="text-purple-400">4</span>, <span class="text-purple-400">5</span>]</p>
  <p>mixed = [<span class="text-purple-400">1</span>, <span class="text-amber-300">"hai"</span>, <span class="text-purple-400">3.0</span>, <span class="text-purple-400">True</span>]</p>
</div>

<h3>📖 2. Các phương thức</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Phương thức</th><th class="border p-2">Công dụng</th></tr></thead>
    <tbody>
      <tr><td class="border p-2 font-mono">.append(x)</td><td class="border p-2">Thêm x vào cuối</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-mono">.insert(i, x)</td><td class="border p-2">Chèn x tại vị trí i</td></tr>
      <tr><td class="border p-2 font-mono">.remove(x)</td><td class="border p-2">Xóa phần tử x đầu tiên</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-mono">.pop(i)</td><td class="border p-2">Xóa và trả về phần tử tại i</td></tr>
      <tr><td class="border p-2 font-mono">.sort()</td><td class="border p-2">Sắp xếp tăng dần</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-mono">len(list)</td><td class="border p-2">Số phần tử</td></tr>
    </tbody>
  </table>
</div>

<h3>📖 3. List comprehension</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p>binh_phuong = [x**<span class="text-purple-400">2</span> <span class="text-rose-400">for</span> x <span class="text-rose-400">in</span> <span class="text-blue-300">range</span>(<span class="text-purple-400">1</span>, <span class="text-purple-400">6</span>)]</p>
  <p><span class="text-slate-500"># [1, 4, 9, 16, 25]</span></p>
</div>`,

  // 8. DICTIONARY
  py_dict: `
<h3>🎯 Mục tiêu</h3>
<ul><li>Tạo, truy cập, duyệt dictionary</li></ul>

<h3>📖 1. Tạo dictionary</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p>student = {</p>
  <p>&nbsp;&nbsp;<span class="text-amber-300">"name"</span>: <span class="text-amber-300">"EduFlow"</span>,</p>
  <p>&nbsp;&nbsp;<span class="text-amber-300">"age"</span>: <span class="text-purple-400">20</span>,</p>
  <p>&nbsp;&nbsp;<span class="text-amber-300">"gpa"</span>: <span class="text-purple-400">3.65</span></p>
  <p>}</p>
</div>

<h3>📖 2. Thao tác</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-blue-300">print</span>(student[<span class="text-amber-300">"name"</span>]) <span class="text-slate-500"># EduFlow</span></p>
  <p>student[<span class="text-amber-300">"email"</span>] = <span class="text-amber-300">"eduflow@mail.com"</span> <span class="text-slate-500"># Thêm key</span></p>
  <p><span class="text-rose-400">del</span> student[<span class="text-amber-300">"age"</span>] <span class="text-slate-500"># Xóa key</span></p>
</div>

<h3>📖 3. Duyệt dictionary</h3>
<div class="bg-[#1e1e2e] rounded-xl p-5 my-4 text-sm text-sky-300">
  <p><span class="text-rose-400">for</span> key, value <span class="text-rose-400">in</span> student.items():</p>
  <p>&nbsp;&nbsp;<span class="text-blue-300">print</span>(f<span class="text-amber-300">"{key}: {value}"</span>)</p>
</div>`,

};
