import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import { Encode, Decode, Hash, DownloadData, HumanTime } from "./functions.js"
import History from "./history.js"
import WindowDrag from "./windowDrag.js"
import "./style.css"

var history = new History()
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

// Function to extract and format target fields from playerData
function formatFleaFields(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
        const playerData = data.playerData || {}
        
        let formatted = "=== SavedFlea Fields Status ===\n\n"
        
        TARGET_FLEA_FIELDS.forEach(field => {
            let status = 'n/a'
            if (playerData.hasOwnProperty(field)) {
                status = playerData[field] ? 'true' : 'false'
            }
            formatted += `${field}: ${status}\n`
        })
        
        return formatted
    } catch (err) {
        console.error('Error formatting flea fields:', err)
        return "Error: Could not parse save file data"
    }
}

// Function to parse formatted flea fields back to playerData updates
function parseFleaFields(formattedText, originalJsonData) {
    try {
        const data = typeof originalJsonData === 'string' ? JSON.parse(originalJsonData) : originalJsonData
        const lines = formattedText.split('\n')
        
        lines.forEach(line => {
            const match = line.match(/^(SavedFlea_[^:]+):\s*(true|false|n\/a)$/i)
            if (match) {
                const [, fieldName, value] = match
                if (TARGET_FLEA_FIELDS.includes(fieldName)) {
                    if (value.toLowerCase() === 'true') {
                        data.playerData[fieldName] = true
                    } else if (value.toLowerCase() === 'false') {
                        data.playerData[fieldName] = false
                    } else if (value.toLowerCase() === 'n/a') {
                        // Remove field if set to n/a
                        delete data.playerData[fieldName]
                    }
                }
            }
        })
        
        return JSON.stringify(data, undefined, 2)
    } catch (err) {
        console.error('Error parsing flea fields:', err)
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
        gameFile: "", 
        gameFileOriginal: "",
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
				const formattedView = formatFleaFields(jsonString)
				const hash = Hash(formattedView)
				history.removeFromHistory(hash)
				history.addToHistory(formattedView, file.name, hash)
				history.syncToLocalStorage()
				this.setGameFile(jsonString, file.name)
			} catch (err){
				window.alert("The file could not decrypted.")
				console.warn(err)
			} 
			this.fileInputRef.current.value = null
		})
    }
    handleEditorChange = e => {
        const formattedText = e.target.value
        // Update the displayed formatted text
        this.setState({gameFile: formattedText})
        
        // Parse the formatted text back to complete JSON and store it
        const updatedCompleteJson = parseFleaFields(formattedText, this.state.gameFileComplete)
        this.setState({gameFileComplete: updatedCompleteJson})
    }
    handleReset = e => {
        this.setState({
            gameFile: this.state.gameFileOriginal,
            gameFileComplete: this.state.gameFileCompleteOriginal
        }) 
    }
	handleDownloadAsSwitchSave = e => {
		try {
            var data = JSON.stringify(JSON.parse(this.state.gameFileComplete))
            DownloadData(data, "plain.dat")
        } catch (err){
            window.alert("Could not parse valid JSON. Reset or fix.")
        }
    }
    handleDownload = e => {
        try {
            var data = JSON.stringify(JSON.parse(this.state.gameFileComplete))
            var encrypted = Encode(data)
            DownloadData(encrypted, "user1.dat")
        } catch (err){
            window.alert("Could not parse valid JSON. Reset or fix.")
        }
    }
    setGameFile = (jsonString, name) => {
        const completeJson = JSON.stringify(JSON.parse(jsonString), undefined, 2)
        const formattedView = formatFleaFields(jsonString)
        
        this.setState({
            gameFile: formattedView,
            gameFileOriginal: formattedView,
            gameFileComplete: completeJson,
            gameFileCompleteOriginal: completeJson,
            gameFileName: name, 
            editing: true 
        })
    }
    render(){
        return <div id="wrapper">
            {this.state.dragging && <div id="cover"></div>}
            <p id="description">This online tool allows you to modify a Hollow Knight save file. You can also use this to convert your PC save to and from a Switch save.</p>
            <p id="source">You can view the source code in the <a href="https://github.com/bloodorca/hollow">github repo</a>.</p>
			<ul id="instructions">
                <li>Make a backup of your original file.</li>
                <li>Select or drag in the source save file you want to modify.</li>
                <li>Modify your save file. Ctrl-F / Cmd-F is your best friend.</li>
                <li>Download your new modifed save file.</li>
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
                    <textarea id="editor" onChange={this.handleEditorChange} value={this.state.gameFile} spellCheck={false}></textarea>
                    <div id="editor-buttons">
                        <button onClick={this.handleReset}>reset</button>
                        <button onClick={this.handleDownloadAsSwitchSave}>download plain text (Switch)</button>
                        <button onClick={this.handleDownload}>download encrypted (PC)</button>
                    </div>
                </div>
            )}
            <HistoryComponent 
                handleClick={(jsonString, fileName) => this.setGameFile(jsonString, fileName)}
            />
        </div>
    }
}

class HistoryComponent extends React.Component {
    constructor(){
        super()
        history.onChange = () => {
            this.forceUpdate()
        }
    }
    render(){
        if (history.count() == 0) return null 
        return (
            <div id="history">
                <div>History</div>
                <div>Stores a limited amount of recent files. Do not use this as an alternative to making backups.</div>
                <ul>
                    {history.history.map(item => (
                        <li 
                            key={item.hash}
                            onClick={() => {
                                this.props.handleClick(item.jsonString, item.fileName)
                                window.scrollTo(0, 0)
                            }} 
                            onContextMenu={e => { 
                                history.removeFromHistory(item.hash); 
                                e.preventDefault(); 
                                history.syncToLocalStorage()
                            }} 
                            className="history-item"
                        >
                            <div className="history-name">HASH {item.hash}</div>
                            <div className="history-date">{HumanTime(item.date)}</div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}



ReactDOM.render(<App/>, document.querySelector("#root"))




