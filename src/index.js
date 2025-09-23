import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import { Decode } from "./functions.js"
import WindowDrag from "./windowDrag.js"
import "./style.css"

var windowDrag = new WindowDrag()

// Map Genie location IDs for flea fields (to be populated with actual IDs)
const FLEA_MAPGENIE_IDS = {
    'SavedFlea_Ant_03': '',
    'SavedFlea_Belltown_04': '',
    'SavedFlea_Bone_06': '477890',
    'SavedFlea_Bone_East_05': '477916',
    'SavedFlea_Bone_East_10_Church': '478219',
    'SavedFlea_Bone_East_17b': '',
    'SavedFlea_Coral_24': '478386',
    'SavedFlea_Coral_35': '',
    'SavedFlea_Crawl_06': '478450',
    'SavedFlea_Dock_03d': '',
    'SavedFlea_Dock_16': '477907',
    'SavedFlea_Dust_09': '478378',
    'SavedFlea_Dust_12': '',
    'SavedFlea_Greymoor_06': '478287',
    'SavedFlea_Greymoor_15b': '478145',
    'SavedFlea_Library_01': '478402',
    'SavedFlea_Library_09': '478404',
    'SavedFlea_Peak_05c': '478380',
    'SavedFlea_Shadow_10': '478408',
    'SavedFlea_Shadow_28': '478443',
    'SavedFlea_Shellwood_03': '478176',
    'SavedFlea_Slab_06': '478392',
    'SavedFlea_Slab_Cell': '',
    'SavedFlea_Song_11': '478416',
    'SavedFlea_Song_14': '',
    'SavedFlea_Under_21': '478420',
    'SavedFlea_Under_23': '478419',
}

// List of specific SavedFlea fields to display
const TARGET_FLEA_FIELDS = Object.keys(FLEA_MAPGENIE_IDS)

