import React from 'react';
import Draggable from 'react-draggable';
import '../styles/ZoneWindow.css';

const colorList = [
    '#0000FF', // Blue
    '#008000', // Green
    '#FF0000', // Red
    '#FFA500', // Orange
    '#800080', // Purple
    '#00FFFF', // Cyan
    '#FF00FF', // Magenta
    '#FFFF00', // Yellow
    '#808080', // Gray
    '#FFC0CB'  // Pink
];

const criteriaList = [
    'foaf:Person',
    'foaf:Organization',
];


const ZoneWindow = ({ handleFileUpload, handleColorChange, handleCriteriaChange }) => {

    const handleLocalFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        handleFileUpload(uploadedFile);
    };

    const handleColorChangeInternal = (event) => {
        const selectedColor = event.target.value;
        handleColorChange(selectedColor);
        console.log("color list", colorList);
    };

    const handleCriteriaChangeInternal = (event) => {
        const selectedCriteria = event.target.value;
        handleCriteriaChange(selectedCriteria);
    };

    return (
        <Draggable>
            <div className="zone-window">

                <h3>File Upload:</h3>
                <div className="input-group mb-3">
                    <input
                        type="file"
                        className="form-control"
                        id="inputGroupFile02"
                        onChange={handleLocalFileUpload}
                    />
                    <label className="input-group-text" htmlFor="inputGroupFile02">
                        Choose File
                    </label>
                </div>

                <h3>Criteria:</h3>
                <select
                    className="form-select form-select-sm"
                    onChange={handleCriteriaChangeInternal}
                    aria-label=".form-select-sm example"
                >
                    <option value="">Open this select menu</option>
                    {criteriaList.map((criteria) => (
                        <option value={criteria}>
                            {criteria}
                        </option>
                    ))}
                </select>


                <h3>Zone Colors:</h3>
                <select
                    className="form-select form-select-sm"
                    onChange={handleColorChangeInternal}
                    aria-label=".form-select-sm example"
                >
                    <option value="">Open this select menu</option>
                    {colorList.map((colorCode) => (
                        <option value={colorCode}>
                            {colorCode}
                        </option>
                    ))}
                </select>

            </div>
        </Draggable>
    );
};
export { colorList, criteriaList };
export default ZoneWindow;
