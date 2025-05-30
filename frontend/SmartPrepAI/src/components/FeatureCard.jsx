import React from "react";

const FeatureCard = ({ icon: Icon, title, description, className }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-color)]/10 to-[var(--theme-color)]/5 rounded-2xl blur-xl transition-all group-hover:blur-2xl" />
    <div className="relative bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-[var(--theme-color)]/20 transition-all">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--hover-color)]/10 text-[var(--theme-color)]">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-[var(--white-color)] tracking-tight">{title}</h3>
        <p className="text-[var(--secondary-color)] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export default FeatureCard;
