import React, { Dispatch, useState } from 'react';

import Icon from 'components/icons/Icon';

import { StyledCheckbox, StyledIndicator } from './styles';

import Flex from '../Flex';
import Text from '../Text';

const getIndeterminateSize = (boxSize: '12' | '16') => {
	if (boxSize === '12') return '8';
	return '10';
};
const Checkbox: React.FC<{
	label: string;
	id: string;
	variant?: 'default' | 'error';
	checked?: boolean | 'indeterminate';
	disabled?: boolean;
	size: '12' | '16';
	setCheckedTerms?: Dispatch<React.SetStateAction<boolean>> | null;
	handleChange?: (value: string) => void;
}> = ({ id, label, variant, size, checked, disabled, handleChange, setCheckedTerms }) => {
	Checkbox.defaultProps = {
		variant: 'default',
		checked: false,
		disabled: false,
		handleChange: undefined,
		setCheckedTerms: null
	};

	const [currentCheckValue, setCurrentCheckValue] = useState<
		boolean | undefined | 'indeterminate'
	>(checked);
	const handleCheckedChange = (isChecked: boolean | 'indeterminate') => {
		if (handleChange) handleChange(id);
		setCurrentCheckValue(isChecked);
		if (setCheckedTerms != null) setCheckedTerms(!!isChecked);
	};

	return (
		<Flex
			css={{
				alignItems: 'center',
				height: '$36',
				width: '100%',
				boxSizing: 'border-box'
			}}
		>
			<Flex>
				<StyledCheckbox
					variant={variant ?? 'default'}
					name={id}
					id={id}
					checked={currentCheckValue}
					disabled={disabled}
					onCheckedChange={handleCheckedChange}
					css={{
						width: `$${size} !important`,
						height: `$${size} !important`
					}}
				>
					<StyledIndicator
						css={{
							'& svg': {
								width:
									currentCheckValue === 'indeterminate'
										? `$${getIndeterminateSize(size)} !important`
										: `$${size} !important`,
								height: `$${size} !important`
							}
						}}
					>
						{currentCheckValue === true && <Icon name="check" />}
						{currentCheckValue === 'indeterminate' && <Icon name="indeterminate" />}
					</StyledIndicator>
				</StyledCheckbox>
			</Flex>
			<Text
				as="label"
				size="sm"
				css={{ paddingLeft: '$8', width: '100%', cursor: 'pointer' }}
				htmlFor={id}
			>
				{label}
			</Text>
		</Flex>
	);
};
export default Checkbox;
