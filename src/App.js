import React, { useState } from 'react';
import Gallery from './Gallery';
import CustomDatePicker from './DatePicker';
import './styles.css';

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="App">
            <CustomDatePicker selectedDate={selectedDate} handleDateChange={handleDateChange} />
            <Gallery key={selectedDate.toISOString()} /> {/* Key prop to force re-render */}
        </div>
    );
}

export default App;
