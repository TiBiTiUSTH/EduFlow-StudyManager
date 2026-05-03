import { CONTENT as C1 } from './lessonContent.js';
import { CONTENT2 as C2 } from './lessonContent2.js';
import { CONTENT3 as C3 } from './lessonContent3.js';
import { TOAN1_CONTENT as T1 } from './lessonContent_toan1.js';
import { TOAN1_PART2 as T1P2 } from './lessonContent_toan1_p2.js';
import { TV3_CONTENT as TV3 } from './lessonContent_tv3.js';
import { VL9_P1 } from './lessonContent_vl9.js';
import { VL9_P2 } from './lessonContent_vl9_p2.js';
import { DS8_P1 } from './lessonContent_ds8.js';
import { DS8_P2 } from './lessonContent_ds8_p2.js';
import { TOAN10_FULL as T10 } from './lessonContent_toan10.js';
import { HOA12_P1 as H12A } from './lessonContent_hoa12.js';
import { HOA12_P2 as H12B } from './lessonContent_hoa12_p2.js';
import { VL12_FULL as VL12 } from './lessonContent_vl12.js';
import { VAN12_FULL as V12 } from './lessonContent_van12.js';
import { PY_P1 } from './lessonContent_python.js';
import { PY_P2 } from './lessonContent_python_p2.js';
import { DSTT_FULL as DSTT } from './lessonContent_dstt.js';
import { IELTS_FULL as IELTS } from './lessonContent_ielts.js';
import { KOREAN_FULL as KR } from './lessonContent_korean.js';

const CONTENT = { ...C1, ...C2, ...C3, ...T1, ...T1P2, ...TV3, ...VL9_P1, ...VL9_P2, ...DS8_P1, ...DS8_P2, ...T10, ...H12A, ...H12B, ...VL12, ...V12, ...PY_P1, ...PY_P2, ...DSTT, ...IELTS, ...KR };

