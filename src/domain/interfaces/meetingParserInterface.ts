import type { MeetingRecord } from "@/domain/models/meetingRecordModel";

export interface MeetingParser {
	parse(text: string): Promise<{ record: MeetingRecord; prompt: string }>;
}
