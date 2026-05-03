
export const IELTS_FULL = {

  // 1. READING: SKIMMING & SCANNING
  ielts_skim_new: `
<h3>🎯 Objectives</h3>
<ul><li>Master Skimming (đọc lướt) and Scanning (tìm thông tin)</li></ul>
<h3>📖 1. Skimming</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm">
  <p class="font-bold text-blue-800 mb-2">Mục đích: Nắm ý chính trong 2-3 phút</p>
  <ul class="space-y-1 text-blue-700">
    <li>• Đọc tiêu đề, phụ đề, câu đầu mỗi đoạn</li>
    <li>• Chú ý từ in đậm, in nghiêng, số liệu</li>
    <li>• Bỏ qua chi tiết, ví dụ nhỏ</li>
  </ul>
</div>
<h3>📖 2. Scanning</h3>
<div class="bg-green-50 rounded-xl p-5 my-4 text-sm">
  <p class="font-bold text-green-800 mb-2">Mục đích: Tìm thông tin cụ thể</p>
  <ul class="space-y-1 text-green-700">
    <li>• Xác định keywords trong câu hỏi</li>
    <li>• Lướt mắt tìm keyword hoặc paraphrase trong bài</li>
    <li>• Đọc kỹ câu chứa keyword để trả lời</li>
  </ul>
</div>`,

  // 2. READING: TRUE/FALSE/NOT GIVEN
  ielts_tfng_new: `
<h3>🎯 Objectives</h3>
<ul><li>Phân biệt TRUE, FALSE, NOT GIVEN</li></ul>
<h3>📖 Quy tắc</h3>
<div class="space-y-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-4 text-center">
    <p class="text-2xl font-black text-green-700">TRUE</p>
    <p>Thông tin trong bài <strong>KHỚP</strong> với câu hỏi</p>
  </div>
  <div class="bg-rose-50 rounded-xl p-4 text-center">
    <p class="text-2xl font-black text-rose-700">FALSE</p>
    <p>Thông tin trong bài <strong>MÂU THUẪN</strong> với câu hỏi</p>
  </div>
  <div class="bg-amber-50 rounded-xl p-4 text-center">
    <p class="text-2xl font-black text-amber-700">NOT GIVEN</p>
    <p>Bài <strong>KHÔNG ĐỀ CẬP</strong> thông tin này</p>
  </div>
</div>
<div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-xl my-4 text-sm">
  <p><strong>Mẹo:</strong> NOT GIVEN thường là thông tin "nghe hợp lý" nhưng bài không nói đến. Đừng suy luận từ kiến thức riêng!</p>
</div>`,

  // 3. READING: MATCHING HEADINGS
  ielts_matching: `
<h3>🎯 Objectives</h3>
<ul><li>Nối heading với đoạn văn</li></ul>
<h3>📖 Chiến thuật</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm space-y-2">
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">1</span><p>Đọc hết <strong>danh sách headings</strong> trước</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">2</span><p>Đọc <strong>câu đầu + câu cuối</strong> mỗi đoạn</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">3</span><p>Loại trừ heading dễ trước</p></div>
  <div class="flex items-start"><span class="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">4</span><p>Cần chọn main idea, <strong>không chọn detail</strong></p></div>
</div>`,

  // 4. LISTENING: FORM COMPLETION
  ielts_listening_form: `
<h3>🎯 Objectives</h3>
<ul><li>Điền form, ghi chú trong Listening</li></ul>
<h3>📖 Tips quan trọng</h3>
<div class="space-y-2 my-4 text-sm">
  <div class="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-xl">📝 Kiểm tra <strong>giới hạn từ</strong> (Write NO MORE THAN TWO WORDS)</div>
  <div class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-xl">🔤 Chú ý <strong>chính tả</strong>: tên riêng, số, ngày tháng</div>
  <div class="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-xl">🎧 Đáp án thường đến <strong>sau paraphrase</strong>, không lặp y nguyên từ form</div>
  <div class="bg-purple-50 border-l-4 border-purple-400 p-3 rounded-r-xl">⚡ Đọc trước form trong 30 giây chuẩn bị → <strong>đoán dạng đáp án</strong> (tên? số? ngày?)</div>
</div>`,

  // 5. LISTENING: MULTIPLE CHOICE
  ielts_listening_mc: `
<h3>🎯 Objectives</h3>
<ul><li>Chiến thuật trắc nghiệm Listening</li></ul>
<h3>📖 Chiến thuật</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm space-y-3">
  <p><strong>1. Đọc trước:</strong> Gạch chân keyword trong câu hỏi và đáp án</p>
  <p><strong>2. Nghe cẩn thận:</strong> Speaker hay dùng distractor (nói rồi phủ nhận)</p>
  <p><strong>3. Paraphrase:</strong> Đáp án đúng thường diễn đạt KHÁC so với audio</p>
</div>
<div class="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-xl my-4 text-sm">
  <p><strong>⚠️ Bẫy thường gặp:</strong> Nếu nghe thấy từ y hệt đáp án → khả năng cao là <strong>distractor</strong>. Đáp án đúng thường là paraphrase.</p>
</div>`,

  // 6. WRITING TASK 1
  ielts_writing1: `
<h3>🎯 Objectives</h3>
<ul><li>Mô tả biểu đồ, bảng, quy trình</li></ul>
<h3>📖 Cấu trúc</h3>
<div class="space-y-3 my-4 text-sm">
  <div class="bg-blue-100 rounded-xl p-4"><p class="font-bold text-blue-800">Introduction</p><p>Paraphrase đề bài — <strong>Không copy</strong></p></div>
  <div class="bg-green-100 rounded-xl p-4"><p class="font-bold text-green-800">Overview</p><p>2-3 xu hướng/đặc điểm <strong>nổi bật nhất</strong> (QUAN TRỌNG NHẤT)</p></div>
  <div class="bg-purple-100 rounded-xl p-4"><p class="font-bold text-purple-800">Body 1 & 2</p><p>Chi tiết + số liệu cụ thể. Nhóm theo logic.</p></div>
</div>
<h3>📖 Vocabulary hay</h3>
<div class="grid grid-cols-2 gap-3 my-4 text-sm">
  <div class="bg-green-50 rounded-xl p-3"><strong>Tăng:</strong> rose, climbed, surged, increased dramatically</div>
  <div class="bg-rose-50 rounded-xl p-3"><strong>Giảm:</strong> fell, declined, dropped, plummeted</div>
  <div class="bg-amber-50 rounded-xl p-3"><strong>Ổn định:</strong> remained stable, plateaued</div>
  <div class="bg-blue-50 rounded-xl p-3"><strong>Dao động:</strong> fluctuated, varied</div>
</div>`,

  // 7. WRITING TASK 2
  ielts_writing2: `
<h3>🎯 Objectives</h3>
<ul><li>Cấu trúc bài luận 250 từ</li></ul>
<h3>📖 Cấu trúc 4 đoạn</h3>
<div class="space-y-3 my-4 text-sm">
  <div class="bg-blue-100 rounded-xl p-4">
    <p class="font-bold text-blue-800">Introduction (2-3 câu)</p>
    <p>Paraphrase đề → Thesis statement (quan điểm rõ ràng)</p>
  </div>
  <div class="bg-green-100 rounded-xl p-4">
    <p class="font-bold text-green-800">Body 1 (5-7 câu)</p>
    <p>Topic sentence → Explanation → Example → Link back</p>
  </div>
  <div class="bg-purple-100 rounded-xl p-4">
    <p class="font-bold text-purple-800">Body 2 (5-7 câu)</p>
    <p>Luận điểm 2 hoặc phản biện → Giải thích → Ví dụ</p>
  </div>
  <div class="bg-amber-100 rounded-xl p-4">
    <p class="font-bold text-amber-800">Conclusion (2 câu)</p>
    <p>Tóm tắt + khẳng định lại quan điểm. <strong>Không thêm ý mới!</strong></p>
  </div>
</div>`,

  // 8. SPEAKING PART 1 & 2
  ielts_speaking: `
<h3>🎯 Objectives</h3>
<ul><li>Chiến thuật Speaking Part 1 & 2</li></ul>
<h3>📖 Part 1 (Interview)</h3>
<div class="bg-blue-50 rounded-xl p-5 my-4 text-sm">
  <p class="font-bold text-blue-800 mb-2">Trả lời 2-3 câu, tự nhiên</p>
  <p><strong>Công thức:</strong> Answer → Explain → Example</p>
  <p class="mt-2 bg-white rounded-lg p-3">"Do you like reading?" → <em>"Yes, I'm quite fond of reading, especially novels. I usually read before bed because it helps me relax after a long day."</em></p>
</div>
<h3>📖 Part 2 (Cue Card)</h3>
<div class="bg-green-50 rounded-xl p-5 my-4 text-sm">
  <p class="font-bold text-green-800 mb-2">Nói 1-2 phút, chuẩn bị 1 phút</p>
  <p><strong>Mẹo:</strong> Trả lời theo 4 gạch trên cue card → Mỗi gạch = 3-4 câu</p>
</div>`,

  // 9. VOCABULARY BOOSTER
  ielts_vocab: `
<h3>🎯 Objectives</h3>
<ul><li>Từ vựng band 7+ theo chủ đề</li></ul>
<h3>📖 Academic Vocabulary</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead><tr class="bg-blue-100"><th class="border p-2">Basic</th><th class="border p-2">Band 7+</th><th class="border p-2">Ví dụ</th></tr></thead>
    <tbody>
      <tr><td class="border p-2">important</td><td class="border p-2 font-bold">crucial / pivotal</td><td class="border p-2">Education plays a <strong>pivotal</strong> role</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">big</td><td class="border p-2 font-bold">substantial / significant</td><td class="border p-2">A <strong>substantial</strong> amount of</td></tr>
      <tr><td class="border p-2">more and more</td><td class="border p-2 font-bold">an increasing number of</td><td class="border p-2"><strong>An increasing number of</strong> people</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">very</td><td class="border p-2 font-bold">exceptionally / remarkably</td><td class="border p-2"><strong>Remarkably</strong> effective</td></tr>
      <tr><td class="border p-2">because</td><td class="border p-2 font-bold">owing to / as a result of</td><td class="border p-2"><strong>Owing to</strong> rapid urbanization</td></tr>
      <tr class="bg-slate-50"><td class="border p-2">but</td><td class="border p-2 font-bold">nevertheless / however</td><td class="border p-2"><strong>Nevertheless</strong>, some argue</td></tr>
    </tbody>
  </table>
</div>
<div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl my-4 text-sm">
  <p><strong>Mẹo:</strong> Học từ vựng theo <strong>collocations</strong> (cụm từ) thay vì từ đơn lẻ!</p>
</div>`,

};
