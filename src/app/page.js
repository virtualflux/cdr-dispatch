"use client";

import { useState } from "react";

export default function CodeVerificationPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drugs, setDrugs] = useState(null);
  const [delivered, setDelivered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDrugs(null);
    setDelivered(false);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid code");
      }

      setDrugs(data.drugs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markDelivered = async () => {
    try {
      const res = await fetch(
        "/api/confirm-delivery",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      if (!res.ok) throw new Error("Could not confirm delivery");

      setDelivered(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#082B82]">Drug Pickup Code</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#082B82] text-black"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#082B82] text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-200"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {drugs && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#082B82] mb-2">Drugs to Deliver</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm text-left">
                <thead>
                  <tr className="bg-gray-200 text-black">
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Dosage</th>
                    <th className="border px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {drugs.map((drug, index) => (
                    <tr key={index} className="border-b text-black">
                      <td className="border px-4 py-2">{drug.name}</td>
                      <td className="border px-4 py-2">{drug.dosage}</td>
                      <td className="border px-4 py-2">{drug.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!delivered ? (
              <button
                onClick={markDelivered}
                className="mt-6 w-full bg-[#082B82] text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-200 "
              >
                Mark as Delivered
              </button>
            ) : (
              <p className="mt-6 text-center text-green-700 font-semibold">
                ✅ Delivered
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
