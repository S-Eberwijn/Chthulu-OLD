
document.getElementById("fileElem").addEventListener("change", handleFiles, false);
document.getElementById("fileElem").addEventListener("dragover", (e)=>{
	e.preventDefault();
});
document.getElementById("closeButtonMap").addEventListener("click", (e)=>{
	e.preventDefault();
	resetPage();
});
let mapUrl = ""

ondrop = (e) => {
	e.preventDefault();
	let file = document.getElementById('fileElem').files[0];
	uploadMapImage(file);
};

function handleFiles(e) {
	e.preventDefault();
	let file = document.getElementById('fileElem').files[0];
	uploadMapImage(file);
}

function showModal(){
	uploadMapModal.style.display = "block";
	modalBackgroundMap.style.display = "block";
}

function resetPage(){
	uploadMapModal.style.display = "none";
	modalBackgroundMap.style.display = "none";
	document.getElementById("fileElem").dataset.content = " Upload file";
}

function uploadMapImage(file){
    let reader = new FileReader();
    reader.onloadend = function() {
		setTimeout(() => {
			try {
				axios.post(`/dashboard/${guildID}/informational/mapImage`, {
					"file": reader.result,
					"fileName": file.name
				}).then(response => {
					if (response.status === 200) {
						mapUrl = response.data;
						document.getElementById("fileElem").dataset.content = "👍 file uploaded successfully";
						pushNotify('success', 'Map creation', 'Map uploaded successfully, please add some details about the map!');
						showModal();
					} else {
						console.log("Something went wrong!; ERROR STATUS: " + response.status);
					}
				}).catch((err) => {
					console.log(err)
					pushNotify('error', 'Map creation', 'Something went wrong!')
	
				})
			} catch (error) {
				console.log(error);
				console.log("error occured during create");
			}
		}, 250);
    }
    reader.readAsDataURL(file);
	
}

function createMapEntry(){
	let title = document.getElementById("map_title").value;
	let description = document.getElementById("map_description").value;
	try {
		axios.post(`/dashboard/${guildID}/informational/createMap`, {
			"map_url": mapUrl,
			"title": title,
			"description": description
		}).then(response => {
			if (response.status === 200) {
				console.log("request handled successfully", response);
				pushNotify('success', 'Map creation', 'Map created successfully!');
				resetPage();
			} else {
				console.log("Something went wrong!; ERROR STATUS: " + response.status);
			}
		}).catch((err) => {
			console.log(err)
			pushNotify('error', 'Map creation', 'Something went wrong!')
		})
	} catch (error) {
		console.log(error);
		console.log("error occured during create");
	}

}

function updateInput(){
	let title = document.getElementById("map_title").value;
	let description = document.getElementById("map_description").value;

	if(title.length > 1 && description.length > 1){
		document.getElementById("upload_map").disabled = false;
	}
}