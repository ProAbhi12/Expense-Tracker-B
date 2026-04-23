import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Briefcase,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import profile from "../dummyData/profile.json";

const details = [
  { icon: Mail, label: "Email", value: profile.email },
  { icon: Phone, label: "Phone", value: profile.phone },
  { icon: MapPin, label: "Location", value: profile.location },
  { icon: CalendarDays, label: "Joined", value: profile.joined },
  { icon: Briefcase, label: "Role", value: profile.role },
];

const ProfileModal = ({ isOpen, onClose }) => {
  const { dark, gradient } = useTheme();
  const navigate = useNavigate();

  const handleSettings = () => {
    onClose();
    navigate("/app/settings");
  };

  const handleLogout = () => {
    onClose();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close profile modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />

      <div
        className={`relative w-full max-w-md rounded-2xl border overflow-hidden ${
          gradient
            ? "bg-slate-900/55 border-purple-700/40 shadow-[0_20px_60px_rgba(147,51,234,0.24)]"
            : dark
            ? "bg-slate-900 border-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.55)]"
            : "bg-white border-gray-200 shadow-xl"
        }`}
      >
        <div className={`h-16 ${gradient ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" : dark ? "bg-slate-800" : "bg-blue-100"}`} />

        <div className={`px-5 pt-3 pb-4 border-b flex items-start justify-between ${gradient ? "border-purple-700/30" : dark ? "border-slate-700" : "border-gray-200"}`}>
          <div className="-mt-10 flex items-start gap-3">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold border-4 border-white shadow-lg">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="pt-8">
              <h2 className={`text-lg font-semibold leading-tight ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{profile.name}</h2>
              <p className={`text-xs mt-1 ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>{profile.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 ${gradient ? "text-purple-200 hover:bg-purple-700/30" : dark ? "text-slate-300 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 max-h-[58vh] overflow-y-auto">
          <p className={`text-xs mb-3 ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>{profile.bio}</p>
          <div className="space-y-2">
            {details.map((detail) => (
              <div
                key={detail.label}
                className={`rounded-lg border px-3 py-2.5 flex items-start gap-3 ${
                  gradient ? "bg-purple-600/20 border-purple-700/40" : dark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className={`mt-0.5 ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>
                  <detail.icon size={15} />
                </div>
                <div>
                  <p className={`text-[11px] ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>{detail.label}</p>
                  <p className={`text-sm font-medium ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{detail.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-4 border-t grid grid-cols-2 gap-3 ${gradient ? "border-purple-700/30" : dark ? "border-slate-700" : "border-gray-200"}`}>
          <button
            type="button"
            onClick={handleSettings}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${gradient ? "bg-purple-600 hover:bg-purple-700 text-white" : dark ? "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;