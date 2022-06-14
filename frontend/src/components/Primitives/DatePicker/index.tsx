import { ReactDatePickerProps } from 'react-datepicker';

import { DatePickerStyles, StyledDatePicker } from 'components/Primitives/DatePicker/styles';
import 'react-datepicker/dist/react-datepicker.css';

type Props = Partial<ReactDatePickerProps> & {
	date: Date;
	onChange: (date: Date) => void;
	placeholder?: string;
};

const DatePicker = ({ date, onChange, placeholder, ...props }: Props) => {
	return (
		<DatePickerStyles>
			<StyledDatePicker
				{...props}
				selected={date}
				placeholderText={placeholder ?? 'Select date'}
				onChange={onChange}
			/>
		</DatePickerStyles>
	);
};

DatePicker.defaultProps = {
	placeholder: undefined
};

export { DatePicker };
