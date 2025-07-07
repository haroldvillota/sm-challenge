export type AttendanceType = "presente" | "representado" | "ausente";

export interface Attendee {
	unit: string;
	owner: string;
	coefficient: number;
	attendanceType: AttendanceType;
}

export interface Clause {
	number: string;
	title: string;
	content: string;
}

export interface MeetingRecord {
	id: string;
	title: string;
	introduction: string;
	attendees: Attendee[];
	clauses: Clause[];
}

export interface Chunk {
	id: string; // Formato: `meetingId-chunkType-[clauseId]-[index]`
	meetingRecordId: string;
	chunkType: string; //'introduction' | 'clause' | 'clause-part';
	clauseId?: string;
	content: string;
	metadata: {
		keywords: string[];
	};
}
