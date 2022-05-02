export const hourOptions = [
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

export const timesOptions = [
  { value: "Days", label: "Days", rating: "safe" },
  { value: "Weeks", label: "Weeks", rating: "good" },
  { value: "Months", label: "Months", rating: "wild" },
];

export const timesBeforeOptions = [
  { value: "Minutes", label: "Minutes", rating: "wild" },
  { value: "Days", label: "Days", rating: "safe" },
  { value: "Weeks", label: "Weeks", rating: "good" },
];

export const daysOptions = [
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

export const optionLength = [
  { value: 1, label: "general" },
  {
    value: 2,
    label: "Evil is the moment when I lack the strength to be true to the Good that compels me.",
  },
  {
    value: 3,
    label:
      "It is now an easy matter to spell out the ethic of a truth: 'Do all that you can to persevere in that which exceeds your perseverance. Persevere in the interruption. Seize in your being that which has seized and broken you.",
  },
];

// let bigOptions = [];
// for (let i = 0; i < 10000; i++) {
// 	bigOptions = bigOptions.concat(colourOptions);
// }

export const groupedOptions = [
  {
    label: "hour",
    options: hourOptions,
  },
  {
    label: "times",
    options: timesOptions,
  },
  {
    label: "timesBefore",
    options: timesBeforeOptions,
  },
  {
    label: "days",
    options: daysOptions,
  },
];

/*  
    ERROR     
    // Unselect Input Container
    border: "1px solid #A9B3BF",
    boxShadow: "0px 0px 0px 2px #FFD8E1",

    VALID@
    // Unselect Input Container
    border: "1px solid #0B7B52",
    boxShadow: "0px 0px 0px 2px #E3FFF5",

    Disabled
    
    isDisabled:"true"

    HELP TEXT
*/
