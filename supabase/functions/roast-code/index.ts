import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RoastRequest {
  code: string;
  roastLevel: 'mild' | 'medium' | 'brutal';
}

interface RoastResponse {
  score: number;
  verdict: string;
  roast: string;
  compliment: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { code, roastLevel }: RoastRequest = await req.json();

    if (!code || !code.trim()) {
      return new Response(
        JSON.stringify({ error: 'Code is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const roastInstructions = {
      mild: 'Be constructive and friendly, with light humor. Focus on improvement.',
      medium: 'Be witty and moderately harsh. Point out clear issues with some humor.',
      brutal: 'Be ruthlessly honest and savage. No holds barred comedy roast.',
    };

    const prompt = `You are a savage but insightful code reviewer performing a comedy roast of someone's code.

Roast level: ${roastLevel.toUpperCase()}
Instructions: ${roastInstructions[roastLevel]}

Analyze this code and provide a roast in JSON format with these exact fields:
- score: A number from 1-10 (10 being perfect code)
- verdict: A savage one-liner summary (max 15 words)
- roast: A funny, specific roast about the code quality, patterns, or practices (3-5 sentences)
- compliment: One genuine thing they did well (1-2 sentences)

Code to roast:
\`\`\`
${code}
\`\`\`

Return ONLY valid JSON, nothing else.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate roast' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const geminiData = await geminiResponse.json();
    const content = geminiData.candidates[0].content.parts[0].text;

    let roastData: RoastResponse;
    try {
      roastData = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        roastData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON from response');
      }
    }

    return new Response(
      JSON.stringify(roastData),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
