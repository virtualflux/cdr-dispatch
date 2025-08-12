// export async function POST(request) {
//   const { code } = await request.json();

  
//   if (code === "123456") {
//     return new Response(
//       JSON.stringify({
//         drugs: [
//           { name: "Paracetamol", dosage: "500mg", quantity: "2 Packs" },
//           { name: "Amoxicillin", dosage: "250mg", quantity: "1 Pack" },
//           { name: "Zestup", dosage: "1000mg", quantity: "10 Packs" },
//         ],
//       }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   }

//   return new Response(
//     JSON.stringify({ message: "Invalid code or drug not found." }),
//     { status: 404, headers: { "Content-Type": "application/json" } }
//   );
// }

export async function POST(req) {
  const { code } = await req.json();

  try {
    const response = await fetch("https://a37addef16b2.ngrok-free.app/api/clearline/enrollees/cdr/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error, please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}