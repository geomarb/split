import React, { useState } from "react";
import Select, { components } from "react-select";
import { styled } from "../../stitches.config";
import { hourOptions, timesOptions, timesBeforeOptions, daysOptions } from "./SelectData";

interface SelectBoxProps {
  // eslint-disable-next-line react/require-default-props
  title?: string;
  // eslint-disable-next-line react/require-default-props
  type?: "hour" | "times" | "timesBefore" | "days";
}
const { ValueContainer, Placeholder } = components;

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
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelectValeu = (getSelectOption: { value: React.SetStateAction<number> }) => {
    setSelectedValue(getSelectOption.value);
  };

  const getSelectOption = () => {
    if (type === "hour") return hourOptions;
    if (type === "times") return timesOptions;
    if (type === "timesBefore") return timesBeforeOptions;
    return daysOptions;
  };

  return (
    <StyledSelect
      value={getSelectOption().find((obj) => obj.value === selectedValue)} // set selected value
      options={getSelectOption()} // set list of the data
      onChange={handleSelectValeu} // assign onChange function
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
  );
};

export default SelectBox;
