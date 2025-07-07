export function buildQueryPrompt(query: string, context: string): string {
	return `
Eres un experto en gestión vecinal y administración de comunidades.
Responde la siguiente pregunta únicamente utilizando la información proporcionada en el contexto del acta de la junta.
Si no encuentras una respuesta clara en el contexto, responde: "No tengo información sobre eso".

Pregunta: ${query}

Contexto:
${context}
  `.trim();
}
