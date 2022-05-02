import { styled } from "@stitches/react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Flex from "./Flex";

// CSS Modules, react-datepicker-cssmodules.css
// import "react-datepicker/dist/react-datepicker-cssmodules.css";

const DatePickerStyles = styled(Flex, {
  ".react-datepicker_input-Container": {
    width: "100%",
  },
  ".Datepicker": {
    width: "520px",
    height: "56px",
    marginBottom: "16px",
    border: "1px solid #A9B3BF",
    boxShadow: "#A9B3BF",
    padding: "18px 48px 16px 16px",
    borderRadius: "4px",
  },

  ".react-datepicker-ignore-onclickoutside": {
    border: "1px solid black",
    boxShadow: "black",
  },

  ".onclickoutside": {
    border: "1px solid black",
    boxShadow: "black",
  },

  ".react-datepicker__month-container": {
    width: "518px",
  },

  ".container-selected": {
    border: "1px solid black",
    boxShadow: "black",
  },
});

const DatePickerBox: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <DatePickerStyles>
      <DatePicker
        className="Datepicker"
        placeholderText="Select date"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
    </DatePickerStyles>
  );
};

export default DatePickerBox;
