import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { drug1, drug2, key, baseUrl, model } = await req.json();

  if (!key) {
    return NextResponse.json({ error: 'No API key' }, { status: 400 });
  }

  const prompt = `你是一位临床药学专家。请判断以下两种药物是否存在相互作用：

药物1：${drug1}
药物2：${drug2}

请严格用 JSON 格式回答：
{
  "hasInteraction": boolean,
  "severity": "high" | "medium" | "low",
  "description": "相互作用描述",
  "recommendation": "用药建议"
}

如果不存在已知相互作用，设 hasInteraction 为 false。
重要：你的回答仅供参考，必须建议用户咨询医生或药师。仅输出 JSON。`;

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `API ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? '{}');

    if (!parsed.hasInteraction) {
      return NextResponse.json({ interaction: null });
    }

    return NextResponse.json({
      interaction: {
        drug1,
        drug2,
        severity: parsed.severity,
        description: parsed.description,
        recommendation: parsed.recommendation,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
