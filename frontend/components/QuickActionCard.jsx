import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActionCard({ icon, title, desc, href, gradient }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(href)}
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 hover:shadow-xl transition-all cursor-pointer`}
    >
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="mt-4 text-xl font-bold text-white tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-white/80 line-clamp-2">{desc}</p>

        <div className="mt-6 flex items-center justify-center w-full py-2.5 px-4 bg-white/20 text-white rounded-xl backdrop-blur-md group-hover:bg-white/30 transition-all font-semibold text-sm">
          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
