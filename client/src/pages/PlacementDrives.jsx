import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Briefcase,
  Calendar,
  MapPin,
  TrendingUp,
  AlertCircle,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

const PlacementDrives = () => {
  const { token } = useSelector((s) => s.auth);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [myDrives, setMyDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [registering, setRegistering] = useState({});

  useEffect(() => {
    fetchDrives();
  }, [token]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const [upcomingRes, myRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/placement-drives/student/upcoming`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/placement-drives/student/my-drives`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (upcomingRes.ok) {
        const data = await upcomingRes.json();
        setUpcomingDrives(data.drives || []);
      }

      if (myRes.ok) {
        const data = await myRes.json();
        setMyDrives(data.drives || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (driveId) => {
    try {
      setRegistering((prev) => ({ ...prev, [driveId]: true }));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/placement-drives/${driveId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to register");
      }

      toast.success("Registered successfully!");
      fetchDrives();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRegistering((prev) => ({ ...prev, [driveId]: false }));
    }
  };

  const DriveCard = ({ drive, isRegistered }) => {
    const daysLeft = Math.ceil(
      (new Date(drive.registrationDeadline) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{drive.companyName}</h3>
            <p className="text-sm text-slate-600 mt-1">{drive.jobTitle}</p>
          </div>
          {drive.status === "completed" ? (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              Completed
            </span>
          ) : isRegistered ? (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Registered
            </span>
          ) : daysLeft <= 0 ? (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
              Closed
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
              Open
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2 text-slate-700">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>
              <strong>CTC:</strong> ₹
              {drive.ctc?.base ? (drive.ctc.base / 100000).toFixed(1) : "N/A"} LPA
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Users className="w-4 h-4 text-blue-600" />
            <span>
              <strong>Positions:</strong> {drive.noOfPositions}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-green-600" />
            <span>
              <strong>Drive:</strong> {new Date(drive.driveDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>
              <strong>Location:</strong> {drive.location}
            </span>
          </div>
        </div>

        {!isRegistered && daysLeft > 0 && (
          <div className="border-t border-slate-200 pt-4">
            {daysLeft <= 3 && (
              <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-700">
                  <strong>{daysLeft} day{daysLeft !== 1 ? "s" : ""} left</strong> to register
                </p>
              </div>
            )}
            <button
              onClick={() => handleRegister(drive._id)}
              disabled={registering[drive._id]}
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registering[drive._id] ? "Registering..." : "Register Now"}
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Briefcase className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Placement Drives</h1>
        </div>
        <p className="text-slate-600">Discover and register for placement opportunities</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "upcoming"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Upcoming Drives ({upcomingDrives.length})
        </button>
        <button
          onClick={() => setActiveTab("my-drives")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "my-drives"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          My Drives ({myDrives.length})
        </button>
      </div>

      {/* Drives Grid */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingDrives.length === 0 ? (
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900">No drives available</h3>
              <p className="text-sm text-slate-600 mt-1">
                Check back soon for new placement opportunities
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingDrives.map((drive) => (
                <DriveCard key={drive._id} drive={drive} isRegistered={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "my-drives" && (
        <div className="space-y-4">
          {myDrives.length === 0 ? (
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900">No registrations yet</h3>
              <p className="text-sm text-slate-600 mt-1">
                Register for drives from the upcoming drives section
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myDrives.map((drive) => (
                <DriveCard key={drive._id} drive={drive} isRegistered={true} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlacementDrives;
