import * as z from 'zod';

const SchemaSelectForm = z.object({
	1: z.object({
		label: z.string(),
		value: z.string()
	}),
	2: z.object({
		label: z.string(),
		value: z.string()
	}),
	3: z.object({
		label: z.string(),
		value: z.string()
	}),
	4: z.object({
		label: z.string(),
		value: z.string()
	}),
	5: z.object({
		label: z.string(),
		value: z.string()
	}),
	6: z
		.object({
			label: z.string(),
			value: z.string()
		})
		.nullable() // for handling null value when clearing options via clicking "x"
});
export default SchemaSelectForm;
