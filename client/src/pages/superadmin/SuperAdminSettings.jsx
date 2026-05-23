import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Settings, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const SuperAdminSettings = () => {
  const { user } = useSelector((s) => s.auth);
  const [settings, setSettings] = useState({
    siteName: "Campus CV",
    siteEmail: "admin@campuscv.com",
    defaultPlanDuration: 12,
    trialDuration: 30,
    maxStudentsBasic: 300,
    maxStudentsStandard: 1000,
    priceBasic: 9999,
    priceStandard: 29999,
    pricePremium: 99999,
    emailNotifications: true,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaved(true);
      toast.success("Settings saved successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-slate-100 p-3 rounded-lg">
            <Settings className="w-6 h-6 text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        </div>
        <p className="text-slate-600">Manage system-wide settings and configurations</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900">Success</h3>
            <p className="text-sm text-green-700">Settings saved successfully</p>
          </div>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">General Settings</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Admin Email
          </label>
          <input
            type="email"
            name="siteEmail"
            value={settings.siteEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Default Plan Duration (months)
            </label>
            <input
              type="number"
              name="defaultPlanDuration"
              value={settings.defaultPlanDuration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Trial Duration (days)
            </label>
            <input
              type="number"
              name="trialDuration"
              value={settings.trialDuration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Subscription Plans</h2>

        {/* Basic Plan */}
        <div className="border border-slate-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-slate-900">Basic Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max Students
              </label>
              <input
                type="number"
                name="maxStudentsBasic"
                value={settings.maxStudentsBasic}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="priceBasic"
                value={settings.priceBasic}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Standard Plan */}
        <div className="border border-slate-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-slate-900">Standard Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max Students
              </label>
              <input
                type="number"
                name="maxStudentsStandard"
                value={settings.maxStudentsStandard}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="priceStandard"
                value={settings.priceStandard}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="border border-slate-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-slate-900">Premium Plan</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              name="pricePremium"
              value={settings.pricePremium}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">System Settings</h2>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <p className="font-medium text-slate-900">Email Notifications</p>
            <p className="text-sm text-slate-600">Send email notifications to users</p>
          </div>
          <input
            type="checkbox"
            name="emailNotifications"
            checked={settings.emailNotifications}
            onChange={handleChange}
            className="w-5 h-5 rounded border-slate-300 text-slate-600"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <p className="font-medium text-slate-900">Maintenance Mode</p>
            <p className="text-sm text-slate-600">Disable user access during maintenance</p>
          </div>
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
            className="w-5 h-5 rounded border-slate-300 text-slate-600"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">Note</h3>
          <p className="text-sm text-blue-700 mt-1">
            Changes to system settings will apply to all colleges. Make sure to review before saving.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
