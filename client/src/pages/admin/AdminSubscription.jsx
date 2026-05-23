import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Zap,
  Users,
  Loader,
  Sparkles,
} from "lucide-react";

const AdminSubscription = () => {
  const { token } = useSelector((s) => s.auth);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, plansRes, historyRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/subscription/college-subscription`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/subscription/plans`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/subscription/payment-history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setCurrentSubscription(subData.subscription);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData.plans);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setPaymentHistory(historyData.payments);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      setProcessingPayment(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/subscription/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ planName: planId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }

      const data = await response.json();

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: data.razorpayKey,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Campus CV - Subscription",
          description: `Upgrade to ${planId.toUpperCase()} Plan`,
          order_id: data.order.id,
          handler: async (response) => {
            // Verify payment
            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/subscription/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              }
            );

            if (verifyResponse.ok) {
              alert("Payment successful! Subscription updated.");
              fetchData(); // Refresh data
            } else {
              alert("Payment verification failed");
            }
            setProcessingPayment(false);
          },
          prefill: {
            email: "college@example.com",
          },
          theme: {
            color: "#7c3aed",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      alert(err.message);
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !currentSubscription) {
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

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Subscription Management</h1>
        <p className="text-slate-500 mt-1">Manage your college's subscription plan</p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold text-slate-900 mb-6 text-lg">Current Plan</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Plan Name</p>
                  <p className="text-2xl font-bold text-purple-600 capitalize">
                    {currentSubscription.planName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {currentSubscription.status === "active" ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-green-700">Active</span>
                      </>
                    ) : currentSubscription.status === "expired" ? (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-semibold text-red-700">Expired</span>
                      </>
                    ) : currentSubscription.status === "trial" ? (
                      <>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-semibold text-blue-700">Trial</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                        <span className="font-semibold text-slate-700">Inactive</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Valid Until</p>
                  <p className="font-semibold text-slate-900">
                    {currentSubscription.endDate
                      ? new Date(currentSubscription.endDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {currentSubscription.daysUntilExpiry && currentSubscription.daysUntilExpiry > 0 && (
                    <p className="text-xs text-slate-600 mt-1">
                      {currentSubscription.daysUntilExpiry} days remaining
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 mb-6 text-lg">Usage</h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Students
                    </p>
                    <span className="font-semibold text-slate-900">
                      {currentSubscription.studentLimit === 999999
                        ? "Unlimited"
                        : currentSubscription.studentLimit}
                    </span>
                  </div>
                  {currentSubscription.studentLimit !== 999999 && (
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (currentSubscription.currentStudentCount /
                              currentSubscription.studentLimit) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      AI Usage
                    </p>
                    <span className="font-semibold text-slate-900">
                      {currentSubscription.aiUsageCount} /{" "}
                      {currentSubscription.aiUsageLimit === 99999
                        ? "Unlimited"
                        : currentSubscription.aiUsageLimit}
                    </span>
                  </div>
                  {currentSubscription.aiUsageLimit !== 99999 && (
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (currentSubscription.aiUsageCount /
                              currentSubscription.aiUsageLimit) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-3">Available Features</p>
                  <div className="space-y-2">
                    {Object.entries(currentSubscription.features).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center gap-2">
                        {enabled ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-slate-400" />
                        )}
                        <span
                          className={`text-xs ${
                            enabled ? "text-slate-700" : "text-slate-500 line-through"
                          }`}
                        >
                          {feature.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border-2 p-6 transition-all ${
                currentSubscription?.planName === plan.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-slate-200 bg-white hover:shadow-lg"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 capitalize">{plan.id} Plan</h3>
                  <p className="text-sm text-slate-600">{plan.name}</p>
                </div>
                {currentSubscription?.planName === plan.id && (
                  <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Current
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-slate-900">
                  ₹{(plan.amount / 100).toFixed(0)}
                </div>
                <p className="text-sm text-slate-600">per year</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-slate-700">
                    {plan.studentLimit === 999999 ? "Unlimited" : plan.studentLimit} Students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-slate-700">
                    {plan.aiUsageLimit === 99999 ? "Unlimited" : plan.aiUsageLimit} AI Requests
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-6">
                <p className="text-xs font-semibold text-slate-700 mb-3">Features</p>
                <div className="space-y-2">
                  {Object.entries(plan.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center gap-2">
                      {enabled ? (
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      ) : (
                        <div className="w-3 h-3 border border-slate-300 rounded-full"></div>
                      )}
                      <span className="text-xs text-slate-600">
                        {feature.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {currentSubscription?.planName === plan.id ? (
                <button
                  disabled
                  className="w-full py-2 px-4 bg-slate-100 text-slate-600 rounded-lg font-medium cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={processingPayment}
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingPayment ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Upgrade Now
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment History</h2>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                      Order ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment._id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 capitalize">
                        {payment.planName}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        ₹{(payment.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {payment.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : payment.status === "pending" ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-1 rounded-full text-xs font-semibold">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        ) : payment.status === "failed" ? (
                          <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold">
                            <AlertCircle className="w-3 h-3" />
                            Failed
                          </span>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono text-xs">
                        {payment.razorpayOrderId.substring(0, 15)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscription;
