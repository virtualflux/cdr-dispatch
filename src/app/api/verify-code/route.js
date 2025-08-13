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

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Request body:', body); 
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/clearline/enrollees/cdr/verify-code`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
       
      },
      body: JSON.stringify(body),
    });

    console.log('Response status:', response.status); 
    console.log('Response headers:', Object.fromEntries(response.headers.entries())); 

   
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response:', textResponse);
      return Response.json({ 
        error: 'Server returned non-JSON response',
        details: textResponse 
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('Response data:', data); 
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in verify-code API:', error);
    
    
    if (error instanceof SyntaxError) {
      return Response.json({ 
        error: 'JSON parsing error',
        message: error.message 
      }, { status: 500 });
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return Response.json({ 
        error: 'Network error - unable to reach server',
        message: error.message 
      }, { status: 500 });
    }
    
    return Response.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
