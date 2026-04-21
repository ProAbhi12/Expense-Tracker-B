import React from "react";
import { Mail, Phone, MapPin, CalendarDays, Briefcase, BadgeCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import profile from "../dummyData/profile.json";

const details = [
  { icon: Mail, label: "Email", value: profile.email },
  { icon: Phone, label: "Phone", value: profile.phone },
  { icon: MapPin, label: "Location", value: profile.location },
  { icon: CalendarDays, label: "Joined", value: profile.joined },
  { icon: Briefcase, label: "Role", value: profile.role },
];

const Profile = () => {
  const { dark, gradient } = useTheme();

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className={`text-2xl font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Profile</h1>
        <p className={gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}>Manage your personal information and account overview.</p>
      </div>

      <div
        className={`rounded-2xl border p-6 md:p-8 transition ${
          gradient
            ? "bg-slate-900/40 border-purple-700/40 backdrop-blur-sm shadow-[0_10px_30px_rgba(147,51,234,0.15)]"
            : dark
            ? "bg-slate-900 border-slate-700 shadow-[0_10px_30px_rgba(148,163,184,0.14)]"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
          <div className="w-24 h-24 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className={`text-2xl font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{profile.name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700">
                <BadgeCheck size={12} /> Verified
              </span>
            </div>
            <p className="text-sm font-medium text-blue-600 mt-1">{profile.role}</p>
            <p className={`mt-3 max-w-2xl text-sm leading-6 ${gradient ? "text-purple-100" : dark ? "text-slate-300" : "text-gray-600"}`}>{profile.bio}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {profile.stats.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl border p-4 ${
                    gradient ? "bg-purple-600/20 border-purple-700/40" : dark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <p className={`text-xs ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>{item.label}</p>
                  <p className={`text-lg font-semibold mt-1 ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`rounded-2xl border p-6 transition ${
          gradient
            ? "bg-slate-900/40 border-purple-700/40 backdrop-blur-sm shadow-[0_10px_30px_rgba(147,51,234,0.12)]"
            : dark
            ? "bg-slate-900 border-slate-700 shadow-[0_10px_30px_rgba(148,163,184,0.12)]"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Personal Data</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail) => (
            <div
              key={detail.label}
              className={`rounded-xl border p-4 flex items-start gap-3 ${
                gradient ? "bg-purple-600/20 border-purple-700/40" : dark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className={`mt-0.5 ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>
                <detail.icon size={16} />
              </div>
              <div>
                <p className={`text-xs ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>{detail.label}</p>
                <p className={`text-sm font-medium mt-1 ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
