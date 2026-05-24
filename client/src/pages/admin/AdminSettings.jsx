import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import { Building2, Plus, LoaderCircle, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminSettings() {
  const [me, setMe] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCollege, setNewCollege] = useState({
    name: "",
    placementCellName: "",
  });
  const [newDept, setNewDept] = useState({ name: "", code: "" });
  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: meRes }, { data: cRes }, { data: dRes }] = await Promise.all([
        api.get("/api/admin/me"),
        api.get("/api/admin/colleges"),
        api.get("/api/admin/departments"),
      ]);
      setMe(meRes.user);
      setColleges(cRes.colleges || []);
      setDepartments(dRes.departments || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createCollege = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/colleges", newCollege);
      toast.success("College created and linked");
      setNewCollege({ name: "", placementCellName: "" });
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    }
  };

  const linkCollege = async (id) => {
    try {
      await api.put("/api/admin/me/link-college", { collegeId: id });
      toast.success("Linked");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    }
  };

  const createDept = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/departments", newDept);
      setNewDept({ name: "", code: "" });
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validation
    if (!changePassword.oldPassword || !changePassword.newPassword) {
      toast.error("All fields are required");
      return;
    }

    if (changePassword.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (changePassword.newPassword !== changePassword.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      await api.put("/api/users/change-password", {
        currentPassword: changePassword.oldPassword,
        newPassword: changePassword.newPassword,
      });
      toast.success("Password changed successfully!");
      setChangePassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <LoaderCircle className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  const linkedCollege = me?.collegeId;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Settings
        </h1>
        <p className="text-slate-600 mt-1">
          Manage your account and college settings.
        </p>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">Change Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.old ? "text" : "password"}
                placeholder="Enter your current password"
                value={changePassword.oldPassword}
                onChange={(e) =>
                  setChangePassword((p) => ({
                    ...p,
                    oldPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((p) => ({ ...p, old: !p.old }))
                }
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.old ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                placeholder="Enter new password (min 8 characters)"
                value={changePassword.newPassword}
                onChange={(e) =>
                  setChangePassword((p) => ({
                    ...p,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((p) => ({ ...p, new: !p.new }))
                }
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={changePassword.confirmPassword}
                onChange={(e) =>
                  setChangePassword((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))
                }
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg font-medium flex items-center justify-center gap-2"
          >
            {changingPassword && (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            )}
            {changingPassword ? "Changing..." : "Change Password"}
          </button>

          <p className="text-xs text-slate-500 mt-3">
            After changing your password, you'll need to login again with your new password.
          </p>
        </form>
      </div>

      {/* College status */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Your College</h3>
        </div>

        {linkedCollege ? (
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
            <div>
              <p className="font-semibold text-emerald-900">
                {linkedCollege.name}
              </p>
              {linkedCollege.placementCellName && (
                <p className="text-sm text-emerald-700">
                  {linkedCollege.placementCellName}
                </p>
              )}
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
              You're not linked to a college yet. Create one or pick from the list.
            </p>

            <form
              onSubmit={createCollege}
              className="border border-slate-200 rounded-lg p-4 space-y-3"
            >
              <p className="font-medium text-sm text-slate-900">Create new</p>
              <input
                type="text"
                placeholder="College name"
                value={newCollege.name}
                onChange={(e) =>
                  setNewCollege((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                required
              />
              <input
                type="text"
                placeholder="Placement cell name (optional)"
                value={newCollege.placementCellName}
                onChange={(e) =>
                  setNewCollege((p) => ({
                    ...p,
                    placementCellName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg"
              >
                Create & link
              </button>
            </form>

            {colleges.length > 0 && (
              <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                <p className="font-medium text-sm text-slate-900">
                  Or pick existing
                </p>
                {colleges.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-700">{c.name}</span>
                    <button
                      onClick={() => linkCollege(c._id)}
                      className="text-indigo-600 hover:underline"
                    >
                      Link
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Departments */}
      {linkedCollege && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Departments</h3>

          <form
            onSubmit={createDept}
            className="flex flex-wrap gap-2 mb-4"
          >
            <input
              type="text"
              placeholder="Department name (e.g., BCA)"
              value={newDept.name}
              onChange={(e) =>
                setNewDept((p) => ({ ...p, name: e.target.value }))
              }
              className="flex-1 min-w-[200px] px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
            <input
              type="text"
              placeholder="Code (optional)"
              value={newDept.code}
              onChange={(e) =>
                setNewDept((p) => ({ ...p, code: e.target.value }))
              }
              className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>

          {departments.length === 0 ? (
            <p className="text-sm text-slate-500">No departments yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {departments.map((d) => (
                <div
                  key={d._id}
                  className="px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-700"
                >
                  <span className="font-medium">{d.name}</span>
                  {d.code && (
                    <span className="text-slate-400 ml-1">({d.code})</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
