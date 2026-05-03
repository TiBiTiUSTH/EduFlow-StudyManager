import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OnboardingDialog({ open, setOpen }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleSetupProfile = () => {
    setOpen(false);
    navigate("/stms/student/profile");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-8"
        >
          {/* Nền trang trí */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20">
              <Sparkles className="text-white h-8 w-8" />
            </div>

            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
              Hoàn thiện hồ sơ ngay!
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Để bắt đầu tìm kiếm bạn học phù hợp và tham gia các nhóm học tập, hãy cập nhật thông tin và sở thích của bạn.
            </p>

            <div className="flex flex-col w-full gap-3">
              <button
                onClick={handleSetupProfile}
                className="w-full py-4 px-6 bg-white text-slate-950 font-bold rounded-2xl flex items-center justify-center group hover:bg-primary-50 transition-all shadow-xl"
              >
                Thiết lập hồ sơ
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setOpen(false)}
                className="w-full py-4 px-6 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all border border-slate-700"
              >
                Để sau
              </button>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
