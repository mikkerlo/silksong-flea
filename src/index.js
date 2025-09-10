import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import { Decode } from "./functions.js"
import WindowDrag from "./windowDrag.js"
import "./style.css"

var windowDrag = new WindowDrag()

// List of specific SavedFlea fields to display
const TARGET_FLEA_FIELDS = [
    'SavedFlea_Bone_06',
    'SavedFlea_Dock_16',
    'SavedFlea_Bone_East_05',
    'SavedFlea_Bone_East_17b',
    'SavedFlea_Ant_03',
    'SavedFlea_Greymoor_15b',
    'SavedFlea_Greymoor_06',
    'SavedFlea_Shellwood_03',
    'SavedFlea_Bone_East_10_Church',
    'SavedFlea_Coral_35',
    'SavedFlea_Dust_12',
    'SavedFlea_Dust_09',
    'SavedFlea_Belltown_04',
    'SavedFlea_Crawl_06',
    'SavedFlea_Slab_Cell',
    'SavedFlea_Shadow_28',
    'SavedFlea_Dock_03d',
    'SavedFlea_Under_23',
    'SavedFlea_Shadow_10',
    'SavedFlea_Song_14',
    'SavedFlea_Coral_24',
    'SavedFlea_Peak_05c',
    'SavedFlea_Library_09',
    'SavedFlea_Song_11',
    'SavedFlea_Library_01',
    'SavedFlea_Under_21',
    'SavedFlea_Slab_06'
]

// Function to extract target fields from playerData for table display
function extractFleaFields(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
        const playerData = data.playerData || {}
        
        return TARGET_FLEA_FIELDS.map(field => ({
            key: field,
            value: playerData.hasOwnProperty(field) 
                ? (playerData[field] ? 'true' : 'false')
                : 'n/a'
        }))
    } catch (err) {
        console.error('Error extracting flea fields:', err)
        return TARGET_FLEA_FIELDS.map(field => ({ key: field, value: 'n/a' }))
    }
}

// Function to update playerData based on table changes
function updateFleaFields(fieldsData, originalJsonData) {
    try {
        const data = typeof originalJsonData === 'string' ? JSON.parse(originalJsonData) : originalJsonData
        
        fieldsData.forEach(fieldData => {
            const { key, value } = fieldData
            if (TARGET_FLEA_FIELDS.includes(key)) {
                if (value.toLowerCase() === 'true') {
                    data.playerData[key] = true
                } else if (value.toLowerCase() === 'false') {
                    data.playerData[key] = false
                } else if (value.toLowerCase() === 'n/a') {
                    // Remove field if set to n/a
                    delete data.playerData[key]
                }
            }
        })
        
        return JSON.stringify(data, undefined, 2)
    } catch (err) {
        console.error('Error updating flea fields:', err)
        return originalJsonData
    }
}

class App extends React.Component {
    constructor(){
        super()
        this.fileInputRef = React.createRef()
        windowDrag.onDrop = e => this.handleFileChange(e.dataTransfer.files) 
        windowDrag.onDragEnter = () => this.setState({ dragging: true })
        windowDrag.onDragLeave = () => this.setState({ dragging: false })
    }
    state = {
        fleaFields: [], // Array of {key, value} objects for table display
        gameFileComplete: "", // Store the complete JSON data
        gameFileCompleteOriginal: "", // Store the original complete JSON data
        editing: false,
        dragging: false,
        switchMode: false 
    }
    handleFileClick = () => {
        this.fileInputRef.current.click()
    }
    handleFileChange = files => {
		if (files.length == 0){
			return 
		}
		
		let file = files[0]
		let reader = new FileReader()

		if (this.state.switchMode){
			reader.readAsText(file)
		} else {
			reader.readAsArrayBuffer(file)
		}

		reader.addEventListener("load", () => {
			var result = reader.result
			try {
				let decrypted = ""
				if (this.state.switchMode) {
					decrypted = result
				} else {
					decrypted = Decode(new Uint8Array(result))
				}
				var jsonString = JSON.stringify(JSON.parse(decrypted), undefined, 2)
				this.setGameFile(jsonString, file.name)
			} catch (err){
				window.alert("The file could not decrypted.")
				console.warn(err)
			} 
			this.fileInputRef.current.value = null
		})
    }
    handleFieldChange = (index, newValue) => {
        const updatedFields = this.state.fleaFields.slice()
        updatedFields[index] = Object.assign({}, updatedFields[index], { value: newValue })
        
        // Update state with new field values
        this.setState({ fleaFields: updatedFields })
        
        // Update the complete JSON with the changes
        const updatedCompleteJson = updateFleaFields(updatedFields, this.state.gameFileComplete)
        this.setState({ gameFileComplete: updatedCompleteJson })
    }
    handleReset = e => {
        const originalFields = extractFleaFields(this.state.gameFileCompleteOriginal)
        this.setState({
            fleaFields: originalFields,
            gameFileComplete: this.state.gameFileCompleteOriginal
        }) 
    }
    setGameFile = (jsonString, name) => {
        const completeJson = JSON.stringify(JSON.parse(jsonString), undefined, 2)
        const fleaFields = extractFleaFields(jsonString)
        
        this.setState({
            fleaFields: fleaFields,
            gameFileComplete: completeJson,
            gameFileCompleteOriginal: completeJson,
            gameFileName: name, 
            editing: true 
        })
    }
    render(){
        return <div id="wrapper">
            {this.state.dragging && <div id="cover"></div>}
            <p id="description">This online tool allows you to view and modify SavedFlea fields in a Hollow Knight save file.</p>
            <p id="source">You can view the source code in the <a href="https://github.com/bloodorca/hollow">github repo</a>.</p>
			<ul id="instructions">
                <li>Make a backup of your original file.</li>
                <li>Select or drag in the source save file you want to modify.</li>
                <li>Modify the SavedFlea values in the table below.</li>
            </ul>
			<div>
                <button id="file-button" onClick={this.handleFileClick}>Select File</button>
                <span>
                    <input checked={this.state.switchMode} onClick={e => this.setState({switchMode: !this.state.switchMode})} type="checkbox" id="switch-save"/>
                    <label style={{color: this.state.switchMode ? "inherit" : "#777"}} htmlFor="switch-save">Nintendo Switch Mode</label>
                </span>
            </div>
            <input onChange={e => { this.handleFileChange(this.fileInputRef.current.files) }} id="file-input"  ref={this.fileInputRef} type="file"/>
            {this.state.editing && (
                <div id="editor-wrapper">
                    <span id="editor-name">{this.state.gameFileName}</span>
                    <div id="flea-table-container">
                        <h3>SavedFlea Fields Status</h3>
                        <table id="flea-table">
                            <thead>
                                <tr>
                                    <th>Field Name</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.fleaFields.map((field, index) => (
                                    <tr key={field.key}>
                                        <td>{field.key}</td>
                                        <td>
                                            <select 
                                                value={field.value} 
                                                onChange={(e) => this.handleFieldChange(index, e.target.value)}
                                            >
                                                <option value="true">true</option>
                                                <option value="false">false</option>
                                                <option value="n/a">n/a</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div id="editor-buttons">
                        <button onClick={this.handleReset}>reset</button>
                    </div>
                </div>
            )}
        </div>
    }
}

ReactDOM.render(<App/>, document.querySelector("#root"))




