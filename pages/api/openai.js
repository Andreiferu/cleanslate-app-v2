export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, maxTokens = 500, type = 'general' } = req.body || {};
  
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  // Different system prompts for different use cases
  const systemPrompts = {
    review: 'You are a helpful assistant that crafts concise, empathetic review responses. Keep responses under 100 words.',
    email: 'You are an expert at writing professional yet friendly unsubscribe emails. Be polite but firm.',
    analysis: 'You are a financial advisor helping users optimize their subscriptions. Provide actionable insights.',
    general: 'You are a helpful assistant focused on digital life organization and decluttering.'
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: systemPrompts[type] || systemPrompts.general 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.3,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return res.status(502).json({ 
        error: 'OpenAI API error', 
        status: response.status 
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || 'No response generated';
    
    res.status(200).json({ 
      content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
