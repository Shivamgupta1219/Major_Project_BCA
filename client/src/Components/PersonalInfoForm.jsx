import React from "react";
import { FaGithub } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { User, Mail, Phone, MapPin, Building, Globe } from "lucide-react";
function PersonalInfoForm({
  data,
  onChange,
  removeBackground,
  setRemoveBackground,
}) {
  const handleChange = (field, value) => {
  onChange({ ...data, [field]: value });
};

  // const fields = [
  //   {
  //     key: "full_name",
  //     label: "Full Name",
  //     type: "text",
  //     required: true,
  //     icon: User,
  //   },
    
  //   {
  //     key: "email",
  //     label: "Email",
  //     type: "email",
  //     required: true,
  //     icon: Mail,
  //   },
  //   {
  //     key: "phone",
  //     label: "Phone",
  //     type: "text",
  //     required: true,
  //     icon: Phone,
  //   },
  //   {
  //     key: "address",
  //     label: "Address",
  //     type: "text",
  //     required: false,
  //     icon: MapPin,
  //   },
  //   {
  //     key: "city",
  //     label: "City",
  //     type: "text",
  //     required: false,
  //     icon: Building,
  //   },
  //   {
  //     key: "state",
  //     label: "State",
  //     type: "text",
  //     required: false,
  //     icon: Building,
  //   },
  //   {
  //     key: "linkedin",
  //     label: "LinkedIn URL",
  //     type: "url",
  //     required: false,
  //     icon: CiLinkedin,
  //   },
  //   {
  //     key: "github",
  //     label: "GitHub URL",
  //     type: "url",
  //     required: false,
  //     icon: FaGithub,
  //   },
  //   {
  //     key: "portfolio",
  //     label: "Portfolio Website",
  //     type: "url",
  //     required: false,
  //     icon: Globe,
  //   },
  // ];
  const fields = [
  {
    key: "full_name",
    label: "Full Name",
    type: "text",
    required: true,
    icon: User,
  },
  // {
  //   key: "profession",
  //   label: "Profession",
  //   type: "text",
  //   required: false,
  //   icon: Building,
  // },
  {
    key: "email",
    label: "Email",
    type: "email",
    required: true,
    icon: Mail,
  },
  {
    key: "phone",
    label: "Phone",
    type: "text",
    required: true,
    icon: Phone,
  },
  {
    key: "location",
    label: "Location",
    type: "text",
    required: false,
    icon: MapPin,
  },
  {
    key: "linkedin",
    label: "LinkedIn URL",
    type: "url",
    required: false,
    icon: CiLinkedin,
  },
  {
    key: "github",
    label: "GitHub URL",
    type: "url",
    required: false,
    icon: FaGithub,
  },
  {
    key: "website",
    label: "Portfolio Website",
    type: "url",
    required: false,
    icon: Globe,
  },
];

  return (
    <div className="space-y-4">
      {/* TITLE */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h3>
        <p className="text-sm text-gray-600">
          Get started by entering your personal details
        </p>
      </div>

      {/* IMAGE + BG REMOVER */}
      <div className="flex items-start gap-6 pt-2">
        {/* IMAGE UPLOAD */}
        <label className="cursor-pointer">
          {data.image ? (
            <img
              src={
                typeof data.image === "string"
                  ? data.image
                  : URL.createObjectURL(data.image)
              }
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover ring-2 ring-slate-300 hover:opacity-90 transition"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-600 hover:text-slate-700">
              <User className="size-12 p-3 border rounded-full" />
              <span className="text-xs mt-1">Upload Image</span>
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
          onChange={(e) => handleChange(fields.key, e.target.value)}

          />
        </label>

        {/* REMOVE BACKGROUND TOGGLE */}
        {data.image instanceof File && (
          <div className="flex flex-col gap-2 text-sm pt-3">
            <p className="text-gray-700 font-medium">Remove Background</p>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={removeBackground}
                onChange={() => setRemoveBackground((prev) => !prev)}
              />

              <div className="w-10 h-5 bg-gray-400 rounded-full peer peer-checked:bg-green-600 transition-all duration-200"></div>

              <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></span>
            </label>
          </div>
        )}
      </div>
      {fields.map((field) => {
        const Icon = field.icon;
        return (
          <div key={field.key} className="space-y-1 mt-5">
            {/* Label */}
            <label className="block text-sm font-medium text-gray-700">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {/* Input Field */}
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />

              <input
                type={field.type}
                required={field.required}
                className="w-full pl-10 pr-3 py-2 border rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     text-gray-800"
                placeholder={field.label}
                value={data[field.key] || ""}
                onChange={(e) =>
                  onChange({
                    ...data,
                    [field.key]: e.target.value,
                  })
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PersonalInfoForm;
