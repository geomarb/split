import React, { useState } from "react";
import Select, { components } from "react-select";
import { styled } from "../../stitches.config";

interface SelectBoxProps {
  // eslint-disable-next-line react/require-default-props
  title?: string;
  // eslint-disable-next-line react/require-default-props
  type?: "hour" | "times" | "timesBefore" | "days";
}
const { ValueContainer, Placeholder } = components;

// const [hourOptions, sethourOptions] = useState("");
const hourOptions = [
  { value: "00:00 AM", label: "00:00 AM" },
  { value: "01:00 AM", label: "01:00 AM", color: "#00B8D9" },
  { value: "02:00 AM", label: "02:00 AM", color: "#00B8D9" },
  { value: "03:00 AM", label: "03:00 AM", color: "#00B8D9" },
  { value: "04:00 AM", label: "04:00 AM", color: "#00B8D9" },
  { value: "05:00 AM", label: "05:00 AM", color: "#00B8D9" },
  { value: "06:00 AM", label: "06:00 AM", color: "#00B8D9" },
  { value: "07:00 AM", label: "07:00 AM", color: "#00B8D9" },
  { value: "08:00 AM", label: "08:00 AM", color: "#00B8D9" },
  { value: "09:00 AM", label: "09:00 AM", color: "#00B8D9" },
  { value: "10:00 AM", label: "10:00 AM", color: "#00B8D9" },
  { value: "11:00 AM", label: "11:00 AM", color: "#00B8D9" },
  { value: "12:00 AM", label: "12:00 AM", color: "#00B8D9" },
  { value: "13:00 PM", label: "13:00 PM", color: "#00B8D9" },
  { value: "14:00 PM", label: "14:00 PM", color: "#00B8D9" },
  { value: "15:00 PM", label: "15:00 PM", color: "#00B8D9" },
  { value: "16:00 PM", label: "16:00 PM", color: "#00B8D9" },
  { value: "17:00 PM", label: "17:00 PM", color: "#00B8D9" },
  { value: "18:00 PM", label: "18:00 PM", color: "#00B8D9" },
  { value: "19:00 PM", label: "19:00 PM", color: "#00B8D9" },
  { value: "20:00 PM", label: "20:00 PM", color: "#00B8D9" },
  { value: "21:00 PM", label: "21:00 PM", color: "#00B8D9" },
  { value: "22:00 PM", label: "22:00 PM", color: "#00B8D9" },
  { value: "23:00 PM", label: "23:00 PM", color: "#00B8D9" },
];

const timesOptions = [
  { value: "Days", label: "Days", rating: "safe" },
  { value: "Weeks", label: "Weeks", rating: "good" },
  { value: "Months", label: "Months", rating: "wild" },
];

const timesBeforeOptions = [
  { value: "Minutes", label: "Minutes", rating: "wild" },
  { value: "Days", label: "Days", rating: "safe" },
  { value: "Weeks", label: "Weeks", rating: "good" },
];

const daysOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },
  { value: "14", label: "14" },
  { value: "15", label: "15" },
  { value: "16", label: "16" },
  { value: "17", label: "17" },
  { value: "18", label: "18" },
  { value: "19", label: "19" },
  { value: "20", label: "20" },
  { value: "21", label: "21" },
  { value: "22", label: "22" },
  { value: "23", label: "23" },
  { value: "24", label: "24" },
  { value: "25", label: "25" },
  { value: "26", label: "26" },
  { value: "27", label: "27" },
  { value: "28", label: "28" },
  { value: "29", label: "29" },
  { value: "30", label: "30" },
  { value: "31", label: "31" },
];

const CustomValueContainer = ({ children, ...props }) => {
  return (
    <ValueContainer {...props}>
      <Placeholder {...props} isFocused={props.isFocused}>
        {props.selectProps.placeholder}
      </Placeholder>
      {React.Children.map(children, (child) =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

const StyledSelect = styled(Select, {
  ".select__menu": {
    // SELECTED MENU
    marginTop: 0,
    borderRadius: 12,
    width: 252,
    padding: "8px, 0px, 8px, 0px",
    boxSizing: "border-box",
  },

  ".select__control ": {
    // UNSELECTED INPUT CONTAINER
    border: "1px solid #A9B3BF",
    width: 252,
    boxSizing: "border-box",
  },

  ".css-1pahdxg-control:hover": {
    // SELECTED INPUT CONTAINER HOVER
    borderColor: "#434D5A",
    boxShadow: "#A9B3BF",
    boxSizing: "border-box",
  },

  ".css-1pahdxg-control": {
    // SELECTED INPUT CONTAINER
    boxShadow: "0px 0px 0px 1px #434D5A",
    width: 252,
    border: "1px solid #434D5A",
    height: "56px",
    borderRadius: "4px",
    boxSizing: "border-box",
  },

  ".css-9gakcf-option": {
    // SELECTED ITEM MENU
    backgroundColor: "#2F3742",
    color: "#FFFFFF",
    boxSizing: "border-box",
  },

  ".css-1n7v3ny-option ": {
    // SELECTED MENU HOVER
    backgroundColor: "#2F3742",
    color: "#FFFFFF",
    boxSizing: "border-box",
  },

  ".css-1okebmr-indicatorSeparator": {
    // Separator
    backgroundColor: "white",
  },
});

const SelectBox: React.FC<SelectBoxProps> = ({ type, title }) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow

  const [selectedValue] = useState([{ value: [] }]);

  // handle onChange event of the dropdown

  const getSelectOption = () => {
    if (type === "hour") return hourOptions;
    if (type === "times") return timesOptions;
    if (type === "timesBefore") return timesBeforeOptions;
    return daysOptions;
  };

  const tryThis = getSelectOption();

  return (
    <>
      <StyledSelect
        // value={tryThis.find((obj) => selectedValue[0].value.includes(obj.value))} // set selected value
        options={tryThis} // set list of the data
        onChange={(evt) => console.log(evt)}
        components={{
          ValueContainer: CustomValueContainer,
        }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        placeholder={title}
        styles={{
          input: (provided) => ({
            ...provided,
            height: "56px",
            marginBottom: 0,
            boxSizing: "border-box",
          }),
          container: (provided) => ({
            ...provided,
            marginTop: 0,
            width: "252px",
            boxSizing: "border-box",
            height: "56px",
          }),
          valueContainer: (provided) => ({
            ...provided,
            overflow: "visible",
            height: "56px",
          }),
          placeholder: (provided, state) => ({
            ...provided,
            position: "absolute",
            top: state.hasValue || state.selectProps.inputValue ? 0 : "30%",
            transition: "top 0.1s, font-size 0.1s",
            fontSize: (state.hasValue || state.selectProps.inputValue) && 16,
          }),
          singleValue: (provided) => ({
            ...provided,

            marginTop: 20,
            height: "56px",
          }),
        }}
      />
      <div>
        {selectedValue && (
          <div style={{ marginTop: 20, lineHeight: "25px" }}>
            <div>
              <b>Selected Value: </b> {JSON.stringify(selectedValue, null, 2)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SelectBox;