// Function to extract target fields from playerData for table display
function extractFleaFields(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
        const playerData = data.playerData || {}
        
        const fields = TARGET_FLEA_FIELDS.map(field => {
            const hasField = playerData.hasOwnProperty(field)
            const value = hasField ? (playerData[field] ? '✓' : '✗') : 'n/a'
            const mapGenieId = FLEA_MAPGENIE_IDS[field]
            
            return {
                key: field,
                value: value,
                mapGenieId: mapGenieId,
                found: hasField && playerData[field],
                missing: hasField && !playerData[field]
            }
        })
        
        // Check if this is a valid Silksong save file
        const foundFields = fields.filter(f => f.value !== 'n/a')
        const isValidSilksongSave = foundFields.length > 0
        
        return {
            fields: fields,
            isValidSilksongSave: isValidSilksongSave,
            foundCount: foundFields.length
        }
    } catch (err) {
        console.error('Error extracting flea fields:', err)
        return {
            fields: TARGET_FLEA_FIELDS.map(field => ({ 
                key: field, 
                value: 'n/a',
                mapGenieId: FLEA_MAPGENIE_IDS[field],
                found: false,
                missing: false
            })),
            isValidSilksongSave: false,
            foundCount: 0
        }
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
        fleaData: null, // Store the result from extractFleaFields
        gameFileComplete: "", // Store the complete JSON data
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

    setGameFile = (jsonString, name) => {
        const completeJson = JSON.stringify(JSON.parse(jsonString), undefined, 2)
        const fleaData = extractFleaFields(jsonString)
        
        this.setState({
            fleaData: fleaData,
            gameFileComplete: completeJson,
            gameFileName: name, 
            editing: true 
        })
    }
    
    renderMissingFleaSummary = () => {
        if (!this.state.fleaData || !this.state.fleaData.isValidSilksongSave) return null
        
        // Get missing fleas that have known Map Genie IDs
        const missingFleasWithIds = this.state.fleaData.fields
            .filter(field => field.missing && field.mapGenieId)
            .map(field => field.mapGenieId)
        
        if (missingFleasWithIds.length === 0) return null
        
        const missingFleaUrl = `https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=${missingFleasWithIds.join(',')}`
        
        return (
            <div id="missing-flea-summary" style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#fff3e0',
                border: '1px solid #ff9800',
                borderRadius: '4px'
            }}>
                <h4 style={{margin: '0 0 8px 0', color: '#e65100'}}>Missing Fleas with Known Locations</h4>
                <p style={{margin: '0 0 12px 0'}}>
                    You have {missingFleasWithIds.length} missing flea(s) with known map locations.
                </p>
                <a 
                    href={missingFleaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: '#ff9800',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    🗺️ View All Missing Locations
                </a>
            </div>
        )
    }
    
    render(){
        return <div id="wrapper">
            {this.state.dragging && <div id="cover"></div>}
            <p id="description">This online tool is a Silksong flea location helper that allows you to view SavedFlea fields in a Hollow Knight: Silksong save file.</p>
            
            <div className="info-section">
                <p id="source">You can view the source code in the <a href="https://github.com/mikkerlo/silksong-flea">GitHub repository</a>.</p>
                <p id="original-source">This code is based on the <a href="https://bloodorca.github.io/hollow/">Hollow Knight save file editor</a>. If you need a save file editor, you can use the original tool as well.</p>
            </div>
            
            <p id="edit">If you want to share mappings from save file field names to MapGenie locations, you are welcome to do so! Please use <a href="https://docs.google.com/forms/d/e/1FAIpQLSdvRIFSdAP6vc_q9mZIZK-sa2hB3YEk44mh-0_bgkTTuaafUA/viewform?fbzx=-6146904633074299976">this form</a> to contribute.</p>
            
            <ul id="instructions">
                <li>Select or drag in the Silksong save file you want to analyze.</li>
                <li>View the SavedFlea collection status and map locations in the table below.</li>
            </ul>
			<div>
                <button id="file-button" onClick={this.handleFileClick}>Select File</button>
                <span>
                    <input checked={this.state.switchMode} onClick={e => this.setState({switchMode: !this.state.switchMode})} type="checkbox" id="switch-save"/>
                    <label style={{color: this.state.switchMode ? "inherit" : "#777"}} htmlFor="switch-save">Nintendo Switch Mode</label>
                </span>
            </div>
            <input onChange={e => { this.handleFileChange(this.fileInputRef.current.files) }} id="file-input"  ref={this.fileInputRef} type="file"/>
            {this.state.editing && this.state.fleaData && (
                <div id="editor-wrapper">
                    <span id="editor-name">{this.state.gameFileName}</span>
                    {!this.state.fleaData.isValidSilksongSave ? (
                        <div id="error-message" style={{
                            backgroundColor: '#ffebee',
                            border: '1px solid #f44336',
                            borderRadius: '4px',
                            padding: '16px',
                            margin: '16px 0',
                            color: '#c62828'
                        }}>
                            <strong>⚠️ This does not appear to be a valid Silksong save file or the file may be corrupted.</strong>
                            <br/>
                            No SavedFlea fields were found in the save data.
                        </div>
                    ) : (
                        <Fragment>
                            <div id="flea-table-container">
                                <h3>SavedFlea Fields Status</h3>
                                <table id="flea-table">
                                    <thead>
                                        <tr>
                                            <th>Save file field name</th>
                                            <th>Status</th>
                                            <th>Map Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.fleaData.fields.map((field, index) => (
                                            <tr key={field.key}>
                                                <td>{field.key}</td>
                                                <td style={{textAlign: 'center', fontSize: '1.2em'}}>
                                                    {field.value}
                                                </td>
                                                <td style={{textAlign: 'center'}}>
                                                    {field.mapGenieId ? (
                                                        <a 
                                                            href={`https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=${field.mapGenieId}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                color: '#1976d2',
                                                                textDecoration: 'none'
                                                            }}
                                                        >
                                                            🗺️ View
                                                        </a>
                                                    ) : (
                                                        <span style={{color: '#999'}}>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {this.renderMissingFleaSummary()}
                        </Fragment>
                    )}
                </div>
            )}
        </div>
    }
}

ReactDOM.render(<App/>, document.querySelector("#root"))




