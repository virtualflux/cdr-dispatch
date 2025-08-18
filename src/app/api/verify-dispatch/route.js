// export async function POST(request) {
//   try {
//     const { id, enrolleeId } = await request.json();

//     if (!id || !enrolleeId) {
//       return new Response(
//         JSON.stringify({ success: false, message: "id and enrolleeId are required" }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

   
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/clearline/enrollees/cdr/verify-dispatch`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, enrolleeId }),
//       }
//     );

//     const contentType = response.headers.get("content-type");
//     if (!contentType?.includes("application/json")) {
//       const text = await response.text();
//       return new Response(
//         JSON.stringify({ success: false, message: "Non-JSON response", details: text }),
//         { status: 500, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     const data = await response.json();
//     return new Response(JSON.stringify(data), { status: response.status, headers: { "Content-Type": "application/json" } });

//   } catch (err) {
//     return new Response(
//       JSON.stringify({ success: false, message: err.message || "Internal server error" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }
