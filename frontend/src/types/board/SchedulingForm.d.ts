type SchedulingFormType = {
	date: Date;
	form: { label: string; value: string };
	to: { label: string; value: string };
	timeRange?: { label: string; value: string };
	timeUnit?: { label: string; value: string };
	reminderTimeRange?: { label: string; value: string };
	reminderTimeUnit?: { label: string; value: string };
};

export { SchedulingFormType };
