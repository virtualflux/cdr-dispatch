export async function POST(req) {
  const body = await req.json();  

  try {
    const res = await fetch(
      "https://a37addef16b2.ngrok-free.app/api/clearline/enrollees/cdr/verify-__dispatch",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error, please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
