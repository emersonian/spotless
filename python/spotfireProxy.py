import json

spotlessProxy = Document.Properties["spotlessProxy"]

if spotlessProxy:
	data = json.loads(spotlessProxy)
	print(data)
	if ("action" in data):
		# Show a debug MessageBox
		if data["action"] == "msg" and "text" in data:
			import clr
			clr.AddReference("System.Windows.Forms")
			from System.Windows.Forms import MessageBox
			MessageBox.Show(data["text"])
		# Set Document Properties
		if data["action"] == "setProps" and "props" in data:
			for key, value in data["props"].items():
				Document.Properties[key] = value
		# Call an IronPython function
		if data["action"] == "call" and "function" in data:
			from System.Collections.Generic import Dictionary
			from Spotfire.Dxp.Application.Scripting import ScriptDefinition, ScriptParameterType as type

			found, scriptDef = Document.ScriptManager.TryGetScript(data["function"])
			visual = Document.ActivePageReference.ActiveVisualReference
			if found:
				if "params" in data:
					Document.ScriptManager.ExecuteScript(scriptDef, data["params"])
				else:
					Document.ScriptManager.ExecuteScript(scriptDef, {})
else:
	print("No data passed to spotlessProxy.")
