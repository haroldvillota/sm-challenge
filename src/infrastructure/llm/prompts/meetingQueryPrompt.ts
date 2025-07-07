export function buildQueryPrompt(query: string, context: string): string {
	return `
Responde la siguiente pregunta basándote ÚNICAMENTE en el contexto proporcionado.
Si no sabes la respuesta, di "No tengo información sobre eso".

Pregunta: ${query}

Contexto:
${context}
  `.trim();
}
