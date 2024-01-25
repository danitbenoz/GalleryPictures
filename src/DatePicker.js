import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({ selectedDate, handleDateChange }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="yyyy-MM-dd"
      placeholderText="Select a date"
      fixedHeight
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={15}
    />
  );
};

export default CustomDatePicker;
