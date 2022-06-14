import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { styled } from '@stitches/react';

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
	all: 'unset',

	// Flex
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',

	// Border & Paddings
	boxSizing: 'border-box',
	border: '1px solid $primaryBase',
	borderRadius: 3,

	// Colors
	backgroundColor: 'white',

	// Others
	cursor: 'pointer',

	'&[data-state="indeterminate"]': {
		borderColor: '$primaryBase',
		backgroundColor: '$primaryBase'
	},

	// Variants
	variants: {
		variant: {
			default: {
				borderColor: '$primaryBase',
				backgroundColor: 'transparent',
				'&[data-state="checked"]': { backgroundColor: '$primaryBase' },
				'&:disabled': {
					borderColor: '$primary100',
					'&[data-state="checked"]': {
						backgroundColor: '$primary100'
					}
				}
			},
			error: {
				borderColor: '$dangerBase',
				'&[data-state="checked"]': {
					backgroundColor: '$dangerBase'
				},
				'&:disabled': {
					borderColor: '$primary100',
					'&[data-state="checked"]': {
						backgroundColor: '$primary100'
					}
				}
			}
		}
	},

	defaultVariants: {
		variant: 'default'
	}
});
const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',

	color: '$white'
});

export { StyledCheckbox, StyledIndicator };
