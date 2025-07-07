export function buildMeetingParsePrompt(text: string): string {
	const prompt = `
    Analiza el siguiente texto de acta de reunión y extrae la información en formato JSON con esta estructura exacta:
{
  "title": string,       // Texto en mayúsculas antes del primer párrafo
  "introduction": string, // Primer párrafo, texto completo sin modificaciones, después del título hasta "ASISTENTES:"
  "attendees": {         // Lista después de "ASISTENTES:" o "REPRESENTADOS:"
    "unit": string,     // ejemplo: PD 3º B GR 169 
    "owner": string,    // ejemplo: A0015
    "coefficient": number,  //ejemplo: 0,24 
    "attendanceType": "PRESENTE"|"REPRESENTADO"|"AUSENTE"
  }[],
  "clauses": {          // Bloques que inician con "PRIMERO:", "SEGUNDO:", etc.
    "number": string,     // ej: PRIMERO
    "title": string,     // Texto después del ordinal (ej: "Aprobación de cuentas")
    "content": string   // Texto completo sin modificaciones desde el titulo de la clausula hasta el siguiente ordinal o fin del documento
  }[]
}

Ejemplo de input:
---
ACTA DE REUNION
DE LA JUNTA DE PROPIETARIOS 
RESIDENCIAL BELICH

Se realizó en el salón principal... (texto introductorio).

ASISTENTES/REPRESENTADOS 
 
Inmueble | Propietario  | Coeficiente agrupado  | PRESENTE/REPRESENTADO 
PA 4º A 
GR 107 A0001 0,24 PRESENTE 
PA 4º C 
GR 101 A0002 0,26 REPRESENTADO 

PRIMERO: Aprobación de cuentas
Se aprueban las cuentas del mes...
SEGUNDO: Pintura fachada
Se asignan €15,000 para...
---

Ejemplo de output esperado:
{
  "title": "ACTA DE REUNION DE LA JUNTA DE PROPIETARIOS RESIDENCIAL BELICH",
  "introduction": "Se realizó en el salón principal...",
  "attendees": [
    { "unit": "PA 4º A GR 107", "owner": "A0001", "coefficient": 0,24, "attendanceType": "PRESENTE" },
    { "unit": "PA 4º C GR 101", "owner": "A0002", "coefficient": 0,26, "attendanceType": "REPRESENTADO" }
  ],
  "clauses": [
    {
      "number": "PRIMERO",
      "title": "Aprobación de cuentas",
      "content": "Se aprueban las cuentas del mes..."
    },
    {
      "number": "SEGUNDO",
      "title": "Pintura fachada",
      "content": "Se asignan €15,000 para..."
    }
  ]
}
---

Texto del acta:
    ${text}
    `;

	return prompt.trim();
}