export const getSubjectMaterial = (id) => {
    const materials = {

        //CẤP 1
        1: {
            coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
            description: 'Tài liệu tham khảo Toán lớp 1. Giúp học sinh làm quen với con số, phép tính cơ bản thông qua hình ảnh trực quan.',
            chapters: [
                {
                    id: 'c1', title: 'Chương 1: Làm quen với các con số',
                    lessons: [
                        { id: 'l1', title: '1.1 Các số từ 0 đến 10', content: CONTENT.toan1_so_1_10 },
                        { id: 'l2', title: '1.2 So sánh số (>, <, =)', content: CONTENT.toan1_so_sanh }
                    ]
                },
                {
                    id: 'c2', title: 'Chương 2: Phép cộng và trừ phạm vi 10',
                    lessons: [
                        { id: 'l3', title: '2.1 Phép cộng trong phạm vi 10', content: CONTENT.toan1_cong_10 },
                        { id: 'l4', title: '2.2 Phép trừ trong phạm vi 10', content: CONTENT.toan1_tru_10 }
                    ]
                },
                {
                    id: 'c3', title: 'Chương 3: Hình học và Đo lường',
                    lessons: [
                        { id: 'l5', title: '3.1 Hình học đơn giản', content: CONTENT.toan1_hinh_hoc }
                    ]
                },
                {
                    id: 'c4', title: 'Chương 4: Các số đến 100',
                    lessons: [
                        { id: 'l6', title: '4.1 Các số từ 11 đến 20', content: CONTENT.toan1_11_20 },
                        { id: 'l7', title: '4.2 Các số đến 100', content: CONTENT.toan1_so_100 },
                        { id: 'l8', title: '4.3 Cộng trừ phạm vi 100', content: CONTENT.toan1_tinh_100 }
                    ]
                },
                {
                    id: 'c5', title: 'Chương 5: Ứng dụng và Thực hành',
                    lessons: [
                        { id: 'l9', title: '5.1 Giải toán có lời văn', content: CONTENT.toan1_loi_van },
                        { id: 'l10', title: '5.2 Đồng hồ và Thời gian', content: CONTENT.toan1_dong_ho }
                    ]
                }
            ]
        },

        2: {
            coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
            description: 'Tiếng Việt lớp 3: Rèn luyện kỹ năng đọc hiểu . Chương trình bám sát SGK các bộ sách Cánh Diều, Kết nối tri thức.',
            chapters: [
                {
                    id: 'c1', title: 'Chương 1: Đọc hiểu và Từ ngữ',
                    lessons: [
                        { id: 'l1', title: '1.1 Kỹ năng đọc hiểu văn bản', content: CONTENT.tv3_doc_hieu },
                        { id: 'l2', title: '1.2 Từ và câu - Cấu trúc cơ bản', content: CONTENT.tv3_tu_cau },
                        { id: 'l3', title: '1.3 Luyện từ và câu nâng cao', content: CONTENT.tv3_luyen_tu }
                    ]
                },
                {
                    id: 'c2', title: 'Chương 2: Kể chuyện và Viết văn',
                    lessons: [
                        { id: 'l4', title: '2.1 Kể chuyện sáng tạo', content: CONTENT.tv3_ke_chuyen },
                        { id: 'l5', title: '2.2 Viết đoạn văn ngắn', content: CONTENT.tv3_viet_doan_van }
                    ]
                },
                {
                    id: 'c3', title: 'Chương 3: Chính tả và Tập làm văn',
                    lessons: [
                        { id: 'l6', title: '3.1 Chính tả và Quy tắc viết', content: CONTENT.tv3_chinh_ta },
                        { id: 'l7', title: '3.2 Tập làm văn - Tả cảnh', content: CONTENT.tv3_ta_canh }
                    ]
                }
            ]
        },

        // CẤP 2 
        3: {
            coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
            description: 'Tài liệu tham khảo về Điện học – Quang học. Chương trình giúp học sinh hiểu về mạch điện, định luật Ôm và thấu kính.',
            chapters: [
                {
                    id: 'c1', title: 'Chương 1: Định luật Ôm',
                    lessons: [
                        { id: 'l1', title: '1.1 Sự phụ thuộc I vào U', content: CONTENT.vl9_I_U },
                        { id: 'l2', title: '1.2 Định luật Ôm', content: CONTENT.vl9_dinh_luat_ohm },
                        { id: 'l3', title: '1.3 Điện trở dây dẫn', content: CONTENT.vl9_dien_tro }
                    ]
                },
                {
                    id: 'c2', title: 'Chương 2: Đoạn mạch điện',
                    lessons: [
                        { id: 'l4', title: '2.1 Đoạn mạch nối tiếp', content: CONTENT.vl9_noi_tiep },
                        { id: 'l5', title: '2.2 Đoạn mạch song song', content: CONTENT.vl9_song_song }
                    ]
                },
                {
                    id: 'c3', title: 'Chương 3: Công suất điện & An toàn',
                    lessons: [
                        { id: 'l6', title: '3.1 Công suất điện & Điện năng', content: CONTENT.vl9_cong_suat },
                        { id: 'l7', title: '3.2 Định luật Jun - Len-xơ', content: CONTENT.vl9_jun_lenxo },
                        { id: 'l8', title: '3.3 Sử dụng an toàn điện', content: CONTENT.vl9_an_toan_dien }
                    ]
                },
                {
                    id: 'c4', title: 'Chương 4: Quang học',
                    lessons: [
                        { id: 'l9', title: '4.1 Khúc xạ ánh sáng', content: CONTENT.vl9_khuc_xa },
                        { id: 'l10', title: '4.2 Thấu kính hội tụ', content: CONTENT.vl9_thau_kinh_ht },
                        { id: 'l11', title: '4.3 Thấu kính phân kỳ', content: CONTENT.vl9_thau_kinh_pk },
                        { id: 'l12', title: '4.4 Mắt và các tật của mắt', content: CONTENT.vl9_mat }
                    ]
                }
            ]
        },

        4: {
            coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
            description: 'Đại số 8 – Phương trình, Bất phương trình và Phân thức đại số. Nền tảng vững chắc cho học sinh.',
            chapters: [
                {
                    id: 'c1', title: 'Chương 1: Nhân đa thức & Hằng đẳng thức',
                    lessons: [
                        { id: 'l1', title: '1.1 Nhân đơn thức với đa thức', content: CONTENT.ds8_nhan_don_da },
                        { id: 'l2', title: '1.2 Bảy hằng đẳng thức đáng nhớ', content: CONTENT.ds8_hang_dang_thuc },
                        { id: 'l3', title: '1.3 Phân tích nhân tử', content: CONTENT.ds8_phan_tich }
                    ]
                },
                {
                    id: 'c2', title: 'Chương 2: Phân thức đại số',
                    lessons: [
                        { id: 'l4', title: '2.1 Phân thức đại số & Rút gọn', content: CONTENT.ds8_phan_thuc_new },
                        { id: 'l5', title: '2.2 Cộng trừ phân thức', content: CONTENT.ds8_cong_tru_pt },
                        { id: 'l6', title: '2.3 Nhân chia phân thức', content: CONTENT.ds8_nhan_chia_pt }
                    ]
                },
                {
                    id: 'c3', title: 'Chương 3: Phương trình',
                    lessons: [
                        { id: 'l7', title: '3.1 PT bậc nhất một ẩn', content: CONTENT.ds8_pt_bac_nhat },
                        { id: 'l8', title: '3.2 Phương trình tích', content: CONTENT.ds8_pt_tich },
                        { id: 'l9', title: '3.3 PT chứa ẩn ở mẫu', content: CONTENT.ds8_pt_chua_an_mau }
                    ]
                },
                {
                    id: 'c4', title: 'Chương 4: Bất PT & Hàm số',
                    lessons: [
                        { id: 'l10', title: '4.1 BPT bậc nhất một ẩn', content: CONTENT.ds8_bpt_bac_nhat },
                        { id: 'l11', title: '4.2 Phương trình đường thẳng', content: CONTENT.ds8_pt_duong_thang }
                    ]
                },
                {
                    id: 'c5', title: 'Chương 5: Hệ PT & Ứng dụng',
                    lessons: [
                        { id: 'l12', title: '5.1 Hệ PT bậc nhất hai ẩn', content: CONTENT.ds8_he_pt },
                        { id: 'l13', title: '5.2 Giải toán bằng lập PT', content: CONTENT.ds8_lap_pt },
                        { id: 'l14', title: '5.3 Ôn tập tổng hợp', content: CONTENT.ds8_on_tap }
                    ]
                }
            ]
        },

        // CẤP 3 
        5: {
            coverImage: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80',
            description: 'Toán Đại số lớp 10: Tập hợp, Mệnh đề, Hàm số và Phương trình.',
            chapters: [
                {
                    id: 'c1', title: 'Chương 1: Mệnh đề và Tập hợp',
                    lessons: [
                        { id: 'l1', title: '1.1 Mệnh đề toán học', content: CONTENT.t10_menh_de },
                        { id: 'l2', title: '1.2 Tập hợp và các phép toán', content: CONTENT.t10_tap_hop }
                    ]
                },
                {
                    id: 'c2', title: 'Chương 2: Hàm số',
                    lessons: [
                        { id: 'l3', title: '2.1 Hàm số bậc nhất', content: CONTENT.t10_ham_bac_nhat },
                        { id: 'l4', title: '2.2 Hàm số bậc hai', content: CONTENT.t10_ham_bac_hai }
                    ]
                },
                {
                    id: 'c3', title: 'Chương 3: Phương trình & BPT',
                    lessons: [
                        { id: 'l5', title: '3.1 PT bậc hai', content: CONTENT.t10_pt_bac_hai },
                        { id: 'l6', title: '3.2 BPT bậc hai', content: CONTENT.t10_bpt_bac_hai },
                        { id: 'l7', title: '3.3 Hệ BPT bậc nhất hai ẩn', content: CONTENT.t10_he_bpt }
                    ]
                },
                {
                    id: 'c4', title: 'Chương 4: Thống kê',
                    lessons: [
                        { id: 'l8', title: '4.1 Thống kê mô tả', content: CONTENT.t10_thong_ke }
                    ]
                }
            ]
        },

        6: {
            coverImage: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&w=1200&q=80',
            description: 'Tài liệu ôn thi Hóa học 12. Chuyên sâu về Kim loại kiềm, kiềm thổ, Nhôm và Sắt.',
            chapters: [
                {
                    id: 'c1', title: 'Chương 1: Este - Lipit - Cacbohidrat',
                    lessons: [
                        { id: 'l1', title: '1.1 Este', content: CONTENT.h12_este },
                        { id: 'l2', title: '1.2 Lipit', content: CONTENT.h12_lipit },
                        { id: 'l3', title: '1.3 Cacbohidrat', content: CONTENT.h12_cacbohidrat }
                    ]
                },
                {
                    id: 'c2', title: 'Chương 2: Amin - Amino axit - Polime',
                    lessons: [
                        { id: 'l4', title: '2.1 Amin', content: CONTENT.h12_amin },
                        { id: 'l5', title: '2.2 Amino axit', content: CONTENT.h12_amino_axit },
                        { id: 'l6', title: '2.3 Polime', content: CONTENT.h12_polime }
                    ]
                },
                {
                    id: 'c3', title: 'Chương 3: Kim loại tổng quan',
                    lessons: [
                        { id: 'l7', title: '3.1 Tính chất chung kim loại', content: CONTENT.h12_kim_loai_tq },
                        { id: 'l8', title: '3.2 Kim loại kiềm', content: CONTENT.h12_kiem_new },
                        { id: 'l9', title: '3.3 Kim loại kiềm thổ', content: CONTENT.h12_kiem_tho_new }
                    ]
                },
                {
                    id: 'c4', title: 'Chương 4: Nhôm - Sắt - Điện phân',
                    lessons: [
                        { id: 'l10', title: '4.1 Nhôm và hợp chất', content: CONTENT.h12_nhom_new },
                        { id: 'l11', title: '4.2 Sắt và hợp chất', content: CONTENT.h12_sat_new },
                        { id: 'l12', title: '4.3 Điện phân', content: CONTENT.h12_dien_phan },
                        { id: 'l13', title: '4.4 Ăn mòn kim loại', content: CONTENT.h12_an_mon }
                    ]
                }
            ]
        },

        7: {
            coverImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
            description: 'Vật lý 12: Dao động cơ, Sóng điện từ, Vật lý hạt nhân.',
            chapters: [
                {
                    id: 'c1', title: 'Chương 1: Dao động cơ',
                    lessons: [
                        { id: 'l1', title: '1.1 Dao động điều hòa', content: CONTENT.vl12_dddh },
                        { id: 'l2', title: '1.2 Con lắc lò xo', content: CONTENT.vl12_cllx },
                        { id: 'l3', title: '1.3 Con lắc đơn', content: CONTENT.vl12_cldon },
                        { id: 'l4', title: '1.4 Tổng hợp dao động', content: CONTENT.vl12_tong_hop }
                    ]
                },
                {
                    id: 'c2', title: 'Chương 2: Sóng cơ',
                    lessons: [
                        { id: 'l5', title: '2.1 Sóng cơ', content: CONTENT.vl12_song_co_new },
                        { id: 'l6', title: '2.2 Giao thoa sóng', content: CONTENT.vl12_giao_thoa },
                        { id: 'l7', title: '2.3 Sóng dừng', content: CONTENT.vl12_song_dung }
                    ]
                },
                {
                    id: 'c3', title: 'Chương 3: Điện xoay chiều & Sóng ĐT',
                    lessons: [
                        { id: 'l8', title: '3.1 Dòng điện xoay chiều', content: CONTENT.vl12_dien_xc },
                        { id: 'l9', title: '3.2 Sóng điện từ', content: CONTENT.vl12_song_dt }
                    ]
                },
                {
                    id: 'c4', title: 'Chương 4: Vật lý hạt nhân',
                    lessons: [
                        { id: 'l10', title: '4.1 Hạt nhân & Phóng xạ', content: CONTENT.vl12_hat_nhan }
                    ]
                }
            ]
        },

        8: {
            coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
            description: 'Ngữ văn 12 THPT: Nghị luận xã hội, Nghị luận văn học và phân tích các tác phẩm trọng tâm.',
            chapters: [
                {
                    id: 'c1', title: 'Phần 1: Nghị luận xã hội',
                    lessons: [
                        { id: 'l1', title: '1.1 Cấu trúc bài NLXH', content: CONTENT.v12_nlxh }
                    ]
                },
                {
                    id: 'c2', title: 'Phần 2: Văn xuôi hiện đại',
                    lessons: [
                        { id: 'l2', title: '2.1 Vợ nhặt - Kim Lân', content: CONTENT.v12_vo_nhat },
                        { id: 'l3', title: '2.2 Rừng xà nu - Nguyễn Trung Thành', content: CONTENT.v12_rung_xa_nu },
                        { id: 'l4', title: '2.3 Chiếc thuyền ngoài xa - NMC', content: CONTENT.v12_chiec_thuyen }
                    ]
                },
                {
                    id: 'c3', title: 'Phần 3: Ký & Bút ký',
                    lessons: [
                        { id: 'l5', title: '3.1 Người lái đò sông Đà - NT', content: CONTENT.v12_song_da },
                        { id: 'l6', title: '3.2 Ai đã đặt tên cho dòng sông - HP.NT', content: CONTENT.v12_song_huong }
                    ]
                }
            ]
        },

        // ĐẠI HỌC 
        9: {
            coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
            description: 'Nhập môn lập trình tư duy và thuật toán thông qua ngôn ngữ Python. Phù hợp người mới bắt đầu.',
            chapters: [
                {
                    id: 'c1', title: 'Chương 1: Cơ bản',
                    lessons: [
                        { id: 'l1', title: '1.1 Biến và Kiểu dữ liệu', content: CONTENT.py_bien },
                        { id: 'l2', title: '1.2 Toán tử và Biểu thức', content: CONTENT.py_toan_tu },
                        { id: 'l3', title: '1.3 Câu lệnh điều kiện', content: CONTENT.py_if },
                        { id: 'l4', title: '1.4 Vòng lặp', content: CONTENT.py_loop }
                    ]
                },
                {
                    id: 'c2', title: 'Chương 2: Hàm & Cấu trúc dữ liệu',
                    lessons: [
                        { id: 'l5', title: '2.1 Hàm (Functions)', content: CONTENT.py_ham },
                        { id: 'l6', title: '2.2 Chuỗi (String)', content: CONTENT.py_string },
                        { id: 'l7', title: '2.3 List', content: CONTENT.py_list },
                        { id: 'l8', title: '2.4 Dictionary', content: CONTENT.py_dict }
                    ]
                },
                {
                    id: 'c3', title: 'Chương 3: Nâng cao',
                    lessons: [
                        { id: 'l9', title: '3.1 Tuple & Set', content: CONTENT.py_tuple_set },
                        { id: 'l10', title: '3.2 Đọc/Ghi File', content: CONTENT.py_file },
                        { id: 'l11', title: '3.3 Xử lý ngoại lệ', content: CONTENT.py_exception }
                    ]
                },
                {
                    id: 'c4', title: 'Chương 4: OOP & Module',
                    lessons: [
                        { id: 'l12', title: '4.1 Lập trình hướng đối tượng', content: CONTENT.py_oop },
                        { id: 'l13', title: '4.2 Kế thừa', content: CONTENT.py_inheritance },
                        { id: 'l14', title: '4.3 Module & Package', content: CONTENT.py_module },
                        { id: 'l15', title: '4.4 Tổng hợp — Dự án mini', content: CONTENT.py_project }
                    ]
                }
            ]
        },

        10: {
            coverImage: 'https://images.unsplash.com/photo-1635070041409-e63e783ce3c1?auto=format&fit=crop&w=1200&q=80',
            description: 'Đại số Tuyến tính: Ma trận, Định thức, Không gian vectơ và Ánh xạ tuyến tính.',
            chapters: [
                {
                    id: 'c1', title: 'Chương 1: Ma trận & Định thức',
                    lessons: [
                        { id: 'l1', title: '1.1 Ma trận và phép toán', content: CONTENT.dstt_matran },
                        { id: 'l2', title: '1.2 Định thức', content: CONTENT.dstt_dinh_thuc },
                        { id: 'l3', title: '1.3 Ma trận nghịch đảo', content: CONTENT.dstt_nghich_dao },
                        { id: 'l4', title: '1.4 Hạng của ma trận', content: CONTENT.dstt_hang }
                    ]
                },
                {
                    id: 'c2', title: 'Chương 2: Hệ PT tuyến tính',
                    lessons: [
                        { id: 'l5', title: '2.1 Giải hệ bằng Gauss', content: CONTENT.dstt_he_pt },
                        { id: 'l6', title: '2.2 Quy tắc Cramer', content: CONTENT.dstt_cramer }
                    ]
                },
                {
                    id: 'c3', title: 'Chương 3: Không gian vectơ',
                    lessons: [
                        { id: 'l7', title: '3.1 Không gian vectơ', content: CONTENT.dstt_kgv },
                        { id: 'l8', title: '3.2 Độc lập tuyến tính', content: CONTENT.dstt_doc_lap },
                        { id: 'l9', title: '3.3 Cơ sở và số chiều', content: CONTENT.dstt_co_so },
                        { id: 'l10', title: '3.4 Ánh xạ tuyến tính', content: CONTENT.dstt_anh_xa }
                    ]
                }
            ]
        },

        // NGOẠI NGỮ 
        11: {
            coverImage: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80',
            description: 'IELTS 6.5+: Chiến thuật làm bài Reading - Listening - Writing - Speaking.',
            chapters: [
                {
                    id: 'c1', title: 'Part 1: Reading',
                    lessons: [
                        { id: 'l1', title: '1.1 Skimming & Scanning', content: CONTENT.ielts_skim_new },
                        { id: 'l2', title: '1.2 True/False/Not Given', content: CONTENT.ielts_tfng_new },
                        { id: 'l3', title: '1.3 Matching Headings', content: CONTENT.ielts_matching }
                    ]
                },
                {
                    id: 'c2', title: 'Part 2: Listening',
                    lessons: [
                        { id: 'l4', title: '2.1 Form Completion', content: CONTENT.ielts_listening_form },
                        { id: 'l5', title: '2.2 Multiple Choice', content: CONTENT.ielts_listening_mc }
                    ]
                },
                {
                    id: 'c3', title: 'Part 3: Writing',
                    lessons: [
                        { id: 'l6', title: '3.1 Writing Task 1', content: CONTENT.ielts_writing1 },
                        { id: 'l7', title: '3.2 Writing Task 2', content: CONTENT.ielts_writing2 }
                    ]
                },
                {
                    id: 'c4', title: 'Part 4: Speaking & Vocab',
                    lessons: [
                        { id: 'l8', title: '4.1 Speaking Part 1 & 2', content: CONTENT.ielts_speaking },
                        { id: 'l9', title: '4.2 Vocabulary Booster', content: CONTENT.ielts_vocab }
                    ]
                }
            ]
        },

        12: {
            coverImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80',
            description: 'Tiếng Hàn Căn bản: Bảng chữ cái Hangul, ngữ pháp và giao tiếp hàng ngày.',
            chapters: [
                {
                    id: 'c1', title: 'Chương 1: Hangul',
                    lessons: [
                        { id: 'l1', title: '1.1 Nguyên âm', content: CONTENT.kr_nguyen_am },
                        { id: 'l2', title: '1.2 Phụ âm', content: CONTENT.kr_phu_am },
                        { id: 'l3', title: '1.3 Ghép âm tiết', content: CONTENT.kr_ghep_am }
                    ]
                },
                {
                    id: 'c2', title: 'Chương 2: Giao tiếp',
                    lessons: [
                        { id: 'l4', title: '2.1 Chào hỏi & Giới thiệu', content: CONTENT.kr_chao },
                        { id: 'l5', title: '2.2 Số đếm', content: CONTENT.kr_so_dem },
                        { id: 'l6', title: '2.3 Ngữ pháp cơ bản', content: CONTENT.kr_ngu_phap },
                        { id: 'l7', title: '2.4 Hội thoại hàng ngày', content: CONTENT.kr_hoi_thoai }
                    ]
                }
            ]
        },

        fallback: {
            coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
            description: 'Tài liệu đang trong quá trình biên soạn. Vui lòng quay lại sau!',
            chapters: [
                {
                    id: 'c1', title: 'Đang xây dựng',
                    lessons: [
                        { id: 'l1', title: 'Tổng quan môn học', content: '<p>Môn học này đang trong quá trình biên soạn và kiểm duyệt chuyên môn. Vui lòng quay lại sau!</p>' }
                    ]
                }
            ]
        }
    };

    return materials[Number(id)] || materials.fallback;
};
