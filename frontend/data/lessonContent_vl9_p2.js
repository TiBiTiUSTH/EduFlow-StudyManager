
export const VL9_P2 = {

  // 7. ĐỊNH LUẬT JUN - LEN-XƠ
  vl9_jun_lenxo: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Phát biểu định luật Jun – Len-xơ</li>
  <li>Vận dụng tính nhiệt lượng tỏa ra trên dây dẫn</li>
</ul>
<h3>📖 1. Nội dung định luật</h3>
<div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 my-4 text-center">
  <p class="text-sm text-blue-600 font-bold mb-3">Nhiệt lượng tỏa ra ở dây dẫn khi có dòng điện chạy qua</p>
  <div class="bg-white rounded-xl p-5 inline-block shadow-sm">
    <p class="text-3xl font-black text-blue-700">Q = I² × R × t</p>
  </div>
</div>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-slate-100 rounded-xl p-3"><strong>Q</strong>: Nhiệt lượng (J)</div>
  <div class="bg-slate-100 rounded-xl p-3"><strong>I</strong>: Cường độ dòng điện (A)</div>
  <div class="bg-slate-100 rounded-xl p-3"><strong>R</strong>: Điện trở (Ω)</div>
  <div class="bg-slate-100 rounded-xl p-3"><strong>t</strong>: Thời gian (s)</div>
</div>
<h3>📖 2. Ứng dụng thực tế</h3>
<div class="grid grid-cols-3 gap-3 my-4 text-center text-sm">
  <div class="bg-rose-50 rounded-xl p-4"><div class="text-3xl mb-2">🔥</div><p class="font-bold">Bàn là</p><p class="text-xs text-slate-500">Dây dẫn bên trong nóng lên</p></div>
  <div class="bg-rose-50 rounded-xl p-4"><div class="text-3xl mb-2">💡</div><p class="font-bold">Bóng đèn dây tóc</p><p class="text-xs text-slate-500">Dây tóc tungsten phát sáng</p></div>
  <div class="bg-rose-50 rounded-xl p-4"><div class="text-3xl mb-2">🍳</div><p class="font-bold">Bếp điện</p><p class="text-xs text-slate-500">Nhiệt nấu chín thức ăn</p></div>
</div>
<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-2">Bài 1:</p>
  <p>Dòng điện I = 2A chạy qua dây dẫn R = 25Ω trong 10 phút. Tính Q.</p>
  <div class="bg-white rounded-lg p-3 mt-3 text-sm">
    <p class="font-bold text-green-700">Giải:</p>
    <p>t = 10 × 60 = 600s</p>
    <p>Q = I²×R×t = 2²×25×600 = 4×25×600 = <strong>60.000J = 60kJ</strong></p>
  </div>
</div>`,

  // 8. SỬ DỤNG AN TOÀN ĐIỆN
  vl9_an_toan_dien: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Nêu được các quy tắc an toàn điện trong gia đình</li>
  <li>Biết cách xử lý khi có sự cố điện</li>
</ul>
<h3>📖 1. Tại sao phải an toàn điện?</h3>
<div class="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-r-xl my-4">
  <p class="font-bold text-rose-800 text-lg">⚠️ Mức hiệu điện thế nguy hiểm: trên 40V</p>
  <p class="mt-1 text-sm">Điện lưới gia đình = 220V → <strong>rất nguy hiểm</strong> nếu chạm trực tiếp!</p>
</div>
<h3>📖 2. Các quy tắc an toàn</h3>
<div class="grid grid-cols-2 gap-4 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800 mb-2">✅ Nên làm</p>
    <ul class="space-y-2 text-green-700">
      <li>• Sử dụng dây có vỏ cách điện tốt</li>
      <li>• Lắp cầu dao, aptomat bảo vệ</li>
      <li>• Rút phích trước khi sửa thiết bị</li>
      <li>• Dùng dụng cụ cách điện</li>
      <li>• Để ổ điện xa tầm tay trẻ em</li>
    </ul>
  </div>
  <div class="bg-rose-50 rounded-xl p-4">
    <p class="font-bold text-rose-800 mb-2">❌ Không được</p>
    <ul class="space-y-2 text-rose-700">
      <li>• Chạm tay ướt vào ổ điện</li>
      <li>• Đấu nối dây tùy tiện</li>
      <li>• Dùng dây điện trần</li>
      <li>• Sấy tóc gần nước</li>
      <li>• Để quá nhiều thiết bị trên 1 ổ</li>
    </ul>
  </div>
</div>
<h3>📖 3. Xử lý khi có người bị điện giật</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm space-y-3">
  <div class="flex items-start"><span class="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span><p><strong>Ngắt nguồn điện ngay</strong> (cầu dao, phích cắm)</p></div>
  <div class="flex items-start"><span class="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span><p>Nếu không ngắt được, dùng <strong>vật cách điện</strong> (gậy gỗ khô) tách nạn nhân</p></div>
  <div class="flex items-start"><span class="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span><p>Gọi cấp cứu <strong>115</strong>, sơ cứu hô hấp nhân tạo nếu cần</p></div>
</div>`,

  // 9. HIỆN TƯỢNG KHÚC XẠ ÁNH SÁNG
  vl9_khuc_xa: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Mô tả hiện tượng <strong>khúc xạ ánh sáng</strong></li>
  <li>Phân biệt khúc xạ và phản xạ</li>
  <li>Giải thích các hiện tượng thực tế</li>
</ul>
<h3>📖 1. Khúc xạ ánh sáng là gì?</h3>
<p>Khi tia sáng truyền từ môi trường trong suốt này sang môi trường trong suốt khác, nó bị <strong>gãy khúc tại mặt phân cách</strong>. Hiện tượng đó gọi là khúc xạ.</p>
<div class="grid grid-cols-2 gap-4 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-4">
    <p class="font-bold text-blue-800 mb-2">Từ Không khí → Nước</p>
    <p>Tia khúc xạ <strong>lệch gần pháp tuyến</strong> hơn</p>
    <p class="mt-1 text-xs text-blue-600">Góc khúc xạ < Góc tới</p>
  </div>
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800 mb-2">Từ Nước → Không khí</p>
    <p>Tia khúc xạ <strong>lệch xa pháp tuyến</strong> hơn</p>
    <p class="mt-1 text-xs text-green-600">Góc khúc xạ > Góc tới</p>
  </div>
</div>
<h3>📖 2. Ứng dụng thực tế</h3>
<div class="space-y-2 my-4 text-sm">
  <div class="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-xl">🏊 Nhìn xuống hồ bơi, đáy hồ có vẻ <strong>nông hơn</strong> thực tế</div>
  <div class="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-xl">🥄 Cái thìa cắm vào cốc nước trông bị <strong>gãy gập</strong></div>
  <div class="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-xl">🌅 Mặt trời chưa mọc nhưng ta đã thấy <strong>ánh sáng</strong></div>
</div>`,

  // 10. THẤU KÍNH HỘI TỤ
  vl9_thau_kinh_ht: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Nhận biết thấu kính hội tụ và các đặc điểm</li>
  <li>Vẽ đường truyền tia sáng qua thấu kính hội tụ</li>
  <li>Xác định ảnh qua thấu kính</li>
</ul>
<h3>📖 1. Đặc điểm thấu kính hội tụ</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm">
  <ul class="space-y-2">
    <li>🔎 Phần <strong>rìa mỏng</strong>, phần <strong>giữa dày</strong></li>
    <li>🔎 Chùm sáng song song qua thấu kính sẽ <strong>hội tụ tại một điểm</strong> (tiêu điểm F)</li>
    <li>🔎 Khoảng cách từ quang tâm O đến tiêu điểm F gọi là <strong>tiêu cự f</strong></li>
  </ul>
</div>
<h3>📖 2. Ba tia sáng đặc biệt</h3>
<div class="space-y-3 my-4 text-sm">
  <div class="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-xl"><strong>Tia 1:</strong> Song song trục chính → qua tiêu điểm F'</div>
  <div class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-xl"><strong>Tia 2:</strong> Qua quang tâm O → truyền thẳng</div>
  <div class="bg-purple-50 border-l-4 border-purple-400 p-3 rounded-r-xl"><strong>Tia 3:</strong> Qua tiêu điểm F → song song trục chính</div>
</div>
<h3>📖 3. Tính chất ảnh</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Vị trí vật</th><th class="border p-2">Tính chất ảnh</th></tr></thead>
    <tbody>
      <tr><td class="border p-2">d > 2f</td><td class="border p-2">Ảnh thật, nhỏ hơn vật, ngược chiều</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">d = 2f</td><td class="border p-2">Ảnh thật, bằng vật, ngược chiều</td></tr>
      <tr><td class="border p-2">f < d < 2f</td><td class="border p-2">Ảnh thật, lớn hơn vật, ngược chiều</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">d < f</td><td class="border p-2">Ảnh ảo, lớn hơn vật, cùng chiều</td></tr>
    </tbody>
  </table>
</div>`,

  // 11. THẤU KÍNH PHÂN KỲ
  vl9_thau_kinh_pk: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Nhận biết thấu kính phân kỳ</li>
  <li>Phân biệt với thấu kính hội tụ</li>
  <li>Tìm ảnh qua thấu kính phân kỳ</li>
</ul>
<h3>📖 1. Đặc điểm</h3>
<div class="bg-rose-50 rounded-xl p-5 my-4 text-sm">
  <ul class="space-y-2">
    <li>🔍 Phần <strong>rìa dày</strong>, phần <strong>giữa mỏng</strong> (ngược với hội tụ)</li>
    <li>🔍 Chùm sáng song song qua thấu kính sẽ <strong>loe rộng ra</strong></li>
  </ul>
</div>
<h3>📖 2. So sánh hai loại thấu kính</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-purple-100"><th class="border p-2">Đặc điểm</th><th class="border p-2">Hội tụ</th><th class="border p-2">Phân kỳ</th></tr></thead>
    <tbody>
      <tr><td class="border p-2 font-bold">Hình dạng</td><td class="border p-2">Giữa dày, rìa mỏng</td><td class="border p-2">Giữa mỏng, rìa dày</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-bold">Tia sáng</td><td class="border p-2">Hội tụ lại</td><td class="border p-2">Phân kỳ ra</td></tr>
      <tr><td class="border p-2 font-bold">Ảnh</td><td class="border p-2">Ảnh thật hoặc ảo</td><td class="border p-2">Luôn ảnh ảo, nhỏ hơn vật</td></tr>
      <tr class="bg-slate-50"><td class="border p-2 font-bold">Ứng dụng</td><td class="border p-2">Kính lúp, máy ảnh</td><td class="border p-2">Kính cận thị</td></tr>
    </tbody>
  </table>
</div>
<h3>📖 3. Tính chất ảnh qua TKPK</h3>
<div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl my-4">
  <p>Vật đặt ở bất kỳ vị trí nào trước TKPK đều cho <strong>ảnh ảo, cùng chiều, nhỏ hơn vật</strong>, nằm trong khoảng tiêu cự.</p>
</div>`,

  // 12. MẮT VÀ CÁC TẬT CỦA MẮT
  vl9_mat: `
<h3>🎯 Mục tiêu bài học</h3>
<ul>
  <li>Hiểu cấu tạo và hoạt động của mắt</li>
  <li>Phân biệt <strong>cận thị</strong> và <strong>viễn thị</strong></li>
  <li>Biết cách khắc phục bằng kính</li>
</ul>
<h3>📖 1. Cấu tạo của mắt</h3>
<p>Mắt hoạt động như một <strong>máy ảnh</strong>:</p>
<div class="grid grid-cols-2 gap-4 my-4 text-sm">
  <div class="bg-blue-50 rounded-xl p-4">
    <p class="font-bold text-blue-800 mb-2">🔵 Thể thủy tinh</p>
    <p>Đóng vai trò như <strong>thấu kính hội tụ</strong>, có thể thay đổi tiêu cự (điều tiết).</p>
  </div>
  <div class="bg-green-50 rounded-xl p-4">
    <p class="font-bold text-green-800 mb-2">🟢 Màng lưới (Võng mạc)</p>
    <p>Nơi <strong>ảnh hiện lên</strong>, giống như phim trong máy ảnh.</p>
  </div>
</div>
<div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl my-4 text-sm">
  <p class="font-bold">📌 Điểm cực cận (Cc):</p>
  <p>Điểm gần nhất mắt nhìn rõ. Mắt bình thường: <strong>~25cm</strong></p>
  <p class="font-bold mt-2">📌 Điểm cực viễn (Cv):</p>
  <p>Điểm xa nhất mắt nhìn rõ. Mắt bình thường: <strong>vô cực (∞)</strong></p>
</div>
<h3>📖 2. Các tật của mắt</h3>
<div class="grid grid-cols-2 gap-4 my-4 text-sm">
  <div class="bg-rose-50 rounded-xl p-5">
    <p class="font-bold text-rose-800 text-lg mb-2">👓 Mắt cận thị</p>
    <ul class="space-y-1 text-rose-700">
      <li>• Nhìn gần rõ, nhìn xa mờ</li>
      <li>• Ảnh rơi <strong>trước</strong> võng mạc</li>
      <li>• Cv ở gần hơn bình thường</li>
    </ul>
    <p class="mt-3 bg-white p-2 rounded font-bold text-center">Khắc phục: Đeo <span class="text-rose-600">kính phân kỳ</span></p>
  </div>
  <div class="bg-blue-50 rounded-xl p-5">
    <p class="font-bold text-blue-800 text-lg mb-2">👓 Mắt viễn thị</p>
    <ul class="space-y-1 text-blue-700">
      <li>• Nhìn xa rõ, nhìn gần mờ</li>
      <li>• Ảnh rơi <strong>sau</strong> võng mạc</li>
      <li>• Cc xa hơn bình thường</li>
    </ul>
    <p class="mt-3 bg-white p-2 rounded font-bold text-center">Khắc phục: Đeo <span class="text-blue-600">kính hội tụ</span></p>
  </div>
</div>
<h3>✏️ Bài tập</h3>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
  <p class="font-bold text-amber-800 mb-3">Trả lời câu hỏi:</p>
  <ol class="space-y-2 text-sm">
    <li>1. Bạn A nhìn xa mờ, nhìn gần rõ. Bạn A bị tật gì? Cần đeo loại kính nào?</li>
    <li>2. Thể thủy tinh trong mắt đóng vai trò gì?</li>
  </ol>
  <p class="mt-3 text-sm text-amber-700"><strong>Đáp án:</strong> 1. Cận thị, kính phân kỳ — 2. Thấu kính hội tụ</p>
</div>`,

};
