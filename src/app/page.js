// "use client";

// import { useState } from "react";

// export default function CodeVerificationPage() {
//   const [code, setCode] = useState(""); // code entered in initial verification
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [drugs, setDrugs] = useState(null);
//   const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

//   // Modal state
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [enrolleeIdInput, setEnrolleeIdInput] = useState(""); // input in modal
//   const [modalLoading, setModalLoading] = useState(false);
//   const [currentEnrollee, setCurrentEnrollee] = useState(null); // store current enrollee info

//   // Verify code
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setDrugs(null);
//     setDispatchConfirmed(false);

//     try {
//       const res = await fetch("/api/verify-code", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Invalid code");

//       setDrugs(data.data.drugs);
//       setCurrentEnrollee(data.data); // store the enrollee for modal
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Confirm dispatch
//   const confirmDispatch = async () => {
//     if (!currentEnrollee) return;
//     setModalLoading(true);

//     try {
//       const payload = {
//         id: currentEnrollee._id, // enrollee unique ID from backend
//         enrolleeId: enrolleeIdInput, // value the dispatch rider entered
//       };

//       console.log("Payload sent:", payload);

//       const res = await fetch("/api/verify-dispatch", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "Could not confirm dispatch");
//       }

//       const data = await res.json();
//       console.log("Dispatch response:", data);

//       if (data.success) {
//         setDispatchConfirmed(true);
//         if (data.data?.drugs) setDrugs(data.data.drugs); // update drugs table
//       } else {
//         alert(data.message || "Dispatch failed");
//       }

//       setIsModalOpen(false);
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
//         <h1 className="text-2xl font-bold text-center mb-6 text-[#082B82]">
//           Drug Pickup Code
//         </h1>

//         {/* Verify Code Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Enter Code"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#082B82] text-black"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#082B82] text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-200"
//           >
//             {loading ? "Verifying..." : "Verify Code"}
//           </button>
//         </form>

//         {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

//         {/* Drugs Table */}
//         {drugs && (
//           <div className="mt-6">
//             <h2 className="text-lg font-semibold text-[#082B82] mb-2">
//               Drugs to Deliver
//             </h2>

//             <div className="overflow-x-auto">
//               <table className="min-w-full border text-sm text-left">
//                 <thead>
//                   <tr className="bg-gray-200 text-black">
//                     <th className="border px-4 py-2">Name</th>
//                     <th className="border px-4 py-2">Dosage</th>
//                     <th className="border px-4 py-2">Duration</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {drugs.map((drug, index) => (
//                     <tr key={index} className="border-b text-black">
//                       <td className="border px-4 py-2">{drug.name}</td>
//                       <td className="border px-4 py-2">
//                         {drug.dosage.value} {drug.dosage.type}
//                       </td>
//                       <td className="border px-4 py-2">
//                         {drug.duration.value} {drug.duration.type}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {!dispatchConfirmed ? (
//               <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="mt-6 w-full bg-[#082B82] text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-200"
//               >
//                 Confirm Dispatch
//               </button>
//             ) : (
//               <p className="mt-6 text-center font-bold  text-[#082B82]">
//                 Dispatch Confirmed Successfully!!
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-96">
//             <h2 className="text-lg font-semibold mb-4">
//               To confirm the dispatch, enter Enrollee ID
//             </h2>

//             <input
//               type="text"
//               value={enrolleeIdInput}
//               onChange={(e) => setEnrolleeIdInput(e.target.value)}
//               placeholder="Enter Enrollee ID"
//               className="border px-3 py-2 w-full rounded mb-4"
//             />

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-white text-[#082B82] px-4 py-2 rounded  "
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDispatch}
//                 disabled={modalLoading}
//                 className="bg-[#082B82] text-white px-4 py-2 rounded  "
//               >
//                 {modalLoading ? "Confirming..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function CodeVerificationPage() {
  const [code, setCode] = useState("");  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drugs, setDrugs] = useState(null);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Verify code
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDrugs(null);
    setDispatchConfirmed(false);

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid code");

      setDrugs(data.data.drugs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Confirm dispatch straight up
  const confirmDispatch = () => {
    setDispatchConfirmed(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#082B82]">
          Drug Pickup Code
        </h1>

        {/* Verify Code Form */}
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

        {/* Drugs Table */}
        {drugs && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#082B82] mb-2">
              Drugs to Deliver
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm text-left">
                <thead>
                  <tr className="bg-gray-200 text-black">
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Dosage</th>
                    <th className="border px-4 py-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {drugs.map((drug, index) => (
                    <tr key={index} className="border-b text-black">
                      <td className="border px-4 py-2">{drug.name}</td>
                      <td className="border px-4 py-2">
                        {drug.dosage.value} {drug.dosage.type}
                      </td>
                      <td className="border px-4 py-2">
                        {drug.duration.value} {drug.duration.type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!dispatchConfirmed ? (
              <button
                onClick={confirmDispatch}
                className="mt-6 w-full bg-[#082B82] text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-200"
              >
                Confirm Dispatch
              </button>
            ) : (
              <p className="mt-6 text-center font-bold text-[#082B82]">
                Dispatch Confirmed Successfully!!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}