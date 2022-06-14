import ReactDatePicker from 'react-datepicker';

import Flex from 'components/Primitives/Flex';
import { styled } from 'styles/stitches/stitches.config';

const DatePickerStyles = styled(Flex, {
	'.react-datepicker_input-Container': {
		width: '100%'
	},

	'.react-datepicker-ignore-onclickoutside': {
		border: '1px solid black',
		boxShadow: 'black'
	},

	'.onclickoutside': {
		border: '1px solid black',
		boxShadow: 'black'
	},

	'.react-datepicker__month-container': {
		width: '518px'
	},

	'.container-selected': {
		border: '1px solid black',
		boxShadow: 'black'
	}
});

const StyledDatePicker = styled(ReactDatePicker, {
	width: '520px',
	height: '56px',
	marginBottom: '16px',
	border: '1px solid #A9B3BF',
	boxShadow: '#A9B3BF',
	padding: '18px 48px 16px 16px',
	borderRadius: '4px'
});

export { DatePickerStyles, StyledDatePicker };
