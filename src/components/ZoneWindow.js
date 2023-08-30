import React from 'react';
import Draggable from 'react-draggable';
import '../styles/ZoneWindow.css';

/**
 * List of predefined colors with their corresponding codes and names.
 * @type {Array<Object>}
 */

const colorList = [
    { code: '#0000FF', name: 'Blue' },
    { code: '#008000', name: 'Green' },
    { code: '#FF0000', name: 'Red' },
    { code: '#FFA500', name: 'Orange' },
    { code: '#800080', name: 'Purple' },
    { code: '#00FFFF', name: 'Cyan' },
    { code: '#FF00FF', name: 'Magenta' },
    { code: '#FFFF00', name: 'Yellow' },
    { code: '#808080', name: 'Gray' },
    { code: '#FFC0CB', name: 'Pink' }
];

/**
 * ZoneWindow component for displaying file upload, criteria selection, and color selection.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.handleFileUpload - Function to handle file uploads.
 * @param {Function} props.handleColorChange - Function to handle color changes.
 * @param {Function} props.handleCriteriaChange - Function to handle criteria changes.
 * @param {Array<string>} props.criteriaList - List of available criteria.
 * @returns {JSX.Element} ZoneWindow component JSX element.
 */

const ZoneWindow = ({ handleFileUpload, handleColorChange, handleCriteriaChange, criteriaList}) => {

    /**
     * Handles local file upload event.
     *
     * @function
     * @param {Event} event - File upload event.
     * @returns {void}
     */
    const handleLocalFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        handleFileUpload(uploadedFile);
    };

    /**
     * Handles color change event.
     *
     * @function
     * @param {Event} event - Color change event.
     * @returns {void}
     */
    const handleColorChangeInternal = (event) => {
        const selectedColorCode = event.target.value;
        const selectedColor = colorList.find(color => color.code === selectedColorCode);

        if (selectedColor) {
            // Valid color code
            handleColorChange(selectedColorCode);
        } else {
            console.log("Selected color not found in colorList");
        }
    };


    /**
     * Handles criteria change event.
     *
     * @function
     * @param {Event} event - Criteria change event.
     * @returns {void}
     */
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
                {criteriaList.length > 0 ? (
                    <select
                        className="form-select form-select-sm"
                        onChange={handleCriteriaChangeInternal}
                        aria-label=".form-select-sm example"
                    >
                        <option value="">Open this select menu</option>
                        {criteriaList.map((criteria) => (
                            <option key={criteria} value={criteria}>
                                {criteria}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p>No criteria available</p>
                )}

                <h3>Zone Colors:</h3>
                <select
                    className="form-select form-select-sm"
                    onChange={handleColorChangeInternal}
                    aria-label=".form-select-sm example"
                >
                    <option value="">Open this select menu</option>
                    {colorList.map((color) => {
                        // console.log(`Color Code: ${color.code}, Color Name: ${color.name}`);
                        return (
                            <option key={color.code} value={color.code}>
                                {color.name}
                            </option>
                        );
                    })}
                </select>

            </div>
        </Draggable>
    );
};


export default ZoneWindow;
