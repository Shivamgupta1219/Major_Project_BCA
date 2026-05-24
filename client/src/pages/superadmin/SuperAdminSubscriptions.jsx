import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  TrendingUp,
} from "lucide-react";

const SuperAdminSubscriptions = () => {
  const { token } = useSelector((s) => s.auth);
  const [dashboard, setDashboard] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Try to fetch subscriptions endpoint first
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/super-admin/subscriptions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data.subscriptions || data || []);
          setError(null);
          return;
        }
      } catch (subscriptionErr) {
        console.warn("Subscriptions endpoint failed, trying fallback", subscriptionErr);
      }

      // Fallback to colleges + dashboard data
      try {
        const collegesRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/super-admin/colleges`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (collegesRes.ok) {
          const collegesData = await collegesRes.json();
          setColleges(collegesData.colleges || []);
          setError(null);
          return;
        }
      } catch (collegesErr) {
        console.warn("Colleges endpoint failed", collegesErr);
      }

      // Final fallback to dashboard data
      const dashboardResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/super-admin/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!dashboardResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await dashboardResponse.json();
      setDashboard(data);

      // Extract subscriptions from dashboard if available
      if (data.subscriptions && Array.isArray(data.subscriptions)) {
        setSubscriptions(data.subscriptions);
      } else if (data.subscriptionPlans && Array.isArray(data.subscriptionPlans)) {
        // Use dashboard subscription plans with better field mapping
        const mappedPlans = data.subscriptionPlans.map((plan) => ({
          _id: plan._id || plan.planName,
          planName: plan._id || plan.planName,
          status: "active",
          amount: plan.totalAmount || 0,
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          collegeName: `${plan._id} Plan Subscribers`,
          collegeId: plan._id,
          count: plan.count || 0,
        }));
        setSubscriptions(mappedPlans);
      } else {
        setSubscriptions([]);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      setSubscriptions([]);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "expired":
        return "text-red-600 bg-red-50";
      case "trial":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-4 h-4" />;
      case "expired":
        return <AlertCircle className="w-4 h-4" />;
      case "trial":
        return <Clock className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="space-y-3 mt-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Use colleges as fallback for subscription display
  const displayData = subscriptions.length > 0
    ? subscriptions
    : colleges.map((c) => ({
        _id: c._id,
        collegeName: c.name,
        collegeId: c._id,
        planName: c.planName || "basic",
        status: c.subscriptionStatus || "trial",
        amount: 0,
        endDate: c.subscriptionEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }));

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Subscriptions</h1>
        <p className="text-slate-600 mt-1">Manage all college subscriptions</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                  College
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                  Valid Till
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <p className="text-slate-500">No subscriptions found</p>
                  </td>
                </tr>
              ) : (
                displayData.map((sub) => {
                  // Handle collegeName (might be object or string)
                  const collegeName = typeof sub.collegeName === "object"
                    ? sub.collegeName?.name || "Unknown College"
                    : sub.collegeName;

                  // Handle collegeId (might be object or string)
                  const collegeId = typeof sub.collegeId === "object"
                    ? sub.collegeId?._id || sub.collegeId?.id || "N/A"
                    : sub.collegeId;

                  return (
                  <tr key={sub._id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{collegeName}</p>
                      <p className="text-xs text-slate-500">{collegeId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900 capitalize">
                        {sub.planName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          sub.status
                        )}`}
                      >
                        {getStatusIcon(sub.status)}
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {sub.amount > 0 ? `₹${(sub.amount / 100).toFixed(2)}` : "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {sub.endDate
                          ? new Date(sub.endDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </td>
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-600">Active Subscriptions</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {displayData.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-600">Expired Subscriptions</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {displayData.filter((s) => s.status === "expired").length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-600">Trial Subscriptions</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {displayData.filter((s) => s.status === "trial").length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSubscriptions;
