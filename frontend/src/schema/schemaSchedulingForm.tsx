import * as z from 'zod';

const SchemaSchedulingForm = z.object({
	form: z.object({
		lalbe: z.string(),
		value: z.string()
	}),
	to: z.object({
		lalbe: z.string(),
		value: z.string()
	}),
	// Repeat Selects
	timeRange: z
		.object({
			lalbe: z.string(),
			value: z.string()
		})
		.nullable(),
	timeUnit: z
		.object({
			lalbe: z.string(),
			value: z.string()
		})
		.nullable(),
	// Reminder Selects
	reminderTimeRange: z
		.object({
			lalbe: z.string(),
			value: z.string()
		})
		.nullable(),
	reminderTimeUnit: z
		.object({
			lalbe: z.string(),
			value: z.string()
		})
		.nullable()
});

export { SchemaSchedulingForm };
