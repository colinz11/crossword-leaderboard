import { Scrubber } from 'react-scrubber';
import { width } from '../formats';
import 'react-scrubber/lib/scrubber.css'

const ScrubberComponent = ({ value, setValue, setState, max }) => {
    const handleScrubStart = (value) => {
        setValue(value);
        setState('Scrub Start');
    }

    const handleScrubEnd = (value) => {
        setValue(value);
        setState('Scrub End');
    }

    const handleScrubChange = (value) => {
        setValue(value);
        setState('Scrub Change');
    }

    return (
        <div className="scrubber-container" style={{ height: '20px', width: width }}>
            <Scrubber
                min={0}
                max={max}
                value={value}
                onScrubStart={handleScrubStart}
                onScrubEnd={handleScrubEnd}
                onScrubChange={handleScrubChange}
            />
        </div>
    );
}

export default ScrubberComponent;